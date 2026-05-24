'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import type { Product } from '@sellio/types';
import { EditorialLookCard, TrendHUD } from './components';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';

// Curated high-fidelity mock capsule collection fallbacks
const FALLBACK_COLLECTION: Product[] = [
  {
    id: 101,
    title: "Silk Drape Blazer",
    slug: "silk-drape-blazer",
    description: "Architected with double-breasted closure and refined peak lapels, this blazer is tailored from pure double-faced organic silk drape. Features raw structural silhouette curves and invisible slip pockets.",
    price: 1250.00,
    category_id: 1,
    pricing: {
      base_price: 1250.00,
      sale_price: 1250.00,
      current_price: 1250.00,
      formatted: "$1,250.00",
      currency_symbol: "$"
    },
    image_url: "/themes/ecommerce/fashion/11.webp"
  },
  {
    id: 102,
    title: "Monolith Chelsea Boots",
    slug: "monolith-chelsea-boots",
    description: "Crafted from brushed full-grain box calfskin leather, these monolithic boots highlight a bold thick lugged rubber sole and elasticated side gussets. A structural statement for any silhouette.",
    price: 850.00,
    category_id: 1,
    pricing: {
      base_price: 850.00,
      sale_price: 850.00,
      current_price: 850.00,
      formatted: "$850.00",
      currency_symbol: "$"
    },
    image_url: "/themes/ecommerce/fashion/12.webp"
  },
  {
    id: 103,
    title: "Satin Evening Gown",
    slug: "satin-evening-gown",
    description: "A breathtaking floor-length satin evening gown cut on the bias to hug body contours beautifully. Elegant cowl neckline, delicate criss-cross back straps, and subtle side slit details.",
    price: 2400.00,
    category_id: 1,
    pricing: {
      base_price: 2400.00,
      sale_price: 2400.00,
      current_price: 2400.00,
      formatted: "$2,400.00",
      currency_symbol: "$"
    },
    image_url: "/themes/ecommerce/fashion/13.webp"
  },
  {
    id: 104,
    title: "Oversized Cashmere Coat",
    slug: "oversized-cashmere-coat",
    description: "Woven in Italy from unmatched brushed pure cashmere fibers. Generous oversized proportions, broad dropped shoulders, deep patch pockets, and premium horn buttons.",
    price: 3200.00,
    category_id: 1,
    pricing: {
      base_price: 3200.00,
      sale_price: 3200.00,
      current_price: 3200.00,
      formatted: "$3,200.00",
      currency_symbol: "$"
    },
    image_url: "/themes/ecommerce/fashion/14.webp"
  },
  {
    id: 105,
    title: "Textured Knit Sweater",
    slug: "textured-knit-sweater",
    description: "A heavy-gauge organic cotton and linen ribbed blend. Styled with a raised mock collar, extended rib knit sleeve cuffs, and distinct high-low structural drop side slits.",
    price: 450.00,
    category_id: 1,
    pricing: {
      base_price: 450.00,
      sale_price: 450.00,
      current_price: 450.00,
      formatted: "$450.00",
      currency_symbol: "$"
    },
    image_url: "/themes/ecommerce/fashion/15.webp"
  },
  {
    id: 106,
    title: "Pleated Architecture Skirt",
    slug: "pleated-architecture-skirt",
    description: "Architectural structured box pleats engineered from a crisp wool-blend twill fabric. Designed with an asymmetric draped silhouette edge and a concealed side zipper.",
    price: 980.00,
    category_id: 1,
    pricing: {
      base_price: 980.00,
      sale_price: 980.00,
      current_price: 980.00,
      formatted: "$980.00",
      currency_symbol: "$"
    },
    image_url: "/themes/ecommerce/fashion/16.webp"
  }
];

type FashionProduct = Product & {
  media?: {
    featured_image?: string | null;
  } | null;
};

type ApiSyncError = {
  message?: string;
  code?: string;
  config?: {
    baseURL?: string;
    url?: string;
    method?: string;
  };
  response?: {
    status?: number;
  };
};

