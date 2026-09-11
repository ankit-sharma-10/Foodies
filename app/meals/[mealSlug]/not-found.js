import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>Meal not found</h1>
      <p>Unfortunately, we could not find the requested meal or recipe data.</p>
      <Link href="/meals">Back to All Meals</Link>
    </main>
  );
}