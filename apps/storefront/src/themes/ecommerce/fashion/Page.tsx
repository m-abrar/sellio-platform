'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { Product } from '@sellio/types';
import { EditorialLookCard, TrendHUD } from './components';
import { CatalogSyncAlert } from '@/themes/ecommerce/shared/CatalogSyncAlert';
import { fetchProductsCatalog, resolveProductsFailure } from '@/themes/ecommerce/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/ecommerce/shared/useDemoFallbackAllowed';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';

const FALLBACK_COLLECTION: Product[] = [
  {
    id: 101,
    title: 'Silk Drape Blazer',
    slug: 'silk-drape-blazer',
    description: 'Tailored from pure double-faced organic silk with a double-breasted closure and refined peak lapels.',
    price: 1250,
    category_id: 1,
    pricing: { base_price: 1250, sale_price: 1250, current_price: 1250, formatted: '$1,250.00', currency_symbol: '$' },
    image_url: '/themes/ecommerce/fashion/11.webp',
  },
  {
    id: 102,
    title: 'Monolith Chelsea Boots',
    slug: 'monolith-chelsea-boots',
    description: 'Crafted from brushed full-grain box calfskin leather with a bold lugged sole and elasticated side gussets.',
    price: 850,
    category_id: 1,
    pricing: { base_price: 850, sale_price: 850, current_price: 850, formatted: '$850.00', currency_symbol: '$' },
    image_url: '/themes/ecommerce/fashion/12.webp',
  },
  {
    id: 103,
    title: 'Satin Evening Gown',
    slug: 'satin-evening-gown',
    description: 'A floor-length satin evening gown cut on the bias with an elegant cowl neckline and subtle side slit.',
    price: 2400,
    category_id: 1,
    pricing: { base_price: 2400, sale_price: 2400, current_price: 2400, formatted: '$2,400.00', currency_symbol: '$' },
    image_url: '/themes/ecommerce/fashion/13.webp',
  },
  {
    id: 104,
    title: 'Oversized Cashmere Coat',
    slug: 'oversized-cashmere-coat',
    description: 'Woven in Italy from brushed pure cashmere with generous proportions and premium horn buttons.',
    price: 3200,
    category_id: 1,
    pricing: { base_price: 3200, sale_price: 3200, current_price: 3200, formatted: '$3,200.00', currency_symbol: '$' },
    image_url: '/themes/ecommerce/fashion/14.webp',
  },
  {
    id: 105,
    title: 'Textured Knit Sweater',
    slug: 'textured-knit-sweater',
    description: 'Heavy-gauge organic cotton and linen ribbed blend with a raised mock collar and structural drop hem.',
    price: 450,
    category_id: 1,
    pricing: { base_price: 450, sale_price: 450, current_price: 450, formatted: '$450.00', currency_symbol: '$' },
    image_url: '/themes/ecommerce/fashion/15.webp',
  },
  {
    id: 106,
    title: 'Pleated Architecture Skirt',
    slug: 'pleated-architecture-skirt',
    description: 'Structured box pleats engineered from crisp wool-blend twill with an asymmetric draped silhouette.',
    price: 980,
    category_id: 1,
    pricing: { base_price: 980, sale_price: 980, current_price: 980, formatted: '$980.00', currency_symbol: '$' },
    image_url: '/themes/ecommerce/fashion/16.webp',
  },
];

type FashionProduct = Product & {
  media?: { featured_image?: string | null } | null;
};

