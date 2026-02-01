/**
 * Parametric SVG Plant Generator
 * Creates scientifically accurate plant visualizations based on botanical data
 *
 * SCALING SYSTEM:
 * All plants rendered in standardized scale boxes for true size comparison
 * - Shrubs (0-5m): 5m × 5m box → 500cm canvas
 * - Small trees (5-10m): 10m × 10m box → 1000cm canvas
 * - Medium trees (10-15m): 15m × 15m box → 1500cm canvas
 * - Large trees (15-25m): 25m × 25m box → 2500cm canvas
 * - Extra large (>25m): 40m × 40m box → 4000cm canvas
 */

import { CrownShape, CanopyDensity, FoliageType, PlantDimensions } from './types';

/**
 * Determine appropriate scale box based on mature height
 */
function getScaleBox(heightCm: number): { size: number; label: string } {
  if (heightCm <= 500) {
    return { size: 500, label: '5m × 5m (Shrubs)' };
  } else if (heightCm <= 1000) {
    return { size: 1000, label: '10m × 10m (Small Trees)' };
  } else if (heightCm <= 1500) {
    return { size: 1500, label: '15m × 15m (Medium Trees)' };
  } else if (heightCm <= 2500) {
    return { size: 2500, label: '25m × 25m (Large Trees)' };
  } else {
    return { size: 4000, label: '40m × 40m (Extra Large)' };
  }
}

interface CanopyConfig {
  shape: CrownShape;
  dimensions: PlantDimensions;
  density: CanopyDensity;
  foliage_type: FoliageType;
  color?: string;
}

/**
 * Generate top-down (plan view) SVG based on crown shape and dimensions
 * Uses standardized scale boxes for consistent real-world sizing
 */
