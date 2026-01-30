'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Sparkles } from 'lucide-react';

const exampleCards = [
  {
    slug: 'london-contemporary-urban-oasis',
    title: 'London Contemporary Urban Oasis',
    location: 'London',
    style: 'Contemporary',
    description: 'Modern minimalist design with structured planting',
    coverImage: '/covers/london-contemporary-urban-oasis.jpg'
  },
  {
    slug: 'liverpool-courtyard-jungle',
    title: 'Liverpool Courtyard Jungle',
    location: 'Liverpool',
    style: 'Tropical',
    description: 'Lush tropical-style planting for small spaces',
    coverImage: '/covers/liverpool-courtyard-jungle.jpg'
  },
  {
    slug: 'birmingham-small-space-big-impact',
    title: 'Birmingham Small Space Big Impact',
    location: 'Birmingham',
    style: 'Compact',
    description: 'Maximizing impact in limited urban spaces',
    coverImage: '/covers/birmingham-small-space-big-impact.jpg'
  },
  {
    slug: 'edinburgh-wildlife-haven',
    title: 'Edinburgh Wildlife Haven',
    location: 'Edinburgh',
    style: 'Wildlife',
    description: 'Native planting designed for pollinators',
    coverImage: '/covers/edinburgh-wildlife-haven.jpg'
  }
];

export function HomeExampleCards() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-green-900 mb-4">
          Example Planting Plans
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore professional plans or create your own custom design
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {/* Example Plan Cards */}
        {exampleCards.map((plan) => (
          <Link key={plan.slug} href={`/examples/${plan.slug}`}>
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer h-full">
              {/* AI-Generated Cover Image */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100">
                <Image
                  src={plan.coverImage}
                  alt={plan.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback to gradient if image not yet generated
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/90 text-green-900 border-0">
                    {plan.style}
                  </Badge>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
                    {plan.title}
                  </h3>
                  <div className="flex items-center gap-1 text-white/90 text-sm">
                    <MapPin className="h-3 w-3" />
                    {plan.location}
                  </div>
                </div>
              </div>

              <CardContent className="p-4">
                <p className="text-sm text-gray-600">
                  {plan.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}

        {/* Create Your Own Card */}
        <Link href="/create">
          <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer h-full bg-gradient-to-br from-purple-500 to-pink-500">
            {/* AI-Generated Hero Image */}
            <div className="relative h-56 overflow-hidden">
              <Image
                src="/covers/hero-create-plan.jpg"
                alt="Create Your Own Plan"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-50"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 to-pink-600/80" />

              {/* Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-8 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="h-16 w-16 text-white" />
                </div>
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-bold text-white mb-1">
                  Create Your Own
                </h3>
                <div className="flex items-center gap-1 text-white/90 text-sm">
                  <Sparkles className="h-3 w-3" />
                  Custom Design
                </div>
              </div>
            </div>

            <CardContent className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
              <p className="text-sm text-purple-900 font-medium">
                Start with your preferences and let AI design a perfect plan for your garden
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </section>
  );
}
