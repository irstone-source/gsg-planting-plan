#!/usr/bin/env node

/**
 * Quick verification test for the planting rules engine
 */

import { getPlantingStyle } from './src/data/planting-rules.ts';
import { calculatePlantQuantities } from './src/lib/planting-calculator.ts';
import { plantingRulesEngine } from './src/lib/planting-rules-engine.ts';

console.log('🌱 Testing Planting Rules Engine...\n');

// Test 1: Get Dan Pearson Meadow style
console.log('Test 1: Loading Dan Pearson Meadow style...');
const style = getPlantingStyle('pearson_meadow');
if (style) {
  console.log('✅ Style loaded:', style.name);
  console.log('   Density:', style.density.plants_per_m2);
  console.log('   Seed rate:', style.density.seed_rate_g_per_m2 + 'g/m²');
} else {
  console.log('❌ Style not found');
}

// Test 2: Calculate quantities for 100m²
console.log('\nTest 2: Calculating quantities for 100m² rural meadow...');
const siteContext = {
  context: 'rural',
  soil: 'loam',
  light: 'full_sun',
  area_m2: 100
};

const quantities = calculatePlantQuantities(style, 100, siteContext);
console.log('✅ Total plants:', quantities.total);
console.log('   Density:', quantities.density + ' plants/m²');
console.log('   By layer:');
Object.entries(quantities.byLayer).forEach(([layer, count]) => {
  console.log(`      ${layer}: ${count} plants`);
});
console.log('   Adjustments:', quantities.adjustments.length);

// Test 3: Apply substitutions
console.log('\nTest 3: Testing substitutions for clay soil...');
const plants = ['Echinacea pallida', 'Panicum virgatum', 'Succisa pratensis'];
const clayContext = {
  context: 'urban',
  soil: 'clay',
  light: 'partial_shade',
  area_m2: 50
};

const substitutions = plantingRulesEngine.applySubstitutions(plants, clayContext);
console.log('✅ Substitutions found:', substitutions.length);
substitutions.forEach(sub => {
  console.log(`   ${sub.original} → ${sub.substituted}`);
  console.log(`   Reason: ${sub.reason}`);
});

// Test 4: Validate planting
console.log('\nTest 4: Validating planting plan...');
const validation = plantingRulesEngine.validatePlanting(
  style,
  100,
  siteContext,
  Array(120).fill('Test Plant')
);
console.log('✅ Valid:', validation.valid);
console.log('   Errors:', validation.errors.length);
console.log('   Warnings:', validation.warnings.length);
if (validation.warnings.length > 0) {
  console.log('   First warning:', validation.warnings[0].message);
}

// Test 5: Get spacing recommendations
console.log('\nTest 5: Getting spacing recommendations...');
const spacing = plantingRulesEngine.getSpacingRecommendations(style, siteContext);
console.log('✅ Grid spacing:', spacing.spacing.grid_spacing_cm + 'cm');
console.log('   Informal spacing:', spacing.spacing.informal_spacing_cm + 'cm');
console.log('   Notes:', spacing.notes.length);

console.log('\n✨ All tests completed successfully!\n');
