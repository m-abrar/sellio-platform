'use client';

import React, { useEffect, useState } from 'react';
import type { Product } from '@sellio/types';
import { CatalogSyncAlert } from '@/themes/ecommerce/shared/CatalogSyncAlert';
import { fetchProductDetail, resolveProductFailure } from '@/themes/ecommerce/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/ecommerce/shared/useDemoFallbackAllowed';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';
import { addProductToCart } from '@/themes/unifieds/shared/cart';
import {
  formatProductPrice,
  getProductImage,
  PRODUCT_DETAIL_PLACEHOLDER,
} from '@/themes/unifieds/shared/product-utils';

interface ProductPageProps {
  slug: string;
}

export default function ProductPage({ slug }: ProductPageProps) {
  const themeLink = useEcommerceThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartNotice, setCartNotice] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      setLoading(true);
      const result = await fetchProductDetail(slug);

      if (!isMounted) return;

      if (result.ok) {
        setProduct(result.data);
        setUseFallback(false);
        setApiError(null);
      } else {
        setApiError(result.error);
        const resolution = resolveProductFailure(slug, allowDemo);
        if (resolution.mode === 'demo') {
          setProduct(resolution.product);
          setUseFallback(true);
        } else {
          setProduct(null);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [slug, allowDemo]);

  const handleAddToCart = () => {
    if (!product) return;

    setAddingToCart(true);
    addProductToCart(product);
    setCartNotice(true);
    setAddingToCart(false);
  };

  if (loading) {
    return (
      <main className="ed-detail-page" aria-busy="true">
        <div className="ed-detail-back-skeleton" />
        <section className="ed-detail-grid">
          <div className="ed-detail-media ed-detail-skeleton" />
          <div className="ed-detail-panel">
            <div className="ed-detail-line ed-detail-line-small" />
            <div className="ed-detail-line ed-detail-line-title" />
            <div className="ed-detail-line ed-detail-line-price" />
            <div className="ed-detail-line ed-detail-line-copy" />
            <div className="ed-detail-line ed-detail-line-copy" />
            <div className="ed-detail-line ed-detail-line-button" />
          </div>
        </section>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="ed-detail-page">
        <section className="ed-detail-state" role="status">
          <div className="ed-mono" style={{ marginBottom: '1rem' }}>
            Product unavailable
          </div>
          <h1>Product could not be loaded.</h1>
          <p>
            {apiError || 'The requested product does not exist or has been removed.'}
          </p>
          <a href={themeLink('/explore')} className="ed-btn-primary ed-inline-cta">
            Browse collection
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="ed-detail-page">
      <a href={themeLink('/')} className="ed-detail-back">
        <span aria-hidden="true">&larr;</span>
        Back to shop
      </a>

      {useFallback && apiError && (
        <div className="ed-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ed" />
        </div>
      )}

      <section className="ed-detail-grid" aria-labelledby="ed-detail-title">
        <div className="ed-detail-media">
          <img src={getProductImage(product, PRODUCT_DETAIL_PLACEHOLDER)} alt={product.title} />
        </div>

        <article className="ed-detail-panel">
          <div className="ed-mono">SKU-{String(product.id).padStart(4, '0')}</div>
          <h1 id="ed-detail-title">{product.title}</h1>
          <div className="ed-detail-price">{formatProductPrice(product)}</div>

          <div className="ed-detail-rule" />

          <div>
            <h2>Description</h2>
            <p>
              {product.description ||
                'This product is available from the Sellio catalog with pricing, stock, and checkout handled by the storefront.'}
            </p>
          </div>

          <div className="ed-detail-specs" aria-label="Product metadata">
            <div>
              <span>Category</span>
              <strong>{product.category_id ? `#${product.category_id}` : 'General'}</strong>
            </div>
            <div>
              <span>Slug</span>
              <strong>{product.slug}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>Live</strong>
            </div>
          </div>

          <button
            type="button"
            className="ed-btn-primary ed-detail-action"
            onClick={handleAddToCart}
            disabled={addingToCart}
          >
            {addingToCart ? 'Adding...' : 'Add to cart'}
          </button>

          {cartNotice && (
            <p className="ed-cart-notice" role="status">
              Added to cart.{' '}
              <a href={themeLink('/cart')} className="ed-cart-notice__link">
                View cart
              </a>
            </p>
          )}
        </article>
      </section>
    </main>
  );
}
