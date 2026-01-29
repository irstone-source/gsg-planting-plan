/**
 * UK Postcode to RHS Hardiness Zone mapping
 *
 * RHS Hardiness Zones (H1-H7):
 * H1a: > 15°C (tropical)
 * H1b: 10-15°C (subtropical)
 * H1c: 5-10°C (warm temperate)
 * H2: 1-5°C (cool temperate)
 * H3: -5 to 1°C (cold temperate)
 * H4: -10 to -5°C (continental)
 * H5: -15 to -10°C (cold continental)
 * H6: -20 to -15°C (very cold)
 * H7: < -20°C (extremely cold)
 *
 * Most of UK mainland: H4-H5
 * Southern England/urban areas: H4
 * Northern England/Scotland: H3-H4
 * Scottish Highlands: H2-H3
 */

export interface LocationData {
  postcode: string;
  rhsZone: string;
  latitude?: number;
  longitude?: number;
  region?: string;
}

/**
 * Map UK postcode to RHS hardiness zone
 * Based on postcode area and regional climate data
 */
export function postcodeToRHSZone(postcode: string): string {
  const normalized = postcode.toUpperCase().replace(/\s+/g, '');
  const area = normalized.match(/^([A-Z]{1,2})/)?.[1];

  if (!area) {
    return 'H4'; // Default to H4 for invalid postcodes
  }

  // Southern England (warmest) - H4
  const southernAreas = ['SW', 'SE', 'E', 'N', 'W', 'EC', 'WC', 'NW', 'BR', 'CR', 'DA', 'EN', 'HA', 'IG', 'KT', 'RM', 'SM', 'TW', 'UB', 'WD', 'PO', 'SO', 'BN', 'RH', 'GU', 'TN', 'ME', 'CT'];
  if (southernAreas.includes(area)) {
    return 'H4';
  }

  // Midlands and Wales - H4
  const midlandsAreas = ['B', 'CV', 'DY', 'WS', 'WV', 'LE', 'NG', 'DE', 'S', 'DN', 'L', 'WA', 'CH', 'CW', 'ST', 'TF', 'SY', 'HR', 'WR', 'GL', 'OX', 'NN', 'MK', 'LU', 'AL', 'SG', 'HP', 'SL', 'RG', 'BA', 'BS', 'TA', 'EX', 'PL', 'TQ', 'TR', 'CF', 'NP', 'SA', 'LD'];
  if (midlandsAreas.includes(area)) {
    return 'H4';
  }

  // Northern England - H4 (coastal) to H3 (inland)
  const northernAreas = ['M', 'OL', 'BL', 'WN', 'PR', 'FY', 'LA', 'BB', 'BD', 'HX', 'HD', 'HG', 'LS', 'WF', 'YO', 'HU', 'LN', 'PE', 'NE', 'SR', 'DH', 'TS', 'DL', 'CA'];
  if (northernAreas.includes(area)) {
    // Coastal areas slightly warmer
    if (['FY', 'LA', 'CA', 'NE', 'SR'].includes(area)) {
      return 'H4';
    }
    return 'H3'; // Inland northern areas
  }

  // Scotland - H3 (lowlands) to H2 (highlands)
  const scottishAreas = ['G', 'PA', 'KA', 'EH', 'KY', 'FK', 'ML', 'DG', 'TD', 'DD', 'PH', 'AB', 'IV', 'KW', 'HS', 'ZE'];
  if (scottishAreas.includes(area)) {
    // Lowland areas (Glasgow, Edinburgh)
    if (['G', 'EH', 'KY', 'FK', 'ML', 'KA'].includes(area)) {
      return 'H3';
    }
    // Highland and island areas
    if (['IV', 'KW', 'HS', 'ZE', 'PH'].includes(area)) {
      return 'H2';
    }
    return 'H3'; // Default for Scotland
  }

  // Northern Ireland - H4
  const niAreas = ['BT'];
  if (niAreas.includes(area)) {
    return 'H4';
  }

  // Default to H4 (most common for UK)
  return 'H4';
}

/**
 * Get region name from postcode
 */
