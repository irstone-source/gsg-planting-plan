/**
 * Plant Matching Algorithm
 * Filters and scores plants based on site conditions, preferences, and stock availability
 */

import { supabase } from './supabase';

export interface PlantMatchCriteria {
  rhsZone: string;
  sunExposure: string;
  soilType: string;
  moisture: string;
  style?: string;
  maintenanceLevel?: string;
  budgetMin?: number;
  budgetMax?: number;
  areaSqm?: number;
}

export interface PlantMatch {
  id: string;
  botanical_name: string;
  common_name?: string;
  category: string;
  size: string;
  sun_exposure: string[];
  moisture: string[];
  soil_type: string[];
  rhs_zone_min: string;
  rhs_zone_max: string;
  stock_quantity: number;
  price_gbp?: number;
  is_peat_free: boolean;
  match_score: number;
  match_reasons: string[];
}

/**
 * Convert RHS zone to numeric value for comparison
 */
function rhsZoneToNumber(zone: string): number {
  const match = zone.match(/H(\d)/);
  return match ? parseInt(match[1]) : 0;
}

/**
 * Check if plant is compatible with the site's RHS zone
 */
export function isPlantHardy(plantMinZone: string, plantMaxZone: string, siteZone: string): boolean {
  const siteNum = rhsZoneToNumber(siteZone);
  const minNum = rhsZoneToNumber(plantMinZone);
  const maxNum = rhsZoneToNumber(plantMaxZone);

  // Plant is hardy if site zone is within plant's range
  // Lower H numbers = colder, so site must be >= min and <= max
  return siteNum >= minNum && siteNum <= maxNum;
}

/**
 * Calculate match score for a plant based on criteria
 */
function calculateMatchScore(plant: any, criteria: PlantMatchCriteria): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // RHS Zone compatibility (CRITICAL - must match)
  const isHardy = isPlantHardy(plant.rhs_zone_min, plant.rhs_zone_max, criteria.rhsZone);
  if (!isHardy) {
    return { score: 0, reasons: ['Not hardy in this zone'] };
  }
  score += 30;
  reasons.push('Hardy in your zone');

  // Sun exposure match (HIGH PRIORITY)
  if (plant.sun_exposure && plant.sun_exposure.includes(criteria.sunExposure)) {
    score += 25;
    reasons.push('Perfect sun exposure match');
  } else if (plant.sun_exposure && plant.sun_exposure.length > 0) {
    // Partial match for adaptable plants
    if (criteria.sunExposure === 'partial_shade' &&
        (plant.sun_exposure.includes('full_sun') || plant.sun_exposure.includes('full_shade'))) {
      score += 15;
      reasons.push('Adaptable to light conditions');
    }
  }

  // Moisture match (MEDIUM PRIORITY)
  if (plant.moisture && plant.moisture.includes(criteria.moisture)) {
    score += 15;
    reasons.push('Suitable moisture requirements');
  }

  // Soil type match (MEDIUM PRIORITY)
  if (plant.soil_type && plant.soil_type.includes(criteria.soilType)) {
    score += 15;
    reasons.push('Thrives in your soil type');
  } else if (plant.soil_type && plant.soil_type.includes('versatile')) {
    score += 10;
    reasons.push('Adaptable to various soils');
  }

  // Stock availability (PRACTICAL)
  if (plant.stock_quantity > 100) {
    score += 10;
    reasons.push('Good stock availability');
  } else if (plant.stock_quantity > 0) {
    score += 5;
    reasons.push('In stock');
  } else {
    score -= 20;
    reasons.push('Out of stock');
  }

  // Peat-free bonus (SUSTAINABILITY)
  if (plant.is_peat_free) {
    score += 5;
    reasons.push('Peat-free option');
  }

  return { score, reasons };
}

/**
 * Filter plants by maintenance level
 */
function filterByMaintenance(plants: any[], maintenanceLevel?: string): any[] {
  if (!maintenanceLevel) return plants;

  const lowMaintenancePlants = [
    'Geranium', 'Viburnum', 'Lavandula', 'Hebe', 'Betula', 'Acer',
    'Fargesia', 'Rudbeckia', 'Echinacea', 'Sedum', 'Heuchera'
  ];

  const highMaintenancePlants = [
    'Rosa', 'Dahlia', 'Delphinium', 'Clematis', 'Wisteria'
  ];

  return plants.filter(plant => {
    const name = plant.botanical_name.toLowerCase();

    if (maintenanceLevel === 'low') {
      // Prefer low maintenance
      return lowMaintenancePlants.some(genus => name.includes(genus.toLowerCase()));
    } else if (maintenanceLevel === 'high') {
      // Allow all including high maintenance
      return true;
    } else {
      // Medium - exclude high maintenance only
      return !highMaintenancePlants.some(genus => name.includes(genus.toLowerCase()));
    }
  });
}

