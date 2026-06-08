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

const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='760' height='940' viewBox='0 0 760 940'><rect width='100%' height='100%' fill='%23faf9f8'/><rect x='82' y='82' width='596' height='776' rx='2' fill='%23ffffff' stroke='%23e8e6e1'/><g transform='translate(348,398)' stroke='%23d4af37' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><path d='M32 4 60 32 32 60 4 32z'/><path d='M18 18h28v28H18z'/></g><text x='50%' y='56%' dominant-baseline='middle' text-anchor='middle' font-family='Montserrat, Arial, sans-serif' font-size='12' font-weight='600' letter-spacing='3' fill='%23767676'>MAISON RECORD</text></svg>";

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

        console.error('Failed to load ecommerce luxury product details:', error);
        setErrorMessage(error instanceof Error ? error.message : 'The selected piece could not be synchronized.');
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
    item.pricing?.formatted || (item.price ? `$${Number(item.price).toLocaleString()}` : 'Price on request')
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
      console.error('Failed to persist ecommerce luxury cart item:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <main className="ecl-detail-page" aria-busy="true">
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
      </main>
    );
  }

  if (errorMessage || !product) {
    return (
      <main className="ecl-detail-page">
        <section className="ecl-detail-state" role="status">
          <div className="ecl-detail-kicker">Piece Unavailable</div>
          <h1>Product could not be loaded.</h1>
          <p>{errorMessage || 'The requested product does not exist or has been removed.'}</p>
          <a href="/preview/ecommerce_luxury" className="ecl-btn-gold ecl-detail-return">Return to Collection</a>
        </section>
      </main>
    );
  }

  return (
    <main className="ecl-detail-page">
      <a href="/preview/ecommerce_luxury" className="ecl-detail-back">
        <span aria-hidden="true">&larr;</span>
        Back to Collection
      </a>

      <section className="ecl-detail-grid" aria-labelledby="ecl-detail-title">
        <div className="ecl-detail-media">
          <img src={getProductImage(product)} alt={product.title} />
        </div>

        <article className="ecl-detail-panel">
          <div className="ecl-detail-kicker">Maison Piece #{product.id}</div>
          <h1 id="ecl-detail-title" className="ecl-heading">{product.title}</h1>
          <div className="ecl-detail-price">{formatPrice(product)}</div>

          <div className="ecl-detail-rule" />

          <div>
            <h2>Craft Notes</h2>
            <p>
              {product.description || 'This live product record is synchronized from the Sellio catalog and prepared for a refined luxury storefront presentation.'}
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

          <button className="ecl-btn-gold ecl-detail-action" onClick={handleAddToCart} disabled={addingToCart}>
            {addingToCart ? 'Adding Piece' : 'Add to Bag'}
          </button>
        </article>
      </section>
    </main>
  );
}
