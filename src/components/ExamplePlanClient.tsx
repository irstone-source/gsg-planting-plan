'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlantImageViewer } from '@/components/PlantImageViewer';
import { getPlantDetail } from '@/data/plant-database';
import { RevealSection } from '@/components/architectural';
import {
  Sun, Droplets, TreePine, Calendar,
  PoundSterling, Leaf, Sprout, AlertCircle, Lightbulb,
  CheckCircle2, Download, Share2, RefreshCw, Briefcase, Home
} from 'lucide-react';

interface ExamplePlanClientProps {
  plan: any; // Use the ExamplePlanExpanded type
}

export function ExamplePlanClient({ plan }: ExamplePlanClientProps) {
  const [mode, setMode] = useState<'diy' | 'professional'>('diy');

  return (
    <>
      {/* Mode Toggle - Sticky */}
      <div className="bg-dark/95 backdrop-blur-md border-b border-white/10 sticky top-20 z-40">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm uppercase tracking-wider text-stone font-heading">View Mode:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('diy')}
                  className={`px-4 py-2 text-sm uppercase tracking-wider font-heading transition-all duration-300 flex items-center gap-2 ${
                    mode === 'diy'
                      ? 'bg-copper text-dark'
                      : 'bg-dark border border-white/10 text-stone hover:border-copper hover:text-copper'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  DIY
                </button>
                <button
                  onClick={() => setMode('professional')}
                  className={`px-4 py-2 text-sm uppercase tracking-wider font-heading transition-all duration-300 flex items-center gap-2 ${
                    mode === 'professional'
                      ? 'bg-copper text-dark'
                      : 'bg-dark border border-white/10 text-stone hover:border-copper hover:text-copper'
                  }`}
                >
                  <Briefcase className="h-4 w-4" />
                  Professional
                </button>
              </div>
            </div>

            {mode === 'professional' && (
              <div className="text-xs text-stone uppercase tracking-wider">
                Scientific symbols • Download enabled
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Site Analysis */}
      <RevealSection className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-3xl uppercase tracking-wider font-bold text-mist mb-12">
              Site Analysis
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Conditions */}
              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-copper mb-6">
                  Site Conditions
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Sun className="h-5 w-5 text-copper flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-stone mb-1">Sun Exposure</p>
                      <p className="text-mist">{plan.siteAnalysis.sun}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Droplets className="h-5 w-5 text-copper flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-stone mb-1">Soil & Moisture</p>
                      <p className="text-mist">{plan.siteAnalysis.soil} • {plan.siteAnalysis.moisture}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Challenges & Opportunities */}
              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-heading text-sm uppercase tracking-wider text-stone mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Challenges
                    </h4>
                    <ul className="space-y-2">
                      {plan.siteAnalysis.challenges.map((challenge: string, i: number) => (
                        <li key={i} className="text-sm text-stone">{challenge}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-heading text-sm uppercase tracking-wider text-moss mb-3 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Opportunities
                    </h4>
                    <ul className="space-y-2">
                      {plan.siteAnalysis.opportunities.map((opp: string, i: number) => (
                        <li key={i} className="text-sm text-stone">{opp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Planting Palette */}
      <RevealSection className="py-20 bg-concrete/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-3xl uppercase tracking-wider font-bold text-mist mb-12">
              Planting Palette
            </h2>

            {/* Structure Plants */}
            <div className="mb-12">
              <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-copper mb-6 flex items-center gap-2">
                <TreePine className="h-5 w-5" />
                Structure & Framework
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plan.plantingPalette.structure.map((plantName: string, idx: number) => {
                  const plantDetail = getPlantDetail(plantName);
                  if (!plantDetail) return null;

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                    >
                      <PlantImageViewer
                        scientificName={plantDetail.scientificName}
                        commonName={plantDetail.commonName}
                        badgeColor="bg-copper text-dark"
                        badgeText="Structure"
                        mode={mode}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Seasonal Interest */}
            <div className="mb-12">
              <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-copper mb-6 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Seasonal Interest
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plan.plantingPalette.seasonal.map((plantName: string, idx: number) => {
                  const plantDetail = getPlantDetail(plantName);
                  if (!plantDetail) return null;

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                    >
                      <PlantImageViewer
                        scientificName={plantDetail.scientificName}
                        commonName={plantDetail.commonName}
                        badgeColor="bg-moss text-dark"
                        badgeText="Seasonal"
                        mode={mode}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Ground Cover */}
            <div>
              <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-copper mb-6 flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Ground Cover & Fillers
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plan.plantingPalette.groundCover.map((plantName: string, idx: number) => {
                  const plantDetail = getPlantDetail(plantName);
                  if (!plantDetail) return null;

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                    >
                      <PlantImageViewer
                        scientificName={plantDetail.scientificName}
                        commonName={plantDetail.commonName}
                        badgeColor="bg-stone/80 text-dark"
                        badgeText="Ground Cover"
                        mode={mode}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Maintenance Rhythm */}
      <RevealSection className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-3xl uppercase tracking-wider font-bold text-mist mb-12">
              Maintenance Rhythm
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(plan.maintenanceRhythm).map(([season, tasks]: [string, any], idx) => (
                <motion.div
                  key={season}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-concrete/60 backdrop-blur-md border border-white/5 p-6"
                >
                  <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-copper mb-4">
                    {season}
                  </h3>
                  <ul className="space-y-2">
                    {tasks.map((task: string, taskIdx: number) => (
                      <li key={taskIdx} className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-moss flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-stone">{task}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </RevealSection>
    </>
  );
}
