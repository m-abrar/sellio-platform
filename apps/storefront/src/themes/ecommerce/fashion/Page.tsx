'use client';

import React, { useState, useEffect } from 'react';
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
    title: "Silk Drape Blazer",
    slug: "silk-drape-blazer",
    description: "Tailored from pure double-faced organic silk with a double-breasted closure and refined peak lapels. Features raw structural silhouette curves and invisible slip pockets.",
    price: 1250.00,
    category_id: 1,
    pricing: { base_price: 1250.00, sale_price: 1250.00, current_price: 1250.00, formatted: "$1,250.00", currency_symbol: "$" },
    image_url: "/themes/ecommerce/fashion/11.webp"
  },
  {
    id: 102,
    title: "Monolith Chelsea Boots",
    slug: "monolith-chelsea-boots",
    description: "Crafted from brushed full-grain box calfskin leather with a bold thick lugged rubber sole and elasticated side gussets. A structural statement for any silhouette.",
    price: 850.00,
    category_id: 1,
    pricing: { base_price: 850.00, sale_price: 850.00, current_price: 850.00, formatted: "$850.00", currency_symbol: "$" },
    image_url: "/themes/ecommerce/fashion/12.webp"
  },
  {
    id: 103,
    title: "Satin Evening Gown",
    slug: "satin-evening-gown",
    description: "A floor-length satin evening gown cut on the bias with an elegant cowl neckline, criss-cross back straps, and subtle side slit details.",
    price: 2400.00,
    category_id: 1,
    pricing: { base_price: 2400.00, sale_price: 2400.00, current_price: 2400.00, formatted: "$2,400.00", currency_symbol: "$" },
    image_url: "/themes/ecommerce/fashion/13.webp"
  },
  {
    id: 104,
    title: "Oversized Cashmere Coat",
    slug: "oversized-cashmere-coat",
    description: "Woven in Italy from brushed pure cashmere. Generous oversized proportions, dropped shoulders, deep patch pockets, and premium horn buttons.",
    price: 3200.00,
    category_id: 1,
    pricing: { base_price: 3200.00, sale_price: 3200.00, current_price: 3200.00, formatted: "$3,200.00", currency_symbol: "$" },
    image_url: "/themes/ecommerce/fashion/14.webp"
  },
  {
    id: 105,
    title: "Textured Knit Sweater",
    slug: "textured-knit-sweater",
    description: "Heavy-gauge organic cotton and linen ribbed blend with a raised mock collar, extended rib knit cuffs, and a high-low structural drop hem.",
    price: 450.00,
    category_id: 1,
    pricing: { base_price: 450.00, sale_price: 450.00, current_price: 450.00, formatted: "$450.00", currency_symbol: "$" },
    image_url: "/themes/ecommerce/fashion/15.webp"
  },
  {
    id: 106,
    title: "Pleated Architecture Skirt",
    slug: "pleated-architecture-skirt",
    description: "Structured box pleats engineered from crisp wool-blend twill. Asymmetric draped silhouette edge with a concealed side zipper.",
    price: 980.00,
    category_id: 1,
    pricing: { base_price: 980.00, sale_price: 980.00, current_price: 980.00, formatted: "$980.00", currency_symbol: "$" },
    image_url: "/themes/ecommerce/fashion/16.webp"
  }
];

type FashionProduct = Product & {
  media?: { featured_image?: string | null } | null;
};

