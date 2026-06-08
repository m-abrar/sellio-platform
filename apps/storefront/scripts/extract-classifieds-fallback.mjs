import fs from 'fs';

const extractions = [
  {
    file: 'src/themes/classifieds/deals/Page.tsx',
    constName: 'FALLBACK_DEALS',
    exportName: 'DEALS_FALLBACK_CLASSIFIEDS',
    out: 'src/themes/classifieds/shared/fallback-deals.ts',
  },
  {
    file: 'src/themes/classifieds/elite/Page.tsx',
    constName: 'FALLBACK_CLASSIFIEDS',
    exportName: 'ELITE_FALLBACK_CLASSIFIEDS',
    out: 'src/themes/classifieds/shared/fallback-elite.ts',
  },
  {
    file: 'src/themes/classifieds/modern/Page.tsx',
    constName: 'FALLBACK_CLASSIFIEDS',
    exportName: 'MODERN_FALLBACK_CLASSIFIEDS',
    out: 'src/themes/classifieds/shared/fallback-modern.ts',
  },
  {
    file: 'src/themes/classifieds/premium/Page.tsx',
    constName: 'FALLBACK_CLASSIFIEDS',
    exportName: 'PREMIUM_FALLBACK_CLASSIFIEDS',
    out: 'src/themes/classifieds/shared/fallback-premium.ts',
  },
];

for (const { file, constName, exportName, out } of extractions) {
  const src = fs.readFileSync(file, 'utf8');
  const start = src.indexOf(`const ${constName}`);
  if (start === -1) {
    throw new Error(`Not found: ${constName} in ${file}`);
  }

  const typeMarker = ': ClassifiedListing[] = [';
  const assignPos = src.indexOf(typeMarker, start);
  if (assignPos === -1) {
    throw new Error(`Array assignment not found for ${constName} in ${file}`);
  }
  const bracketStart = assignPos + typeMarker.length - 1;

  let depth = 0;
  let i = bracketStart;
  for (; i < src.length; i++) {
    if (src[i] === '[') depth += 1;
    else if (src[i] === ']') {
      depth -= 1;
      if (depth === 0) {
        i += 1;
        break;
      }
    }
  }

  const arrayBody = src.slice(bracketStart, i);
  const content = [
    "import type { ClassifiedListing } from '@sellio/types';",
    '',
    `export const ${exportName}: ClassifiedListing[] = ${arrayBody};`,
    '',
  ].join('\n');

  fs.writeFileSync(out, content);
  console.log(`Wrote ${out}`);
}
