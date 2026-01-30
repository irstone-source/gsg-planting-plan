'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Scissors, Droplets, Users, PoundSterling, AlertCircle } from 'lucide-react';

interface CarePreviewProps {
  gardenSize: string; // e.g., "12m × 9m"
  region: string; // e.g., "Edinburgh, Scotland"
  plantCount: number;
  maintenanceLevel: 'low' | 'medium' | 'high';
}

export function CarePreview({ gardenSize, region, plantCount, maintenanceLevel }: CarePreviewProps) {
  // Calculate care hours based on garden size and maintenance level
  const calculateHours = () => {
    const sizeMatch = gardenSize.match(/(\d+)\s*[×x]\s*(\d+)/);
    if (!sizeMatch) return { year1: 20, year2plus: 12 };

    const area = parseInt(sizeMatch[1]) * parseInt(sizeMatch[2]);
    const baseHours = area / 10; // ~1 hour per 10m²

    const multipliers = {
      low: { year1: 0.8, year2plus: 0.5 },
      medium: { year1: 1.2, year2plus: 0.8 },
      high: { year1: 1.8, year2plus: 1.2 }
    };

    const mult = multipliers[maintenanceLevel];
    return {
      year1: Math.round(baseHours * mult.year1),
      year2plus: Math.round(baseHours * mult.year2plus)
    };
  };

  // Pro cost bands based on PGG 2025 guidance
  const getProCostBand = () => {
    const hours = calculateHours();

    // Regional rates (£/hr): London £28.50-£49, SE £27.60-£39.50, Scotland/Wales/Regions £25.50-£39.50
    const regionalRates = {
      'London': { min: 28.50, max: 49 },
      'South East': { min: 27.60, max: 39.50 },
      'East Anglia': { min: 27.60, max: 39.50 },
      'Scotland': { min: 25.50, max: 39.50 },
      'Wales': { min: 25.50, max: 39.50 },
      'default': { min: 25.50, max: 39.50 }
    };

    let rates = regionalRates.default;
    for (const [key, value] of Object.entries(regionalRates)) {
      if (region.includes(key)) {
        rates = value;
        break;
      }
    }

    return {
      year1: {
        min: Math.round(hours.year1 * rates.min),
        max: Math.round(hours.year1 * rates.max)
      },
      year2plus: {
        min: Math.round(hours.year2plus * rates.min),
        max: Math.round(hours.year2plus * rates.max)
      }
    };
  };

  const hours = calculateHours();
  const proCost = getProCostBand();

  const techniques = {
    low: ['Annual mulch', 'Light pruning', 'Seasonal cutback'],
    medium: ['Pruning', 'Dividing perennials', 'Mulching', 'Deadheading', 'Staking'],
    high: ['Regular pruning', 'Intensive deadheading', 'Dividing', 'Staking', 'Mulching', 'Feeding']
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-900">
          <Clock className="h-5 w-5" />
          Care Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Time Investment */}
        <div>
          <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Time Investment
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/70 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-700">{hours.year1}h</div>
              <div className="text-sm text-gray-600">Year 1 (establishment)</div>
            </div>
            <div className="bg-white/70 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-700">{hours.year2plus}h</div>
              <div className="text-sm text-gray-600">Year 2+ (maintenance)</div>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Per year average for a {gardenSize} garden
          </p>
        </div>

        {/* Maintenance Techniques */}
        <div>
          <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            <Scissors className="h-4 w-4" />
            Key Techniques
          </h4>
          <div className="flex flex-wrap gap-2">
            {techniques[maintenanceLevel].map((technique) => (
              <Badge key={technique} variant="outline" className="bg-white/70">
                {technique}
              </Badge>
            ))}
          </div>
        </div>

        {/* DIY Suitability */}
        <div>
          <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" />
            DIY Suitability
          </h4>
          <div className="bg-white/70 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-700">
              <span className="font-medium text-green-700">✓</span> Suitable for healthy homeowners with basic gardening experience
            </p>
            {maintenanceLevel === 'high' && (
              <p className="text-sm text-gray-700">
                <span className="font-medium text-orange-600">!</span> Higher maintenance - consider help for busy periods
              </p>
            )}
            <div className="flex items-start gap-2 text-xs text-gray-600 mt-3 pt-3 border-t">
              <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <span>Mobility considerations: pruning tall shrubs and trees may require ladder work</span>
            </div>
          </div>
        </div>

        {/* Professional Care Cost */}
        <div>
          <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            <PoundSterling className="h-4 w-4" />
            Professional Care Cost Band
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/70 rounded-lg p-4">
              <div className="text-xl font-bold text-green-700">
                £{proCost.year1.min}–£{proCost.year1.max}
              </div>
              <div className="text-sm text-gray-600">Year 1</div>
            </div>
            <div className="bg-white/70 rounded-lg p-4">
              <div className="text-xl font-bold text-green-700">
                £{proCost.year2plus.min}–£{proCost.year2plus.max}
              </div>
              <div className="text-sm text-gray-600">Year 2+</div>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Based on PGG 2025 self-employed recommended rates for {region}
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-gray-700">
          <strong>Note:</strong> Care estimates are indicative. Professional site survey recommended before commissioning work. Actual hours may vary based on soil conditions, access, and plant establishment.
        </div>
      </CardContent>
    </Card>
  );
}
