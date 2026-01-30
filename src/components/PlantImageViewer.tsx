'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Camera } from 'lucide-react';
import Image from 'next/image';

interface PlantImageViewerProps {
  scientificName: string;
  commonName: string;
  badgeColor: string;
  badgeText: string;
  imageUrl?: string;
}

export function PlantImageViewer({ scientificName, commonName, badgeColor, badgeText }: PlantImageViewerProps) {
  const googleSearchQuery = `${scientificName} ${commonName}`.replace(/ /g, '+');

  // Convert scientific name to slug for image paths
  const plantSlug = scientificName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // State for view and maturity selection
  const [view, setView] = useState<'top' | 'front' | 'side'>('front');
  const [maturity, setMaturity] = useState<1 | 3 | 5>(3);

  // Determine image path
  const getImagePath = () => {
    if (view === 'front' && maturity === 3) {
      return `/plants/${plantSlug}/main.jpg`;
    }
    return `/plants/${plantSlug}/${view}-${maturity}yr.jpg`;
  };

  // Generate a consistent color based on plant name for fallback
  const getGradientColors = (name: string) => {
    const colors = [
      ['from-emerald-100', 'to-green-50'],
      ['from-green-100', 'to-teal-50'],
      ['from-lime-100', 'to-green-50'],
      ['from-cyan-100', 'to-emerald-50'],
      ['from-teal-100', 'to-green-50'],
      ['from-green-100', 'to-lime-50'],
      ['from-emerald-100', 'to-cyan-50'],
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const [fromColor, toColor] = getGradientColors(scientificName);
  const [imageError, setImageError] = useState(false);

  return (
    <div>
      {/* Image Display */}
      <div className="relative h-48 bg-gray-50 overflow-hidden">
        {!imageError ? (
          <Image
            src={getImagePath()}
            alt={`${scientificName} (${commonName}) - ${view} view, ${maturity} years`}
            fill
            className="object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          // Gradient fallback if image not yet generated
          <a
            href={`https://www.google.com/search?q=${googleSearchQuery}&tbm=isch`}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative h-full bg-gradient-to-br ${fromColor} ${toColor} block group cursor-pointer`}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <Camera className="h-12 w-12 text-green-300 mb-3 opacity-40" />
              <p className="text-lg font-bold text-green-900 mb-1 italic">{scientificName}</p>
              <p className="text-sm text-green-700">{commonName}</p>
              <p className="text-xs text-green-600 mt-2">Image generating...</p>
            </div>

            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center pointer-events-none">
              <span className="text-green-900 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow-lg">
                Click to view images →
              </span>
            </div>
          </a>
        )}

        {/* Badge */}
        <div className="absolute top-2 right-2 z-10">
          <Badge className={badgeColor}>{badgeText}</Badge>
        </div>
      </div>

      {/* View and Maturity Controls */}
      <div className="bg-white border-t px-3 py-3 space-y-2">
        {/* View Selection */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 w-16">View:</span>
          <div className="flex gap-1 flex-1">
            <button
              onClick={() => setView('top')}
              className={`px-2 py-1 text-xs rounded ${
                view === 'top'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Top
            </button>
            <button
              onClick={() => setView('front')}
              className={`px-2 py-1 text-xs rounded ${
                view === 'front'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Front
            </button>
            <button
              onClick={() => setView('side')}
              className={`px-2 py-1 text-xs rounded ${
                view === 'side'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Side
            </button>
          </div>
        </div>

        {/* Maturity Selection */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 w-16">Growth:</span>
          <div className="flex gap-1 flex-1">
            <button
              onClick={() => setMaturity(1)}
              className={`px-2 py-1 text-xs rounded ${
                maturity === 1
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              1 Year
            </button>
            <button
              onClick={() => setMaturity(3)}
              className={`px-2 py-1 text-xs rounded ${
                maturity === 3
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              3 Years
            </button>
            <button
              onClick={() => setMaturity(5)}
              className={`px-2 py-1 text-xs rounded ${
                maturity === 5
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              5 Years
            </button>
          </div>
        </div>
      </div>

      {/* External Links */}
      <div className="bg-gray-50 border-t px-3 py-2">
        <div className="flex items-center justify-center gap-3 text-xs">
          <span className="text-gray-600">More info:</span>
          <a
            href={`https://www.google.com/search?q=${googleSearchQuery}&tbm=isch`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            Google Images
          </a>
          <span className="text-gray-400">|</span>
          <a
            href={`https://www.rhs.org.uk/plants/search-results?query=${scientificName.replace(/ /g, '+')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            RHS Plant Finder
          </a>
        </div>
      </div>
    </div>
  );
}
