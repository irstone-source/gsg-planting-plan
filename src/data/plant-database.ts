/**
 * Comprehensive UK Plant Database
 * Botanical details for all plants used in example plans
 */

export interface PlantDetail {
  scientificName: string;
  commonName: string;
  description: string;
  layer: 'structure' | 'seasonal' | 'groundCover';
  badge: {
    text: string;
    color: string; // Tailwind color class
  };
  careTime: string; // Annual hours
  careNotes: {
    techniques: string[];
    homeowner: string[];
  };
  rhsLink: string;
}

export const plantDatabase: Record<string, PlantDetail> = {
  // STRUCTURE LAYER - Trees & Shrubs

  'Betula pendula (Silver Birch)': {
    scientificName: 'Betula pendula',
    commonName: 'Silver Birch',
    description: 'Elegant native tree with white bark and delicate foliage. Provides height and structure with minimal maintenance.',
    layer: 'structure',
    badge: { text: 'Native Tree', color: 'bg-green-600 text-white' },
    careTime: '1-2 hours',
    careNotes: {
      techniques: [
        'Light formative pruning in late summer (once established)',
        'Remove dead or damaged branches',
        'No regular pruning needed',
        'Minimal watering after establishment (1-2 years)'
      ],
      homeowner: [
        'Very low maintenance once established',
        'May need stepladder for pruning mature trees',
        'No specialist skills required'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/betula/pendula/details'
  },

  'Betula pendula': {
    scientificName: 'Betula pendula',
    commonName: 'Silver Birch',
    description: 'Elegant native tree with white bark and delicate foliage. Provides height and structure.',
    layer: 'structure',
    badge: { text: 'Native Tree', color: 'bg-green-600 text-white' },
    careTime: '1-2 hours',
    careNotes: {
      techniques: [
        'Light formative pruning in late summer',
        'Remove dead or damaged branches',
        'Minimal watering after establishment'
      ],
      homeowner: [
        'Very low maintenance',
        'May need stepladder for mature trees',
        'No specialist skills required'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/betula/pendula/details'
  },

  'Viburnum tinus': {
    scientificName: 'Viburnum tinus',
    commonName: 'Laurustinus',
    description: 'Evergreen shrub with white winter flowers and dark berries. Provides year-round screening and structure.',
    layer: 'structure',
    badge: { text: 'Evergreen', color: 'bg-green-600 text-white' },
    careTime: '2-3 hours',
    careNotes: {
      techniques: [
        'Light trim after flowering (spring)',
        'Remove any frost-damaged shoots',
        'Shape maintenance if used for screening',
        'Water during dry spells in first 2 years'
      ],
      homeowner: [
        'Simple hand pruning with secateurs',
        'Very forgiving and tough',
        'Suitable for beginners'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/viburnum/tinus/details'
  },

  'Fargesia bamboo': {
    scientificName: 'Fargesia murielae',
    commonName: 'Umbrella Bamboo',
    description: 'Non-invasive clumping bamboo with elegant arching habit. Provides instant height and gentle movement.',
    layer: 'structure',
    badge: { text: 'Evergreen', color: 'bg-green-600 text-white' },
    careTime: '1-2 hours',
    careNotes: {
      techniques: [
        'Remove dead canes at base in spring',
        'Thin out oldest canes every 2-3 years',
        'Water well during dry periods',
        'Mulch annually to retain moisture'
      ],
      homeowner: [
        'Non-invasive clumping type (no spreading)',
        'Minimal intervention needed',
        'Simple cutting with loppers'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/7049/fargesia-murielae/details'
  },

  'Fargesia murielae': {
    scientificName: 'Fargesia murielae',
    commonName: 'Umbrella Bamboo',
    description: 'Non-invasive clumping bamboo. Provides instant height and gentle movement.',
    layer: 'structure',
    badge: { text: 'Evergreen', color: 'bg-green-600 text-white' },
    careTime: '1-2 hours',
    careNotes: {
      techniques: [
        'Remove dead canes in spring',
        'Thin oldest canes every 2-3 years',
        'Water during dry periods'
      ],
      homeowner: [
        'Non-invasive clumping type',
        'Minimal maintenance',
        'Simple cutting with loppers'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/7049/fargesia-murielae/details'
  },

  'Climbing Hydrangea': {
    scientificName: 'Hydrangea anomala petiolaris',
    commonName: 'Climbing Hydrangea',
    description: 'Self-clinging climber with white lace-cap flowers in summer. Excellent for north-facing walls.',
    layer: 'structure',
    badge: { text: 'Climber', color: 'bg-green-600 text-white' },
    careTime: '2-3 hours',
    careNotes: {
      techniques: [
        'Prune after flowering to control size',
        'Remove dead or damaged stems',
        'Support young plants until established'
      ],
      homeowner: [
        'Slow to establish (2-3 years)',
        'Self-supporting once mature',
        'Minimal pruning required'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/hydrangea/anomala-ssp-petiolaris/details'
  },

  'Hedera helix': {
    scientificName: 'Hedera helix',
    commonName: 'English Ivy',
    description: 'Fast-growing evergreen climber. Excellent for quick coverage of walls and fences.',
    layer: 'structure',
    badge: { text: 'Evergreen Climber', color: 'bg-green-600 text-white' },
    careTime: '1-2 hours',
    careNotes: {
      techniques: [
        'Trim back in spring to control spread',
        'Remove growth from windows and gutters',
        'Very tolerant of hard pruning'
      ],
      homeowner: [
        'Extremely easy to grow',
        'Can be vigorous - needs control',
        'Thrives on neglect'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/hedera/helix/details'
  },

  'Bamboo in pots': {
    scientificName: 'Fargesia murielae',
    commonName: 'Container Bamboo',
    description: 'Non-invasive bamboo grown in large containers. Provides instant screening and architectural interest.',
    layer: 'structure',
    badge: { text: 'Container', color: 'bg-green-600 text-white' },
    careTime: '2-3 hours',
    careNotes: {
      techniques: [
        'Water regularly - containers dry quickly',
        'Feed monthly during growing season',
        'Remove dead canes annually'
      ],
      homeowner: [
        'Requires regular watering',
        'Repot every 3-4 years',
        'Easy to maintain'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/7049/fargesia-murielae/details'
  },

  'Lavandula': {
    scientificName: 'Lavandula angustifolia',
    commonName: 'English Lavender',
    description: 'Aromatic evergreen shrub with purple flowers. Drought-tolerant and attracts pollinators.',
    layer: 'structure',
    badge: { text: 'Mediterranean', color: 'bg-purple-600 text-white' },
    careTime: '1-2 hours',
    careNotes: {
      techniques: [
        'Prune after flowering (August)',
        'Light trim in spring to shape',
        'No feeding or watering once established'
      ],
      homeowner: [
        'Very low maintenance',
        'Drought-tolerant',
        'Simple with shears'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/lavandula/angustifolia/details'
  },

  'Cornus alba': {
    scientificName: 'Cornus alba',
    commonName: 'Red-barked Dogwood',
    description: 'Deciduous shrub with brilliant red winter stems. Provides winter interest and structure.',
    layer: 'structure',
    badge: { text: 'Winter Interest', color: 'bg-red-600 text-white' },
    careTime: '2-3 hours',
    careNotes: {
      techniques: [
        'Coppice (hard prune) every 2-3 years in March',
        'Remove oldest stems for best color',
        'Tolerates wet conditions'
      ],
      homeowner: [
        'Easy to prune hard',
        'Tolerates wet soil',
        'Excellent winter stems'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/cornus/alba/details'
  },

  'Hydrangea': {
    scientificName: 'Hydrangea macrophylla',
    commonName: 'Mophead Hydrangea',
    description: 'Large flowered shrub with blue or pink blooms. Prefers moist, sheltered positions.',
    layer: 'structure',
    badge: { text: 'Summer Flowers', color: 'bg-blue-600 text-white' },
    careTime: '2-3 hours',
    careNotes: {
      techniques: [
        'Deadhead after flowering',
        'Prune in late winter',
        'Water regularly in dry weather'
      ],
      homeowner: [
        'Easy to grow',
        'Needs regular water',
        'Simple pruning'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/hydrangea/macrophylla/details'
  },

  'Hydrangea arborescens': {
    scientificName: 'Hydrangea arborescens',
    commonName: 'Smooth Hydrangea',
    description: 'White-flowered hydrangea with large blooms. Very hardy and reliable.',
    layer: 'structure',
    badge: { text: 'White Flowers', color: 'bg-white text-gray-900 border border-gray-300' },
    careTime: '2-3 hours',
    careNotes: {
      techniques: [
        'Cut back hard in late winter',
        'Flowers on new wood',
        'Water during dry spells'
      ],
      homeowner: [
        'Very easy to prune',
        'Reliable flowering',
        'Hardy and tough'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/hydrangea/arborescens/details'
  },

  'Sorbus aucuparia (Rowan)': {
    scientificName: 'Sorbus aucuparia',
    commonName: 'Rowan',
    description: 'Native tree with white spring flowers and orange autumn berries. Excellent for wildlife.',
    layer: 'structure',
    badge: { text: 'Native Tree', color: 'bg-green-600 text-white' },
    careTime: '1-2 hours',
    careNotes: {
      techniques: [
        'Minimal pruning required',
        'Remove dead wood only',
        'Self-sufficient once established'
      ],
      homeowner: [
        'Very low maintenance',
        'Excellent wildlife tree',
        'Tolerates exposed sites'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/sorbus/aucuparia/details'
  },

  'Sorbus aucuparia': {
    scientificName: 'Sorbus aucuparia',
    commonName: 'Rowan',
    description: 'Native tree with white flowers and orange berries. Excellent for wildlife.',
    layer: 'structure',
    badge: { text: 'Native Tree', color: 'bg-green-600 text-white' },
    careTime: '1-2 hours',
    careNotes: {
      techniques: [
        'Minimal pruning',
        'Remove dead wood only',
        'Self-sufficient'
      ],
      homeowner: [
        'Very low maintenance',
        'Wildlife magnet',
        'Hardy and tough'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/sorbus/aucuparia/details'
  },

  'Cornus': {
    scientificName: 'Cornus alba',
    commonName: 'Dogwood',
    description: 'Deciduous shrub with colorful winter stems. Provides winter interest.',
    layer: 'structure',
    badge: { text: 'Winter Stems', color: 'bg-red-600 text-white' },
    careTime: '2-3 hours',
    careNotes: {
      techniques: [
        'Coppice every 2-3 years',
        'Cut back in early spring',
        'Tolerates wet soil'
      ],
      homeowner: [
        'Easy hard pruning',
        'Wet soil tolerant',
        'Brilliant winter color'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/cornus/alba/details'
  },

  'Rosemary': {
    scientificName: 'Rosmarinus officinalis',
    commonName: 'Rosemary',
    description: 'Aromatic evergreen herb with blue flowers. Drought-tolerant Mediterranean plant.',
    layer: 'structure',
    badge: { text: 'Culinary Herb', color: 'bg-blue-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Trim after flowering',
        'No feeding or watering once established',
        'Protect from hard frost'
      ],
      homeowner: [
        'Very low maintenance',
        'Drought-tolerant',
        'Culinary use'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/rosmarinus/officinalis/details'
  },

  'Climbing roses': {
    scientificName: 'Rosa (climbing varieties)',
    commonName: 'Climbing Rose',
    description: 'Flowering climber with fragrant blooms. Requires support and regular deadheading.',
    layer: 'structure',
    badge: { text: 'Climber', color: 'bg-pink-600 text-white' },
    careTime: '4-6 hours',
    careNotes: {
      techniques: [
        'Deadhead regularly in summer',
        'Prune in late winter',
        'Tie in new growth',
        'Feed in spring and summer'
      ],
      homeowner: [
        'Requires regular attention',
        'Reward with abundant flowers',
        'Learn basic rose pruning'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/rosa/growing-guide'
  },

  // SEASONAL LAYER - Perennials

  'Geranium Rozanne': {
    scientificName: 'Geranium \'Rozanne\'',
    commonName: 'Rozanne Cranesbill',
    description: 'Award-winning perennial with blue flowers from June-November. Low maintenance and reliable.',
    layer: 'seasonal',
    badge: { text: 'Long-flowering', color: 'bg-blue-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Cut back to ground level in late autumn',
        'Optional: deadhead to prolong flowering',
        'Water during establishment only',
        'No feeding required once established'
      ],
      homeowner: [
        'Exceptionally low maintenance',
        'RHS Award of Garden Merit winner',
        'Perfect for beginners'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/geranium/rozanne/details'
  },

  'Geranium \'Rozanne\'': {
    scientificName: 'Geranium \'Rozanne\'',
    commonName: 'Rozanne Cranesbill',
    description: 'Award-winning perennial with blue flowers. Very long flowering season.',
    layer: 'seasonal',
    badge: { text: 'Long-flowering', color: 'bg-blue-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Cut back in late autumn',
        'Deadhead to prolong flowering',
        'Water during establishment'
      ],
      homeowner: [
        'Exceptionally easy',
        'RHS Award winner',
        'Beginner-friendly'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/geranium/rozanne/details'
  },

  'Alchemilla mollis': {
    scientificName: 'Alchemilla mollis',
    commonName: 'Lady\'s Mantle',
    description: 'Soft chartreuse flowers and beautiful foliage. Perfect edge softener and incredibly tough.',
    layer: 'seasonal',
    badge: { text: 'Foliage', color: 'bg-yellow-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Cut back foliage after flowering (July)',
        'Remove spent flowers to prevent self-seeding',
        'No watering needed once established',
        'Incredibly drought-tolerant'
      ],
      homeowner: [
        'One of the easiest perennials to grow',
        'Tolerates virtually any conditions',
        'No specialist knowledge needed'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/alchemilla/mollis/details'
  },

  'Hostas': {
    scientificName: 'Hosta species',
    commonName: 'Hosta',
    description: 'Shade-loving perennial with attractive foliage. Perfect for shady courtyard corners.',
    layer: 'seasonal',
    badge: { text: 'Shade', color: 'bg-green-700 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Remove dead foliage in autumn',
        'Protect from slugs with organic pellets',
        'Water during dry spells'
      ],
      homeowner: [
        'Easy to grow in shade',
        'Watch for slug damage',
        'Divide every 3-4 years'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/hosta/growing-guide'
  },

  'Astilbe': {
    scientificName: 'Astilbe species',
    commonName: 'Astilbe',
    description: 'Feathery plumes in shades of pink, red, and white. Prefers moist, shady positions.',
    layer: 'seasonal',
    badge: { text: 'Shade', color: 'bg-pink-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Cut back in late autumn',
        'Water regularly - dislikes dry soil',
        'Mulch to retain moisture'
      ],
      homeowner: [
        'Needs consistent moisture',
        'Perfect for wet shade',
        'Easy to grow'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/astilbe/growing-guide'
  },

  'Brunnera': {
    scientificName: 'Brunnera macrophylla',
    commonName: 'Siberian Bugloss',
    description: 'Blue forget-me-not flowers in spring with attractive silver-marked foliage.',
    layer: 'seasonal',
    badge: { text: 'Shade', color: 'bg-blue-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Remove dead foliage in autumn',
        'Tolerates dry shade once established',
        'Minimal care required'
      ],
      homeowner: [
        'Very low maintenance',
        'Self-sufficient',
        'Beautiful foliage'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/brunnera/macrophylla/details'
  },

  'Agapanthus': {
    scientificName: 'Agapanthus praecox',
    commonName: 'African Lily',
    description: 'Bold blue or white flower heads on tall stems. Excellent for coastal and hot, dry sites.',
    layer: 'seasonal',
    badge: { text: 'Drought-tolerant', color: 'bg-blue-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Remove dead flower heads',
        'Protect crowns in cold winters',
        'Minimal watering once established'
      ],
      homeowner: [
        'Very low maintenance',
        'Drought-tolerant',
        'Striking architectural flowers'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/agapanthus/growing-guide'
  },

  'Echinacea': {
    scientificName: 'Echinacea purpurea',
    commonName: 'Coneflower',
    description: 'Pink-purple daisy flowers loved by pollinators. Tough and drought-tolerant.',
    layer: 'seasonal',
    badge: { text: 'Pollinator', color: 'bg-pink-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Cut back in late autumn',
        'Deadhead to prolong flowering',
        'Very drought-tolerant'
      ],
      homeowner: [
        'Easy and reliable',
        'Wildlife magnet',
        'No special care'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/echinacea/purpurea/details'
  },

  'Verbena': {
    scientificName: 'Verbena bonariensis',
    commonName: 'Argentinian Vervain',
    description: 'Tall, airy purple flowers that sway in breeze. Self-seeds freely and loved by butterflies.',
    layer: 'seasonal',
    badge: { text: 'Pollinator', color: 'bg-purple-600 text-white' },
    careTime: '30 minutes',
    careNotes: {
      techniques: [
        'Cut back in spring',
        'Allow to self-seed',
        'No watering once established'
      ],
      homeowner: [
        'Minimal care',
        'Self-seeding perennial',
        'Butterflies love it'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/verbena/bonariensis/details'
  },

  'Ligularia': {
    scientificName: 'Ligularia dentata',
    commonName: 'Leopard Plant',
    description: 'Bold orange-yellow daisy flowers with large leaves. Prefers moist, shady positions.',
    layer: 'seasonal',
    badge: { text: 'Bold', color: 'bg-orange-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Cut back in autumn',
        'Water regularly - needs moist soil',
        'Mulch to retain moisture'
      ],
      homeowner: [
        'Needs consistent moisture',
        'Bold architectural plant',
        'Easy if kept moist'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/ligularia/dentata/details'
  },

  'Rudbeckia': {
    scientificName: 'Rudbeckia fulgida',
    commonName: 'Black-eyed Susan',
    description: 'Golden yellow daisy flowers with dark centers. Long flowering and very reliable.',
    layer: 'seasonal',
    badge: { text: 'Long-flowering', color: 'bg-yellow-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Cut back in late autumn',
        'Deadhead to prolong flowering',
        'Very drought-tolerant'
      ],
      homeowner: [
        'Exceptionally easy',
        'Very long flowering',
        'No special care'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/rudbeckia/fulgida/details'
  },

  'Hosta': {
    scientificName: 'Hosta species',
    commonName: 'Plantain Lily',
    description: 'Shade-loving foliage plant with attractive leaves. Perfect for shady areas.',
    layer: 'seasonal',
    badge: { text: 'Shade', color: 'bg-green-700 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Remove dead foliage in autumn',
        'Protect from slugs',
        'Water in dry weather'
      ],
      homeowner: [
        'Easy in shade',
        'Watch for slugs',
        'Divide every few years'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/hosta/growing-guide'
  },

  'Native perennials': {
    scientificName: 'Various UK natives',
    commonName: 'Native Perennials',
    description: 'Mix of UK native perennial wildflowers. Excellent for wildlife and low maintenance.',
    layer: 'seasonal',
    badge: { text: 'Native', color: 'bg-green-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Cut back in late winter',
        'No feeding required',
        'Self-sufficient'
      ],
      homeowner: [
        'Very low maintenance',
        'Wildlife-friendly',
        'Suited to local conditions'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/wildlife/native-plants'
  },

  'Wildflowers': {
    scientificName: 'Various wildflower species',
    commonName: 'Wildflower Mix',
    description: 'Native wildflower meadow mix. Excellent for pollinators and low maintenance.',
    layer: 'seasonal',
    badge: { text: 'Wildlife', color: 'bg-yellow-600 text-white' },
    careTime: '2 hours',
    careNotes: {
      techniques: [
        'Cut once or twice per year',
        'Remove cuttings to reduce fertility',
        'No feeding'
      ],
      homeowner: [
        'Annual cut only',
        'Wildlife haven',
        'Very low maintenance'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/garden-inspiration/wild/wildflowers'
  },

  'Hardy perennials': {
    scientificName: 'Various hardy species',
    commonName: 'Mixed Perennials',
    description: 'Tough, reliable perennials suited to harsh conditions. Low maintenance selection.',
    layer: 'seasonal',
    badge: { text: 'Hardy', color: 'bg-blue-600 text-white' },
    careTime: '1-2 hours',
    careNotes: {
      techniques: [
        'Cut back in autumn or spring',
        'Minimal watering once established',
        'No feeding required'
      ],
      homeowner: [
        'Very tough plants',
        'Low maintenance',
        'Suited to exposed sites'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/perennials/growing-guide'
  },

  'Geranium': {
    scientificName: 'Geranium species',
    commonName: 'Hardy Geranium',
    description: 'Versatile ground-cover perennial with long flowering season. Very easy to grow.',
    layer: 'seasonal',
    badge: { text: 'Ground cover', color: 'bg-pink-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Cut back after flowering',
        'Deadhead to prolong flowering',
        'Very drought-tolerant'
      ],
      homeowner: [
        'Exceptionally easy',
        'Long flowering',
        'Perfect for beginners'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/geranium/growing-guide'
  },

  // GROUND COVER LAYER

  'Ferns': {
    scientificName: 'Dryopteris filix-mas',
    commonName: 'Male Fern',
    description: 'Lush deciduous fern for shaded areas. Adds texture and architectural interest with minimal care.',
    layer: 'groundCover',
    badge: { text: 'Shade-tolerant', color: 'bg-emerald-600 text-white' },
    careTime: '30 minutes',
    careNotes: {
      techniques: [
        'Remove dead fronds in early spring',
        'Apply mulch annually to retain moisture',
        'Water during very dry spells',
        'No pruning or feeding required'
      ],
      homeowner: [
        'Minimal care required',
        'Perfect for neglected shady areas',
        'Extremely low maintenance'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/6061/dryopteris-filix-mas/details'
  },

  'Dryopteris filix-mas': {
    scientificName: 'Dryopteris filix-mas',
    commonName: 'Male Fern',
    description: 'Deciduous fern with architectural fronds. Perfect for shade.',
    layer: 'groundCover',
    badge: { text: 'Shade', color: 'bg-emerald-600 text-white' },
    careTime: '30 minutes',
    careNotes: {
      techniques: [
        'Remove dead fronds in spring',
        'Mulch annually',
        'Water in dry spells'
      ],
      homeowner: [
        'Minimal care',
        'Perfect for neglected areas',
        'Very low maintenance'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/6061/dryopteris-filix-mas/details'
  },

  'Ferns in containers': {
    scientificName: 'Various fern species',
    commonName: 'Container Ferns',
    description: 'Shade-loving ferns in pots. Perfect for courtyard corners and shady spots.',
    layer: 'groundCover',
    badge: { text: 'Container', color: 'bg-emerald-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Water regularly - containers dry quickly',
        'Remove dead fronds in spring',
        'Repot every 2-3 years'
      ],
      homeowner: [
        'Requires regular watering',
        'Very shade-tolerant',
        'Easy to maintain'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/ferns/growing-guide'
  },

  'Ajuga reptans': {
    scientificName: 'Ajuga reptans',
    commonName: 'Bugle',
    description: 'Mat-forming ground cover with blue spring flowers and purple foliage. Suppresses weeds effectively.',
    layer: 'groundCover',
    badge: { text: 'Ground cover', color: 'bg-emerald-600 text-white' },
    careTime: '30 minutes',
    careNotes: {
      techniques: [
        'Trim back after flowering if needed',
        'Remove any spreading growth from paths',
        'No regular maintenance required',
        'Self-sufficient once established'
      ],
      homeowner: [
        'Almost zero maintenance',
        'Excellent weed suppressor',
        'Thrives on neglect'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/ajuga/reptans/details'
  },

  'Ajuga': {
    scientificName: 'Ajuga reptans',
    commonName: 'Bugle',
    description: 'Mat-forming ground cover with blue flowers. Excellent weed suppressor.',
    layer: 'groundCover',
    badge: { text: 'Ground cover', color: 'bg-blue-600 text-white' },
    careTime: '30 minutes',
    careNotes: {
      techniques: [
        'Trim after flowering',
        'Remove path spreading',
        'Self-sufficient'
      ],
      homeowner: [
        'Almost no care',
        'Weed suppressor',
        'Thrives on neglect'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/ajuga/reptans/details'
  },

  'Sedum': {
    scientificName: 'Sedum species',
    commonName: 'Stonecrop',
    description: 'Succulent ground cover perfect for dry, sunny sites. Flowers attract butterflies.',
    layer: 'groundCover',
    badge: { text: 'Drought-tolerant', color: 'bg-pink-600 text-white' },
    careTime: '30 minutes',
    careNotes: {
      techniques: [
        'Cut back in spring',
        'No watering once established',
        'Thrives on neglect'
      ],
      homeowner: [
        'Extremely low maintenance',
        'Perfect for dry sites',
        'Almost indestructible'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/sedum/growing-guide'
  },

  'Thyme': {
    scientificName: 'Thymus serpyllum',
    commonName: 'Creeping Thyme',
    description: 'Aromatic ground cover with tiny flowers. Tolerates light foot traffic.',
    layer: 'groundCover',
    badge: { text: 'Aromatic', color: 'bg-purple-600 text-white' },
    careTime: '30 minutes',
    careNotes: {
      techniques: [
        'Trim after flowering',
        'No feeding or watering',
        'Tolerates light trampling'
      ],
      homeowner: [
        'Very low maintenance',
        'Aromatic when walked on',
        'Drought-tolerant'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/thymus/serpyllum/details'
  },

  'Native grasses': {
    scientificName: 'Various UK native grasses',
    commonName: 'Native Grass Mix',
    description: 'UK native grasses providing texture and movement. Excellent for naturalistic planting.',
    layer: 'groundCover',
    badge: { text: 'Native', color: 'bg-green-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Cut back in late winter',
        'No feeding required',
        'Self-sufficient'
      ],
      homeowner: [
        'Very low maintenance',
        'Wildlife-friendly',
        'Natural movement'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/grasses/growing-guide'
  },

  'Moss': {
    scientificName: 'Various moss species',
    commonName: 'Moss',
    description: 'Soft green carpet in shady, damp areas. Low-growing and evergreen.',
    layer: 'groundCover',
    badge: { text: 'Shade', color: 'bg-green-700 text-white' },
    careTime: '0 hours',
    careNotes: {
      techniques: [
        'No maintenance required',
        'Thrives on neglect',
        'Self-establishing'
      ],
      homeowner: [
        'Zero maintenance',
        'Perfect for damp shade',
        'Natural carpet'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/biodiversity/moss'
  },

  'Euphorbia': {
    scientificName: 'Euphorbia characias',
    commonName: 'Mediterranean Spurge',
    description: 'Architectural evergreen with lime-green flower heads. Drought-tolerant and structural.',
    layer: 'groundCover',
    badge: { text: 'Architectural', color: 'bg-lime-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Remove flowered stems in summer',
        'Wear gloves - sap can irritate',
        'No watering once established'
      ],
      homeowner: [
        'Very drought-tolerant',
        'Architectural presence',
        'Minimal care'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/euphorbia/characias/details'
  }
};

/**
 * Get plant details by common or scientific name
 */
export function getPlantDetail(plantName: string): PlantDetail | null {
  // Direct match
  if (plantDatabase[plantName]) {
    return plantDatabase[plantName];
  }

  // Fuzzy match - try without parentheses
  const cleanName = plantName.replace(/\s*\([^)]*\)/g, '').trim();
  for (const [key, plant] of Object.entries(plantDatabase)) {
    if (key.includes(cleanName) || plant.commonName.includes(cleanName)) {
      return plant;
    }
  }

  // Default fallback
  return {
    scientificName: plantName,
    commonName: plantName,
    description: 'Suitable perennial for UK gardens. Consult RHS for specific care requirements.',
    layer: 'seasonal',
    badge: { text: 'Perennial', color: 'bg-green-600 text-white' },
    careTime: '1-2 hours',
    careNotes: {
      techniques: ['Cut back in autumn', 'Water during establishment', 'Minimal care once established'],
      homeowner: ['Easy to grow', 'UK hardy', 'Low maintenance']
    },
    rhsLink: `https://www.rhs.org.uk/plants/search-form`
  };
}