export function generatePlanViewSVG(config: CanopyConfig): string {
  const { shape, dimensions, density, foliage_type } = config;

  // Get actual plant dimensions
  const plantHeight = Math.max(dimensions.height_cm || 100, 10);
  const plantSpread = Math.max(dimensions.spread_cm || 100, 10);

  // Determine scale box based on plant height
  const scaleBox = getScaleBox(plantHeight);
  const viewBoxSize = scaleBox.size; // e.g., 500cm for shrubs, 2500cm for large trees

  // Center point in the scale box
  const centerX = Math.round(viewBoxSize / 2);
  const centerY = Math.round(viewBoxSize / 2);

  // Plant canopy size (actual spread)
  const width = plantSpread;
  const height = plantSpread; // Plan view is circular/symmetrical

  // Base color based on foliage type
  const baseColor = foliage_type === 'evergreen' ? '#2d5016' : '#4a7c3a';
  const strokeColor = foliage_type === 'evergreen' ? '#1a3010' : '#2d4a22';

  // Opacity based on density
  const opacityMap = {
    'sparse': 0.4,
    'medium': 0.6,
    'dense': 0.8,
    'very-dense': 0.95
  };
  const opacity = opacityMap[density];

  let canopyPath = '';

  switch (shape) {
    case 'rounded':
    case 'oval':
      canopyPath = generateRoundedCanopy(centerX, centerY, width / 2, height / 2, density);
      break;

    case 'columnar':
      canopyPath = generateColumnarCanopy(centerX, centerY, width / 2, density);
      break;

    case 'spreading':
      canopyPath = generateSpreadingCanopy(centerX, centerY, width / 2, density);
      break;

    case 'pyramidal':
      canopyPath = generatePyramidalCanopy(centerX, centerY, width / 2, density);
      break;

    case 'weeping':
      canopyPath = generateWeepingCanopy(centerX, centerY, width / 2, density);
      break;

    case 'vase':
      canopyPath = generateVaseCanopy(centerX, centerY, width / 2, density);
      break;

    case 'irregular':
    case 'multi-stem':
      canopyPath = generateIrregularCanopy(centerX, centerY, width / 2, density);
      break;

    default:
      canopyPath = generateRoundedCanopy(centerX, centerY, width / 2, height / 2, density);
  }

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="${viewBoxSize}" height="${viewBoxSize}" data-scale-size="${scaleBox.size}" data-plant-spread="${plantSpread}" data-plant-height="${plantHeight}">
  <defs>
    <!-- Foliage texture pattern -->
    <pattern id="foliage-texture" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="5" cy="5" r="3" fill="${baseColor}" opacity="0.3"/>
      <circle cx="15" cy="10" r="2.5" fill="${baseColor}" opacity="0.4"/>
      <circle cx="10" cy="15" r="2" fill="${baseColor}" opacity="0.3"/>
    </pattern>

    <!-- Branch structure pattern -->
    <pattern id="branch-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <line x1="20" y1="0" x2="20" y2="40" stroke="${strokeColor}" stroke-width="0.5" opacity="0.2"/>
      <line x1="0" y1="20" x2="40" y2="20" stroke="${strokeColor}" stroke-width="0.5" opacity="0.2"/>
    </pattern>
  </defs>

  <!-- Canopy (filled represents dense foliage) -->
  <g opacity="${opacity}">
    ${canopyPath}
  </g>

  <!-- Spread outline (dashed circle showing extent) -->
  <circle cx="${centerX}" cy="${centerY}" r="${plantSpread / 2}"
          fill="none" stroke="${strokeColor}" stroke-width="2"
          stroke-dasharray="10,5" opacity="0.6"/>

  <!-- Center point -->
  <circle cx="${centerX}" cy="${centerY}" r="4" fill="${strokeColor}" opacity="0.7"/>
</svg>
  `.trim();
}

/**
 * Generate rounded/oval canopy (most common tree shape)
 */
function generateRoundedCanopy(cx: number, cy: number, radiusX: number, radiusY: number, density: CanopyDensity): string {
  const baseColor = '#4a7c3a';
  const strokeColor = '#2d4a22';

  // Create organic, irregular edge
  const points = 48;
  const irregularity = density === 'dense' ? 0.05 : density === 'medium' ? 0.1 : 0.15;

  let path = `M ${cx + radiusX} ${cy}`;

  for (let i = 1; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const randomFactor = 1 + (Math.random() - 0.5) * irregularity;
    const x = cx + Math.cos(angle) * radiusX * randomFactor;
    const y = cy + Math.sin(angle) * radiusY * randomFactor;
    path += ` L ${x} ${y}`;
  }

  path += ' Z';

  return `
    <path d="${path}" fill="url(#foliage-texture)" stroke="${strokeColor}" stroke-width="1.5"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${radiusX * 0.7}" ry="${radiusY * 0.7}" fill="${baseColor}" opacity="0.3"/>
  `;
}

/**
 * Generate columnar/fastigiate canopy (narrow, upright)
 */
function generateColumnarCanopy(cx: number, cy: number, radius: number, density: CanopyDensity): string {
  const narrowRadius = radius * 0.4; // Columnar trees are narrow
  return generateRoundedCanopy(cx, cy, narrowRadius, radius, density);
}

/**
 * Generate spreading canopy (wide, flat)
 */
function generateSpreadingCanopy(cx: number, cy: number, radius: number, density: CanopyDensity): string {
  const baseColor = '#4a7c3a';
  const strokeColor = '#2d4a22';

  // Create irregular, spreading shape
  const points = 36;
  let path = `M ${cx + radius} ${cy}`;

  for (let i = 1; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const radiusVariation = radius * (0.9 + Math.random() * 0.2);
    const x = cx + Math.cos(angle) * radiusVariation;
    const y = cy + Math.sin(angle) * radiusVariation * 0.7; // Flatter
    path += ` L ${x} ${y}`;
  }

  path += ' Z';

  return `
    <path d="${path}" fill="url(#foliage-texture)" stroke="${strokeColor}" stroke-width="2"/>
    <path d="${path}" fill="url(#branch-pattern)" opacity="0.2"/>
  `;
}

/**
 * Generate pyramidal/conical canopy (conifers)
 */
function generatePyramidalCanopy(cx: number, cy: number, radius: number, density: CanopyDensity): string {
  const baseColor = '#2d5016';
  const strokeColor = '#1a3010';

  // Create triangular/star pattern for conifer
  const points = 8;
  let path = `M ${cx} ${cy - radius}`;

  for (let i = 1; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2 - Math.PI / 2;
    const r = radius * (1 - Math.abs(Math.sin(angle)) * 0.2);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    path += ` L ${x} ${y}`;
  }

  path += ' Z';

  return `
    <path d="${path}" fill="${baseColor}" stroke="${strokeColor}" stroke-width="2" opacity="0.9"/>
    <circle cx="${cx}" cy="${cy}" r="${radius * 0.6}" fill="${baseColor}" opacity="0.5"/>
  `;
}

/**
 * Generate weeping canopy (pendulous branches)
 */
function generateWeepingCanopy(cx: number, cy: number, radius: number, density: CanopyDensity): string {
  const baseColor = '#4a7c3a';
  const strokeColor = '#2d4a22';

  // Create flowing, draped appearance
  const drapes = 12;
  let paths = [];

  for (let i = 0; i < drapes; i++) {
    const angle = (i / drapes) * Math.PI * 2;
    const x1 = cx;
    const y1 = cy;
    const x2 = cx + Math.cos(angle) * radius;
    const y2 = cy + Math.sin(angle) * radius;

    paths.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${strokeColor}" stroke-width="1" opacity="0.3"/>`);
  }

  const outerCircle = `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="url(#foliage-texture)" stroke="${strokeColor}" stroke-width="2" opacity="0.7"/>`;

  return outerCircle + paths.join('');
}

