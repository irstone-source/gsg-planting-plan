#!/usr/bin/env node
/**
 * Fetch Crocus.co.uk Retail Data
 * Scrapes product images, prices, and purchase links from Crocus
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const planId = process.argv[2];
const limit = process.argv[3] ? parseInt(process.argv[3]) : undefined;

if (!planId) {
  console.log('Usage: node fetch-crocus-data.mjs <planId> [limit]');
  console.log('Example: node fetch-crocus-data.mjs 416f217f-130a-4b8b-8813-b149dcc6163b 5');
  process.exit(1);
}

console.log('🛒 Fetching Crocus.co.uk retail data...');
console.log('📊 Plan ID:', planId);
if (limit) {
  console.log('📊 Limiting to first', limit, 'plants');
}
console.log('');
console.log('⏱️  This will take ~2 seconds per plant (rate limiting)...');
console.log('');

const response = await fetch('http://localhost:3000/api/fetch-crocus-data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ planId, limit }),
});

const data = await response.json();

if (data.success) {
  console.log('');
  console.log('✅ Crocus data fetch complete!');
  console.log('');
  console.log('📊 Summary:');
  console.log('   Total plants:', data.summary.total);
  console.log('   ✅ Success:', data.summary.success);
  console.log('   ❌ Errors:', data.summary.errors);
  console.log('   ⏭️  Skipped (recent):', data.summary.skipped);
  console.log('');
  console.log('🛒 Retail Data:');

  data.results.forEach((result, index) => {
    if (result.success && result.crocus_data) {
      const cd = result.crocus_data;
      console.log(`   ${index + 1}. ✅ ${result.botanical_name}`);
      console.log(`      Product: ${cd.product_name}`);
      console.log(`      Price: £${cd.price_gbp.toFixed(2)}${cd.original_price_gbp ? ` (was £${cd.original_price_gbp.toFixed(2)})` : ''}`);
      console.log(`      Availability: ${cd.availability}`);
      if (cd.pot_size) {
        console.log(`      Pot Size: ${cd.pot_size}`);
      }
      if (cd.rating) {
        console.log(`      Rating: ${cd.rating}/5 (${cd.review_count || 0} reviews)`);
      }
      console.log(`      Link: ${cd.product_url}`);
      console.log('');
    } else if (result.success === false) {
      console.log(`   ${index + 1}. ❌ ${result.botanical_name}: ${result.error}`);
    }
  });

  console.log('🔄 Refresh your browser to see the retail data!');
} else {
  console.log('❌ Error:', data.error);
}
