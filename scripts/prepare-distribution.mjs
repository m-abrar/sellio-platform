#!/usr/bin/env node
/**
 * Prepare a CodeCanyon / fresh-server distribution folder from the monorepo.
 *
 * Usage:
 *   node scripts/prepare-distribution.mjs
 *   node scripts/prepare-distribution.mjs --output D:/sellio-staging
 *   node scripts/prepare-distribution.mjs --skip-build
 *   node scripts/prepare-distribution.mjs --zip
 *   node scripts/prepare-distribution.mjs --seller-only [--zip]
 */

import {
  cp,
  mkdir,
  readdir,
  readFile,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const args = process.argv.slice(2);
const skipBuild = args.includes('--skip-build');
const makeZip = args.includes('--zip');
const sellerOnly = args.includes('--seller-only');
const outputIndex = args.indexOf('--output');
const outputDir = resolve(
  outputIndex >= 0 && args[outputIndex + 1]
    ? args[outputIndex + 1]
    : join(repoRoot, sellerOnly ? 'distribution-seller' : 'distribution'),
);

function readArg(flag, envKey, fallback = '') {
  const index = args.indexOf(flag);
  if (index >= 0 && args[index + 1]) {
    return args[index + 1];
  }

  return process.env[envKey] || fallback;
}

const distributionApiUrl = readArg(
  '--api-url',
  'DISTRIBUTION_API_URL',
  'https://demo.sellio.vebdez.com/api',
).replace(/\/$/, '');

const distributionStorefrontUrl = readArg(
  '--storefront-url',
  'DISTRIBUTION_STOREFRONT_URL',
  distributionApiUrl.replace(/\/api$/, ''),
).replace(/\/$/, '');

const distributionSellerUrl = readArg(
  '--seller-url',
  'DISTRIBUTION_SELLER_URL',
  'https://seller-panel.sellio.vebdez.com',
).replace(/\/$/, '');

const distributionBuyerUrl = readArg(
  '--buyer-url',
  'DISTRIBUTION_BUYER_URL',
  'https://buyer-panel.sellio.vebdez.com',
).replace(/\/$/, '');

function portalBasePathFromUrl(url) {
  try {
    const pathname = new URL(url).pathname.replace(/\/$/, '');
    if (!pathname || pathname === '/') {
      return '';
    }

    return pathname.startsWith('/') ? pathname : `/${pathname}`;
  } catch {
    return '';
  }
}

const distributionSellerBasePath = portalBasePathFromUrl(distributionSellerUrl);
const distributionBuyerBasePath = portalBasePathFromUrl(distributionBuyerUrl);

const EXCLUDED_DIR_NAMES = new Set([
  'node_modules',
  'vendor',
  '.git',
  '.next',
  '.cursor',
  '_development',
  '.idea',
  '.vscode',
  '.fleet',
  '.nova',
  '.zed',
  '.phpunit.cache',
  'distribution',
  'test-results',
  'scratch',
]);

const EXCLUDED_FILE_NAMES = new Set([
  '.env',
  '.env.backup',
  '.env.production',
  '.env.testing',
  '.env.bak',
  'installed.lock',
  'installed.lock.bak',
  '.phpunit.result.cache',
  '.DS_Store',
  'Thumbs.db',
  'AGENTS.md',
  'CLAUDE.md',
  'tsconfig.tsbuildinfo',
  'verify_buyer.mjs',
  'verify_buyer2.mjs',
  'screenshot_phase2.cjs',
  'screenshot_phase3.cjs',
]);

const EXCLUDED_FILE_PATTERNS = [/\.zip$/i, /^\.env\./];

const INCLUDE_ROOTS = [
  'apps',
  'documentation',
  'Documentation',
  'introduction',
  'listing-description',
  'index.html',
  'CHANGELOG.md',
  'README.md',
  'LICENSE',
];

/** Dev-uploaded media — never ship; demo seed recreates files after install. */
const STORAGE_APP_PUBLIC_PREFIX = 'backend/storage/app/public';
/** Brand logo/favicon — always ship so /storage/settings/* works before seed. */
const STORAGE_SETTINGS_PREFIX = `${STORAGE_APP_PUBLIC_PREFIX}/settings`;

function isShippedStoragePublicPath(relPath) {
  const normalized = relPath.replace(/\\/g, '/');

  return (
    normalized === STORAGE_SETTINGS_PREFIX ||
    normalized.startsWith(`${STORAGE_SETTINGS_PREFIX}/`)
  );
}

function isDevUploadedMedia(relPath, name) {
  const normalized = relPath.replace(/\\/g, '/');
  if (normalized === STORAGE_APP_PUBLIC_PREFIX) {
    return false;
  }
  if (!normalized.startsWith(`${STORAGE_APP_PUBLIC_PREFIX}/`)) {
    return false;
  }
  if (isShippedStoragePublicPath(normalized)) {
    return false;
  }
  return name !== '.gitignore';
}

function isComposerVendorPath(relPath) {
  const normalized = relPath.replace(/\\/g, '/');

  return /(^|\/)backend\/vendor(\/|$)/.test(normalized);
}

function shouldExclude(relPath, isDir, name) {
  const parts = relPath.split(/[/\\]/);

  if (isComposerVendorPath(relPath)) {
    return true;
  }

  if (
    parts.some(
      (part) =>
        EXCLUDED_DIR_NAMES.has(part) &&
        !(part === 'vendor' && !isComposerVendorPath(relPath)),
    )
  ) {
    return true;
  }

  if (isDevUploadedMedia(relPath, name)) {
    return true;
  }

  if (!isDir) {
    if (EXCLUDED_FILE_NAMES.has(name)) {
      return true;
    }
    if (name === '.env.example') {
      return false;
    }
    if (EXCLUDED_FILE_PATTERNS.some((pattern) => pattern.test(name))) {
      return true;
    }
  }

  return false;
}

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function copyTree(src, dest, rel = '') {
  const current = await stat(src);

  if (current.isDirectory()) {
    await mkdir(dest, { recursive: true });
    const entries = await readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const entryRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (shouldExclude(entryRel, entry.isDirectory(), entry.name)) {
        continue;
      }
      await copyTree(join(src, entry.name), join(dest, entry.name), entryRel);
    }
    return;
  }

  await mkdir(dirname(dest), { recursive: true });
  await cp(src, dest);
}

