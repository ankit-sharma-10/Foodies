import Image from 'next/image';
import { notFound } from 'next/navigation';

import { getMeal, getMeals } from '@/lib/meals';
import classes from './page.module.css';

export async function generateStaticParams() {
  const meals = await getMeals();
  return meals.map((meal) => ({
    mealSlug: meal.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { mealSlug } = await params;
  const meal = getMeal(mealSlug);

  if (!meal) {
    return {
      title: 'Meal Not Found',
    };
  }

  return {
    title: meal.title,
    description: meal.summary,
  };
}

export default async function MealDetailsPage({ params }) {
  const { mealSlug } = await params;
  const meal = getMeal(mealSlug);

  if (!meal) {
    notFound();
  }

  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image
            src={meal.image}
            alt={meal.title}
            fill
            sizes="(max-width: 768px) 100vw, 30rem"
          />
        </div>
        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={classes.summary}>{meal.summary}</p>
        </div>
      </header>
      <main>
        <p className={classes.instructions}>{meal.instructions}</p>
      </main>
    </>
  );
}