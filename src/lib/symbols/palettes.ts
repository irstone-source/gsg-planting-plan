/**
 * Seasonal Color Palettes for Plant Symbol Rendering
 * Leaf-habit driven: deciduous changes with seasons, evergreen stays consistent
 * Professional landscape architecture color standards
 */

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type LeafHabit = 'deciduous' | 'evergreen' | 'semi_evergreen';

export interface ColorPalette {
  canopy_fill: string;        // Main canopy mass color
  canopy_gradient_start: string; // For watercolor style
  canopy_gradient_end: string;
  cluster_fill: string;       // Interior cluster blobs
  cluster_stroke?: string;    // Optional cluster outline
  texture_color: string;      // Dot pattern / hatch overlay
  outline_stroke: string;     // Spread outline (dashed for scientific)
  outline_opacity: number;
}

/**
 * Deciduous palettes: dramatic seasonal change
 * Spring: fresh greens, Summer: deep greens, Autumn: warm tones, Winter: bare/structural
 */
const DECIDUOUS_PALETTES: Record<Season, ColorPalette> = {
  spring: {
    canopy_fill: '#B8D4A8',           // Fresh spring green
    canopy_gradient_start: '#D4E7C5',
    canopy_gradient_end: '#95C27D',
    cluster_fill: '#A8C998',
    texture_color: '#7FAF65',
    outline_stroke: '#8BB574',
    outline_opacity: 0.5
  },
  summer: {
    canopy_fill: '#6B8E5B',           // Deep summer green
    canopy_gradient_start: '#89A878',
    canopy_gradient_end: '#4F7342',
    cluster_fill: '#5F8350',
    texture_color: '#3D5F2F',
    outline_stroke: '#5A7D4B',
    outline_opacity: 0.6
  },
  autumn: {
    canopy_fill: '#D4A574',           // Warm autumn tones
    canopy_gradient_start: '#E8C89D',
    canopy_gradient_end: '#B8845A',
    cluster_fill: '#C89860',
    texture_color: '#A67543',
    outline_stroke: '#BC8F5C',
    outline_opacity: 0.5
  },
  winter: {
    canopy_fill: '#8B7E74',           // Bare structural brown/grey
    canopy_gradient_start: '#A39891',
    canopy_gradient_end: '#6E6259',
    cluster_fill: 'none',             // No foliage in winter
    texture_color: '#5A5047',
    outline_stroke: '#7A6F65',
    outline_opacity: 0.7
  }
};

/**
 * Evergreen palettes: consistent year-round with subtle seasonal shifts
 * Maintains green canopy in all seasons
 */
const EVERGREEN_PALETTES: Record<Season, ColorPalette> = {
  spring: {
    canopy_fill: '#4F6F4A',           // Consistent dark green
    canopy_gradient_start: '#6B8965',
    canopy_gradient_end: '#3A5536',
    cluster_fill: '#5A7854',
    texture_color: '#2F4229',
    outline_stroke: '#4A6045',
    outline_opacity: 0.5
  },
  summer: {
    canopy_fill: '#3E5E3A',           // Deepest green
    canopy_gradient_start: '#567C52',
    canopy_gradient_end: '#2B4428',
    cluster_fill: '#496B45',
    texture_color: '#1F3620',
    outline_stroke: '#3A5436',
    outline_opacity: 0.6
  },
  autumn: {
    canopy_fill: '#4A6946',           // Slight bronzing
    canopy_gradient_start: '#658562',
    canopy_gradient_end: '#364F33',
    cluster_fill: '#54744F',
    texture_color: '#2A3F28',
    outline_stroke: '#445D41',
    outline_opacity: 0.5
  },
  winter: {
    canopy_fill: '#3F5E3C',           // Darker winter green
    canopy_gradient_start: '#597958',
    canopy_gradient_end: '#2E4A2C',
    cluster_fill: '#4A6B47',
    texture_color: '#243A23',
    outline_stroke: '#3B5339',
    outline_opacity: 0.7
  }
};

/**
 * Semi-evergreen palettes: intermediate behavior
 * Loses some foliage in winter but retains partial canopy
 */
const SEMI_EVERGREEN_PALETTES: Record<Season, ColorPalette> = {
  spring: {
    canopy_fill: '#7FA876',
    canopy_gradient_start: '#9BC192',
    canopy_gradient_end: '#638F5A',
    cluster_fill: '#8BAF82',
    texture_color: '#5A8450',
    outline_stroke: '#739868',
    outline_opacity: 0.5
  },
  summer: {
    canopy_fill: '#5F8E56',
    canopy_gradient_start: '#7BA872',
    canopy_gradient_end: '#47743E',
    cluster_fill: '#6B9762',
    texture_color: '#3F6537',
    outline_stroke: '#557F4C',
    outline_opacity: 0.6
  },
  autumn: {
    canopy_fill: '#8A9F7A',
    canopy_gradient_start: '#A6BA96',
    canopy_gradient_end: '#6E8560',
    cluster_fill: '#92A886',
    texture_color: '#5F7453',
    outline_stroke: '#7A8F6C',
    outline_opacity: 0.5
  },
  winter: {
    canopy_fill: '#6A7861',           // Partial defoliation
    canopy_gradient_start: '#85927C',
    canopy_gradient_end: '#515F48',
    cluster_fill: '#737F6A',
    texture_color: '#4A573F',
    outline_stroke: '#5F6C56',
    outline_opacity: 0.7
  }
};

/**
 * Get seasonal palette for a plant based on leaf habit
 */
export function getSeasonalPalette(
  leaf_habit: LeafHabit,
  season: Season
): ColorPalette {
  switch (leaf_habit) {
    case 'deciduous':
      return DECIDUOUS_PALETTES[season];
    case 'evergreen':
      return EVERGREEN_PALETTES[season];
    case 'semi_evergreen':
      return SEMI_EVERGREEN_PALETTES[season];
    default:
      return DECIDUOUS_PALETTES[season];
  }
}

/**
 * Apply winter interest overlay (for deciduous plants with special winter features)
 * e.g., white bark (Betula), red stems (Cornus), persistent berries
 */
export function applyWinterInterest(
  palette: ColorPalette,
  winter_interest: 'white_bark' | 'red_stems' | 'berries' | 'flowers' | 'evergreen' | null
): ColorPalette {
  if (!winter_interest) return palette;

  switch (winter_interest) {
    case 'white_bark':
      return {
        ...palette,
        outline_stroke: '#E8E4DC',    // Silvery white outline
        outline_opacity: 0.9,
        texture_color: '#D4CFC5'      // Light texture for bark emphasis
      };
    case 'red_stems':
      return {
        ...palette,
        outline_stroke: '#A84642',    // Red-brown outline
        outline_opacity: 0.8,
        texture_color: '#8F3A36'      // Darker red texture
      };
    case 'berries':
      return {
        ...palette,
        cluster_fill: '#B84C3C',      // Persistent red berries
        texture_color: '#9A3F32'
      };
    case 'flowers':
      return {
        ...palette,
        cluster_fill: '#C8A8B4',      // Winter flowers (pale pink)
        texture_color: '#A88894'
      };
    case 'evergreen':
      // Evergreen plants keep their foliage, no special winter modification needed
      return palette;
    default:
      return palette;
  }
}
