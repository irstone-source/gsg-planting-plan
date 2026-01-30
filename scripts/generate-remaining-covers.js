/**
 * Generate AI cover images for remaining example plans
 * Uses DALL-E 3 HD quality (1792×1024) for professional hero images
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
}

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('❌ Missing OPENAI_API_KEY in environment variables');
  process.exit(1);
}

// Plans that need cover images (excluding the 4 that already have them)
const remainingPlans = [
  {
    slug: 'brighton-coastal-calm-courtyard',
    title: 'Coastal Calm Courtyard',
    prompt: 'Professional garden photography: serene coastal courtyard garden in Brighton with wind-tolerant evergreen plants including Viburnum tinus, silvery lavender hedges, and coastal blues and grays palette. Salt-resistant planting with Mediterranean feel. Sandy soil with gravel mulch. Full sun, natural lighting, airy composition with white-painted walls. Photorealistic, architectural digest style, 8K detail.'
  },
  {
    slug: 'bournemouth-seaside-shelter-planting',
    title: 'Seaside Shelter Planting',
    prompt: 'Professional garden photography: strategic shelter belt planting in a Bournemouth coastal garden. Tough native shrubs including Cornus alba and Viburnum tinus creating windbreaks, with protected inner planting of lavender, echinacea, and rudbeckia. Coastal atmosphere with glimpse of sea in background. Mediterranean resilience meets British seaside. Natural lighting, windswept character, photorealistic, 8K detail.'
  },
  {
    slug: 'plymouth-sheltered-coastal-oasis',
    title: 'Sheltered Coastal Oasis',
    prompt: 'Professional garden photography: lush microclimate garden in sheltered Plymouth courtyard. Tender Mediterranean plants including agapanthus, scented lavender, and hydrangeas thriving in protected sunny corner. Blue-green coastal color palette. Sandy loam soil, container planting mixed with borders. Intimate entertaining space. Natural golden hour lighting, romantic atmosphere, photorealistic, 8K detail.'
  },
  {
    slug: 'edinburgh-scottish-wildlife-haven',
    title: 'Scottish Wildlife Haven',
    prompt: 'Professional garden photography: naturalistic Scottish wildlife garden in Edinburgh with native rowan tree as centerpiece, hedgerow shrubs, and wildflower meadow areas. Berries, seed heads, and autumn colors. Moody Scottish light, overcast sky with dramatic clouds. Hardy plants for H3 zone. Wildlife-friendly design with natural informality. Photorealistic, nature photography style, 8K detail.'
  },
  {
    slug: 'glasgow-wet-winter-proof-framework',
    title: 'Wet Winter-Proof Framework',
    prompt: 'Professional garden photography: drainage-aware Glasgow garden embracing wet conditions. Moisture-loving plants including Cornus alba with red winter stems, viburnum, ferns, and hostas. Heavy clay soil, lush growth. Evergreen year-round structure. Wet pavement reflections, dramatic Scottish weather. Resilient planting thriving in moisture. Photorealistic, moody lighting, 8K detail.'
  },
  {
    slug: 'aberdeen-very-hardy-coastal-structure',
    title: 'Very Hardy Coastal Structure',
    prompt: 'Professional garden photography: extremely tough coastal garden in Aberdeen with harsh North Sea exposure. H3-rated hardy evergreen framework of viburnum and cornus, minimal palette of echinacea and rudbeckia, tough native plants. Windswept character, salt spray resilience. Grey Scottish sky, stone walls, utilitarian beauty. Photorealistic, documentary style, 8K detail.'
  },
  {
    slug: 'inverness-highland-hardy-woodland',
    title: 'Highland Hardy Woodland',
    prompt: 'Professional garden photography: naturalistic Highland woodland garden in Inverness with silver birch canopy, rowan trees, native shrubs and ferns. H2 (-20°C) cold-tolerant plants. Acid soil, moisture-rich environment. Scottish Highland backdrop with hills. Naturalistic layers, wildlife corridor aesthetic. Soft filtered light through trees, atmospheric mist. Photorealistic, nature photography, 8K detail.'
  },
  {
    slug: 'cardiff-rain-friendly-wildlife-garden',
    title: 'Rain-Friendly Wildlife Garden',
    prompt: 'Professional garden photography: lush Welsh wildlife garden in Cardiff embracing high rainfall. Moisture-loving native plants including birch, cornus, astilbe, ligularia, and verbena. Clay loam soil, abundant growth. Pollinator paradise with butterflies and bees. Dramatic clouds and Welsh valleys in background. Rich greens and purples. Photorealistic, wildlife garden style, 8K detail.'
  },
  {
    slug: 'swansea-family-coastal-garden',
    title: 'Family Coastal Garden',
    prompt: 'Professional garden photography: robust family garden near Swansea coast with open lawn play space and tough perimeter planting. Kid and dog-proof borders with viburnum, lavender, geranium, and coastal-tolerant evergreens. Active family space with trampoline or play equipment visible. Coastal light, Welsh coastline atmosphere. Practical beauty. Photorealistic, family lifestyle photography, 8K detail.'
  },
  {
    slug: 'exeter-dry-summer-mediterranean-border',
    title: 'Dry-Summer Mediterranean Border',
    prompt: 'Professional garden photography: drought-resilient gravel garden in Exeter with Mediterranean plants. Silver-gray foliage palette featuring lavender, rosemary, agapanthus, echinacea, sedum, and thyme. Gravel mulch, terracotta pots, stone edging. Hot sunny border glowing in warm light. Devon countryside setting. Scent and texture focus. Photorealistic, garden design magazine style, 8K detail.'
  },
  {
    slug: 'bath-cotswold-stone-and-scent',
    title: 'Cotswold Stone & Scent',
    prompt: 'Professional garden photography: romantic scented garden in Bath with honey-colored Cotswold stone walls. Lavender hedging, climbing roses on stone, aromatic herbs. Soft color palette of purples, pinks, and silvers. English country garden romance meets modern restraint. Golden hour lighting on warm stone. Intimate courtyard atmosphere. Photorealistic, luxury garden design style, 8K detail.'
  }
];

/**
 * Call DALL-E 3 to generate image
 */
