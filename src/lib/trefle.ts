/**
 * Trefle API Client
 *
 * Official botanical data source with 400k+ plants
 * Documentation: https://docs.trefle.io/reference
 *
 * Account: irstone-source
 * API Key: usr-QWldTUHCef6q-Sur6NYpGyI43i173IfwXL8SjzXvgvE
 */

const TREFLE_API_URL = 'https://trefle.io/api/v1';
const TREFLE_API_KEY = process.env.TREFLE_API_KEY || 'usr-QWldTUHCef6q-Sur6NYpGyI43i173IfwXL8SjzXvgvE';

export interface TreflePlant {
  id: number;
  common_name: string | null;
  slug: string;
  scientific_name: string;
  year: number | null;
  bibliography: string | null;
  author: string | null;
  status: string;
  rank: string;
  family_common_name: string | null;
  genus_id: number;
  image_url: string | null;
  synonyms: string[];
  genus: string;
  family: string;
  links: {
    self: string;
    plant: string;
    genus: string;
  };
}

export interface TreflePlantDetail extends TreflePlant {
  main_species: {
    id: number;
    common_name: string | null;
    slug: string;
    scientific_name: string;
    year: number | null;
    observations: string | null;
    vegetable: boolean;
    complete_data: boolean;
    growth: {
      description: string | null;
      sowing: string | null;
      days_to_harvest: number | null;
      row_spacing: {
        cm: number | null;
      } | null;
      spread: {
        cm: number | null;
      } | null;
      ph_maximum: number | null;
      ph_minimum: number | null;
      light: number | null;
      atmospheric_humidity: number | null;
      minimum_precipitation: {
        mm: number | null;
      } | null;
      maximum_precipitation: {
        mm: number | null;
      } | null;
      minimum_root_depth: {
        cm: number | null;
      } | null;
      minimum_temperature: {
        deg_c: number | null;
      } | null;
      maximum_temperature: {
        deg_c: number | null;
      } | null;
    } | null;
    specifications: {
      ligneous_type: string | null;
      growth_form: string | null;
      growth_habit: string | null;
      growth_rate: string | null;
      average_height: {
        cm: number | null;
      } | null;
      maximum_height: {
        cm: number | null;
      } | null;
      nitrogen_fixation: string | null;
      shape_and_orientation: string | null;
      toxicity: string | null;
    } | null;
    foliage: {
      texture: string | null;
      color: string[];
      leaf_retention: boolean | null;
    } | null;
    flower: {
      color: string[];
      conspicuous: boolean | null;
    } | null;
    fruit_or_seed: {
      conspicuous: boolean | null;
      color: string[];
      shape: string | null;
      seed_persistence: boolean | null;
    } | null;
  };
}

export interface TrefleSearchResponse {
  data: TreflePlant[];
  links: {
    self: string;
    first: string;
    next?: string;
    prev?: string;
    last: string;
  };
  meta: {
    total: number;
  };
}

/**
 * Search plants by name (scientific or common)
 */
export async function searchPlants(query: string, page: number = 1): Promise<TrefleSearchResponse> {
  const url = `${TREFLE_API_URL}/plants/search?token=${TREFLE_API_KEY}&q=${encodeURIComponent(query)}&page=${page}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`Trefle API error: ${response.status} - ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * Get detailed plant information by ID or slug
 */
export async function getPlantDetail(idOrSlug: string): Promise<{ data: TreflePlantDetail }> {
  const url = `${TREFLE_API_URL}/plants/${idOrSlug}?token=${TREFLE_API_KEY}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`Trefle API error: ${response.status} - ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * List plants with filters
 *
 * Useful filters:
 * - filter[edible_part]=roots,leaves (edible plants)
 * - filter[vegetable]=true (vegetables only)
 * - filter[toxicity]=low,none (non-toxic plants)
 * - range[maximum_height_cm]=100,300 (height range in cm)
 */
export async function listPlants(options: {
  page?: number;
  filter?: Record<string, string>;
  filter_not?: Record<string, string>;
  order?: Record<string, string>;
  range?: Record<string, string>;
} = {}): Promise<TrefleSearchResponse> {
  const params = new URLSearchParams({
    token: TREFLE_API_KEY,
    page: (options.page || 1).toString(),
  });

  // Add filters
  if (options.filter) {
    Object.entries(options.filter).forEach(([key, value]) => {
      params.append(`filter[${key}]`, value);
    });
  }

  if (options.filter_not) {
    Object.entries(options.filter_not).forEach(([key, value]) => {
      params.append(`filter_not[${key}]`, value);
    });
  }

  if (options.order) {
    Object.entries(options.order).forEach(([key, value]) => {
      params.append(`order[${key}]`, value);
    });
  }

  if (options.range) {
    Object.entries(options.range).forEach(([key, value]) => {
      params.append(`range[${key}]`, value);
    });
  }

  const url = `${TREFLE_API_URL}/plants?${params.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`Trefle API error: ${response.status} - ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * Search UK-suitable plants by hardiness zone
 *
 * UK USDA Hardiness Zones (approx):
 * - Scotland: 7-8
 * - Northern England: 7-8
 * - Southern England: 8-9
 * - London: 9
 */
export async function searchUKPlants(query: string, rhsZone: string = 'H4'): Promise<TreflePlant[]> {
  // Map RHS zones to USDA zones (rough approximation)
  const rhsToUsda: Record<string, number> = {
    'H1a': 13, // > 15°C
    'H1b': 12, // 10-15°C
    'H1c': 11, // 5-10°C
    'H2': 10,  // 1-5°C
    'H3': 9,   // -5 to 1°C
    'H4': 8,   // -10 to -5°C (Most of UK)
    'H5': 7,   // -15 to -10°C
    'H6': 6,   // -20 to -15°C
    'H7': 5,   // < -20°C
  };

  const usdaZone = rhsToUsda[rhsZone] || 8;

  try {
    // Search plants and filter by suitable hardiness
    const results = await searchPlants(query);

    // Note: Full hardiness filtering requires main_species data
    // For now, return all results - caller can fetch details if needed
    return results.data;
  } catch (error) {
    console.error('Trefle UK plant search error:', error);
    return [];
  }
}

/**
 * Get plant images
 */
export async function getPlantImages(plantSlug: string): Promise<string[]> {
  try {
    const result = await getPlantDetail(plantSlug);
    const images: string[] = [];

    if (result.data.image_url) {
      images.push(result.data.image_url);
    }

    // Could also fetch species images if needed
    // GET /api/v1/species/{id}/images

    return images;
  } catch (error) {
    console.error('Trefle image fetch error:', error);
    return [];
  }
}
