import sql from 'better-sqlite3';
import fs from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';
import slugify from 'slugify';
import xss from 'xss';

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

  const extension = (meal.image.name.split('.').pop() || 'jpg').toLowerCase();
  const filename = `${meal.slug}.${extension}`;
  const filepath = path.join('public', 'images', filename);

  const bufferedImage = await meal.image.arrayBuffer();
  await fs.writeFile(filepath, Buffer.from(bufferedImage));

  meal.image = `/images/${filename}`;

  try {
    db.prepare(
      `
          INSERT INTO meals (title, summary, instructions, image, creator, creator_email, slug)
          VALUES (@title, @summary, @instructions, @image, @creator, @creator_email, @slug)
      `
    ).run(meal);
  } catch (error) {
    // Roll back written file on database failure to prevent orphan files
    await fs.unlink(filepath).catch(() => {});
    throw error;
  }
}
