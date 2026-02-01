#!/usr/bin/env node

/**
 * Database Setup Script - Direct PostgreSQL Connection
 * Runs schema and RLS migrations on Supabase
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

const connectionString = process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  console.error('❌ Missing POSTGRES_URL_NON_POOLING in .env.local');
  process.exit(1);
}

console.log('🔧 Connecting to Supabase PostgreSQL...\n');

// Parse the connection string to handle SSL properly
const client = new pg.Client({
  connectionString: connectionString.replace('?sslmode=require', ''),
  ssl: {
    rejectUnauthorized: false
  }
});

async function runSQL(sqlFilePath, description) {
  console.log(`📝 ${description}`);
  console.log(`📄 File: ${sqlFilePath}\n`);

  try {
    const sql = readFileSync(sqlFilePath, 'utf8');
    await client.query(sql);
    console.log('✅ Success!\n');
  } catch (err) {
    console.error(`❌ Error: ${err.message}\n`);
    // Don't throw - some errors are expected (e.g., "already exists")
    if (err.message.includes('already exists')) {
      console.log('ℹ️  Some objects already exist - this is normal\n');
    } else {
      throw err;
    }
  }
}

async function main() {
  try {
    await client.connect();
    console.log('✅ Connected!\n');

    // Step 1: Run main schema
    await runSQL(
      join(__dirname, '../supabase-schema.sql'),
      '📊 Creating database schema (tables, indexes, functions)'
    );

    // Step 2: Run RLS policies
    await runSQL(
      join(__dirname, '../fix-rls-policies.sql'),
      '🔒 Applying Row Level Security policies'
    );

    console.log('🎉 Database setup complete!\n');
    console.log('Next steps:');
    console.log('  1. Run: npm run dev');
    console.log('  2. Visit: http://localhost:3000');
    console.log('  3. Test the planting plan form\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\nManual setup option:');
    console.error('  1. Go to: https://supabase.com/dashboard/project/qeliskdyzlclgtabkome');
    console.error('  2. Click: SQL Editor → New query');
    console.error('  3. Paste: supabase-schema.sql contents → Run');
    console.error('  4. New query → Paste: fix-rls-policies.sql → Run\n');
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
