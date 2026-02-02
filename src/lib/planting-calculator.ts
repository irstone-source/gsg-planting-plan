/**
 * Planting Density Calculator
 * Calculates plant quantities based on style, area, and site context
 */

import { PlantingStyle, SiteContext } from '@/data/planting-rules';

export interface PlantQuantities {
  total: number;
  byLayer: Record<string, number>;
  density: number;
  adjustments: string[];
}

/**
 * Calculate plant quantities for a given style and area
 */
export function calculatePlantQuantities(
  style: PlantingStyle,
  area: number,
  siteContext: SiteContext
): PlantQuantities {
  const adjustments: string[] = [];

  // Calculate base density (midpoint of range)
  const baseDensity = (style.density.plants_per_m2[0] + style.density.plants_per_m2[1]) / 2;

  // Apply context adjustments
  let adjustedDensity = baseDensity;

  // Urban contexts often have better soil and more care → slightly denser
  if (siteContext.context === 'urban') {
    adjustedDensity -= 1;
    adjustments.push('Urban context: density reduced by 1 plant/m² for better spacing');
  }

  // Rural contexts may have poorer soil → slightly sparser
  if (siteContext.context === 'rural') {
    adjustedDensity += 1;
    adjustments.push('Rural context: density increased by 1 plant/m² to compensate for establishment');
  }

  // Soil adjustments
  if (siteContext.soil === 'clay') {
    adjustedDensity -= 0.5;
    adjustments.push('Clay soil: density reduced for slower growth and drainage');
  }

  if (siteContext.soil === 'sandy') {
    adjustedDensity += 0.5;
    adjustments.push('Sandy soil: density increased to compensate for losses');
  }

  // Light adjustments
  if (siteContext.light === 'shade') {
    adjustedDensity -= 1;
    adjustments.push('Shade: density reduced to allow more space per plant');
  }

  // Ensure density stays within reasonable bounds
  adjustedDensity = Math.max(
    style.density.plants_per_m2[0],
    Math.min(style.density.plants_per_m2[1], adjustedDensity)
  );

  // Calculate total plants
  const totalPlants = Math.round(area * adjustedDensity);

  // Distribute by layers based on percentages
  const byLayer: Record<string, number> = {};

  Object.entries(style.layers).forEach(([layerName, config]) => {
    const percentage = config.percentage || 0;
    byLayer[layerName] = Math.round(totalPlants * (percentage / 100));
  });

  // Adjust if total doesn't match due to rounding
  const distributedTotal = Object.values(byLayer).reduce((sum, count) => sum + count, 0);
  if (distributedTotal !== totalPlants) {
    // Add/subtract difference from largest layer
    const largestLayer = Object.entries(byLayer).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    byLayer[largestLayer] += totalPlants - distributedTotal;
  }

  return {
    total: totalPlants,
    byLayer,
    density: adjustedDensity,
    adjustments
  };
}

/**
 * Calculate seed rate for meadow styles
 */
export function calculateSeedRate(
  style: PlantingStyle,
  area: number
): { total_grams: number; rate_per_m2: number } | null {
  if (!style.density.seed_rate_g_per_m2) {
    return null;
  }

  return {
    total_grams: Math.round(area * style.density.seed_rate_g_per_m2),
    rate_per_m2: style.density.seed_rate_g_per_m2
  };
}

/**
 * Calculate spacing between plants
 */
export function calculateSpacing(density: number): {
  grid_spacing_cm: number;
  informal_spacing_cm: number;
} {
  // Grid spacing for formal planting
  const plantsPerSqM = density;
  const areaPerPlant = 10000 / plantsPerSqM; // cm²
  const gridSpacing = Math.sqrt(areaPerPlant);

  // Informal spacing (20% more generous)
  const informalSpacing = gridSpacing * 1.2;

  return {
    grid_spacing_cm: Math.round(gridSpacing),
    informal_spacing_cm: Math.round(informalSpacing)
  };
}

/**
 * Estimate establishment time
 */
export function estimateEstablishmentTime(style: PlantingStyle): {
  years: number;
  description: string;
} {
  const establishmentMap: Record<string, { years: number; description: string }> = {
    oudolf_prairie: {
      years: 2,
      description: 'Prairie plantings typically settle and mature in 2 years. Grasses fill in quickly.'
    },
    chelsea_wildlife: {
      years: 2,
      description: 'Native plantings establish within 2 years. Trees/shrubs take 3-5 years to mature.'
    },
    pearson_meadow: {
      years: 3,
      description: 'Meadows take 3 years to fully establish. Year 1 is often weedy, Year 2 transitions, Year 3 matures.'
    },
    monty_don_cottage: {
      years: 1,
      description: 'Cottage gardens establish quickly (1-2 years) due to vigorous perennials and annuals.'
    },
    chelsea_modern: {
      years: 1,
      description: 'Modern minimal plantings use mature specimens for instant impact. Full cohesion within 1 year.'
    }
  };

  return establishmentMap[style.id] || {
    years: 2,
    description: 'Most perennial plantings establish within 2-3 years.'
  };
}
