/**
 * Clean Professional Artistic Plant Renderer
 * Based on real landscape architecture drawing standards
 * NO heavy SVG filters - just clean fills, patterns, and simple effects
 */

export type RenderStyle = 'scientific' | 'watercolor' | 'marker' | 'sketch';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type FoliageType = 'deciduous' | 'evergreen' | 'semi-evergreen';

interface PlantRenderConfig {
  style: RenderStyle;
  season: Season;
  foliageType: FoliageType;
  spreadCm: number;
  heightCm: number;
  viewBoxSize: number;
  centerX: number;
  centerY: number;
}

/**
 * Get seasonal color based on foliage type and season
 */
export function getSeasonalColor(foliageType: FoliageType, season: Season): {
  base: string;
  accent: string;
  shadow: string;
} {
  const colors = {
    deciduous: {
      spring: {
        base: '#7CBB5D',    // Fresh green
        accent: '#C9DC87',  // Light yellow-green
        shadow: '#5B9E48'   // Darker green
      },
      summer: {
        base: '#228B22',    // Forest green
        accent: '#43AC78',  // Medium green
        shadow: '#155724'   // Deep green
      },
      autumn: {
        base: '#FE7126',    // Orange
        accent: '#FCB829',  // Golden yellow
        shadow: '#D00127'   // Red
      },
      winter: {
        base: '#875D4A',    // Brown bark
        accent: '#BBA89A',  // Light brown
        shadow: '#644A2A'   // Dark brown
      }
    },
    evergreen: {
      spring: {
        base: '#4E8F38',    // Bright green
        accent: '#7CBB5D',  // New growth
        shadow: '#2E6F40'   // Deep green
      },
      summer: {
        base: '#228B22',    // Standard green
        accent: '#43AC78',  // Medium green
        shadow: '#155724'   // Deep green
      },
      autumn: {
        base: '#228B22',    // Green maintained
        accent: '#CD7F32',  // Bronze tint
        shadow: '#155724'   // Deep green
      },
      winter: {
        base: '#637E68',    // Bronzed green
        accent: '#CD7F32',  // Bronze
        shadow: '#05472A'   // Very dark green
      }
    },
    'semi-evergreen': {
      spring: {
        base: '#7CBB5D',
        accent: '#C9DC87',
        shadow: '#5B9E48'
      },
      summer: {
        base: '#228B22',
        accent: '#43AC78',
        shadow: '#155724'
      },
      autumn: {
        base: '#7CBB5D',    // Some green retained
        accent: '#FE7126',  // Some orange
        shadow: '#228B22'
      },
      winter: {
        base: '#637E68',    // Bronzed
        accent: '#875D4A',  // Brown patches
        shadow: '#2E6F40'
      }
    }
  };

  return colors[foliageType][season];
}

/**
 * Generate clean scientific plant symbol (baseline)
 */
export function generateScientific(config: PlantRenderConfig): string {
  const { spreadCm, centerX, centerY } = config;
  const colors = getSeasonalColor(config.foliageType, config.season);
  const radius = spreadCm / 2;

  return `
    <!-- Canopy fill (dense foliage) -->
    <circle cx="${centerX}" cy="${centerY}" r="${radius * 0.85}"
            fill="${colors.base}" opacity="0.75"/>

    <!-- Spread outline (dripline) -->
    <circle cx="${centerX}" cy="${centerY}" r="${radius}"
            fill="none" stroke="${colors.shadow}" stroke-width="2"
            stroke-dasharray="8,4" opacity="0.6"/>

    <!-- Center point -->
    <circle cx="${centerX}" cy="${centerY}" r="4"
            fill="${colors.shadow}" opacity="0.8"/>
  `;
}

/**
 * Generate watercolor-style plant (clean, not filters)
 * Uses overlapping circles with gradients
 */
export function generateWatercolor(config: PlantRenderConfig): string {
  const { spreadCm, centerX, centerY, viewBoxSize } = config;
  const colors = getSeasonalColor(config.foliageType, config.season);
  const radius = spreadCm / 2;

  // Generate gradient ID unique to this instance
  const gradientId = `watercolor-gradient-${Math.random().toString(36).substr(2, 9)}`;

  return `
    <defs>
      <radialGradient id="${gradientId}">
        <stop offset="0%" stop-color="${colors.accent}" stop-opacity="0.8"/>
        <stop offset="40%" stop-color="${colors.base}" stop-opacity="0.7"/>
        <stop offset="80%" stop-color="${colors.shadow}" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="${colors.shadow}" stop-opacity="0.3"/>
      </radialGradient>
    </defs>

    <!-- Main canopy with gradient -->
    <circle cx="${centerX}" cy="${centerY}" r="${radius * 0.9}"
            fill="url(#${gradientId})" opacity="0.85"/>

    <!-- Overlapping circles for watercolor effect -->
    <circle cx="${centerX - radius * 0.2}" cy="${centerY - radius * 0.2}"
            r="${radius * 0.6}" fill="${colors.accent}" opacity="0.3"/>
    <circle cx="${centerX + radius * 0.15}" cy="${centerY + radius * 0.15}"
            r="${radius * 0.5}" fill="${colors.base}" opacity="0.3"/>
    <circle cx="${centerX}" cy="${centerY + radius * 0.2}"
            r="${radius * 0.4}" fill="${colors.shadow}" opacity="0.25"/>

    <!-- Soft outer edge -->
    <circle cx="${centerX}" cy="${centerY}" r="${radius}"
            fill="none" stroke="${colors.shadow}" stroke-width="1.5"
            opacity="0.3"/>
  `;
}

