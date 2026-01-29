import { analyzeImages } from './anthropic';

export interface VisionAnalysisResult {
  sunExposure: {
    assessment: 'full_sun' | 'partial_shade' | 'full_shade' | 'mixed';
    confidence: number;
    details: string;
  };
  soilConditions: {
    visible: boolean;
    assessment?: 'clay' | 'loam' | 'sand' | 'unknown';
    details: string;
  };
  existingPlants: Array<{
    type: string;
    condition: string;
    location: string;
  }>;
  spatialFeatures: {
    estimatedArea?: string;
    boundaries: string[];
    structures: string[];
    hardscaping: string[];
  };
  challenges: string[];
  opportunities: string[];
  overallAssessment: string;
}

/**
 * Analyze garden site photos using Claude Vision
 */
export async function analyzeSitePhotos(
  images: Array<{ data: string; mediaType: string }>
): Promise<VisionAnalysisResult> {
  const prompt = `You are a professional UK garden designer analyzing site photos for a planting plan.

Analyze these garden/site photos and provide a comprehensive assessment in JSON format.

Evaluate:
1. **Sun Exposure**: Based on shadows, light patterns, and existing vegetation
   - Assess as: full_sun (6+ hours direct sun), partial_shade (3-6 hours), full_shade (<3 hours), or mixed
   - Rate confidence (0-100%)
   - Explain visible indicators

2. **Soil Conditions**: If visible in photos
   - Identify soil type if possible: clay, loam, sand, or unknown
   - Note drainage, compaction, existing vegetation health

3. **Existing Plants**: Identify any visible plants
   - Type (trees, shrubs, herbaceous, lawn, weeds)
   - Condition (healthy, struggling, overgrown)
   - Location in the space

4. **Spatial Features**:
   - Estimated dimensions if possible
   - Boundaries (fences, walls, hedges)
   - Structures (sheds, patios, paths)
   - Hardscaping elements

5. **Challenges**: Problems or constraints
   - Drainage issues, compacted soil, invasive weeds
   - Awkward shapes, slopes, access issues
   - Existing plant conflicts

6. **Opportunities**: Positive features to leverage
   - Good soil, mature trees, interesting features
   - Sheltered spots, focal points, views

7. **Overall Assessment**: Summary of the site's potential

Return ONLY valid JSON in this exact structure (no markdown, no code blocks):
{
  "sunExposure": {
    "assessment": "full_sun|partial_shade|full_shade|mixed",
    "confidence": 85,
    "details": "Explanation of light conditions observed"
  },
  "soilConditions": {
    "visible": true,
    "assessment": "clay|loam|sand|unknown",
    "details": "Soil observations"
  },
  "existingPlants": [
    {
      "type": "Plant type",
      "condition": "Condition description",
      "location": "Location in space"
    }
  ],
  "spatialFeatures": {
    "estimatedArea": "Approximate dimensions",
    "boundaries": ["boundary descriptions"],
    "structures": ["structure descriptions"],
    "hardscaping": ["hardscaping elements"]
  },
  "challenges": ["challenge 1", "challenge 2"],
  "opportunities": ["opportunity 1", "opportunity 2"],
  "overallAssessment": "Summary of site potential and suitability for planting"
}`;

  try {
    const response = await analyzeImages(images, prompt);

    // Try to extract JSON from response
    let jsonStr = response.trim();

    // Remove markdown code blocks if present
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const analysis = JSON.parse(jsonStr) as VisionAnalysisResult;

    // Validate required fields
    if (!analysis.sunExposure || !analysis.overallAssessment) {
      throw new Error('Invalid analysis structure');
    }

    return analysis;
  } catch (error) {
    console.error('Vision analysis error:', error);

    // Return fallback analysis
    return {
      sunExposure: {
        assessment: 'mixed',
        confidence: 50,
        details: 'Unable to determine from photos. Please verify site conditions in person.',
      },
      soilConditions: {
        visible: false,
        details: 'Soil not visible in photos. Recommend soil test.',
      },
      existingPlants: [],
      spatialFeatures: {
        boundaries: [],
        structures: [],
        hardscaping: [],
      },
      challenges: ['Unable to fully analyze from provided photos'],
      opportunities: ['Site has potential - recommend in-person assessment'],
      overallAssessment: 'Photos provided, but unable to perform complete analysis. Recommend providing clearer photos or conducting in-person site visit.',
    };
  }
}

/**
 * Generate planting recommendations based on site analysis and preferences
 */
export async function generatePlantingRecommendations(
  siteAnalysis: VisionAnalysisResult,
  userPreferences: {
    style: string;
    maintenanceLevel: string;
    budgetMin?: number;
    budgetMax?: number;
    specialRequirements?: string;
  },
  availablePlants: Array<{
    botanical_name: string;
    common_name?: string;
    category: string;
    size: string;
    hardiness_zone?: string;
    stock_quantity: number;
  }>
): Promise<{
  recommendations: string;
  rationale: string;
}> {
  const prompt = `You are a professional UK garden designer creating planting recommendations.

SITE ANALYSIS:
${JSON.stringify(siteAnalysis, null, 2)}

CLIENT PREFERENCES:
- Style: ${userPreferences.style}
- Maintenance Level: ${userPreferences.maintenanceLevel}
- Budget: £${userPreferences.budgetMin || 0} - £${userPreferences.budgetMax || 'flexible'}
- Special Requirements: ${userPreferences.specialRequirements || 'None specified'}

AVAILABLE PLANTS (sample):
${JSON.stringify(availablePlants.slice(0, 50), null, 2)}

Create a professional planting plan narrative that:
1. Explains the design approach based on site conditions
2. Recommends specific plants from the available list
3. Explains plant placement and layering (canopy, shrub, herbaceous, ground cover)
4. Addresses the client's style preferences and maintenance level
5. Stays within budget constraints
6. Considers seasonal interest and year-round appeal

Return a JSON object with:
- "recommendations": Detailed planting plan narrative
- "rationale": Design rationale explaining choices

Keep it professional but friendly. Focus on UK-specific plants and growing conditions.`;

  try {
    const response = await analyzeImages([], prompt);
    let jsonStr = response.trim();

    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Recommendation generation error:', error);
    return {
      recommendations: 'Unable to generate specific recommendations at this time.',
      rationale: 'System encountered an error processing the planting plan.',
    };
  }
}