async function runCommand(command, commandArgs, cwd) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, commandArgs, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    child.on('error', rejectPromise);
    child.on('close', (code) => {
      if (code === 0) {
        resolvePromise();
      } else {
        rejectPromise(
          new Error(`Command failed (${code}): ${command} ${commandArgs.join(' ')}`),
        );
      }
    });
  });
}

async function npmInstall(cwd) {
  try {
    await runCommand('npm', ['ci'], cwd);
  } catch {
    console.warn(`npm ci failed in ${relative(repoRoot, cwd)} — falling back to npm install`);
    await runCommand('npm', ['install'], cwd);
  }
}

async function removeIfExists(path) {
  if (await pathExists(path)) {
    await rm(path, { recursive: true, force: true });
  }
}

async function cleanBackendRuntimeArtifacts(backendRoot) {
  const removals = [
    join(backendRoot, 'installed.lock'),
    join(backendRoot, 'installed.lock.bak'),
    join(backendRoot, '.env'),
    join(backendRoot, '.env.bak'),
    join(backendRoot, '.phpunit.result.cache'),
    join(backendRoot, 'public', 'hot'),
    join(backendRoot, 'public', 'storage'),
    join(backendRoot, 'public', 'build'),
    join(backendRoot, 'bootstrap', 'cache', 'packages.php'),
    join(backendRoot, 'bootstrap', 'cache', 'services.php'),
    join(backendRoot, 'bootstrap', 'cache', 'routes-v7.php'),
    join(backendRoot, 'bootstrap', 'cache', 'events.php'),
  ];

  for (const path of removals) {
    await removeIfExists(path);
  }

  const emptyDirs = [
    join(backendRoot, 'storage', 'app', 'public'),
    join(backendRoot, 'storage', 'logs'),
    join(backendRoot, 'storage', 'framework', 'views'),
    join(backendRoot, 'storage', 'framework', 'testing'),
    join(backendRoot, 'storage', 'framework', 'sessions'),
    join(backendRoot, 'storage', 'framework', 'cache', 'data'),
  ];

  for (const dir of emptyDirs) {
    if (await pathExists(dir)) {
      const entries = await readdir(dir);
      for (const entry of entries) {
        if (entry === '.gitignore' || entry === 'settings') {
          continue;
        }
        await rm(join(dir, entry), { recursive: true, force: true });
      }
    } else {
      await mkdir(dir, { recursive: true });
    }
  }
}

