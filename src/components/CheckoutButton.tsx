'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface CheckoutButtonProps {
  tier: 'diy' | 'pro';
  price: number;
  label?: string;
}

export function CheckoutButton({ tier, price, label }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      // Get user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        // Redirect to login if not authenticated
        router.push('/auth/login?redirect=/pricing');
        return;
      }

      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ tier }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        aria-busy={loading}
        className="w-full bg-copper text-dark py-4 px-6 text-sm uppercase tracking-wider font-bold hover:bg-[#D4A373] focus:ring-2 focus:ring-copper/50 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'PROCESSING...' : label || `BUY ${tier.toUpperCase()} - £${price}`}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
