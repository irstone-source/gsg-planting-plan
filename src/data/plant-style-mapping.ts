/**
 * Plant Style Mapping
 * Maps plants to design philosophies and provides guidance for plant selection
 */

export interface PlantStyleMapping {
  designStyle: string;
  category: 'structure' | 'seasonal' | 'groundCover';
  plants: {
    name: string;
    role: string;
    why: string;
    percentage?: number; // % of planting
  }[];
}

export const plantStyleMappings: PlantStyleMapping[] = [
  // PIET OUDOLF PRAIRIE STYLE
  {
    designStyle: 'Piet Oudolf Prairie',
    category: 'structure',
    plants: [
      {
        name: 'Calamagrostis Karl Foerster',
        role: 'Vertical Framework',
        why: 'Upright architecture, stands through winter, signature Oudolf grass',
        percentage: 15
      },
      {
        name: 'Molinia Transparent',
        role: 'Ethereal Layer',
        why: 'Floating seed heads, transparent quality, excellent UK performance',
        percentage: 15
      },
      {
        name: 'Native grasses',
        role: 'Matrix',
        why: 'Creates textural foundation and suppresses weeds',
        percentage: 10
      }
    ]
  },
  {
    designStyle: 'Piet Oudolf Prairie',
    category: 'seasonal',
    plants: [
      {
        name: 'Rudbeckia Deamii',
        role: 'Late Season Color',
        why: 'Reliable autumn performer, strong seed heads, never needs staking',
        percentage: 12
      },
      {
        name: 'Echinacea pallida',
        role: 'Structural Accent',
        why: 'Elegant form, long-lived, important wildlife plant',
        percentage: 10
      },
      {
        name: 'Helenium autumnale',
        role: 'Autumn Drama',
        why: 'Warm tones, strong structure, Oudolf signature perennial',
        percentage: 10
      },
      {
        name: 'Sanguisorba officinalis',
        role: 'Textural Accent',
        why: 'Subtle elegance, unique form, refined Oudolf favourite',
        percentage: 8
      },
      {
        name: 'Persicaria amplexicaulis',
        role: 'Long Flowering Matrix',
        why: 'Flowers June-October, knits planting together',
        percentage: 10
      }
    ]
  },
  {
    designStyle: 'Piet Oudolf Prairie',
    category: 'groundCover',
    plants: [
      {
        name: 'Geranium Rozanne',
        role: 'Ground Binding Matrix',
        why: 'Long flowering, suppresses weeds, Oudolf matrix plant despite hybrid status',
        percentage: 5
      },
      {
        name: 'Nepeta Walkers Low',
        role: 'Early Structure',
        why: 'Pollinator-rich, creates soft edges, reliable UK performer',
        percentage: 5
      }
    ]
  },

  // CHELSEA WILDLIFE GARDEN
  {
    designStyle: 'Chelsea Wildlife Haven',
    category: 'structure',
    plants: [
      {
        name: 'Hawthorn',
        role: 'Native Framework',
        why: 'Supports 300+ insect species, nesting habitat, May blossom iconic',
        percentage: 15
      },
      {
        name: 'Guelder Rose',
        role: 'Wildlife Shrub',
        why: 'Pollinator flowers, translucent berries for birds, multi-season interest',
        percentage: 10
      },
      {
        name: 'Hazel',
        role: 'Multi-stem Structure',
        why: 'Early catkins for bees, nuts for mammals, traditional hedgerow plant',
        percentage: 10
      }
    ]
  },
  {
    designStyle: 'Chelsea Wildlife Haven',
    category: 'seasonal',
    plants: [
      {
        name: 'Oxeye Daisy',
        role: 'Native Wildflower',
        why: 'Classic meadow flower, long flowering, almost ubiquitous in Chelsea wildlife gardens',
        percentage: 12
      },
      {
        name: 'Knapweed',
        role: 'Top Pollinator Plant',
        why: 'One of the best UK pollinator plants, Chelsea wildlife garden staple',
        percentage: 12
      },
      {
        name: 'Meadow Cranesbill',
        role: 'Native Filler',
        why: 'UK native geranium, long flowering, soft and reliable',
        percentage: 10
      },
      {
        name: 'Field Scabious',
        role: 'Butterfly Magnet',
        why: 'Tall airy layers, attracts specialist scabious bees, meadow essential',
        percentage: 8
      },
      {
        name: 'Purple Loosestrife',
        role: 'Wetland Accent',
        why: 'Dramatic spikes, excellent for rain gardens and pond edges',
        percentage: 8
      }
    ]
  },
  {
    designStyle: 'Chelsea Wildlife Haven',
    category: 'groundCover',
    plants: [
      {
        name: 'Wild Strawberry',
        role: 'Edible Native Groundcover',
        why: 'Pollinators love flowers, birds eat fruit, soft attractive groundcover',
        percentage: 5
      },
      {
        name: 'Selfheal',
        role: 'Lawn Alternative',
        why: 'Long flowering nectar source, tolerates light foot traffic, spreads gently',
        percentage: 5
      }
    ]
  },

  // MONTY DON COTTAGE GARDEN
  {
    designStyle: 'Monty Don Cottage Garden',
    category: 'structure',
    plants: [
      {
        name: 'Climbing roses',
        role: 'Romantic Framework',
        why: 'Classic cottage garden, scent, repeat flowering, David Austin style',
        percentage: 15
      },
      {
        name: 'Lavender',
        role: 'Fragrant Edging',
        why: 'Traditional cottage garden, pollinator-friendly, aromatic structure',
        percentage: 10
      },
      {
        name: 'Rosemary',
        role: 'Evergreen Herbs',
        why: 'Year-round structure, culinary use, Mediterranean classic',
        percentage: 5
      }
    ]
  },

  // MODERN MINIMALIST (CHELSEA 2023 GOLD)
  {
    designStyle: 'Chelsea Modern Minimalist',
    category: 'structure',
    plants: [
      {
        name: 'Betula pendula',
        role: 'Sculptural Focal Point',
        why: 'Multi-stem birch as art piece, white bark, minimal canopy',
        percentage: 10
      },
      {
        name: 'Umbrella Bamboo',
        role: 'Evergreen Screen',
        why: 'Non-invasive bamboo, gentle movement, instant height',
        percentage: 15
      },
      {
        name: 'Viburnum tinus',
        role: 'Evergreen Structure',
        why: 'Year-round presence, subtle flowers, can be clipped or natural',
        percentage: 10
      }
    ]
  },

  // DAN PEARSON WILDFLOWER MEADOW
  {
    designStyle: 'Dan Pearson Wildflower Meadow',
    category: 'structure',
    plants: [
      {
        name: 'Red Fescue',
        role: 'Fine-leaved Framework',
        why: 'Creates meadow matrix, low fertility lover, traditional hay meadow grass',
        percentage: 20
      },
      {
        name: 'Crested Dog\'s-tail',
        role: 'Delicate Structure',
        why: 'Dan Pearson signature, elegant seed heads, essential UK meadow grass',
        percentage: 20
      },
      {
        name: 'Sweet Vernal Grass',
        role: 'Aromatic Layer',
        why: 'Sweet hay scent when cut, early flowering, textural elegance',
        percentage: 15
      }
    ]
  },
  {
    designStyle: 'Dan Pearson Wildflower Meadow',
    category: 'seasonal',
    plants: [
      {
        name: 'Oxeye Daisy',
        role: 'Classic Meadow Flower',
        why: 'Traditional hay meadow, long flowering, cheerful and reliable',
        percentage: 10
      },
      {
        name: 'Knapweed',
        role: 'Pollinator Essential',
        why: 'One of best UK pollinator plants, essential meadow species',
        percentage: 10
      },
      {
        name: 'Meadow Buttercup',
        role: 'Golden Meadow Layer',
        why: 'Traditional hay meadow indicator, glossy yellow cups, self-seeds',
        percentage: 8
      },
      {
        name: 'Field Scabious',
        role: 'Airy Height',
        why: 'Tall elegant layers, specialist bee plant, meadow essential',
        percentage: 5
      },
      {
        name: 'Red Campion',
        role: 'Hedgerow Edge',
        why: 'Woodland edge native, long flowering, loved by pollinators',
        percentage: 5
      },
      {
        name: 'Devil\'s-bit Scabious',
        role: 'Wet Meadow Accent',
        why: 'Late nectar source, Marsh Fritillary host, conservation value',
        percentage: 2
      }
    ]
  },
  {
    designStyle: 'Dan Pearson Wildflower Meadow',
    category: 'groundCover',
    plants: [
      {
        name: 'Bird\'s-foot Trefoil',
        role: 'Nitrogen-Fixing Groundcover',
        why: 'Fixes nitrogen naturally, feeds Common Blue butterfly, cheerful yellow',
        percentage: 3
      },
      {
        name: 'Wild Strawberry',
        role: 'Edible Native',
        why: 'Pollinators love flowers, birds eat fruit, gentle spreader',
        percentage: 1
      },
      {
        name: 'Selfheal',
        role: 'Low Meadow Layer',
        why: 'Tolerates light traffic, long flowering nectar source',
        percentage: 1
      }
    ]
  }
];

