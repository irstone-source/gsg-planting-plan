'use client';

import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface PlantImageViewerProps {
  scientificName: string;
  commonName: string;
  badgeColor: string;
  badgeText: string;
  wikiImage: string;
}

export function PlantImageViewer({ scientificName, commonName, badgeColor, badgeText, wikiImage }: PlantImageViewerProps) {
  const googleSearchQuery = `${scientificName} ${commonName}`.replace(/ /g, '+');

  // Construct proper Wikimedia Commons thumbnail URL
  // Using the thumbnail endpoint with proper encoding
  const imageUrl = `https://commons.wikimedia.org/w/thumb.php?f=${encodeURIComponent(wikiImage)}&width=800`;

  return (
    <div>
      {/* Image Container with Wikimedia Commons image - Clickable */}
      <a
        href={`https://commons.wikimedia.org/wiki/File:${wikiImage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative h-48 bg-gradient-to-br from-green-100 to-green-50 block group cursor-pointer overflow-hidden"
      >
        <img
          src={imageUrl}
          alt={`${scientificName} - ${commonName}`}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            // Show a visible message when image fails
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              const msg = document.createElement('div');
              msg.className = 'absolute inset-0 flex flex-col items-center justify-center p-4 text-center';
              msg.innerHTML = `<p class="text-sm font-medium text-green-800 mb-1">${scientificName}</p><p class="text-xs text-green-600">Click to view images on Wikimedia</p>`;
              parent.appendChild(msg);
            }
          }}
        />

        {/* Overlay hint on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center pointer-events-none">
          <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 px-3 py-1 rounded">
            Click for more images
          </span>
        </div>

        {/* Only badge on image */}
        <div className="absolute top-2 right-2 z-10">
          <Badge className={badgeColor}>{badgeText}</Badge>
        </div>
      </a>

      {/* Controls Below Image */}
      <div className="bg-gray-50 border-t px-3 py-2">
        <div className="flex items-center justify-center gap-2 text-xs">
          <span className="text-gray-600">Image source:</span>

          {/* Wikimedia Commons credit */}
          <a
            href={`https://commons.wikimedia.org/wiki/File:${wikiImage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-800 font-medium flex items-center gap-1"
          >
            Wikimedia Commons
          </a>

          <span className="text-gray-400">|</span>

          {/* Google Images Link */}
          <a
            href={`https://www.google.com/search?q=${googleSearchQuery}&tbm=isch`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            More photos
          </a>

          <span className="text-gray-400">|</span>

          {/* RHS Link */}
          <a
            href={`https://www.rhs.org.uk/plants/search-results?query=${scientificName.replace(/ /g, '+')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            RHS
          </a>
        </div>
      </div>
    </div>
  );
}