export default function Page() {
  const router = useRouter();
  const heroEyebrow = useThemeContent('hero.eyebrow', 'FALL_WINTER_2026_COLLECTION');
  const heroTitle = useThemeContent('hero.title', 'Silent\nLuxury.');
  const heroCtaLabel = useThemeContent('hero.primary_cta_label', 'Explore Editorial');
  const heroImage = useThemeMedia('hero.image', '/themes/ecommerce/fashion/17.webp');
  const sideImageOne = useThemeMedia('hero.side_image_1', '/themes/ecommerce/fashion/18.webp');
  const sideImageOneLabel = useThemeContent('hero.side_image_1_label', 'ACCESSORIES_01');
  const sideImageTwo = useThemeMedia('hero.side_image_2', '/themes/ecommerce/fashion/19.webp');
  const sideImageTwoLabel = useThemeContent('hero.side_image_2_label', 'READY_TO_WEAR_04');
  const collectionEyebrow = useThemeContent('collection.eyebrow', 'THE_AUTUMN_CAPSULE_V8');
  const collectionTitle = useThemeContent('collection.title', 'Lookbook 26.');
  const diagnosticsTitle = useThemeContent('diagnostics.title', 'Atelier Node Connection Alert');
  const diagnosticsDescription = useThemeContent(
    'diagnostics.description',
    'The dynamic Laravel API database is currently offline. Activating premium local node resilience fallback. Loading high-fidelity local catalog backups...',
  );
  const philosophyQuote = useThemeContent(
    'philosophy.quote',
    'We do not build garments. We architect confidence through the precision of silhouette and the purity of material.',
  );
  const philosophyEyebrow = useThemeContent('philosophy.eyebrow', 'ATELIER_PHILOSOPHY_SYNC');
  const [products, setProducts] = useState<FashionProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorTrace, setErrorTrace] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setErrorTrace(null);
        const data = await api.getProducts();
        
        // Filter out non-applicable vertical items if the API returns mixed catalogs,
        // or load them directly. For fallback sync, map them beautifully.
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          // Empty state resilience
          setProducts(FALLBACK_COLLECTION);
        }
      } catch (err: unknown) {
        const apiError = err as ApiSyncError;
        console.error("Atelier Node API Sync Failed:", err);
        // Build robust, descriptive trace content
        const traceInfo = {
          message: apiError.message || "Unknown Connection Exception",
          url: apiError.config?.url ? `${apiError.config.baseURL || ''}${apiError.config.url}` : "v1/products",
          method: apiError.config?.method?.toUpperCase() || "GET",
          status: apiError.response?.status || "TIMEOUT",
          reason: apiError.code || "ERR_NETWORK"
        };
        setErrorTrace(JSON.stringify(traceInfo, null, 2));
        setProducts(FALLBACK_COLLECTION);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const resolveProductUrl = (slug: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        return `/preview/ecommerce_fashion/product/${slug}`;
      }
    }
    return `/product/${slug}`;
  };

  const handleCardClick = (slug: string) => {
    router.push(resolveProductUrl(slug));
  };

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
          <div style={{ position: 'absolute', bottom: '4rem', left: '4rem', color: 'white' }}>
              <div className="ef-mono" style={{ marginBottom: '1.5rem', color: 'white' }}>{heroEyebrow}</div>
              <h1 className="ef-heading-xl" style={{ color: 'white' }}>
                {heroTitle.split('\n').map((line, index) => (
                  <React.Fragment key={`${line}-${index}`}>
                    {index > 0 && <br/>}
                    {index > 0 ? <span className="ef-italic">{line}</span> : line}
                  </React.Fragment>
                ))}
              </h1>
              <div style={{ marginTop: '4rem' }}>
                  <button className="ef-btn-primary" style={{ background: 'white', color: 'black' }}>{heroCtaLabel}</button>
              </div>
          </div>
        </div>
        <div className="ef-hero-side">
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                <img src={sideImageOne} alt="" className="ef-hero-img" />
                <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: 'white' }}>
                    <div className="ef-mono" style={{ fontSize: '0.55rem', color: 'white' }}>{sideImageOneLabel}</div>
                </div>
            </div>
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                <img src={sideImageTwo} alt="" className="ef-hero-img" />
                <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: 'white' }}>
                    <div className="ef-mono" style={{ fontSize: '0.55rem', color: 'white' }}>{sideImageTwoLabel}</div>
                </div>
            </div>
        </div>
      </section>

      {/* Trend HUD Section */}
      <section style={{ padding: '10rem 0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6rem', borderBottom: '1px solid var(--ef-border)', marginBottom: '8rem' }}>
          <TrendHUD label="ACTIVE_CURATIONS" value={products.length ? `0${products.length}` : "00"} />
          <TrendHUD label="ATELIER_NODES" value="08" />
          <TrendHUD label="SILHOUETTE_PRECISION" value="100%" />
          <TrendHUD label="GLOBAL_SYNC" value={errorTrace ? "OFFLINE" : "STABLE"} />
      </section>

      {/* Connection Offline Diagnostics Board */}
      {errorTrace && (
        <div style={{
          background: 'var(--ef-oyster)',
          border: '1px solid var(--ef-champagne)',
          padding: '3rem',
          marginBottom: '8rem',
          maxWidth: '1200px',
          margin: '0 auto 8rem',
          textAlign: 'left',
          fontFamily: 'var(--ef-sans)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <span style={{ color: 'var(--ef-champagne)', fontSize: '1.8rem', fontWeight: 'bold' }}>✦</span>
            <h3 style={{ fontFamily: 'var(--ef-serif)', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>
              {diagnosticsTitle}
            </h3>
          </div>
          
          <p style={{ fontSize: '0.9rem', color: 'var(--ef-ebony)', opacity: 0.8, lineHeight: '1.8', marginBottom: '2rem' }}>
            {diagnosticsDescription}
          </p>

          <div style={{ background: 'white', border: '1px solid var(--ef-border)', padding: '1.5rem' }}>
            <div className="ef-mono" style={{ fontSize: '0.6rem', opacity: 0.5, marginBottom: '0.75rem' }}>
              DATABASE_OFFLINE_DIAGNOSTICS_TRACE
            </div>
            <pre style={{
              margin: 0,
              fontSize: '0.75rem',
              color: '#bd2c00',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              overflowX: 'auto',
              lineHeight: '1.5'
            }}>
              {errorTrace}
            </pre>
          </div>
        </div>
      )}

      {/* Lookbook Registry Section */}
      <section>
          <div style={{ textAlign: 'center', marginBottom: '10rem' }}>
              <div className="ef-mono" style={{ marginBottom: '2rem' }}>{collectionEyebrow}</div>
              <h2 className="ef-heading-xl" style={{ fontSize: '6rem' }}>{collectionTitle}</h2>
          </div>
          
          <div className="ef-lookbook-grid">
            {loading ? (
              // Sleek luxurious shimmer skeletons matching card grid
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
            ) : (
              products.map((item, i: number) => {
                // Safely extract price, mapping fallback correctly
                const priceFormatted = item.pricing?.formatted || 
                  (typeof item.price === 'number' ? `$${item.price.toLocaleString()}` : item.price);
                
                // Set active image, mapping dynamic and static fallbacks gracefully
                const activeImage = item.image_url || item.media?.featured_image || `/themes/ecommerce/fashion/${(i % 6) + 11}.webp`;

                return (
                  <div key={item.slug || i} onClick={() => handleCardClick(item.slug)}>
                    <EditorialLookCard 
                      name={item.title} 
                      price={priceFormatted} 
                      image={activeImage}
                      lookNumber={`LOOK_0${i + 1}`}
                    />
                  </div>
                );
              })
            )}
          </div>
      </section>

      {/* Philosophy Section */}
      <section style={{ marginTop: '20rem', padding: '15rem 10%', background: 'var(--ef-oyster)', textAlign: 'center' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--ef-serif)', fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.3, marginBottom: '4rem' }}>
                  &quot;{philosophyQuote}&quot;
              </h2>
              <div style={{ width: '80px', height: '1px', background: 'var(--ef-champagne)', margin: '0 auto 4rem' }}></div>
              <div className="ef-mono" style={{ opacity: 0.5 }}>{philosophyEyebrow}</div>
          </div>
      </section>
      
      <div style={{ height: '15rem' }}></div>
    </div>
  );
}