/**
 * Generate marker-style plant (bold and clean)
 */
export function generateMarker(config: PlantRenderConfig): string {
  const { spreadCm, centerX, centerY, viewBoxSize } = config;
  const colors = getSeasonalColor(config.foliageType, config.season);
  const radius = spreadCm / 2;

  // Simple dot pattern for texture
  const patternId = `marker-dots-${Math.random().toString(36).substr(2, 9)}`;

  return `
    <defs>
      <pattern id="${patternId}" patternUnits="userSpaceOnUse" width="15" height="15">
        <circle cx="7.5" cy="7.5" r="1.5" fill="${colors.shadow}" opacity="0.15"/>
      </pattern>
    </defs>

    <!-- Bold solid fill -->
    <circle cx="${centerX}" cy="${centerY}" r="${radius * 0.9}"
            fill="${colors.base}" opacity="0.85"/>

    <!-- Dot pattern overlay -->
    <circle cx="${centerX}" cy="${centerY}" r="${radius * 0.9}"
            fill="url(#${patternId})"/>

    <!-- Bold outline -->
    <circle cx="${centerX}" cy="${centerY}" r="${radius * 0.9}"
            fill="none" stroke="${colors.shadow}" stroke-width="3"
            opacity="0.9"/>
  `;
}

/**
 * Generate hand-drawn sketch style (controlled hatching)
 */
export function generateSketch(config: PlantRenderConfig): string {
  const { spreadCm, centerX, centerY, viewBoxSize } = config;
  const colors = getSeasonalColor(config.foliageType, config.season);
  const radius = spreadCm / 2;

  // Create clean hatching pattern
  const hatchId = `sketch-hatch-${Math.random().toString(36).substr(2, 9)}`;

  return `
    <defs>
      <pattern id="${hatchId}" patternUnits="userSpaceOnUse" width="8" height="8">
        <path d="M0,0 L8,8 M8,0 L0,8"
              stroke="${colors.shadow}" stroke-width="0.5" opacity="0.3"/>
      </pattern>
    </defs>

    <!-- Base fill with lower opacity -->
    <circle cx="${centerX}" cy="${centerY}" r="${radius * 0.85}"
            fill="${colors.base}" opacity="0.5"/>

    <!-- Hatching overlay -->
    <circle cx="${centerX}" cy="${centerY}" r="${radius * 0.85}"
            fill="url(#${hatchId})"/>

    <!-- Slightly irregular outline (using small segments) -->
    <circle cx="${centerX}" cy="${centerY}" r="${radius}"
            fill="none" stroke="${colors.shadow}" stroke-width="2"
            stroke-dasharray="12,3" opacity="0.7"/>

    <!-- Inner shadow effect with simple lines -->
    <circle cx="${centerX + radius * 0.3}" cy="${centerY + radius * 0.3}"
            r="${radius * 0.3}" fill="${colors.shadow}" opacity="0.15"/>
  `;
}

/**
 * Main rendering function
 */
export function renderArtisticPlant(config: PlantRenderConfig): string {
  switch (config.style) {
    case 'scientific':
      return generateScientific(config);
    case 'watercolor':
      return generateWatercolor(config);
    case 'marker':
      return generateMarker(config);
    case 'sketch':
      return generateSketch(config);
    default:
      return generateScientific(config);
  }
}

/**
 * Generate complete SVG with artistic rendering
 */
export function generateArtisticSVG(
  style: RenderStyle,
  season: Season,
  foliageType: FoliageType,
  spreadCm: number,
  heightCm: number,
  scaleBoxSize: number
): string {
  const centerX = scaleBoxSize / 2;
  const centerY = scaleBoxSize / 2;

  const plantMarkup = renderArtisticPlant({
    style,
    season,
    foliageType,
    spreadCm,
    heightCm,
    viewBoxSize: scaleBoxSize,
    centerX,
    centerY
  });

  return `
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 ${scaleBoxSize} ${scaleBoxSize}"
     width="${scaleBoxSize}"
     height="${scaleBoxSize}"
     data-style="${style}"
     data-season="${season}"
     data-spread="${spreadCm}">
  ${plantMarkup}
</svg>
  `.trim();
}
