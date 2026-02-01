'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

interface WelcomeBannerProps {
  credits: number;
  vaultSlots: number;
  tier: 'diy' | 'pro';
  expiresAt: string;
}

export function PostPurchaseWelcome({ credits, vaultSlots, tier, expiresAt }: WelcomeBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only show if:
    // 1. URL has ?success=true (just completed purchase)
    // 2. User hasn't dismissed before
    const justPurchased = searchParams.get('success') === 'true';
    const hasSeenWelcome = localStorage.getItem('has-seen-welcome');

    if (justPurchased && !hasSeenWelcome) {
      setIsVisible(true);
      localStorage.setItem('has-seen-welcome', 'true');
    }
  }, [searchParams]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleCreatePlan = () => {
    router.push('/create?source=welcome-banner');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  const expiryDate = new Date(expiresAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-gradient-to-r from-moss/40 to-copper/20 border-2 border-copper/60 p-8 mb-8 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-copper rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-moss rounded-full blur-3xl" />
      </div>

      <button
        onClick={handleDismiss}
        aria-label="Dismiss welcome message"
        className="absolute top-4 right-4 text-stone hover:text-mist transition-colors p-2"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="relative">
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-copper/20 p-3 rounded-lg">
            <Sparkles className="h-8 w-8 text-copper" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider font-bold text-mist mb-2">
              Welcome to PlantingPlans! 🎉
            </h2>
            <p className="text-lg text-stone leading-relaxed">
              Your {tier.toUpperCase()} activation pass is now active. Here's what you have:
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-dark/40 border border-white/10 p-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="h-5 w-5 text-moss" aria-hidden="true" />
              <span className="text-sm uppercase tracking-wider text-stone">Plan Credits</span>
            </div>
            <p className="text-3xl font-bold text-mist">{credits}</p>
            <p className="text-xs text-stone mt-1">Generate complete planting plans</p>
          </div>

          <div className="bg-dark/40 border border-white/10 p-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="h-5 w-5 text-moss" aria-hidden="true" />
              <span className="text-sm uppercase tracking-wider text-stone">Vault Slots</span>
            </div>
            <p className="text-3xl font-bold text-mist">{vaultSlots}</p>
            <p className="text-xs text-stone mt-1">Save plans permanently (forever access)</p>
          </div>

          <div className="bg-dark/40 border border-white/10 p-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="h-5 w-5 text-moss" aria-hidden="true" />
              <span className="text-sm uppercase tracking-wider text-stone">Access Until</span>
            </div>
            <p className="text-xl font-bold text-mist">{expiryDate}</p>
            <p className="text-xs text-stone mt-1">3 months to create and save plans</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleCreatePlan}
            className="flex-1 bg-copper text-dark py-4 px-6 text-sm uppercase tracking-wider font-bold hover:bg-[#D4A373] transition-colors"
          >
            Create Your First Plan Now →
          </button>

          <a
            href="/examples/hub"
            className="flex-1 bg-dark/50 border border-white/20 text-mist py-4 px-6 text-sm uppercase tracking-wider font-bold hover:border-copper hover:text-copper transition-colors text-center"
          >
            Browse Examples First
          </a>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-sm text-stone leading-relaxed">
            <strong className="text-mist">Pro tip:</strong> Start by creating your first plan to get familiar with the system.
            You can regenerate as many times as you need within your credit limit. Once you're happy, save it to your vault for permanent access.
          </p>
        </div>
      </div>
    </div>
  );
}
