#!/usr/bin/env node
import { searchCrocusPlant } from './src/lib/plant-data/crocus-scraper.ts';

const testPlant = 'Betula pendula';

console.log(`🧪 Testing Crocus scraper with: ${testPlant}\n`);

const result = await searchCrocusPlant(testPlant);

if (result) {
  console.log('\n✅ Success! Found plant data:\n');
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log('\n❌ Failed to find plant data');
}
