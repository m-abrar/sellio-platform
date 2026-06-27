import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const SCREENSHOTS = String.raw`C:\Users\Abrar\AppData\Local\Temp\claude\d--Sellio\screenshots`;
fs.mkdirSync(SCREENSHOTS, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await ctx.newPage();

const shot = async (name) => {
  const p = path.join(SCREENSHOTS, name + '.png');
  await page.screenshot({ path: p, fullPage: false });
  console.log('Screenshot saved:', p);
};

try {
  // 1. Login page
  await page.goto('http://localhost:3003/', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(1500);
  await shot('01_login');
  console.log('URL:', page.url());
  
  const hasForm = await page.locator('input[type="email"]').isVisible().catch(() => false);
  console.log('Login form visible:', hasForm);

} catch (e) {
  console.error('Error during verification:', e.message);
}

await browser.close();
console.log('Verification complete');
