#!/usr/bin/env node
/**
 * Prepare a CodeCanyon / fresh-server distribution folder from the monorepo.
 *
 * Usage:
 *   node scripts/prepare-distribution.mjs
 *   node scripts/prepare-distribution.mjs --output D:/sellio-staging
 *   node scripts/prepare-distribution.mjs --skip-build
 *   node scripts/prepare-distribution.mjs --zip
 */

import {
  cp,
  mkdir,
  readdir,
  readFile,
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
const outputIndex = args.indexOf('--output');
const outputDir = resolve(
  outputIndex >= 0 && args[outputIndex + 1]
    ? args[outputIndex + 1]
    : join(repoRoot, 'distribution'),
);

const EXCLUDED_DIR_NAMES = new Set([
  'node_modules',
  'vendor',
  '.git',
  '.cursor',
  '_development',
  '.idea',
  '.vscode',
  '.fleet',
  '.nova',
  '.zed',
  '.phpunit.cache',
  'distribution',
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
]);

const EXCLUDED_FILE_PATTERNS = [/\.zip$/i, /^\.env\./];

const INCLUDE_ROOTS = [
  'apps',
  'documentation',
  'Documentation',
  'introduction',
  'listing-description',
  'CHANGELOG.md',
  'README.md',
  'LICENSE',
];

/** Dev-uploaded media — never ship; demo seed recreates files after install. */
const STORAGE_APP_PUBLIC_PREFIX = 'backend/storage/app/public';

function isDevUploadedMedia(relPath, name) {
  const normalized = relPath.replace(/\\/g, '/');
  if (normalized === STORAGE_APP_PUBLIC_PREFIX) {
    return false;
  }
  if (!normalized.startsWith(`${STORAGE_APP_PUBLIC_PREFIX}/`)) {
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
        if (entry === '.gitignore') {
          continue;
        }
        await rm(join(dir, entry), { recursive: true, force: true });
      }
    } else {
      await mkdir(dir, { recursive: true });
    }
  }
}

async function downloadComposerPhar(destPath) {
  const url = 'https://getcomposer.org/download/latest-stable/composer.phar';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download composer.phar (${response.status})`);
  }

  await pipeline(Readable.fromWeb(response.body), createWriteStream(destPath));
}

async function buildFrontendApps() {
  const backendRoot = join(repoRoot, 'apps', 'backend');
  const sellerRoot = join(repoRoot, 'apps', 'seller');
  const buyerRoot = join(repoRoot, 'apps', 'buyer');

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

Default seeded values expect \`{APP_URL}/seller\` and \`{APP_URL}/buyer\`.

## 6. Hostinger / isolated subdomains

On hosts like Hostinger, each subdomain gets its **own document root** — folders are not shared between \`main\`, \`seller\`, and \`buyer\`. That is the expected setup.

**Do not upload \`packages/\` to production.** It is dev/build-time shared TypeScript source in the repo only. Seller and buyer ship as pre-built static files; Laravel does not read it.

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
- \`storage/app/public/\` is intentionally empty — run demo seed + \`php artisan storage:link\` after install
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
      'packages/ intentionally omitted — dev-only shared TypeScript; not used at runtime',
      'installed.lock and .env removed for fresh-install testing',
      'storage/app/public/ always emptied — dev uploads excluded; demo seed repopulates media',
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

async function main() {
  console.log(`Sellio distribution prep`);
  console.log(`Source: ${repoRoot}`);
  console.log(`Output: ${outputDir}`);
  console.log(`Build frontend assets: ${skipBuild ? 'no' : 'yes'}`);

  if (await pathExists(outputDir)) {
    console.log('\n==> Removing previous distribution folder...');
    await rm(outputDir, { recursive: true, force: true });
  }

  await mkdir(outputDir, { recursive: true });

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

  console.log('\n==> Downloading composer.phar for shared hosting...');
  try {
    await downloadComposerPhar(join(outputDir, 'apps', 'backend', 'composer.phar'));
    console.log('composer.phar ready in apps/backend/');
  } catch (error) {
    console.warn(`Warning: could not download composer.phar (${error.message})`);
  }

  if (!skipBuild) {
    await buildFrontendApps();
    console.log('\n==> Copying built frontend assets into distribution...');
    await copyBuildArtifacts();
  } else {
    console.log('\n==> Skipping frontend builds (--skip-build)');
  }

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