/**
 * Main plant matching function
 */
export async function matchPlants(criteria: PlantMatchCriteria): Promise<PlantMatch[]> {
  console.log('🌱 Matching plants with criteria:', criteria);

  // Query plants with basic filters at database level
  // Note: Complex scoring still happens in memory, but we reduce initial dataset
  let query = supabase
    .from('plants')
    .select('*')
    .gt('stock_quantity', 0); // Only in-stock plants

  // Add sun exposure filter if criteria is specific (not 'mixed')
  if (criteria.sunExposure && criteria.sunExposure !== 'mixed') {
    query = query.contains('sun_exposure', [criteria.sunExposure]);
  }

  // Safety limit to prevent fetching excessive data
  query = query.limit(500);

  const { data: plants, error } = await query;

  if (error) {
    console.error('❌ Error fetching plants:', error);
    throw new Error(`Failed to fetch plants: ${error.message}`);
  }

  if (!plants || plants.length === 0) {
    console.warn('⚠️ No plants found in database');
    return [];
  }

  console.log(`📊 Found ${plants.length} plants in stock`);

  // Filter by maintenance level
  let filteredPlants = plants;
  if (criteria.maintenanceLevel) {
    filteredPlants = filterByMaintenance(plants, criteria.maintenanceLevel);
    console.log(`🔧 After maintenance filter: ${filteredPlants.length} plants`);
  }

  // Calculate match scores
  const scoredPlants = filteredPlants.map(plant => {
    const { score, reasons } = calculateMatchScore(plant, criteria);
    return {
      ...plant,
      match_score: score,
      match_reasons: reasons,
    };
  });

  // Filter out plants with score < 40 (low quality matches)
  const goodMatches = scoredPlants.filter(p => p.match_score >= 40);
  console.log(`✓ Found ${goodMatches.length} good matches (score >= 40)`);

  // Sort by score descending
  goodMatches.sort((a, b) => b.match_score - a.match_score);

  return goodMatches;
}

/**
 * Get plants by category with matching
 */
export async function matchPlantsByCategory(
  criteria: PlantMatchCriteria,
  categories: string[]
): Promise<Record<string, PlantMatch[]>> {
  const allMatches = await matchPlants(criteria);

  const result: Record<string, PlantMatch[]> = {};

  for (const category of categories) {
    result[category] = allMatches.filter(p => p.category === category);
  }

  return result;
}

/**
 * Get plant diversity recommendations
 * Returns balanced selection across layers: trees, shrubs, herbaceous, ground cover
 */
export function getLayeredSelection(matches: PlantMatch[], areaSqm?: number): {
  trees: PlantMatch[];
  shrubs: PlantMatch[];
  herbaceous: PlantMatch[];
  climbers: PlantMatch[];
  grasses: PlantMatch[];
} {
  const area = areaSqm || 20; // Default 20 sqm

  // Calculate quantities based on area
  const treeCount = Math.floor(area / 20); // 1 tree per 20 sqm
  const shrubCount = Math.floor(area / 4); // 1 shrub per 4 sqm
  const herbaceousCount = Math.floor(area / 1.5); // 1 herbaceous per 1.5 sqm
  const climberCount = Math.ceil(area / 15); // 1 climber per 15 sqm
  const grassCount = Math.floor(area / 5); // 1 grass per 5 sqm

  return {
    trees: matches.filter(p => p.category === 'TREE').slice(0, Math.max(1, treeCount)),
    shrubs: matches.filter(p => p.category === 'SHRUB').slice(0, Math.max(3, shrubCount)),
    herbaceous: matches.filter(p => p.category === 'HERBACEOUS').slice(0, Math.max(5, herbaceousCount)),
    climbers: matches.filter(p => p.category === 'CLIMBER').slice(0, Math.max(1, climberCount)),
    grasses: matches.filter(p => p.category === 'GRASS').slice(0, Math.max(2, grassCount)),
  };
}
