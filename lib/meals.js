import sql from "better-sqlite3";
import fs from "node:fs";
import slugify from "slugify";
import xss from "xss";
const db = sql("meals.db");

export async function getMeals() {
  return db.prepare('SELECT * FROM meals').all();
}

export function getMeal(slug) {
  // don't write slug in the SQL query directly to avoid SQL injection attacks. Use a parameterized query instead.
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  const filename = `${meal.slug}.${extension}`;

  const stream = fs.createWriteStream(`public/images/${filename}`);
  const bufferedImage = await meal.image.arrayBuffer();
  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error("Failed to save image");
    }
  });

  meal.image = `/images/${filename}`;

  db.prepare(
    `
        INSERT INTO meals (title, summary, instructions, image, creator, creator_email, slug)
        VALUES (@title, @summary, @instructions, @image, @creator, @creator_email, @slug)
    `,
  ).run(meal);
}
