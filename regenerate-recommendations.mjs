#!/usr/bin/env node

const planId = process.argv[2] || '416f217f-130a-4b8b-8813-b149dcc6163b';

console.log(`🌿 Regenerating recommendations for plan: ${planId}`);

fetch(`http://localhost:3000/api/generate-recommendations`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ planId })
})
  .then(res => res.json())
  .then(data => {
    console.log('✅ Success!');
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
  });
