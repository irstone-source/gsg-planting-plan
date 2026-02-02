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
  },

  // PIET OUDOLF PRAIRIE STYLE PLANTS

  'Calamagrostis Karl Foerster': {
    scientificName: 'Calamagrostis × acutiflora \'Karl Foerster\'',
    commonName: 'Feather Reed Grass',
    description: 'Upright, architectural grass. Chelsea & Oudolf staple. Strong winter silhouette with vertical flower spikes in midsummer.',
    layer: 'structure',
    badge: { text: 'Oudolf Signature', color: 'bg-amber-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Single annual cutback in late February',
        'Leave standing through winter for structure',
        'No staking required',
        'Tolerates wide range of soils'
      ],
      homeowner: [
        'Extremely low maintenance',
        'Stands upright in all weathers',
        'Superb winter interest'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/2326/calamagrostis-x-acutiflora-karl-foerster/details'
  },

  'Molinia Transparent': {
    scientificName: 'Molinia caerulea \'Transparent\'',
    commonName: 'Purple Moor Grass',
    description: 'Floating flower heads, light and elegant. Excellent in UK conditions. Transparent seed heads create ethereal effect.',
    layer: 'structure',
    badge: { text: 'Oudolf Favourite', color: 'bg-amber-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Cut back in late winter',
        'Self-supporting',
        'Thrives in moist soils',
        'Turns golden in autumn'
      ],
      homeowner: [
        'Very easy to grow',
        'Beautiful movement in wind',
        'No pest or disease issues'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/11069/molinia-caerulea-transparent/details'
  },

  'Echinacea pallida': {
    scientificName: 'Echinacea pallida',
    commonName: 'Pale Purple Coneflower',
    description: 'Elegant seed heads with drooping petals. Strong wildlife value. Long-lived Oudolf perennial.',
    layer: 'seasonal',
    badge: { text: 'Pollinator', color: 'bg-green-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Leave seed heads for birds',
        'Cut back in late winter',
        'Drought tolerant once established',
        'Deadheading optional'
      ],
      homeowner: [
        'Low maintenance',
        'Attracts goldfinches',
        'Long flowering season'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/6872/echinacea-pallida/details'
  },

  'Rudbeckia Deamii': {
    scientificName: 'Rudbeckia fulgida var. deamii',
    commonName: 'Black-Eyed Susan',
    description: 'Reliable late-summer colour with strong winter structure. Seed heads persist beautifully.',
    layer: 'seasonal',
    badge: { text: 'Oudolf Classic', color: 'bg-amber-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Cut back in late February',
        'Self-supporting',
        'Leave seed heads for winter interest',
        'Divide every 3-4 years if needed'
      ],
      homeowner: [
        'Very easy and reliable',
        'Long flowering period',
        'Never needs staking'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/15532/rudbeckia-fulgida-var-deamii/details'
  },

  'Helenium autumnale': {
    scientificName: 'Helenium autumnale',
    commonName: 'Sneezeweed',
    description: 'Key autumn performer in Oudolf planting. Warm tones and strong seed head structure.',
    layer: 'seasonal',
    badge: { text: 'Late Season', color: 'bg-orange-600 text-white' },
    careTime: '1-2 hours',
    careNotes: {
      techniques: [
        'Chelsea chop in late May for bushier plants',
        'Cut back in late winter',
        'Benefits from division every 3 years',
        'Deadhead for extended flowering'
      ],
      homeowner: [
        'Moderate maintenance',
        'Rich autumn colour',
        'Excellent pollinator plant'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/8580/helenium-autumnale/details'
  },

  'Persicaria amplexicaulis': {
    scientificName: 'Persicaria amplexicaulis',
    commonName: 'Red Bistort',
    description: 'Long flowering spikes, late season colour. Matrix plant in Oudolf designs.',
    layer: 'seasonal',
    badge: { text: 'Long Flowering', color: 'bg-pink-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Cut back in late winter',
        'Tolerates wide range of conditions',
        'Self-supporting',
        'Flowers June to October'
      ],
      homeowner: [
        'Very easy to grow',
        'Excellent ground cover',
        'Minimal care needed'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/13320/persicaria-amplexicaulis/details'
  },

  'Nepeta Walkers Low': {
    scientificName: 'Nepeta racemosa \'Walker\'s Low\'',
    commonName: 'Catmint',
    description: 'Early structure, pollinator-rich. Oudolf matrix plant creating soft edges and long flowering.',
    layer: 'groundCover',
    badge: { text: 'Pollinator', color: 'bg-purple-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Shear back after first flowering for second flush',
        'Cut back in late winter',
        'Very drought tolerant',
        'Aromatic foliage'
      ],
      homeowner: [
        'Easy and reliable',
        'Loved by bees',
        'Long flowering season'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/11731/nepeta-racemosa-walkers-low/details'
  },

  'Sanguisorba officinalis': {
    scientificName: 'Sanguisorba officinalis',
    commonName: 'Great Burnet',
    description: 'Subtle, refined Oudolf favourite with elegant bottle-brush flowers.',
    layer: 'seasonal',
    badge: { text: 'Architectural', color: 'bg-red-700 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Leave seed heads standing',
        'Cut back in late winter',
        'Prefers moisture-retentive soil',
        'Self-supporting'
      ],
      homeowner: [
        'Low maintenance',
        'Unique texture',
        'Loved by wildlife'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/17094/sanguisorba-officinalis/details'
  },

  // CHELSEA WILDLIFE GARDEN PLANTS

  'Hawthorn': {
    scientificName: 'Crataegus monogyna',
    commonName: 'Hawthorn',
    description: 'UK native. Nectar for insects, berries for birds, nesting habitat. Chelsea wildlife garden staple.',
    layer: 'structure',
    badge: { text: 'Native', color: 'bg-green-600 text-white' },
    careTime: '2 hours',
    careNotes: {
      techniques: [
        'Can be clipped as hedge or grown as multi-stem tree',
        'Prune in late winter if needed',
        'Tolerates hard cutting',
        'Very hardy and adaptable'
      ],
      homeowner: [
        'Supports 300+ insect species',
        'Excellent wildlife value',
        'Beautiful May blossom'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/3874/crataegus-monogyna/details'
  },

  'Guelder Rose': {
    scientificName: 'Viburnum opulus',
    commonName: 'Guelder Rose',
    description: 'UK native shrub. Pollinator flowers, translucent red berries loved by birds. Chelsea naturalistic hedging.',
    layer: 'structure',
    badge: { text: 'Native', color: 'bg-green-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Minimal pruning required',
        'Remove dead wood in winter',
        'Prefers moisture-retentive soil',
        'Autumn colour and berries'
      ],
      homeowner: [
        'Easy to grow',
        'Multi-season interest',
        'Excellent wildlife shrub'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/19353/viburnum-opulus/details'
  },

  'Hazel': {
    scientificName: 'Corylus avellana',
    commonName: 'Hazel',
    description: 'UK native. Nuts for mammals, catkins for early bees. Multi-stem sculptural form.',
    layer: 'structure',
    badge: { text: 'Native', color: 'bg-green-600 text-white' },
    careTime: '1-2 hours',
    careNotes: {
      techniques: [
        'Coppice every 7-10 years for vigour',
        'Or grow as multi-stem tree',
        'Prune in late winter',
        'Catkins appear January-March'
      ],
      homeowner: [
        'Traditional UK hedgerow plant',
        'Edible nuts',
        'Important for wildlife'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/4467/corylus-avellana/details'
  },

  'Oxeye Daisy': {
    scientificName: 'Leucanthemum vulgare',
    commonName: 'Oxeye Daisy',
    description: 'UK native wildflower. Bright, informal drifts. Bees and butterflies. Almost ubiquitous in Chelsea wildlife gardens.',
    layer: 'seasonal',
    badge: { text: 'Native Wildflower', color: 'bg-green-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Cut back after flowering',
        'Self-seeds freely',
        'No feeding required',
        'Thrives in poor soil'
      ],
      homeowner: [
        'Very easy to grow',
        'Classic meadow flower',
        'Long flowering period'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/10825/leucanthemum-vulgare/details'
  },

  'Knapweed': {
    scientificName: 'Centaurea nigra',
    commonName: 'Common Knapweed',
    description: 'One of the best UK pollinator plants. Chelsea wildlife garden staple. Purple thistle-like flowers.',
    layer: 'seasonal',
    badge: { text: 'Top Pollinator', color: 'bg-purple-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Cut back after flowering',
        'Leave some seed heads for birds',
        'Self-seeds moderately',
        'Thrives in poor, dry soil'
      ],
      homeowner: [
        'Extremely easy',
        'Loved by butterflies and bees',
        'Low maintenance wildflower'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/3958/centaurea-nigra/details'
  },

  'Meadow Cranesbill': {
    scientificName: 'Geranium pratense',
    commonName: 'Meadow Cranesbill',
    description: 'UK native geranium. Bees & hoverflies. Soft, long flowering, excellent filler.',
    layer: 'seasonal',
    badge: { text: 'Native', color: 'bg-blue-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Cut back after first flowering for second flush',
        'Self-seeds freely',
        'Tolerates wide range of conditions',
        'Very hardy'
      ],
      homeowner: [
        'Very easy to grow',
        'Beautiful blue flowers',
        'Long flowering season'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/8231/geranium-pratense/details'
  },

  'Field Scabious': {
    scientificName: 'Knautia arvensis',
    commonName: 'Field Scabious',
    description: 'UK native. Butterflies (especially scabious bees). Tall, airy meadow layers. Chelsea wildlife essential.',
    layer: 'seasonal',
    badge: { text: 'Butterfly Plant', color: 'bg-pink-600 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Cut back in late winter',
        'Self-seeds lightly',
        'Prefers alkaline soil',
        'Flowers June-September'
      ],
      homeowner: [
        'Easy wildflower',
        'Attracts many pollinators',
        'Classic meadow plant'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/9612/knautia-arvensis/details'
  },

  'Wild Strawberry': {
    scientificName: 'Fragaria vesca',
    commonName: 'Wild Strawberry',
    description: 'UK native groundcover. Pollinators + birds. Soft, edible, tidy groundcover for wildlife gardens.',
    layer: 'groundCover',
    badge: { text: 'Edible Native', color: 'bg-red-600 text-white' },
    careTime: '30 mins',
    careNotes: {
      techniques: [
        'Spreads by runners',
        'Cut back old foliage in spring',
        'Tiny edible fruits',
        'Tolerates shade'
      ],
      homeowner: [
        'Very low maintenance',
        'Attractive groundcover',
        'Wildlife-friendly'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/7735/fragaria-vesca/details'
  },

  'Selfheal': {
    scientificName: 'Prunella vulgaris',
    commonName: 'Selfheal',
    description: 'UK native. Long flowering nectar source. Chelsea wildlife groundcover and lawn alternatives.',
    layer: 'groundCover',
    badge: { text: 'Native', color: 'bg-purple-600 text-white' },
    careTime: '30 mins',
    careNotes: {
      techniques: [
        'Mow/trim after flowering if needed',
        'Tolerates foot traffic',
        'Self-seeds',
        'Flowers June-September'
      ],
      homeowner: [
        'Extremely easy',
        'Good lawn substitute',
        'Loved by bees'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/14328/prunella-vulgaris/details'
  },

  'Purple Loosestrife': {
    scientificName: 'Lythrum salicaria',
    commonName: 'Purple Loosestrife',
    description: 'UK native. Bees, hoverflies. Chelsea wetland & rain garden planting. Dramatic spikes.',
    layer: 'seasonal',
    badge: { text: 'Wetland', color: 'bg-purple-700 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Cut back in late winter',
        'Prefers moist soil',
        'Self-supporting',
        'Flowers July-September'
      ],
      homeowner: [
        'Easy in damp conditions',
        'Striking flower spikes',
        'Excellent pollinator plant'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/11330/lythrum-salicaria/details'
  },

  // DAN PEARSON WILDFLOWER MEADOW PLANTS

  'Red Fescue': {
    scientificName: 'Festuca rubra',
    commonName: 'Red Fescue',
    description: 'UK native grass. Dan Pearson meadow framework. Fine-leaved, forms dense matrix. Low fertility lover.',
    layer: 'structure',
    badge: { text: 'Native Grass', color: 'bg-amber-700 text-white' },
    careTime: '30 mins',
    careNotes: {
      techniques: [
        'Single annual cut in late summer',
        'Remove cuttings to reduce fertility',
        'Thrives in poor soil',
        'No fertiliser required'
      ],
      homeowner: [
        'Extremely low maintenance',
        'Creates meadow texture',
        'Self-sustaining'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/7625/festuca-rubra/details'
  },

  'Crested Dog\'s-tail': {
    scientificName: 'Cynosurus cristatus',
    commonName: 'Crested Dog\'s-tail',
    description: 'UK native meadow grass. Dan Pearson signature. Delicate seed heads, essential meadow framework.',
    layer: 'structure',
    badge: { text: 'Native Grass', color: 'bg-amber-700 text-white' },
    careTime: '30 mins',
    careNotes: {
      techniques: [
        'Cut once in late August',
        'Tolerates close mowing',
        'Prefers low fertility',
        'Self-seeds readily'
      ],
      homeowner: [
        'Very easy',
        'Traditional meadow grass',
        'Attractive seed heads'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/5544/cynosurus-cristatus/details'
  },

  'Sweet Vernal Grass': {
    scientificName: 'Anthoxanthum odoratum',
    commonName: 'Sweet Vernal Grass',
    description: 'UK native. Pearson meadow essential. Sweet hay scent when cut. Early flowering, textural elegance.',
    layer: 'structure',
    badge: { text: 'Aromatic Native', color: 'bg-amber-600 text-white' },
    careTime: '30 mins',
    careNotes: {
      techniques: [
        'Cut in late summer',
        'Releases sweet scent when mown',
        'Flowers April-June',
        'Low fertility essential'
      ],
      homeowner: [
        'Wonderfully scented',
        'Easy to establish',
        'Traditional meadow grass'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/1424/anthoxanthum-odoratum/details'
  },

  'Bird\'s-foot Trefoil': {
    scientificName: 'Lotus corniculatus',
    commonName: 'Bird\'s-foot Trefoil',
    description: 'UK native legume. Pearson meadow groundcover. Nitrogen-fixing, feeds butterflies. Cheerful yellow flowers.',
    layer: 'groundCover',
    badge: { text: 'Native', color: 'bg-yellow-600 text-white' },
    careTime: '30 mins',
    careNotes: {
      techniques: [
        'Fixes nitrogen naturally',
        'No feeding required',
        'Tolerates poor soil',
        'Flowers May-September'
      ],
      homeowner: [
        'Self-sufficient',
        'Loved by Common Blue butterflies',
        'Improves soil naturally'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/10911/lotus-corniculatus/details'
  },

  'Meadow Buttercup': {
    scientificName: 'Ranunculus acris',
    commonName: 'Meadow Buttercup',
    description: 'UK native wildflower. Classic Pearson meadow. Glossy yellow cups, traditional hay meadow indicator.',
    layer: 'seasonal',
    badge: { text: 'Native', color: 'bg-yellow-700 text-white' },
    careTime: '30 mins',
    careNotes: {
      techniques: [
        'Cut after seed set',
        'Self-seeds freely',
        'Flowers May-July',
        'Prefers moisture-retentive soil'
      ],
      homeowner: [
        'Easy and reliable',
        'Classic meadow flower',
        'Cheerful golden blooms'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/14935/ranunculus-acris/details'
  },

  'Red Campion': {
    scientificName: 'Silene dioica',
    commonName: 'Red Campion',
    description: 'UK native woodland edge wildflower. Pearson hedgerow layers. Pink flowers loved by bees and hoverflies.',
    layer: 'seasonal',
    badge: { text: 'Native', color: 'bg-pink-600 text-white' },
    careTime: '30 mins',
    careNotes: {
      techniques: [
        'Self-seeds in dappled shade',
        'Cut back after flowering',
        'Tolerates semi-shade',
        'Flowers May-October'
      ],
      homeowner: [
        'Very easy',
        'Long flowering season',
        'Excellent pollinator plant'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/17933/silene-dioica/details'
  },

  'Devil\'s-bit Scabious': {
    scientificName: 'Succisa pratensis',
    commonName: 'Devil\'s-bit Scabious',
    description: 'UK native. Pearson wet meadow accent. Essential for Marsh Fritillary butterfly. Late season nectar.',
    layer: 'seasonal',
    badge: { text: 'Specialist Native', color: 'bg-indigo-700 text-white' },
    careTime: '1 hour',
    careNotes: {
      techniques: [
        'Prefers damp meadows',
        'Cut in late winter',
        'Flowers August-October',
        'Host plant for rare butterflies'
      ],
      homeowner: [
        'Important conservation plant',
        'Beautiful blue flowers',
        'Wet meadow essential'
      ]
    },
    rhsLink: 'https://www.rhs.org.uk/plants/18685/succisa-pratensis/details'
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
