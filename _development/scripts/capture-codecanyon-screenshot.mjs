import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('../../apps/backend/node_modules/playwright');

const [url, outputName] = process.argv.slice(2);

if (!url || !outputName) {
  console.error('Usage: node capture-codecanyon-screenshot.mjs <url> <filename.png>');
  process.exit(1);
}

const outputDir = path.resolve('_development/screenshots/codecanyon');
const outputPath = path.join(outputDir, path.basename(outputName));

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 1,
});

const pageErrors = [];
page.on('pageerror', (error) => pageErrors.push(error.message));

try {
  const response = await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 90_000,
  });

  if (!response?.ok()) {
    throw new Error(`Page returned HTTP ${response?.status() ?? 'unknown'}`);
  }

  await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2_000);

  await page.screenshot({
    path: outputPath,
    animations: 'disabled',
    fullPage: false,
  });

  console.log(JSON.stringify({
    outputPath,
    title: await page.title(),
    url: page.url(),
    pageErrors,
  }, null, 2));
} finally {
  await browser.close();
}
