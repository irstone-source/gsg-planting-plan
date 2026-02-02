/**
 * Machine-Readable Planting Rules
 * Defines planting styles with density, layers, and principles
 */

export interface PlantingStyle {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  maintenance: 'low' | 'medium' | 'high';
  density: {
    plants_per_m2: [number, number]; // [min, max]
    seed_rate_g_per_m2?: number; // For meadows
  };
  layers: {
    [layerName: string]: {
      min: number;
      max: number;
      percentage?: number;
    };
  };
  principles: string[];
}

export interface SiteContext {
  context: 'urban' | 'suburban' | 'rural';
  soil: 'clay' | 'loam' | 'sandy';
  light: 'full_sun' | 'partial_shade' | 'shade';
  area_m2: number;
}

/**
 * Planting style definitions
 */
export const plantingStyles: Record<string, PlantingStyle> = {
  oudolf_prairie: {
    id: 'oudolf_prairie',
    name: 'Piet Oudolf Prairie',
    difficulty: 'intermediate',
    maintenance: 'medium',
    density: {
      plants_per_m2: [8, 12]
    },
    layers: {
      structural_grasses: { min: 2, max: 3, percentage: 35 },
      dominant_perennials: { min: 3, max: 4, percentage: 40 },
      matrix_plants: { min: 4, max: 6, percentage: 20 },
      accent_plants: { min: 1, max: 2, percentage: 5 }
    },
    principles: [
      'structure_over_flower',
      'winter_interest_required',
      'repetition_required',
      'late_cutback_only',
      'no_staking',
      'grasses_dominate'
    ]
  },

  chelsea_wildlife: {
    id: 'chelsea_wildlife',
    name: 'Chelsea Wildlife Haven',
    difficulty: 'beginner',
    maintenance: 'low',
    density: {
      plants_per_m2: [9, 14]
    },
    layers: {
      native_trees_shrubs: { min: 1, max: 2, percentage: 30 },
      native_wildflowers: { min: 4, max: 6, percentage: 50 },
      native_groundcover: { min: 2, max: 4, percentage: 15 },
      accent_natives: { min: 1, max: 2, percentage: 5 }
    },
    principles: [
      'native_priority',
      'three_dimensional_layering',
      'year_round_food_sources',
      'no_pesticides',
      'peat_free',
      'wildlife_pond_beneficial'
    ]
  },

  pearson_meadow: {
    id: 'pearson_meadow',
    name: 'Dan Pearson Wildflower Meadow',
    difficulty: 'beginner',
    maintenance: 'low',
    density: {
      plants_per_m2: [10, 14],
      seed_rate_g_per_m2: 4.5 // Yellow rattle + wildflower mix
    },
    layers: {
      meadow_grasses: { min: 3, max: 5, percentage: 55 },
      core_wildflowers: { min: 4, max: 6, percentage: 35 },
      accent_wildflowers: { min: 1, max: 2, percentage: 8 },
      nitrogen_fixers: { min: 0, max: 1, percentage: 2 }
    },
    principles: [
      'plant_communities',
      'soil_fertility_low',
      'minimal_intervention',
      'annual_cut_only',
      'grasses_are_framework',
      'three_year_establishment'
    ]
  },

  monty_don_cottage: {
    id: 'monty_don_cottage',
    name: 'Monty Don Cottage Garden',
    difficulty: 'intermediate',
    maintenance: 'medium',
    density: {
      plants_per_m2: [7, 11]
    },
    layers: {
      roses_climbers: { min: 1, max: 2, percentage: 25 },
      cottage_perennials: { min: 4, max: 6, percentage: 55 },
      edibles_herbs: { min: 1, max: 2, percentage: 10 },
      informal_fillers: { min: 2, max: 3, percentage: 10 }
    },
    principles: [
      'romantic_abundance',
      'self_seeding_encouraged',
      'scent_priority',
      'traditional_combinations',
      'regular_deadheading',
      'mixed_ornamental_edible'
    ]
  },

  chelsea_modern: {
    id: 'chelsea_modern',
    name: 'Chelsea Modern Minimalist',
    difficulty: 'intermediate',
    maintenance: 'medium',
    density: {
      plants_per_m2: [5, 8]
    },
    layers: {
      architectural_focal: { min: 1, max: 2, percentage: 45 },
      restrained_perennials: { min: 2, max: 3, percentage: 35 },
      evergreen_structure: { min: 1, max: 2, percentage: 15 },
      clean_groundcover: { min: 1, max: 2, percentage: 5 }
    },
    principles: [
      'less_is_more',
      'limited_palette',
      'generous_blocks',
      'evergreen_framework',
      'geometric_arrangements',
      'year_round_structure'
    ]
  }
};

/**
 * Get planting style by ID
 */
export function getPlantingStyle(styleId: string): PlantingStyle | null {
  return plantingStyles[styleId] || null;
}

/**
 * Get all available planting styles
 */
export function getAllPlantingStyles(): PlantingStyle[] {
  return Object.values(plantingStyles);
}

/**
 * Map designer style slug to planting rule ID
 */
export function getPlantingRuleId(designerStyleSlug: string): string | null {
  const mapping: Record<string, string> = {
    'piet-oudolf-prairie': 'oudolf_prairie',
    'chelsea-wildlife-haven': 'chelsea_wildlife',
    'dan-pearson-meadow': 'pearson_meadow',
    'monty-don-cottage': 'monty_don_cottage',
    'chelsea-2023-gold-modern': 'chelsea_modern',
    'chelsea-urban-retreat': 'chelsea_modern'
  };

  return mapping[designerStyleSlug] || null;
}
