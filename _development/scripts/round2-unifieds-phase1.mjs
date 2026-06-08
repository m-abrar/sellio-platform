import fs from 'fs';
import path from 'path';

const root = path.resolve('apps/storefront/src/themes/unifieds');

const themes = [
  {
    key: 'classic',
    btnPrimary: 'legacy-btn-primary',
    backLabel: 'Archive',
    detailPage: 'uc-detail-page',
    detailBack: 'uc-detail-back',
    detailGrid: 'uc-detail-grid',
    detailMedia: 'uc-detail-media',
    detailPanel: 'uc-detail-panel',
    detailState: 'uc-detail-state',
    detailPrice: 'uc-detail-price',
    detailRule: 'uc-detail-rule',
    detailSpecs: 'uc-detail-specs',
    detailAction: 'uc-detail-action',
    detailSkeleton: 'uc-detail-skeleton',
    detailBackSkeleton: 'uc-detail-back-skeleton',
    detailLine: 'uc-detail-line',
    mono: 'uc-mono',
    monoColor: 'var(--uc-gold)',
    nodeLabel: 'REGISTRY',
    addLabel: 'ADD TO CART',
    addingLabel: 'ADDING...',
  },
  {
    key: 'interactive',
    btnPrimary: 'motion-btn-primary',
    backLabel: 'Motion Feed',
    detailPage: 'ui-detail-page',
    detailBack: 'ui-detail-back',
    detailGrid: 'ui-detail-grid',
    detailMedia: 'ui-detail-media',
    detailPanel: 'ui-detail-panel',
    detailState: 'ui-detail-state',
    detailPrice: 'ui-detail-price',
    detailRule: 'ui-detail-rule',
    detailSpecs: 'ui-detail-specs',
    detailAction: 'ui-detail-action',
    detailSkeleton: 'ui-detail-skeleton',
    detailBackSkeleton: 'ui-detail-back-skeleton',
    detailLine: 'ui-detail-line',
    mono: 'ui-mono',
    monoColor: 'var(--ui-accent)',
    nodeLabel: 'MOTION',
    addLabel: 'ADD TO CART',
    addingLabel: 'ADDING...',
  },
  {
    key: 'marketplace',
    btnPrimary: 'trade-btn-primary',
    backLabel: 'Exchange',
    detailPage: 'um-detail-page',
    detailBack: 'um-detail-back',
    detailGrid: 'um-detail-grid',
    detailMedia: 'um-detail-media',
    detailPanel: 'um-detail-panel',
    detailState: 'um-detail-state',
    detailPrice: 'um-detail-price',
    detailRule: 'um-detail-rule',
    detailSpecs: 'um-detail-specs',
    detailAction: 'um-detail-action',
    detailSkeleton: 'um-detail-skeleton',
    detailBackSkeleton: 'um-detail-back-skeleton',
    detailLine: 'um-detail-line',
    mono: 'um-mono',
    monoColor: 'var(--um-gold)',
    nodeLabel: 'TRADE',
    addLabel: 'ADD TO CART',
    addingLabel: 'ADDING...',
  },
  {
    key: 'mega',
    btnPrimary: 'mega-btn-primary',
    backLabel: 'Mega Grid',
    detailPage: 'ugm-detail-page',
    detailBack: 'ugm-detail-back',
    detailGrid: 'ugm-detail-grid',
    detailMedia: 'ugm-detail-media',
    detailPanel: 'ugm-detail-panel',
    detailState: 'ugm-detail-state',
    detailPrice: 'ugm-detail-price',
    detailRule: 'ugm-detail-rule',
    detailSpecs: 'ugm-detail-specs',
    detailAction: 'ugm-detail-action',
    detailSkeleton: 'ugm-detail-skeleton',
    detailBackSkeleton: 'ugm-detail-back-skeleton',
    detailLine: 'ugm-detail-line',
    mono: 'ugm-mono',
    monoColor: 'var(--ugm-accent)',
    nodeLabel: 'MEGA',
    addLabel: 'ADD TO CART',
    addingLabel: 'ADDING...',
  },
  {
    key: 'modern',
    btnPrimary: 'nexus-btn-primary',
    backLabel: 'Nexus Feed',
    detailPage: 'unp-detail-page',
    detailBack: 'unp-detail-back',
    detailGrid: 'unp-detail-grid',
    detailMedia: 'unp-detail-media',
    detailPanel: 'unp-detail-panel',
    detailState: 'unp-detail-state',
    detailPrice: 'unp-detail-price',
    detailRule: 'unp-detail-rule',
    detailSpecs: 'unp-detail-specs',
    detailAction: 'unp-detail-action',
    detailSkeleton: 'unp-detail-skeleton',
    detailBackSkeleton: 'unp-detail-back-skeleton',
    detailLine: 'unp-detail-line',
    mono: 'unp-mono',
    monoColor: 'var(--unp-cyan)',
    nodeLabel: 'NEXUS',
    addLabel: 'ADD TO CART',
    addingLabel: 'ADDING...',
  },
  {
    key: 'standard',
    btnPrimary: 'scale-btn-primary',
    backLabel: 'Exchange',
    detailPage: 'usp-detail-page',
    detailBack: 'usp-detail-back',
    detailGrid: 'usp-detail-grid',
    detailMedia: 'usp-detail-media',
    detailPanel: 'usp-detail-panel',
    detailState: 'usp-detail-state',
    detailPrice: 'usp-detail-price',
    detailRule: 'usp-detail-rule',
    detailSpecs: 'usp-detail-specs',
    detailAction: 'usp-detail-action',
    detailSkeleton: 'usp-detail-skeleton',
    detailBackSkeleton: 'usp-detail-back-skeleton',
    detailLine: 'usp-detail-line',
    mono: 'usp-mono',
    monoColor: 'var(--usp-gray)',
    nodeLabel: 'NODE',
    addLabel: 'ADD TO CART',
    addingLabel: 'ADDING NODE',
  },
];

