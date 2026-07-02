import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve(import.meta.dirname, '..', '..');
const documentRoot = path.join(root, 'introduction');
const outputDir = path.join(documentRoot, 'listing-description', 'exports');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 8765;
const pageUrl = `http://127.0.0.1:${port}/listing-description/index.php`;

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const slug = (value) => value
  .toLowerCase()
  .replace(/&/g, 'and')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

async function waitForPage(attempts = 60) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(pageUrl);
      if (response.ok) return;
    } catch {}
    await delay(200);
  }
  throw new Error(`Timed out waiting for ${pageUrl}`);
}

await mkdir(outputDir, { recursive: true });

const php = spawn('php', ['-S', `127.0.0.1:${port}`, '-t', documentRoot], {
  cwd: root,
  windowsHide: true,
  stdio: 'ignore',
});

let browser;
try {
  await waitForPage();
  browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 615, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

  await page.evaluate(async () => {
    await Promise.race([
      document.fonts.ready,
      new Promise((resolve) => setTimeout(resolve, 2500)),
    ]);
    document.querySelectorAll('img').forEach((image) => { image.loading = 'eager'; });
    await Promise.race([
      Promise.all(Array.from(document.images).map((image) => image.complete
        ? Promise.resolve()
        : new Promise((resolve) => { image.onload = image.onerror = resolve; }))),
      new Promise((resolve) => setTimeout(resolve, 3000)),
    ]);
  });

  const sectionTargets = [
    ['01-cover', '.cover'],
    ['02-foundation', '#foundation'],
    ['03-storefronts', '#storefronts'],
    ['04-marketplace-modules', '#modules'],
    ['05-connected-workflows', '#workflows'],
    ['06-technology', '#technology'],
    ['07-installation', '#installation'],
    ['08-connected-roles', '.section.roles'],
    ['09-product-facts', '.section.truth'],
    ['10-final-cta', '.foot'],
  ];

  const manifest = [];
  async function capture(name, selector, type, href = null, title = name) {
    const locator = page.locator(selector).first();
    await locator.scrollIntoViewIfNeeded();
    const box = await locator.boundingBox();
    if (!box) throw new Error(`Unable to capture ${selector}`);
    const filename = `${name}.png`;
    await locator.screenshot({ path: path.join(outputDir, filename), animations: 'disabled' });
    manifest.push({
      file: filename,
      type,
      title,
      href,
      width: Math.round(box.width),
      height: Math.round(box.height),
    });
  }

  for (const [name, selector] of sectionTargets) {
    await capture(name, selector, 'section');
  }

  const linkedGroups = ['explore', 'preview', 'access', 'platforms', 'offers'];
  for (const sectionId of linkedGroups) {
    const section = page.locator(`#${sectionId}`);
    const cards = section.locator('.cards');
    const hasHeading = await section.locator('h2').count();

    if (hasHeading) {
      await cards.evaluate((element) => { element.dataset.exportDisplay = element.style.display; element.style.display = 'none'; });
      await capture(`${sectionId}-heading`, `#${sectionId}`, 'heading');
      await cards.evaluate((element) => { element.style.display = element.dataset.exportDisplay || ''; delete element.dataset.exportDisplay; });
    }

    const linkedCards = section.locator('a.card');
    const cardCount = await linkedCards.count();
    for (let index = 0; index < cardCount; index += 1) {
      const card = linkedCards.nth(index);
      const title = (await card.locator('b').first().innerText()).trim();
      const href = await card.getAttribute('href');
      const exportId = `export-${sectionId}-${index + 1}`;
      await card.evaluate((element, id) => { element.dataset.exportId = id; }, exportId);
      await capture(
        `${sectionId}-card-${slug(title)}`,
        `[data-export-id="${exportId}"]`,
        'linked-card',
        href || null,
        title,
      );
    }
  }

  await writeFile(
    path.join(outputDir, 'manifest.json'),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), source: pageUrl, exports: manifest }, null, 2)}\n`,
  );

  console.log(`Exported ${manifest.length} PNG files to ${outputDir}`);
  console.log(`Linked card images: ${manifest.filter((item) => item.type === 'linked-card').length}`);
} finally {
  await browser?.close();
  php.kill();
}
