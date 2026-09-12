import sql from 'better-sqlite3';
import fs from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';
import slugify from 'slugify';
import xss from 'xss';
import { v2 as cloudinary } from 'cloudinary';

const db = sql('meals.db');

// Ensure the meals table exists on startup even if meals.db has not been seeded yet
db.prepare(`
  CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    image TEXT NOT NULL,
    summary TEXT NOT NULL,
    instructions TEXT NOT NULL,
    creator TEXT NOT NULL,
    creator_email TEXT NOT NULL
  )
`).run();

function isCloudinaryConfigured() {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({ secure: true });
    return true;
  }
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    return true;
  }
  return false;
}

export async function getMeals() {
  return db.prepare('SELECT * FROM meals').all();
}

export const getMeal = cache((slug) => {
  // Use parameterized query to avoid SQL injection attacks and cache() to dedupe RSC calls.
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
});

export async function saveMeal(meal) {
  let slug = slugify(meal.title, { lower: true });

  // Prevent unique constraint collision on duplicate titles
  const existingMeal = db.prepare('SELECT id FROM meals WHERE slug = ?').get(slug);
  if (existingMeal) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  meal.slug = slug;
  meal.instructions = xss(meal.instructions);

  const bufferedImage = await meal.image.arrayBuffer();
  const buffer = Buffer.from(bufferedImage);
  const useCloudinary = isCloudinaryConfigured();
  let localFilepath = null;

  if (useCloudinary) {
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'foodies',
          public_id: meal.slug,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
          } else {
            resolve(result);
          }
        }
      );
      stream.end(buffer);
    });

    meal.image = uploadResult.secure_url;
  } else {
    // Local filesystem storage fallback when Cloudinary is not configured
    const extension = (meal.image.name.split('.').pop() || 'jpg').toLowerCase();
    const filename = `${meal.slug}.${extension}`;
    localFilepath = path.join('public', 'images', filename);

    await fs.writeFile(localFilepath, buffer);
    meal.image = `/images/${filename}`;
  }

  try {
    db.prepare(
      `
          INSERT INTO meals (title, summary, instructions, image, creator, creator_email, slug)
          VALUES (@title, @summary, @instructions, @image, @creator, @creator_email, @slug)
      `
    ).run(meal);
  } catch (error) {
    // Roll back uploaded asset on database failure
    if (localFilepath) {
      await fs.unlink(localFilepath).catch(() => {});
    } else if (useCloudinary) {
      await cloudinary.uploader.destroy(`foodies/${meal.slug}`).catch(() => {});
    }
    throw error;
  }
}
