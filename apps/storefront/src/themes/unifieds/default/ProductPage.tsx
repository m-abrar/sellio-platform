'use client';

import React, { useEffect, useState } from 'react';
import type { Category, Product } from '@sellio/types';
import { CatalogSyncAlert } from '@/themes/unifieds/shared/CatalogSyncAlert';
import { loadProductDetailPage } from '@/themes/unifieds/shared/catalog';
import { addProductToCart } from '@/themes/unifieds/shared/cart';
import {
  formatProductPrice,
  getProductCategoryLabel,
  getProductImage,
  isProductInStock,
  PRODUCT_DETAIL_PLACEHOLDER,
} from '@/themes/unifieds/shared/product-utils';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';

interface ProductPageProps {
  slug: string;
}

export default function ProductPage({ slug }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartNotice, setCartNotice] = useState<string | null>(null);
  const themeLink = useUnifiedThemeLink();

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      setLoading(true);
      setNotFound(false);
      const result = await loadProductDetailPage(slug);

      if (!isMounted) {
        return;
      }

      if (result.mode === 'live' && result.product) {
        setProduct(result.product);
        setRelated(result.related);
        setCategories(result.categories);
        setApiError(null);
      } else if (result.mode === 'not-found') {
        setProduct(null);
        setRelated([]);
        setCategories([]);
        setNotFound(true);
        setApiError(result.alertError);
      } else {
        setProduct(null);
        setRelated([]);
        setCategories([]);
        setNotFound(false);
        setApiError(result.alertError);
      }

      setLoading(false);
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
      setCartNotice(`"${product.title}" was added to your cart.`);
    } catch (error) {
      console.error('Failed to persist unified default cart item:', error);
      setCartNotice('Unable to update your cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <main className="ud-detail-page" aria-busy="true">
        <div className="ud-detail-back-skeleton" />
        <section className="ud-detail-grid">
          <div className="ud-detail-media ud-detail-skeleton" />
          <div className="ud-detail-panel">
            <div className="ud-detail-line ud-detail-line-small" />
            <div className="ud-detail-line ud-detail-line-title" />
            <div className="ud-detail-line ud-detail-line-price" />
            <div className="ud-detail-line ud-detail-line-copy" />
            <div className="ud-detail-line ud-detail-line-copy" />
            <div className="ud-detail-line ud-detail-line-button" />
          </div>
        </section>
      </main>
    );
  }

  if (notFound || !product) {
    return (
      <main className="ud-detail-page">
        <section className="ud-detail-state" role="status">
          <div className="ud-mono ud-section-eyebrow">RECORD_UNAVAILABLE</div>
          <h1>Listing details could not be loaded.</h1>
          <p>{apiError || 'The requested listing does not exist or has been removed.'}</p>
          <a href={themeLink('/explore')} className="core-btn-primary ud-empty-cta">
            Browse catalog directory
          </a>
        </section>
      </main>
    );
  }

  const categoryLabel = getProductCategoryLabel(product, categories);
  const inStock = isProductInStock(product);

  return (
    <main className="ud-detail-page">
      <a href={themeLink('/')} className="ud-detail-back">
        <span aria-hidden="true">←</span>
        Back to Core Feed
      </a>

      {apiError && (
        <div className="ud-alert-slot">
          <CatalogSyncAlert error={apiError} />
        </div>
      )}

      <section className="ud-detail-grid" aria-labelledby="ud-detail-title">
        <div className="ud-detail-media">
          <img src={getProductImage(product, PRODUCT_DETAIL_PLACEHOLDER)} alt={product.title} />
        </div>

        <article className="ud-detail-panel">
          <div className="ud-mono ud-section-eyebrow">{categoryLabel}</div>
          <h1 id="ud-detail-title">{product.title}</h1>
          <div className="ud-detail-price">{formatProductPrice(product)}</div>

          <div className="ud-detail-badges">
            <span className={`ud-detail-badge ${inStock ? 'ud-detail-badge--success' : ''}`}>
              {inStock ? 'In stock' : 'Out of stock'}
            </span>
            <span className="ud-detail-badge">Live catalog record</span>
          </div>

          <div className="ud-detail-rule" />

          <div>
            <h2>Description</h2>
            <p>{product.description || 'No description provided.'}</p>
          </div>

          <div className="ud-detail-specs" aria-label="Listing metadata">
            <div>
              <span>Category</span>
              <strong>{categoryLabel}</strong>
            </div>
            <div>
              <span>Record</span>
              <strong>{product.slug}</strong>
            </div>
            <div>
              <span>Availability</span>
              <strong>{inStock ? 'Available' : 'Unavailable'}</strong>
            </div>
          </div>

          <div className="ud-detail-actions">
            <button
              type="button"
              className="core-btn-primary ud-detail-action"
              onClick={handleAddToCart}
              disabled={addingToCart || !inStock}
            >
              {addingToCart ? 'ADDING RECORD' : inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
            </button>
            {cartNotice ? (
              <p className="ud-detail-cart-notice">
                {cartNotice}{' '}
                <a href={themeLink('/cart')}>View cart</a>
              </p>
            ) : null}
          </div>
        </article>
      </section>

      {related.length > 0 && (
        <section className="ud-related-section" aria-labelledby="ud-related-title">
          <div className="ud-related-header">
            <div className="ud-mono ud-section-eyebrow">RELATED_REGISTRY</div>
            <h2 id="ud-related-title">More in {categoryLabel}</h2>
          </div>
          <div className="ud-related-grid">
            {related.map((item) => (
              <a href={themeLink(`/product/${item.slug}`)} className="ud-related-card" key={item.id}>
                <div className="ud-related-image-wrap">
                  <img src={getProductImage(item, PRODUCT_DETAIL_PLACEHOLDER)} alt={item.title} />
                </div>
                <div className="ud-related-body">
                  <h3>{item.title}</h3>
                  <span>{formatProductPrice(item)}</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
