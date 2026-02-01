/**
 * Artistic Plant Renderer - TypeScript Interface Specifications
 *
 * Defines types, interfaces, and configurations for rendering artistic
 * plant visualizations with seasonal color accuracy.
 *
 * @version 1.0
 * @date 2026-02-01
 */

// ============================================================================
// RENDERING STYLES
// ============================================================================

/**
 * Available artistic rendering styles
 */
export type RenderingStyle = 'scientific' | 'watercolor' | 'marker' | 'sketch';

/**
 * Seasonal periods for color selection
 */
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

/**
 * Plant foliage type affects seasonal behavior
 */
export type FoliageType = 'deciduous' | 'evergreen' | 'deciduous-conifer' | 'semi-evergreen';

// ============================================================================
// COLOR SYSTEM
// ============================================================================

/**
 * RGB color representation
 */
export interface RGBColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
  a?: number; // 0-1, optional alpha
}

/**
 * Color definition with metadata
 */
export interface ColorDefinition {
  hex: string;
  name: string;
  description?: string;
  source?: string; // Reference to research source
}

/**
 * Seasonal color palette for a plant
 */
export interface SeasonalPalette {
  season: Season;
  foliageType: FoliageType;
  colors: ColorDefinition[];
  gradient?: {
    type: 'radial' | 'linear';
    stops: Array<{
      offset: number; // 0-100
      color: string; // hex
      opacity?: number; // 0-1
    }>;
  };
}

/**
 * Complete color map for all seasons
 */
export interface PlantColorMap {
  plantId: string;
  scientificName: string;
  foliageType: FoliageType;
  palettes: {
    spring: SeasonalPalette;
    summer: SeasonalPalette;
    autumn: SeasonalPalette;
    winter: SeasonalPalette;
  };
  customColors?: {
    [season: string]: ColorDefinition[];
  }; // Override defaults with extracted colors from real images
}

// ============================================================================
// DEFAULT SEASONAL PALETTES
// ============================================================================

/**
 * Default color palettes by season and foliage type
 */
