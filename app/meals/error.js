'use client';

export default function Error({ error, reset }) {
  return (
    <main className="error">
      <h1>An error occurred!</h1>
      <p>{error?.message || 'Failed to fetch meal data. Please try again later.'}</p>
      {reset && (
        <button onClick={() => reset()} type="button">
          Try Again
        </button>
      )}
    </main>
  );
}