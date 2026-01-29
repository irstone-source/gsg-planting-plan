/**
 * Parse Wyevale Nurseries Stock Availability List
 * Extracts plant data and generates SQL inserts for Supabase
 */

interface WyevalePlant {
  botanical_name: string;
  common_name?: string;
  category: string;
  size: string;
  product_code: string;
  stock_quantity: number;
  is_peat_free: boolean;
  sun_exposure: string[]; // 'full_sun', 'partial_shade', 'full_shade'
  moisture: string[]; // 'dry', 'moist', 'wet'
  soil_type: string[]; // 'clay', 'loam', 'sand', 'chalk', 'versatile'
  rhs_zone_min: string; // e.g., 'H3', 'H4'
  rhs_zone_max: string; // e.g., 'H7'
  price_gbp?: number;
  compost?: string;
}

// Sample parsed data from Wyevale PDF (Jan 26, 2026)
// Enhanced with growing conditions for plant matching
const wyevaleData: WyevalePlant[] = [
  // BAMBOO - Non-invasive clumping varieties
  {
    botanical_name: 'Fargesia jiuzhaigou Red Dragon',
    common_name: 'Red Dragon Bamboo',
    category: 'BAMBOO',
    size: '3L',
    product_code: '12823060',
    stock_quantity: 368,
    is_peat_free: false,
    sun_exposure: ['full_sun', 'partial_shade'],
    moisture: ['moist'],
    soil_type: ['versatile'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 12.99,
  },
  {
    botanical_name: 'Fargesia papyrifera Blue Dragon',
    common_name: 'Blue Dragon Bamboo',
    category: 'BAMBOO',
    size: '3L',
    product_code: '12838180',
    stock_quantity: 284,
    is_peat_free: false,
    sun_exposure: ['full_sun', 'partial_shade'],
    moisture: ['moist'],
    soil_type: ['versatile'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 12.99,
  },
  {
    botanical_name: 'Fargesia Robusta Formidable',
    common_name: 'Formidable Bamboo',
    category: 'BAMBOO',
    size: '3L',
    product_code: '12823070',
    stock_quantity: 220,
    is_peat_free: false,
    sun_exposure: ['full_sun', 'partial_shade'],
    moisture: ['moist'],
    soil_type: ['versatile'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 12.99,
  },
  {
    botanical_name: 'Fargesia rufa',
    common_name: 'Fountain Bamboo',
    category: 'BAMBOO',
    size: '3L',
    product_code: '12823080',
    stock_quantity: 65,
    is_peat_free: false,
    sun_exposure: ['full_sun', 'partial_shade', 'full_shade'],
    moisture: ['moist'],
    soil_type: ['versatile'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 12.99,
  },

  // CLIMBER - Vertical interest
  {
    botanical_name: 'Hedera helix Erecta',
    common_name: 'Upright Ivy',
    category: 'CLIMBER',
    size: '2L',
    product_code: '12755470',
    stock_quantity: 50,
    is_peat_free: false,
    sun_exposure: ['full_sun', 'partial_shade', 'full_shade'],
    moisture: ['moist'],
    soil_type: ['versatile'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 8.99,
  },
  {
    botanical_name: 'Hydrangea anomala petiolaris',
    common_name: 'Climbing Hydrangea',
    category: 'CLIMBER',
    size: '3L',
    product_code: '12878730',
    stock_quantity: 350,
    is_peat_free: false,
    sun_exposure: ['partial_shade', 'full_shade'],
    moisture: ['moist'],
    soil_type: ['loam', 'clay'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 14.99,
  },
  {
    botanical_name: 'Lonicera periclymenum',
    common_name: 'Honeysuckle',
    category: 'CLIMBER',
    size: '2L',
    product_code: '10972690',
    stock_quantity: 98,
    is_peat_free: false,
    sun_exposure: ['full_sun', 'partial_shade'],
    moisture: ['moist'],
    soil_type: ['versatile'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 8.99,
  },
  {
    botanical_name: 'Lonicera periclymenum Belgica',
    common_name: 'Early Dutch Honeysuckle',
    category: 'CLIMBER',
    size: '9cm',
    product_code: '10972830',
    stock_quantity: 446,
    is_peat_free: false,
    sun_exposure: ['full_sun', 'partial_shade'],
    moisture: ['moist'],
    soil_type: ['versatile'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 3.50,
  },

  // HERBACEOUS - Star performers
  {
    botanical_name: 'Geranium Rozanne',
    common_name: 'Rozanne Cranesbill',
    category: 'HERBACEOUS',
    size: '2L',
    product_code: '10710030',
    stock_quantity: 212,
    is_peat_free: false,
    sun_exposure: ['full_sun', 'partial_shade'],
    moisture: ['moist'],
    soil_type: ['versatile'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 8.99,
  },
  {
    botanical_name: 'Geranium Rozanne',
    common_name: 'Rozanne Cranesbill',
    category: 'HERBACEOUS',
    size: '3L',
    product_code: '12810880',
    stock_quantity: 142,
    is_peat_free: true,
    sun_exposure: ['full_sun', 'partial_shade'],
    moisture: ['moist'],
    soil_type: ['versatile'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 12.99,
  },
  {
    botanical_name: 'Agapanthus hybrid Navy Blue',
    common_name: 'Navy Blue African Lily',
    category: 'HERBACEOUS',
    size: '2L',
    product_code: '12824800',
    stock_quantity: 850,
    is_peat_free: false,
    sun_exposure: ['full_sun'],
    moisture: ['moist'],
    soil_type: ['loam', 'sand'],
    rhs_zone_min: 'H3',
    rhs_zone_max: 'H7',
    price_gbp: 9.99,
  },
  {
    botanical_name: 'Alchemilla mollis',
    common_name: "Lady's Mantle",
    category: 'HERBACEOUS',
    size: '2L',
    product_code: '12410820',
    stock_quantity: 146,
    is_peat_free: false,
    sun_exposure: ['full_sun', 'partial_shade'],
    moisture: ['moist'],
    soil_type: ['versatile'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 7.99,
  },
  {
    botanical_name: 'Echinacea purpurea White Swan',
    common_name: 'White Coneflower',
    category: 'HERBACEOUS',
    size: '3L',
    product_code: '12890600',
    stock_quantity: 471,
    is_peat_free: true,
    sun_exposure: ['full_sun'],
    moisture: ['moist', 'dry'],
    soil_type: ['versatile'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 11.99,
  },
  {
    botanical_name: 'Rudbeckia fulgida sillivantii Goldsturm',
    common_name: 'Black-eyed Susan',
    category: 'HERBACEOUS',
    size: '3L',
    product_code: '12873850',
    stock_quantity: 574,
    is_peat_free: true,
    sun_exposure: ['full_sun', 'partial_shade'],
    moisture: ['moist'],
    soil_type: ['versatile'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 11.99,
  },
  {
    botanical_name: 'Verbena bonariensis',
    common_name: 'Argentinian Verbena',
    category: 'HERBACEOUS',
    size: '3L',
    product_code: '12832230',
    stock_quantity: 130,
    is_peat_free: false,
    sun_exposure: ['full_sun'],
    moisture: ['moist', 'dry'],
    soil_type: ['versatile'],
    rhs_zone_min: 'H3',
    rhs_zone_max: 'H7',
    price_gbp: 10.99,
  },
  {
    botanical_name: 'Verbena bonariensis',
    common_name: 'Argentinian Verbena',
    category: 'HERBACEOUS',
    size: '3L',
    product_code: '12890190',
    stock_quantity: 222,
    is_peat_free: true,
    sun_exposure: ['full_sun'],
    moisture: ['moist', 'dry'],
    soil_type: ['versatile'],
    rhs_zone_min: 'H3',
    rhs_zone_max: 'H7',
    price_gbp: 10.99,
  },

  // SHRUB - Backbone plants
  {
    botanical_name: 'Lavandula angustifolia Hidcote',
    common_name: 'Hidcote Lavender',
    category: 'SHRUB',
    size: '2L',
    product_code: '12413640',
    stock_quantity: 118,
    is_peat_free: false,
    sun_exposure: ['full_sun'],
    moisture: ['dry', 'moist'],
    soil_type: ['loam', 'sand', 'chalk'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 8.99,
  },
  {
    botanical_name: 'Lavandula x intermedia Phenomenal',
    common_name: 'Phenomenal Lavender',
    category: 'SHRUB',
    size: '3L',
    product_code: '12760740N',
    stock_quantity: 1648,
    is_peat_free: false,
    sun_exposure: ['full_sun'],
    moisture: ['dry', 'moist'],
    soil_type: ['loam', 'sand', 'chalk'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 12.99,
  },
  {
    botanical_name: 'Hydrangea arborescens Annabelle',
    common_name: 'Annabelle Hydrangea',
    category: 'SHRUB',
    size: '3L',
    product_code: '12848980',
    stock_quantity: 839,
    is_peat_free: true,
    sun_exposure: ['partial_shade', 'full_sun'],
    moisture: ['moist'],
    soil_type: ['loam', 'clay'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 14.99,
  },
  {
    botanical_name: 'Viburnum tinus',
    common_name: 'Laurustinus',
    category: 'SHRUB',
    size: '3L',
    product_code: '12811040',
    stock_quantity: 1645,
    is_peat_free: true,
    sun_exposure: ['full_sun', 'partial_shade'],
    moisture: ['moist'],
    soil_type: ['versatile'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 12.99,
  },
  {
    botanical_name: 'Viburnum tinus Lisarose',
    common_name: 'Lisarose Laurustinus',
    category: 'SHRUB',
    size: '3L',
    product_code: '11920350N',
    stock_quantity: 3748,
    is_peat_free: false,
    sun_exposure: ['full_sun', 'partial_shade'],
    moisture: ['moist'],
    soil_type: ['versatile'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 12.99,
  },
  {
    botanical_name: 'Cornus alba',
    common_name: 'Red-barked Dogwood',
    category: 'SHRUB',
    size: '7.5L',
    product_code: '10474730N',
    stock_quantity: 498,
    is_peat_free: false,
    sun_exposure: ['full_sun', 'partial_shade'],
    moisture: ['moist', 'wet'],
    soil_type: ['versatile'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 24.99,
  },
  {
    botanical_name: 'Cornus alba',
    common_name: 'Red-barked Dogwood',
    category: 'SHRUB',
    size: '7.5L',
    product_code: '12810770',
    stock_quantity: 139,
    is_peat_free: true,
    sun_exposure: ['full_sun', 'partial_shade'],
    moisture: ['moist', 'wet'],
    soil_type: ['versatile'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 24.99,
  },

  // TREE - Structure and height
  {
    botanical_name: 'Betula pendula',
    common_name: 'Silver Birch',
    category: 'TREE',
    size: '7.5L',
    product_code: '12811150',
    stock_quantity: 946,
    is_peat_free: true,
    sun_exposure: ['full_sun', 'partial_shade'],
    moisture: ['moist'],
    soil_type: ['versatile'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 29.99,
  },
  {
    botanical_name: 'Acer campestre',
    common_name: 'Field Maple',
    category: 'TREE',
    size: '7.5L',
    product_code: '12811130',
    stock_quantity: 416,
    is_peat_free: true,
    sun_exposure: ['full_sun', 'partial_shade'],
    moisture: ['moist'],
    soil_type: ['versatile'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 29.99,
  },
  {
    botanical_name: 'Sorbus aucuparia',
    common_name: 'Rowan',
    category: 'TREE',
    size: '36L 8-10 CS',
    product_code: '12876720',
    stock_quantity: 54,
    is_peat_free: false,
    sun_exposure: ['full_sun', 'partial_shade'],
    moisture: ['moist'],
    soil_type: ['versatile'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 149.99,
  },
  {
    botanical_name: 'Malus sylvestris',
    common_name: 'Crab Apple',
    category: 'TREE',
    size: '7.5L',
    product_code: '12811200',
    stock_quantity: 483,
    is_peat_free: true,
    sun_exposure: ['full_sun'],
    moisture: ['moist'],
    soil_type: ['versatile'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 29.99,
  },
  {
    botanical_name: 'Prunus avium',
    common_name: 'Wild Cherry',
    category: 'TREE',
    size: '36L 8-10 CS',
    product_code: '12876700',
    stock_quantity: 65,
    is_peat_free: false,
    sun_exposure: ['full_sun', 'partial_shade'],
    moisture: ['moist'],
    soil_type: ['versatile'],
    rhs_zone_min: 'H4',
    rhs_zone_max: 'H7',
    price_gbp: 149.99,
  },
];

/**
 * Generate SQL INSERT statements for Supabase
 */
export function generatePlantInserts(plants: WyevalePlant[]): string {
  const inserts = plants.map(plant => {
    const botanicalName = plant.botanical_name.replace(/'/g, "''");
    const commonName = plant.common_name ? `'${plant.common_name.replace(/'/g, "''")}'` : 'NULL';
    const category = plant.category;
    const size = plant.size.replace(/'/g, "''");
    const productCode = plant.product_code;
    const stockQty = plant.stock_quantity;
    const isPeatFree = plant.is_peat_free;
    const sunExposure = `ARRAY[${plant.sun_exposure.map(s => `'${s}'`).join(', ')}]::text[]`;
    const moisture = `ARRAY[${plant.moisture.map(m => `'${m}'`).join(', ')}]::text[]`;
    const soilType = `ARRAY[${plant.soil_type.map(s => `'${s}'`).join(', ')}]::text[]`;
    const rhsZoneMin = plant.rhs_zone_min;
    const rhsZoneMax = plant.rhs_zone_max;
    const priceGbp = plant.price_gbp || 'NULL';

    return `INSERT INTO plants (botanical_name, common_name, category, size, product_code, stock_quantity, is_peat_free, sun_exposure, moisture, soil_type, rhs_zone_min, rhs_zone_max, price_gbp)
VALUES ('${botanicalName}', ${commonName}, '${category}', '${size}', '${productCode}', ${stockQty}, ${isPeatFree}, ${sunExposure}, ${moisture}, ${soilType}, '${rhsZoneMin}', '${rhsZoneMax}', ${priceGbp});`;
  });

  return inserts.join('\n');
}

// Generate and output SQL
if (require.main === module) {
  console.log('-- Wyevale Nurseries Plant Data Import');
  console.log('-- Generated: ' + new Date().toISOString());
  console.log('-- Total plants: ' + wyevaleData.length);
  console.log();
  console.log(generatePlantInserts(wyevaleData));
}

export { wyevaleData };