export const DEFAULT_SEASONAL_COLORS: Record<Season, Record<FoliageType, ColorDefinition[]>> = {
  spring: {
    deciduous: [
      { hex: '#C9DC87', name: 'Medium Spring Bud', description: 'Light new leaves' },
      { hex: '#7CBB5D', name: 'Bud Green', description: 'New growth' },
      { hex: '#5B9E48', name: 'May Green', description: 'Medium spring foliage' },
      { hex: '#177245', name: 'Dark Spring Green', description: 'Deep base green' },
    ],
    evergreen: [
      { hex: '#89FFC4', name: 'Light Spring', description: 'New growth tips' },
      { hex: '#00FF7F', name: 'Spring Green', description: 'Bright spring tone' },
      { hex: '#008944', name: 'Medium Spring Green', description: 'Standard foliage' },
      { hex: '#003B1D', name: 'Deep Evergreen', description: 'Mature needles' },
    ],
    'deciduous-conifer': [
      { hex: '#89F336', name: 'Lime Green', description: 'New needles' },
      { hex: '#7CBB5D', name: 'Bud Green', description: 'Fresh growth' },
      { hex: '#5B9E48', name: 'May Green', description: 'Spring needles' },
    ],
    'semi-evergreen': [
      { hex: '#89FFC4', name: 'Light Spring', description: 'New growth' },
      { hex: '#7CBB5D', name: 'Bud Green', description: 'Mixed foliage' },
      { hex: '#008944', name: 'Medium Green', description: 'Retained leaves' },
    ],
  },
  summer: {
    deciduous: [
      { hex: '#228B22', name: 'Forest Green', description: 'Standard summer canopy' },
      { hex: '#2E6F40', name: 'Deep Forest', description: 'Dense mature foliage' },
      { hex: '#155724', name: 'Very Dark Green', description: 'Shaded canopy' },
    ],
    evergreen: [
      { hex: '#228B22', name: 'Forest Green', description: 'Standard summer tone' },
      { hex: '#2E6F40', name: 'Deep Forest', description: 'Mature needles' },
      { hex: '#336739', name: 'Evergreen Forest', description: 'Dense canopy' },
    ],
    'deciduous-conifer': [
      { hex: '#228B22', name: 'Forest Green', description: 'Summer needles' },
      { hex: '#2E6F40', name: 'Deep Forest', description: 'Full canopy' },
    ],
    'semi-evergreen': [
      { hex: '#228B22', name: 'Forest Green', description: 'Mixed summer foliage' },
      { hex: '#2E6F40', name: 'Deep Forest', description: 'Retained leaves' },
    ],
  },
  autumn: {
    deciduous: [
      { hex: '#FCB829', name: 'Golden Yellow', description: 'Early autumn' },
      { hex: '#FE7126', name: 'Orange', description: 'Mid-autumn' },
      { hex: '#D00127', name: 'Red', description: 'Peak color' },
      { hex: '#644A2A', name: 'Brown', description: 'Late autumn' },
    ],
    evergreen: [
      { hex: '#228B22', name: 'Forest Green', description: 'Standard green' },
      { hex: '#2E6F40', name: 'Deep Forest', description: 'Autumn tone' },
      { hex: '#CD7F32', name: 'Bronze', description: 'Winter bronzing begins' },
    ],
    'deciduous-conifer': [
      { hex: '#FCB829', name: 'Golden Yellow', description: 'Autumn needles' },
      { hex: '#FE7126', name: 'Orange', description: 'Peak color' },
      { hex: '#A95932', name: 'Rust', description: 'Before needle drop' },
    ],
    'semi-evergreen': [
      { hex: '#FCB829', name: 'Golden Yellow', description: 'Turning leaves' },
      { hex: '#228B22', name: 'Forest Green', description: 'Retained foliage' },
      { hex: '#644A2A', name: 'Brown', description: 'Dropping leaves' },
    ],
  },
  winter: {
    deciduous: [
      { hex: '#BBA89A', name: 'Khaki', description: 'Light bark' },
      { hex: '#875D4A', name: 'Raw Umber', description: 'Medium bark' },
      { hex: '#644A2A', name: 'Dark Brown', description: 'Dark bark' },
      { hex: '#3E2723', name: 'Very Dark Brown', description: 'Wet bark' },
    ],
    evergreen: [
      { hex: '#05472A', name: 'Deep Evergreen', description: 'Winter dark green' },
      { hex: '#4E8F38', name: 'Evergreen', description: 'Standard winter tone' },
      { hex: '#637E68', name: 'Winter Green', description: 'Bronzed foliage' },
      { hex: '#CD7F32', name: 'Bronze', description: 'Winter stress color' },
    ],
    'deciduous-conifer': [
      { hex: '#BBA89A', name: 'Khaki', description: 'Bare branches' },
      { hex: '#875D4A', name: 'Raw Umber', description: 'Winter bark' },
    ],
    'semi-evergreen': [
      { hex: '#4E8F38', name: 'Evergreen', description: 'Retained leaves' },
      { hex: '#BBA89A', name: 'Khaki', description: 'Bare branches' },
    ],
  },
};

// ============================================================================
// SVG FILTER CONFIGURATIONS
// ============================================================================

/**
 * Base interface for SVG filter configurations
 */
export interface SVGFilterConfig {
  id: string;
  style: RenderingStyle;
  filterUnits?: 'userSpaceOnUse' | 'objectBoundingBox';
  x?: string;
  y?: string;
  width?: string;
  height?: string;
}

/**
 * feTurbulence configuration
 */
export interface TurbulenceConfig {
  type: 'fractalNoise' | 'turbulence';
  baseFrequency: number | [number, number]; // Single value or [x, y]
  numOctaves: number; // 1-4 typical
  seed?: number; // For reproducible randomness
  stitchTiles?: 'stitch' | 'noStitch';
}

/**
 * feDisplacementMap configuration
 */
export interface DisplacementMapConfig {
  scale: number; // Displacement intensity
  xChannelSelector: 'R' | 'G' | 'B' | 'A';
  yChannelSelector: 'R' | 'G' | 'B' | 'A';
  in?: string; // Input reference
  in2?: string; // Displacement map reference
}

