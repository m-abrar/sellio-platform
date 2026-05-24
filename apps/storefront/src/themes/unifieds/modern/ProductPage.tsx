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

const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='860' height='640' viewBox='0 0 860 640'><rect width='100%' height='100%' fill='%23020617'/><g transform='translate(400,270)' stroke='%2322d3ee' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='60' height='60' rx='8'/><circle cx='20' cy='20' r='6'/><path d='M58 46L42 30 12 60'/></g><text x='50%' y='61%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-size='13' font-weight='700' letter-spacing='2' fill='%2394a3b8'>NEXUS RECORD</text></svg>";

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

        console.error('Failed to load unified modern product details:', error);
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
    item.pricing?.formatted || (item.price ? `$${Number(item.price).toLocaleString()}` : 'Contact for pricing')
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
      console.error('Failed to persist unified modern cart item:', error);
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
          <div className="unp-mono" style={{ color: 'var(--unp-cyan)', marginBottom: '1rem' }}>SYNC_UNAVAILABLE</div>
          <h1>Listing details could not be loaded.</h1>
          <p>{errorMessage || 'The requested listing does not exist or has been removed.'}</p>
          <a href="/preview/unifieds_modern" className="nexus-btn-primary">Return to Nexus Feed</a>
        </section>
      </main>
    );
  }

  return (
    <main className="unp-detail-page">
      <a href="/preview/unifieds_modern" className="unp-detail-back">
        <span aria-hidden="true">←</span>
        Back to Nexus Feed
      </a>

      <section className="unp-detail-grid" aria-labelledby="unp-detail-title">
        <div className="unp-detail-media">
          <img src={getProductImage(product)} alt={product.title} />
        </div>

        <article className="unp-detail-panel">
          <div className="unp-mono" style={{ color: 'var(--unp-cyan)' }}>NEXUS_ID_{product.id}</div>
          <h1 id="unp-detail-title">{product.title}</h1>
          <div className="unp-detail-price">{formatPrice(product)}</div>

          <div className="unp-detail-rule" />

          <div>
            <h2>Description</h2>
            <p>
              {product.description || 'This live catalog record is synchronized from the Sellio product database and prepared for Nexus Prime distribution.'}
            </p>
          </div>

          <div className="unp-detail-specs" aria-label="Listing metadata">
            <div>
              <span>Category</span>
              <strong>{product.category_id ? `#${product.category_id}` : 'General'}</strong>
            </div>
            <div>
              <span>Slug</span>
              <strong>{product.slug}</strong>
            </div>
            <div>
              <span>Sync</span>
              <strong>Live</strong>
            </div>
          </div>

          <button className="nexus-btn-primary unp-detail-action" onClick={handleAddToCart} disabled={addingToCart}>
            {addingToCart ? 'ADDING SYNC' : 'ADD TO CART'}
          </button>
        </article>
      </section>
    </main>
  );
}
