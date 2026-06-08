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

const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='760' height='940' viewBox='0 0 760 940'><rect width='100%' height='100%' fill='%23f8fafc'/><g transform='translate(348,400)' stroke='%232563eb' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='60' height='60' rx='10'/><circle cx='20' cy='20' r='6'/><path d='M58 46L42 30 12 60'/></g><text x='50%' y='56%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-size='13' font-weight='800' letter-spacing='2' fill='%2364748b'>PRODUCT RECORD</text></svg>";

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

        console.error('Failed to load ecommerce default product details:', error);
        setErrorMessage(error instanceof Error ? error.message : 'The product record could not be synchronized.');
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
    item.pricing?.formatted || (item.price ? `$${Number(item.price).toLocaleString()}` : 'Contact for price')
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
      console.error('Failed to persist ecommerce default cart item:', error);
    } finally {
      setAddingToCart(false);
    }
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

  if (errorMessage || !product) {
    return (
      <main className="ed-detail-page">
        <section className="ed-detail-state" role="status">
          <div className="ed-mono" style={{ marginBottom: '1rem' }}>PRODUCT_UNAVAILABLE</div>
          <h1>Product could not be loaded.</h1>
          <p>{errorMessage || 'The requested product does not exist or has been removed.'}</p>
          <a href="/preview/ecommerce_default" className="ed-btn-primary">Return to Collection</a>
        </section>
      </main>
    );
  }

  return (
    <main className="ed-detail-page">
      <a href="/preview/ecommerce_default" className="ed-detail-back">
        <span aria-hidden="true">←</span>
        Back to Collection
      </a>

      <section className="ed-detail-grid" aria-labelledby="ed-detail-title">
        <div className="ed-detail-media">
          <img src={getProductImage(product)} alt={product.title} />
        </div>

        <article className="ed-detail-panel">
          <div className="ed-mono">PRODUCT_{product.id}</div>
          <h1 id="ed-detail-title">{product.title}</h1>
          <div className="ed-detail-price">{formatPrice(product)}</div>

          <div className="ed-detail-rule" />

          <div>
            <h2>Description</h2>
            <p>
              {product.description || 'This live product record is synchronized from the Sellio catalog and prepared for ecommerce storefront distribution.'}
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

          <button className="ed-btn-primary ed-detail-action" onClick={handleAddToCart} disabled={addingToCart}>
            {addingToCart ? 'ADDING PRODUCT' : 'ADD TO CART'}
          </button>
        </article>
      </section>
    </main>
  );
}
