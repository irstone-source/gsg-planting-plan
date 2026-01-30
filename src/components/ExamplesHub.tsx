'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Filter, X } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-white/80 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-4">Example Planting Plans</h1>
          <p className="text-xl text-green-50 max-w-3xl">
            Browse professional plans tailored to UK gardens. Filter by size, conditions, style, and maintenance level. More plans added regularly.
          </p>
          <div className="flex gap-4 mt-6">
            <Badge className="bg-white/20 text-white text-sm px-3 py-1">
              26m UK plant growers
            </Badge>
            <Badge className="bg-white/20 text-white text-sm px-3 py-1">
              Coverage: All regions
            </Badge>
            <Badge className="bg-white/20 text-white text-sm px-3 py-1">
              RHS 2026 trends included
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="mb-8 space-y-6">
          {Object.entries(filterCategories).map(([category, config]) => (
            <div key={category} className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {config.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {config.options.map((option: any) => (
                  <button
                    key={option.value}
                    onClick={() => toggleFilter(category, option.value)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      activeFilters[category as keyof typeof activeFilters] === option.value
                        ? 'border-green-600 bg-green-50 text-green-900'
                        : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {option.icon && <span>{option.icon}</span>}
                      <span className="font-medium">{option.label}</span>
                      {option.share && (
                        <Badge variant="outline" className="text-xs">
                          {option.share}
                        </Badge>
                      )}
                    </div>
                    {option.desc && (
                      <div className="text-xs text-gray-600 mt-1">{option.desc}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-3">
              <Badge className="bg-green-600 text-white px-3 py-1">
                {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-bold text-green-700">{filteredExamples.length}</span> of {examples.length} plans
          </p>
        </div>

        {/* Examples Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExamples.map((example) => (
            <Link key={example.slug} href={`/examples/${example.slug}`}>
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group h-full">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={example.coverImage}
                    alt={example.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{example.title}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      {example.location}
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline" className="text-xs">
                      {example.size}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {example.feeling}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {example.maintenance} maintenance
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredExamples.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-600 mb-4">No plans match your selected filters.</p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
