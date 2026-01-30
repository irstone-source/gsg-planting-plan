#!/usr/bin/env node

/**
 * Generate botanical illustrations for garden plants using Nano Banana Pro via OpenRouter
 *
 * Creates multiple views and growth stages for each plant:
 * - Top-down view (overhead)
 * - Front view (elevation)
 * - Side view (profile)
 * - Growth stages: 1yr, 3yr, 5yr
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OUTPUT_DIR = path.join(__dirname, '../public/plants');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const plants = [
  { scientific: 'Betula pendula', common: 'Silver Birch', type: 'tree' },
  { scientific: 'Viburnum tinus', common: 'Laurustinus', type: 'shrub' },
  { scientific: 'Fargesia murielae', common: 'Umbrella Bamboo', type: 'bamboo' },
  { scientific: "Geranium 'Rozanne'", common: 'Rozanne Cranesbill', type: 'perennial' },
  { scientific: 'Alchemilla mollis', common: "Lady's Mantle", type: 'perennial' },
  { scientific: 'Dryopteris filix-mas', common: 'Male Fern', type: 'fern' },
  { scientific: 'Ajuga reptans', common: 'Bugle', type: 'ground-cover' }
];

const views = [
  { name: 'top', description: 'overhead view, looking down from above' },
  { name: 'front', description: 'front elevation view' },
  { name: 'foliage', description: 'foliage closeup detail' }
];

// Single maturity level - 3 years established
const maturity = { years: 3, description: 'established, mid-maturity' };

async function generateImage(prompt, outputPath) {
  console.log(`Generating: ${outputPath}`);
  console.log(`Prompt: ${prompt}`);

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

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', async () => {
        try {
          const response = JSON.parse(data);

          if (response.data && response.data[0] && response.data[0].url) {
            const imageUrl = response.data[0].url;

            // Download the image
            await downloadImage(imageUrl, outputPath);
            console.log(`✓ Saved: ${outputPath}\n`);
            resolve(outputPath);
          } else {
            reject(new Error(`No image URL in response: ${data}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(requestData);
    req.end();
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

function createPrompt(plant, view) {
  // Different prompt styles for different views
  if (view.name === 'top') {
    // Top-down view for planting plans - single canopy only
    return `Overhead plan view: ${plant.scientific} (${plant.common}) canopy only, centered composition, ${maturity.description}.
Single circular or organic canopy shape viewed from directly above showing foliage pattern.
Pure white background (255,255,255), no trunk visible, no ground, zero shadows, no depth, completely flat 2D illustration.
Centered in frame. Clean cutout for landscape plans. Photorealistic foliage for ${plant.type} at ${maturity.years} years, like a satellite view of tree crown.`;
  } else if (view.name === 'foliage') {
    // Foliage closeup - showing leaf/flower details
    return `Detailed closeup of ${plant.scientific} (${plant.common}) foliage and leaves.
Macro photography style showing leaf texture, pattern, color, and botanical details.
Isolated on pure white background, professional botanical reference image.
Photorealistic detail showing characteristic features of this ${plant.type}, suitable for plant identification and horticultural reference.`;
  } else {
    // Front view - highly photorealistic
    return `Photorealistic front view of ${plant.scientific} (${plant.common}), ${maturity.description}.
Highly detailed, photographic quality ${plant.type} showing complete plant form and structure.
Absolutely no ground plane, no shadows, completely isolated on pure white background.
Professional horticultural reference showing accurate representation at ${maturity.years} years of growth, suitable for landscape visualization.`;
  }
}

async function generateAllImages() {
  console.log('🌿 Starting plant image generation...\n');
  console.log(`Using OpenAI API key: ${OPENAI_API_KEY ? '✓ Found' : '✗ Missing'}\n`);

  if (!OPENAI_API_KEY) {
    console.error('ERROR: OPENAI_API_KEY not found in .env.local');
    process.exit(1);
  }

  for (const plant of plants) {
    const plantDir = path.join(OUTPUT_DIR, plant.scientific.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

    if (!fs.existsSync(plantDir)) {
      fs.mkdirSync(plantDir, { recursive: true });
    }

    console.log(`\n📸 Generating images for: ${plant.scientific}`);
    console.log(`   Directory: ${plantDir}\n`);

    // Generate all 3 views (top, front, foliage) for this plant
    for (const view of views) {
      const filename = `${view.name}.jpg`;
      const outputPath = path.join(plantDir, filename);

      const prompt = createPrompt(plant, view);

      try {
        await generateImage(prompt, outputPath);
      } catch (error) {
        console.error(`Error generating ${filename}:`, error.message);
      }

      // Rate limiting - wait between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n✅ Image generation complete!');
  console.log(`   Images saved to: ${OUTPUT_DIR}`);
}

// Run the script
generateAllImages().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
