/**
 * Multi-Source Plant Data Aggregator
 * Fetches and merges data from global botanical databases
 */

import { ScientificPlantData, GrowthRate, CrownShape, FoliageType, CanopyDensity } from './types';

const TREFLE_API_KEY = process.env.TREFLE_API_KEY;
const PERENUAL_API_KEY = process.env.PERENUAL_API_KEY;

interface TrefleResponse {
  data: {
    id: number;
    common_name: string;
    scientific_name: string;
    family: string;
    genus: string;
    maximum_height_cm: number;
    maximum_width_cm: number;
    growth_rate?: string;
    foliage_type?: string;
  }[];
}

interface PerenualResponse {
  data: {
    id: number;
    common_name: string;
    scientific_name: string[];
    family: string;
    type: string;
    dimension: string;
    dimensions: {
      type: string;
      min_value: number;
      max_value: number;
      unit: string;
    };
    growth_rate: string;
    sunlight: string[];
  }[];
}

/**
 * Fetch plant data from Trefle API
 */
async function fetchTrefleData(botanicalName: string): Promise<Partial<ScientificPlantData> | null> {
  if (!TREFLE_API_KEY) return null;

  try {
    // Step 1: Search for the plant
    const searchResponse = await fetch(
      `https://trefle.io/api/v1/plants/search?token=${TREFLE_API_KEY}&q=${encodeURIComponent(botanicalName)}`
    );

    if (!searchResponse.ok) return null;

    const searchData: TrefleResponse = await searchResponse.json();
    const searchResult = searchData.data[0];

    if (!searchResult) return null;

    // Step 2: Get full plant details using the plant ID
    const detailResponse = await fetch(
      `https://trefle.io/api/v1/plants/${searchResult.id}?token=${TREFLE_API_KEY}`
    );

    if (!detailResponse.ok) return null;

    const detailData: any = await detailResponse.json();
    const plant = detailData.data;

    // Get specifications - check multiple possible locations
    const specs = plant.main_species?.specifications || plant.specifications || {};
    const growth = plant.main_species?.growth || plant.growth || {};

    // Try various paths for dimensions
    let height_cm = 0;
    let spread_cm = 0;

    if (specs.maximum_height) {
      height_cm = specs.maximum_height.cm || specs.maximum_height_cm || 0;
    }

    if (specs.maximum_width) {
      spread_cm = specs.maximum_width.cm || specs.maximum_width_cm || 0;
    } else if (specs.spread) {
      spread_cm = specs.spread.cm || specs.spread_cm || 0;
    }

    // If no data from specs, try growth object
    if (height_cm === 0 && growth.maximum_height_cm) {
      height_cm = growth.maximum_height_cm;
    }

    if (spread_cm === 0 && growth.maximum_width_cm) {
      spread_cm = growth.maximum_width_cm;
    }

    if (height_cm > 0 && spread_cm > 0) {
      console.log(`🌿 Trefle: ${height_cm}cm × ${spread_cm}cm`);
    }

    return {
      botanical_name: plant.scientific_name,
      common_name: plant.common_name,
      family: plant.family?.name || plant.family,
      genus: plant.genus?.name || plant.genus,
      growth_progression: {
        mature: {
          height_cm,
          spread_cm,
        },
      } as any,
      botanical_characteristics: {
        growth_rate: mapGrowthRate(growth.growth_rate),
        foliage_type: mapFoliageType(growth.foliage_type),
      } as any,
      data_sources: {
        trefle: true,
      },
    };
  } catch (error) {
    console.error('Trefle API error:', error);
    return null;
  }
}

/**
 * Fetch plant data from Perenual API
 */
