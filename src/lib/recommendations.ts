/**
 * AI-Powered Plant Recommendation Engine
 * Uses Claude to generate contextual, professional planting recommendations
 */

import { generateText } from './anthropic';
import { matchPlants, getLayeredSelection, type PlantMatch, type PlantMatchCriteria } from './plant-matching';
import type { VisionAnalysisResult } from './vision-analysis';

export interface PlantRecommendation {
  plant_id: string;
  botanical_name: string;
  common_name?: string;
  category: string;
  quantity: number;
  position: string;
  rationale: string;
  match_score: number;
  price_per_plant?: number;
  total_cost?: number;
}

export interface RecommendationResult {
  recommendations: PlantRecommendation[];
  design_notes: string;
  planting_zones: Array<{
    name: string;
    description: string;
    plants: string[];
  }>;
  maintenance_advice: string;
  total_cost: number;
  total_plants: number;
}

/**
 * Generate plant recommendations using AI
 */
export async function generatePlantRecommendations(
  criteria: PlantMatchCriteria,
  visionAnalysis: VisionAnalysisResult | null,
  userPreferences: {
    style: string;
    maintenanceLevel: string;
    specialRequirements?: string;
  }
): Promise<RecommendationResult> {
  console.log('🤖 Generating AI-powered recommendations...');

  // Step 1: Get matched plants from database
  const matchedPlants = await matchPlants(criteria);
  console.log(`✓ Found ${matchedPlants.length} matching plants`);

  if (matchedPlants.length === 0) {
    throw new Error('No suitable plants found for these conditions');
  }

  // Step 2: Get layered selection
  const layered = getLayeredSelection(matchedPlants, criteria.areaSqm);
  console.log('✓ Layered selection:', {
    trees: layered.trees.length,
    shrubs: layered.shrubs.length,
    herbaceous: layered.herbaceous.length,
    climbers: layered.climbers.length,
    grasses: layered.grasses.length,
  });

  // Step 3: Prepare context for Claude
  const plantContext = prepareClaudePlantContext(matchedPlants, layered);

  // Step 4: Generate recommendations with Claude
  const prompt = buildRecommendationPrompt(
    criteria,
    visionAnalysis,
    userPreferences,
    plantContext
  );

  const aiResponse = await generateText(prompt);
  console.log('✓ AI recommendations generated');

  // Step 5: Parse AI response and create structured recommendations
  const recommendations = parseAIRecommendations(aiResponse, matchedPlants);

  // Step 6: Calculate costs
  const totalCost = recommendations.reduce((sum, rec) => sum + (rec.total_cost || 0), 0);
  const totalPlants = recommendations.reduce((sum, rec) => sum + rec.quantity, 0);

  return {
    recommendations,
    design_notes: extractDesignNotes(aiResponse),
    planting_zones: extractPlantingZones(aiResponse),
    maintenance_advice: extractMaintenanceAdvice(aiResponse),
    total_cost: totalCost,
    total_plants: totalPlants,
  };
}

/**
 * Prepare plant data for Claude context
 */
function prepareClaudePlantContext(allMatches: PlantMatch[], layered: any): string {
  const sections = [];

  // Trees
  if (layered.trees.length > 0) {
    sections.push('TREES (Structure Layer):');
    layered.trees.slice(0, 5).forEach((p: PlantMatch) => {
      sections.push(`- ${p.botanical_name} (${p.common_name || 'N/A'}) - ${p.size} - Stock: ${p.stock_quantity} - Score: ${p.match_score}`);
      sections.push(`  Reasons: ${p.match_reasons.join(', ')}`);
    });
  }

  // Shrubs
  if (layered.shrubs.length > 0) {
    sections.push('\nSHRUBS (Mid Layer):');
    layered.shrubs.slice(0, 8).forEach((p: PlantMatch) => {
      sections.push(`- ${p.botanical_name} (${p.common_name || 'N/A'}) - ${p.size} - Stock: ${p.stock_quantity} - Score: ${p.match_score}`);
      sections.push(`  Reasons: ${p.match_reasons.join(', ')}`);
    });
  }

  // Herbaceous
  if (layered.herbaceous.length > 0) {
    sections.push('\nHERBACEOUS PERENNIALS (Ground Layer):');
    layered.herbaceous.slice(0, 12).forEach((p: PlantMatch) => {
      sections.push(`- ${p.botanical_name} (${p.common_name || 'N/A'}) - ${p.size} - Stock: ${p.stock_quantity} - Score: ${p.match_score}`);
      sections.push(`  Reasons: ${p.match_reasons.join(', ')}`);
    });
  }

  // Climbers
  if (layered.climbers.length > 0) {
    sections.push('\nCLIMBERS (Vertical Interest):');
    layered.climbers.slice(0, 3).forEach((p: PlantMatch) => {
      sections.push(`- ${p.botanical_name} (${p.common_name || 'N/A'}) - ${p.size} - Stock: ${p.stock_quantity} - Score: ${p.match_score}`);
    });
  }

  // Grasses
  if (layered.grasses.length > 0) {
    sections.push('\nORNAMENTAL GRASSES (Movement & Texture):');
    layered.grasses.slice(0, 5).forEach((p: PlantMatch) => {
      sections.push(`- ${p.botanical_name} (${p.common_name || 'N/A'}) - ${p.size} - Stock: ${p.stock_quantity} - Score: ${p.match_score}`);
    });
  }

  return sections.join('\n');
}

