/**
 * iNaturalist Computer Vision API Integration
 * Species identification from plant photos
 */

export interface INaturalistTaxon {
  id: number;
  name: string;
  rank: string;
  common_name?: string;
  score: number; // 0-100
  iconic_taxon_name?: string;
  preferred_common_name?: string;
}

export interface INaturalistResult {
  taxa: INaturalistTaxon[];
  processing_time_ms: number;
  api_version: string;
}

/**
 * Identify species from image URL using iNaturalist Computer Vision API
 *
 * @param imageUrl - Public URL of the image to analyze
 * @param botanicalNameHint - Optional hint to improve accuracy
 * @returns Candidate taxa sorted by confidence score
 */
export async function identifySpecies(
  imageUrl: string,
  botanicalNameHint?: string
): Promise<INaturalistResult> {
  const startTime = Date.now();

  try {
    // iNaturalist Computer Vision API endpoint
    const apiUrl = 'https://api.inaturalist.org/v1/computervision/score_image';

    // Prepare request body
    const formData = new FormData();

    // Fetch image and convert to blob
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    const imageBlob = await imageResponse.blob();
    formData.append('image', imageBlob);

    // Add optional taxon hint (improves accuracy)
    if (botanicalNameHint) {
      // Search for taxon ID by name first
      const searchUrl = `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(botanicalNameHint)}&rank=species&is_active=true`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (searchData.results && searchData.results.length > 0) {
        const taxonId = searchData.results[0].id;
        formData.append('taxon_id', taxonId.toString());
      }
    }

    // Call Computer Vision API
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`iNaturalist API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const processingTime = Date.now() - startTime;

    // Extract and normalize results
    const taxa: INaturalistTaxon[] = (data.results || []).map((result: any) => ({
      id: result.taxon.id,
      name: result.taxon.name,
      rank: result.taxon.rank,
      common_name: result.taxon.preferred_common_name || result.taxon.common_name?.name,
      score: result.score * 100, // Convert 0-1 to 0-100
      iconic_taxon_name: result.taxon.iconic_taxon_name,
      preferred_common_name: result.taxon.preferred_common_name
    }));

    return {
      taxa: taxa.sort((a, b) => b.score - a.score), // Sort by confidence descending
      processing_time_ms: processingTime,
      api_version: 'v1'
    };

  } catch (error: any) {
    console.error('iNaturalist identification error:', error);
    throw new Error(`iNaturalist API failed: ${error.message}`);
  }
}

/**
 * Get detailed taxon information from iNaturalist
 */
export async function getTaxonDetails(taxonId: number): Promise<any> {
  const url = `https://api.inaturalist.org/v1/taxa/${taxonId}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch taxon details: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results?.[0] || null;
}

/**
 * Search for taxa by name
 */
export async function searchTaxa(query: string, rank: 'species' | 'genus' | 'family' = 'species'): Promise<any[]> {
  const url = `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(query)}&rank=${rank}&is_active=true`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to search taxa: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results || [];
}
