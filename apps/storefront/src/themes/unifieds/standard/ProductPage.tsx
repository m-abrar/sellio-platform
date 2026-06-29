'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import type { Product } from '@/types';
import { addProductToCart } from '@/themes/unifieds/shared/cart';
import {
  formatProductPrice,
  getProductImage,
  PRODUCT_DETAIL_PLACEHOLDER,
} from '@/themes/unifieds/shared/product-utils';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';

interface ProductPageProps {
  slug: string;
}

export default function ProductPage({ slug }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartNotice, setCartNotice] = useState<string | null>(null);
  const themeLink = useUnifiedThemeLink();

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      try {
        const fetchedProduct = await api.getProductBySlug(slug);
        if (!isMounted) {
          return;
        }

        setProduct(fetchedProduct);
        setErrorMessage(null);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load unified standard product details:', error);
        setProduct(null);
        setErrorMessage(
          error instanceof Error ? error.message : 'The listing record could not be synchronized.',
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
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
      console.error('Failed to persist unified standard cart item:', error);
      setCartNotice('Unable to update your cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <main className="usp-detail-page" aria-busy="true">
        <div className="usp-detail-back-skeleton" />
        <section className="usp-detail-grid">
          <div className="usp-detail-media usp-detail-skeleton" />
          <div className="usp-detail-panel">
            <div className="usp-detail-line usp-detail-line-small" />
            <div className="usp-detail-line usp-detail-line-title" />
            <div className="usp-detail-line usp-detail-line-price" />
            <div className="usp-detail-line usp-detail-line-copy" />
            <div className="usp-detail-line usp-detail-line-button" />
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage || !product) {
    return (
      <main className="usp-detail-page">
        <section className="usp-detail-state" role="status">
          <div className="usp-mono" style={{ color: 'var(--usp-gray)', marginBottom: '1rem' }}>NODE_UNAVAILABLE</div>
          <h1>Listing details could not be loaded.</h1>
          <p>{errorMessage || 'The requested listing does not exist or has been removed.'}</p>
          <a href={themeLink('/')} className="scale-btn-primary">Return to Exchange</a>
        </section>
      </main>
    );
  }

  return (
    <main className="usp-detail-page">
      <a href={themeLink('/')} className="usp-detail-back">
        <span aria-hidden="true">←</span>
        Back to Exchange
      </a>

      <section className="usp-detail-grid" aria-labelledby="usp-detail-page-title">
        <div className="usp-detail-media">
          <img src={getProductImage(product, PRODUCT_DETAIL_PLACEHOLDER)} alt={product.title} />
        </div>

        <article className="usp-detail-panel">
          <div className="usp-mono" style={{ color: 'var(--usp-gray)' }}>NODE_{product.id}</div>
          <h1 id="usp-detail-page-title">{product.title}</h1>
          <div className="usp-detail-price">{formatProductPrice(product)}</div>

          <div className="usp-detail-rule" />

          <div>
            <h2>Description</h2>
            <p>{product.description || 'No description provided.'}</p>
          </div>

          <div className="usp-detail-specs" aria-label="Listing metadata">
            <div>
              <span>Category</span>
              <strong>{product.category_id ? `#${product.category_id}` : 'General'}</strong>
            </div>
            <div>
              <span>Record</span>
              <strong>{product.slug}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>Live</strong>
            </div>
          </div>

          <div className="usp-detail-actions">
            <button type="button" className="scale-btn-primary usp-detail-action" onClick={handleAddToCart} disabled={addingToCart}>
              {addingToCart ? 'ADDING NODE' : 'ADD TO CART'}
            </button>
            {cartNotice ? (
              <p className="uni-detail-cart-notice">
                {cartNotice}{' '}
                <a href={themeLink('/cart')}>View cart</a>
              </p>
            ) : null}
          </div>
        </article>
      </section>
    </main>
  );
}