/**
 * feGaussianBlur configuration
 */
export interface GaussianBlurConfig {
  stdDeviation: number | [number, number]; // Single value or [x, y]
  in?: string;
  edgeMode?: 'duplicate' | 'wrap' | 'none';
}

/**
 * feColorMatrix configuration
 */
export interface ColorMatrixConfig {
  type: 'matrix' | 'saturate' | 'hueRotate' | 'luminanceToAlpha';
  values: string | number; // Depends on type
  in?: string;
}

/**
 * feBlend configuration
 */
export interface BlendConfig {
  mode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten';
  in?: string;
  in2?: string;
  opacity?: number;
}

/**
 * feComposite configuration
 */
export interface CompositeConfig {
  operator: 'over' | 'in' | 'out' | 'atop' | 'xor' | 'arithmetic';
  in?: string;
  in2?: string;
  k1?: number; // For arithmetic mode
  k2?: number;
  k3?: number;
  k4?: number;
}

/**
 * feMorphology configuration
 */
export interface MorphologyConfig {
  operator: 'erode' | 'dilate';
  radius: number | [number, number];
  in?: string;
}

/**
 * Complete filter primitive
 */
export type FilterPrimitive =
  | { type: 'feTurbulence'; config: TurbulenceConfig; result?: string }
  | { type: 'feDisplacementMap'; config: DisplacementMapConfig; result?: string }
  | { type: 'feGaussianBlur'; config: GaussianBlurConfig; result?: string }
  | { type: 'feColorMatrix'; config: ColorMatrixConfig; result?: string }
  | { type: 'feBlend'; config: BlendConfig; result?: string }
  | { type: 'feComposite'; config: CompositeConfig; result?: string }
  | { type: 'feMorphology'; config: MorphologyConfig; result?: string };

/**
 * Complete filter definition
 */
export interface FilterDefinition extends SVGFilterConfig {
  primitives: FilterPrimitive[];
}

// ============================================================================
// WATERCOLOR FILTER PRESETS
// ============================================================================

export const WATERCOLOR_FILTER: FilterDefinition = {
  id: 'watercolor',
  style: 'watercolor',
  x: '-50%',
  y: '-50%',
  width: '200%',
  height: '200%',
  primitives: [
    // Paper texture
    {
      type: 'feTurbulence',
      config: { type: 'fractalNoise', baseFrequency: 0.04, numOctaves: 3 },
      result: 'noise',
    },
    {
      type: 'feColorMatrix',
      config: { type: 'saturate', values: 0, in: 'noise' },
      result: 'desaturatedNoise',
    },
    // Soft edges
    {
      type: 'feTurbulence',
      config: { type: 'turbulence', baseFrequency: 0.02, numOctaves: 2 },
      result: 'edgeNoise',
    },
    {
      type: 'feDisplacementMap',
      config: {
        scale: 8,
        xChannelSelector: 'R',
        yChannelSelector: 'G',
        in: 'SourceGraphic',
        in2: 'edgeNoise',
      },
      result: 'displaced',
    },
    {
      type: 'feGaussianBlur',
      config: { stdDeviation: 2, in: 'displaced' },
      result: 'softEdges',
    },
    // Combine
    {
      type: 'feBlend',
      config: { mode: 'multiply', in: 'softEdges', in2: 'desaturatedNoise' },
    },
  ],
};

// ============================================================================
// MARKER FILTER PRESETS
// ============================================================================

