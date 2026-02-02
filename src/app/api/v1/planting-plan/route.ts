/**
 * Planting Plan API v1
 * Generates planting plans based on style and site context
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPlantingStyle, getPlantingRuleId } from '@/data/planting-rules';
import { SiteContext } from '@/data/planting-rules';
import { plantingRulesEngine } from '@/lib/planting-rules-engine';
import { calculatePlantQuantities } from '@/lib/planting-calculator';

/**
 * POST /api/v1/planting-plan
 *
 * Generate a planting plan with quantities, substitutions, and validation
 *
 * Request body:
 * {
 *   "styleId": "oudolf_prairie" | "chelsea_wildlife" | "pearson_meadow" | etc,
 *   "siteContext": {
 *     "context": "urban" | "suburban" | "rural",
 *     "soil": "clay" | "loam" | "sandy",
 *     "light": "full_sun" | "partial_shade" | "shade",
 *     "area_m2": number
 *   },
 *   "plantList"?: string[] // Optional: validate existing plant list
 * }
 *
 * Response:
 * {
 *   "style": PlantingStyle,
 *   "site": SiteContext,
 *   "quantities": PlantQuantities,
 *   "substitutions": SubstitutionResult[],
 *   "spacing": { grid_spacing_cm, informal_spacing_cm, notes },
 *   "validation": ValidationResult,
 *   "metadata": { generated_at, api_version }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { styleId, siteContext, plantList } = body;

    // Validate required fields
    if (!styleId || !siteContext) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          message: 'styleId and siteContext are required'
        },
        { status: 400 }
      );
    }

    // Get planting style
    const style = getPlantingStyle(styleId);
    if (!style) {
      return NextResponse.json(
        {
          error: 'Invalid style',
          message: `Style "${styleId}" not found. Available: oudolf_prairie, chelsea_wildlife, pearson_meadow, monty_don_cottage, chelsea_modern`
        },
        { status: 404 }
      );
    }

    // Validate site context
    const validContexts = ['urban', 'suburban', 'rural'];
    const validSoils = ['clay', 'loam', 'sandy'];
    const validLights = ['full_sun', 'partial_shade', 'shade'];

    if (!validContexts.includes(siteContext.context) ||
        !validSoils.includes(siteContext.soil) ||
        !validLights.includes(siteContext.light)) {
      return NextResponse.json(
        {
          error: 'Invalid site context',
          message: 'context, soil, and light must be valid enum values'
        },
        { status: 400 }
      );
    }

    if (!siteContext.area_m2 || siteContext.area_m2 < 5 || siteContext.area_m2 > 1000) {
      return NextResponse.json(
        {
          error: 'Invalid area',
          message: 'area_m2 must be between 5 and 1000'
        },
        { status: 400 }
      );
    }

    // Calculate quantities
    const quantities = calculatePlantQuantities(
      style,
      siteContext.area_m2,
      siteContext as SiteContext
    );

    // Get spacing recommendations
    const spacingRec = plantingRulesEngine.getSpacingRecommendations(
      style,
      siteContext as SiteContext
    );

    // Get applicable substitution rules
    const applicableRules = plantingRulesEngine.getApplicableRules(
      siteContext as SiteContext
    );

    // Apply substitutions if plant list provided
    let substitutions: any[] = [];
    if (plantList && Array.isArray(plantList)) {
      substitutions = plantingRulesEngine.applySubstitutions(
        plantList,
        siteContext as SiteContext
      );
    }

    // Validate if plant list provided
    let validation: any = null;
    if (plantList && Array.isArray(plantList)) {
      validation = plantingRulesEngine.validatePlanting(
        style,
        siteContext.area_m2,
        siteContext as SiteContext,
        plantList
      );
    }

    // Build response
    const response = {
      style: {
        id: style.id,
        name: style.name,
        difficulty: style.difficulty,
        maintenance: style.maintenance,
        density: style.density,
        layers: style.layers,
        principles: style.principles
      },
      site: siteContext,
      quantities,
      substitutions,
      spacing: {
        ...spacingRec.spacing,
        notes: spacingRec.notes
      },
      validation,
      applicable_rules: applicableRules.length,
      metadata: {
        generated_at: new Date().toISOString(),
        api_version: 'v1'
      }
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/planting-plan
 *
 * Get list of available planting styles
 */
export async function GET() {
  try {
    const styles = [
      'oudolf_prairie',
      'chelsea_wildlife',
      'pearson_meadow',
      'monty_don_cottage',
      'chelsea_modern'
    ];

    return NextResponse.json({
      available_styles: styles,
      api_version: 'v1',
      documentation: 'https://plantingplans.co.uk/api-docs'
    });

  } catch (error) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
