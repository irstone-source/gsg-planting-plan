#!/usr/bin/env node

/**
 * Comprehensive Pre-Launch QA Testing
 * Tests all critical user flows and functionality
 */

import { chromium } from 'playwright';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

console.log('🧪 PlantingPlans Comprehensive QA Test Suite\n');
console.log(`Testing: ${BASE_URL}\n`);

const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  errors: []
};

async function test(name, fn) {
  try {
    await fn();
    console.log(`✅ ${name}`);
    results.passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    results.failed++;
    results.errors.push({ test: name, error: error.message });
  }
}

async function runQA() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  const page = await context.newPage();

  // Track console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  console.log('📋 Section 1: Core Pages Load\n');

  await test('Homepage loads', async () => {
    const response = await page.goto(BASE_URL);
    if (response.status() !== 200) throw new Error(`Status: ${response.status()}`);
    await page.waitForSelector('h1', { timeout: 5000 });
  });

  await test('/create page loads', async () => {
    const response = await page.goto(`${BASE_URL}/create`);
    if (response.status() !== 200) throw new Error(`Status: ${response.status()}`);
  });

  await test('/pricing page loads', async () => {
    const response = await page.goto(`${BASE_URL}/pricing`);
    if (response.status() !== 200) throw new Error(`Status: ${response.status()}`);
  });

  await test('/styles gallery page loads', async () => {
    const response = await page.goto(`${BASE_URL}/styles`);
    if (response.status() !== 200) throw new Error(`Status: ${response.status()}`);
    await page.waitForSelector('h1', { timeout: 5000 });
  });

  await test('/designers page loads', async () => {
    const response = await page.goto(`${BASE_URL}/designers`);
    if (response.status() !== 200) throw new Error(`Status: ${response.status()}`);
  });

  await test('/partners page loads', async () => {
    const response = await page.goto(`${BASE_URL}/partners`);
    if (response.status() !== 200) throw new Error(`Status: ${response.status()}`);
  });

  await test('/affiliate page loads', async () => {
    const response = await page.goto(`${BASE_URL}/affiliate`);
    if (response.status() !== 200) throw new Error(`Status: ${response.status()}`);
  });

  console.log('\n📋 Section 2: Designer Style Pages\n');

  const styleSlugs = [
    'piet-oudolf-prairie',
    'chelsea-wildlife-haven',
    'dan-pearson-meadow',
    'monty-don-cottage',
    'chelsea-2023-gold-modern',
    'chelsea-urban-retreat',
    'sissinghurst-white-garden',
    'great-dixter-exotic',
    'gardeners-world-family-garden'
  ];

  for (const slug of styleSlugs) {
    await test(`/styles/${slug} loads`, async () => {
      const response = await page.goto(`${BASE_URL}/styles/${slug}`);
      if (response.status() !== 200) throw new Error(`Status: ${response.status()}`);

      // Check for key elements
      await page.waitForSelector('h1', { timeout: 5000 });

      // Check plant palette section exists
      const hasPlantSection = await page.locator('text=/Sample Planting Palette|Planting Palette/i').count();
      if (hasPlantSection === 0) throw new Error('Plant palette section not found');

      // Check CTA button exists
      const hasCTA = await page.locator('text=/Create My Custom Plan/i').count();
      if (hasCTA === 0) throw new Error('CTA button not found');
    });
  }

  console.log('\n📋 Section 3: Philosophy Content\n');

  // Test philosophy content displays
  await test('Dan Pearson philosophy displays', async () => {
    await page.goto(`${BASE_URL}/styles/dan-pearson-meadow`);
    await page.waitForLoadState('networkidle');

    const philosophySection = await page.locator('text=/Design Philosophy|Key Principles/i').count();
    if (philosophySection === 0) throw new Error('Philosophy section not found');
  });

  await test('Piet Oudolf philosophy displays', async () => {
    await page.goto(`${BASE_URL}/styles/piet-oudolf-prairie`);
    await page.waitForLoadState('networkidle');

    const philosophySection = await page.locator('text=/Design Philosophy|Key Principles/i').count();
    if (philosophySection === 0) throw new Error('Philosophy section not found');
  });

  console.log('\n📋 Section 4: SEO & Metadata\n');

  await test('Sitemap exists', async () => {
    const response = await page.goto(`${BASE_URL}/sitemap.xml`);
    if (response.status() !== 200) throw new Error(`Status: ${response.status()}`);
    const content = await page.content();
    if (!content.includes('urlset')) throw new Error('Invalid sitemap format');
    if (!content.includes('/styles/')) throw new Error('Styles not in sitemap');
  });

  await test('Robots.txt exists', async () => {
    const response = await page.goto(`${BASE_URL}/robots.txt`);
    if (response.status() !== 200) throw new Error(`Status: ${response.status()}`);
    const content = await page.content();
    // Check for valid robots.txt content (either plain text or JSON response)
    const hasRobotsContent = content.includes('User-agent') || content.includes('userAgent') || content.includes('sitemap');
    if (!hasRobotsContent) throw new Error('Invalid robots.txt format');
  });

  await test('Homepage has Open Graph tags', async () => {
    await page.goto(BASE_URL);
    const ogTitle = await page.locator('meta[property="og:title"]').count();
    const ogDescription = await page.locator('meta[property="og:description"]').count();
    if (ogTitle === 0 || ogDescription === 0) {
      throw new Error('Missing Open Graph tags');
    }
  });

  await test('Style pages have proper metadata', async () => {
    await page.goto(`${BASE_URL}/styles/dan-pearson-meadow`);
    const title = await page.title();
    if (!title.includes('Dan Pearson') && !title.includes('Meadow')) {
      throw new Error('Page title not set correctly');
    }
  });

  console.log('\n📋 Section 5: Responsive Design\n');

  await test('Homepage mobile responsive', async () => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await page.waitForSelector('h1', { timeout: 5000 });

    // Check for mobile menu or navigation
    const hasNav = await page.locator('nav, header').count();
    if (hasNav === 0) throw new Error('No navigation found');
  });

  await test('Style page mobile responsive', async () => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/styles/piet-oudolf-prairie`);
    await page.waitForSelector('h1', { timeout: 5000 });
  });

  // Reset viewport
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('\n📋 Section 6: Console Errors\n');

  await test('No critical console errors', async () => {
    // Check accumulated console errors, filtering out expected/non-critical errors
    const criticalErrors = consoleErrors.filter(err =>
      !err.includes('favicon') &&
      !err.includes('404') &&
      !err.includes('Analytics') &&
      !err.includes('429') &&  // Rate limit errors from external APIs (expected)
      !err.includes('Too Many Requests') &&
      !err.includes('net::ERR_') // Network errors from external resources
    );

    if (criticalErrors.length > 0) {
      throw new Error(`Found ${criticalErrors.length} console errors: ${criticalErrors[0]}`);
    }
  });

  console.log('\n📋 Section 7: API Endpoints\n');

  await test('Planting plan API responds', async () => {
    const response = await page.goto(`${BASE_URL}/api/v1/planting-plan`);
    if (response.status() !== 200) throw new Error(`Status: ${response.status()}`);
    const body = await response.json();
    if (!body.available_styles) throw new Error('Invalid API response');
    if (body.available_styles.length === 0) throw new Error('No styles returned');
  });

  await browser.close();

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 QA Test Summary\n');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⚠️  Warnings: ${results.warnings}`);
  console.log('='.repeat(60));

  if (results.failed > 0) {
    console.log('\n❌ Failed Tests:\n');
    results.errors.forEach(({ test, error }) => {
      console.log(`  • ${test}`);
      console.log(`    ${error}\n`);
    });
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed! Ready for production.\n');
    process.exit(0);
  }
}

runQA().catch(error => {
  console.error('\n❌ QA suite crashed:', error);
  process.exit(1);
});