export default function Page() {
  const themeLink = useEcommerceThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const heroEyebrow        = useThemeContent('hero.eyebrow',            'Fall / Winter 2026');
  const heroTitle          = useThemeContent('hero.title',              'Silent\nLuxury.');
  const heroCtaLabel       = useThemeContent('hero.primary_cta_label',  'Explore Editorial');
  const heroImage          = useThemeMedia('hero.image',                '/themes/ecommerce/fashion/17.webp');
  const sideImageOne       = useThemeMedia('hero.side_image_1',         '/themes/ecommerce/fashion/18.webp');
  const sideImageOneLabel  = useThemeContent('hero.side_image_1_label', 'Accessories 01');
  const sideImageTwo       = useThemeMedia('hero.side_image_2',         '/themes/ecommerce/fashion/19.webp');
  const sideImageTwoLabel  = useThemeContent('hero.side_image_2_label', 'Ready to Wear 04');
  const collectionEyebrow  = useThemeContent('collection.eyebrow',      'The Autumn Capsule');
  const collectionTitle    = useThemeContent('collection.title',        'Lookbook 26.');
  const philosophyQuote    = useThemeContent(
    'philosophy.quote',
    'We do not build garments. We architect confidence through the precision of silhouette and the purity of material.',
  );
  const philosophyEyebrow  = useThemeContent('philosophy.eyebrow',     'ATELIER PHILOSOPHY');

  const [products, setProducts] = useState<FashionProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

    return () => { isMounted = false; };
  }, [allowDemo]);

  return (
    <div className="ef-section">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes efShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .ef-shimmer-card {
          background: linear-gradient(90deg, #f2f2f2 25%, #f9f9f9 50%, #f2f2f2 75%);
          background-size: 200% 100%;
          animation: efShimmer 1.8s ease-in-out infinite;
        }
      ` }} />

      {/* Editorial Fashion Hero */}
      <section className="ef-hero">
        <div className="ef-hero-main">
          <img src={heroImage} alt="" className="ef-hero-img" />
          <div className="ef-hero-caption">
            <div className="ef-mono">{heroEyebrow}</div>
            <h1 className="ef-heading-xl" style={{ color: 'white' }}>
              {heroTitle.split('\n').map((line, index) => (
                <React.Fragment key={`${line}-${index}`}>
                  {index > 0 && <br />}
                  {index > 0 ? <span className="ef-italic">{line}</span> : line}
                </React.Fragment>
              ))}
            </h1>
            <div className="ef-hero-cta">
              <a href={themeLink('/explore')} className="ef-btn-primary" style={{ background: 'white', color: 'black', textDecoration: 'none', display: 'inline-block' }}>
                {heroCtaLabel}
              </a>
            </div>
          </div>
        </div>
        <div className="ef-hero-side">
          <div className="ef-hero-side-panel">
            <img src={sideImageOne} alt="" className="ef-hero-img" />
            <div className="ef-hero-side-caption">
              <div className="ef-mono" style={{ fontSize: '0.55rem', color: 'white' }}>{sideImageOneLabel}</div>
            </div>
          </div>
          <div className="ef-hero-side-panel">
            <img src={sideImageTwo} alt="" className="ef-hero-img" />
            <div className="ef-hero-side-caption">
              <div className="ef-mono" style={{ fontSize: '0.55rem', color: 'white' }}>{sideImageTwoLabel}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Store metrics strip */}
      <section className="ef-metrics-grid">
        <TrendHUD label="PIECES" value={products.length ? products.length.toString().padStart(2, '0') : '—'} />
        <TrendHUD label="DESIGN HOUSES" value="6" />
        <TrendHUD label="FREE RETURNS" value="ALWAYS" />
        <TrendHUD label="WORLDWIDE SHIPPING" value="EXPRESS" />
      </section>

      {apiError && useFallback && (
        <div style={{ maxWidth: '1200px', margin: '0 auto 8rem', padding: '0 6%' }}>
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ef" />
        </div>
      )}
      {apiError && !useFallback && (
        <div style={{ maxWidth: '1200px', margin: '0 auto 8rem', padding: '0 6%' }}>
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="ef" />
        </div>
      )}

      {/* Lookbook collection */}
      <section>
        <div className="ef-lookbook-header">
          <div className="ef-mono" style={{ marginBottom: '2rem' }}>{collectionEyebrow}</div>
          <h2 className="ef-heading-xl">{collectionTitle}</h2>
        </div>

        <div className="ef-lookbook-grid">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="ef-look-card" style={{ cursor: 'default' }}>
                <div className="ef-img-frame ef-shimmer-card" style={{ border: 'none' }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <div className="ef-shimmer-card" style={{ width: '40%', height: '8px' }} />
                  <div className="ef-shimmer-card" style={{ width: '70%', height: '14px' }} />
                  <div className="ef-shimmer-card" style={{ width: '25%', height: '10px' }} />
                </div>
              </div>
            ))
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '6rem 2rem', border: '1px solid var(--ef-border)' }}>
              <div className="ef-mono" style={{ marginBottom: '1rem' }}>EMPTY COLLECTION</div>
              <h3 style={{ fontFamily: 'var(--ef-serif)', fontSize: '2rem' }}>No products available yet.</h3>
              <p style={{ opacity: 0.6, marginTop: '1rem' }}>Publish products in the admin and they will appear here.</p>
              <a href={themeLink('/explore')} className="ef-btn-primary" style={{ display: 'inline-block', marginTop: '2rem', textDecoration: 'none' }}>
                Browse collection
              </a>
            </div>
          ) : (
            products.map((item, i: number) => {
              const priceFormatted = item.pricing?.formatted ||
                (typeof item.price === 'number' ? `$${item.price.toLocaleString()}` : item.price);
              const activeImage = item.image_url || item.media?.featured_image || `/themes/ecommerce/fashion/${(i % 6) + 11}.webp`;

              return (
                <a key={item.slug || i} href={themeLink(`/product/${item.slug}`)} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
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

      {/* Philosophy */}
      <section className="ef-philosophy-section">
        <div className="ef-philosophy-inner">
          <h2>&quot;{philosophyQuote}&quot;</h2>
          <div className="ef-philosophy-divider" />
          <div className="ef-mono" style={{ opacity: 0.5 }}>{philosophyEyebrow}</div>
        </div>
      </section>

      <div style={{ height: '15rem' }}></div>
    </div>
  );
}
