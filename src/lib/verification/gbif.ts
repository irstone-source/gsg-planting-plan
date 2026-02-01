/**
 * GBIF Backbone Taxonomy API Integration
 * Taxonomic validation and accepted name resolution
 */

export interface GBIFMatch {
  usageKey: number;
  scientificName: string;
  canonicalName: string;
  rank: string;
  status: string; // 'ACCEPTED', 'SYNONYM', 'DOUBTFUL'
  confidence: number; // 0-100
  matchType: string; // 'EXACT', 'FUZZY', 'HIGHERRANK'
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
  acceptedUsageKey?: number;
  acceptedScientificName?: string;
  synonym?: boolean;
}

export interface GBIFResult {
  match: GBIFMatch | null;
  alternatives: GBIFMatch[];
  processing_time_ms: number;
  api_version: string;
}

/**
 * Match botanical name against GBIF Backbone Taxonomy
 *
 * @param botanicalName - Scientific name to validate
 * @param strict - If true, only return exact matches
 * @returns Accepted taxonomic name and alternatives
 */
export async function matchTaxonomy(
  botanicalName: string,
  strict: boolean = false
): Promise<GBIFResult> {
  const startTime = Date.now();

  try {
    // GBIF Species Match API
    const apiUrl = `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(botanicalName)}&strict=${strict}`;

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`GBIF API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const processingTime = Date.now() - startTime;

    // Parse primary match
    const match: GBIFMatch | null = data.usageKey ? {
      usageKey: data.usageKey,
      scientificName: data.scientificName,
      canonicalName: data.canonicalName,
      rank: data.rank,
      status: data.status,
      confidence: data.confidence || 0,
      matchType: data.matchType,
      kingdom: data.kingdom,
      phylum: data.phylum,
      class: data.class,
      order: data.order,
      family: data.family,
      genus: data.genus,
      species: data.species,
      acceptedUsageKey: data.acceptedUsageKey,
      acceptedScientificName: data.accepted,
      synonym: data.synonym || false
    } : null;

    // Fetch alternatives if fuzzy match
    let alternatives: GBIFMatch[] = [];
    if (match && match.matchType === 'FUZZY') {
      alternatives = await searchSuggestions(botanicalName);
    }

    return {
      match,
      alternatives,
      processing_time_ms: processingTime,
      api_version: 'v1'
    };

  } catch (error: any) {
    console.error('GBIF taxonomy match error:', error);
    throw new Error(`GBIF API failed: ${error.message}`);
  }
}

/**
 * Get species details from GBIF
 */
export async function getSpeciesDetails(usageKey: number): Promise<any> {
  const url = `https://api.gbif.org/v1/species/${usageKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch species details: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Search for species suggestions (for fuzzy matches)
 */
export async function searchSuggestions(query: string, limit: number = 5): Promise<GBIFMatch[]> {
  const url = `https://api.gbif.org/v1/species/suggest?q=${encodeURIComponent(query)}&rank=SPECIES&limit=${limit}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to search suggestions: ${response.statusText}`);
  }

  const data = await response.json();

  return (data || []).map((item: any) => ({
    usageKey: item.key,
    scientificName: item.scientificName,
    canonicalName: item.canonicalName,
    rank: item.rank,
    status: item.status,
    confidence: 85, // GBIF suggest doesn't provide confidence, use default
    matchType: 'FUZZY',
    kingdom: item.kingdom,
    family: item.family,
    genus: item.genus,
    species: item.species,
    synonym: false
  }));
}

/**
 * Resolve accepted name from synonym
 */
export async function resolveAcceptedName(usageKey: number): Promise<string | null> {
  const details = await getSpeciesDetails(usageKey);

  if (details.accepted && details.acceptedKey) {
    const acceptedDetails = await getSpeciesDetails(details.acceptedKey);
    return acceptedDetails.scientificName;
  }

  return details.scientificName;
}