export const MARKER_FILTER: FilterDefinition = {
  id: 'marker',
  style: 'marker',
  x: '-20%',
  y: '-20%',
  width: '140%',
  height: '140%',
  primitives: [
    // Slight irregularity
    {
      type: 'feTurbulence',
      config: { type: 'turbulence', baseFrequency: 0.05, numOctaves: 1 },
      result: 'noise',
    },
    {
      type: 'feDisplacementMap',
      config: {
        scale: 3,
        xChannelSelector: 'R',
        yChannelSelector: 'G',
        in: 'SourceGraphic',
        in2: 'noise',
      },
      result: 'slightWarp',
    },
    // Marker texture
    {
      type: 'feTurbulence',
      config: { type: 'fractalNoise', baseFrequency: 0.2, numOctaves: 2 },
      result: 'strokeTexture',
    },
    {
      type: 'feColorMatrix',
      config: { type: 'saturate', values: 0, in: 'strokeTexture' },
      result: 'grayTexture',
    },
    {
      type: 'feBlend',
      config: { mode: 'multiply', in: 'slightWarp', in2: 'grayTexture', opacity: 0.15 },
    },
  ],
};

// ============================================================================
// SKETCH FILTER PRESETS
// ============================================================================

export const SKETCH_FILTER: FilterDefinition = {
  id: 'sketch',
  style: 'sketch',
  x: '-30%',
  y: '-30%',
  width: '160%',
  height: '160%',
  primitives: [
    // Irregular edges
    {
      type: 'feTurbulence',
      config: { type: 'turbulence', baseFrequency: 0.03, numOctaves: 3 },
      result: 'noise',
    },
    {
      type: 'feDisplacementMap',
      config: {
        scale: 15,
        xChannelSelector: 'R',
        yChannelSelector: 'G',
        in: 'SourceGraphic',
        in2: 'noise',
      },
      result: 'wobbly',
    },
    // Rough texture
    {
      type: 'feTurbulence',
      config: { type: 'fractalNoise', baseFrequency: 0.5, numOctaves: 4 },
      result: 'roughness',
    },
    {
      type: 'feColorMatrix',
      config: { type: 'saturate', values: 0, in: 'roughness' },
      result: 'grayRough',
    },
    {
      type: 'feBlend',
      config: { mode: 'multiply', in: 'wobbly', in2: 'grayRough', opacity: 0.2 },
    },
  ],
};

// ============================================================================
// PATTERN DEFINITIONS
// ============================================================================

/**
 * SVG pattern configuration
 */
export interface PatternConfig {
  id: string;
  patternUnits: 'userSpaceOnUse' | 'objectBoundingBox';
  width: number | string;
  height: number | string;
  patternTransform?: string;
}

/**
 * Foliage pattern types
 */
export type FoliagePattern =
  | 'circular-clusters'
  | 'triangular-toothy'
  | 'radial-branches'
  | 'sparse-leaves'
  | 'dense-canopy'
  | 'hatching-diagonal'
  | 'hatching-cross'
  | 'stippling';

/**
 * Pattern definition with SVG content
 */
export interface PatternDefinition extends PatternConfig {
  patternType: FoliagePattern;
  svgContent: string; // Raw SVG markup for pattern content
}

// ============================================================================
// SHADOW & HIGHLIGHT CONFIGURATIONS
// ============================================================================

/**
 * Shadow/highlight placement
 */
export interface ShadingConfig {
  type: 'shadow' | 'highlight';
  offsetX: number; // Percentage of canopy radius
  offsetY: number;
  size: number; // Percentage of canopy radius
  opacity: number; // 0-1
  blur?: number;
  gradient?: {
    type: 'radial' | 'linear';
    stops: Array<{
      offset: number;
      color: string;
      opacity: number;
    }>;
  };
}

/**
 * Standard light source convention
 */
export const STANDARD_LIGHT_SOURCE = {
  angle: 135, // degrees (upper left)
  shadow: {
    type: 'shadow' as const,
    offsetX: 10,
    offsetY: 15,
    size: 90,
    opacity: 0.3,
    blur: 5,
  },
  highlight: {
    type: 'highlight' as const,
    offsetX: -15,
    offsetY: -15,
    size: 30,
    opacity: 0.4,
    blur: 3,
  },
};

// ============================================================================
// RENDERING PARAMETERS
// ============================================================================

/**
 * Complete parameters for rendering a plant
 */
export interface PlantRenderParams {
  // Plant data
  plantId: string;
  scientificName: string;
  foliageType: FoliageType;

  // Dimensions (in scaled units)
  canopyDiameter: number;
  spreadDiameter?: number; // If different from canopy
  height?: number; // For reference