async function fetchPerenualData(botanicalName: string): Promise<Partial<ScientificPlantData> | null> {
  if (!PERENUAL_API_KEY) return null;

  try {
    // Step 1: Search for the plant
    const searchResponse = await fetch(
      `https://perenual.com/api/species-list?key=${PERENUAL_API_KEY}&q=${encodeURIComponent(botanicalName)}`
    );

    if (!searchResponse.ok) return null;

    const searchData: PerenualResponse = await searchResponse.json();
    const searchResult = searchData.data[0];

    if (!searchResult) return null;

    // Step 2: Get full plant details
    const detailResponse = await fetch(
      `https://perenual.com/api/species/details/${searchResult.id}?key=${PERENUAL_API_KEY}`
    );

    if (!detailResponse.ok) {
      console.log(`⚠️ Perenual details endpoint failed, using search data only`);
      return null;
    }

    const detailData: any = await detailResponse.json();

    // Parse dimension string like "Height: 6-8 m, Width: 3-4 m"
    let dimensions = { height_cm: 0, spread_cm: 0 };

    if (detailData.dimension && typeof detailData.dimension === 'string') {
      dimensions = parseDimensionString(detailData.dimension);
    } else if (detailData.dimensions) {
      // Try structured dimensions object
      const dims = detailData.dimensions;
      if (dims.height) {
        dimensions.height_cm = dims.height.max_value * (dims.height.unit === 'm' ? 100 : 1);
      }
      if (dims.width || dims.spread) {
        const spreadData = dims.width || dims.spread;
        dimensions.spread_cm = spreadData.max_value * (spreadData.unit === 'm' ? 100 : 1);
      }
    }

    if (dimensions.height_cm > 0 && dimensions.spread_cm > 0) {
      console.log(`🌿 Perenual: ${dimensions.height_cm}cm × ${dimensions.spread_cm}cm`);
    }

    return {
      botanical_name: Array.isArray(detailData.scientific_name)
        ? detailData.scientific_name[0]
        : detailData.scientific_name,
      common_name: detailData.common_name,
      family: detailData.family,
      growth_progression: {
        mature: {
          height_cm: dimensions.height_cm,
          spread_cm: dimensions.spread_cm,
        },
      } as any,
      botanical_characteristics: {
        growth_rate: mapGrowthRate(detailData.growth_rate),
        plant_form: mapPlantForm(detailData.type),
      } as any,
      sun_exposure: detailData.sunlight ? detailData.sunlight.map((s: string) => s.toLowerCase()) as any : [],
      data_sources: {
        perenual: true,
      },
    };
  } catch (error) {
    console.error('Perenual API error:', error);
    return null;
  }
}

/**
 * Calculate growth progression based on mature size and growth rate
 */
function calculateGrowthProgression(
  matureHeight: number,
  matureSpread: number,
  growthRate: GrowthRate,
  plantForm: string
): any {
  // Growth factors based on scientific research
  const growthFactors = {
    'very-slow': { yr1: 0.02, yr3: 0.10, yr5: 0.20, yr10: 0.50, years: 40 },
    'slow': { yr1: 0.05, yr3: 0.15, yr5: 0.30, yr10: 0.65, years: 30 },
    'moderate': { yr1: 0.10, yr3: 0.30, yr5: 0.50, yr10: 0.85, years: 20 },
    'fast': { yr1: 0.15, yr3: 0.45, yr5: 0.70, yr10: 0.95, years: 15 },
    'very-fast': { yr1: 0.20, yr3: 0.60, yr5: 0.85, yr10: 1.00, years: 10 },
  };

  const factors = growthFactors[growthRate] || growthFactors['moderate'];

  return {
    year_1: {
      height_cm: Math.round(matureHeight * factors.yr1),
      spread_cm: Math.round(matureSpread * factors.yr1 * 0.8), // Spread grows slower initially
    },
    year_3: {
      height_cm: Math.round(matureHeight * factors.yr3),
      spread_cm: Math.round(matureSpread * factors.yr3),
    },
    year_5: {
      height_cm: Math.round(matureHeight * factors.yr5),
      spread_cm: Math.round(matureSpread * factors.yr5),
    },
    year_10: {
      height_cm: Math.round(matureHeight * factors.yr10),
      spread_cm: Math.round(matureSpread * factors.yr10),
    },
    mature: {
      height_cm: matureHeight,
      spread_cm: matureSpread,
    },
    years_to_maturity: factors.years,
  };
}

/**
 * Merge data from multiple sources with conflict resolution
 */
function mergeData(sources: (Partial<ScientificPlantData> | null)[]): Partial<ScientificPlantData> {
  // Priority: Perenual > Trefle > Kew > USDA
  const merged: any = {
    data_sources: {},
  };

  const validSources = sources.filter((s): s is Partial<ScientificPlantData> => s !== null);

  for (const source of validSources) {
    // Merge with priority to first source
    Object.keys(source).forEach((key) => {
      if (merged[key] === undefined) {
        merged[key] = source[key as keyof ScientificPlantData];
      }
    });

    // Merge data sources
    if (source.data_sources) {
      merged.data_sources = { ...merged.data_sources, ...source.data_sources };
    }
  }

  // Calculate data quality score based on completeness
  const requiredFields = [
    'botanical_name',
    'common_name',
    'growth_progression',
    'botanical_characteristics',
  ];
  const filledFields = requiredFields.filter((field) => merged[field] !== undefined).length;
  merged.data_quality_score = Math.round((filledFields / requiredFields.length) * 100);

  return merged;
}