async function ensureBrandSettingsInDistribution(backendRoot) {
  const destDir = join(backendRoot, 'storage', 'app', 'public', 'settings');
  await mkdir(destDir, { recursive: true });

  const sourceSettingsDir = join(
    repoRoot,
    'apps',
    'backend',
    'storage',
    'app',
    'public',
    'settings',
  );
  const seederImagesDir = join(repoRoot, 'apps', 'backend', 'database', 'seeders', 'images');

  const assetMap = [
    { destName: 'logo.png', sources: ['logo.png', 'logo.webp'] },
    { destName: 'favicon.ico', sources: ['favicon.ico'] },
  ];

  for (const asset of assetMap) {
    const destPath = join(destDir, asset.destName);
    if (await pathExists(destPath)) {
      continue;
    }

    let copied = false;

    for (const sourceName of asset.sources) {
      const fromSettings = join(sourceSettingsDir, sourceName);
      if (await pathExists(fromSettings)) {
        await cp(fromSettings, destPath);
        copied = true;
        break;
      }

      const fromSeeders = join(seederImagesDir, sourceName);
      if (await pathExists(fromSeeders)) {
        await cp(fromSeeders, destPath);
        copied = true;
        break;
      }
    }

    if (!copied) {
      console.warn(
        `Warning: brand asset missing for distribution: settings/${asset.destName}`,
      );
    }
  }

  console.log('Ensured storage/app/public/settings/ in distribution');
}

