import ShareMealForm from '@/components/meals/share-meal-form';
import classes from './page.module.css';

export const metadata = {
  title: 'Share a Meal',
  description: 'Share your favorite meal and recipe with our food-loving community.',
};

export default function ShareMealPage() {
  return (
    <>
      <header className={classes.header}>
        <h1>
          Share your <span className={classes.highlight}>favorite meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
      </header>
      <main className={classes.main}>
        <ShareMealForm />
      </main>
    </>
  );
}