/**
 * Main aggregation function
 */
export async function aggregatePlantData(botanicalName: string): Promise<ScientificPlantData | null> {
  console.log(`🔍 Aggregating data for: ${botanicalName}`);

  // Fetch from all sources in parallel
  const [trefleData, perenualData] = await Promise.all([
    fetchTrefleData(botanicalName),
    fetchPerenualData(botanicalName),
  ]);

  // Merge data
  const mergedData = mergeData([perenualData, trefleData]);

  if (!mergedData || !mergedData.botanical_name) {
    console.log(`❌ No data found for: ${botanicalName}`);
    return null;
  }

  const merged = mergedData;

  // Calculate growth progression if we have mature size
  let mature_height = merged.growth_progression?.mature?.height_cm || 0;
  let mature_spread = merged.growth_progression?.mature?.spread_cm || 0;

  // Use fallback data if APIs didn't provide dimensions
  if (mature_height === 0 || mature_spread === 0) {
    const fallback = FALLBACK_PLANT_DATA[botanicalName.toLowerCase()];
    if (fallback) {
      console.log(`📚 Using fallback botanical data for ${botanicalName}`);
      mature_height = fallback.height_cm;
      mature_spread = fallback.spread_cm;
      if (!merged.botanical_characteristics) {
        merged.botanical_characteristics = {
          growth_rate: fallback.growth_rate
        } as any;
      } else if (!merged.botanical_characteristics.growth_rate) {
        merged.botanical_characteristics.growth_rate = fallback.growth_rate;
      }
    }
  }

  console.log(`📐 Mature dimensions: ${mature_height}cm height × ${mature_spread}cm spread`);

  if (mature_height > 0 && mature_spread > 0) {
    console.log(`🌱 Calculating growth progression with ${merged.botanical_characteristics?.growth_rate || 'moderate'} growth rate...`);
    const progression = calculateGrowthProgression(
      mature_height,
      mature_spread,
      merged.botanical_characteristics?.growth_rate || 'moderate',
      merged.botanical_characteristics?.plant_form || 'tree'
    );
    merged.growth_progression = progression;
    console.log(`✅ Growth progression calculated: ${progression.years_to_maturity} years to maturity`);
  } else {
    console.log(`⚠️ Cannot calculate growth progression: height=${mature_height}cm, spread=${mature_spread}cm`);
  }

  // Calculate spacing and root zone
  const matureSpreadCm = merged.growth_progression?.mature?.spread_cm;
  if (matureSpreadCm && matureSpreadCm > 0) {
    merged.spacing_distance_cm = Math.round(matureSpreadCm * 1.2);
    merged.root_zone_radius_cm = Math.round(matureSpreadCm * 1.5);
    console.log(`📏 Calculated spacing: ${merged.spacing_distance_cm}cm (${Math.round(merged.spacing_distance_cm / 100)}m)`);
  } else {
    console.log(`⚠️ Cannot calculate spacing: mature spread is ${matureSpreadCm}cm`);
    merged.spacing_distance_cm = 0;
    merged.root_zone_radius_cm = 0;
  }

  merged.last_updated = new Date();

  console.log(`✅ Data quality score: ${merged.data_quality_score}%`);
  if (merged.data_sources) {
    console.log(`📊 Sources:`, Object.keys(merged.data_sources).filter(k => merged.data_sources![k as keyof typeof merged.data_sources]));
  }

  return merged as ScientificPlantData;
}

