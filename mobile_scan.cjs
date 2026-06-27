const { chromium } = require('playwright');
const path = require('path');

const OUT = 'C:/Users/Abrar/AppData/Local/Temp/claude/d--Sellio/screenshots/mobile';
const BASE = 'http://localhost:3003';
const TOKEN_KEY = 'sellio_buyer_access_token';

const VIEWPORTS = [
  { name: 'sm', width: 375, height: 812 },   // iPhone SE / standard
  { name: 'md', width: 768, height: 1024 },  // iPad portrait
];

const PAGES = [
  { path: '/',              slug: 'dashboard' },
  { path: '/favorites',     slug: 'favorites' },
  { path: '/bookings',      slug: 'bookings' },
  { path: '/messages',      slug: 'messages' },
  { path: '/job-applications', slug: 'job_applications' },
  { path: '/auto-inquiries',   slug: 'auto_inquiries' },
  { path: '/appointments',     slug: 'appointments' },
  { path: '/service-quotes',   slug: 'service_quotes' },
  { path: '/classified-ads',   slug: 'classified_ads' },
  { path: '/reviews',      slug: 'reviews' },
  { path: '/settings',     slug: 'settings' },
  { path: '/notifications', slug: 'notifications' },
];

async function waitLoaded(page) {
  await page.waitForFunction(
    () => !document.body.innerText.includes('LOADING YOUR PORTAL'),
    { timeout: 15000 }
  );
  await page.waitForTimeout(1800);
}

async function shot(page, filename) {
  await page.screenshot({ path: `${OUT}/${filename}`, fullPage: true });
  console.log('  saved', filename);
}

async function main() {
  const fs = require('fs');
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  for (const vp of VIEWPORTS) {
    console.log(`\n=== Viewport ${vp.name} (${vp.width}x${vp.height}) ===`);
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();

    // Login once per viewport
    console.log('Logging in...');
    await page.goto(`${BASE}/`);
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.fill('input[type="email"]', 'buyer@sellio-platform.test');
    await page.fill('input[type="password"]', 'buyer123');
    await page.click('button[type="submit"]');
    await page.waitForFunction((k) => !!localStorage.getItem(k), TOKEN_KEY, { timeout: 15000 });
    console.log('Logged in');

    for (const pg of PAGES) {
      console.log(`→ ${pg.path}`);
      await page.goto(`${BASE}${pg.path}`);
      await waitLoaded(page);
      await shot(page, `${vp.name}_${pg.slug}.png`);
    }

    await ctx.close();
  }

  await browser.close();
  console.log('\nDone. All screenshots in:', OUT);
}

main().catch((e) => { console.error(e); process.exit(1); });
