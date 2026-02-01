#!/usr/bin/env node

const planId = process.argv[2] || '416f217f-130a-4b8b-8813-b149dcc6163b';
const limit = process.argv[3] ? parseInt(process.argv[3]) : undefined;

console.log(`🎨 Generating plant images for plan: ${planId}`);
if (limit) {
  console.log(`📊 Limiting to first ${limit} plants\n`);
} else {
  console.log(`📊 Generating ALL plants\n`);
}
console.log('⏱️  This will take 1-2 minutes per plant...\n');

fetch(`http://localhost:3000/api/generate-plant-images`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ planId, limit })
})
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log('\n✅ Image generation complete!\n');
      console.log(`📊 Summary:`);
      console.log(`   Total plants: ${data.summary.total}`);
      console.log(`   ✅ Success: ${data.summary.success}`);
      console.log(`   ❌ Errors: ${data.summary.errors}\n`);

      console.log('🖼️  Generated images:');
      data.results.forEach((result, idx) => {
        if (result.success) {
          console.log(`   ${idx + 1}. ✅ ${result.botanical_name}`);
        } else {
          console.log(`   ${idx + 1}. ❌ ${result.botanical_name}: ${result.error}`);
        }
      });

      console.log('\n🔄 Refresh your browser to see the images!');
    } else {
      console.error('\n❌ Failed:', data.error);
    }
  })
  .catch(err => {
    console.error('\n❌ Error:', err.message);
  });
