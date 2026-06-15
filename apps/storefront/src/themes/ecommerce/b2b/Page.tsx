'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { Product } from '@sellio/types';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/ecommerce/shared/CatalogSyncAlert';
import { fetchProductsCatalog, resolveProductsFailure } from '@/themes/ecommerce/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/ecommerce/shared/useDemoFallbackAllowed';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';
import { B2BProductCard } from './components';

const capabilities = [
  ['Tiered Pricing', 'Show account-based pricing, MOQs, and volume breaks.'],
  ['Spec Sheets', 'Attach technical PDFs, certifications, and compliance data.'],
  ['RFQ Workflow', 'Collect quantities, deadlines, company details, and notes.'],
  ['Procurement Fit', 'Support repeat orders, approvals, and buyer teams.'],
];

const processSteps = [
  ['01', 'Browse catalog', 'Buyers compare SKUs, categories, specs, and availability signals.'],
  ['02', 'Build RFQ', 'They add products, quantities, destination, and procurement notes.'],
  ['03', 'Negotiate quote', 'Sellers respond with price, lead time, payment terms, and alternatives.'],
];

export default function Page() {
  const themeLink = useEcommerceThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const eyebrow = useThemeContent('hero.eyebrow', 'B2B catalog and procurement');
  const title = useThemeContent('hero.title', 'Wholesale catalog\nbuilt for RFQs.');
  const description = useThemeContent(
    'hero.description',
    'A catalog-first storefront for distributors, manufacturers, and wholesale suppliers where buyers request quotes instead of checking out instantly.',
  );
  const primaryCta = useThemeContent('hero.primary_cta_label', 'Browse catalog');
  const secondaryCta = useThemeContent('hero.secondary_cta_label', 'Create RFQ');
  const collectionTitle = useThemeContent('collection.title', 'Featured catalog');
  const collectionDescription = useThemeContent(
    'collection.description',
    'Products stay easy to scan, compare, and qualify before a buyer starts a quote request.',
  );
  const offlineKicker = useThemeContent('sync.offline_kicker', 'Catalog unavailable');
  const offlineTitle = useThemeContent('sync.offline_title', 'Products could not be loaded.');
  const emptyTitle = useThemeContent('empty.title', 'No catalog products are published yet.');
  const emptyDescription = useThemeContent('empty.description', 'Add product records in the admin panel and they will appear here.');
  const rfqTitle = useThemeContent('rfq.title', 'RFQ intake for serious buyers');
  const rfqDescription = useThemeContent(
    'rfq.description',
    'Capture company profile, requested quantities, destination, timeline, files, and internal notes before routing the request to the seller.',
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setLoadingProducts(true);
      const result = await fetchProductsCatalog();

      if (!isMounted) return;

      if (result.ok) {
        setProducts(result.data);
        setUseFallback(false);
        setApiError(null);
      } else {
        setApiError(result.error);
        const resolution = resolveProductsFailure(allowDemo);
        setProducts(resolution.mode === 'demo' ? resolution.products : []);
        setUseFallback(resolution.mode === 'demo');
      }

      setLoadingProducts(false);
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [allowDemo]);

  const productCountLabel = useMemo(() => {
    if (loadingProducts) return 'Loading';
    return products.length > 0 ? products.length.toLocaleString() : 'Ready';
  }, [loadingProducts, products.length]);

  return (
    <div className="b2b-page">
      <section className="b2b-hero">
        <div className="b2b-hero-copy">
          <span className="b2b-kicker">{eyebrow}</span>
          <h1>
            {title.split('\n').map((line, index, lines) => (
              <React.Fragment key={`${line}-${index}`}>
                {line}
                {index < lines.length - 1 ? <br /> : null}
              </React.Fragment>
            ))}
          </h1>
          <p>{description}</p>
          <div className="b2b-actions">
            <a href={themeLink('/explore')} className="b2b-btn b2b-btn-primary">{primaryCta}</a>
            <a href="#b2b-rfq" className="b2b-btn b2b-btn-secondary">{secondaryCta}</a>
          </div>
        </div>

        <aside className="b2b-hero-panel" aria-label="Catalog summary">
          <div>
            <span>Live SKUs</span>
            <strong>{productCountLabel}</strong>
          </div>
          <div>
            <span>Buyer flow</span>
            <strong>RFQ</strong>
          </div>
          <div>
            <span>Modes</span>
            <strong>Dark / Light</strong>
          </div>
          <div className="b2b-panel-note">Quote-first commerce for negotiated pricing, recurring procurement, and private catalogs.</div>
        </aside>
      </section>

      <section className="b2b-capability-grid" aria-label="B2B capabilities">
        {capabilities.map(([name, detail]) => (
          <article key={name}>
            <h2>{name}</h2>
            <p>{detail}</p>
          </article>
        ))}
      </section>

      <section className="b2b-collection">
        <div className="b2b-section-heading">
          <span className="b2b-kicker">Catalog preview</span>
          <h2>{collectionTitle}</h2>
          <p>{collectionDescription}</p>
        </div>

        {apiError && useFallback && <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ef" />}
        {apiError && !useFallback && <CatalogSyncAlert variant="production" error={apiError} classPrefix="ef" />}

        <div className="b2b-product-grid">
          {loadingProducts ? (
            [1, 2, 3, 4].map((item) => <div key={item} className="b2b-product-card b2b-skeleton" />)
          ) : apiError && !useFallback ? (
            <div className="b2b-state">
              <span className="b2b-kicker">{offlineKicker}</span>
              <h3>{offlineTitle}</h3>
              <p>Check the API connection or refresh the page.</p>
            </div>
          ) : products.length === 0 ? (
            <div className="b2b-state">
              <h3>{emptyTitle}</h3>
              <p>{emptyDescription}</p>
            </div>
          ) : (
            products.slice(0, 8).map((product, index) => (
              <B2BProductCard
                key={product.id}
                product={product}
                href={themeLink(`/product/${product.slug}`)}
                featured={index === 0}
              />
            ))
          )}
        </div>
      </section>

      <section id="b2b-rfq" className="b2b-rfq">
        <div>
          <span className="b2b-kicker">Inquiry based flow</span>
          <h2>{rfqTitle}</h2>
          <p>{rfqDescription}</p>
        </div>
        <div className="b2b-process">
          {processSteps.map(([number, label, detail]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{label}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
