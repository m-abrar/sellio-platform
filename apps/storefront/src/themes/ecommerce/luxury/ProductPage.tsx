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
import { LuxuryHeader } from './components';

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
      <>
        <LuxuryHeader />
        <div className="ecl-detail-page" aria-busy="true">
          <div className="ecl-detail-back-skeleton" />
          <section className="ecl-detail-grid">
            <div className="ecl-detail-media ecl-detail-skeleton" />
            <div className="ecl-detail-panel">
              <div className="ecl-detail-line ecl-detail-line-small" />
              <div className="ecl-detail-line ecl-detail-line-title" />
              <div className="ecl-detail-line ecl-detail-line-price" />
              <div className="ecl-detail-line ecl-detail-line-copy" />
              <div className="ecl-detail-line ecl-detail-line-copy" />
              <div className="ecl-detail-line ecl-detail-line-button" />
            </div>
          </section>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <LuxuryHeader />
        <div className="ecl-detail-page">
          <section className="ecl-detail-state" role="status">
            <div className="ecl-detail-kicker">Piece unavailable</div>
            <h1>Product could not be loaded.</h1>
            <p>{apiError || 'The requested product does not exist or has been removed.'}</p>
            <a href={themeLink('/explore')} className="ecl-btn-gold ecl-detail-return">
              Browse collection
            </a>
          </section>
        </div>
      </>
    );
  }

  return (
    <>
      <LuxuryHeader />
      <div className="ecl-detail-page">
        <a href={themeLink('/')} className="ecl-detail-back">
          <span aria-hidden="true">&larr;</span>
          Back to maison
        </a>

        {useFallback && apiError && (
          <div className="ecl-alert-slot">
            <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ecl" />
          </div>
        )}

        <section className="ecl-detail-grid" aria-labelledby="ecl-detail-title">
          <div className="ecl-detail-media">
            <img
              src={getProductImage(product, PRODUCT_DETAIL_PLACEHOLDER)}
              alt={product.title}
            />
          </div>

          <article className="ecl-detail-panel">
            <div className="ecl-detail-kicker">Maison Piece #{product.id}</div>
            <h1 id="ecl-detail-title" className="ecl-heading">
              {product.title}
            </h1>
            <div className="ecl-detail-price">{formatProductPrice(product)}</div>

            <div className="ecl-detail-rule" />

            <div>
              <h2>Craft notes</h2>
              <p>
                {product.description ||
                  'This live product record is synchronized from the Sellio catalog and prepared for a refined luxury storefront presentation.'}
              </p>
            </div>

            <div className="ecl-detail-specs" aria-label="Product metadata">
              <div>
                <span>Category</span>
                <strong>{product.category_id ? `#${product.category_id}` : 'Signature'}</strong>
              </div>
              <div>
                <span>Reference</span>
                <strong>{product.slug}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>Available</strong>
              </div>
            </div>

            <button
              type="button"
              className="ecl-btn-gold ecl-detail-action"
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? 'Adding piece...' : 'Add to bag'}
            </button>

            {cartNotice && (
              <p className="ecl-cart-notice" role="status">
                Added to bag.{' '}
                <a href={themeLink('/cart')} className="ecl-cart-notice__link">
                  View bag
                </a>
              </p>
            )}
          </article>
        </section>
      </div>
    </>
  );
}
