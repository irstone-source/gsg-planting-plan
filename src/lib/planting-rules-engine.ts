/**
 * Planting Rules Engine
 * Applies substitutions and validates planting plans
 */

import { PlantingStyle, SiteContext } from '@/data/planting-rules';
import { SubstitutionRule, findSubstitution, getApplicableSubstitutions } from '@/data/substitution-rules';
import { calculatePlantQuantities, calculateSpacing } from '@/lib/planting-calculator';

export interface SubstitutionResult {
  original: string;
  substituted: string;
  reason: string;
  layer?: string;
}

export interface ValidationError {
  type: 'error' | 'warning';
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Planting Rules Engine
 * Validates and optimizes planting plans based on rules and site context
 */
export class PlantingRulesEngine {
  /**
   * Apply substitutions to a plant list based on site context
   */
  applySubstitutions(
    plants: string[],
    siteContext: SiteContext
  ): SubstitutionResult[] {
    const results: SubstitutionResult[] = [];

    for (const plant of plants) {
      const substitution = findSubstitution(
        plant,
        siteContext.soil,
        siteContext.context,
        siteContext.light
      );

      if (substitution) {
        results.push({
          original: substitution.replace.from,
          substituted: substitution.replace.to,
          reason: substitution.reason
        });
      }
    }

    return results;
  }

  /**
   * Apply substitutions grouped by layer
   */
  applySubstitutionsByLayer(
    plantsByLayer: Record<string, string[]>,
    siteContext: SiteContext
  ): Record<string, SubstitutionResult[]> {
    const resultsByLayer: Record<string, SubstitutionResult[]> = {};

    for (const [layer, plants] of Object.entries(plantsByLayer)) {
      const substitutions = this.applySubstitutions(plants, siteContext);

      // Add layer info to results
      resultsByLayer[layer] = substitutions.map(sub => ({
        ...sub,
        layer
      }));
    }

    return resultsByLayer;
  }

  /**
   * Validate planting plan against style rules
   */
  validatePlanting(
    style: PlantingStyle,
    area: number,
    siteContext: SiteContext,
    plantList: string[]
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Check minimum area
    if (area < 5) {
      errors.push({
        type: 'error',
        field: 'area',
        message: 'Area too small. Minimum 5m² recommended for naturalistic planting.'
      });
    }

    // Check area suitability for style
    if (style.id === 'pearson_meadow' && area < 50) {
      warnings.push({
        type: 'warning',
        field: 'area',
        message: 'Meadows work best with at least 50m². Consider prairie style for smaller areas.'
      });
    }

    // Calculate expected quantities
    const quantities = calculatePlantQuantities(style, area, siteContext);

    // Check plant count
    if (plantList.length < quantities.total * 0.8) {
      warnings.push({
        type: 'warning',
        field: 'plant_count',
        message: `Plant count (${plantList.length}) is below recommended density. Consider ${quantities.total} plants for ${area}m².`
      });
    }

    if (plantList.length > quantities.total * 1.3) {
      warnings.push({
        type: 'warning',
        field: 'plant_count',
        message: `Plant count (${plantList.length}) exceeds recommended density. Risk of overcrowding.`
      });
    }

    // Check layer distribution
    const layerRequirements = style.layers;
    const layerNames = Object.keys(layerRequirements);

    // Simplified check: at least some variety
    if (plantList.length > 0) {
      const uniquePlants = new Set(plantList).size;
      const varietyRatio = uniquePlants / plantList.length;

      if (varietyRatio < 0.1) {
        warnings.push({
          type: 'warning',
          field: 'diversity',
          message: 'Low plant diversity. Consider adding more species for visual interest.'
        });
      }
    }

    // Soil-specific warnings
    if (style.id === 'pearson_meadow' && siteContext.soil !== 'sandy' && siteContext.soil !== 'loam') {
      warnings.push({
        type: 'warning',
        field: 'soil',
        message: 'Meadows prefer low-fertility soil. Clay may need topsoil removal for wildflower success.'
      });
    }

    // Light-specific warnings
    if (style.principles.includes('structure_over_flower') && siteContext.light === 'shade') {
      warnings.push({
        type: 'warning',
        field: 'light',
        message: 'Prairie styles need full sun for grasses. Consider shade-tolerant alternatives.'
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get spacing recommendations
   */
  getSpacingRecommendations(style: PlantingStyle, siteContext: SiteContext): {
    spacing: ReturnType<typeof calculateSpacing>;
    notes: string[];
  } {
    const quantities = calculatePlantQuantities(style, 10, siteContext); // Use 10m² as reference
    const spacing = calculateSpacing(quantities.density);
    const notes: string[] = [];

    // Add style-specific notes
    if (style.id === 'oudolf_prairie') {
      notes.push('Plant in informal drifts, not rigid grids');
      notes.push('Repeat key grasses throughout for rhythm');
    }

    if (style.id === 'pearson_meadow') {
      notes.push('Scatter seed evenly; plug plants can fill gaps');
      notes.push('Mix grasses and wildflowers throughout, not in blocks');
    }

    if (style.id === 'chelsea_modern') {
      notes.push('Use generous blocks of single species');
      notes.push('Precise spacing creates intentional minimalism');
    }

    // Soil-specific notes
    if (siteContext.soil === 'clay') {
      notes.push('Space slightly wider on clay to account for slower growth');
    }

    if (siteContext.soil === 'sandy') {
      notes.push('Plant slightly denser on sandy soil to compensate for potential losses');
    }

    return {
      spacing,
      notes
    };
  }

  /**
   * Get all applicable substitution rules for site
   */
  getApplicableRules(siteContext: SiteContext): SubstitutionRule[] {
    return getApplicableSubstitutions(
      siteContext.soil,
      siteContext.context,
      siteContext.light
    );
  }
}

/**
 * Singleton instance
 */
export const plantingRulesEngine = new PlantingRulesEngine();
