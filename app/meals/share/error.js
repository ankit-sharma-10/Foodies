'use client';

export default function Error({ error, reset }) {
  return (
    <main className="error">
      <h1>An error occurred!</h1>
      <p>{error?.message || 'Failed to create meal. Please check your input and try again.'}</p>
      {reset && (
        <button onClick={() => reset()} type="button">
          Try Again
        </button>
      )}
    </main>
  );
}