#!/usr/bin/env node
/**
 * Generate Scientific Plant Visualizations
 * Uses global botanical databases to create accurate, data-driven plant images
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const planId = process.argv[2];
const limit = process.argv[3] ? parseInt(process.argv[3]) : undefined;

if (!planId) {
  console.log('Usage: node generate-scientific-viz.mjs <planId> [limit]');
  console.log('Example: node generate-scientific-viz.mjs 416f217f-130a-4b8b-8813-b149dcc6163b 2');
  process.exit(1);
}

console.log('🔬 Generating scientific plant visualizations...');
console.log('📊 Plan ID:', planId);
if (limit) {
  console.log('📊 Limiting to first', limit, 'plants');
}
console.log('');
console.log('⏱️  This uses real botanical databases and will take 2-3 minutes per plant...');
console.log('');

const response = await fetch('http://localhost:3000/api/generate-scientific-plant-viz', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ planId, limit }),
});

const data = await response.json();

if (data.success) {
  console.log('');
  console.log('✅ Scientific visualization generation complete!');
  console.log('');
  console.log('📊 Summary:');
  console.log('   Total plants:', data.summary.total);
  console.log('   ✅ Success:', data.summary.success);
  console.log('   ❌ Errors:', data.summary.errors);
  console.log('   📈 Average Data Quality:', data.summary.average_data_quality + '%');
  console.log('');
  console.log('🔬 Scientific Details:');

  data.results.forEach((result, index) => {
    if (result.success) {
      console.log(`   ${index + 1}. ✅ ${result.botanical_name}`);
      console.log(`      Data Quality: ${result.metrics.data_quality_score}%`);
      console.log(`      Sources: ${result.metrics.data_sources.join(', ')}`);
      console.log(`      Growth Rate: ${result.metrics.growth_rate}`);
      console.log(`      Years to Maturity: ${result.metrics.years_to_maturity || 'N/A'}`);

      const spacingCm = result.metrics.spacing_distance_cm;
      const spacingDisplay = spacingCm && spacingCm > 0
        ? `${Math.round(spacingCm / 100)}m`
        : 'N/A';
      console.log(`      Spacing Required: ${spacingDisplay}`);
      console.log('');
    } else {
      console.log(`   ${index + 1}. ❌ ${result.botanical_name}: ${result.error}`);
    }
  });

  console.log('🔄 Refresh your browser to see the scientific visualizations!');
} else {
  console.log('❌ Error:', data.error);
}
