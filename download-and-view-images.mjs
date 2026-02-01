#!/usr/bin/env node
import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import { pipeline } from 'stream/promises';
import { exec } from 'child_process';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new pg.Client({
  connectionString: process.env.POSTGRES_URL_NON_POOLING.replace('?sslmode=require', ''),
  ssl: { rejectUnauthorized: false }
});

async function downloadAndView() {
  try {
    await client.connect();

    // Get image URLs
    const { rows } = await client.query(`
      SELECT botanical_name, common_name, generated_image_url
      FROM plants
      WHERE generated_image_url IS NOT NULL
      ORDER BY botanical_name
    `);

    console.log(`📥 Downloading ${rows.length} images...\n`);

    // Create directory
    await mkdir('generated-images', { recursive: true });

    const files = [];

    for (const row of rows) {
      const filename = row.botanical_name.toLowerCase().replace(/\s+/g, '-');
      const filepath = `generated-images/${filename}.png`;

      console.log(`⬇️  ${row.botanical_name}...`);

      const response = await fetch(row.generated_image_url);
      const fileStream = createWriteStream(filepath);
      await pipeline(response.body, fileStream);

      console.log(`   ✅ Saved: ${filepath}`);
      files.push(filepath);
    }

    console.log(`\n✅ Downloaded ${files.length} images\n`);
    console.log('🖼️  Opening in Preview...\n');

    // Open all images in Preview
    exec(`open -a Preview ${files.join(' ')}`, (error) => {
      if (error) {
        console.error('Error opening Preview:', error.message);
      } else {
        console.log('✅ Images opened in Preview!');
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

downloadAndView();