export function getRegionFromPostcode(postcode: string): string {
  const normalized = postcode.toUpperCase().replace(/\s+/g, '');
  const area = normalized.match(/^([A-Z]{1,2})/)?.[1];

  if (!area) return 'Unknown';

  const regionMap: Record<string, string> = {
    // London
    'E': 'East London',
    'EC': 'City of London',
    'N': 'North London',
    'NW': 'North West London',
    'SE': 'South East London',
    'SW': 'South West London',
    'W': 'West London',
    'WC': 'West Central London',

    // South East England
    'BR': 'Bromley',
    'CR': 'Croydon',
    'DA': 'Dartford',
    'EN': 'Enfield',
    'HA': 'Harrow',
    'IG': 'Ilford',
    'KT': 'Kingston upon Thames',
    'RM': 'Romford',
    'SM': 'Sutton',
    'TW': 'Twickenham',
    'UB': 'Uxbridge',
    'WD': 'Watford',

    // South England
    'BN': 'Brighton',
    'PO': 'Portsmouth',
    'SO': 'Southampton',
    'GU': 'Guildford',
    'RH': 'Redhill',
    'TN': 'Tonbridge',
    'ME': 'Medway',
    'CT': 'Canterbury',

    // Scotland
    'G': 'Glasgow',
    'EH': 'Edinburgh',
    'AB': 'Aberdeen',
    'DD': 'Dundee',
    'IV': 'Inverness',
    'PA': 'Paisley',

    // Wales
    'CF': 'Cardiff',
    'SA': 'Swansea',
    'NP': 'Newport',

    // Northern England
    'M': 'Manchester',
    'L': 'Liverpool',
    'LS': 'Leeds',
    'S': 'Sheffield',
    'NE': 'Newcastle',
    'BD': 'Bradford',
    'HU': 'Hull',
    'YO': 'York',

    // Northern Ireland
    'BT': 'Belfast',
  };

  return regionMap[area] || `UK (${area})`;
}

/**
 * Validate UK postcode format
 */
export function validatePostcode(postcode: string): boolean {
  const normalized = postcode.toUpperCase().replace(/\s+/g, '');

  // UK postcode regex
  // Format: A(A)N(N) NXX or A(A)N(A) NXX
  const postcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\d[A-Z]{2}$/;

  return postcodeRegex.test(normalized);
}

/**
 * Format postcode to standard UK format (with space)
 */
export function formatPostcode(postcode: string): string {
  const normalized = postcode.toUpperCase().replace(/\s+/g, '');

  if (!validatePostcode(normalized)) {
    return postcode; // Return as-is if invalid
  }

  // Insert space before last 3 characters
  const outward = normalized.slice(0, -3);
  const inward = normalized.slice(-3);

  return `${outward} ${inward}`;
}

/**
 * Get location data from postcode
 */
export async function getLocationData(postcode: string): Promise<LocationData> {
  const normalized = formatPostcode(postcode);
  const rhsZone = postcodeToRHSZone(postcode);
  const region = getRegionFromPostcode(postcode);

  // In production, you might call a geocoding API here
  // For now, return basic data

  return {
    postcode: normalized,
    rhsZone,
    region,
    // latitude and longitude would come from geocoding API
  };
}

/**
 * Get climate description for RHS zone
 */
export function getRHSZoneDescription(zone: string): string {
  const descriptions: Record<string, string> = {
    'H1a': 'Tropical - Only for heated greenhouses or as houseplants',
    'H1b': 'Subtropical - Requires heated greenhouse or conservatory',
    'H1c': 'Warm temperate - Frost-free greenhouse or conservatory',
    'H2': 'Cool temperate - Tolerates temperatures down to 1°C',
    'H3': 'Cold temperate - Hardy to -5°C, may need protection in cold areas',
    'H4': 'Continental - Hardy throughout UK, survives -10°C',
    'H5': 'Cold continental - Very hardy, survives -15°C',
    'H6': 'Very cold - Extremely hardy, survives -20°C',
    'H7': 'Extremely cold - Survives temperatures below -20°C',
  };

  return descriptions[zone] || 'Standard UK hardy plants suitable';
}

/**
 * Check if plant is suitable for location
 */
export function isPlantSuitableForZone(
  plantZone: string | undefined,
  locationZone: string
): boolean {
  if (!plantZone) return true; // If no zone specified, assume suitable

  const zoneHierarchy = ['H1a', 'H1b', 'H1c', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7'];

  const plantIndex = zoneHierarchy.indexOf(plantZone);
  const locationIndex = zoneHierarchy.indexOf(locationZone);

  if (plantIndex === -1 || locationIndex === -1) return true;

  // Plant is suitable if its required zone is equal to or warmer than location zone
  return plantIndex >= locationIndex;
}