// Fallback botanical database for common plants (from RHS, Kew Gardens data)
const FALLBACK_PLANT_DATA: Record<string, { height_cm: number; spread_cm: number; growth_rate: GrowthRate }> = {
  // Trees
  'betula pendula': { height_cm: 2500, spread_cm: 1000, growth_rate: 'fast' }, // Silver Birch
  'acer campestre': { height_cm: 1500, spread_cm: 1200, growth_rate: 'slow' }, // Field Maple
  'acer platanoides': { height_cm: 2500, spread_cm: 1500, growth_rate: 'moderate' }, // Norway Maple
  'prunus avium': { height_cm: 2000, spread_cm: 1200, growth_rate: 'moderate' }, // Wild Cherry
  'quercus robur': { height_cm: 4000, spread_cm: 2500, growth_rate: 'slow' }, // English Oak
  'fagus sylvatica': { height_cm: 4000, spread_cm: 1500, growth_rate: 'slow' }, // European Beech
  'pinus sylvestris': { height_cm: 3500, spread_cm: 1000, growth_rate: 'moderate' }, // Scots Pine
  'crataegus monogyna': { height_cm: 1000, spread_cm: 800, growth_rate: 'slow' }, // Hawthorn
  'ilex aquifolium': { height_cm: 2000, spread_cm: 800, growth_rate: 'slow' }, // Holly
  'sorbus aucuparia': { height_cm: 1500, spread_cm: 700, growth_rate: 'moderate' }, // Rowan
  'malus sylvestris': { height_cm: 1000, spread_cm: 800, growth_rate: 'moderate' }, // Crab Apple

  // Shrubs
  'viburnum tinus': { height_cm: 300, spread_cm: 300, growth_rate: 'moderate' }, // Laurustinus
  'cornus alba': { height_cm: 300, spread_cm: 300, growth_rate: 'fast' }, // Red-barked Dogwood
  'hydrangea arborescens': { height_cm: 150, spread_cm: 200, growth_rate: 'fast' }, // Smooth Hydrangea
  'hydrangea arborescens annabelle': { height_cm: 150, spread_cm: 200, growth_rate: 'fast' }, // Annabelle Hydrangea
  'cornus sanguinea': { height_cm: 400, spread_cm: 400, growth_rate: 'fast' }, // Dogwood
  'sambucus nigra': { height_cm: 600, spread_cm: 600, growth_rate: 'fast' }, // Elder
  'euonymus europaeus': { height_cm: 300, spread_cm: 250, growth_rate: 'slow' }, // Spindle
  'viburnum opulus': { height_cm: 400, spread_cm: 400, growth_rate: 'moderate' }, // Guelder Rose
};

// Helper functions

function mapGrowthRate(rate?: string): GrowthRate {
  if (!rate) return 'moderate';
  const r = rate.toLowerCase();
  if (r.includes('very slow') || r.includes('very_slow')) return 'very-slow';
  if (r.includes('slow')) return 'slow';
  if (r.includes('fast') || r.includes('rapid')) return 'fast';
  if (r.includes('very fast') || r.includes('very_fast')) return 'very-fast';
  return 'moderate';
}

function mapFoliageType(type?: string): FoliageType {
  if (!type) return 'deciduous';
  const t = type.toLowerCase();
  if (t.includes('evergreen')) return 'evergreen';
  if (t.includes('semi')) return 'semi-evergreen';
  return 'deciduous';
}

function mapPlantForm(type?: string): any {
  if (!type) return 'tree';
  const t = type.toLowerCase();
  if (t.includes('shrub')) return 'shrub';
  if (t.includes('perennial')) return 'perennial';
  if (t.includes('grass')) return 'grass';
  if (t.includes('climber') || t.includes('vine')) return 'climber';
  return 'tree';
}

function parseDimensionString(dimension: string): { height_cm: number; spread_cm: number } {
  // Parse strings like "Height: 6-8 m, Width: 3-4 m"
  const heightMatch = dimension.match(/height:?\s*(\d+(?:\.\d+)?)-?(\d+(?:\.\d+)?)?\s*(m|cm)/i);
  const widthMatch = dimension.match(/width:?\s*(\d+(?:\.\d+)?)-?(\d+(?:\.\d+)?)?\s*(m|cm)/i);

  let height_cm = 0;
  let spread_cm = 0;

  if (heightMatch) {
    const val = parseFloat(heightMatch[2] || heightMatch[1]);
    const unit = heightMatch[3].toLowerCase();
    height_cm = unit === 'm' ? val * 100 : val;
  }

  if (widthMatch) {
    const val = parseFloat(widthMatch[2] || widthMatch[1]);
    const unit = widthMatch[3].toLowerCase();
    spread_cm = unit === 'm' ? val * 100 : val;
  }

  return { height_cm, spread_cm };
}
