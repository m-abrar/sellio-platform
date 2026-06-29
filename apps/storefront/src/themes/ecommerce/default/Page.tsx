'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { Product } from '@/types';
import { CategoryRibbon, EcommerceProductCard } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/ecommerce/shared/CatalogSyncAlert';
import { fetchProductsCatalog, resolveProductsFailure } from '@/themes/ecommerce/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/ecommerce/shared/useDemoFallbackAllowed';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';

const shopAdvantages = [
  {
    title: 'Verified products',
    detail: 'Live catalog records with clear price, stock, and product detail states.',
    icon: 'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  },
  {
    title: 'Fast checkout',
    detail: 'Cart, order review, and payment handoff are ready for buyer flow testing.',
    icon: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.17 14.75h9.9c.75 0 1.41-.41 1.75-1.03L22 7H6.21L5.27 5H2V3h4.54l1.2 2.55L10.1 11h6.45l1.1-2H9.1L7.17 14.75z',
  },
  {
    title: 'Responsive storefront',
    detail: 'A cleaner shopping surface across desktop, tablet, and mobile breakpoints.',
    icon: 'M4 6h16v10H4V6zm0-2c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h5v2H7v2h10v-2h-2v-2h5c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4z',
  },
];

export default function Page() {
  const themeLink = useEcommerceThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const heroEyebrow = useThemeContent('hero.eyebrow', 'New season essentials');
  const heroTitle = useThemeContent('hero.title', 'Refined\nEssentials for\nModern Life.');
  const heroHighlight = useThemeContent('hero.highlight', 'Modern Life.');
  const heroDescription = useThemeContent(
    'hero.description',
    'Discover a curated selection of premium garments designed with a focus on silhouette, material, and enduring quality.',
  );
  const heroCta = useThemeContent('hero.primary_cta_label', 'Shop Collection');
  const heroImage = useThemeContent('hero.image', '/themes/ecommerce/default/9.webp');
  const heroFeatureEyebrow = useThemeContent('hero.feature_eyebrow', 'Featured pick');
  const heroFeatureTitle = useThemeContent('hero.feature_title', 'Modern wardrobe staples');
  const collectionEyebrow = useThemeContent('collection.eyebrow', 'Fresh arrivals');
  const collectionTitle = useThemeContent('collection.title', 'New\nArrivals.');
  const collectionDescription = useThemeContent(
    'collection.description',
    'Browse live products from your Sellio catalog with clear pricing, stock signals, categories, and direct product detail pages.',
  );
  const offlineKicker = useThemeContent('sync.offline_kicker', 'Catalog unavailable');
  const offlineTitle = useThemeContent('sync.offline_title', 'Products could not be loaded.');
  const emptyKicker = useThemeContent('empty.kicker', 'Empty catalog');
  const emptyTitle = useThemeContent('empty.title', 'No live products are available yet.');
  const emptyDescription = useThemeContent(
    'empty.description',
    'Add product records in the admin panel and they will appear here.',
  );
  const newsletterEyebrow = useThemeContent('newsletter.eyebrow', 'JOIN THE COLLECTIVE');
  const newsletterTitle = useThemeContent('newsletter.title', 'Stay In\nThe Loop.');
  const newsletterDescription = useThemeContent(
    'newsletter.description',
    'Join our collective and be the first to know about new collection drops, exclusive events, and seasonal sales.',
  );
  const newsletterPlaceholder = useThemeContent('newsletter.placeholder', 'Enter your email');
  const newsletterButton = useThemeContent('newsletter.button_label', 'SUBSCRIBE');

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const productCountLabel = useMemo(() => {
    if (loadingProducts) {
      return 'Syncing';
    }

    return products.length > 0 ? products.length.toLocaleString() : 'Ready';
  }, [loadingProducts, products.length]);

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
        <div className="ed-hero-copy">
          <div className="ed-mono ed-hero-kicker">{heroEyebrow}</div>
          <h1 className="ed-heading-xl">
            {heroTitle.split('\n').map((line, index, lines) => (
              <React.Fragment key={`${line}-${index}`}>
                {line === heroHighlight ? <span className="ed-heading-highlight">{line}</span> : line}
                {index < lines.length - 1 ? <br /> : null}
              </React.Fragment>
            ))}
          </h1>
          <p className="ed-hero-description">{heroDescription}</p>

          <div className="ed-hero-actions">
            <a href={themeLink('/explore')} className="ed-btn-primary ed-inline-cta">
              {heroCta}
            </a>
            <a href={themeLink('/cart')} className="ed-btn-secondary ed-inline-cta">
              View cart
            </a>
          </div>

          <div className="ed-hero-stats" aria-label="Storefront snapshot">
            <div>
              <strong>{productCountLabel}</strong>
              <span>live products</span>
            </div>
            <div>
              <strong>Cart</strong>
              <span>buyer ready</span>
            </div>
            <div>
              <strong>Stock</strong>
              <span>inventory signals</span>
            </div>
          </div>
        </div>
        <div className="ed-hero-img-wrapper">
          <img src={heroImage} alt="Hero Lifestyle" className="ed-hero-img" />
          <div className="ed-hero-feature-card">
            <div className="ed-mono">{heroFeatureEyebrow}</div>
            <strong>{heroFeatureTitle}</strong>
            <span>Ready for product detail, cart, and checkout.</span>
          </div>
        </div>
      </section>

      <section className="ed-service-band" aria-label="Store services">
        {shopAdvantages.map((item) => (
          <div key={item.title}>
            <span className="ed-service-icon" aria-hidden="true">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                <path d={item.icon} />
              </svg>
            </span>
            <strong>{item.title}</strong>
            <span>{item.detail}</span>
          </div>
        ))}
      </section>

      <section className="ed-category-strip">
        <CategoryRibbon label="New Arrivals" count="Latest drops" href={themeLink('/explore')} />
        <CategoryRibbon label="Essentials" count="Everyday edit" href={themeLink('/explore')} />
        <CategoryRibbon label="Outerwear" count="Layering pieces" href={themeLink('/explore')} />
        <CategoryRibbon label="Accessories" count="Finishing touches" href={themeLink('/explore')} />
      </section>

      <section className="ed-collection-section">
        <div className="ed-section-heading">
          <div>
            <div className="ed-mono ed-section-kicker">{collectionEyebrow}</div>
            <h2>
              {collectionTitle.split('\n').map((line, index, lines) => (
                <React.Fragment key={`${line}-${index}`}>
                  {line}
                  {index < lines.length - 1 ? <br /> : null}
                </React.Fragment>
              ))}
            </h2>
          </div>
          <div className="ed-section-description">
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
              <div className="ed-mono ed-state-kicker">{offlineKicker}</div>
              <h3>{offlineTitle}</h3>
              <p>Check the API connection or refresh the page.</p>
            </div>
          ) : products.length === 0 ? (
            <div className="ed-product-state">
              <div className="ed-mono ed-state-kicker">{emptyKicker}</div>
              <h3>{emptyTitle}</h3>
              <p>{emptyDescription}</p>
            </div>
          ) : (
            products.slice(0, 8).map((product) => (
              <EcommerceProductCard
                product={product}
                href={themeLink(`/product/${product.slug}`)}
                key={product.id}
                featured={product.id === products[0]?.id}
              />
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

      <section className="ed-newsletter">
        <div className="ed-mono ed-newsletter-kicker">{newsletterEyebrow}</div>
        <h2>
          {newsletterTitle.split('\n').map((line, index, lines) => (
            <React.Fragment key={`${line}-${index}`}>
              {line}
              {index < lines.length - 1 ? <br /> : null}
            </React.Fragment>
          ))}
        </h2>
        <p>{newsletterDescription}</p>
        <div className="ed-newsletter-form">
          <input type="email" placeholder={newsletterPlaceholder} />
          <button type="button" className="ed-btn-primary">
            {newsletterButton}
          </button>
        </div>
      </section>
    </div>
  );
}
