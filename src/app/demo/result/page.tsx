'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header, Footer, RevealSection } from '@/components/architectural';
import { Sparkles, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

interface DemoPlanData {
  gardenSize: string;
  sunlight: string;
  soilType: string;
  style: string;
  maintenance: string;
  region: string;
}

function DemoResultContent() {
  const [planData, setPlanData] = useState<DemoPlanData | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFree = searchParams.get('free') === 'true';

  useEffect(() => {
    const storedData = localStorage.getItem('demo-plan-data');
    if (storedData) {
      setPlanData(JSON.parse(storedData));
    } else {
      router.push('/demo');
    }
  }, [router]);

  if (!planData) {
    return (
      <div className="min-h-screen bg-dark text-mist flex items-center justify-center">
        <div className="animate-spin">
          <Sparkles className="h-12 w-12 text-copper" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-mist">
      <Header />

      {/* Hero */}
      <RevealSection className="pt-32 pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-moss/20 border border-moss/40 px-4 py-2 text-xs uppercase tracking-wider text-moss mb-4">
              <CheckCircle2 className="h-4 w-4" />
              Free Demo Plan Generated
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider font-bold text-mist">
              Your Custom Planting Plan Preview
            </h1>
            <p className="text-lg md:text-xl text-stone leading-relaxed max-w-2xl mx-auto">
              Based on your inputs, here's a preview of what you'll get. Want the full plan with plant recommendations,
              spacing, and care instructions? Unlock it for £79.
            </p>
          </div>
        </div>
      </RevealSection>

      {/* Plan Summary (Limited Preview) */}
      <RevealSection className="pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8 mb-8">
              <h2 className="font-heading text-2xl uppercase tracking-wider font-bold text-mist mb-6">
                Your Garden Profile
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-copper/20 p-3 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-copper" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-stone mb-1">Garden Size</p>
                    <p className="text-lg font-bold text-mist capitalize">{planData.gardenSize}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-copper/20 p-3 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-copper" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-stone mb-1">Sunlight</p>
                    <p className="text-lg font-bold text-mist capitalize">{planData.sunlight.replace('-', ' ')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-copper/20 p-3 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-copper" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-stone mb-1">Soil Type</p>
                    <p className="text-lg font-bold text-mist capitalize">{planData.soilType}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-copper/20 p-3 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-copper" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-stone mb-1">Style</p>
                    <p className="text-lg font-bold text-mist capitalize">{planData.style}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-copper/20 p-3 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-copper" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-stone mb-1">Maintenance</p>
                    <p className="text-lg font-bold text-mist capitalize">{planData.maintenance}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-copper/20 p-3 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-copper" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-stone mb-1">Region</p>
                    <p className="text-lg font-bold text-mist capitalize">{planData.region}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Locked Features (Upgrade CTA) */}
            <div className="bg-gradient-to-r from-copper/20 to-moss/20 border-2 border-copper/40 p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-copper/30 p-3 rounded-lg">
                  <Lock className="h-8 w-8 text-copper" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-2xl uppercase tracking-wider font-bold text-mist mb-2">
                    Unlock Your Complete Plan
                  </h3>
                  <p className="text-stone leading-relaxed">
                    This is just a preview. Get the full plan with everything you need to create a thriving garden.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="bg-dark/40 border border-white/10 p-6">
                  <h4 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                    What's Included:
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-moss flex-shrink-0 mt-0.5" />
                      <span className="text-stone">12-15 plant recommendations (species, varieties, mature sizes)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-moss flex-shrink-0 mt-0.5" />
                      <span className="text-stone">Precise spacing and planting layout</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-moss flex-shrink-0 mt-0.5" />
                      <span className="text-stone">Seasonal care instructions and maintenance calendar</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-moss flex-shrink-0 mt-0.5" />
                      <span className="text-stone">Shopping list with quantities and UK supplier codes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-moss flex-shrink-0 mt-0.5" />
                      <span className="text-stone">Year-round color palette breakdown</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-moss flex-shrink-0 mt-0.5" />
                      <span className="text-stone">Companion planting and pest management tips</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-moss/10 border border-moss/30 p-6">
                  <h4 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-4">
                    Plus:
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-copper flex-shrink-0 mt-0.5" />
                      <span className="text-stone">Save to vault (permanent access)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-copper flex-shrink-0 mt-0.5" />
                      <span className="text-stone">Monthly care email reminders</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-copper flex-shrink-0 mt-0.5" />
                      <span className="text-stone">4 more plan credits to use</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-copper flex-shrink-0 mt-0.5" />
                      <span className="text-stone">Access to designer marketplace</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-copper flex-shrink-0 mt-0.5" />
                      <span className="text-stone">3 months full access</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <Link href="/pricing">
                  <button className="bg-copper text-dark px-10 py-5 text-base uppercase tracking-wider font-bold hover:bg-[#D4A373] transition-colors inline-flex items-center gap-3">
                    Unlock for £79 (One-Time Payment)
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </Link>
                <p className="text-xs text-stone mt-4">
                  No subscription • Plans saved forever • 95%+ botanical accuracy
                </p>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Social Proof */}
      <RevealSection className="py-20 bg-moss/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-stone mb-8">
              <strong className="text-mist">"This took me 3 minutes vs 3 days of research."</strong><br />
              — Sarah M., London
            </p>
            <p className="text-lg text-stone">
              <strong className="text-mist">"The plant spacing calculations alone are worth £79."</strong><br />
              — James T., Edinburgh
            </p>
          </div>
        </div>
      </RevealSection>

      <Footer />
    </div>
  );
}

export default function DemoResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark text-mist flex items-center justify-center">
        <div className="animate-spin">
          <Sparkles className="h-12 w-12 text-copper" />
        </div>
      </div>
    }>
      <DemoResultContent />
    </Suspense>
  );
}
