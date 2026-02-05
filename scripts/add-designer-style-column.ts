import { supabase } from '../src/lib/supabase';

async function addDesignerStyleColumn() {
  console.log('🔧 Adding designer_style_slug column to planting_plans table...');

  // Use raw SQL via Supabase
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: 'ALTER TABLE planting_plans ADD COLUMN IF NOT EXISTS designer_style_slug TEXT;'
  });

  if (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  console.log('✅ Column added successfully!');
  console.log('Testing with a query...');

  // Test by querying the table
  const { data: testData, error: testError } = await supabase
    .from('planting_plans')
    .select('id, designer_style_slug')
    .limit(1);

  if (testError) {
    console.error('❌ Test query failed:', testError);
  } else {
    console.log('✅ Column is accessible');
  }
}

addDesignerStyleColumn();
