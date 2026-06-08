'use client';

import React, { useEffect, useState } from 'react';
import type { Product } from '@sellio/types';
import { CategoryRibbon } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/ecommerce/shared/CatalogSyncAlert';
import { fetchProductsCatalog, resolveProductsFailure } from '@/themes/ecommerce/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/ecommerce/shared/useDemoFallbackAllowed';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';
import { formatProductPrice, getProductImage } from '@/themes/unifieds/shared/product-utils';

export default function Page() {
  const themeLink = useEcommerceThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const heroEyebrow = useThemeContent('hero.eyebrow', 'SUMMER_COLLECTION_2026_V8');
  const heroTitle = useThemeContent('hero.title', 'Refined\nEssentials for\nModern Life.');
  const heroHighlight = useThemeContent('hero.highlight', 'Modern Life.');
  const heroDescription = useThemeContent(
    'hero.description',
    'Discover a curated selection of premium garments designed with a focus on silhouette, material, and enduring quality.',
  );
  const heroCta = useThemeContent('hero.primary_cta_label', 'Shop Collection');
  const heroImage = useThemeContent('hero.image', '/themes/ecommerce/default/9.webp');
  const heroFeatureEyebrow = useThemeContent('hero.feature_eyebrow', 'FEATURED_NODE');
  const heroFeatureTitle = useThemeContent('hero.feature_title', 'Technical_Shell_v4');
  const collectionEyebrow = useThemeContent('collection.eyebrow', 'CURATED_PRODUCT_REGISTRY');
  const collectionTitle = useThemeContent('collection.title', 'New\nArrivals.');
  const collectionDescription = useThemeContent(
    'collection.description',
    "Our unified protocol synchronizes product availability from the world's most significant garment nodes.",
  );
  const offlineKicker = useThemeContent('sync.offline_kicker', 'PRODUCT_SYNC_OFFLINE');
  const offlineTitle = useThemeContent('sync.offline_title', 'Products could not be synchronized.');
  const emptyKicker = useThemeContent('empty.kicker', 'EMPTY_PRODUCT_REGISTRY');
  const emptyTitle = useThemeContent('empty.title', 'No live products are available yet.');
  const emptyDescription = useThemeContent(
    'empty.description',
    'Add product records in the backend and this collection will hydrate automatically.',
  );
  const newsletterEyebrow = useThemeContent('newsletter.eyebrow', 'JOIN_THE_COLLECTIVE');
  const newsletterTitle = useThemeContent('newsletter.title', 'Stay In\nThe Loop.');
  const newsletterDescription = useThemeContent(
    'newsletter.description',
    'Join our collective and be the first to know about new collection drops, exclusive events, and seasonal sales.',
  );
  const newsletterPlaceholder = useThemeContent('newsletter.placeholder', 'ENTER_EMAIL_NODE');
  const newsletterButton = useThemeContent('newsletter.button_label', 'SUBSCRIBE');

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
        if (resolution.mode === 'demo') {
          setProducts(resolution.products);
          setUseFallback(true);
        } else {
          setProducts([]);
          setUseFallback(false);
        }
      }

      setLoadingProducts(false);
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [allowDemo]);

  return (
    <div className="ed-section">
      <section className="ed-hero">
        <div>
          <div className="ed-mono" style={{ marginBottom: '2.5rem' }}>
            {heroEyebrow}
          </div>
          <h1 className="ed-heading-xl">
            {heroTitle.split('\n').map((line, index, lines) => (
              <React.Fragment key={`${line}-${index}`}>
                {line === heroHighlight ? (
                  <span style={{ color: 'var(--ed-blue)' }}>{line}</span>
                ) : (
                  line
                )}
                {index < lines.length - 1 ? <br /> : null}
              </React.Fragment>
            ))}
          </h1>
          <p
            style={{
              marginTop: '5rem',
              fontSize: '1.25rem',
              color: 'var(--ed-text-muted)',
              lineHeight: 1.8,
              maxWidth: '550px',
            }}
          >
            {heroDescription}
          </p>
          <div style={{ marginTop: '6rem' }}>
            <a href={themeLink('/explore')} className="ed-btn-primary ed-inline-cta">
              {heroCta}
            </a>
          </div>
        </div>
        <div className="ed-hero-img-wrapper">
          <img src={heroImage} alt="Hero Lifestyle" className="ed-hero-img" />
          <div
            style={{
              position: 'absolute',
              bottom: '2rem',
              right: '2rem',
              background: 'white',
              padding: '2rem',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
            }}
          >
            <div className="ed-mono" style={{ fontSize: '0.65rem', marginBottom: '0.5rem' }}>
              {heroFeatureEyebrow}
            </div>
            <div style={{ fontWeight: 800, fontSize: '1rem' }}>{heroFeatureTitle}</div>
          </div>
        </div>
      </section>

      <section
        style={{
          padding: '8rem 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '3rem',
          borderTop: '1px solid var(--ed-border)',
          marginTop: '10rem',
        }}
      >
        <CategoryRibbon label="New Arrivals" count="124" />
        <CategoryRibbon label="Essentials" count="86" />
        <CategoryRibbon label="Outerwear" count="42" />
        <CategoryRibbon label="Accessories" count="156" />
      </section>

      <section style={{ marginTop: '15rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '8rem',
          }}
        >
          <div>
            <div className="ed-mono" style={{ marginBottom: '1.5rem' }}>
              {collectionEyebrow}
            </div>
            <h2
              style={{
                fontSize: '5rem',
                fontWeight: 900,
                letterSpacing: '-2px',
                textTransform: 'uppercase',
              }}
            >
              {collectionTitle.split('\n').map((line, index, lines) => (
                <React.Fragment key={`${line}-${index}`}>
                  {line}
                  {index < lines.length - 1 ? <br /> : null}
                </React.Fragment>
              ))}
            </h2>
          </div>
          <div
            style={{
              textAlign: 'right',
              maxWidth: '400px',
              fontSize: '1rem',
              color: 'var(--ed-text-muted)',
              lineHeight: 1.8,
            }}
          >
            {collectionDescription}
          </div>
        </div>

        {apiError && useFallback && (
          <div className="ed-alert-slot">
            <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ed" />
          </div>
        )}
        {apiError && !useFallback && (
          <div className="ed-alert-slot">
            <CatalogSyncAlert variant="production" error={apiError} classPrefix="ed" />
          </div>
        )}

        <div className="ed-product-grid">
          {loadingProducts ? (
            [1, 2, 3, 4].map((item) => (
              <div className="ed-product-card ed-product-skeleton" key={item}>
                <div className="ed-img-frame" />
                <div className="ed-product-copy">
                  <span />
                  <strong />
                  <em />
                </div>
              </div>
            ))
          ) : apiError && !useFallback ? (
            <div className="ed-product-state">
              <div className="ed-mono" style={{ marginBottom: '1rem' }}>
                {offlineKicker}
              </div>
              <h3>{offlineTitle}</h3>
              <p>{apiError}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="ed-product-state">
              <div className="ed-mono" style={{ marginBottom: '1rem' }}>
                {emptyKicker}
              </div>
              <h3>{emptyTitle}</h3>
              <p>{emptyDescription}</p>
            </div>
          ) : (
            products.slice(0, 8).map((product) => (
              <a
                href={themeLink(`/product/${product.slug}`)}
                className="ed-product-card"
                key={product.id}
              >
                <div className="ed-img-frame">
                  <img src={getProductImage(product)} alt={product.title} className="ed-img" />
                </div>
                <div className="ed-mono" style={{ marginBottom: '0.8rem' }}>
                  PRODUCT_{product.id}
                </div>
                <h3>{product.title}</h3>
                <div className="ed-product-price">{formatProductPrice(product)}</div>
              </a>
            ))
          )}
        </div>

        {!loadingProducts && products.length > 0 && (
          <div className="ed-home-explore-action">
            <a href={themeLink('/explore')} className="ed-btn-primary ed-inline-cta">
              View all products
            </a>
          </div>
        )}
      </section>

      <section
        style={{
          marginTop: '20rem',
          padding: '15rem 10%',
          background: 'var(--ed-frost)',
          borderRadius: '32px',
          textAlign: 'center',
        }}
      >
        <div className="ed-mono" style={{ marginBottom: '3rem' }}>
          {newsletterEyebrow}
        </div>
        <h2
          style={{
            fontSize: '6rem',
            fontWeight: 900,
            letterSpacing: '-4px',
            textTransform: 'uppercase',
            color: 'var(--ed-slate)',
            marginBottom: '4rem',
            lineHeight: 1,
          }}
        >
          {newsletterTitle.split('\n').map((line, index, lines) => (
            <React.Fragment key={`${line}-${index}`}>
              {line}
              {index < lines.length - 1 ? <br /> : null}
            </React.Fragment>
          ))}
        </h2>
        <p
          style={{
            maxWidth: '700px',
            margin: '0 auto 8rem',
            fontSize: '1.25rem',
            color: 'var(--ed-text-muted)',
            lineHeight: 1.8,
          }}
        >
          {newsletterDescription}
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
          <input
            type="email"
            placeholder={newsletterPlaceholder}
            style={{
              flex: 1,
              padding: '1.5rem 2rem',
              borderRadius: '12px',
              border: '1px solid var(--ed-border)',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          />
          <button type="button" className="ed-btn-primary" style={{ padding: '1.5rem 4rem' }}>
            {newsletterButton}
          </button>
        </div>
      </section>

      <div style={{ height: '15rem' }} />
    </div>
  );
}