export default function Page() {
  const themeLink = useEcommerceThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const heroEyebrow = useThemeContent('hero.eyebrow', 'Fall / Winter 2026');
  const heroTitle = useThemeContent('hero.title', 'Silent\nLuxury.');
  const heroCtaLabel = useThemeContent('hero.primary_cta_label', 'Explore Editorial');
  const heroImage = useThemeMedia('hero.image', '/themes/ecommerce/fashion/17.webp');
  const sideImageOneLabel = useThemeContent('hero.side_image_1_label', 'Accessories 01');
  const sideImageTwoLabel = useThemeContent('hero.side_image_2_label', 'Ready to Wear 04');
  const collectionEyebrow = useThemeContent('collection.eyebrow', 'Featured capsule');
  const collectionTitle = useThemeContent('collection.title', 'A tighter edit for the season.');
  const collectionIntro = useThemeContent(
    'collection.description',
    'A homepage edit of selected silhouettes. Browse the full archive when you are ready to see every available piece.',
  );
  const philosophyQuote = useThemeContent(
    'philosophy.quote',
    'We do not build garments. We architect confidence through the precision of silhouette and the purity of material.',
  );
  const philosophyEyebrow = useThemeContent('philosophy.eyebrow', 'Atelier philosophy');
  const heroSidebarLabel = useThemeContent('hero.sidebar_label', 'Runway note');
  const heroSidebarNote = useThemeContent('hero.sidebar_note', 'A calm editorial storefront for statement silhouettes, tactile materials, and curated seasonal drops.');
  const heroSideLabel1 = useThemeContent('hero.side_label_1', 'Limited accessories');
  const heroSideLabel2 = useThemeContent('hero.side_label_2', 'Ready-to-wear edit');
  const heroArchiveLabel = useThemeContent('hero.archive_link_label', 'View full archive');
  const metricsFeaturedLabel = useThemeContent('metrics.featured_label', 'Featured edit');
  const metricsFeaturedValue = useThemeContent('metrics.featured_value', '03');
  const metricsReturnsLabel = useThemeContent('metrics.returns_label', 'Returns');
  const metricsReturnsValue = useThemeContent('metrics.returns_value', '30D');
  const metricsShippingLabel = useThemeContent('metrics.shipping_label', 'Shipping');
  const metricsShippingValue = useThemeContent('metrics.shipping_value', 'Express');

  const [products, setProducts] = useState<FashionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      const result = await fetchProductsCatalog();

      if (!isMounted) return;

      if (result.ok) {
        setProducts(result.data);
        setUseFallback(false);
        setApiError(null);
      } else {
        setApiError(result.error);
        const resolution = resolveProductsFailure(allowDemo);
        if (resolution.mode === 'demo') {
          setProducts(FALLBACK_COLLECTION);
          setUseFallback(true);
        } else {
          setProducts([]);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [allowDemo]);

  const featuredProducts = useMemo(() => products.slice(0, 3), [products]);
  const productCountLabel = loading ? '...' : products.length ? products.length.toString().padStart(2, '0') : '00';

  return (
    <div className="ef-section">
      <section className="ef-hero">
        <div className="ef-hero-main">
          <img src={heroImage} alt="" className="ef-hero-img" />
          <div className="ef-hero-shade" />
          <div className="ef-hero-caption">
            <div className="ef-mono">{heroEyebrow}</div>
            <h1 className="ef-heading-xl ef-hero-title">
              {heroTitle.split('\n').map((line, index) => (
                <React.Fragment key={`${line}-${index}`}>
                  {index > 0 && <br />}
                  {index > 0 ? <span className="ef-italic">{line}</span> : line}
                </React.Fragment>
              ))}
            </h1>
            <div className="ef-hero-cta">
              <a href={themeLink('/explore')} className="ef-btn-primary ef-btn-light">
                {heroCtaLabel}
              </a>
            </div>
          </div>
        </div>
        <div className="ef-hero-editorial">
          <div>
            <div className="ef-mono">{heroSidebarLabel}</div>
            <p>{heroSidebarNote}</p>
          </div>
          <div className="ef-hero-editorial-row">
            <span>{sideImageOneLabel}</span>
            <strong>{heroSideLabel1}</strong>
          </div>
          <div className="ef-hero-editorial-row">
            <span>{sideImageTwoLabel}</span>
            <strong>{heroSideLabel2}</strong>
          </div>
          <a href={themeLink('/explore')} className="ef-hero-text-link">
            {heroArchiveLabel}
          </a>
        </div>
      </section>

      <section className="ef-metrics-grid">
        <TrendHUD label="Curated pieces" value={productCountLabel} />
        <TrendHUD label={metricsFeaturedLabel} value={metricsFeaturedValue} />
        <TrendHUD label={metricsReturnsLabel} value={metricsReturnsValue} />
        <TrendHUD label={metricsShippingLabel} value={metricsShippingValue} />
      </section>

      {apiError && useFallback && (
        <div className="ef-alert-wrap">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ef" />
        </div>
      )}
      {apiError && !useFallback && (
        <div className="ef-alert-wrap">
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="ef" />
        </div>
      )}

      <section className="ef-lookbook-section">
        <div className="ef-lookbook-header">
          <div className="ef-mono">{collectionEyebrow}</div>
          <h2 className="ef-heading-xl">{collectionTitle}</h2>
        </div>
        <div className="ef-lookbook-intro">
          <p>{collectionIntro}</p>
          <a href={themeLink('/explore')}>Shop all pieces</a>
        </div>

        <div className="ef-lookbook-grid">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="ef-look-card ef-look-card-loading">
                <div className="ef-img-frame ef-shimmer-card" />
                <div className="ef-card-lines">
                  <div className="ef-shimmer-card" />
                  <div className="ef-shimmer-card" />
                  <div className="ef-shimmer-card" />
                </div>
              </div>
            ))
          ) : featuredProducts.length === 0 ? (
            <div className="ef-empty-collection">
              <div className="ef-mono">Empty collection</div>
              <h3>No products available yet.</h3>
              <p>Publish products in the admin and they will appear here.</p>
              <a href={themeLink('/explore')} className="ef-btn-primary">
                Browse collection
              </a>
            </div>
          ) : (
            featuredProducts.map((item, i) => {
              const priceFormatted = item.pricing?.formatted ||
                (typeof item.price === 'number' ? `$${item.price.toLocaleString()}` : item.price);
              const activeImage = item.image_url || item.media?.featured_image || `/themes/ecommerce/fashion/${(i % 6) + 11}.webp`;

              return (
                <a key={item.slug || i} href={themeLink(`/product/${item.slug}`)} className="ef-look-card-link">
                  <EditorialLookCard
                    name={item.title}
                    price={priceFormatted}
                    image={activeImage}
                    lookNumber={`LOOK ${(i + 1).toString().padStart(2, '0')}`}
                  />
                </a>
              );
            })
          )}
        </div>
      </section>

      <section className="ef-philosophy-section">
        <div className="ef-philosophy-inner">
          <h2>&quot;{philosophyQuote}&quot;</h2>
          <div className="ef-philosophy-divider" />
          <div className="ef-mono">{philosophyEyebrow}</div>
        </div>
      </section>
    </div>
  );
}
