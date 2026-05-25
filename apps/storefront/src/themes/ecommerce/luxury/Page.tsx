'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Product } from '@sellio/types';
import { LuxuryHeader, LuxuryFooter } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='820' viewBox='0 0 640 820'><rect width='100%' height='100%' fill='%23faf9f8'/><rect x='70' y='70' width='500' height='680' rx='2' fill='%23ffffff' stroke='%23e8e6e1'/><g transform='translate(288,348)' stroke='%23d4af37' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><path d='M32 4 60 32 32 60 4 32z'/><path d='M18 18h28v28H18z'/></g><text x='50%' y='58%' dominant-baseline='middle' text-anchor='middle' font-family='Montserrat, Arial, sans-serif' font-size='12' font-weight='600' letter-spacing='3' fill='%23767676'>MAISON PIECE</text></svg>";

export default function Page() {
  const heroSubtitle = useThemeContent('hero.subtitle', 'The High Jewelry Collection');
  const heroTitle = useThemeContent('hero.title', 'CELESTIAL\nELEGANCE');
  const heroCta = useThemeContent('hero.primary_cta_label', 'Discover the Collection');
  const collectionTitle = useThemeContent('collection.title', 'Signature Creations');
  const collectionDescription = useThemeContent('collection.description', 'Exquisite craftsmanship meets timeless design');
  const offlineKicker = useThemeContent('sync.offline_kicker', 'Collection Sync Offline');
  const offlineTitle = useThemeContent('sync.offline_title', 'Signature creations could not be loaded.');
  const emptyKicker = useThemeContent('empty.kicker', 'Private Catalog');
  const emptyTitle = useThemeContent('empty.title', 'No live masterpieces are published yet.');
  const emptyDescription = useThemeContent('empty.description', 'Add product records in the backend and this showcase will hydrate automatically.');
  const productCta = useThemeContent('collection.product_cta_label', 'View Piece');
  const viewAllCta = useThemeContent('collection.view_all_label', 'View All Masterpieces');
  const storyTitle = useThemeContent('story.title', 'Artistry in Every Detail');
  const storyDescription = useThemeContent('story.description', 'For over a century, our master artisans have poured their passion into every facet. We source only the rarest gems, setting them in designs that transcend time and trend. Experience the weight of true luxury.');
  const storyCta = useThemeContent('story.cta_label', 'Explore Our Heritage');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const fetchedProducts = await api.getProducts();
        if (!isMounted) {
          return;
        }

        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
        setProductError(null);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load ecommerce luxury products:', error);
        setProductError(error instanceof Error ? error.message : 'The collection is temporarily unavailable.');
      } finally {
        if (isMounted) {
          setLoadingProducts(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const getProductImage = (product: Product) => (
    product.media?.featured_image || product.image_url || placeholderImage
  );

  const formatPrice = (product: Product) => (
    product.pricing?.formatted || (product.price ? `$${Number(product.price).toLocaleString()}` : 'Price on request')
  );

  return (
    <div className="ecommerce-luxury-wrapper">
      <LuxuryHeader />

      {/* Hero */}
      <section className="ecl-hero">
        <div className="ecl-hero-content">
            <h2 className="ecl-hero-subtitle">{heroSubtitle}</h2>
            <h1 className="ecl-heading ecl-hero-title">{heroTitle.split('\n').map((line, index, lines) => <React.Fragment key={`${line}-${index}`}>{line}{index < lines.length - 1 ? <br /> : null}</React.Fragment>)}</h1>
            <a href="#explore" className="ecl-btn-gold">{heroCta}</a>
        </div>
      </section>

      {/* Signature Pieces */}
      <section className="ecl-section" id="explore">
        <div className="ecl-section-header">
            <h2 className="ecl-heading ecl-section-title">{collectionTitle}</h2>
            <p style={{ color: 'var(--ecl-text-muted)', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>{collectionDescription}</p>
        </div>
        <div className="ecl-grid">
            {loadingProducts ? (
              [1, 2, 3].map((item) => (
                <div className="ecl-product-card ecl-product-skeleton" key={item}>
                  <div className="ecl-product-img-wrap" />
                  <div className="ecl-product-title" />
                  <div className="ecl-product-price" />
                </div>
              ))
            ) : productError ? (
              <div className="ecl-product-state">
                <div className="ecl-product-kicker">{offlineKicker}</div>
                <h3>{offlineTitle}</h3>
                <p>{productError}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="ecl-product-state">
                <div className="ecl-product-kicker">{emptyKicker}</div>
                <h3>{emptyTitle}</h3>
                <p>{emptyDescription}</p>
              </div>
            ) : (
              products.slice(0, 6).map((product) => (
                <a href={`/product/${product.slug}`} className="ecl-product-card" key={product.id}>
                  <div className="ecl-product-img-wrap">
                    <img src={getProductImage(product)} className="ecl-product-img" alt={product.title} />
                    <span className="ecl-add-to-cart">{productCta}</span>
                  </div>
                  <h3 className="ecl-product-title">{product.title}</h3>
                  <p className="ecl-product-price">{formatPrice(product)}</p>
                </a>
              ))
            )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '5rem' }}>
            <a href="#" className="ecl-btn-gold" style={{ color: 'var(--ecl-text-dark)', borderColor: 'var(--ecl-border)' }}>{viewAllCta}</a>
        </div>
      </section>

      {/* Lookbook Split */}
      <section className="ecl-split">
        <div className="ecl-split-img"></div>
        <div className="ecl-split-content">
            <h2 className="ecl-heading" style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>{storyTitle}</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 2, color: 'rgba(255,255,255,0.7)', marginBottom: '3rem' }}>
                {storyDescription}
            </p>
            <a href="#" className="ecl-btn-gold" style={{ color: '#fff', borderColor: '#fff' }}>{storyCta}</a>
        </div>
      </section>

      <LuxuryFooter />
    </div>
  );
}
