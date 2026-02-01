import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { examplePlansExpanded } from '@/data/example-plans-expanded';
import { PlantImageViewer } from '@/components/PlantImageViewer';
import { getPlantDetail } from '@/data/plant-database';
import { Header, Footer, RevealSection } from '@/components/architectural';
import { StickyPricingCTA } from '@/components/StickyPricingCTA';
import {
  ArrowLeft, MapPin, Sun, Droplets, TreePine, Calendar,
  PoundSterling, Leaf, Sprout, AlertCircle, Lightbulb,
  CheckCircle2, Download, Share2, RefreshCw
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return examplePlansExpanded.map((plan) => ({
    slug: plan.slug,
  }));
}

export default async function ExamplePlanPage({ params }: PageProps) {
  const { slug } = await params;
  const plan = examplePlansExpanded.find(p => p.slug === slug);

  if (!plan) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-dark text-mist">
      <Header />

      {/* Hero Section */}
      <RevealSection className="pt-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Back Navigation */}
            <Link
              href="/examples/hub"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-stone hover:text-mist transition-colors duration-300 mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Examples
            </Link>

            {/* Hero Image */}
            <div className="relative h-[500px] overflow-hidden mb-8">
              <Image
                src={plan.heroImage}
                alt={`${plan.title} planting plan for ${plan.region}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />

              {/* Hero Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="bg-copper/20 border border-copper/40 px-4 py-2 text-xs uppercase tracking-wider text-copper backdrop-blur-sm">
                    {plan.rhsZone}
                  </span>
                  <span className="bg-moss/20 border border-moss/40 px-4 py-2 text-xs uppercase tracking-wider text-mist backdrop-blur-sm">
                    {plan.tags.feeling[0]}
                  </span>
                  <span className="bg-stone/20 border border-stone/40 px-4 py-2 text-xs uppercase tracking-wider text-stone backdrop-blur-sm">
                    {plan.tags.effort}
                  </span>
                </div>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider font-bold text-mist mb-4 drop-shadow-lg">
                  {plan.title}
                </h1>
                <p className="text-lg md:text-xl text-stone flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-copper" />
                  {plan.region} • {plan.postcode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Stats Bar */}
      <div className="bg-concrete/60 backdrop-blur-md border-y border-white/5 sticky top-20 z-40">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-copper flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone">Area</p>
                  <p className="font-heading font-bold text-mist">{plan.area}m²</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Leaf className="h-5 w-5 text-copper flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone">Maintenance</p>
                  <p className="font-heading font-bold text-mist text-sm">{plan.tags.effort}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <PoundSterling className="h-5 w-5 text-copper flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone">Budget</p>
                  <p className="font-heading font-bold text-mist">{plan.budget}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Sprout className="h-5 w-5 text-copper flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone">Plants</p>
                  <p className="font-heading font-bold text-mist">{plan.totalPlants}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Sun className="h-5 w-5 text-copper flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone">Best for</p>
                  <p className="font-heading font-bold text-mist text-sm">{plan.tags.useCase[0]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto space-y-20">

          {/* Overview */}
          <RevealSection>
            <div className="max-w-4xl">
              <p className="text-lg md:text-xl text-stone leading-relaxed mb-8">
                {plan.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {plan.tags.place.map(tag => (
                  <span key={tag} className="bg-dark/50 border border-white/10 px-3 py-1 text-xs uppercase tracking-wider text-stone">
                    {tag}
                  </span>
                ))}
                {plan.tags.gardenType.map(tag => (
                  <span key={tag} className="bg-dark/50 border border-white/10 px-3 py-1 text-xs uppercase tracking-wider text-stone">
                    {tag}
                  </span>
                ))}
                {plan.tags.feeling.map(tag => (
                  <span key={tag} className="bg-moss/10 border border-moss/30 px-3 py-1 text-xs uppercase tracking-wider text-mist">
                    {tag}
                  </span>
                ))}
                {plan.tags.useCase.map(tag => (
                  <span key={tag} className="bg-copper/10 border border-copper/30 px-3 py-1 text-xs uppercase tracking-wider text-copper">
                    {tag}
                  </span>
                ))}
                {plan.tags.constraint.map(tag => (
                  <span key={tag} className="bg-stone/10 border border-stone/30 px-3 py-1 text-xs uppercase tracking-wider text-stone">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </RevealSection>

          {/* Site Analysis */}
          <RevealSection>
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold text-mist mb-12">
              Site Analysis
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-6">
                <Sun className="h-8 w-8 text-copper mb-4" aria-hidden="true" />
                <h3 className="font-heading text-sm uppercase tracking-wider text-copper mb-3">
                  Sun Exposure
                </h3>
                <p className="text-stone leading-relaxed">{plan.siteAnalysis.sun}</p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-6">
                <TreePine className="h-8 w-8 text-moss mb-4" aria-hidden="true" />
                <h3 className="font-heading text-sm uppercase tracking-wider text-mist mb-3">
                  Soil Type
                </h3>
                <p className="text-stone leading-relaxed">{plan.siteAnalysis.soil}</p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-6">
                <Droplets className="h-8 w-8 text-copper mb-4" aria-hidden="true" />
                <h3 className="font-heading text-sm uppercase tracking-wider text-mist mb-3">
                  Moisture
                </h3>
                <p className="text-stone leading-relaxed">{plan.siteAnalysis.moisture}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-6 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-copper" aria-hidden="true" />
                  Site Challenges
                </h3>
                <ul className="space-y-3">
                  {plan.siteAnalysis.challenges.map((challenge, idx) => (
                    <li key={idx} className="flex gap-3 items-start">
                      <span className="text-copper mt-1 flex-shrink-0" aria-hidden="true">•</span>
                      <span className="text-stone leading-relaxed">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h3 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-6 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-moss" aria-hidden="true" />
                  Design Opportunities
                </h3>
                <ul className="space-y-3">
                  {plan.siteAnalysis.opportunities.map((opp, idx) => (
                    <li key={idx} className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-moss mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-stone leading-relaxed">{opp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </RevealSection>

          {/* Design Concept */}
          <RevealSection>
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold text-mist mb-12">
              Design Concept
            </h2>
            <div className="bg-moss/10 border border-moss/30 p-8 lg:p-12">
              <p className="text-lg text-mist leading-relaxed mb-8">
                {plan.designConcept}
              </p>
              <div className="space-y-4">
                <p className="font-heading text-sm uppercase tracking-wider text-copper mb-4">
                  Key Features
                </p>
                {plan.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <CheckCircle2 className="h-6 w-6 text-moss mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <p className="text-stone leading-relaxed">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>

          {/* Planting Palette */}
          <RevealSection>
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold text-mist mb-6">
              Planting Palette
            </h2>
            <p className="text-stone mb-12 text-lg">
              Layered planting creates year-round structure and seasonal interest
            </p>

            {/* Plant Customization Notice */}
            <div className="mb-12 bg-copper/10 border border-copper/30 p-6 lg:p-8">
              <div className="flex items-start gap-4">
                <RefreshCw className="h-6 w-6 text-copper flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="font-heading text-sm uppercase tracking-wider text-copper mb-3">
                    Plant Customization Available
                  </p>
                  <p className="text-stone mb-4 leading-relaxed">
                    Don&apos;t like a plant recommendation? Swap it for an alternative that suits your site conditions and style preferences.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="bg-dark/50 border border-white/10 px-3 py-2 text-xs uppercase tracking-wider text-stone">
                      DIY: 3 swaps included
                    </span>
                    <span className="bg-dark/50 border border-white/10 px-3 py-2 text-xs uppercase tracking-wider text-stone">
                      Pro: Unlimited swaps
                    </span>
                    <Link href="/pricing" className="px-4 py-2 bg-copper text-dark text-xs uppercase tracking-wider font-bold hover:bg-[#D4A373] transition-colors duration-300">
                      View Plans
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-16">
              {/* Structure Layer */}
              <div>
                <h3 className="font-heading text-2xl uppercase tracking-wider font-bold text-mist mb-4 flex items-center gap-3">
                  <TreePine className="h-6 w-6 text-copper" aria-hidden="true" />
                  Structure Layer (Trees & Shrubs)
                </h3>
                <p className="text-stone mb-8">
                  Provides framework and year-round presence
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  {plan.plantingPalette.structure.map((plantName) => {
                    const plantDetail = getPlantDetail(plantName);
                    if (!plantDetail) return null;
                    return (
                      <div key={plantName} className="bg-concrete/60 backdrop-blur-md border border-white/5 overflow-hidden">
                        <PlantImageViewer
                          scientificName={plantDetail.scientificName}
                          commonName={plantDetail.commonName}
                          badgeColor={plantDetail.badge.color}
                          badgeText={plantDetail.badge.text}
                        />
                        <div className="p-6">
                          <h4 className="font-heading text-lg font-bold text-mist mb-2">
                            {plantDetail.scientificName}
                          </h4>
                          <p className="text-sm text-copper mb-3 uppercase tracking-wider">
                            {plantDetail.commonName}
                          </p>
                          <p className="text-sm text-stone mb-4 leading-relaxed">
                            {plantDetail.description}
                          </p>
                          <button
                            className="w-full px-4 py-2 bg-dark/50 border border-white/10 text-xs uppercase tracking-wider text-stone hover:border-copper hover:text-copper transition-colors duration-300 flex items-center justify-center gap-2"
                            disabled
                          >
                            <RefreshCw className="h-3 w-3" aria-hidden="true" />
                            Swap Plant (Coming Soon)
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Seasonal Layer */}
              <div>
                <h3 className="font-heading text-2xl uppercase tracking-wider font-bold text-mist mb-4 flex items-center gap-3">
                  <Sprout className="h-6 w-6 text-copper" aria-hidden="true" />
                  Seasonal Layer (Perennials)
                </h3>
                <p className="text-stone mb-8">
                  Flowers and foliage through the seasons
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  {plan.plantingPalette.seasonal.map((plantName) => {
                    const plantDetail = getPlantDetail(plantName);
                    if (!plantDetail) return null;
                    return (
                      <div key={plantName} className="bg-concrete/60 backdrop-blur-md border border-white/5 overflow-hidden">
                        <PlantImageViewer
                          scientificName={plantDetail.scientificName}
                          commonName={plantDetail.commonName}
                          badgeColor={plantDetail.badge.color}
                          badgeText={plantDetail.badge.text}
                        />
                        <div className="p-6">
                          <h4 className="font-heading text-lg font-bold text-mist mb-2">
                            {plantDetail.scientificName}
                          </h4>
                          <p className="text-sm text-copper mb-3 uppercase tracking-wider">
                            {plantDetail.commonName}
                          </p>
                          <p className="text-sm text-stone mb-4 leading-relaxed">
                            {plantDetail.description}
                          </p>
                          <button
                            className="w-full px-4 py-2 bg-dark/50 border border-white/10 text-xs uppercase tracking-wider text-stone hover:border-copper hover:text-copper transition-colors duration-300 flex items-center justify-center gap-2"
                            disabled
                          >
                            <RefreshCw className="h-3 w-3" aria-hidden="true" />
                            Swap Plant (Coming Soon)
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ground Cover Layer */}
              <div>
                <h3 className="font-heading text-2xl uppercase tracking-wider font-bold text-mist mb-4 flex items-center gap-3">
                  <Leaf className="h-6 w-6 text-copper" aria-hidden="true" />
                  Ground Cover Layer
                </h3>
                <p className="text-stone mb-8">
                  Suppresses weeds and completes the layers
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  {plan.plantingPalette.groundCover.map((plantName) => {
                    const plantDetail = getPlantDetail(plantName);
                    if (!plantDetail) return null;
                    return (
                      <div key={plantName} className="bg-concrete/60 backdrop-blur-md border border-white/5 overflow-hidden">
                        <PlantImageViewer
                          scientificName={plantDetail.scientificName}
                          commonName={plantDetail.commonName}
                          badgeColor={plantDetail.badge.color}
                          badgeText={plantDetail.badge.text}
                        />
                        <div className="p-6">
                          <h4 className="font-heading text-lg font-bold text-mist mb-2">
                            {plantDetail.scientificName}
                          </h4>
                          <p className="text-sm text-copper mb-3 uppercase tracking-wider">
                            {plantDetail.commonName}
                          </p>
                          <p className="text-sm text-stone mb-4 leading-relaxed">
                            {plantDetail.description}
                          </p>
                          <button
                            className="w-full px-4 py-2 bg-dark/50 border border-white/10 text-xs uppercase tracking-wider text-stone hover:border-copper hover:text-copper transition-colors duration-300 flex items-center justify-center gap-2"
                            disabled
                          >
                            <RefreshCw className="h-3 w-3" aria-hidden="true" />
                            Swap Plant (Coming Soon)
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Plant Image Disclaimer */}
            <div className="mt-12 bg-dark/50 border border-white/10 p-8">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-copper flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-mist mb-4 leading-relaxed">
                    <strong className="text-copper">These are indicative images.</strong> Actual plant appearance varies by season,
                    maturity, and growing conditions. Always confirm size, condition, and specific variety
                    upon ordering from your chosen supplier.
                  </p>
                  <button
                    className="px-4 py-2 bg-dark/50 border border-white/10 text-xs uppercase tracking-wider text-stone hover:border-copper hover:text-copper transition-colors duration-300 flex items-center gap-2"
                    disabled
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    View Full Purchasing Guide & Checklist
                  </button>
                  <p className="text-sm text-stone mt-3">
                    Professional horticultural guidance on sourcing, sizing, and quality checks customized to your plan
                  </p>
                </div>
              </div>
            </div>
          </RevealSection>

          {/* Care Plan Preview */}
          <RevealSection>
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold text-mist mb-6">
              Care Plan Preview
            </h2>
            <p className="text-lg text-stone mb-12 leading-relaxed">
              Understanding the time commitment and techniques required to keep your planting looking its best
            </p>

            {/* Annual Care Summary */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-moss/10 border border-moss/30 p-8">
                <Calendar className="h-8 w-8 text-copper mb-4" aria-hidden="true" />
                <h3 className="font-heading text-lg uppercase tracking-wider text-mist mb-4">
                  Annual Care Time
                </h3>
                <p className="text-4xl font-bold text-copper mb-3">12-18 hours</p>
                <p className="text-sm text-stone leading-relaxed">
                  Spread across the year in simple seasonal tasks
                </p>
              </div>

              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <CheckCircle2 className="h-8 w-8 text-moss mb-4" aria-hidden="true" />
                <h3 className="font-heading text-lg uppercase tracking-wider text-mist mb-4">
                  Homeowner Friendly
                </h3>
                <p className="text-lg font-semibold text-copper mb-3">Yes, achievable</p>
                <p className="text-sm text-stone leading-relaxed">
                  Suitable for someone with good health and mobility. No specialized equipment required.
                </p>
              </div>

              <div className="bg-copper/10 border border-copper/30 p-8">
                <PoundSterling className="h-8 w-8 text-copper mb-4" aria-hidden="true" />
                <h3 className="font-heading text-lg uppercase tracking-wider text-mist mb-4">
                  Professional Care Cost
                </h3>
                <p className="text-4xl font-bold text-copper mb-3">£350-550</p>
                <p className="text-sm text-stone leading-relaxed">
                  Per year for professional gardener maintenance
                </p>
              </div>
            </div>

            {/* Care by Species */}
            <div className="space-y-8">
              <h3 className="font-heading text-2xl uppercase tracking-wider font-bold text-mist mb-8">
                Care Requirements by Species
              </h3>

              {/* Structure Layer Care */}
              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h4 className="font-heading text-xl uppercase tracking-wider font-bold text-mist mb-6">
                  Structure Layer (Trees & Shrubs)
                </h4>
                <div>
                  <div className="space-y-6">
                    {/* Betula pendula */}
                    <div className="pb-6 border-b border-white/10 last:border-0">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h5 className="font-heading font-bold text-mist text-lg mb-2">
                            Betula pendula (Silver Birch)
                          </h5>
                          <p className="text-sm text-copper uppercase tracking-wider">
                            Annual care time: 1-2 hours
                          </p>
                        </div>
                        <a
                          href="https://www.rhs.org.uk/plants/betula/pendula/details"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-copper hover:text-mist underline uppercase tracking-wider transition-colors duration-300"
                        >
                          RHS Guide →
                        </a>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <p className="font-heading text-sm uppercase tracking-wider text-mist mb-3">
                            Techniques Required:
                          </p>
                          <ul className="space-y-2 text-stone text-sm leading-relaxed">
                            <li>• Light formative pruning in late summer (once established)</li>
                            <li>• Remove dead or damaged branches</li>
                            <li>• No regular pruning needed</li>
                            <li>• Minimal watering after establishment (1-2 years)</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-heading text-sm uppercase tracking-wider text-mist mb-3">
                            Homeowner Notes:
                          </p>
                          <ul className="space-y-2 text-stone text-sm leading-relaxed">
                            <li>• Very low maintenance once established</li>
                            <li>• May need stepladder for pruning mature trees</li>
                            <li>• No specialist skills required</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Viburnum tinus */}
                    <div className="pb-6 border-b border-white/10 last:border-0">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h5 className="font-heading font-bold text-mist text-lg mb-2">
                            Viburnum tinus (Laurustinus)
                          </h5>
                          <p className="text-sm text-copper uppercase tracking-wider">
                            Annual care time: 2-3 hours
                          </p>
                        </div>
                        <a
                          href="https://www.rhs.org.uk/plants/viburnum/tinus/details"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-copper hover:text-mist underline uppercase tracking-wider transition-colors duration-300"
                        >
                          RHS Guide →
                        </a>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <p className="font-heading text-sm uppercase tracking-wider text-mist mb-3">
                            Techniques Required:
                          </p>
                          <ul className="space-y-2 text-stone text-sm leading-relaxed">
                            <li>• Light trim after flowering (spring)</li>
                            <li>• Remove any frost-damaged shoots</li>
                            <li>• Shape maintenance if used for screening</li>
                            <li>• Water during dry spells in first 2 years</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-heading text-sm uppercase tracking-wider text-mist mb-3">
                            Homeowner Notes:
                          </p>
                          <ul className="space-y-2 text-stone text-sm leading-relaxed">
                            <li>• Simple hand pruning with secateurs</li>
                            <li>• Very forgiving and tough</li>
                            <li>• Suitable for beginners</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Fargesia murielae */}
                    <div className="pb-6 border-b border-white/10 last:border-0">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h5 className="font-heading font-bold text-mist text-lg mb-2">
                            Fargesia murielae (Umbrella Bamboo)
                          </h5>
                          <p className="text-sm text-copper uppercase tracking-wider">
                            Annual care time: 1-2 hours
                          </p>
                        </div>
                        <a
                          href="https://www.rhs.org.uk/plants/7049/fargesia-murielae/details"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-copper hover:text-mist underline uppercase tracking-wider transition-colors duration-300"
                        >
                          RHS Guide →
                        </a>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <p className="font-heading text-sm uppercase tracking-wider text-mist mb-3">
                            Techniques Required:
                          </p>
                          <ul className="space-y-2 text-stone text-sm leading-relaxed">
                            <li>• Remove dead canes at base in spring</li>
                            <li>• Thin out oldest canes every 2-3 years</li>
                            <li>• Water well during dry periods</li>
                            <li>• Mulch annually to retain moisture</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-heading text-sm uppercase tracking-wider text-mist mb-3">
                            Homeowner Notes:
                          </p>
                          <ul className="space-y-2 text-stone text-sm leading-relaxed">
                            <li>• Non-invasive clumping type (no spreading)</li>
                            <li>• Minimal intervention needed</li>
                            <li>• Simple cutting with loppers</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seasonal Layer Care */}
              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h4 className="font-heading text-xl uppercase tracking-wider font-bold text-mist mb-6">
                  Seasonal Layer (Perennials)
                </h4>
                <div className="space-y-6">
                  {/* Geranium Rozanne */}
                  <div className="pb-6 border-b border-white/10 last:border-0">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h5 className="font-heading font-bold text-mist text-lg mb-2">
                          Geranium 'Rozanne'
                        </h5>
                        <p className="text-sm text-copper uppercase tracking-wider">
                          Annual care time: 1 hour
                        </p>
                      </div>
                      <a
                        href="https://www.rhs.org.uk/plants/geranium/rozanne/details"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-copper hover:text-mist underline uppercase tracking-wider transition-colors duration-300"
                      >
                        RHS Guide →
                      </a>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="font-heading text-sm uppercase tracking-wider text-mist mb-3">
                          Techniques Required:
                        </p>
                        <ul className="space-y-2 text-stone text-sm leading-relaxed">
                          <li>• Cut back to ground level in late autumn</li>
                          <li>• Optional: deadhead to prolong flowering</li>
                          <li>• Water during establishment only</li>
                          <li>• No feeding required once established</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-heading text-sm uppercase tracking-wider text-mist mb-3">
                          Homeowner Notes:
                        </p>
                        <ul className="space-y-2 text-stone text-sm leading-relaxed">
                          <li>• Exceptionally low maintenance</li>
                          <li>• RHS Award of Garden Merit winner</li>
                          <li>• Perfect for beginners</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Alchemilla mollis */}
                  <div className="pb-6 border-b border-white/10 last:border-0">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h5 className="font-heading font-bold text-mist text-lg mb-2">
                          Alchemilla mollis (Lady's Mantle)
                        </h5>
                        <p className="text-sm text-copper uppercase tracking-wider">
                          Annual care time: 1 hour
                        </p>
                      </div>
                      <a
                        href="https://www.rhs.org.uk/plants/alchemilla/mollis/details"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-copper hover:text-mist underline uppercase tracking-wider transition-colors duration-300"
                      >
                        RHS Guide →
                      </a>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="font-heading text-sm uppercase tracking-wider text-mist mb-3">
                          Techniques Required:
                        </p>
                        <ul className="space-y-2 text-stone text-sm leading-relaxed">
                          <li>• Cut back foliage after flowering (July)</li>
                          <li>• Remove spent flowers to prevent self-seeding</li>
                          <li>• No watering needed once established</li>
                          <li>• Incredibly drought-tolerant</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-heading text-sm uppercase tracking-wider text-mist mb-3">
                          Homeowner Notes:
                        </p>
                        <ul className="space-y-2 text-stone text-sm leading-relaxed">
                          <li>• One of the easiest perennials to grow</li>
                          <li>• Tolerates virtually any conditions</li>
                          <li>• No specialist knowledge needed</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ground Cover Layer Care */}
              <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                <h4 className="font-heading text-xl uppercase tracking-wider font-bold text-mist mb-6">
                  Ground Cover Layer
                </h4>
                <div className="space-y-6">
                  {/* Dryopteris filix-mas */}
                  <div className="pb-6 border-b border-white/10 last:border-0">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h5 className="font-heading font-bold text-mist text-lg mb-2">
                          Dryopteris filix-mas (Male Fern)
                        </h5>
                        <p className="text-sm text-copper uppercase tracking-wider">
                          Annual care time: 30 minutes
                        </p>
                      </div>
                      <a
                        href="https://www.rhs.org.uk/plants/6061/dryopteris-filix-mas/details"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-copper hover:text-mist underline uppercase tracking-wider transition-colors duration-300"
                      >
                        RHS Guide →
                      </a>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="font-heading text-sm uppercase tracking-wider text-mist mb-3">
                          Techniques Required:
                        </p>
                        <ul className="space-y-2 text-stone text-sm leading-relaxed">
                          <li>• Remove dead fronds in early spring</li>
                          <li>• Apply mulch annually to retain moisture</li>
                          <li>• Water during very dry spells</li>
                          <li>• No pruning or feeding required</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-heading text-sm uppercase tracking-wider text-mist mb-3">
                          Homeowner Notes:
                        </p>
                        <ul className="space-y-2 text-stone text-sm leading-relaxed">
                          <li>• Minimal care required</li>
                          <li>• Perfect for neglected shady areas</li>
                          <li>• Extremely low maintenance</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Ajuga reptans */}
                  <div className="pb-6 border-b border-white/10 last:border-0">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h5 className="font-heading font-bold text-mist text-lg mb-2">
                          Ajuga reptans (Bugle)
                        </h5>
                        <p className="text-sm text-copper uppercase tracking-wider">
                          Annual care time: 30 minutes
                        </p>
                      </div>
                      <a
                        href="https://www.rhs.org.uk/plants/ajuga/reptans/details"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-copper hover:text-mist underline uppercase tracking-wider transition-colors duration-300"
                      >
                        RHS Guide →
                      </a>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="font-heading text-sm uppercase tracking-wider text-mist mb-3">
                          Techniques Required:
                        </p>
                        <ul className="space-y-2 text-stone text-sm leading-relaxed">
                          <li>• Trim back after flowering if needed</li>
                          <li>• Remove any spreading growth from paths</li>
                          <li>• No regular maintenance required</li>
                          <li>• Self-sufficient once established</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-heading text-sm uppercase tracking-wider text-mist mb-3">
                          Homeowner Notes:
                        </p>
                        <ul className="space-y-2 text-stone text-sm leading-relaxed">
                          <li>• Almost zero maintenance</li>
                          <li>• Excellent weed suppressor</li>
                          <li>• Thrives on neglect</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Care Option */}
            <div className="mt-8 bg-dark/50 border border-white/10 p-8">
              <div className="flex items-start gap-4">
                <Lightbulb className="h-6 w-6 text-copper flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-mist mb-4 leading-relaxed">
                    <strong className="text-copper">Professional Gardener Cost Breakdown:</strong> The estimated annual cost of
                    £350-550 assumes 3-4 seasonal visits (spring tidy, summer maintenance, autumn cutback,
                    winter check) at £100-150 per visit for a garden of this size. Costs vary by region
                    and specific contractor rates.
                  </p>
                  <p className="text-sm text-stone leading-relaxed">
                    Your custom plan includes a detailed care calendar with month-by-month tasks and estimated
                    time requirements to help you plan whether to maintain the garden yourself or budget for
                    professional help.
                  </p>
                </div>
              </div>
            </div>
          </RevealSection>

          {/* Seasonal Color Palette */}
          <RevealSection>
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold text-mist mb-6">
              Seasonal Color Palette
            </h2>
            <p className="text-lg text-stone mb-12 leading-relaxed">
              Understanding the colors and visual interest your garden will display throughout the year
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Spring */}
              <div className="bg-concrete/40 border border-white/10 p-8">
                <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-mist mb-6 flex items-center gap-3">
                  <Sprout className="h-6 w-6 text-copper" aria-hidden="true" />
                  Spring (March-May)
                </h3>
                <div>
                  <div className="flex gap-4 mb-4">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#F8BBD0'}} title="Viburnum pink-white" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Viburnum_tinus_04.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Viburnum_tinus.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Viburnum_tinus_DT1.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#5C6BC0'}} title="Ajuga blue" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Ajuga_reptans_-_Bugle_rampante.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Ajuga_reptans_003.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Ajuga_reptans_flowers.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#AED581'}} title="Fresh lime green" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Dryopteris_filix-mas_001.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Dryopteris_filix-mas_Fiddleheads_3648px.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Betula_pendula_m1.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-copper mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-stone leading-relaxed">
                        <strong className="text-mist">Viburnum tinus:</strong> White-pink flowers in clusters
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-copper mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-stone leading-relaxed">
                        <strong className="text-mist">Ajuga reptans:</strong> Blue flower spikes emerge
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-copper mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-stone leading-relaxed">
                        <strong className="text-mist">Ferns unfurling:</strong> Fresh lime-green fronds
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-copper mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-stone leading-relaxed">
                        <strong className="text-mist">Betula pendula:</strong> Delicate bright green catkins and leaves
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Summer */}
              <div className="bg-concrete/40 border border-white/10 p-8">
                <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-mist mb-6 flex items-center gap-3">
                  <Sun className="h-6 w-6 text-copper" aria-hidden="true" />
                  Summer (June-August)
                </h3>
                <div>
                  <div className="flex gap-4 mb-4">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#4A90E2'}} title="Geranium blue" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Geranium_'Rozanne'.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Geranium_Rozanne_6zz.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Geranium_hybride_'Rozanne'_bloemen.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#C5E1A5'}} title="Alchemilla chartreuse" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Alchemilla_mollis_Lady's_Mantle_MN_2007.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Alchemilla_mollis_inflorescence_001.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Alchemilla_mollis_flowers.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#2E7D32'}} title="Deep green foliage" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Fargesia-murielae.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Dryopteris_filix-mas_001.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Viburnum_tinus.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-copper mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-stone leading-relaxed">
                        <strong className="text-mist">Geranium 'Rozanne':</strong> Continuous blue flowers (peak season)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-copper mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-stone leading-relaxed">
                        <strong className="text-mist">Alchemilla mollis:</strong> Frothy lime-yellow flowers
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-copper mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-stone leading-relaxed">
                        <strong className="text-mist">Fargesia bamboo:</strong> Lush green architectural foliage
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-copper mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-stone leading-relaxed">
                        <strong className="text-mist">Ferns:</strong> Peak lushness with deep green fronds
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Autumn */}
              <div className="bg-concrete/40 border border-white/10 p-8">
                <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-mist mb-6 flex items-center gap-3">
                  <Leaf className="h-6 w-6 text-copper" aria-hidden="true" />
                  Autumn (September-November)
                </h3>
                <div>
                  <div className="flex gap-4 mb-4">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#FFD54F'}} title="Golden birch leaves" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Betula_pendula_m1.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Betula_pendula_autumn.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Betula_pendula_003.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#A67C52'}} title="Bronze ferns" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Dryopteris_filix-mas_001.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Dryopteris_filix-mas_autumn.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Dryopteris_filix-mas_LC0226.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#6A1B9A'}} title="Purple-bronze Ajuga" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Ajuga_reptans_-_Bugle_rampante.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Ajuga_reptans_'Atropurpurea'.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Ajuga_reptans_leaves.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-copper mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-stone leading-relaxed">
                        <strong className="text-mist">Betula pendula:</strong> Golden yellow autumn foliage
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-copper mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-stone leading-relaxed">
                        <strong className="text-mist">Geranium 'Rozanne':</strong> Still flowering until first frost
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-copper mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-stone leading-relaxed">
                        <strong className="text-mist">Ferns:</strong> Bronze and copper tones before dormancy
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-copper mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-stone leading-relaxed">
                        <strong className="text-mist">Ajuga reptans:</strong> Purple-bronze foliage intensifies
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Winter */}
              <div className="bg-concrete/40 border border-white/10 p-8">
                <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-mist mb-6 flex items-center gap-3">
                  <TreePine className="h-6 w-6 text-copper" aria-hidden="true" />
                  Winter (December-February)
                </h3>
                <div>
                  <div className="flex gap-4 mb-4">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md border border-gray-200" style={{backgroundColor: '#F5F5F5'}} title="White birch bark" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Betula_pendula_bark.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Betula_pendula_m1.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Betula_pendula_003.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#2D5016'}} title="Deep evergreen" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Viburnum_tinus.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Fargesia-murielae.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Ajuga_reptans_leaves.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#F8BBD0'}} title="Pink winter blooms" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Viburnum_tinus_04.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Viburnum_tinus_DT1.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Viburnum_tinus_flowers.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-20 h-20 rounded-lg shadow-md" style={{backgroundColor: '#6A1B9A'}} title="Purple foliage" />
                      <div className="flex gap-0.5">
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Ajuga_reptans_'Atropurpurea'.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Ajuga_reptans_-_Bugle_rampante.JPG?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Ajuga_reptans_leaves.jpg?width=80" className="w-6 h-6 rounded object-cover" alt="" />
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-copper mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-stone leading-relaxed">
                        <strong className="text-mist">Betula pendula:</strong> Stunning white bark stands out against winter sky
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-copper mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-stone leading-relaxed">
                        <strong className="text-mist">Viburnum tinus:</strong> Evergreen structure with winter blooms
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-copper mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-stone leading-relaxed">
                        <strong className="text-mist">Fargesia bamboo:</strong> Year-round green foliage and elegant stems
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-copper mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-stone leading-relaxed">
                        <strong className="text-mist">Ajuga reptans:</strong> Purple-tinged foliage adds winter color
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-moss/10 border border-moss/30 p-8">
              <div className="flex items-start gap-4">
                <Lightbulb className="h-6 w-6 text-copper flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-mist mb-3 leading-relaxed">
                    <strong className="text-copper">Year-Round Interest:</strong> This planting scheme ensures something of interest in every season.
                  </p>
                  <p className="text-sm text-stone leading-relaxed">
                    The evergreen structure plants (Viburnum, Bamboo, Ajuga) provide consistent presence, while deciduous plants
                    (Birch, Ferns) offer dramatic seasonal change. Long-flowering perennials bridge the gap between spring and autumn.
                  </p>
                </div>
              </div>
            </div>
          </RevealSection>

          {/* Shopping List Preview */}
          <RevealSection>
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold text-mist mb-12">
              Shopping List Preview
            </h2>
            <div className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center p-6 bg-dark/50 border border-white/10">
                  <span className="font-heading uppercase tracking-wider text-mist">Total Plants</span>
                  <span className="text-3xl font-bold text-copper">{plan.totalPlants}</span>
                </div>
                <div className="flex justify-between items-center p-6 bg-dark/50 border border-white/10">
                  <span className="font-heading uppercase tracking-wider text-mist">Estimated Cost</span>
                  <span className="text-3xl font-bold text-copper">£{plan.totalCost.toFixed(2)}</span>
                </div>
              </div>
              <p className="text-sm text-stone italic leading-relaxed">
                Full shopping list with quantities, sizes, and supplier codes included in your custom plan
              </p>
            </div>
          </RevealSection>

          {/* Maintenance Rhythm */}
          <RevealSection>
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-wider font-bold text-mist mb-6">
              Maintenance Rhythm
            </h2>
            <p className="text-lg text-stone mb-12 leading-relaxed">
              Simple seasonal tasks keep your garden looking its best
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(plan.maintenanceRhythm).map(([season, tasks]) => (
                <div key={season} className="bg-concrete/60 backdrop-blur-md border border-white/5 p-8">
                  <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-mist mb-6">
                    {season}
                  </h3>
                  <ul className="space-y-3">
                    {tasks.map((task, idx) => (
                      <li key={idx} className="flex gap-3 items-start">
                        <span className="text-copper mt-1 flex-shrink-0" aria-hidden="true">•</span>
                        <span className="text-stone leading-relaxed">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </RevealSection>

          {/* CTA Section */}
          <RevealSection>
            <div className="bg-moss/20 border border-moss/30 p-12 lg:p-16 text-center">
              <h2 className="font-heading text-4xl md:text-5xl uppercase tracking-wider font-bold text-mist mb-6">
                Create Your Own Custom Planting Plan
              </h2>
              <p className="text-xl text-mist mb-4 max-w-3xl mx-auto leading-relaxed">
                Get a professional planting plan tailored specifically to your garden's conditions,
                your style preferences, and your local climate zone.
              </p>
              <p className="text-lg text-stone mb-10 max-w-2xl mx-auto">
                Upload photos of your space → AI analysis → Plant recommendations → Download PDF
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/create"
                  className="px-8 py-4 bg-copper text-dark font-heading text-sm uppercase tracking-widest font-bold hover:bg-[#D4A373] transition-colors duration-300 flex items-center justify-center gap-3"
                >
                  <Sprout className="h-5 w-5" aria-hidden="true" />
                  Start Creating Your Plan
                </Link>
                <button
                  className="px-8 py-4 bg-dark/50 border border-white/20 text-mist font-heading text-sm uppercase tracking-widest font-bold hover:border-copper hover:text-copper transition-colors duration-300 flex items-center justify-center gap-3"
                  disabled
                >
                  <Download className="h-5 w-5" aria-hidden="true" />
                  Download Example PDF
                </button>
              </div>
              <p className="text-sm mt-8 text-stone uppercase tracking-wider">
                Takes 5 minutes • Professional results • Real plant availability
              </p>
            </div>
          </RevealSection>

          {/* Similar Plans */}
          <RevealSection>
            <h3 className="font-heading text-2xl md:text-3xl uppercase tracking-wider font-bold text-mist mb-12">
              Similar Plans You Might Like
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {examplePlansExpanded
                .filter(p => p.id !== plan.id && p.tags.feeling.some(f => plan.tags.feeling.includes(f)))
                .slice(0, 3)
                .map(similarPlan => (
                  <Link
                    key={similarPlan.id}
                    href={`/examples/${similarPlan.slug}`}
                    className="group"
                  >
                    <div className="bg-concrete/60 backdrop-blur-md border border-white/5 overflow-hidden hover:border-copper/30 transition-all duration-500">
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={similarPlan.heroImage}
                          alt={`${similarPlan.title} planting plan`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h4 className="font-heading text-lg uppercase tracking-wider font-bold text-mist mb-2 drop-shadow-lg">
                            {similarPlan.title}
                          </h4>
                          <p className="text-sm text-copper uppercase tracking-wider flex items-center gap-2">
                            <MapPin className="h-4 w-4" aria-hidden="true" />
                            {similarPlan.region}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </RevealSection>

        </div>
      </main>

      <Footer />
      <StickyPricingCTA />
    </div>
  );
}
