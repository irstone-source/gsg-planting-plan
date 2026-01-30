#!/usr/bin/env node

/**
 * Test seasonal variations - generates top view for one plant across all 4 seasons
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OUTPUT_DIR = path.join(__dirname, '../public/test-seasons');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const testPlant = { scientific: 'Betula pendula', common: 'Silver Birch', type: 'tree' };
const testMaturity = { years: 3, description: 'established, mid-maturity' };

const seasons = [
  { name: 'spring', description: 'in spring with new growth, fresh leaves, and spring flowers if applicable' },
  { name: 'summer', description: 'in summer with full lush foliage at peak growth' },
  { name: 'autumn', description: 'in autumn with fall colors, changing leaf colors, and seasonal characteristics' },
  { name: 'winter', description: 'in winter showing dormant state, bare branches if deciduous, or winter foliage if evergreen' }
];

async function generateImage(prompt, outputPath) {
  console.log(`Generating: ${path.basename(outputPath)}`);

  return new Promise((resolve, reject) => {
    const requestData = JSON.stringify({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
      quality: "standard",
      style: "natural"
    });

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', async () => {
        try {
          const response = JSON.parse(data);
          if (response.data && response.data[0] && response.data[0].url) {
            await downloadImage(response.data[0].url, outputPath);
            console.log(`✓ Saved\n`);
            resolve(outputPath);
          } else {
            reject(new Error(`No image URL in response`));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => reject(error));
    req.write(requestData);
    req.end();
  });
}

async function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const fileStream = fs.createWriteStream(outputPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => { fileStream.close(); resolve(); });
      fileStream.on('error', (error) => { fs.unlink(outputPath, () => {}); reject(error); });
    }).on('error', (error) => reject(error));
  });
}

function createPrompt(plant, maturity, season) {
  return `Overhead plan view: ${plant.scientific} (${plant.common}) canopy only, centered composition, ${maturity.description}, ${season.description}.
Single circular or organic canopy shape viewed from directly above showing seasonal foliage pattern.
Pure white background (255,255,255), no trunk visible, no ground, zero shadows, no depth, completely flat 2D illustration.
Centered in frame. Clean cutout for landscape plans. Photorealistic ${season.name} foliage for ${plant.type} at ${maturity.years} years, like a satellite view of tree crown.`;
}

async function generateSeasonalTest() {
  console.log('🌿 Generating seasonal test images (top view, 3 years, all seasons)...\n');

  for (const season of seasons) {
    const filename = `top-3yr-${season.name}.jpg`;
    const outputPath = path.join(OUTPUT_DIR, filename);
    const prompt = createPrompt(testPlant, testMaturity, season);

    try {
      await generateImage(prompt, outputPath);
    } catch (error) {
      console.error(`Error generating ${filename}:`, error.message);
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n✅ Seasonal test complete!');
  console.log(`   Images saved to: ${OUTPUT_DIR}`);
}

generateSeasonalTest().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
