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

const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='860' height='640' viewBox='0 0 860 640'><rect width='100%' height='100%' fill='%23fffcf2'/><g transform='translate(400,270)' stroke='%23d4af37' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='60' height='60' rx='4'/><circle cx='20' cy='20' r='6'/><path d='M58 46L42 30 12 60'/></g><text x='50%' y='61%' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='13' font-weight='700' letter-spacing='2' fill='%237f1d1d'>LEGACY RECORD</text></svg>";

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

        console.error('Failed to load unified classic product details:', error);
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
    item.pricing?.formatted || (item.price ? `$${Number(item.price).toLocaleString()}` : 'Price upon request')
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
      console.error('Failed to persist unified classic cart item:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <main className="uc-detail-page" aria-busy="true">
        <div className="uc-detail-back-skeleton" />
        <section className="uc-detail-grid">
          <div className="uc-detail-media uc-detail-skeleton" />
          <div className="uc-detail-panel">
            <div className="uc-detail-line uc-detail-line-small" />
            <div className="uc-detail-line uc-detail-line-title" />
            <div className="uc-detail-line uc-detail-line-price" />
            <div className="uc-detail-line uc-detail-line-copy" />
            <div className="uc-detail-line uc-detail-line-copy" />
            <div className="uc-detail-line uc-detail-line-button" />
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage || !product) {
    return (
      <main className="uc-detail-page">
        <section className="uc-detail-state" role="status">
          <div className="uc-mono" style={{ color: 'var(--uc-gold)', marginBottom: '1rem' }}>RECORD_UNAVAILABLE</div>
          <h1>Listing provenance could not be loaded.</h1>
          <p>{errorMessage || 'The requested listing does not exist or has been removed.'}</p>
          <a href="/preview/unifieds_classic" className="legacy-btn-primary">Return to Archive</a>
        </section>
      </main>
    );
  }

  return (
    <main className="uc-detail-page">
      <a href="/preview/unifieds_classic" className="uc-detail-back">
        <span aria-hidden="true">←</span>
        Back to Archive
      </a>

      <section className="uc-detail-grid" aria-labelledby="uc-detail-title">
        <div className="uc-detail-media">
          <img src={getProductImage(product)} alt={product.title} />
        </div>

        <article className="uc-detail-panel">
          <div className="uc-mono" style={{ color: 'var(--uc-gold)' }}>ARCHIVE_{product.id}</div>
          <h1 id="uc-detail-title">{product.title}</h1>
          <div className="uc-detail-price">{formatPrice(product)}</div>

          <div className="uc-detail-rule" />

          <div>
            <h2>Provenance</h2>
            <p>
              {product.description || 'This live catalog record is preserved from the Sellio product database and prepared for Legacy Registry distribution.'}
            </p>
          </div>

          <div className="uc-detail-specs" aria-label="Listing metadata">
            <div>
              <span>Category</span>
              <strong>{product.category_id ? `#${product.category_id}` : 'General'}</strong>
            </div>
            <div>
              <span>Archive Slug</span>
              <strong>{product.slug}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>Live</strong>
            </div>
          </div>

          <button className="legacy-btn-primary uc-detail-action" onClick={handleAddToCart} disabled={addingToCart}>
            {addingToCart ? 'ADDING RECORD' : 'ADD TO CART'}
          </button>
        </article>
      </section>
    </main>
  );
}
