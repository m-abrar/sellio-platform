'use client';

import React, { useEffect, useState } from 'react';
import type { Product } from '@/types';
import { LuxuryHeader, LuxuryFooter } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/ecommerce/shared/CatalogSyncAlert';
import { fetchProductsCatalog, resolveProductsFailure } from '@/themes/ecommerce/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/ecommerce/shared/useDemoFallbackAllowed';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';
import { formatProductPrice, getProductImage } from '@/themes/unifieds/shared/product-utils';

export default function Page() {
  const themeLink = useEcommerceThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const heroSubtitle = useThemeContent('hero.subtitle', 'The High Jewelry Collection');
  const heroTitle = useThemeContent('hero.title', 'CELESTIAL\nELEGANCE');
  const heroCta = useThemeContent('hero.primary_cta_label', 'Discover the Collection');
  const collectionTitle = useThemeContent('collection.title', 'Signature Creations');
  const collectionDescription = useThemeContent(
    'collection.description',
    'Exquisite craftsmanship meets timeless design',
  );
  const offlineKicker = useThemeContent('sync.offline_kicker', 'Collection Unavailable');
  const offlineTitle = useThemeContent('sync.offline_title', 'Signature creations could not be loaded.');
  const emptyKicker = useThemeContent('empty.kicker', 'Private Catalog');
  const emptyTitle = useThemeContent('empty.title', 'No live masterpieces are published yet.');
  const emptyDescription = useThemeContent(
    'empty.description',
    'Add product records in the admin panel and they will appear here.',
  );
  const productCta = useThemeContent('collection.product_cta_label', 'View Piece');
  const viewAllCta = useThemeContent('collection.view_all_label', 'View All Masterpieces');
  const storyTitle = useThemeContent('story.title', 'Artistry in Every Detail');
  const storyDescription = useThemeContent(
    'story.description',
    'For over a century, our master artisans have poured their passion into every facet. We source only the rarest gems, setting them in designs that transcend time and trend. Experience the weight of true luxury.',
  );
  const storyCta = useThemeContent('story.cta_label', 'Explore Our Heritage');

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
    <div className="ecommerce-luxury-wrapper">
      <LuxuryHeader />

      <section className="ecl-hero">
        <div className="ecl-hero-content">
          <h2 className="ecl-hero-subtitle">{heroSubtitle}</h2>
          <h1 className="ecl-heading ecl-hero-title">
            {heroTitle.split('\n').map((line, index, lines) => (
              <React.Fragment key={`${line}-${index}`}>
                {line}
                {index < lines.length - 1 ? <br /> : null}
              </React.Fragment>
            ))}
          </h1>
          <a href={themeLink('/explore')} className="ecl-btn-gold">
            {heroCta}
          </a>
        </div>
      </section>

      <section className="ecl-section" id="explore">
        <div className="ecl-section-header">
          <h2 className="ecl-heading ecl-section-title">{collectionTitle}</h2>
          <p
            style={{
              color: 'var(--ecl-text-muted)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              fontSize: '0.85rem',
            }}
          >
            {collectionDescription}
          </p>
        </div>

        {apiError && useFallback && (
          <div className="ecl-alert-slot">
            <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ecl" />
          </div>
        )}
        {apiError && !useFallback && (
          <div className="ecl-alert-slot">
            <CatalogSyncAlert variant="production" error={apiError} classPrefix="ecl" />
          </div>
        )}

        <div className="ecl-grid">
          {loadingProducts ? (
            [1, 2, 3].map((item) => (
              <div className="ecl-product-card ecl-product-skeleton" key={item}>
                <div className="ecl-product-img-wrap" />
                <div className="ecl-product-title" />
                <div className="ecl-product-price" />
              </div>
            ))
          ) : apiError && !useFallback ? (
            <div className="ecl-product-state">
              <div className="ecl-product-kicker">{offlineKicker}</div>
              <h3>{offlineTitle}</h3>
              <p>Check your API connection and confirm products are published in the admin panel.</p>
            </div>
          ) : products.length === 0 ? (
            <div className="ecl-product-state">
              <div className="ecl-product-kicker">{emptyKicker}</div>
              <h3>{emptyTitle}</h3>
              <p>{emptyDescription}</p>
            </div>
          ) : (
            products.slice(0, 6).map((product) => (
              <a
                href={themeLink(`/product/${product.slug}`)}
                className="ecl-product-card"
                key={product.id}
              >
                <div className="ecl-product-img-wrap">
                  <img src={getProductImage(product)} className="ecl-product-img" alt={product.title} />
                  <span className="ecl-add-to-cart">{productCta}</span>
                </div>
                <h3 className="ecl-product-title">{product.title}</h3>
                <p className="ecl-product-price">{formatProductPrice(product)}</p>
              </a>
            ))
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '5rem' }}>
          <a href={themeLink('/explore')} className="ecl-btn-gold" style={{ color: 'var(--ecl-text-dark)', borderColor: 'var(--ecl-border)' }}>
            {viewAllCta}
          </a>
        </div>
      </section>

      <section className="ecl-split">
        <div className="ecl-split-img" />
        <div className="ecl-split-content">
          <h2 className="ecl-heading" style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>
            {storyTitle}
          </h2>
          <p
            style={{
              fontSize: '1.1rem',
              lineHeight: 2,
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '3rem',
            }}
          >
            {storyDescription}
          </p>
          <a href={themeLink('/explore')} className="ecl-btn-gold" style={{ color: '#fff', borderColor: '#fff' }}>
            {storyCta}
          </a>
        </div>
      </section>

      <LuxuryFooter />
    </div>
  );
}
