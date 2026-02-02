import { chromium } from 'playwright';

async function checkPlantSection() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/styles/chelsea-2023-gold-modern', { 
    waitUntil: 'networkidle' 
  });
  
  // Wait for content
  await page.waitForTimeout(2000);
  
  // Find the plant palette section
  const plantPaletteHeading = await page.locator('text=Sample Planting Palette').first();
  
  if (await plantPaletteHeading.isVisible()) {
    console.log('✅ Plant Palette section found');
    
    // Scroll to it
    await plantPaletteHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Take screenshot of just this section
    const box = await plantPaletteHeading.boundingBox();
    if (box) {
      await page.screenshot({ 
        path: '/tmp/plant-palette-section.png',
        clip: {
          x: 0,
          y: box.y - 50,
          width: 1280,
          height: 1500
        }
      });
      console.log('📸 Screenshot saved');
    }
    
    // Check for structure section
    const structureHeading = await page.locator('text=Structure & Framework').first();
    if (await structureHeading.isVisible()) {
      console.log('✅ Structure & Framework section found');
      
      // Count cards in structure section
      const structureSection = await structureHeading.locator('..').locator('..');
      const cards = await structureSection.locator('div[class*="border"]').count();
      console.log(`  Found ${cards} plant cards in structure section`);
    }
    
    // Check for seasonal section
    const seasonalHeading = await page.locator('text=Seasonal Interest').first();
    if (await seasonalHeading.isVisible()) {
      console.log('✅ Seasonal Interest section found');
    }
    
    // Check for ground cover section
    const groundCoverHeading = await page.locator('text=Ground Cover').first();
    if (await groundCoverHeading.isVisible()) {
      console.log('✅ Ground Cover & Fillers section found');
    }
    
  } else {
    console.log('❌ Plant Palette section NOT found');
  }
  
  await browser.close();
}

checkPlantSection().catch(console.error);
