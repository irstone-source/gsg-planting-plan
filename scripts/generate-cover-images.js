#!/usr/bin/env node

/**
 * Generate AI cover images for example plans and headers
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OUTPUT_DIR = path.join(__dirname, '../public/covers');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const coverImages = [
  {
    slug: 'london-contemporary-urban-oasis',
    prompt: `Professional garden design photograph of a contemporary London urban garden oasis. Modern minimalist design with silver birch trees, structured shrubs, ornamental grasses, and clean geometric paving. Soft natural lighting, lush green foliage, sophisticated color palette. Photorealistic architectural garden photography style, high-end landscape design magazine quality.`
  },
  {
    slug: 'liverpool-courtyard-jungle',
    prompt: `Professional garden design photograph of a lush courtyard jungle garden in Liverpool. Dense tropical-style planting with large-leaved plants, bamboo, ferns creating a private green sanctuary. Dappled shade, rich textures, layered planting. Photorealistic architectural garden photography style, high-end landscape design magazine quality.`
  },
  {
    slug: 'birmingham-small-space-big-impact',
    prompt: `Professional garden design photograph of a small Birmingham urban garden with maximum impact. Clever use of space with vertical planting, compact shrubs, colorful perennials in raised beds. Smart contemporary design. Photorealistic architectural garden photography style, high-end landscape design magazine quality.`
  },
  {
    slug: 'edinburgh-wildlife-haven',
    prompt: `Professional garden design photograph of a Scottish wildlife garden in Edinburgh. Native plantings with wildflowers, pollinator-friendly borders, naturalistic style with ornamental grasses. Birds and butterflies welcome. Soft Scottish light, natural colors. Photorealistic architectural garden photography style, high-end landscape design magazine quality.`
  },
  {
    slug: 'hero-create-plan',
    prompt: `Professional garden design photograph showing a beautiful blank garden canvas with measuring tape, design plans, and plant catalog. Inspiring garden transformation concept. Soft natural lighting, professional landscape designer's workspace. Photorealistic architectural garden photography style, high-end landscape design magazine quality.`
  }
];

async function generateImage(prompt, outputPath) {
  console.log(`\nGenerating: ${path.basename(outputPath)}`);

  return new Promise((resolve, reject) => {
    const requestData = JSON.stringify({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1792x1024",
      response_format: "url",
      quality: "hd",
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
            console.log(`✓ Saved`);
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

async function generateAll() {
  console.log('🎨 Generating cover images for example plans...\n');

  for (const cover of coverImages) {
    const outputPath = path.join(OUTPUT_DIR, `${cover.slug}.jpg`);

    try {
      await generateImage(cover.prompt, outputPath);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n✅ Cover image generation complete!');
}

generateAll().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
