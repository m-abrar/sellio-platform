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

        console.error('Failed to load unified marketplace product details:', error);
        setProduct(null);
        setErrorMessage(
          error instanceof Error ? error.message : 'The listing record could not be loaded.',
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
      console.error('Failed to persist unified marketplace cart item:', error);
      setCartNotice('Unable to update your cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <main className="um-detail-page" aria-busy="true">
        <div className="um-detail-back-skeleton" />
        <section className="um-detail-grid">
          <div className="um-detail-media um-detail-skeleton" />
          <div className="um-detail-panel">
            <div className="um-detail-line um-detail-line-small" />
            <div className="um-detail-line um-detail-line-title" />
            <div className="um-detail-line um-detail-line-price" />
            <div className="um-detail-line um-detail-line-copy" />
            <div className="um-detail-line um-detail-line-button" />
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage || !product) {
    return (
      <main className="um-detail-page">
        <section className="um-detail-state" role="status">
          <div className="um-mono" style={{ color: 'var(--um-orange)', marginBottom: '1rem' }}>LISTING_UNAVAILABLE</div>
          <h1>Listing details could not be loaded.</h1>
          <p>{errorMessage || 'The requested listing does not exist or has been removed.'}</p>
          <a href={themeLink('/')} className="um-btn-primary">Return to marketplace</a>
        </section>
      </main>
    );
  }

  return (
    <main className="um-detail-page">
      <a href={themeLink('/')} className="um-detail-back">
        <span aria-hidden="true">&larr;</span>
        Back to marketplace
      </a>

      <section className="um-detail-grid" aria-labelledby="um-detail-page-title">
        <div className="um-detail-media">
          <img src={getProductImage(product, PRODUCT_DETAIL_PLACEHOLDER)} alt={product.title} />
        </div>

        <article className="um-detail-panel">
          <div className="um-mono" style={{ color: 'var(--um-orange)' }}>LISTING_{product.id}</div>
          <h1 id="um-detail-page-title">{product.title}</h1>
          <div className="um-detail-price">{formatProductPrice(product)}</div>

          <div className="um-detail-rule" />

          <div>
            <h2>Description</h2>
            <p>{product.description || 'No description provided.'}</p>
          </div>

          <div className="um-detail-specs" aria-label="Listing metadata">
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

          <div className="um-detail-actions">
            <button type="button" className="um-btn-primary um-detail-action" onClick={handleAddToCart} disabled={addingToCart}>
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