/**
 * Generate vase-shaped canopy (V-shape, many deciduous trees)
 */
function generateVaseCanopy(cx: number, cy: number, radius: number, density: CanopyDensity): string {
  const baseColor = '#4a7c3a';
  const strokeColor = '#2d4a22';

  // Create vase/chalice shape
  const innerRadius = radius * 0.3;
  const points = 36;
  let path = '';

  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const r = i < points / 2 ? innerRadius + (radius - innerRadius) * (i / (points / 2)) : radius;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }

  path += ' Z';

  return `
    <path d="${path}" fill="url(#foliage-texture)" stroke="${strokeColor}" stroke-width="1.5"/>
  `;
}

/**
 * Generate irregular canopy (natural, asymmetric)
 */
function generateIrregularCanopy(cx: number, cy: number, radius: number, density: CanopyDensity): string {
  const baseColor = '#4a7c3a';
  const strokeColor = '#2d4a22';

  // Create highly irregular, organic shape
  const points = 24;
  let path = `M ${cx + radius} ${cy}`;

  for (let i = 1; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const radiusVariation = radius * (0.6 + Math.random() * 0.5);
    const x = cx + Math.cos(angle) * radiusVariation;
    const y = cy + Math.sin(angle) * radiusVariation;
    path += ` L ${x} ${y}`;
  }

  path += ' Z';

  return `
    <path d="${path}" fill="url(#foliage-texture)" stroke="${strokeColor}" stroke-width="2"/>
    <path d="${path}" fill="url(#branch-pattern)" opacity="0.3"/>
  `;
}

/**
 * Generate front view (elevation) SVG with proper scale and scientific accuracy
 */
