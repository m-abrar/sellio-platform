import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const TOKEN = '3|sellio_N4Cqp3JH4ko3g1auFIDdOKq83eVBl4Rt0yeEgOSj32921a05';
const SCREENSHOTS = String.raw`C:\Users\Abrar\AppData\Local\Temp\claude\d--Sellio\screenshots`;
fs.mkdirSync(SCREENSHOTS, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await ctx.newPage();

const shot = async (name) => {
  const p = path.join(SCREENSHOTS, name + '.png');
  await page.screenshot({ path: p, fullPage: false });
  console.log('Shot:', name);
};

// Set auth token directly in localStorage
await ctx.addInitScript((token) => {
  localStorage.setItem('sellio_buyer_access_token', token);
}, TOKEN);

try {
  // 1. Dashboard
  await page.goto('http://localhost:3003/', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(2500);
  await shot('02_dashboard');
  console.log('Dashboard URL:', page.url());

  // Check if sidebar is present
  const sidebarVisible = await page.locator('aside').isVisible().catch(() => false);
  console.log('Sidebar visible:', sidebarVisible);

  // Check for welcome banner (dark card)
  const welcomeBanner = await page.locator('text=Good').isVisible().catch(() => false);
  console.log('Welcome greeting visible:', welcomeBanner);

  // Check stat cards
  const statCards = await page.locator('.stat-card').count().catch(() => 0);
  console.log('Stat cards count:', statCards);

  // 2. Mobile view
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  await shot('03_dashboard_mobile');

  // 3. Back to desktop — click Favorites
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.goto('http://localhost:3003/favorites', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);
  await shot('04_favorites');

  // 4. Bookings / Activity
  await page.goto('http://localhost:3003/bookings', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);
  await shot('05_bookings');

  // 5. Settings
  await page.goto('http://localhost:3003/settings', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);
  await shot('06_settings');

  // 6. Notifications
  await page.goto('http://localhost:3003/notifications', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);
  await shot('07_notifications');

  // 7. Reviews
  await page.goto('http://localhost:3003/reviews', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);
  await shot('08_reviews');

  // 8. Messages
  await page.goto('http://localhost:3003/messages', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2500);
  await shot('09_messages');

  // 9. Dashboard full page
  await page.goto('http://localhost:3003/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(SCREENSHOTS, '10_dashboard_full.png'), fullPage: true });
  console.log('Shot: 10_dashboard_full');

} catch (e) {
  console.error('Error:', e.message);
  await shot('error_state');
}

await browser.close();
console.log('All done');
