'use client';

import { Badge } from '@/components/ui/badge';
import { ExternalLink, Camera } from 'lucide-react';

interface PlantImageViewerProps {
  scientificName: string;
  commonName: string;
  badgeColor: string;
  badgeText: string;
  imageUrl?: string;
}

export function PlantImageViewer({ scientificName, commonName, badgeColor, badgeText }: PlantImageViewerProps) {
  const googleSearchQuery = `${scientificName} ${commonName}`.replace(/ /g, '+');

  // Generate a consistent color based on plant name
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

  return (
    <div>
      {/* Professional gradient placeholder */}
      <a
        href={`https://www.google.com/search?q=${googleSearchQuery}&tbm=isch`}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative h-48 bg-gradient-to-br ${fromColor} ${toColor} block group cursor-pointer overflow-hidden`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <Camera className="h-12 w-12 text-green-300 mb-3 opacity-40" />
          <p className="text-lg font-bold text-green-900 mb-1 italic">{scientificName}</p>
          <p className="text-sm text-green-700">{commonName}</p>
        </div>

        {/* Overlay hint on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center pointer-events-none">
          <span className="text-green-900 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow-lg">
            Click to view images →
          </span>
        </div>

        {/* Only badge on image */}
        <div className="absolute top-2 right-2 z-10">
          <Badge className={badgeColor}>{badgeText}</Badge>
        </div>
      </a>

      {/* Controls Below Image */}
      <div className="bg-gray-50 border-t px-3 py-2">
        <div className="flex items-center justify-center gap-3 text-xs">
          <span className="text-gray-600">View images:</span>

          {/* Google Images Link */}
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

          {/* RHS Link */}
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
