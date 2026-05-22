'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[global] error:', error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-4 max-w-md px-4">
          <h1 className="text-3xl font-bold">Oops</h1>
          <p className="text-muted-foreground">
            A critical error occurred. Please refresh the page or go home.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Try again
            </button>
            <Link
              href="/"
              className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
