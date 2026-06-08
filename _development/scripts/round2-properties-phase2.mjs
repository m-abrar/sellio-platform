import fs from 'fs';
import path from 'path';

const root = path.resolve('apps/storefront/src/themes/properties');
const formErrorCss = `
.prop-form-error {
  color: #dc2626;
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0.5rem 0;
}
`;

const productThemes = [
  'map',
  'investment',
  'neighborhood',
  'showcase',
  'unified',
  'urban',
  'platinum',
];

const pageThemes = [
  'map',
  'investment',
  'neighborhood',
  'unified',
  'urban',
  'showcase',
  'commercial',
  'platinum',
  'vacation',
];

function patchSimpleProductPage(theme) {
  const file = path.join(root, theme, 'ProductPage.tsx');
  let content = fs.readFileSync(file, 'utf8');

  if (content.includes('usePropertyThemeLink')) {
    return;
  }

  content = content.replace(
    /function getThemeLink\(path: string\) \{\n[\s\S]*?\n\}\n\n/,
    '',
  );

  content = content.replace(
    "import type { Property } from '@sellio/types';",
    "import type { Property } from '@sellio/types';\nimport { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';",
  );

  content = content.replace(
    'export default function ProductPage({ slug }: ProductPageProps) {',
    'export default function ProductPage({ slug }: ProductPageProps) {\n  const themeLink = usePropertyThemeLink();',
  );

  content = content.replace(/getThemeLink\(/g, 'themeLink(');

  if (!content.includes('formError') && content.includes('!form.name || !form.email')) {
    content = content.replace(
      'const [isSubmitted, setIsSubmitted] = useState(false);',
      'const [isSubmitted, setIsSubmitted] = useState(false);\n  const [formError, setFormError] = useState<string | null>(null);',
    );
    content = content.replace(
      'if (!property || !form.name || !form.email) return;',
      "if (!property || !form.name || !form.email) {\n      setFormError('Please enter your name and email to submit an inquiry.');\n      return;\n    }\n    setFormError(null);",
    );
    content = content.replace(
      '<form className="',
      '{formError ? <p className="prop-form-error" role="alert">{formError}</p> : null}\n          <form className="',
    );
  }

  fs.writeFileSync(file, content);
}

function patchPage(theme) {
  const file = path.join(root, theme, 'Page.tsx');
  let content = fs.readFileSync(file, 'utf8');

  if (!content.includes("href={`/product/") && !content.includes('getThemeLink(')) {
    return;
  }

  if (!content.includes('usePropertyThemeLink')) {
    if (!content.includes("from 'next/navigation'")) {
      content = content.replace(
        "'use client';\n\nimport React",
        "'use client';\n\nimport React",
      );
      content = content.replace(
        "import React, { useEffect, useState } from 'react';",
        "import React, { useEffect, useState } from 'react';\nimport { useRouter } from 'next/navigation';",
      );
    }
    content = content.replace(
      "import { useThemeContent",
      "import { getAdminBaseUrl } from '@/lib/admin-urls';\nimport { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';\nimport { useThemeContent",
    );
    content = content.replace(
      'export default function Page() {',
      "export default function Page() {\n  const router = useRouter();\n  const themeLink = usePropertyThemeLink();\n  const adminCreatePropertyUrl = `${getAdminBaseUrl()}/admin/properties/create`;",
    );
  }

  content = content.replace(/href=\{`\/product\/\$\{([^}]+)\}`\}/g, 'href={themeLink(`/product/${$1}`)}');
  content = content.replace(/getThemeLink\(/g, 'themeLink(');

  content = content.replace(/onClick=\{\(\) => alert\([^)]+\)\}/g, (match) => {
    if (match.toLowerCase().includes('list') || match.toLowerCase().includes('register')) {
      return "onClick={() => window.open(adminCreatePropertyUrl, '_blank', 'noopener,noreferrer')}";
    }
    return "onClick={() => router.push(themeLink('/'))}";
  });

  fs.writeFileSync(file, content);
}

function patchUtils(theme) {
  const file = path.join(root, theme, 'utils.ts');
  if (!fs.existsSync(file)) return;
  fs.writeFileSync(
    file,
    "export { scrollToSection } from '@/themes/properties/shared/property-utils';\n",
  );
}

function patchComponents(theme) {
  const file = path.join(root, theme, 'components', 'index.tsx');
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/onClick=\{\(\) => alert\([^)]+\)\}/g, '');
  if (theme === 'unified' || theme === 'urban') {
    content = content.replace(
      /export const (UnifiedPropCard|UrbanUnitCard) = \(\{([^}]+)\}: any\) => \(\n  <div className="[^"]+" onClick=\{[^}]+\}>/,
      'export const $1 = ({$2}: any) => (\n  <div className="$3">'.replace('$3', theme === 'unified' ? 'uh-prop-card' : 'pu-unit-card'),
    );
    // simpler: just remove onClick from card div
    content = content.replace(
      /<div className="uh-prop-card" onClick=\{[^}]+\}>/,
      '<div className="uh-prop-card">',
    );
    content = content.replace(
      /<div className="pu-unit-card" onClick=\{[^}]+\}>/,
      '<div className="pu-unit-card">',
    );
  }
  fs.writeFileSync(file, content);
}

function appendFormErrorCss(theme) {
  const file = path.join(root, theme, 'styles.css');
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('.prop-form-error')) return;
  fs.appendFileSync(file, formErrorCss);
}

for (const theme of productThemes) {
  patchSimpleProductPage(theme);
  appendFormErrorCss(theme);
}

for (const theme of pageThemes) {
  patchPage(theme);
  patchComponents(theme);
  if (theme === 'commercial' || theme === 'platinum') {
    patchUtils(theme);
  }
  appendFormErrorCss(theme);
}

console.log('properties phase 2 script complete');
