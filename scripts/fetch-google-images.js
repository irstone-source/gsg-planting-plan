#!/usr/bin/env node

/**
 * Fetch Google Images for plants using SerpAPI
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const SERPAPI_KEY = process.env.SERPAPI_KEY;
const OUTPUT_DIR = path.join(__dirname, '../public/plants');

const plants = [
  { scientific: 'Betula pendula', common: 'Silver Birch', type: 'tree' },
  { scientific: 'Viburnum tinus', common: 'Laurustinus', type: 'shrub' },
  { scientific: 'Fargesia murielae', common: 'Umbrella Bamboo', type: 'bamboo' },
  { scientific: "Geranium 'Rozanne'", common: 'Rozanne Cranesbill', type: 'perennial' },
  { scientific: 'Alchemilla mollis', common: "Lady's Mantle", type: 'perennial' },
  { scientific: 'Dryopteris filix-mas', common: 'Male Fern', type: 'fern' },
  { scientific: 'Ajuga reptans', common: 'Bugle', type: 'ground-cover' }
];

async function fetchGoogleImages(plant) {
  console.log(`\n🔍 Fetching Google Images for: ${plant.scientific}`);

  const query = `${plant.scientific} ${plant.common} plant garden`;
  const url = `https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}&num=10`;

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.images_results) {
            console.log(`   Found ${response.images_results.length} images`);
            resolve(response.images_results);
          } else {
            console.error(`   Error: ${response.error || 'No images found'}`);
            resolve([]);
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const fileStream = fs.createWriteStream(outputPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', (error) => {
        fs.unlink(outputPath, () => {});
        reject(error);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function fetchAllPlantImages() {
  console.log('🌿 Starting Google Images fetch for all plants...\n');
  console.log(`Using SerpAPI key: ${SERPAPI_KEY ? '✓ Found' : '✗ Missing'}\n`);

  if (!SERPAPI_KEY) {
    console.error('ERROR: SERPAPI_KEY not found in .env.local');
    process.exit(1);
  }

  const results = {};

  for (const plant of plants) {
    const plantSlug = plant.scientific.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const plantDir = path.join(OUTPUT_DIR, plantSlug);

    if (!fs.existsSync(plantDir)) {
      fs.mkdirSync(plantDir, { recursive: true });
    }

    try {
      const images = await fetchGoogleImages(plant);

      // Save metadata
      results[plantSlug] = {
        scientific: plant.scientific,
        common: plant.common,
        type: plant.type,
        images: images.slice(0, 10).map((img, idx) => ({
          url: img.original,
          thumbnail: img.thumbnail,
          source: img.source,
          title: img.title
        }))
      };

      // Download first 3 reference images
      console.log(`   Downloading top 3 reference images...`);
      for (let i = 0; i < Math.min(3, images.length); i++) {
        const img = images[i];
        const filename = `reference-${i + 1}.jpg`;
        const outputPath = path.join(plantDir, filename);

        try {
          await downloadImage(img.original, outputPath);
          console.log(`   ✓ Saved ${filename}`);
        } catch (error) {
          console.log(`   ✗ Failed to download ${filename}: ${error.message}`);
        }
      }

      // Save metadata JSON
      const metadataPath = path.join(plantDir, 'google-images.json');
      fs.writeFileSync(metadataPath, JSON.stringify(results[plantSlug], null, 2));
      console.log(`   ✓ Saved metadata`);

    } catch (error) {
      console.error(`   Error fetching images for ${plant.scientific}:`, error.message);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n✅ Google Images fetch complete!');
  console.log(`   Results saved to: ${OUTPUT_DIR}`);
}

fetchAllPlantImages().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
