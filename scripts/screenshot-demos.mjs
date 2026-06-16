import { chromium } from 'playwright';
import { writeFileSync, unlinkSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const configPath = path.join(root, 'introduction', 'config.php');
const imagesDir = path.join(root, 'introduction', 'images');
const baseUrl = 'http://127.0.0.1:3000';

// Use PHP itself to dump the $demos array as JSON so we don't reimplement the parser.
const dumpScript = `
require '${configPath.replace(/\\/g, '/')}';
echo json_encode($demos);
`;
const tmpPhp = path.join(root, 'scripts', '_dump-demos.php');
writeFileSync(tmpPhp, `<?php ${dumpScript}`);
const demos = JSON.parse(execSync(`php "${tmpPhp}"`).toString());

const onlySlug = process.argv[2];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const demo of demos) {
  if (demo.status === 'soon') continue;
  if (onlySlug && demo.slug !== onlySlug) continue;

  const imgName = path.basename(demo.img);
  const outPath = path.join(imagesDir, imgName);

  await page.context().clearCookies();
  await page.context().addCookies([
    { name: 'theme', value: demo.slug, url: baseUrl },
  ]);

  const ext = path.extname(imgName).slice(1);
  const tmpPng = outPath + '.tmp.png';

  console.log(`Capturing ${demo.slug} -> ${imgName}`);
  try {
    await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(500);

    // Hide the floating theme switcher overlay (fixed, zIndex 1000) before capturing.
    await page.evaluate(() => {
      document.querySelectorAll('div').forEach((el) => {
        const s = getComputedStyle(el);
        if (s.position === 'fixed' && s.zIndex === '1000') el.style.display = 'none';
      });
    });

    await page.screenshot({ path: tmpPng, type: 'png', fullPage: true });

    if (ext === 'webp') {
      await sharp(tmpPng).webp({ quality: 80 }).toFile(outPath);
      unlinkSync(tmpPng);
    } else {
      execSync(`mv "${tmpPng}" "${outPath}"`);
    }
  } catch (err) {
    console.error(`  FAILED ${demo.slug}: ${err.message}`);
  }
}

await browser.close();