/**
 * Get plant recommendations for a specific design style
 */
export function getPlantsForStyle(styleName: string, category?: 'structure' | 'seasonal' | 'groundCover') {
  const mappings = plantStyleMappings.filter(m => m.designStyle === styleName);

  if (category) {
    return mappings.filter(m => m.category === category);
  }

  return mappings;
}

/**
 * Get design styles that use a specific plant
 */
export function getStylesForPlant(plantName: string): string[] {
  const styles = new Set<string>();

  plantStyleMappings.forEach(mapping => {
    if (mapping.plants.some(p => p.name === plantName)) {
      styles.add(mapping.designStyle);
    }
  });

  return Array.from(styles);
}

/**
 * Planting percentages guidance by style
 */
export const plantingProportions = {
  'Piet Oudolf Prairie': {
    structure: '35-40% (grasses dominate)',
    seasonal: '40-45% (perennials)',
    groundCover: '15-20% (matrix plants)'
  },
  'Chelsea Wildlife Haven': {
    structure: '30-35% (native trees & shrubs)',
    seasonal: '50-55% (native wildflowers & perennials)',
    groundCover: '10-15% (native groundcover)'
  },
  'Monty Don Cottage Garden': {
    structure: '25-30% (roses, shrubs)',
    seasonal: '50-60% (cottage perennials)',
    groundCover: '10-15% (informal fillers)'
  },
  'Chelsea Modern Minimalist': {
    structure: '40-50% (architectural plants)',
    seasonal: '30-40% (restrained palette)',
    groundCover: '10-20% (clean groundcover)'
  },
  'Dan Pearson Wildflower Meadow': {
    structure: '50-60% (native meadow grasses)',
    seasonal: '35-40% (wildflowers & perennials)',
    groundCover: '5-10% (low nitrogen-fixers)'
  }
};

/**
 * Design philosophy summaries
 */
export const stylePhilosophySummaries = {
  'Piet Oudolf Prairie': 'Matrix planting with grasses as framework. Structure and seed heads prioritised over fleeting flowers. Embrace decay. Single annual cutback.',

  'Chelsea Wildlife Haven': 'Native plants as backbone. Three-dimensional layering. Year-round food sources. Beauty through natural form and seasonal change.',

  'Monty Don Cottage Garden': 'Romantic abundance. Roses, perennials, edibles mixed. Self-seeding informality. Scent and traditional charm.',

  'Chelsea Modern Minimalist': 'Less is more. Limited palette in generous blocks. Evergreen framework. Hard landscaping integral to design.',

  'Dan Pearson Wildflower Meadow': 'Plant communities, not random mixes. Grasses as framework (50-60%). Low fertility soil essential. Single annual cut after seed set. Design with the land, not on it.'
};
