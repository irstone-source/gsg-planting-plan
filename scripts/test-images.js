#!/usr/bin/env node

/**
 * Test image generation - generates 4 sample views for one plant
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OUTPUT_DIR = path.join(__dirname, '../public/test-plants');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const testPlant = { scientific: 'Betula pendula', common: 'Silver Birch', type: 'tree' };
const testMaturity = { years: 3, description: 'established, mid-maturity' };

const views = [
  { name: 'top', description: 'overhead view, looking down from above' },
  { name: 'front', description: 'front elevation view' },
  { name: 'foliage', description: 'foliage closeup detail' }
];

async function generateImage(prompt, outputPath) {
  console.log(`Generating: ${path.basename(outputPath)}`);
  console.log(`Prompt: ${prompt}\n`);

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
            console.log(`✓ Saved: ${path.basename(outputPath)}\n`);
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

function createPrompt(plant, view, maturity) {
  if (view.name === 'top') {
    return `Overhead plan view: ${plant.scientific} (${plant.common}) canopy only, centered composition, ${maturity.description}.
Single circular or organic canopy shape viewed from directly above showing foliage pattern.
Pure white background (255,255,255), no trunk visible, no ground, zero shadows, no depth, completely flat 2D illustration.
Centered in frame. Clean cutout for landscape plans. Photorealistic foliage for ${plant.type} at ${maturity.years} years, like a satellite view of tree crown.`;
  } else if (view.name === 'foliage') {
    return `Detailed closeup of ${plant.scientific} (${plant.common}) foliage and leaves.
Macro photography style showing leaf texture, pattern, color, and botanical details.
Isolated on pure white background, professional botanical reference image.
Photorealistic detail showing characteristic features of this ${plant.type}, suitable for plant identification and horticultural reference.`;
  } else {
    return `Photorealistic front view of ${plant.scientific} (${plant.common}), ${maturity.description}.
Highly detailed, photographic quality ${plant.type} showing complete plant form and structure.
Absolutely no ground plane, no shadows, completely isolated on pure white background.
Professional horticultural reference showing accurate representation at ${maturity.years} years of growth, suitable for landscape visualization.`;
  }
}

async function generateTestImages() {
  console.log('🌿 Generating test images for Silver Birch...\n');
  console.log(`Using OpenAI API key: ${OPENAI_API_KEY ? '✓ Found' : '✗ Missing'}\n`);

  if (!OPENAI_API_KEY) {
    console.error('ERROR: OPENAI_API_KEY not found in .env.local');
    process.exit(1);
  }

  for (const view of views) {
    const filename = `${view.name}.jpg`;
    const outputPath = path.join(OUTPUT_DIR, filename);
    const prompt = createPrompt(testPlant, view, testMaturity);

    try {
      await generateImage(prompt, outputPath);
    } catch (error) {
      console.error(`Error generating ${filename}:`, error.message);
    }

    // Delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n✅ Test image generation complete!');
  console.log(`   Images saved to: ${OUTPUT_DIR}`);
}

// Run the script
generateTestImages().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