function productPage(t) {
  return `'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Product } from '@sellio/types';
import { addProductToCart } from '@/themes/unifieds/shared/cart';
import {
  formatProductPrice,
  getProductImage,
  PRODUCT_DETAIL_PLACEHOLDER,
} from '@/themes/unifieds/shared/product-utils';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';

interface ProductPageProps {
  slug: string;
}

export default function ProductPage({ slug }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartNotice, setCartNotice] = useState<string | null>(null);
  const themeLink = useUnifiedThemeLink();

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      try {
        const fetchedProduct = await api.getProductBySlug(slug);
        if (!isMounted) {
          return;
        }

        setProduct(fetchedProduct);
        setErrorMessage(null);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load unified ${t.key} product details:', error);
        setProduct(null);
        setErrorMessage(
          error instanceof Error ? error.message : 'The listing record could not be synchronized.',
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    setAddingToCart(true);
    setCartNotice(null);

    try {
      addProductToCart(product);
      setCartNotice(\`"\${product.title}" was added to your cart.\`);
    } catch (error) {
      console.error('Failed to persist unified ${t.key} cart item:', error);
      setCartNotice('Unable to update your cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <main className="${t.detailPage}" aria-busy="true">
        <div className="${t.detailBackSkeleton}" />
        <section className="${t.detailGrid}">
          <div className="${t.detailMedia} ${t.detailSkeleton}" />
          <div className="${t.detailPanel}">
            <div className="${t.detailLine} ${t.detailLine}-small" />
            <div className="${t.detailLine} ${t.detailLine}-title" />
            <div className="${t.detailLine} ${t.detailLine}-price" />
            <div className="${t.detailLine} ${t.detailLine}-copy" />
            <div className="${t.detailLine} ${t.detailLine}-button" />
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage || !product) {
    return (
      <main className="${t.detailPage}">
        <section className="${t.detailState}" role="status">
          <div className="${t.mono}" style={{ color: '${t.monoColor}', marginBottom: '1rem' }}>${t.nodeLabel}_UNAVAILABLE</div>
          <h1>Listing details could not be loaded.</h1>
          <p>{errorMessage || 'The requested listing does not exist or has been removed.'}</p>
          <a href={themeLink('/')} className="${t.btnPrimary}">Return to ${t.backLabel}</a>
        </section>
      </main>
    );
  }

  return (
    <main className="${t.detailPage}">
      <a href={themeLink('/')} className="${t.detailBack}">
        <span aria-hidden="true">←</span>
        Back to ${t.backLabel}
      </a>

      <section className="${t.detailGrid}" aria-labelledby="${t.detailPage}-title">
        <div className="${t.detailMedia}">
          <img src={getProductImage(product, PRODUCT_DETAIL_PLACEHOLDER)} alt={product.title} />
        </div>

        <article className="${t.detailPanel}">
          <div className="${t.mono}" style={{ color: '${t.monoColor}' }}>${t.nodeLabel}_{product.id}</div>
          <h1 id="${t.detailPage}-title">{product.title}</h1>
          <div className="${t.detailPrice}">{formatProductPrice(product)}</div>

          <div className="${t.detailRule}" />

          <div>
            <h2>Description</h2>
            <p>{product.description || 'No description provided.'}</p>
          </div>

          <div className="${t.detailSpecs}" aria-label="Listing metadata">
            <div>
              <span>Category</span>
              <strong>{product.category_id ? \`#\${product.category_id}\` : 'General'}</strong>
            </div>
            <div>
              <span>Record</span>
              <strong>{product.slug}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>Live</strong>
            </div>
          </div>

          <div className="${t.detailAction}s">
            <button type="button" className="${t.btnPrimary} ${t.detailAction}" onClick={handleAddToCart} disabled={addingToCart}>
              {addingToCart ? '${t.addingLabel}' : '${t.addLabel}'}
            </button>
            {cartNotice ? (
              <p className="uni-detail-cart-notice">
                {cartNotice}{' '}
                <a href={themeLink('/cart')}>View cart</a>
              </p>
            ) : null}
          </div>
        </article>
      </section>
    </main>
  );
}
`;
}

