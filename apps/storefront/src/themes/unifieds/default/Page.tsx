'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { Category, Product } from '@sellio/types';
import { CoreFeatures, GlobalTrust } from './components';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/unifieds/shared/CatalogSyncAlert';
import { countInStockProducts, fetchProductsHome } from '@/themes/unifieds/shared/catalog';
import {
  formatProductPrice,
  getProductCategoryLabel,
  getProductImage,
  PRODUCT_CARD_PLACEHOLDER,
} from '@/themes/unifieds/shared/product-utils';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inventoryTotal, setInventoryTotal] = useState<number | null>(null);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);
  const themeLink = useUnifiedThemeLink();

  const heroEyebrow = useThemeContent('hero.eyebrow', 'Multi-Vertical Marketplace');
  const heroTitle = useThemeContent('hero.title', 'The Core of\nDistribution.');
  const heroHighlight = useThemeContent('hero.highlight', 'Distribution.');
  const heroDescription = useThemeContent(
    'hero.description',
    'A comprehensive marketplace platform for discovering products, properties, services, and more — all in one place.',
  );
  const heroPrimaryCtaLabel = useThemeContent('hero.primary_cta_label', 'Explore listings');
  const heroSecondaryCtaLabel = useThemeContent('hero.secondary_cta_label', 'Browse catalog');
  const heroImage = useThemeMedia('hero.image', '/themes/unifieds/default/1.webp');
  const heroBadgeLabel = useThemeContent('hero.badge_label', 'Live listings');

  const collectionEyebrow = useThemeContent('collection.eyebrow', 'Live Catalog');
  const collectionTitle = useThemeContent('collection.title', 'Featured Listings.');
  const collectionDescription = useThemeContent(
    'collection.description',
    'Browse real listings from the live Sellio catalog.',
  );

  const emptyKicker = useThemeContent('empty.kicker', 'No listings yet');
  const emptyTitle = useThemeContent('empty.title', 'No live listings are available yet.');
  const emptyDescription = useThemeContent(
    'empty.description',
    'Add product records in the admin panel and they will appear here automatically.',
  );

  const ctaTitle = useThemeContent('cta.title', 'Start browsing\ntoday.');
  const ctaDescription = useThemeContent(
    'cta.description',
    'Discover products, properties, services, and more across all categories in one unified marketplace.',
  );
  const ctaButtonLabel = useThemeContent('cta.button_label', 'Browse the catalog');

  useEffect(() => {
    let isMounted = true;

    async function loadListings() {
      setLoadingListings(true);
      const result = await fetchProductsHome({ per_page: 6 });

      if (!isMounted) {
        return;
      }

      if (result.ok) {
        setProducts(result.response.data);
        setInventoryTotal(result.response.meta?.total ?? result.response.data.length);
        setCategories(result.response.sidebar?.categories ?? []);
        setListingError(null);
      } else {
        setProducts([]);
        setCategories([]);
        setInventoryTotal(null);
        setListingError(result.error);
      }

      setLoadingListings(false);
    }

    loadListings();

    return () => {
      isMounted = false;
    };
  }, []);

  const liveStats = useMemo(() => {
    const inStockCount = countInStockProducts(products);

    return {
      inventory: inventoryTotal ?? products.length,
      categories: categories.length,
      inStock: inStockCount,
    };
  }, [categories.length, inventoryTotal, products]);

  const heroBadgeValue =
    inventoryTotal != null ? `${inventoryTotal}` : products.length > 0 ? `${products.length}` : '0';

  return (
    <div>
      <section className="origin-hero" aria-labelledby="ud-hero-title">
        <div>
          <div className="ud-mono ud-hero-eyebrow">{heroEyebrow}</div>
          <h1 className="ud-heading-xl" id="ud-hero-title">
            {heroTitle.split('\n').map((line, index, lines) => {
              const parts = heroHighlight ? line.split(new RegExp(`(${heroHighlight})`, 'g')) : [line];
              return (
                <React.Fragment key={`${line}-${index}`}>
                  {parts.map((part, partIndex) => (
                    <React.Fragment key={`${part}-${partIndex}`}>{part}</React.Fragment>
                  ))}
                  {index < lines.length - 1 ? <br /> : null}
                </React.Fragment>
              );
            })}
          </h1>
          <p className="ud-hero-copy">{heroDescription}</p>
          <div className="ud-hero-buttons">
            <button
              type="button"
              className="core-btn-primary"
              id="ud-btn-explore"
              onClick={() =>
                document.getElementById('ud-listings-section')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              {heroPrimaryCtaLabel}
            </button>
            <a href={themeLink('/explore')} className="ud-hero-secondary-btn" id="ud-btn-spec">
              {heroSecondaryCtaLabel}
            </a>
          </div>
        </div>
        <div className="ud-hero-img-wrapper">
          <div className="ud-hero-img-container">
            <img src={heroImage} alt="Analytics Core Dashboard" className="ud-hero-img" />
          </div>
          <div className="ud-floating-badge">
            <div className="ud-floating-badge-value">{heroBadgeValue}</div>
            <div className="ud-mono ud-floating-badge-label">{heroBadgeLabel}</div>
          </div>
        </div>
      </section>

      <GlobalTrust />

      <section className="ud-stats-grid" aria-label="Catalog metrics">
        <div>
          <div className="ud-stat-value">{liveStats.inventory.toLocaleString()}</div>
          <div className="ud-mono ud-stat-label">Live listings</div>
        </div>
        <div>
          <div className="ud-stat-value">{liveStats.categories.toLocaleString()}</div>
          <div className="ud-mono ud-stat-label">Active categories</div>
        </div>
        <div>
          <div className="ud-stat-value">{liveStats.inStock.toLocaleString()}</div>
          <div className="ud-mono ud-stat-label">In stock now</div>
        </div>
      </section>

      <section className="ud-listings-section" id="ud-listings-section" aria-labelledby="ud-listings-title">
        <div className="ud-listings-header">
          <div className="ud-mono ud-section-eyebrow">{collectionEyebrow}</div>
          <h2 id="ud-listings-title">{collectionTitle}</h2>
          <p>{collectionDescription}</p>
          {!loadingListings && inventoryTotal != null && (
            <p className="ud-listings-meta">{inventoryTotal} records in catalog</p>
          )}
        </div>

        {listingError && (
          <div className="ud-alert-slot">
            <CatalogSyncAlert error={listingError} />
          </div>
        )}

        {loadingListings ? (
          <div className="ud-listings-grid" aria-label="Loading live listings">
            {[1, 2, 3].map((item) => (
              <div className="ud-listing-card ud-listing-skeleton" key={item}>
                <div className="ud-listing-image-wrap" />
                <div className="ud-listing-body">
                  <span />
                  <strong />
                  <em />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="ud-listing-state" role="status">
            <div className="ud-mono ud-section-eyebrow">{emptyKicker}</div>
            <h3>{emptyTitle}</h3>
            <p>{emptyDescription}</p>
            <a href={themeLink('/explore')} className="core-btn-primary ud-empty-cta">
              Open catalog directory
            </a>
          </div>
        ) : (
          <>
            <div className="ud-listings-grid">
              {products.map((product) => (
                <a href={themeLink(`/product/${product.slug}`)} className="ud-listing-card" key={product.id}>
                  <div className="ud-listing-image-wrap">
                    <img src={getProductImage(product, PRODUCT_CARD_PLACEHOLDER)} alt={product.title} />
                  </div>
                  <div className="ud-listing-body">
                    <div className="ud-mono">{getProductCategoryLabel(product, categories)}</div>
                    <h3>{product.title}</h3>
                    <p>
                      {product.description || 'Browse this listing for full details and pricing.'}
                    </p>
                    <div className="ud-listing-meta">
                      <span>{formatProductPrice(product)}</span>
                      <span>View Record</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            {(inventoryTotal ?? 0) > products.length && (
              <div className="ud-listings-footer">
                <a href={themeLink('/explore')} className="ud-hero-secondary-btn">
                  Browse full catalog
                </a>
              </div>
            )}
          </>
        )}
      </section>

      <CoreFeatures />

      <section className="ud-final-cta" aria-labelledby="ud-cta-title">
        <div className="ud-final-cta-inner">
          <h2 id="ud-cta-title">
            {ctaTitle.split('\n').map((line, index, lines) => (
              <React.Fragment key={`${line}-${index}`}>
                {line}
                {index < lines.length - 1 ? <br /> : null}
              </React.Fragment>
            ))}
          </h2>
          <p>{ctaDescription}</p>
          <a href={themeLink('/explore')} className="core-btn-primary ud-final-cta-btn" id="ud-btn-cta-handshake">
            {ctaButtonLabel}
          </a>
        </div>
      </section>
    </div>
  );
}