  // Style selection
  style: RenderingStyle;
  season: Season;

  // Colors
  colorMap?: PlantColorMap; // Custom colors, or use defaults
  customPalette?: ColorDefinition[]; // Override for this render

  // Filter customization
  filterConfig?: Partial<FilterDefinition>; // Override default filter
  filterSeed?: number; // For reproducible randomness

  // Patterns
  foliagePattern?: FoliagePattern;
  showSpreadOutline?: boolean; // Dashed outline

  // Shading
  applyShading?: boolean;
  shadingConfig?: ShadingConfig[];

  // Output
  outputFormat: 'svg' | 'png';
  outputResolution?: number; // DPI for PNG
  transparentBackground?: boolean;
}

// ============================================================================
// RENDERING OUTPUT
// ============================================================================

/**
 * Result of rendering operation
 */
export interface RenderResult {
  success: boolean;
  data?: string; // SVG string or base64 PNG
  format: 'svg' | 'png';
  metadata: {
    plantId: string;
    style: RenderingStyle;
    season: Season;
    dimensions: {
      width: number;
      height: number;
    };
    timestamp: string;
  };
  error?: string;
}

// ============================================================================
// BATCH RENDERING
// ============================================================================

/**
 * Batch rendering request
 */
export interface BatchRenderRequest {
  plants: PlantRenderParams[];
  seasons?: Season[]; // If specified, render each plant in all seasons
  styles?: RenderingStyle[]; // If specified, render each plant in all styles
  outputFormat: 'svg' | 'png';
  packageAsZip?: boolean;
}

/**
 * Batch rendering result
 */
export interface BatchRenderResult {
  success: boolean;
  results: RenderResult[];
  zipFile?: Blob; // If packageAsZip = true
  errors: Array<{
    plantId: string;
    error: string;
  }>;
}

// ============================================================================
// UTILITY FUNCTIONS (Type Signatures)
// ============================================================================

/**
 * Generate a unique filter ID based on plant ID and style
 */
export function generateFilterId(plantId: string, style: RenderingStyle): string {
  return `plant-${plantId}-${style}-${Date.now()}`;
}

/**
 * Hash a string to a number for seed generation
 */
export function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Get default palette for season and foliage type
 */
export function getDefaultPalette(season: Season, foliageType: FoliageType): ColorDefinition[] {
  return DEFAULT_SEASONAL_COLORS[season][foliageType] || DEFAULT_SEASONAL_COLORS[season].deciduous;
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Convert hex to RGB
 */
export function hexToRgb(hex: string): RGBColor | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Get current season based on date
 */
export function getCurrentSeason(date: Date = new Date()): Season {
  const month = date.getMonth(); // 0-11

  // Northern hemisphere
  if (month >= 2 && month <= 4) return 'spring'; // Mar, Apr, May
  if (month >= 5 && month <= 7) return 'summer'; // Jun, Jul, Aug
  if (month >= 8 && month <= 10) return 'autumn'; // Sep, Oct, Nov
  return 'winter'; // Dec, Jan, Feb
}

/**
 * Build SVG filter string from FilterDefinition
 */
export function buildFilterSVG(filter: FilterDefinition): string {
  // Implementation would generate actual SVG markup
  // This is a type signature placeholder
  return `<filter id="${filter.id}">...</filter>`;
}

/**
 * Build SVG pattern string from PatternDefinition
 */
export function buildPatternSVG(pattern: PatternDefinition): string {
  // Implementation would generate actual SVG markup
  return `<pattern id="${pattern.id}">${pattern.svgContent}</pattern>`;
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  // Presets (values only)
  WATERCOLOR_FILTER,
  MARKER_FILTER,
  SKETCH_FILTER,
  DEFAULT_SEASONAL_COLORS,
  STANDARD_LIGHT_SOURCE,

  // Utilities (functions only)
  generateFilterId,
  hashCode,
  getDefaultPalette,
  rgbToHex,
  hexToRgb,
  getCurrentSeason,
  buildFilterSVG,
  buildPatternSVG,
};
