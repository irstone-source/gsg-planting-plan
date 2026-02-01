'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function StickyPricingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user has dismissed before
    const dismissed = localStorage.getItem('sticky-cta-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const scrollPercentage = (scrollPosition / scrollHeight) * 100;

      // Show after 50% scroll
      if (scrollPercentage > 50) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('sticky-cta-dismissed', 'true');
  };

  const handleCTA = () => {
    router.push('/pricing');
  };

  if (isDismissed || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-dark/95 backdrop-blur-md border-t-2 border-copper shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 text-center md:text-left">
              <p className="text-lg font-bold text-mist mb-1">
                Like what you see? Get your own plan in 3 minutes.
              </p>
              <p className="text-sm text-stone">
                £79 one-time • No subscription • Plans saved forever • 95%+ botanical accuracy
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCTA}
                className="bg-copper text-dark px-8 py-3 text-sm uppercase tracking-wider font-bold hover:bg-[#D4A373] transition-colors"
              >
                See if this is worth £79 →
              </button>

              <button
                onClick={handleDismiss}
                aria-label="Dismiss"
                className="text-stone hover:text-mist transition-colors p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
