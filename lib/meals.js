import sql from 'better-sqlite3';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { cache } from 'react';
import slugify from 'slugify';
import xss from 'xss';
import { v2 as cloudinary } from 'cloudinary';

const DEFAULT_MEALS = [
  {
    title: 'Juicy Cheese Burger',
    slug: 'juicy-cheese-burger',
    image: 'https://res.cloudinary.com/a1rxstx7/image/upload/v1789219705/foodies/burger.jpg',
    summary:
      'A mouth-watering burger with a juicy beef patty and melted cheese, served in a soft bun.',
    instructions: `
      1. Prepare the patty:
         Mix 200g of ground beef with salt and pepper. Form into a patty.

      2. Cook the patty:
         Heat a pan with a bit of oil. Cook the patty for 2-3 minutes each side, until browned.

      3. Assemble the burger:
         Toast the burger bun halves. Place lettuce and tomato on the bottom half. Add the cooked patty and top with a slice of cheese.

      4. Serve:
         Complete the assembly with the top bun and serve hot.
    `,
    creator: 'John Doe',
    creator_email: 'johndoe@example.com',
  },
  {
    title: 'Spicy Curry',
    slug: 'spicy-curry',
    image: 'https://res.cloudinary.com/a1rxstx7/image/upload/v1789219705/foodies/curry.jpg',
    summary:
      'A rich and spicy curry, infused with exotic spices and creamy coconut milk.',
    instructions: `
      1. Chop vegetables:
         Cut your choice of vegetables into bite-sized pieces.

      2. Sauté vegetables:
         In a pan with oil, sauté the vegetables until they start to soften.

      3. Add curry paste:
         Stir in 2 tablespoons of curry paste and cook for another minute.

      4. Simmer with coconut milk:
         Pour in 500ml of coconut milk and bring to a simmer. Let it cook for about 15 minutes.

      5. Serve:
         Enjoy this creamy curry with rice or bread.
    `,
    creator: 'Max Schwarz',
    creator_email: 'max@example.com',
  },
  {
    title: 'Homemade Dumplings',
    slug: 'homemade-dumplings',
    image: 'https://res.cloudinary.com/a1rxstx7/image/upload/v1789219705/foodies/dumplings.jpg',
    summary:
      'Tender dumplings filled with savory meat and vegetables, steamed to perfection.',
    instructions: `
      1. Prepare the filling:
         Mix minced meat, shredded vegetables, and spices.

      2. Fill the dumplings:
         Place a spoonful of filling in the center of each dumpling wrapper. Wet the edges and fold to seal.

      3. Steam the dumplings:
         Arrange dumplings in a steamer. Steam for about 10 minutes.

      4. Serve:
         Enjoy these dumplings hot, with a dipping sauce of your choice.
    `,
    creator: 'Emily Chen',
    creator_email: 'emilychen@example.com',
  },
  {
    title: 'Classic Mac n Cheese',
    slug: 'classic-mac-n-cheese',
    image: 'https://res.cloudinary.com/a1rxstx7/image/upload/v1789219705/foodies/macncheese.jpg',
    summary:
      "Creamy and cheesy macaroni, a comforting classic that's always a crowd-pleaser.",
    instructions: `
      1. Cook the macaroni:
         Boil macaroni according to package instructions until al dente.

      2. Prepare cheese sauce:
         In a saucepan, melt butter, add flour, and gradually whisk in milk until thickened. Stir in grated cheese until melted.

      3. Combine:
         Mix the cheese sauce with the drained macaroni.

      4. Bake:
         Transfer to a baking dish, top with breadcrumbs, and bake until golden.

      5. Serve:
         Serve hot, garnished with parsley if desired.
    `,
    creator: 'Laura Smith',
    creator_email: 'laurasmith@example.com',
  },
  {
    title: 'Authentic Pizza',
    slug: 'authentic-pizza',
    image: 'https://res.cloudinary.com/a1rxstx7/image/upload/v1789219705/foodies/pizza.jpg',
    summary:
      'Hand-tossed pizza with a tangy tomato sauce, fresh toppings, and melted cheese.',
    instructions: `
      1. Prepare the dough:
         Knead pizza dough and let it rise until doubled in size.

      2. Shape and add toppings:
         Roll out the dough, spread tomato sauce, and add your favorite toppings and cheese.

      3. Bake the pizza:
         Bake in a preheated oven at 220°C for about 15-20 minutes.

      4. Serve:
         Slice hot and enjoy with a sprinkle of basil leaves.
    `,
    creator: 'Mario Rossi',
    creator_email: 'mariorossi@example.com',
  },
  {
    title: 'Wiener Schnitzel',
    slug: 'wiener-schnitzel',
    image: 'https://res.cloudinary.com/a1rxstx7/image/upload/v1789219705/foodies/schnitzel.jpg',
    summary:
      'Crispy, golden-brown breaded veal cutlet, a classic Austrian dish.',
    instructions: `
      1. Prepare the veal:
         Pound veal cutlets to an even thickness.

      2. Bread the veal:
         Coat each cutlet in flour, dip in beaten eggs, and then in breadcrumbs.

      3. Fry the schnitzel:
      Heat oil in a pan and fry each schnitzel until golden brown on both sides.

      4. Serve:
      Serve hot with a slice of lemon and a side of potato salad or greens.
    `,
    creator: 'Franz Huber',
    creator_email: 'franzhuber@example.com',
  },
  {
    title: 'Fresh Tomato Salad',
    slug: 'fresh-tomato-salad',
    image: 'https://res.cloudinary.com/a1rxstx7/image/upload/v1789219705/foodies/tomato-salad.jpg',
    summary:
      'A light and refreshing salad with ripe tomatoes, fresh basil, and a tangy vinaigrette.',
    instructions: `
      1. Prepare the tomatoes:
        Slice fresh tomatoes and arrange them on a plate.
    
      2. Add herbs and seasoning:
         Sprinkle chopped basil, salt, and pepper over the tomatoes.
    
      3. Dress the salad:
         Drizzle with olive oil and balsamic vinegar.
    
      4. Serve:
         Enjoy this simple, flavorful salad as a side dish or light meal.
    `,
    creator: 'Sophia Green',
    creator_email: 'sophiagreen@example.com',
  },
  {
    title: 'Paneer Butter Masala',
    slug: 'paneer-butter-masala',
    image: 'https://res.cloudinary.com/a1rxstx7/image/upload/v1789219704/foodies/paneer-butter-masala.jpg',
    summary: 'Blend of tomatoes onion and cottage cheese',
    instructions: 'Prepare Gravy then prepare the dish',
    creator: 'Ankit',
    creator_email: 'ankit1357951@gmail.com',
  },
];