/**
 * Build prompt for Claude recommendation generation
 */
function buildRecommendationPrompt(
  criteria: PlantMatchCriteria,
  visionAnalysis: VisionAnalysisResult | null,
  userPreferences: any,
  plantContext: string
): string {
  return `You are a professional garden designer creating a planting plan for a UK garden.

SITE CONDITIONS:
- Location: RHS Zone ${criteria.rhsZone}
- Sun Exposure: ${criteria.sunExposure}
- Soil Type: ${criteria.soilType}
- Moisture: ${criteria.moisture}
- Area: ${criteria.areaSqm || 'Unknown'} square meters
${visionAnalysis ? `
VISION ANALYSIS INSIGHTS:
Sun Exposure: ${visionAnalysis.sunExposure.details}
Challenges: ${visionAnalysis.challenges.join('; ')}
Opportunities: ${visionAnalysis.opportunities.join('; ')}
Overall Assessment: ${visionAnalysis.overallAssessment}
` : ''}

CLIENT PREFERENCES:
- Style: ${userPreferences.style}
- Maintenance Level: ${userPreferences.maintenanceLevel}
${userPreferences.specialRequirements ? `- Special Requirements: ${userPreferences.specialRequirements}` : ''}
${criteria.budgetMin ? `- Budget: £${criteria.budgetMin}-£${criteria.budgetMax || 'flexible'}` : ''}

AVAILABLE PLANTS (filtered for site compatibility):
${plantContext}

TASK:
Create a professional planting plan using ONLY the plants listed above. For each plant you select:
1. Specify the quantity needed based on the area and plant spacing
2. Describe the position/zone in the garden (e.g., "back border", "under tree canopy", "sunny corner")
3. Provide a brief rationale explaining why this plant works for this site

Format your response as JSON:
{
  "design_notes": "Overall design concept and approach (2-3 sentences)",
  "planting_zones": [
    {
      "name": "Zone name (e.g., Sunny Border, Shade Garden)",
      "description": "Brief description",
      "plants": ["Botanical name 1", "Botanical name 2"]
    }
  ],
  "recommendations": [
    {
      "botanical_name": "Exact name from list above",
      "quantity": <number>,
      "position": "Where to plant",
      "rationale": "Why this plant works here"
    }
  ],
  "maintenance_advice": "Seasonal maintenance guidance (2-3 sentences)"
}

IMPORTANT GUIDELINES:
- Use ONLY plants from the provided list
- Respect the ${userPreferences.maintenanceLevel} maintenance preference
- Create a layered design (trees, shrubs, perennials)
- Consider year-round interest
- Address the site challenges identified
- Match plant names exactly as shown in the list
- Quantities should be realistic for ${criteria.areaSqm || 20}sqm
- Aim for 15-25 total plant recommendations across all layers`;
}

/**
 * Parse AI recommendations into structured format
 */
