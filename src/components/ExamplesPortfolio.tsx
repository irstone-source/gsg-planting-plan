'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { examplePlans, tagCategories } from '@/data/example-plans';
import { MapPin, Leaf, Calendar, PoundSterling, Sprout } from 'lucide-react';

export function ExamplesPortfolio() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Filter plans by selected tags
  const filteredPlans = selectedTags.length === 0
    ? examplePlans
    : examplePlans.filter(plan =>
        selectedTags.every(tag => plan.tags.includes(tag))
      );

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setActiveCategory('All');
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-green-900 mb-4">
            Example Planting Plans
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore professional planting plans from across the UK. Each plan is tailored to local
            climate zones, garden styles, and maintenance preferences.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Button
              variant={activeCategory === 'All' ? 'default' : 'outline'}
              onClick={() => {
                setActiveCategory('All');
                setSelectedTags([]);
              }}
              className="rounded-full"
            >
              All Plans
            </Button>
            {Object.keys(tagCategories).map(category => (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'outline'}
                onClick={() => setActiveCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Filter Tags */}
          {activeCategory !== 'All' && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {tagCategories[activeCategory as keyof typeof tagCategories].map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-green-600 hover:text-white transition-colors px-4 py-2 text-sm"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Active Filters */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap justify-center items-center gap-2 mb-4">
              <span className="text-sm text-gray-600">Active filters:</span>
              {selectedTags.map(tag => (
                <Badge
                  key={tag}
                  variant="default"
                  className="cursor-pointer px-3 py-1"
                  onClick={() => toggleTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-green-600 hover:text-green-700"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-green-700">{filteredPlans.length}</span> plan{filteredPlans.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlans.map(plan => (
            <Card
              key={plan.id}
              className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <img
                  src={plan.imageUrl}
                  alt={plan.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-green-600 text-white">
                    {plan.style}
                  </Badge>
                </div>
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-white/90">
                    {plan.rhsZone}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl text-green-900 group-hover:text-green-600 transition-colors">
                  {plan.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 text-sm">
                  <MapPin className="h-4 w-4" />
                  {plan.region} • {plan.postcode}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {plan.description}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Sprout className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600">
                      {plan.totalPlants} plants
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PoundSterling className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600">
                      £{plan.totalCost.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600">
                      {plan.maintenance}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600">
                      {plan.area}m²
                    </span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-700">Highlights:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {plan.highlights.slice(0, 2).map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t">
                  {plan.tags.slice(0, 4).map(tag => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs px-2 py-0.5 cursor-pointer hover:bg-green-50 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTag(tag);
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {plan.tags.length > 4 && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      +{plan.tags.length - 4}
                    </Badge>
                  )}
                </div>

                {/* CTA - Coming Soon */}
                <Button
                  variant="outline"
                  className="w-full mt-4 group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-colors"
                  disabled
                >
                  View Full Plan (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredPlans.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4">No plans match your selected filters.</p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-green-600 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">
            Create Your Own Custom Planting Plan
          </h3>
          <p className="text-xl mb-8 text-green-50 max-w-2xl mx-auto">
            Get a professional planting plan tailored specifically to your garden's conditions,
            your style preferences, and your local climate zone.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-green-700 hover:bg-green-50 text-lg px-8 py-6"
            onClick={() => window.location.href = '/create'}
          >
            Start Creating Your Plan →
          </Button>
          <p className="text-sm mt-4 text-green-100">
            Takes 5 minutes • Professional results • Download PDF instantly
          </p>
        </div>
      </div>
    </section>
  );
}
