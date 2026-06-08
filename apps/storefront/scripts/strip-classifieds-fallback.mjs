import fs from 'fs';

function stripFallbackConst(src, constName) {
  const marker = `const ${constName}`;
  const start = src.indexOf(marker);
  if (start === -1) return src;

  const assignMarker = '= [';
  const arrStart = src.indexOf(assignMarker, start);
  if (arrStart === -1) return src;
  const bracketStart = arrStart + assignMarker.length - 1;

  let depth = 0;
  let i = bracketStart;
  for (; i < src.length; i++) {
    if (src[i] === '[') depth += 1;
    else if (src[i] === ']') {
      depth -= 1;
      if (depth === 0) {
        i += 1;
        while (i < src.length && (src[i] === ';' || src[i] === '\r' || src[i] === '\n')) {
          i += 1;
        }
        break;
      }
    }
  }

  return src.slice(0, start) + src.slice(i);
}

const files = [
  { path: 'src/themes/classifieds/deals/Page.tsx', constName: 'FALLBACK_DEALS' },
  { path: 'src/themes/classifieds/deals/ProductPage.tsx', constName: 'FALLBACK_DEALS' },
  { path: 'src/themes/classifieds/elite/Page.tsx', constName: 'FALLBACK_CLASSIFIEDS' },
  { path: 'src/themes/classifieds/elite/ProductPage.tsx', constName: 'FALLBACK_CLASSIFIEDS' },
  { path: 'src/themes/classifieds/modern/Page.tsx', constName: 'FALLBACK_CLASSIFIEDS' },
  { path: 'src/themes/classifieds/modern/ProductPage.tsx', constName: 'FALLBACK_CLASSIFIEDS' },
  { path: 'src/themes/classifieds/premium/Page.tsx', constName: 'FALLBACK_CLASSIFIEDS' },
  { path: 'src/themes/classifieds/premium/ProductPage.tsx', constName: 'FALLBACK_CLASSIFIEDS' },
];

for (const { path, constName } of files) {
  const src = fs.readFileSync(path, 'utf8');
  const next = stripFallbackConst(src, constName);
  if (next === src) {
    console.warn('No change:', path);
  } else {
    fs.writeFileSync(path, next);
    console.log('Stripped', constName, 'from', path);
  }
}
