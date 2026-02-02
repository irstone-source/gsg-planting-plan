import { chromium } from 'playwright';

async function takeScreenshot() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/styles/chelsea-2023-gold-modern', { 
    waitUntil: 'networkidle' 
  });
  
  // Wait for content to load
  await page.waitForTimeout(2000);
  
  // Take full page screenshot
  await page.screenshot({ 
    path: '/tmp/style-page-test.png',
    fullPage: true 
  });
  
  // Count plant-related elements
  const plantCards = await page.locator('[class*="border"]').count();
  const scientificNames = await page.locator('text=/^[A-Z][a-z]+ [a-z]+$/').count();
  
  console.log(`Found ${plantCards} bordered cards`);
  console.log(`Found ${scientificNames} scientific names`);
  
  await browser.close();
}

takeScreenshot().catch(console.error);
