import { chromium } from 'playwright';

async function verify() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/styles/chelsea-2023-gold-modern', { 
    waitUntil: 'networkidle' 
  });
  
  await page.waitForTimeout(3000);
  
  const structureHeading = page.locator('text=Structure & Framework').first();
  await structureHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  
  const box = await structureHeading.boundingBox();
  if (box) {
    await page.screenshot({
      path: '/tmp/plants-now-unique.png',
      clip: {
        x: 0,
        y: box.y - 20,
        width: 1280,
        height: 900
      }
    });
    console.log('Screenshot saved');
  }
  
  await browser.close();
}

verify().catch(console.error);
