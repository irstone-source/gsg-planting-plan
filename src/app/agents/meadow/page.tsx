'use client';

import { useState } from 'react';
import { Header, Footer, RevealSection } from '@/components/architectural';
import { MeadowAgentChat } from '@/components/MeadowAgentChat';
import { CheckCircle, Calendar, Leaf } from 'lucide-react';

export default function MeadowAgentPage() {
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

  return (
    <div className="min-h-screen bg-dark text-mist">
      <Header />

      {/* Hero */}
      <RevealSection className="pt-32 pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <div className="inline-block px-4 py-2 bg-moss/20 border border-moss/30 text-moss text-xs uppercase tracking-widest font-bold rounded-sm mb-4">
              Style-Bound Planting Agent • Prototype
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider font-bold text-mist">
              DAN PEARSON MEADOW AGENT
            </h1>
            <p className="text-lg md:text-xl text-stone leading-relaxed max-w-3xl mx-auto">
              Work with a planting expert trained in naturalistic meadow design.
              Guided authority. No style blending. What will actually work.
            </p>
          </div>
        </div>
      </RevealSection>

      {/* Main Content */}
      <RevealSection className="pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <MeadowAgentChat onPlanGenerated={setGeneratedPlan} />
            </div>

            {/* Sidebar - Agent Info + Plan */}
            <div className="space-y-6">
              {/* Agent Principles */}
              <div className="bg-concrete/60 backdrop-blur-md border border-white/10 p-6">
                <h3 className="font-heading text-sm uppercase tracking-wider text-copper mb-4 font-bold">
                  Agent Principles
                </h3>
                <ul className="space-y-3 text-sm text-stone">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-moss flex-shrink-0 mt-0.5" />
                    <span>Bound by Dan Pearson philosophy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-moss flex-shrink-0 mt-0.5" />
                    <span>Enforces UK planting rules</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-moss flex-shrink-0 mt-0.5" />
                    <span>Authentic UK native species only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-moss flex-shrink-0 mt-0.5" />
                    <span>Pushes back on bad ideas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-moss flex-shrink-0 mt-0.5" />
                    <span>Explains trade-offs clearly</span>
                  </li>
                </ul>
              </div>

              {/* Generated Plan */}
              {generatedPlan && (
                <div className="bg-moss/20 border-2 border-moss/40 p-6">
                  <h3 className="font-heading text-sm uppercase tracking-wider text-moss mb-4 font-bold flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    Your Meadow Plan
                  </h3>

                  <div className="space-y-4 text-sm">
                    {/* Summary */}
                    <div className="bg-dark/50 border border-white/10 p-4">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-stone/70 block">Total Plants</span>
                          <span className="text-mist font-bold text-lg">
                            {generatedPlan.total_plants}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone/70 block">Density</span>
                          <span className="text-mist font-bold text-lg">
                            {generatedPlan.plants_per_m2}/m²
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Layers */}
                    <div>
                      <p className="text-xs uppercase tracking-wider text-moss font-bold mb-2">
                        Planting Layers
                      </p>
                      <div className="space-y-2">
                        <div className="bg-dark/50 border border-white/10 p-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-stone">Grasses</span>
                            <span className="text-xs text-copper font-bold">
                              {generatedPlan.layers.grasses.percentage}% ({generatedPlan.layers.grasses.quantity} plants)
                            </span>
                          </div>
                          <p className="text-xs text-stone/70">
                            {generatedPlan.layers.grasses.species.join(', ')}
                          </p>
                        </div>

                        <div className="bg-dark/50 border border-white/10 p-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-stone">Wildflowers</span>
                            <span className="text-xs text-copper font-bold">
                              {generatedPlan.layers.wildflowers.percentage}% ({generatedPlan.layers.wildflowers.quantity} plants)
                            </span>
                          </div>
                          <p className="text-xs text-stone/70">
                            {generatedPlan.layers.wildflowers.species.join(', ')}
                          </p>
                        </div>

                        <div className="bg-dark/50 border border-white/10 p-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-stone">Accents</span>
                            <span className="text-xs text-copper font-bold">
                              {generatedPlan.layers.accents.percentage}% ({generatedPlan.layers.accents.quantity} plants)
                            </span>
                          </div>
                          <p className="text-xs text-stone/70">
                            {generatedPlan.layers.accents.species.join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <p className="text-xs uppercase tracking-wider text-moss font-bold mb-2 flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        3-Year Timeline
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="bg-dark/50 border border-white/10 p-2">
                          <span className="text-copper font-bold">Year 1:</span>
                          <span className="text-stone ml-2">{generatedPlan.timeline.year_1}</span>
                        </div>
                        <div className="bg-dark/50 border border-white/10 p-2">
                          <span className="text-copper font-bold">Year 2:</span>
                          <span className="text-stone ml-2">{generatedPlan.timeline.year_2}</span>
                        </div>
                        <div className="bg-dark/50 border border-white/10 p-2">
                          <span className="text-copper font-bold">Year 3:</span>
                          <span className="text-stone ml-2">{generatedPlan.timeline.year_3}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* What This Is */}
              <div className="bg-copper/10 border border-copper/30 p-6">
                <h3 className="font-heading text-sm uppercase tracking-wider text-copper mb-3 font-bold">
                  Prototype V1
                </h3>
                <p className="text-xs text-stone leading-relaxed">
                  This is a working prototype of a style-bound planting agent. It embodies Dan Pearson's naturalistic meadow philosophy with hard constraints from UK planting rules.
                </p>
                <p className="text-xs text-stone leading-relaxed mt-3">
                  The agent cannot be convinced to break rules or blend styles. This is intentional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      <Footer />
    </div>
  );
}