for (const theme of themes) {
  const dir = path.join(root, theme.key);

  fs.writeFileSync(path.join(dir, 'ExplorePage.tsx'), `export { default } from '@/themes/unifieds/shared/UnifiedExplorePage';\n`);
  fs.writeFileSync(
    path.join(dir, 'CartPage.tsx'),
    `import UnifiedCartPage from '@/themes/unifieds/shared/UnifiedCartPage';

export default function CartPage() {
  return <UnifiedCartPage primaryButtonClass="${theme.btnPrimary}" />;
}
`,
  );

  fs.writeFileSync(path.join(dir, 'ProductPage.tsx'), productPage(theme));

  const indexPath = path.join(dir, 'index.ts');
  fs.writeFileSync(
    indexPath,
    `\nexport { default } from './Page';\nexport { default as Layout } from './Layout';\nexport { default as ProductPage } from './ProductPage';\nexport { default as ExplorePage } from './ExplorePage';\nexport { default as CartPage } from './CartPage';\n`,
  );

  const pagePath = path.join(dir, 'Page.tsx');
  let page = fs.readFileSync(pagePath, 'utf8');

  if (!page.includes('useUnifiedThemeLink')) {
    page = page.replace(
      `'use client';\nimport React, { useEffect, useState } from 'react';`,
      `'use client';\nimport React, { useEffect, useState } from 'react';\nimport { useRouter } from 'next/navigation';`,
    );
    page = page.replace(
      `import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';`,
      `import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';\nimport { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';`,
    );
    page = page.replace(
      /import \{ useThemeContent \} from '@\/components\/theme-content\/ThemeContentProvider';/,
      `import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';\nimport { useRouter } from 'next/navigation';\nimport { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';`,
    );
  }

  if (!page.includes('const themeLink = useUnifiedThemeLink()')) {
    page = page.replace(
      /export default function Page\(\) \{\n/,
      `export default function Page() {\n  const router = useRouter();\n  const themeLink = useUnifiedThemeLink();\n`,
    );
  }

  page = page.replace(
    /href=\{`\/product\/\$\{product\.slug\}`\}/g,
    'href={themeLink(`/product/${product.slug}`)}',
  );
  page = page.replace(
    /href={`\/product\/\$\{product\.slug\}`}/g,
    'href={themeLink(`/product/${product.slug}`)}',
  );

  page = page.replace(/onClick=\{\(\) => alert\([^)]+\)\}/g, (match) => {
    if (match.includes('handshake') || match.includes('cta')) {
      return `onClick={() => router.push(themeLink('/explore'))}`;
    }
    return `onClick={() => router.push(themeLink('/explore'))}`;
  });

  page = page.replace(
    /onClick=\{\(\) => document\.getElementById\('[^']+'\)\?\.scrollIntoView\(\{ behavior: 'smooth' \}\)\}/g,
    `onClick={() => router.push(themeLink('/explore'))}`,
  );

  fs.writeFileSync(pagePath, page);

  const componentsPath = path.join(dir, 'components', 'index.tsx');
  if (fs.existsSync(componentsPath)) {
    let components = fs.readFileSync(componentsPath, 'utf8');
    components = components.replace(/onClick=\{\(\) => alert\([^)]+\)\}/g, '');
    components = components.replace(/\s+onClick=\{\(\) => \{\}\}/g, '');
    fs.writeFileSync(componentsPath, components);
  }

  console.log('updated', theme.key);
}

console.log('done');
