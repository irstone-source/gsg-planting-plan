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

async function downloadLatest() {
  try {
    await client.connect();

    // Get plants with both image views
    const { rows } = await client.query(`
      SELECT
        botanical_name,
        common_name,
        front_view_image_url,
        top_down_image_url
      FROM plants
      WHERE front_view_image_url IS NOT NULL
         OR top_down_image_url IS NOT NULL
      ORDER BY botanical_name
    `);

    console.log(`📥 Downloading ${rows.length} plants (multiple views)...\n`);

    // Create directory
    await mkdir('plant-views', { recursive: true });

    const files = [];

    for (const row of rows) {
      const safeName = row.botanical_name.toLowerCase().replace(/\s+/g, '-');

      // Download front view if available
      if (row.front_view_image_url) {
        const frontPath = `plant-views/${safeName}-front.png`;
        console.log(`⬇️  ${row.botanical_name} (front view)...`);

        const response = await fetch(row.front_view_image_url);
        const fileStream = createWriteStream(frontPath);
        await pipeline(response.body, fileStream);

        console.log(`   ✅ Saved: ${frontPath}`);
        files.push(frontPath);
      }

      // Download top-down view if available
      if (row.top_down_image_url) {
        const topPath = `plant-views/${safeName}-topdown.png`;
        console.log(`⬇️  ${row.botanical_name} (top-down view)...`);

        const response = await fetch(row.top_down_image_url);
        const fileStream = createWriteStream(topPath);
        await pipeline(response.body, fileStream);

        console.log(`   ✅ Saved: ${topPath}`);
        files.push(topPath);
      }

      console.log('');
    }

    console.log(`✅ Downloaded ${files.length} images\n`);
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

downloadLatest();
