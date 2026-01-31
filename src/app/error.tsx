'use client';

import { useEffect } from 'react';
import { MagneticButton } from '@/components/architectural';

export default function Error({
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
    <div className="min-h-screen bg-dark text-mist flex items-center justify-center">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Error Icon */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto border-4 border-copper/30 relative">
              <div className="absolute inset-2 bg-copper/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl text-copper">!</span>
              </div>
              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-l-4 border-t-4 border-copper"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 border-r-4 border-t-4 border-copper"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-4 border-b-4 border-copper"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-4 border-b-4 border-copper"></div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-4">
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold text-mist">
              SOMETHING WENT WRONG
            </h2>
            <p className="text-lg text-stone max-w-lg mx-auto">
              We encountered an unexpected error. This has been logged and we'll look into it.
            </p>
            {error.digest && (
              <p className="text-xs font-mono text-stone/60">
                Error ID: {error.digest}
              </p>
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <MagneticButton
              onClick={reset}
              variant="copper"
            >
              TRY AGAIN
            </MagneticButton>
            <MagneticButton href="/" variant="ghost">
              RETURN HOME
            </MagneticButton>
          </div>
        </div>
      </div>
    </div>
  );
}
