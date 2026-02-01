#!/usr/bin/env node

/**
 * Database Setup Script
 * Runs the schema and RLS policy migrations on Supabase
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

console.log('🔧 Connecting to Supabase...');
console.log(`📍 Project: ${supabaseUrl}\n`);

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runSQL(sqlFilePath, description) {
  console.log(`\n📝 Running: ${description}`);
  console.log(`📄 File: ${sqlFilePath}`);

  try {
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    // Execute the SQL using Supabase's SQL function
    const { data, error } = await supabase.rpc('exec_sql', {
      query: sql
    });

    if (error) {
      // Try alternative: split and execute statements individually
      console.log('⚠️  Batch execution failed, trying statement-by-statement...');

      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      let successCount = 0;
      let errorCount = 0;

      for (const statement of statements) {
        if (statement.length < 10) continue; // Skip very short statements

        const { error: stmtError } = await supabase.rpc('exec_sql', {
          query: statement
        });

        if (stmtError) {
          console.error(`   ❌ Error: ${stmtError.message}`);
          console.error(`   📝 Statement: ${statement.substring(0, 80)}...`);
          errorCount++;
        } else {
          successCount++;
        }
      }

      console.log(`\n✅ Success: ${successCount} statements`);
      if (errorCount > 0) {
        console.log(`⚠️  Errors: ${errorCount} statements (may be expected for existing objects)`);
      }
    } else {
      console.log('✅ Success!');
    }
  } catch (err) {
    console.error(`❌ Failed: ${err.message}`);
    throw err;
  }
}

async function main() {
  try {
    // Step 1: Run main schema
    await runSQL(
      path.join(__dirname, '../supabase-schema.sql'),
      'Creating database schema (tables, indexes, functions)'
    );

    // Step 2: Run RLS policies fix
    await runSQL(
      path.join(__dirname, '../fix-rls-policies.sql'),
      'Applying Row Level Security policies'
    );

    console.log('\n🎉 Database setup complete!\n');
    console.log('Next steps:');
    console.log('  1. Run: npm run dev');
    console.log('  2. Visit: http://localhost:3000');
    console.log('  3. Test the planting plan form\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\nTry running the SQL files manually in Supabase dashboard:');
    console.error('  1. Go to: https://supabase.com/dashboard');
    console.error('  2. Click: SQL Editor');
    console.error('  3. Paste contents of: supabase-schema.sql');
    console.error('  4. Click: Run');
    console.error('  5. Repeat for: fix-rls-policies.sql\n');
    process.exit(1);
  }
}

main();
