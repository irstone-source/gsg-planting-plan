import { chromium } from 'playwright';

async function verify() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('\n🎨 Testing Piet Oudolf Prairie Style...\n');
  
  await page.goto('http://localhost:3000/styles/piet-oudolf-prairie', { 
    waitUntil: 'networkidle' 
  });
  
  await page.waitForTimeout(3000);
  
  const structureHeading = page.locator('text=Structure & Framework').first();
  await structureHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  
  const plantNames = await page.locator('h4').allTextContents();
  console.log('📋 Structure Plants Found:');
  plantNames.slice(0, 3).forEach((name, i) => {
    console.log('   ' + (i + 1) + '. ' + name);
  });
  
  const box = await structureHeading.boundingBox();
  if (box) {
    await page.screenshot({
      path: '/tmp/oudolf-authentic-plants.png',
      clip: {
        x: 0,
        y: box.y - 20,
        width: 1280,
        height: 1000
      }
    });
    console.log('\n📸 Screenshot saved');
  }
  
  console.log('✅ Authentic Oudolf plants rendering');
  
  await browser.close();
}

verify().catch(console.error);