async function generateImage(prompt, slug) {
  console.log(`\n🎨 Generating image for: ${slug}`);
  console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);

  return new Promise((resolve, reject) => {
    const requestBody = JSON.stringify({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1792x1024',
      quality: 'hd',
      style: 'natural'
    });

    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          const response = JSON.parse(data);
          console.log(`✅ Image generated successfully`);
          resolve(response.data[0].url);
        } else {
          console.error(`❌ API Error: ${res.statusCode}`);
          console.error(data);
          reject(new Error(`API returned ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (e) => {
      console.error(`❌ Request failed: ${e.message}`);
      reject(e);
    });

    req.write(requestBody);
    req.end();
  });
}

/**
 * Download image from URL and save to disk
 */
async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, '..', 'public', 'covers', filename);
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(filepath);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`💾 Saved: ${filename} (${sizeMB} MB)`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      console.error(`❌ Download failed: ${err.message}`);
      reject(err);
    });
  });
}

/**
 * Main execution
 */
async function main() {
  console.log(`🚀 Generating ${remainingPlans.length} AI cover images for example plans\n`);
  console.log(`Using DALL-E 3 HD (1792×1024) - Professional quality`);
  console.log(`Estimated time: ~${remainingPlans.length * 30} seconds\n`);

  let successCount = 0;
  let failCount = 0;

  for (const plan of remainingPlans) {
    try {
      // Generate image
      const imageUrl = await generateImage(plan.prompt, plan.slug);

      // Download and save
      const filename = `${plan.slug}.jpg`;
      await downloadImage(imageUrl, filename);

      successCount++;
      console.log(`✓ ${successCount}/${remainingPlans.length} complete\n`);

      // Rate limiting: wait 3 seconds between requests
      if (successCount < remainingPlans.length) {
        console.log(`⏳ Waiting 3s before next generation...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error(`\n❌ Failed to generate cover for ${plan.slug}:`);
      console.error(error.message);
      failCount++;
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Generation complete!`);
  console.log(`   Success: ${successCount}/${remainingPlans.length}`);
  console.log(`   Failed: ${failCount}/${remainingPlans.length}`);
  console.log(`${'='.repeat(50)}\n`);

  if (successCount > 0) {
    console.log(`📂 Generated images saved to: public/covers/`);
  }
}

main().catch(console.error);
