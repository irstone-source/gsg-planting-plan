#!/usr/bin/env node

/**
 * Generate plant images from uploaded list
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OUTPUT_DIR = path.join(__dirname, '../public/plants');

// Read plant list from command line argument
const plantListFile = process.argv[2];
if (!plantListFile) {
  console.error('Usage: node generate-from-list.js <plant-list.json>');
  process.exit(1);
}

const plants = JSON.parse(fs.readFileSync(plantListFile, 'utf8'));

const views = [
  { name: 'top', description: 'overhead view, looking down from above' },
  { name: 'front', description: 'front elevation view' },
  { name: 'foliage', description: 'foliage closeup detail' }
];

const maturity = { years: 3, description: 'established, mid-maturity' };

async function generateImage(prompt, outputPath) {
  console.log(`Generating: ${outputPath}`);

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
        'Content-Type': 'application/json',
        'Content-Length': requestData.length
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

function createPrompt(plant, view) {
  const scientific = plant.scientific || plant['scientific name'] || plant.name;
  const common = plant.common || plant['common name'] || '';
  const type = plant.type || 'plant';

  if (view.name === 'top') {
    return `Overhead plan view: ${scientific} (${common}) canopy only, centered composition, ${maturity.description}.
Single circular or organic canopy shape viewed from directly above showing foliage pattern.
Pure white background (255,255,255), no trunk visible, no ground, zero shadows, no depth, completely flat 2D illustration.
Centered in frame. Clean cutout for landscape plans. Photorealistic foliage for ${type} at ${maturity.years} years, like a satellite view of tree crown.`;
  } else if (view.name === 'foliage') {
    return `Detailed closeup of ${scientific} (${common}) foliage and leaves.
Macro photography style showing leaf texture, pattern, color, and botanical details.
Isolated on pure white background, professional botanical reference image.
Photorealistic detail showing characteristic features of this ${type}, suitable for plant identification and horticultural reference.`;
  } else {
    return `Photorealistic front view of ${scientific} (${common}), ${maturity.description}.
Highly detailed, photographic quality ${type} showing complete plant form and structure.
Absolutely no ground plane, no shadows, completely isolated on pure white background.
Professional horticultural reference showing accurate representation at ${maturity.years} years of growth, suitable for landscape visualization.`;
  }
}

async function generateAll() {
  console.log(`🌿 Generating images for ${plants.length} plants...\n`);

  for (const plant of plants) {
    const scientific = plant.scientific || plant['scientific name'] || plant.name;
    const plantSlug = scientific.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const plantDir = path.join(OUTPUT_DIR, plantSlug);

    if (!fs.existsSync(plantDir)) {
      fs.mkdirSync(plantDir, { recursive: true });
    }

    console.log(`\n📸 ${scientific}`);

    for (const view of views) {
      const filename = `${view.name}.jpg`;
      const outputPath = path.join(plantDir, filename);
      const prompt = createPrompt(plant, view);

      try {
        await generateImage(prompt, outputPath);
      } catch (error) {
        console.error(`Error: ${error.message}`);
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n✅ Complete!');

  // Cleanup temp file
  try {
    fs.unlinkSync(plantListFile);
  } catch (e) {}
}

generateAll().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
