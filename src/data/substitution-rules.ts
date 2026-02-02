/**
 * Plant Substitution Rules
 * Context-aware plant substitutions based on soil, light, and location
 */

export interface SubstitutionRule {
  trigger: {
    soil?: string;
    context?: string;
    light?: string;
  };
  replace: {
    from: string;
    to: string;
  };
  reason: string;
}

/**
 * Substitution rules for UK gardens
 * Based on site conditions (soil, context, light)
 */
export const substitutionRules: SubstitutionRule[] = [
  // SOIL-BASED SUBSTITUTIONS
  {
    trigger: { soil: 'clay' },
    replace: { from: 'Panicum virgatum', to: 'Molinia caerulea' },
    reason: 'Molinia performs better in heavy, moisture-retentive clay soils'
  },
  {
    trigger: { soil: 'clay' },
    replace: { from: 'Echinacea pallida', to: 'Echinacea purpurea' },
    reason: 'Echinacea purpurea more tolerant of heavy clay and damp conditions'
  },
  {
    trigger: { soil: 'sandy' },
    replace: { from: 'Succisa pratensis', to: 'Knautia arvensis' },
    reason: 'Field scabious tolerates drier, free-draining sandy soils better'
  },
  {
    trigger: { soil: 'sandy' },
    replace: { from: 'Lythrum salicaria', to: 'Salvia nemorosa' },
    reason: 'Purple Loosestrife prefers moisture; Meadow Sage suits dry sandy conditions'
  },
  {
    trigger: { soil: 'clay' },
    replace: { from: 'Festuca glauca', to: 'Carex testacea' },
    reason: 'Carex sedges handle heavy clay better than fine fescues'
  },

  // CONTEXT-BASED SUBSTITUTIONS
  {
    trigger: { context: 'urban' },
    replace: { from: 'Calamagrostis brachytricha', to: 'Calamagrostis x acutiflora \'Karl Foerster\'' },
    reason: 'Karl Foerster is more upright and controlled, better for tight urban spaces'
  },
  {
    trigger: { context: 'urban' },
    replace: { from: 'Miscanthus sinensis', to: 'Molinia caerulea' },
    reason: 'Molinia is more refined and less vigorous, suited to smaller urban gardens'
  },
  {
    trigger: { context: 'rural' },
    replace: { from: 'Geranium \'Rozanne\'', to: 'Geranium pratense' },
    reason: 'Native meadow cranesbill more appropriate for rural naturalistic settings'
  },
  {
    trigger: { context: 'urban' },
    replace: { from: 'Stipa gigantea', to: 'Stipa tenuissima' },
    reason: 'Mexican feather grass more compact, suited to urban containers and small beds'
  },

  // LIGHT-BASED SUBSTITUTIONS
  {
    trigger: { light: 'shade' },
    replace: { from: 'Echinacea pallida', to: 'Astrantia major' },
    reason: 'Astrantia thrives in shade whereas Echinacea requires full sun'
  },
  {
    trigger: { light: 'shade' },
    replace: { from: 'Rudbeckia fulgida', to: 'Eupatorium maculatum' },
    reason: 'Joe Pye Weed tolerates shade better than Black-Eyed Susan'
  },
  {
    trigger: { light: 'shade' },
    replace: { from: 'Calamagrostis x acutiflora', to: 'Deschampsia cespitosa' },
    reason: 'Tufted Hair Grass excellent for shade, Karl Foerster needs sun'
  },
  {
    trigger: { light: 'partial_shade' },
    replace: { from: 'Helenium autumnale', to: 'Aster x frikartii' },
    reason: 'Frikart\'s Aster tolerates part-shade better than Helenium'
  },

  // COMBINED CONDITIONS
  {
    trigger: { soil: 'clay', light: 'partial_shade' },
    replace: { from: 'Nepeta racemosa', to: 'Geranium macrorrhizum' },
    reason: 'Bigroot Geranium handles clay shade better than Catmint'
  },
  {
    trigger: { context: 'urban', light: 'shade' },
    replace: { from: 'Hawthorn', to: 'Amelanchier lamarckii' },
    reason: 'Juneberry more refined for urban shade, similar wildlife value'
  },
  {
    trigger: { soil: 'sandy', light: 'full_sun' },
    replace: { from: 'Persicaria amplexicaulis', to: 'Salvia nemorosa' },
    reason: 'Meadow Sage thrives in dry sunny conditions; Bistort needs moisture'
  },

  // WILDLIFE GARDEN SUBSTITUTIONS
  {
    trigger: { soil: 'clay' },
    replace: { from: 'Lotus corniculatus', to: 'Trifolium pratense' },
    reason: 'Red Clover more vigorous in heavy clay, similar nitrogen-fixing benefits'
  },
  {
    trigger: { context: 'urban' },
    replace: { from: 'Crataegus monogyna', to: 'Viburnum opulus' },
    reason: 'Guelder Rose more manageable size for urban wildlife gardens'
  },

  // MAINTENANCE-BASED
  {
    trigger: { context: 'urban' },
    replace: { from: 'Self-seeding annuals', to: 'Compact perennials' },
    reason: 'Urban gardens often prefer controlled growth over vigorous self-seeders'
  }
];

/**
 * Get applicable substitutions for site conditions
 */
export function getApplicableSubstitutions(
  soil?: string,
  context?: string,
  light?: string
): SubstitutionRule[] {
  return substitutionRules.filter(rule => {
    const soilMatch = !rule.trigger.soil || rule.trigger.soil === soil;
    const contextMatch = !rule.trigger.context || rule.trigger.context === context;
    const lightMatch = !rule.trigger.light || rule.trigger.light === light;

    return soilMatch && contextMatch && lightMatch;
  });
}

/**
 * Find substitution for a specific plant
 */
export function findSubstitution(
  plantName: string,
  soil?: string,
  context?: string,
  light?: string
): SubstitutionRule | null {
  const applicable = getApplicableSubstitutions(soil, context, light);

  for (const rule of applicable) {
    if (rule.replace.from === plantName) {
      return rule;
    }
  }

  return null;
}
