'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMagicLink = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    // Create client dynamically to avoid build-time errors
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 max-w-md">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="text-center mb-6">
                <Link href="/" className="inline-flex items-center gap-2">
                  <Sparkles className="h-8 w-8 text-green-600" />
                  <span className="text-2xl font-bold text-green-900">PlantingPlans</span>
                </Link>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                <h2 className="text-2xl font-bold">Check your email</h2>
                <p className="text-gray-600">
                  We sent a magic link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  Click the link in the email to sign in. The link expires in 1 hour.
                </p>

                <Button
                  variant="ghost"
                  onClick={() => { setSent(false); setEmail(''); }}
                  className="mt-4"
                >
                  Use a different email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 max-w-md">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="text-center mb-6">
              <Link href="/" className="inline-flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold text-green-900">PlantingPlans</span>
              </Link>
            </div>

            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">Sign in to your account</h2>
              <p className="text-gray-600">Enter your email for a magic link</p>
            </div>

            <div className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMagicLink()}
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 text-center">
                  {error}
                </div>
              )}

              <Button
                onClick={sendMagicLink}
                disabled={loading || !email}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </Button>

              <p className="text-xs text-center text-gray-500">
                No password required. We will send you a secure link to sign in.
              </p>

              <div className="pt-4 text-center text-sm text-gray-600">
                Don&apos;t have an account? Magic links work for new users too!
              </div>

              <div className="pt-2 text-center">
                <Link href="/" className="text-sm text-green-600 hover:underline">
                  ← Back to home
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
