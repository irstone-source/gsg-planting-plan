/**
 * Species-Specific Rendering Presets
 * These presets ensure visual differentiation even when using the same outline geometry
 * Based on botanical characteristics: leaf habit, texture, density, winter interest
 */

import type { LeafHabit, CrownTexture, WinterInterest } from '../plant-data/types';

export interface PlantRenderingPreset {
  botanical_name: string;
  leaf_habit: LeafHabit;
  crown_texture: CrownTexture;
  crown_density_value: number;    // 0..1 (0.2=airy, 0.85=dense)
  winter_interest?: WinterInterest;
  cluster_size_modifier: number;  // Multiplier for cluster blob size
  cluster_spacing_modifier: number; // Affects Poisson disk min distance
}

/**
 * Curated presets for common landscape plants
 * Ensures distinct rendering despite potentially similar outlines
 */
export const PLANT_PRESETS: Record<string, PlantRenderingPreset> = {
  // BIRCHES - Fine texture, airy, white bark winter interest
  'Betula pendula': {
    botanical_name: 'Betula pendula',
    leaf_habit: 'deciduous',
    crown_texture: 'fine',
    crown_density_value: 0.35,
    winter_interest: 'white_bark',
    cluster_size_modifier: 0.8,
    cluster_spacing_modifier: 1.2
  },
  'Betula pubescens': {
    botanical_name: 'Betula pubescens',
    leaf_habit: 'deciduous',
    crown_texture: 'fine',
    crown_density_value: 0.40,
    winter_interest: 'white_bark',
    cluster_size_modifier: 0.85,
    cluster_spacing_modifier: 1.15
  },

  // DOGWOODS - Medium texture, red stems in winter
  'Cornus alba': {
    botanical_name: 'Cornus alba',
    leaf_habit: 'deciduous',
    crown_texture: 'medium',
    crown_density_value: 0.65,
    winter_interest: 'red_stems',
    cluster_size_modifier: 1.1,
    cluster_spacing_modifier: 0.9
  },
  'Cornus sanguinea': {
    botanical_name: 'Cornus sanguinea',
    leaf_habit: 'deciduous',
    crown_texture: 'medium',
    crown_density_value: 0.70,
    winter_interest: 'red_stems',
    cluster_size_modifier: 1.15,
    cluster_spacing_modifier: 0.85
  },

  // VIBURNUMS - Medium-coarse texture, semi-evergreen options
  'Viburnum tinus': {
    botanical_name: 'Viburnum tinus',
    leaf_habit: 'evergreen',
    crown_texture: 'medium',
    crown_density_value: 0.75,
    winter_interest: 'flowers',
    cluster_size_modifier: 1.2,
    cluster_spacing_modifier: 0.8
  },
  'Viburnum opulus': {
    botanical_name: 'Viburnum opulus',
    leaf_habit: 'deciduous',
    crown_texture: 'medium',
    crown_density_value: 0.68,
    winter_interest: 'berries',
    cluster_size_modifier: 1.15,
    cluster_spacing_modifier: 0.9
  },

  // OAKS - Medium-coarse texture, dense canopy
  'Quercus robur': {
    botanical_name: 'Quercus robur',
    leaf_habit: 'deciduous',
    crown_texture: 'coarse',
    crown_density_value: 0.80,
    winter_interest: null,
    cluster_size_modifier: 1.3,
    cluster_spacing_modifier: 0.75
  },
  'Quercus ilex': {
    botanical_name: 'Quercus ilex',
    leaf_habit: 'evergreen',
    crown_texture: 'medium',
    crown_density_value: 0.85,
    winter_interest: 'evergreen',
    cluster_size_modifier: 1.25,
    cluster_spacing_modifier: 0.8
  },

  // MAPLES - Medium texture, good autumn color
  'Acer platanoides': {
    botanical_name: 'Acer platanoides',
    leaf_habit: 'deciduous',
    crown_texture: 'medium',
    crown_density_value: 0.75,
    winter_interest: null,
    cluster_size_modifier: 1.1,
    cluster_spacing_modifier: 0.9
  },
  'Acer pseudoplatanus': {
    botanical_name: 'Acer pseudoplatanus',
    leaf_habit: 'deciduous',
    crown_texture: 'medium',
    crown_density_value: 0.78,
    winter_interest: null,
    cluster_size_modifier: 1.15,
    cluster_spacing_modifier: 0.88
  },

  // PINES - Needle texture, evergreen, very dense
  'Pinus sylvestris': {
    botanical_name: 'Pinus sylvestris',
    leaf_habit: 'evergreen',
    crown_texture: 'needle',
    crown_density_value: 0.60,
    winter_interest: 'evergreen',
    cluster_size_modifier: 0.9,
    cluster_spacing_modifier: 1.1
  },

  // HOLLIES - Fine texture, evergreen, berries
  'Ilex aquifolium': {
    botanical_name: 'Ilex aquifolium',
    leaf_habit: 'evergreen',
    crown_texture: 'fine',
    crown_density_value: 0.82,
    winter_interest: 'berries',
    cluster_size_modifier: 0.95,
    cluster_spacing_modifier: 1.05
  },

  // WILLOWS - Very fine texture, airy canopy
  'Salix alba': {
    botanical_name: 'Salix alba',
    leaf_habit: 'deciduous',
    crown_texture: 'fine',
    crown_density_value: 0.45,
    winter_interest: null,
    cluster_size_modifier: 0.75,
    cluster_spacing_modifier: 1.3
  },

  // ROSES - Fine texture, semi-evergreen, varied density
  'Rosa canina': {
    botanical_name: 'Rosa canina',
    leaf_habit: 'deciduous',
    crown_texture: 'fine',
    crown_density_value: 0.55,
    winter_interest: 'berries',
    cluster_size_modifier: 0.85,
    cluster_spacing_modifier: 1.15
  },

  // LAVENDER - Fine texture, semi-evergreen, low density
  'Lavandula angustifolia': {
    botanical_name: 'Lavandula angustifolia',
    leaf_habit: 'semi_evergreen',
    crown_texture: 'fine',
    crown_density_value: 0.40,
    winter_interest: null,
    cluster_size_modifier: 0.7,
    cluster_spacing_modifier: 1.4
  },

  // YEW - Needle texture, evergreen, very dense
  'Taxus baccata': {
    botanical_name: 'Taxus baccata',
    leaf_habit: 'evergreen',
    crown_texture: 'needle',
    crown_density_value: 0.90,
    winter_interest: 'evergreen',
    cluster_size_modifier: 1.0,
    cluster_spacing_modifier: 0.95
  }
};

/**
 * Get rendering preset for a species, with fallback to defaults
 */
export function getPlantPreset(botanical_name: string): PlantRenderingPreset {
  const preset = PLANT_PRESETS[botanical_name];

  if (preset) {
    return preset;
  }

  // Fallback defaults for unknown species
  return {
    botanical_name,
    leaf_habit: 'deciduous',
    crown_texture: 'medium',
    crown_density_value: 0.65,
    winter_interest: null,
    cluster_size_modifier: 1.0,
    cluster_spacing_modifier: 1.0
  };
}

/**
 * Update preset dynamically (for verified improvements from evidence photos)
 */
export function updatePreset(
  botanical_name: string,
  updates: Partial<Omit<PlantRenderingPreset, 'botanical_name'>>
): PlantRenderingPreset {
  const current = getPlantPreset(botanical_name);
  return {
    ...current,
    ...updates,
    botanical_name
  };
}
