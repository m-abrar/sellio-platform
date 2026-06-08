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

const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='860' height='640' viewBox='0 0 860 640'><rect width='100%' height='100%' fill='%23171717'/><g transform='translate(400,270)' stroke='%23f97316' stroke-width='3' fill='none' stroke-linecap='square' stroke-linejoin='miter'><rect x='2' y='2' width='60' height='60'/><circle cx='20' cy='20' r='6'/><path d='M58 46L42 30 12 60'/></g><text x='50%' y='61%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='13' font-weight='900' letter-spacing='2' fill='%23ffffff'>GRID RECORD</text></svg>";

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

        console.error('Failed to load unified mega product details:', error);
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
    item.pricing?.formatted || (item.price ? `$${Number(item.price).toLocaleString()}` : 'Quote required')
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
      console.error('Failed to persist unified mega cart item:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <main className="ugm-detail-page" aria-busy="true">
        <div className="ugm-detail-back-skeleton" />
        <section className="ugm-detail-grid">
          <div className="ugm-detail-media ugm-detail-skeleton" />
          <div className="ugm-detail-panel">
            <div className="ugm-detail-line ugm-detail-line-small" />
            <div className="ugm-detail-line ugm-detail-line-title" />
            <div className="ugm-detail-line ugm-detail-line-price" />
            <div className="ugm-detail-line ugm-detail-line-copy" />
            <div className="ugm-detail-line ugm-detail-line-copy" />
            <div className="ugm-detail-line ugm-detail-line-button" />
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage || !product) {
    return (
      <main className="ugm-detail-page">
        <section className="ugm-detail-state" role="status">
          <div className="ugm-mono" style={{ color: 'var(--ugm-orange)', marginBottom: '1rem' }}>GRID_RECORD_UNAVAILABLE</div>
          <h1>Listing node could not be loaded.</h1>
          <p>{errorMessage || 'The requested listing does not exist or has been removed.'}</p>
          <a href="/preview/unifieds_mega" className="mega-btn-primary">Return to Mega Grid</a>
        </section>
      </main>
    );
  }

  return (
    <main className="ugm-detail-page">
      <a href="/preview/unifieds_mega" className="ugm-detail-back">
        <span aria-hidden="true">←</span>
        Back to Mega Grid
      </a>

      <section className="ugm-detail-grid" aria-labelledby="ugm-detail-title">
        <div className="ugm-detail-media">
          <img src={getProductImage(product)} alt={product.title} />
        </div>

        <article className="ugm-detail-panel">
          <div className="ugm-mono" style={{ color: 'var(--ugm-orange)' }}>GRID_ID_{product.id}</div>
          <h1 id="ugm-detail-title">{product.title}</h1>
          <div className="ugm-detail-price">{formatPrice(product)}</div>

          <div className="ugm-detail-rule" />

          <div>
            <h2>Node Description</h2>
            <p>
              {product.description || 'This live catalog node is synchronized from the Sellio product database and reinforced for Mega Grid distribution.'}
            </p>
          </div>

          <div className="ugm-detail-specs" aria-label="Listing metadata">
            <div>
              <span>Category</span>
              <strong>{product.category_id ? `#${product.category_id}` : 'General'}</strong>
            </div>
            <div>
              <span>Slug</span>
              <strong>{product.slug}</strong>
            </div>
            <div>
              <span>Grid Status</span>
              <strong>Live</strong>
            </div>
          </div>

          <button className="mega-btn-primary ugm-detail-action" onClick={handleAddToCart} disabled={addingToCart}>
            {addingToCart ? 'ADDING NODE' : 'ADD TO CART'}
          </button>
        </article>
      </section>
    </main>
  );
}
