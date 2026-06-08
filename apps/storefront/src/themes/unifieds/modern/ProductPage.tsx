'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Product } from '@sellio/types';
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

        console.error('Failed to load unified modern product details:', error);
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
      console.error('Failed to persist unified modern cart item:', error);
      setCartNotice('Unable to update your cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <main className="unp-detail-page" aria-busy="true">
        <div className="unp-detail-back-skeleton" />
        <section className="unp-detail-grid">
          <div className="unp-detail-media unp-detail-skeleton" />
          <div className="unp-detail-panel">
            <div className="unp-detail-line unp-detail-line-small" />
            <div className="unp-detail-line unp-detail-line-title" />
            <div className="unp-detail-line unp-detail-line-price" />
            <div className="unp-detail-line unp-detail-line-copy" />
            <div className="unp-detail-line unp-detail-line-button" />
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage || !product) {
    return (
      <main className="unp-detail-page">
        <section className="unp-detail-state" role="status">
          <div className="unp-mono" style={{ color: 'var(--unp-cyan)', marginBottom: '1rem' }}>NEXUS_UNAVAILABLE</div>
          <h1>Listing details could not be loaded.</h1>
          <p>{errorMessage || 'The requested listing does not exist or has been removed.'}</p>
          <a href={themeLink('/')} className="nexus-btn-primary">Return to Nexus Feed</a>
        </section>
      </main>
    );
  }

  return (
    <main className="unp-detail-page">
      <a href={themeLink('/')} className="unp-detail-back">
        <span aria-hidden="true">←</span>
        Back to Nexus Feed
      </a>

      <section className="unp-detail-grid" aria-labelledby="unp-detail-page-title">
        <div className="unp-detail-media">
          <img src={getProductImage(product, PRODUCT_DETAIL_PLACEHOLDER)} alt={product.title} />
        </div>

        <article className="unp-detail-panel">
          <div className="unp-mono" style={{ color: 'var(--unp-cyan)' }}>NEXUS_{product.id}</div>
          <h1 id="unp-detail-page-title">{product.title}</h1>
          <div className="unp-detail-price">{formatProductPrice(product)}</div>

          <div className="unp-detail-rule" />

          <div>
            <h2>Description</h2>
            <p>{product.description || 'No description provided.'}</p>
          </div>

          <div className="unp-detail-specs" aria-label="Listing metadata">
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

          <div className="unp-detail-actions">
            <button type="button" className="nexus-btn-primary unp-detail-action" onClick={handleAddToCart} disabled={addingToCart}>
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