function parseAIRecommendations(aiResponse: string, matchedPlants: PlantMatch[]): PlantRecommendation[] {
  try {
    // Extract JSON from response (Claude might wrap it in markdown)
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ No JSON found in AI response');
      return createFallbackRecommendations(matchedPlants);
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const recommendations: PlantRecommendation[] = [];

    // Create lookup map for matched plants
    const plantMap = new Map(
      matchedPlants.map(p => [p.botanical_name.toLowerCase(), p])
    );

    for (const rec of parsed.recommendations || []) {
      const botanicalKey = rec.botanical_name.toLowerCase();
      const matchedPlant = plantMap.get(botanicalKey);

      if (!matchedPlant) {
        console.warn(`⚠️ Plant not found in matches: ${rec.botanical_name}`);
        continue;
      }

      const pricePerPlant = matchedPlant.price_gbp || estimatePrice(matchedPlant.size);
      const totalCost = pricePerPlant * rec.quantity;

      recommendations.push({
        plant_id: matchedPlant.id,
        botanical_name: matchedPlant.botanical_name,
        common_name: matchedPlant.common_name,
        category: matchedPlant.category,
        quantity: rec.quantity,
        position: rec.position,
        rationale: rec.rationale,
        match_score: matchedPlant.match_score,
        price_per_plant: pricePerPlant,
        total_cost: totalCost,
      });
    }

    return recommendations;
  } catch (error) {
    console.error('❌ Error parsing AI recommendations:', error);
    return createFallbackRecommendations(matchedPlants);
  }
}

/**
 * Estimate plant price based on size (fallback)
 */
function estimatePrice(size: string): number {
  const sizeMap: Record<string, number> = {
    '9cm': 3.50,
    '1L': 5.99,
    '2L': 8.99,
    '3L': 12.99,
    '5L': 18.99,
    '7.5L': 24.99,
    '10L': 34.99,
    '15L': 49.99,
    '20L': 69.99,
    '25L': 89.99,
    '30L': 119.99,
    '36L': 149.99,
  };

  return sizeMap[size] || 15.99;
}

/**
 * Create fallback recommendations if AI parsing fails
 */
function createFallbackRecommendations(matchedPlants: PlantMatch[]): PlantRecommendation[] {
  console.log('⚠️ Using fallback recommendations');

  const layered = getLayeredSelection(matchedPlants, 20);
  const recommendations: PlantRecommendation[] = [];

  // Add trees
  layered.trees.slice(0, 1).forEach(plant => {
    recommendations.push({
      plant_id: plant.id,
      botanical_name: plant.botanical_name,
      common_name: plant.common_name,
      category: plant.category,
      quantity: 1,
      position: 'Feature position for structure',
      rationale: plant.match_reasons.join(', '),
      match_score: plant.match_score,
      price_per_plant: plant.price_gbp || estimatePrice(plant.size),
      total_cost: (plant.price_gbp || estimatePrice(plant.size)) * 1,
    });
  });

  // Add shrubs
  layered.shrubs.slice(0, 3).forEach(plant => {
    recommendations.push({
      plant_id: plant.id,
      botanical_name: plant.botanical_name,
      common_name: plant.common_name,
      category: plant.category,
      quantity: 3,
      position: 'Mid-border for structure and interest',
      rationale: plant.match_reasons.join(', '),
      match_score: plant.match_score,
      price_per_plant: plant.price_gbp || estimatePrice(plant.size),
      total_cost: (plant.price_gbp || estimatePrice(plant.size)) * 3,
    });
  });

  // Add herbaceous
  layered.herbaceous.slice(0, 5).forEach(plant => {
    recommendations.push({
      plant_id: plant.id,
      botanical_name: plant.botanical_name,
      common_name: plant.common_name,
      category: plant.category,
      quantity: 5,
      position: 'Front border for seasonal color',
      rationale: plant.match_reasons.join(', '),
      match_score: plant.match_score,
      price_per_plant: plant.price_gbp || estimatePrice(plant.size),
      total_cost: (plant.price_gbp || estimatePrice(plant.size)) * 5,
    });
  });

  return recommendations;
}

/**
 * Extract design notes from AI response
 */
function extractDesignNotes(aiResponse: string): string {
  try {
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.design_notes || 'Layered planting design for year-round interest';
    }
  } catch (e) {
    // Fallback
  }
  return 'Layered planting design combining trees, shrubs, and perennials for year-round interest';
}

/**
 * Extract planting zones from AI response
 */
function extractPlantingZones(aiResponse: string): Array<{ name: string; description: string; plants: string[] }> {
  try {
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.planting_zones || [];
    }
  } catch (e) {
    // Fallback
  }
  return [];
}

/**
 * Extract maintenance advice from AI response
 */
function extractMaintenanceAdvice(aiResponse: string): string {
  try {
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.maintenance_advice || 'Regular watering during establishment, mulch annually, prune as needed';
    }
  } catch (e) {
    // Fallback
  }
  return 'Regular watering during establishment, mulch annually, prune as needed';
}
