'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, X, Check } from 'lucide-react';
import { Header, Footer, RevealSection } from '@/components/architectural';

export function ExamplesHub() {
  const [activeFilters, setActiveFilters] = useState<{
    size?: string;
    constraint?: string;
    feeling?: string;
    maintenance?: string;
    trend?: string;
  }>({});

  const filterCategories = {
    size: {
      label: 'Garden Size',
      options: [
        { value: 'small', label: 'Small (0-60m²)', share: '15%' },
        { value: 'medium', label: 'Medium (60-150m²)', share: '28%' },
        { value: 'family', label: 'Family (150-300m²)', share: '37%' },
        { value: 'large', label: 'Large (300m²+)', share: '20%' }
      ]
    },
    constraint: {
      label: 'Site Conditions',
      options: [
        { value: 'clay', label: 'Clay Soil', share: '29%', icon: '🏺' },
        { value: 'shade', label: 'Shade', share: '15%', icon: '🌳' },
        { value: 'dry', label: 'Dry', share: '25%', icon: '☀️' },
        { value: 'wet', label: 'Wet/Moist', share: '24%', icon: '💧' },
        { value: 'windy', label: 'Windy/Exposed', share: '9%', icon: '💨' },
        { value: 'general', label: 'General Conditions', share: '27%', icon: '✓' }
      ]
    },
    feeling: {
      label: 'Garden Feeling',
      options: [
        { value: 'wildlife', label: 'Wildlife/Naturalistic', share: '21%', icon: '🦋' },
        { value: 'lush', label: 'Lush Green', share: '18%', icon: '🌿' },
        { value: 'calm', label: 'Calm/Zen', share: '17%', icon: '🧘' },
        { value: 'colour', label: 'Colour/Seasonal', share: '17%', icon: '🌸' },
        { value: 'edible', label: 'Edible/Useful', share: '14%', icon: '🥬' },
        { value: 'tidy', label: 'Tidy/Structured', share: '13%', icon: '📐' }
      ]
    },
    maintenance: {
      label: 'Maintenance',
      options: [
        { value: 'low', label: 'Low', share: '32%' },
        { value: 'medium', label: 'Medium', share: '51%' },
        { value: 'high', label: 'High', share: '17%' }
      ]
    },
    trend: {
      label: 'Style Pack',
      options: [
        { value: 'climate-resilient', label: 'Climate-Resilient', share: '23%', desc: 'Drought-tolerant, water-wise' },
        { value: 'naturalistic', label: 'Naturalistic', share: '23%', desc: 'Wildlife-friendly, native' },
        { value: 'warm-minimalism', label: 'Warm Minimalism', share: '22%', desc: 'Restrained palette, texture' },
        { value: 'maximalist', label: 'Maximalist', share: '18%', desc: 'Layered abundance' },
        { value: 'compact-edibles', label: 'Compact Edibles', share: '14%', desc: 'Raised beds, dwarf crops' }
      ]
    }
  };

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: prev[category as keyof typeof prev] === value ? undefined : value
    }));
  };

  const clearFilters = () => setActiveFilters({});

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  // All 13 example plans from data with filter mappings
  const examples = [
    {
      slug: 'london-contemporary-urban-oasis',
      title: 'Contemporary Urban Oasis',
      location: 'South London',
      size: 'medium',
      constraint: 'general',
      feeling: 'calm',
      maintenance: 'low',
      trend: 'warm-minimalism',
      coverImage: '/covers/london-contemporary-urban-oasis.jpg'
    },
    {
      slug: 'liverpool-courtyard-jungle',
      title: 'Courtyard Jungle',
      location: 'Liverpool',
      size: 'small',
      constraint: 'shade',
      feeling: 'lush',
      maintenance: 'medium',
      trend: 'maximalist',
      coverImage: '/covers/liverpool-courtyard-jungle.jpg'
    },
    {
      slug: 'birmingham-small-space-big-impact',
      title: 'Small Space, Big Impact',
      location: 'Birmingham',
      size: 'small',
      constraint: 'general',
      feeling: 'tidy',
      maintenance: 'low',
      trend: 'warm-minimalism',
      coverImage: '/covers/birmingham-small-space-big-impact.jpg'
    },
    {
      slug: 'brighton-coastal-calm-courtyard',
      title: 'Coastal Calm Courtyard',
      location: 'Brighton',
      size: 'medium',
      constraint: 'windy',
      feeling: 'calm',
      maintenance: 'low',
      trend: 'climate-resilient',
      coverImage: '/covers/brighton-coastal-calm-courtyard.jpg'
    },
    {
      slug: 'bournemouth-seaside-shelter-planting',
      title: 'Seaside Shelter Planting',
      location: 'Bournemouth',
      size: 'family',
      constraint: 'windy',
      feeling: 'wildlife',
      maintenance: 'medium',
      trend: 'naturalistic',
      coverImage: '/covers/bournemouth-seaside-shelter-planting.jpg'
    },
    {
      slug: 'plymouth-sheltered-coastal-oasis',
      title: 'Sheltered Coastal Oasis',
      location: 'Plymouth',
      size: 'medium',
      constraint: 'general',
      feeling: 'lush',
      maintenance: 'medium',
      trend: 'naturalistic',
      coverImage: '/covers/plymouth-sheltered-coastal-oasis.jpg'
    },
    {
      slug: 'edinburgh-scottish-wildlife-haven',
      title: 'Scottish Wildlife Haven',
      location: 'Edinburgh',
      size: 'family',
      constraint: 'wet',
      feeling: 'wildlife',
      maintenance: 'medium',
      trend: 'naturalistic',
      coverImage: '/covers/edinburgh-scottish-wildlife-haven.jpg'
    },
    {
      slug: 'glasgow-wet-winter-proof-framework',
      title: 'Wet Winter-Proof Framework',
      location: 'Glasgow',
      size: 'large',
      constraint: 'wet',
      feeling: 'tidy',
      maintenance: 'low',
      trend: 'climate-resilient',
      coverImage: '/covers/glasgow-wet-winter-proof-framework.jpg'
    },
    {
      slug: 'aberdeen-very-hardy-coastal-structure',
      title: 'Very Hardy Coastal Structure',
      location: 'Aberdeen',
      size: 'family',
      constraint: 'windy',
      feeling: 'tidy',
      maintenance: 'low',
      trend: 'climate-resilient',
      coverImage: '/covers/aberdeen-very-hardy-coastal-structure.jpg'
    },
    {
      slug: 'inverness-highland-hardy-woodland',
      title: 'Highland Hardy Woodland',
      location: 'Inverness',
      size: 'large',
      constraint: 'wet',
      feeling: 'wildlife',
      maintenance: 'low',
      trend: 'naturalistic',
      coverImage: '/covers/inverness-highland-hardy-woodland.jpg'
    },
    {
      slug: 'cardiff-rain-friendly-wildlife-garden',
      title: 'Rain-Friendly Wildlife Garden',
      location: 'Cardiff',
      size: 'family',
      constraint: 'wet',
      feeling: 'wildlife',
      maintenance: 'medium',
      trend: 'naturalistic',
      coverImage: '/covers/cardiff-rain-friendly-wildlife-garden.jpg'
    },
    {
      slug: 'swansea-family-coastal-garden',
      title: 'Family Coastal Garden',
      location: 'Swansea',
      size: 'large',
      constraint: 'windy',
      feeling: 'tidy',
      maintenance: 'medium',
      trend: 'climate-resilient',
      coverImage: '/covers/swansea-family-coastal-garden.jpg'
    },
    {
      slug: 'exeter-dry-summer-mediterranean-border',
      title: 'Dry-Summer Mediterranean Border',
      location: 'Exeter',
      size: 'family',
      constraint: 'dry',
      feeling: 'tidy',
      maintenance: 'low',
      trend: 'climate-resilient',
      coverImage: '/covers/exeter-dry-summer-mediterranean-border.jpg'
    },
    {
      slug: 'bath-cotswold-stone-and-scent',
      title: 'Cotswold Stone & Scent',
      location: 'Bath',
      size: 'family',
      constraint: 'general',
      feeling: 'calm',
      maintenance: 'medium',
      trend: 'warm-minimalism',
      coverImage: '/covers/bath-cotswold-stone-and-scent.jpg'
    }
  ];

  // Filter examples
  const filteredExamples = examples.filter(example => {
    if (activeFilters.size && example.size !== activeFilters.size) return false;
    if (activeFilters.constraint && example.constraint !== activeFilters.constraint) return false;
    if (activeFilters.feeling && example.feeling !== activeFilters.feeling) return false;
    if (activeFilters.maintenance && example.maintenance !== activeFilters.maintenance) return false;
    if (activeFilters.trend && example.trend !== activeFilters.trend) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-dark text-mist">
      <Header />

      {/* Hero Section */}
      <RevealSection className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider font-bold text-mist mb-6">
              EXAMPLE PLANTING PLANS
            </h1>
            <p className="text-lg md:text-xl text-stone leading-relaxed max-w-3xl mb-8">
              Browse 14 professional plans tailored to UK gardens. Filter by size, conditions, style, and maintenance level. All plans designed for UK hardiness zones 7-9.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-copper/10 border border-copper/30 px-4 py-2">
                <span className="text-sm uppercase tracking-wider text-copper">26M UK Growers</span>
              </div>
              <div className="bg-moss/10 border border-moss/30 px-4 py-2">
                <span className="text-sm uppercase tracking-wider text-mist">All UK Regions</span>
              </div>
              <div className="bg-copper/10 border border-copper/30 px-4 py-2">
                <span className="text-sm uppercase tracking-wider text-copper">RHS 2026 Trends</span>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Filters Section */}
      <div className="bg-concrete/40 py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-8">
            {Object.entries(filterCategories).map(([category, config]) => (
              <fieldset key={category} className="space-y-4">
                <legend className="font-heading text-sm uppercase tracking-widest text-copper mb-4">
                  {config.label}
                </legend>
                <div className="flex flex-wrap gap-3" role="group" aria-label={config.label}>
                  {config.options.map((option: any) => {
                    const isActive = activeFilters[category as keyof typeof activeFilters] === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => toggleFilter(category, option.value)}
                        aria-pressed={isActive}
                        aria-label={`Filter by ${option.label}${option.share ? `, ${option.share} of plans` : ''}`}
                        className={`
                          px-4 py-3 border transition-all duration-300
                          focus:outline-none focus:ring-2 focus:ring-copper focus:ring-offset-2 focus:ring-offset-dark
                          ${isActive
                            ? 'border-copper bg-copper/10 text-mist'
                            : 'border-white/10 bg-dark/50 text-stone hover:border-copper/50 hover:text-mist'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2">
                          {isActive && <Check className="h-4 w-4 text-copper" aria-hidden="true" />}
                          {option.icon && <span aria-hidden="true">{option.icon}</span>}
                          <span className="font-heading text-xs uppercase tracking-wider">
                            {option.label}
                          </span>
                          {option.share && (
                            <span className="text-[10px] text-stone/60" aria-label={`${option.share} of plans`}>
                              {option.share}
                            </span>
                          )}
                        </div>
                        {option.desc && (
                          <div className="text-xs text-stone/80 mt-1 text-left">{option.desc}</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            {/* Active Filters & Clear */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="text-sm text-stone">
                Showing <span className="font-bold text-copper">{filteredExamples.length}</span> of {examples.length} plans
                {activeFilterCount > 0 && (
                  <span className="ml-2">
                    ({activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active)
                  </span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-sm uppercase tracking-wider text-stone hover:text-mist transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-copper"
                  aria-label="Clear all filters"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Examples Grid */}
      <RevealSection className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {filteredExamples.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredExamples.map((example, index) => (
                  <motion.div
                    key={example.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={`/examples/${example.slug}`}
                      className="group block h-full focus:outline-none focus:ring-2 focus:ring-copper focus:ring-offset-2 focus:ring-offset-dark"
                    >
                      <div className="bg-concrete/60 backdrop-blur-md border border-white/5 overflow-hidden h-full transition-all duration-500 hover:border-copper/30">
                        {/* Image */}
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={example.coverImage}
                            alt={`${example.title} planting plan for ${example.location}`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          {/* Strong gradient for text visibility */}
                          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />

                          {/* Title overlay - high contrast */}
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h2 className="font-heading text-xl uppercase tracking-wider font-bold text-mist mb-2 drop-shadow-lg">
                              {example.title}
                            </h2>
                            <div className="flex items-center gap-2 text-stone">
                              <MapPin className="h-4 w-4 text-copper" aria-hidden="true" />
                              <span className="text-sm uppercase tracking-wider">{example.location}</span>
                            </div>
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className="p-6 space-y-3">
                          <div className="flex flex-wrap gap-2">
                            <span className="bg-dark/50 border border-white/10 px-3 py-1 text-xs uppercase tracking-wider text-stone">
                              {example.size}
                            </span>
                            <span className="bg-dark/50 border border-white/10 px-3 py-1 text-xs uppercase tracking-wider text-stone">
                              {example.feeling}
                            </span>
                            <span className="bg-dark/50 border border-white/10 px-3 py-1 text-xs uppercase tracking-wider text-stone">
                              {example.maintenance}
                            </span>
                          </div>

                          {/* View link */}
                          <div className="flex items-center gap-2 text-copper text-sm uppercase tracking-wider font-bold">
                            View Plan
                            <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-concrete/60 backdrop-blur-md border-2 border-dashed border-white/10">
                <p className="text-stone text-lg mb-6">No plans match your selected filters.</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-copper text-dark text-sm uppercase tracking-wider font-bold hover:bg-[#D4A373] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-copper"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </RevealSection>

      <Footer />
    </div>
  );
}
