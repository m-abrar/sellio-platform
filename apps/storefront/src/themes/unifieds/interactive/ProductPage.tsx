'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Product } from '@sellio/types';

interface ProductPageProps {
  slug: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='860' height='640' viewBox='0 0 860 640'><rect width='100%' height='100%' fill='%23000000'/><g transform='translate(400,270)' stroke='%23fbbf24' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='60' height='60' rx='10'/><circle cx='20' cy='20' r='6'/><path d='M58 46L42 30 12 60'/></g><text x='50%' y='61%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='13' font-weight='800' letter-spacing='2' fill='%236366f1'>MOTION RECORD</text></svg>";

export default function ProductPage({ slug }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

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
        setErrorMessage(error instanceof Error ? error.message : 'The listing record could not be synchronized.');
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

  const getProductImage = (item: Product) => (
    item.media?.featured_image || item.image_url || placeholderImage
  );

  const formatPrice = (item: Product) => (
    item.pricing?.formatted || (item.price ? `$${Number(item.price).toLocaleString()}` : 'Sync quote')
  );

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    setAddingToCart(true);

    try {
      const cart = JSON.parse(localStorage.getItem('sellio_cart') || '[]') as CartItem[];
      const existing = cart.find((item) => item.product.id === product.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ product, quantity: 1 });
      }

      localStorage.setItem('sellio_cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Failed to persist unified interactive cart item:', error);
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
          <div className="ui-mono" style={{ color: 'var(--ui-yellow)', marginBottom: '1rem' }}>MOTION_UNAVAILABLE</div>
          <h1>Listing transition could not be loaded.</h1>
          <p>{errorMessage || 'The requested listing does not exist or has been removed.'}</p>
          <a href="/preview/unifieds_interactive" className="motion-btn-primary">Return to Motion Feed</a>
        </section>
      </main>
    );
  }

  return (
    <main className="ui-detail-page">
      <a href="/preview/unifieds_interactive" className="ui-detail-back">
        <span aria-hidden="true">←</span>
        Back to Motion Feed
      </a>

      <section className="ui-detail-grid" aria-labelledby="ui-detail-title">
        <div className="ui-detail-media">
          <img src={getProductImage(product)} alt={product.title} />
        </div>

        <article className="ui-detail-panel">
          <div className="ui-mono" style={{ color: 'var(--ui-yellow)' }}>MOTION_ID_{product.id}</div>
          <h1 id="ui-detail-title">{product.title}</h1>
          <div className="ui-detail-price">{formatPrice(product)}</div>

          <div className="ui-detail-rule" />

          <div>
            <h2>Motion Profile</h2>
            <p>
              {product.description || 'This live catalog record is synchronized from the Sellio product database and prepared for Motion Node distribution.'}
            </p>
          </div>

          <div className="ui-detail-specs" aria-label="Listing metadata">
            <div>
              <span>Category</span>
              <strong>{product.category_id ? `#${product.category_id}` : 'General'}</strong>
            </div>
            <div>
              <span>Slug</span>
              <strong>{product.slug}</strong>
            </div>
            <div>
              <span>Transition</span>
              <strong>Live</strong>
            </div>
          </div>

          <button className="motion-btn-primary ui-detail-action" onClick={handleAddToCart} disabled={addingToCart}>
            {addingToCart ? 'ADDING MOTION' : 'ADD TO CART'}
          </button>
        </article>
      </section>
    </main>
  );
}
