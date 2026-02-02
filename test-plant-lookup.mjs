import { getPlantDetail } from './src/data/plant-database.ts';

const testNames = [
  'Native grasses',
  'Various UK native grasses',
  'Hardy perennials',
  'Various hardy species',
  'Climbing roses',
  'Betula pendula',
  'Fargesia murielae',
  'Echinacea',
  'Echinacea purpurea',
  'Ferns',
  'Various fern species',
  'Dryopteris filix-mas'
];

console.log('Testing plant lookups:\n');
testNames.forEach(name => {
  const result = getPlantDetail(name);
  if (result) {
    console.log(`✅ "${name}" → ${result.scientificName} (${result.commonName})`);
  } else {
    console.log(`❌ "${name}" → NOT FOUND`);
  }
});
