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

        console.error('Failed to load unified interactive product details:', error);
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
      console.error('Failed to persist unified interactive cart item:', error);
      setCartNotice('Unable to update your cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <main className="ui-detail-page" aria-busy="true">
        <div className="ui-detail-back-skeleton" />
        <section className="ui-detail-grid">
          <div className="ui-detail-media ui-detail-skeleton" />
          <div className="ui-detail-panel">
            <div className="ui-detail-line ui-detail-line-small" />
            <div className="ui-detail-line ui-detail-line-title" />
            <div className="ui-detail-line ui-detail-line-price" />
            <div className="ui-detail-line ui-detail-line-copy" />
            <div className="ui-detail-line ui-detail-line-button" />
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage || !product) {
    return (
      <main className="ui-detail-page">
        <section className="ui-detail-state" role="status">
          <div className="ui-mono" style={{ color: 'var(--ui-accent)', marginBottom: '1rem' }}>MOTION_UNAVAILABLE</div>
          <h1>Listing details could not be loaded.</h1>
          <p>{errorMessage || 'The requested listing does not exist or has been removed.'}</p>
          <a href={themeLink('/')} className="motion-btn-primary">Return to Motion Feed</a>
        </section>
      </main>
    );
  }

  return (
    <main className="ui-detail-page">
      <a href={themeLink('/')} className="ui-detail-back">
        <span aria-hidden="true">←</span>
        Back to Motion Feed
      </a>

      <section className="ui-detail-grid" aria-labelledby="ui-detail-page-title">
        <div className="ui-detail-media">
          <img src={getProductImage(product, PRODUCT_DETAIL_PLACEHOLDER)} alt={product.title} />
        </div>

        <article className="ui-detail-panel">
          <div className="ui-mono" style={{ color: 'var(--ui-accent)' }}>MOTION_{product.id}</div>
          <h1 id="ui-detail-page-title">{product.title}</h1>
          <div className="ui-detail-price">{formatProductPrice(product)}</div>

          <div className="ui-detail-rule" />

          <div>
            <h2>Description</h2>
            <p>{product.description || 'No description provided.'}</p>
          </div>

          <div className="ui-detail-specs" aria-label="Listing metadata">
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

          <div className="ui-detail-actions">
            <button type="button" className="motion-btn-primary ui-detail-action" onClick={handleAddToCart} disabled={addingToCart}>
              {addingToCart ? 'ADDING...' : 'ADD TO CART'}
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
