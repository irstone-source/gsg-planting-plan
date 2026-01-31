'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body>
        <div className="min-h-screen bg-dark text-mist flex items-center justify-center">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="space-y-4">
                <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold text-mist">
                  CRITICAL ERROR
                </h2>
                <p className="text-lg text-stone max-w-lg mx-auto">
                  A critical error occurred. Please refresh the page or contact support if this persists.
                </p>
                {error.digest && (
                  <p className="text-xs font-mono text-stone/60">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                <button
                  onClick={reset}
                  className="px-8 py-4 bg-copper text-dark text-sm uppercase tracking-wider font-bold hover:bg-[#D4A373] transition-colors"
                >
                  TRY AGAIN
                </button>
                <a
                  href="/"
                  className="px-8 py-4 border border-white/10 text-mist text-sm uppercase tracking-wider font-bold hover:border-copper hover:text-copper transition-colors"
                >
                  RETURN HOME
                </a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
