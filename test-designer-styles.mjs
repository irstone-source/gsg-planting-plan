import { chromium } from 'playwright';

async function testDesignerStyles() {
  console.log('🎭 Starting Playwright tests for Designer Styles...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Collect console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  const results = {
    passed: [],
    failed: [],
    consoleErrors: []
  };

  // Test 1: Styles Gallery Page
  console.log('📋 Test 1: Styles Gallery Page');
  try {
    await page.goto('http://localhost:3000/styles', { waitUntil: 'networkidle' });

    const title = await page.textContent('h1');
    if (title.includes('DESIGNER GARDEN STYLES')) {
      console.log('  ✅ Gallery page loads');
      console.log('  ✅ Title displays correctly');
      results.passed.push('Gallery page loads with correct title');
    }

    // Check for style cards
    const cards = await page.locator('a[href^="/styles/"]').count();
    console.log(`  ✅ Found ${cards} style cards`);
    results.passed.push(`${cards} style cards displayed`);

  } catch (error) {
    console.log('  ❌ Gallery page failed:', error.message);
    results.failed.push(`Gallery page: ${error.message}`);
  }

  // Test 2-10: Individual Style Pages
  const styleSlugs = [
    'chelsea-2023-gold-modern',
    'chelsea-wildlife-haven',
    'chelsea-urban-retreat',
    'piet-oudolf-prairie',
    'monty-don-cottage',
    'dan-pearson-meadow',
    'sissinghurst-white-garden',
    'great-dixter-exotic',
    'gardeners-world-family-garden'
  ];

  for (const slug of styleSlugs) {
    console.log(`\n📄 Testing: /styles/${slug}`);
    consoleErrors.length = 0; // Reset for each page

    try {
      const response = await page.goto(`http://localhost:3000/styles/${slug}`, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Check HTTP status
      if (response.status() === 404) {
        console.log('  ❌ 404 Not Found');
        results.failed.push(`${slug}: 404 Not Found`);
        continue;
      }

      if (response.status() !== 200) {
        console.log(`  ❌ HTTP ${response.status()}`);
        results.failed.push(`${slug}: HTTP ${response.status()}`);
        continue;
      }

      console.log('  ✅ Page loads (200 OK)');

      // Check for key sections
      const hasTitle = await page.locator('h1').count() > 0;
      const hasDescription = await page.locator('text=/planting|garden|style/i').count() > 0;
      const hasAttribution = await page.locator('text=/Attribution|Sources|Inspiration/i').count() > 0;
      const hasPlantPalette = await page.locator('text=/Sample Planting Palette|Structure/i').count() > 0;

      console.log(`  ${hasTitle ? '✅' : '❌'} Title present`);
      console.log(`  ${hasDescription ? '✅' : '❌'} Description present`);
      console.log(`  ${hasAttribution ? '✅' : '❌'} Attribution section present`);
      console.log(`  ${hasPlantPalette ? '✅' : '❌'} Plant palette section present`);

      // Check for plant cards
      const plantCards = await page.locator('[class*="PlantImage"]').count();
      if (plantCards > 0) {
        console.log(`  ✅ ${plantCards} plant cards found`);
      } else {
        console.log('  ⚠️  No plant cards found (might be loading)');
      }

      // Check for React key errors in console
      const keyErrors = consoleErrors.filter(err => err.includes('same key') || err.includes('duplicate'));
      if (keyErrors.length > 0) {
        console.log(`  ❌ React key errors detected:`);
        keyErrors.forEach(err => console.log(`     - ${err.substring(0, 100)}...`));
        results.failed.push(`${slug}: React key errors`);
        results.consoleErrors.push(...keyErrors);
      } else {
        console.log('  ✅ No React key errors');
      }

      // Check for params errors
      const paramsErrors = consoleErrors.filter(err => err.includes('params') || err.includes('Promise'));
      if (paramsErrors.length > 0) {
        console.log(`  ❌ Params errors detected:`);
        paramsErrors.forEach(err => console.log(`     - ${err.substring(0, 100)}...`));
        results.failed.push(`${slug}: Params errors`);
        results.consoleErrors.push(...paramsErrors);
      } else {
        console.log('  ✅ No params errors');
      }

      if (hasTitle && hasDescription && hasAttribution && keyErrors.length === 0 && paramsErrors.length === 0) {
        results.passed.push(`${slug}: All checks passed`);
      }

    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}`);
      results.failed.push(`${slug}: ${error.message}`);
    }
  }

  await browser.close();

  // Final Report
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`\n✅ Passed: ${results.passed.length}`);
  results.passed.forEach(p => console.log(`   - ${p}`));

  console.log(`\n❌ Failed: ${results.failed.length}`);
  results.failed.forEach(f => console.log(`   - ${f}`));

  if (results.consoleErrors.length > 0) {
    console.log(`\n🚨 Console Errors Found: ${results.consoleErrors.length}`);
    results.consoleErrors.slice(0, 5).forEach(e => console.log(`   - ${e.substring(0, 100)}...`));
  }

  console.log('\n' + '='.repeat(60));

  if (results.failed.length === 0 && results.consoleErrors.length === 0) {
    console.log('🎉 ALL TESTS PASSED!');
    process.exit(0);
  } else {
    console.log('⚠️  SOME TESTS FAILED - See details above');
    process.exit(1);
  }
}

testDesignerStyles().catch(error => {
  console.error('❌ Test runner crashed:', error);
  process.exit(1);
});
