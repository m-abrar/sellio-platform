'use client';

import React, { useEffect, useState } from 'react';
import { addProductToCart } from '@/themes/unifieds/shared/cart';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import { fetchVerticalDetail, VERTICAL_LABELS, type Vertical, type VerticalDetail } from '@/themes/unifieds/shared/multiVertical';

interface ProductPageProps {
  slug: string;
  vertical?: Vertical;
}

export default function ProductPage({ slug, vertical = 'products' }: ProductPageProps) {
  const [detail, setDetail] = useState<VerticalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartNotice, setCartNotice] = useState<string | null>(null);
  const themeLink = useUnifiedThemeLink();

  useEffect(() => {
    let isMounted = true;

    async function loadDetail() {
      setLoading(true);

      try {
        const loaded = await fetchVerticalDetail(vertical, slug);
        if (!isMounted) {
          return;
        }

        setDetail(loaded);
        setErrorMessage(null);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load unified mega listing details:', error);
        setDetail(null);
        setErrorMessage(
          error instanceof Error ? error.message : 'The requested listing does not exist or has been removed.',
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDetail();

    return () => {
      isMounted = false;
    };
  }, [slug, vertical]);

  const handleAddToCart = () => {
    if (!detail?.product) {
      return;
    }

    setAddingToCart(true);
    setCartNotice(null);

    try {
      addProductToCart(detail.product);
      setCartNotice(`"${detail.title}" was added to your cart.`);
    } catch (error) {
      console.error('Failed to persist unified mega cart item:', error);
      setCartNotice('Unable to update your cart. Please try again.');
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
            <div className="ugm-detail-line ugm-detail-line-button" />
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage || !detail) {
    return (
      <main className="ugm-detail-page">
        <section className="ugm-detail-state" role="status">
          <div className="ugm-mono" style={{ color: 'var(--ugm-orange)', marginBottom: '1rem' }}>
            {VERTICAL_LABELS[vertical]} unavailable
          </div>
          <h1>Listing details could not be loaded.</h1>
          <p>{errorMessage || 'The requested listing does not exist or has been removed.'}</p>
          <a href={themeLink('/')} className="mega-btn-primary">Return to Mega Grid</a>
        </section>
      </main>
    );
  }

  return (
    <main className="ugm-detail-page">
      <a href={themeLink(`/explore?vertical=${detail.vertical}`)} className="ugm-detail-back">
        <span aria-hidden="true">←</span>
        Back to {detail.label.toLowerCase()} listings
      </a>

      <section className="ugm-detail-grid" aria-labelledby="ugm-detail-page-title">
        <div className="ugm-detail-media">
          <img src={detail.image} alt={detail.title} />
          <span className="ugm-listing-vertical-badge">{detail.label}</span>
        </div>

        <article className="ugm-detail-panel">
          <div className="ugm-mono" style={{ color: 'var(--ugm-orange)' }}>{detail.kicker}</div>
          <h1 id="ugm-detail-page-title">{detail.title}</h1>
          <div className="ugm-detail-price">{detail.price}</div>

          <div className="ugm-detail-rule" />

          <div>
            <h2>Description</h2>
            <p>{detail.description}</p>
          </div>

          <div className="ugm-detail-specs" aria-label="Listing metadata">
            {detail.meta.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          <div className="ugm-detail-actions">
            {detail.product ? (
              <button type="button" className="mega-btn-primary ugm-detail-action" onClick={handleAddToCart} disabled={addingToCart}>
                {addingToCart ? 'ADDING...' : 'ADD TO CART'}
              </button>
            ) : (
              <a className="mega-btn-primary ugm-detail-action" href={themeLink(detail.actionHref)} style={{ textDecoration: 'none', textAlign: 'center' }}>
                {detail.actionLabel}
              </a>
            )}
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