let _db = null;

function seedDefaultMeals(database) {
  const stmt = database.prepare(`
    INSERT INTO meals (slug, title, image, summary, instructions, creator, creator_email)
    VALUES (@slug, @title, @image, @summary, @instructions, @creator, @creator_email)
  `);

  for (const meal of DEFAULT_MEALS) {
    stmt.run(meal);
  }
}

function getDatabase() {
  // In serverless environments (Vercel, AWS Lambda), the root filesystem (/var/task) is strictly read-only.
  // We locate the SQLite database in the OS temp directory (os.tmpdir()), copying the bundled database if needed.
  const isServerless = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT
  );

  const dbPath = isServerless
    ? path.join(os.tmpdir(), 'meals.db')
    : path.join(process.cwd(), 'meals.db');

  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  if (isServerless && !fs.existsSync(dbPath)) {
    const sourceDbPath = path.join(process.cwd(), 'meals.db');
    if (fs.existsSync(sourceDbPath)) {
      try {
        fs.copyFileSync(sourceDbPath, dbPath);
      } catch (copyErr) {
        console.warn('Could not copy bundled meals.db to temp directory:', copyErr);
      }
    }
  }

  const database = sql(dbPath);

  // Ensure table schema exists
  database.prepare(`
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

  // Auto-seed if database contains 0 meals
  const rowCount = database.prepare('SELECT COUNT(*) as count FROM meals').get();
  if (!rowCount || rowCount.count === 0) {
    seedDefaultMeals(database);
  }

  return database;
}

function getDb() {
  if (!_db) {
    _db = getDatabase();
  }
  return _db;
}

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
  return getDb().prepare('SELECT * FROM meals').all();
}

export const getMeal = cache((slug) => {
  // Use parameterized query to avoid SQL injection attacks and cache() to dedupe RSC calls.
  return getDb().prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
});

export async function saveMeal(meal) {
  const db = getDb();
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

    await fsp.writeFile(localFilepath, buffer);
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
      await fsp.unlink(localFilepath).catch(() => {});
    } else if (useCloudinary) {
      await cloudinary.uploader.destroy(`foodies/${meal.slug}`).catch(() => {});
    }
    throw error;
  }
}
