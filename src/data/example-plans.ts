/**
 * Example Planting Plans - Portfolio Showcase
 * Pre-generated example plans for different UK regions and styles
 */

export interface ExamplePlan {
  id: string;
  title: string;
  postcode: string;
  region: string;
  rhsZone: string;
  style: string;
  maintenance: string;
  area: number;
  budget: string;
  totalPlants: number;
  totalCost: number;
  description: string;
  highlights: string[];
  tags: string[];
  imageUrl: string;
  season: string;
}

export const examplePlans: ExamplePlan[] = [
  {
    id: 'london-contemporary',
    title: 'Contemporary Urban Oasis',
    postcode: 'SW7 1AA',
    region: 'South London',
    rhsZone: 'H4',
    style: 'Contemporary',
    maintenance: 'Low',
    area: 25,
    budget: '£300-500',
    totalPlants: 18,
    totalCost: 387.50,
    description: 'A sleek, modern garden design featuring architectural plants and minimalist planting. Perfect for busy professionals who want year-round structure with minimal upkeep.',
    highlights: [
      'Silver birch as focal point',
      'Evergreen structure with Viburnum tinus',
      'Low-maintenance grasses for movement',
      'Peat-free sustainable planting'
    ],
    tags: ['London', 'Contemporary', 'Low Maintenance', 'Urban', 'Small Space', 'Structural'],
    imageUrl: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=80',
    season: 'Year-round'
  },
  {
    id: 'cotswolds-cottage',
    title: 'Cotswolds Cottage Garden',
    postcode: 'GL54 1AA',
    region: 'Cotswolds',
    rhsZone: 'H4',
    style: 'Cottage',
    maintenance: 'Medium',
    area: 40,
    budget: '£400-700',
    totalPlants: 32,
    totalCost: 589.20,
    description: 'Classic English cottage garden bursting with color and charm. Romantic, informal planting with fragrant herbs and pollinator-friendly perennials.',
    highlights: [
      'Lavender hedge for scent',
      'Climbing roses and honeysuckle',
      'Herbaceous border with Geranium Rozanne',
      'Wildlife-friendly planting scheme'
    ],
    tags: ['Cotswolds', 'Cottage', 'Medium Maintenance', 'Traditional', 'Fragrant', 'Wildlife'],
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80',
    season: 'Spring-Autumn'
  },
  {
    id: 'edinburgh-wildlife',
    title: 'Scottish Wildlife Haven',
    postcode: 'EH1 1AA',
    region: 'Edinburgh',
    rhsZone: 'H3',
    style: 'Wildlife',
    maintenance: 'Low',
    area: 35,
    budget: '£250-450',
    totalPlants: 28,
    totalCost: 398.75,
    description: 'Native Scottish planting designed for biodiversity. Hardy plants that thrive in cooler climates while supporting local wildlife.',
    highlights: [
      'Rowan tree for birds',
      'Native wild flowers',
      'Hedgerow plants for shelter',
      'Year-round berry production'
    ],
    tags: ['Scotland', 'Wildlife', 'Low Maintenance', 'Native', 'Eco-Friendly', 'Hardy'],
    imageUrl: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&q=80',
    season: 'Year-round'
  },
  {
    id: 'manchester-family',
    title: 'Family Garden Retreat',
    postcode: 'M1 1AA',
    region: 'Manchester',
    rhsZone: 'H4',
    style: 'Contemporary',
    maintenance: 'Low',
    area: 50,
    budget: '£500-800',
    totalPlants: 35,
    totalCost: 687.50,
    description: 'Practical, beautiful garden for family life. Tough, forgiving plants that can handle football games, with soft sensory planting around edges.',
    highlights: [
      'Robust shrubs for structure',
      'Safe, non-toxic plants',
      'Easy-care perennials',
      'Spaces for play and relaxation'
    ],
    tags: ['Manchester', 'Contemporary', 'Low Maintenance', 'Family-Friendly', 'Practical', 'Durable'],
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    season: 'Year-round'
  },
  {
    id: 'cornwall-coastal',
    title: 'Coastal Garden Paradise',
    postcode: 'TR1 1AA',
    region: 'Cornwall',
    rhsZone: 'H4',
    style: 'Contemporary',
    maintenance: 'Low',
    area: 30,
    budget: '£350-600',
    totalPlants: 24,
    totalCost: 456.80,
    description: 'Wind-tolerant planting for coastal conditions. Mediterranean-style plants that love the mild Cornish climate and salty breezes.',
    highlights: [
      'Salt-tolerant Hydrangeas',
      'Architectural grasses',
      'Drought-resistant perennials',
      'Blue and white color scheme'
    ],
    tags: ['Cornwall', 'Contemporary', 'Low Maintenance', 'Coastal', 'Mediterranean', 'Wind-Tolerant'],
    imageUrl: 'https://images.unsplash.com/photo-1623301443511-e6f27eb2f0f8?w=800&q=80',
    season: 'Spring-Autumn'
  },
  {
    id: 'yorkshire-heritage',
    title: 'Yorkshire Heritage Garden',
    postcode: 'YO1 1AA',
    region: 'York',
    rhsZone: 'H4',
    style: 'Cottage',
    maintenance: 'Medium',
    area: 45,
    budget: '£450-750',
    totalPlants: 38,
    totalCost: 623.40,
    description: 'Traditional Yorkshire garden with robust native plants. Time-tested varieties that have thrived in Northern gardens for generations.',
    highlights: [
      'Native hedgerow plants',
      'Old-fashioned perennials',
      'Apple and cherry trees',
      'Seasonal color progression'
    ],
    tags: ['Yorkshire', 'Cottage', 'Medium Maintenance', 'Traditional', 'Heritage', 'Native'],
    imageUrl: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=800&q=80',
    season: 'Year-round'
  },
  {
    id: 'bristol-zen',
    title: 'Zen Contemplation Garden',
    postcode: 'BS1 1AA',
    region: 'Bristol',
    rhsZone: 'H4',
    style: 'Contemporary',
    maintenance: 'Low',
    area: 20,
    budget: '£300-500',
    totalPlants: 15,
    totalCost: 398.50,
    description: 'Minimalist Japanese-inspired garden for mindfulness and meditation. Simple, serene planting with bamboo and evergreens.',
    highlights: [
      'Clumping bamboo feature',
      'Evergreen structure',
      'Limited color palette',
      'Meditative spaces'
    ],
    tags: ['Bristol', 'Contemporary', 'Low Maintenance', 'Zen', 'Minimalist', 'Japanese-Inspired'],
    imageUrl: 'https://images.unsplash.com/photo-1585818000991-3a0c628f4f04?w=800&q=80',
    season: 'Year-round'
  },
  {
    id: 'birmingham-urban',
    title: 'Urban Jungle Sanctuary',
    postcode: 'B1 1AA',
    region: 'Birmingham',
    rhsZone: 'H4',
    style: 'Contemporary',
    maintenance: 'Medium',
    area: 15,
    budget: '£200-400',
    totalPlants: 12,
    totalCost: 287.90,
    description: 'Lush, layered planting for small city spaces. Create your own jungle with shade-tolerant plants and climbers on walls.',
    highlights: [
      'Vertical planting for small spaces',
      'Shade-loving ferns',
      'Climbing plants for walls',
      'Maximum impact, minimum space'
    ],
    tags: ['Birmingham', 'Contemporary', 'Medium Maintenance', 'Small Space', 'Urban', 'Shade Garden'],
    imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80',
    season: 'Year-round'
  },
  {
    id: 'norfolk-meadow',
    title: 'Norfolk Meadow Garden',
    postcode: 'NR1 1AA',
    region: 'Norfolk',
    rhsZone: 'H4',
    style: 'Wildlife',
    maintenance: 'Low',
    area: 60,
    budget: '£400-650',
    totalPlants: 45,
    totalCost: 567.30,
    description: 'Naturalistic meadow-style planting inspired by Norfolk\'s countryside. Low-intervention garden packed with native wildflowers.',
    highlights: [
      'Native wildflower meadow',
      'Pollinator paradise',
      'Seasonal seed heads',
      'Minimal mowing required'
    ],
    tags: ['Norfolk', 'Wildlife', 'Low Maintenance', 'Meadow', 'Native', 'Naturalistic'],
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
    season: 'Spring-Summer'
  },
  {
    id: 'cambridge-academic',
    title: 'Cambridge Scholar\'s Garden',
    postcode: 'CB1 1AA',
    region: 'Cambridge',
    rhsZone: 'H4',
    style: 'Cottage',
    maintenance: 'Low',
    area: 28,
    budget: '£350-550',
    totalPlants: 22,
    totalCost: 445.60,
    description: 'Timeless English garden inspired by Cambridge college courts. Classical planting with boxwood structure and abundant perennials.',
    highlights: [
      'Formal structure with informal planting',
      'Historical plant varieties',
      'Reading nook surrounded by scent',
      'Low-maintenance evergreen framework'
    ],
    tags: ['Cambridge', 'Cottage', 'Low Maintenance', 'Traditional', 'Classical', 'Formal'],
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    season: 'Year-round'
  }
];

