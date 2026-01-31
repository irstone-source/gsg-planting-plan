'use client';

import { useState, useEffect } from 'react';
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
  const plantSlug = scientificName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const [view, setView] = useState<'top' | 'front' | 'side'>('front');
  const [maturity, setMaturity] = useState<1 | 3 | 5>(3);
  const [imageError, setImageError] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);

  // Generate Wikimedia Commons image URLs for plant thumbnails
  const thumbnailImages = [
    `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(scientificName)}_001.jpg?width=300`,
    `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(scientificName)}_flowers.jpg?width=300`,
    `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(scientificName)}_leaves.jpg?width=300`,
    `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(scientificName)}_habit.jpg?width=300`,
  ];

  const getImagePath = () => {
    if (view === 'front' && maturity === 3) {
      return `/plants/${plantSlug}/main.jpg`;
    }
    return `/plants/${plantSlug}/${view}-${maturity}yr.jpg`;
  };

  return (
    <div className="bg-dark/30 border border-white/5">
      {/* Main Image Display */}
      <div className="relative h-64 bg-dark overflow-hidden">
        {!imageError ? (
          <Image
            src={getImagePath()}
            alt={`${scientificName} (${commonName}) - ${view} view, ${maturity} years`}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <a
            href={`https://www.google.com/search?q=${googleSearchQuery}&tbm=isch`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-full bg-gradient-to-br from-moss/20 to-dark block group cursor-pointer"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <Camera className="h-12 w-12 text-copper/40 mb-3" aria-hidden="true" />
              <p className="text-lg font-heading font-bold text-mist mb-1 italic">{scientificName}</p>
              <p className="text-sm text-copper uppercase tracking-wider">{commonName}</p>
              <p className="text-xs text-stone mt-2">Click to view images</p>
            </div>

            <div className="absolute inset-0 bg-copper bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300" />
          </a>
        )}

        {/* Badge - Architectural Styling */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`${badgeColor} px-3 py-1 text-xs font-heading uppercase tracking-wider`}>
            {badgeText}
          </span>
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="bg-concrete/40 border-t border-white/5 p-3">
        <div className="grid grid-cols-4 gap-2">
          {thumbnailImages.map((thumbUrl, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedThumbnail(idx)}
              className={`relative h-16 overflow-hidden transition-all duration-300 ${
                selectedThumbnail === idx
                  ? 'ring-2 ring-copper'
                  : 'ring-1 ring-white/10 hover:ring-copper/50'
              }`}
            >
              <Image
                src={thumbUrl}
                alt={`${scientificName} view ${idx + 1}`}
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback to gradient placeholder
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-moss/20 to-dark/60" />
            </button>
          ))}
        </div>
      </div>

      {/* View and Maturity Controls - Architectural Styling */}
      <div className="bg-dark/50 border-t border-white/5 px-4 py-4 space-y-3">
        {/* View Selection */}
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider text-stone font-heading w-16">View:</span>
          <div className="flex gap-2 flex-1">
            {(['top', 'front', 'side'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider font-heading transition-all duration-300 ${
                  view === v
                    ? 'bg-copper text-dark'
                    : 'bg-dark/50 border border-white/10 text-stone hover:border-copper hover:text-copper'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Maturity Selection */}
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider text-stone font-heading w-16">Growth:</span>
          <div className="flex gap-2 flex-1">
            {([1, 3, 5] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMaturity(m)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider font-heading transition-all duration-300 ${
                  maturity === m
                    ? 'bg-copper text-dark'
                    : 'bg-dark/50 border border-white/10 text-stone hover:border-copper hover:text-copper'
                }`}
              >
                {m} Year{m > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* External Links - Architectural Styling */}
      <div className="bg-dark/30 border-t border-white/5 px-4 py-3">
        <div className="flex items-center justify-center gap-4 text-xs">
          <span className="text-stone uppercase tracking-wider font-heading">More info:</span>
          <a
            href={`https://www.google.com/search?q=${googleSearchQuery}&tbm=isch`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-copper hover:text-mist font-heading uppercase tracking-wider flex items-center gap-1.5 transition-colors duration-300"
          >
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
            Google Images
          </a>
          <span className="text-white/10">|</span>
          <a
            href={`https://www.rhs.org.uk/plants/search-results?query=${scientificName.replace(/ /g, '+')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-copper hover:text-mist font-heading uppercase tracking-wider flex items-center gap-1.5 transition-colors duration-300"
          >
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
            RHS Plant Finder
          </a>
        </div>
      </div>
    </div>
  );
}
