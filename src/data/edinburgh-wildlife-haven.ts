export const edinburghWildlifeHaven = {
  id: 'edinburgh-wildlife-haven',
  title: 'Edinburgh Wildlife Haven',
  location: 'Edinburgh, Scotland',
  style: 'Wildlife & Native Planting',
  size: '12m × 9m',
  description: 'A naturalistic Scottish garden designed to attract pollinators and wildlife while providing year-round interest with native and near-native species.',

  plants: [
    {
      scientific: 'Sorbus aucuparia',
      common: 'Rowan',
      type: 'tree',
      quantity: 2,
      spacing: '4-5m',
      sunExposure: 'Full sun to part shade',
      soilType: 'Well-drained, acidic to neutral',
      matureHeight: '8-15m',
      matureSpread: '4-7m',
      features: 'White spring flowers, orange berries loved by birds, autumn color',
      wildlife: 'Birds, bees, butterflies'
    },
    {
      scientific: 'Corylus avellana',
      common: 'Hazel',
      type: 'shrub',
      quantity: 3,
      spacing: '3-4m',
      sunExposure: 'Full sun to part shade',
      soilType: 'Moist, well-drained',
      matureHeight: '3-5m',
      matureSpread: '3-4m',
      features: 'Catkins in late winter, edible nuts, autumn color',
      wildlife: 'Squirrels, birds, dormice'
    },
    {
      scientific: 'Digitalis purpurea',
      common: 'Foxglove',
      type: 'biennial',
      quantity: 15,
      spacing: '30cm',
      sunExposure: 'Part shade',
      soilType: 'Moist, well-drained',
      matureHeight: '1-2m',
      matureSpread: '30cm',
      features: 'Purple-pink tubular flowers in summer, self-seeds',
      wildlife: 'Bumblebees'
    },
    {
      scientific: 'Polystichum setiferum',
      common: 'Soft Shield Fern',
      type: 'fern',
      quantity: 8,
      spacing: '60cm',
      sunExposure: 'Shade to part shade',
      soilType: 'Moist, humus-rich',
      matureHeight: '60-120cm',
      matureSpread: '60-90cm',
      features: 'Evergreen fronds, soft texture, winter interest',
      wildlife: 'Shelter for insects'
    },
    {
      scientific: 'Persicaria amplexicaulis',
      common: 'Red Bistort',
      type: 'perennial',
      quantity: 12,
      spacing: '45cm',
      sunExposure: 'Sun to part shade',
      soilType: 'Moist',
      matureHeight: '1-1.2m',
      matureSpread: '60cm',
      features: 'Red flower spikes summer to autumn, long flowering',
      wildlife: 'Bees, butterflies'
    },
    {
      scientific: 'Deschampsia cespitosa',
      common: 'Tufted Hair Grass',
      type: 'grass',
      quantity: 10,
      spacing: '40cm',
      sunExposure: 'Sun to part shade',
      soilType: 'Moist, any',
      matureHeight: '90cm (flowering)',
      matureSpread: '60cm',
      features: 'Airy flower heads, native grass, winter structure',
      wildlife: 'Seeds for birds'
    },
    {
      scientific: 'Primula vulgaris',
      common: 'Primrose',
      type: 'perennial',
      quantity: 20,
      spacing: '20cm',
      sunExposure: 'Part shade',
      soilType: 'Moist, well-drained',
      matureHeight: '15-20cm',
      matureSpread: '20-30cm',
      features: 'Pale yellow flowers in early spring, native wildflower',
      wildlife: 'Early bees, butterflies'
    }
  ],

  seasonalPalette: {
    spring: {
      colors: ['#FFFACD', '#FFE4B5', '#FAFAD2'],
      description: 'Pale yellow primroses and hazel catkins'
    },
    summer: {
      colors: ['#DDA0DD', '#C71585', '#90EE90'],
      description: 'Purple foxgloves and pink bistort spikes'
    },
    autumn: {
      colors: ['#FF8C00', '#CD853F', '#8B4513'],
      description: 'Orange rowan berries and autumn foliage'
    },
    winter: {
      colors: ['#228B22', '#8B7355', '#D2B48C'],
      description: 'Evergreen ferns and dried grass plumes'
    }
  }
};