// Filter tags for portfolio
export const allTags = [
  // Regions
  'London', 'Cotswolds', 'Scotland', 'Manchester', 'Cornwall',
  'Yorkshire', 'Bristol', 'Birmingham', 'Norfolk', 'Cambridge',

  // Styles
  'Contemporary', 'Cottage', 'Wildlife', 'Zen', 'Minimalist',

  // Maintenance
  'Low Maintenance', 'Medium Maintenance',

  // Features
  'Urban', 'Small Space', 'Family-Friendly', 'Native',
  'Coastal', 'Shade Garden', 'Meadow', 'Fragrant',

  // Characteristics
  'Structural', 'Traditional', 'Eco-Friendly', 'Hardy',
  'Practical', 'Durable', 'Japanese-Inspired', 'Classical'
];

// Group tags by category
export const tagCategories = {
  'Region': [
    'London', 'Cotswolds', 'Scotland', 'Manchester', 'Cornwall',
    'Yorkshire', 'Bristol', 'Birmingham', 'Norfolk', 'Cambridge'
  ],
  'Style': [
    'Contemporary', 'Cottage', 'Wildlife', 'Zen', 'Traditional', 'Classical'
  ],
  'Maintenance': [
    'Low Maintenance', 'Medium Maintenance'
  ],
  'Features': [
    'Urban', 'Small Space', 'Family-Friendly', 'Native', 'Coastal',
    'Shade Garden', 'Meadow', 'Fragrant', 'Structural'
  ]
};