export function generateElevationSVG(config: CanopyConfig): string {
  const { shape, dimensions, density, foliage_type } = config;

  // Get actual plant dimensions
  const plantHeight = Math.max(dimensions.height_cm || 100, 10);
  const plantSpread = Math.max(dimensions.spread_cm || 100, 10);

  // Determine scale box based on plant height (same as plan view)
  const scaleBox = getScaleBox(plantHeight);
  const viewBoxSize = scaleBox.size;

  // Base colors
  const baseColor = foliage_type === 'evergreen' ? '#2d5016' : '#4a7c3a';
  const strokeColor = foliage_type === 'evergreen' ? '#1a3010' : '#2d4a22';
  const trunkColor = '#5d4037';

  // Calculate proportions
  const groundLevel = viewBoxSize - 50; // Leave 50cm for scale bar
  const trunkHeight = plantHeight * 0.25; // Trunk is ~25% of total height
  const canopyHeight = plantHeight - trunkHeight;
  const trunkWidth = Math.max(plantHeight * 0.02, 8); // Trunk width ~2% of height, min 8cm

  // Canopy center point
  const centerX = viewBoxSize / 2;
  const canopyBottom = groundLevel - trunkHeight;
  const canopyTop = groundLevel - plantHeight;
  const canopyCenter = (canopyTop + canopyBottom) / 2;

  // Generate elevation shape based on crown shape
  let elevationPath = '';

  switch (shape) {
    case 'pyramidal':
      // Triangular/conical shape for conifers
      elevationPath = `
        <path d="M ${centerX} ${canopyTop}
                 L ${centerX + plantSpread / 2} ${canopyBottom}
                 L ${centerX - plantSpread / 2} ${canopyBottom} Z"
              fill="${baseColor}" stroke="${strokeColor}" stroke-width="2" opacity="0.85"/>
      `;
      break;

    case 'columnar':
      // Narrow upright shape
      const columnarWidth = plantSpread * 0.4;
      elevationPath = `
        <rect x="${centerX - columnarWidth / 2}" y="${canopyTop}"
              width="${columnarWidth}" height="${canopyHeight}"
              fill="${baseColor}" stroke="${strokeColor}" stroke-width="2" rx="20" opacity="0.85"/>
      `;
      break;

    case 'weeping':
      // Drooping canopy shape
      elevationPath = `
        <ellipse cx="${centerX}" cy="${canopyTop + canopyHeight * 0.3}"
                 rx="${plantSpread / 2}" ry="${canopyHeight * 0.9}"
                 fill="${baseColor}" stroke="${strokeColor}" stroke-width="2" opacity="0.85"/>
      `;
      break;

    case 'vase':
      // V-shaped canopy
      elevationPath = `
        <path d="M ${centerX - plantSpread * 0.2} ${canopyTop}
                 Q ${centerX - plantSpread / 2} ${canopyCenter} ${centerX - plantSpread / 2} ${canopyBottom}
                 L ${centerX + plantSpread / 2} ${canopyBottom}
                 Q ${centerX + plantSpread / 2} ${canopyCenter} ${centerX + plantSpread * 0.2} ${canopyTop} Z"
              fill="${baseColor}" stroke="${strokeColor}" stroke-width="2" opacity="0.85"/>
      `;
      break;

    case 'spreading':
      // Wide, flat canopy
      elevationPath = `
        <ellipse cx="${centerX}" cy="${canopyCenter}"
                 rx="${plantSpread / 2}" ry="${canopyHeight / 2.5}"
                 fill="${baseColor}" stroke="${strokeColor}" stroke-width="2" opacity="0.85"/>
      `;
      break;

    default:
      // Rounded/oval shape (most common)
      elevationPath = `
        <ellipse cx="${centerX}" cy="${canopyCenter}"
                 rx="${plantSpread / 2}" ry="${canopyHeight / 2}"
                 fill="${baseColor}" stroke="${strokeColor}" stroke-width="2" opacity="0.85"/>
      `;
  }

  // Human figure for scale reference (1.7m average height)
  const humanHeight = 170; // 1.7m in cm
  const humanWidth = 50; // Simplified human width
  const humanX = 50; // Position from left
  const humanY = groundLevel - humanHeight;

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="${viewBoxSize}" height="${viewBoxSize}" data-scale-size="${scaleBox.size}" data-plant-height="${plantHeight}" data-plant-spread="${plantSpread}" data-view="elevation">
  <defs>
    <!-- Foliage texture -->
    <pattern id="foliage-texture-elev" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="5" cy="5" r="3" fill="${baseColor}" opacity="0.3"/>
      <circle cx="15" cy="10" r="2.5" fill="${baseColor}" opacity="0.4"/>
    </pattern>
  </defs>

  <!-- Ground line -->
  <line x1="0" y1="${groundLevel}" x2="${viewBoxSize}" y2="${groundLevel}"
        stroke="#999" stroke-width="1" opacity="0.5" stroke-dasharray="5,5"/>

  <!-- Human figure for scale (1.7m average person) -->
  <g id="human-scale" opacity="0.7">
    <!-- Head -->
    <circle cx="${humanX + humanWidth / 2}" cy="${humanY + 15}" r="12" fill="#666"/>
    <!-- Body -->
    <rect x="${humanX + humanWidth / 2 - 8}" y="${humanY + 27}" width="16" height="45" fill="#666" rx="4"/>
    <!-- Legs -->
    <rect x="${humanX + humanWidth / 2 - 12}" y="${humanY + 72}" width="10" height="55" fill="#666" rx="3"/>
    <rect x="${humanX + humanWidth / 2 + 2}" y="${humanY + 72}" width="10" height="55" fill="#666" rx="3"/>
    <!-- Arms -->
    <rect x="${humanX + humanWidth / 2 - 20}" y="${humanY + 32}" width="8" height="35" fill="#666" rx="2"/>
    <rect x="${humanX + humanWidth / 2 + 12}" y="${humanY + 32}" width="8" height="35" fill="#666" rx="2"/>
    <!-- Label -->
    <text x="${humanX + humanWidth / 2}" y="${groundLevel + 25}"
          font-family="Arial, sans-serif" font-size="14" fill="#666" text-anchor="middle">
      1.7m
    </text>
  </g>

  <!-- Trunk -->
  <rect x="${centerX - trunkWidth / 2}" y="${canopyBottom}"
        width="${trunkWidth}" height="${trunkHeight}"
        fill="${trunkColor}" stroke="#3e2723" stroke-width="1" rx="2"/>

  <!-- Canopy -->
  ${elevationPath}
</svg>
  `.trim();
}