async function downloadComposerPhar(destPath) {
  const url = 'https://getcomposer.org/download/latest-stable/composer.phar';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download composer.phar (${response.status})`);
  }

  await pipeline(Readable.fromWeb(response.body), createWriteStream(destPath));
}

async function buildSellerApp() {
  const sellerRoot = join(repoRoot, 'apps', 'seller');
  await writeSellerProductionEnv();
  console.log('\n==> Building seller dashboard...');
  await npmInstall(sellerRoot);
  await runCommand('npm', ['run', 'build'], sellerRoot);
}

async function writeSellerProductionEnv() {
  const sellerRoot = join(repoRoot, 'apps', 'seller');
  const sellerEnv = `VITE_API_URL=${distributionApiUrl}\n`;
  await writeFile(join(sellerRoot, '.env.production'), sellerEnv, 'utf8');

  const sellerConfigJs = `/**
 * Sellio Partner Panel — API connection (edit after upload, no rebuild needed)
 *
 * Set apiUrl to your Laravel backend URL + /api
 * Example: https://marketplace.yourdomain.com/api
 */
window.SELLIO_CONFIG = {
  apiUrl: 'https://your-laravel-domain.com/api',
};
`;

  await mkdir(join(sellerRoot, 'public'), { recursive: true });
  await writeFile(join(sellerRoot, 'public', 'config.js'), sellerConfigJs, 'utf8');
  console.log(`Portal API URL for production build: ${distributionApiUrl}`);
  console.log('Wrote seller/public/config.js');
}

async function writePortalProductionEnv() {
  const sellerRoot = join(repoRoot, 'apps', 'seller');
  const buyerRoot = join(repoRoot, 'apps', 'buyer');

  const sellerEnv = [
    `VITE_API_URL=${distributionApiUrl}`,
    `VITE_BASE_PATH=${distributionSellerBasePath || '/'}`,
  ].join('\n') + '\n';
  const buyerEnv = [
    `VITE_API_URL=${distributionApiUrl}`,
    `VITE_STOREFRONT_URL=${distributionStorefrontUrl}`,
    `VITE_BASE_PATH=${distributionBuyerBasePath || '/'}`,
  ].join('\n') + '\n';

  await writeFile(join(sellerRoot, '.env.production'), sellerEnv, 'utf8');
  await writeFile(join(buyerRoot, '.env.production'), buyerEnv, 'utf8');

  const sellerConfigJs = `/**
 * Sellio Partner Panel — API connection (edit after upload, no rebuild needed)
 *
 * apiUrl   — Laravel backend URL + /api
 * basePath — Subfolder path when not on a dedicated subdomain (e.g. '/seller')
 */
window.SELLIO_CONFIG = {
  apiUrl: '${distributionApiUrl}',
  basePath: '${distributionSellerBasePath}',
};
`;

  const buyerConfigJs = `/**
 * Sellio Buyer Panel — API connection (edit after upload, no rebuild needed)
 *
 * apiUrl        — Laravel backend URL + /api
 * storefrontUrl — Public storefront base URL
 * basePath      — Subfolder path when not on a dedicated subdomain (e.g. '/buyer')
 */
window.SELLIO_CONFIG = {
  apiUrl: '${distributionApiUrl}',
  storefrontUrl: '${distributionStorefrontUrl}',
  basePath: '${distributionBuyerBasePath}',
};
`;

  await mkdir(join(sellerRoot, 'public'), { recursive: true });
  await mkdir(join(buyerRoot, 'public'), { recursive: true });
  await writeFile(join(sellerRoot, 'public', 'config.js'), sellerConfigJs, 'utf8');
  await writeFile(join(buyerRoot, 'public', 'config.js'), buyerConfigJs, 'utf8');

  console.log(`Portal API URL for production build: ${distributionApiUrl}`);
  console.log(`Portal storefront URL for buyer build: ${distributionStorefrontUrl}`);
  console.log('Wrote seller/public/config.js and buyer/public/config.js');
}

async function buildFrontendApps() {
  const backendRoot = join(repoRoot, 'apps', 'backend');
  const sellerRoot = join(repoRoot, 'apps', 'seller');
  const buyerRoot = join(repoRoot, 'apps', 'buyer');

  await writePortalProductionEnv();

  console.log('\n==> Building backend Vite assets...');
  await npmInstall(backendRoot);
  await runCommand('npm', ['run', 'build'], backendRoot);

  console.log('\n==> Building seller dashboard...');
  await npmInstall(sellerRoot);
  await runCommand('npm', ['run', 'build'], sellerRoot);

  console.log('\n==> Building buyer dashboard...');
  await npmInstall(buyerRoot);
  await runCommand('npm', ['run', 'build'], buyerRoot);
}

async function copySellerDistToOutput() {
  const src = join(repoRoot, 'apps', 'seller', 'dist');
  if (!(await pathExists(src))) {
    throw new Error('Seller dist missing — run build first or omit --skip-build');
  }

  await copyTree(src, outputDir);
  console.log(`Copied seller dist → ${outputDir}`);
}

async function writeSellerDeployGuide() {
  const guide = `# Sellio Partner (Seller) Panel — deploy package

Generated: ${new Date().toISOString()}
Source repo: ${repoRoot}

Upload **everything in this folder** to your seller subdomain document root
(for example \`seller.yourdomain.com\`). Files must sit next to \`index.html\`.

## 1. Configure API URL (no rebuild)

Edit \`config.js\` in this folder:

\`\`\`js
window.SELLIO_CONFIG = {
  apiUrl: 'https://your-laravel-domain.com/api',
};
\`\`\`

Save and refresh the browser.

## 2. Laravel admin (CORS)

In Laravel admin → **Settings → General**, set **Partner Portal URL** to this panel's full URL
(for example \`${distributionSellerUrl}\`). CORS updates automatically.

## 3. Client-side routing (refresh / direct URLs)

This panel uses React Router. Paths such as \`/dashboard/properties\` are handled in the browser.
The build ships \`.htaccess\` (Apache) and \`web.config\` (IIS) so refresh and bookmarked URLs
serve \`index.html\` instead of 404.

**Apache:** \`mod_rewrite\` must be enabled (default on most shared hosting).

**Nginx:** add to the seller subdomain server block:

\`\`\`nginx
location / {
  try_files $uri $uri/ /index.html;
}
\`\`\`

## 4. Demo login (after backend seed)

See \`apps/backend/README.md\` on the main site for partner demo credentials.

---
Build API URL used: \`${distributionApiUrl}\`
Expected panel URL: \`${distributionSellerUrl}\`
`;

  await writeFile(join(outputDir, 'README-DEPLOY.md'), guide, 'utf8');
}

async function writeSellerManifest() {
  const manifest = {
    generatedAt: new Date().toISOString(),
    package: 'seller-panel',
    sourceRoot: repoRoot,
    outputDir,
    skipBuild,
    sellerPanelUrl: distributionSellerUrl,
    apiUrl: distributionApiUrl,
    notes: [
      'Upload this folder contents to the seller subdomain document root only',
      'Edit config.js after upload — no rebuild required',
    ],
  };

  await writeFile(
    join(outputDir, 'DISTRIBUTION-MANIFEST.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );
}

async function runSellerOnlyDistribution() {
  console.log('Sellio seller panel distribution');
  console.log(`Source: ${repoRoot}`);
  console.log(`Output: ${outputDir}`);
  console.log(`Build: ${skipBuild ? 'no' : 'yes'}`);
  console.log(`Portal API URL: ${distributionApiUrl}`);
  console.log(`Seller panel URL: ${distributionSellerUrl}`);

  await prepareOutputDirectory();

  if (!skipBuild) {
    await buildSellerApp();
  } else {
    console.log('\n==> Skipping seller build (--skip-build)');
  }

  console.log('\n==> Copying seller dist into output folder...');
  await copySellerDistToOutput();
  await writeSellerDeployGuide();
  await writeSellerManifest();

  if (makeZip) {
    console.log('\n==> Creating ZIP archive...');
    await createZipArchive();
  }

  console.log('\nDone.');
  console.log(`Seller panel package: ${outputDir}`);
  console.log('Next: upload to seller subdomain root and edit config.js');
}

async function copyBuildArtifacts() {
  const copies = [
    [
      join(repoRoot, 'apps', 'backend', 'public', 'build'),
      join(outputDir, 'apps', 'backend', 'public', 'build'),
    ],
    [
      join(repoRoot, 'apps', 'backend', 'public', 'vendor'),
      join(outputDir, 'apps', 'backend', 'public', 'vendor'),
    ],
    [join(repoRoot, 'apps', 'seller', 'dist'), join(outputDir, 'apps', 'seller', 'dist')],
    [join(repoRoot, 'apps', 'buyer', 'dist'), join(outputDir, 'apps', 'buyer', 'dist')],
  ];

  for (const [src, dest] of copies) {
    if (!(await pathExists(src))) {
      console.warn(`Warning: build output missing, skipped: ${relative(repoRoot, src)}`);
      continue;
    }
    await removeIfExists(dest);
    await copyTree(src, dest);
    console.log(`Copied build output: ${relative(repoRoot, src)}`);
  }
}

async function writeDeployGuide() {
  const guide = `# Sellio distribution — server deploy guide

Generated: ${new Date().toISOString()}
Source repo: ${repoRoot}

## 1. Upload this entire folder

Upload the contents of this directory to your server, preserving structure.

**Web document root must be:**

\`\`\`
.../apps/backend/public
\`\`\`

## 2. Permissions

\`\`\`bash
chown -R www-data:www-data apps/backend/storage apps/backend/bootstrap/cache
chmod -R 775 apps/backend/storage apps/backend/bootstrap/cache
\`\`\`

## 3. Install (web wizard)

1. Open \`https://your-domain.com/install\`
2. Complete requirements, database, migrations, admin account, optional demo seed
3. After install:

\`\`\`bash
cd apps/backend
php artisan storage:link
\`\`\`

4. Delete or restrict \`public/install/\` on production

## 4. Install (CLI alternative)

\`\`\`bash
cd apps/backend
composer install --no-dev --optimize-autoloader
cp .env.example .env
php artisan key:generate
# edit .env with DB_* and APP_URL
php artisan migrate --seed --force
php artisan storage:link
\`\`\`

## 5. Pre-built frontend assets (required)

The Laravel storefront uses Vite. **Do not deploy backend source without compiled assets.**

Required on the main site:

- \`apps/backend/public/build/\` (includes \`manifest.json\`, CSS, JS)

If this folder is missing, pages fail with \`Vite manifest not found\`. Build locally before upload:

\`\`\`bash
cd apps/backend
npm install
npm run build
\`\`\`

Or run \`npm run prepare:distribution\` from the repo root (recommended — builds backend, seller, and buyer).

React dashboard assets:

- \`apps/seller/dist/\`
- \`apps/buyer/dist/\`

Serve them via Nginx/Apache (subdomain or subpath) and set Admin → Settings:

- Partner URL → seller app URL
- Buyer URL → buyer app URL

Set these in Admin → Settings (or seed via \`.env\` before install):

- Partner URL → \`${distributionSellerUrl}\`
- Buyer URL → \`${distributionBuyerUrl}\`

Seeder reads \`SELLER_APP_URL\` / \`BUYER_APP_URL\` from backend \`.env\` when present.

### React portals — edit \`config.js\` (no programming required)

Seller and buyer ship a small file at the root of each subdomain:

- Seller: \`config.js\` next to \`index.html\`
- Buyer: \`config.js\` next to \`index.html\`

Buyers change their domain by editing that one file in cPanel File Manager (or FTP). **No npm, no rebuild.**

\`\`\`javascript
// seller config.js
window.SELLIO_CONFIG = {
  apiUrl: 'https://your-laravel-domain.com/api',
};

// buyer config.js
window.SELLIO_CONFIG = {
  apiUrl: 'https://your-laravel-domain.com/api',
  storefrontUrl: 'https://your-laravel-domain.com',
};
\`\`\`

This distribution pre-filled those values with:

- \`apiUrl\`: \`${distributionApiUrl}\`
- \`storefrontUrl\` (buyer): \`${distributionStorefrontUrl}\`

To change domain later, edit \`config.js\` on the server and refresh the browser.

### Laravel CORS (required for cross-subdomain API calls)

Primary control: **Admin → Settings → General → Platform Ecosystem URLs** and **API CORS Origins**.

- Storefront / Partner / Customer URLs are auto-allowed for browser API calls.
- Add staging or extra hosts under **Additional CORS Origins** (one per line).

Optional \`.env\` fallback before first admin save:

\`\`\`env
APP_URL=${distributionStorefrontUrl}
STOREFRONT_URL=${distributionStorefrontUrl}
SELLER_APP_URL=${distributionSellerUrl}
BUYER_APP_URL=${distributionBuyerUrl}
\`\`\`

Without matching origins, browser requests from the React subdomains are blocked.

## 6. Hostinger / isolated subdomains

On hosts like Hostinger, each subdomain gets its **own document root** — folders are not shared between \`main\`, \`seller\`, and \`buyer\`. That is the expected setup.

**Do not upload \`packages/\` to production.** It is dev-only shared TypeScript source in the monorepo. The storefront inlines its types and API client under \`src/types/\` and \`src/lib/api-client.ts\`. Seller and buyer ship as pre-built static files; Laravel does not read it.

| Subdomain | Document root | Upload from this distribution |
|-----------|---------------|-------------------------------|
| **main** (Laravel) | Point web root at \`public/\` inside your backend folder | Entire \`apps/backend/\` tree; document root = \`apps/backend/public\` |
| **seller** | Hostinger folder for \`seller.yourdomain.com\` | **Only** the contents of \`apps/seller/dist/\` (HTML, JS, CSS, assets) |
| **buyer** | Hostinger folder for \`buyer.yourdomain.com\` | **Only** the contents of \`apps/buyer/dist/\` |

Workflow:

1. Build locally (\`npm run prepare:distribution\`) before upload.
2. Upload \`apps/backend\` to the main site; run \`/install\` or CLI steps above.
3. Upload \`apps/seller/dist/*\` into the seller subdomain root (not the full \`apps/seller\` source).
4. Upload \`apps/buyer/dist/*\` into the buyer subdomain root.
5. In Admin → Settings, set Partner URL and Buyer URL to the full \`https://\` subdomain URLs.

The React apps call the Laravel API over HTTPS. No relative path between subdomain folders is required.

### Client-side routing (refresh / direct URLs)

Buyer and seller panels use React Router. In-app navigation updates the browser path; on refresh
the server must return \`index.html\` for unknown paths (not a 404 HTML page).

Each \`dist/\` folder includes:

- \`.htaccess\` — Apache / LiteSpeed (most shared hosting, including Hostinger)
- \`web.config\` — IIS / Windows hosting

**Nginx:** add to each panel subdomain server block:

\`\`\`nginx
location / {
  try_files $uri $uri/ /index.html;
}
\`\`\`

Without one of these rules, routes like \`/favorites\` or \`/dashboard/properties\` work until
you refresh the browser.

## 7. Cron + queue

\`\`\`bash
* * * * * cd /path/to/apps/backend && php artisan schedule:run >> /dev/null 2>&1
php artisan queue:work
\`\`\`

## 8. Demo logins (after demo seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@sellio-platform.test | admin123 |
| Partner | partner@sellio-platform.test | partner123 |
| Buyer | buyer@sellio-platform.test | buyer123 |

Change these before production.

## 9. Included extras

- \`composer.phar\` in \`apps/backend/\` for hosts without global Composer
- Seeder images in \`apps/backend/database/seeders/images/\` (CMS + listing demo media; required for demo seed)
- \`storage/app/public/settings/\` ships default logo + favicon (from repo or \`database/seeders/images/\`)
- Other \`storage/app/public/\` paths stay empty — run demo seed + \`php artisan storage:link\` after install
`;

  await writeFile(join(outputDir, 'SERVER-DEPLOY.md'), guide, 'utf8');
}

async function writeManifest() {
  const manifest = {
    generatedAt: new Date().toISOString(),
    sourceRoot: repoRoot,
    outputDir,
    skipBuild,
    includes: INCLUDE_ROOTS,
    excluded: {
      directories: [...EXCLUDED_DIR_NAMES],
      files: [...EXCLUDED_FILE_NAMES],
    },
    notes: [
      'vendor/ intentionally omitted — install via web wizard or composer install',
      'node_modules/ intentionally omitted',
      'packages/ intentionally omitted — types and API client are inlined into apps/storefront/src/',
      'installed.lock and .env removed for fresh-install testing',
      'storage/app/public/settings/ always shipped (logo.png, favicon.ico)',
      'other storage/app/public/ paths emptied — dev uploads excluded; demo seed repopulates listing media',
      'bootstrap cache and runtime storage artifacts cleared',
    ],
  };

  await writeFile(
    join(outputDir, 'DISTRIBUTION-MANIFEST.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );
}

async function createZipArchive() {
  const zipPath = `${outputDir}.zip`;
  await removeIfExists(zipPath);

  if (process.platform === 'win32') {
    const source = join(outputDir, '*');
    await runCommand(
      'powershell',
      [
        '-NoProfile',
        '-Command',
        `Compress-Archive -Path '${source}' -DestinationPath '${zipPath}' -Force`,
      ],
      repoRoot,
    );
  } else {
    await runCommand('zip', ['-r', zipPath, '.'], outputDir);
  }

  console.log(`\nCreated ZIP: ${zipPath}`);
}

async function prepareOutputDirectory() {
  if (!(await pathExists(outputDir))) {
    await mkdir(outputDir, { recursive: true });
    return;
  }

  console.log('\n==> Removing previous distribution folder...');
  try {
    await rm(outputDir, {
      recursive: true,
      force: true,
      maxRetries: 3,
      retryDelay: 250,
    });
  } catch (error) {
    const locked =
      error &&
      typeof error === 'object' &&
      'code' in error &&
      ['EBUSY', 'EPERM', 'EACCES'].includes(error.code);

    if (!locked) {
      throw error;
    }

    const stalePath = `${outputDir}.stale-${Date.now()}`;
    console.warn(
      `Warning: could not delete ${outputDir} (${error.code}). Renaming to ${stalePath}`,
    );
    await rename(outputDir, stalePath);
  }

  await mkdir(outputDir, { recursive: true });
}

async function main() {
  if (sellerOnly) {
    await runSellerOnlyDistribution();
    return;
  }

  console.log(`Sellio distribution prep`);
  console.log(`Source: ${repoRoot}`);
  console.log(`Output: ${outputDir}`);
  console.log(`Build frontend assets: ${skipBuild ? 'no' : 'yes'}`);
  console.log(`Portal API URL: ${distributionApiUrl}`);
  console.log(`Seller panel URL: ${distributionSellerUrl}`);
  console.log(`Buyer panel URL: ${distributionBuyerUrl}`);

  await prepareOutputDirectory();

  console.log('\n==> Copying submission package files...');
  for (const item of INCLUDE_ROOTS) {
    const src = join(repoRoot, item);
    if (!(await pathExists(src))) {
      console.warn(`Warning: missing include path: ${item}`);
      continue;
    }
    const dest = join(outputDir, item);
    await copyTree(src, dest, item);
    console.log(`Copied ${item}`);
  }

  console.log('\n==> Cleaning runtime artifacts in distribution copy...');
  await cleanBackendRuntimeArtifacts(join(outputDir, 'apps', 'backend'));
  await ensureBrandSettingsInDistribution(join(outputDir, 'apps', 'backend'));

  console.log('\n==> Downloading composer.phar for shared hosting...');
  try {
    await downloadComposerPhar(join(outputDir, 'apps', 'backend', 'composer.phar'));
    console.log('composer.phar ready in apps/backend/');
  } catch (error) {
    console.warn(`Warning: could not download composer.phar (${error.message})`);
  }

  if (!skipBuild) {
    await buildFrontendApps();
  } else {
    console.log('\n==> Skipping frontend builds (--skip-build)');
  }

  console.log('\n==> Copying built frontend assets into distribution...');
  await copyBuildArtifacts();

  await writeDeployGuide();
  await writeManifest();

  if (makeZip) {
    console.log('\n==> Creating ZIP archive...');
    await createZipArchive();
  }

  console.log('\nDone.');
  console.log(`Distribution folder: ${outputDir}`);
  console.log('Next: upload to a clean server and follow SERVER-DEPLOY.md');
}

main().catch((error) => {
  console.error('\nDistribution prep failed:', error.message);
  process.exit(1);
});
