'use client';

import React, { useEffect, useState } from 'react';
import { addProductToCart } from '@/themes/unifieds/shared/cart';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import {
  ClassifiedInquiryForm,
  EventBookingForm,
  JobApplyForm,
  PropertyBookingForm,
  ServiceConsultationForm,
  VehicleInquiryForm,
} from './InteractionForms';
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
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setDetail(null);
        setErrorMessage(error instanceof Error ? error.message : 'The requested listing does not exist or has been removed.');
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
      console.error('Failed to persist unified default cart item:', error);
      setCartNotice('Unable to update your cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <main className="ud-detail-page" aria-busy="true">
        <div className="ud-detail-back-skeleton" />
        <section className="ud-detail-grid">
          <div className="ud-detail-media ud-detail-skeleton" />
          <div className="ud-detail-panel">
            <div className="ud-detail-line ud-detail-line-small" />
            <div className="ud-detail-line ud-detail-line-title" />
            <div className="ud-detail-line ud-detail-line-price" />
            <div className="ud-detail-line ud-detail-line-copy" />
            <div className="ud-detail-line ud-detail-line-copy" />
            <div className="ud-detail-line ud-detail-line-button" />
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage || !detail) {
    return (
      <main className="ud-detail-page">
        <section className="ud-detail-state" role="status">
          <div className="ud-mono ud-section-eyebrow">Listing unavailable</div>
          <h1>{VERTICAL_LABELS[vertical]} details could not be loaded.</h1>
          <p>{errorMessage || 'The requested listing does not exist or has been removed.'}</p>
          <a href={themeLink('/explore')} className="core-btn-primary ud-empty-cta">
            Browse catalog directory
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="ud-detail-page">
      <a href={themeLink(`/explore?vertical=${detail.vertical}`)} className="ud-detail-back">
        <span aria-hidden="true">←</span>
        Back to {detail.label.toLowerCase()} listings
      </a>

      <section className="ud-detail-grid" aria-labelledby="ud-detail-title">
        <div className="ud-detail-media">
          <img src={detail.image} alt={detail.title} />
        </div>

        <article className="ud-detail-panel">
          <div className="ud-mono ud-section-eyebrow">{detail.kicker}</div>
          <h1 id="ud-detail-title">{detail.title}</h1>
          <div className="ud-detail-price">{detail.price}</div>

          <div className="ud-detail-badges">
            <span className="ud-detail-badge">{detail.label}</span>
            <span className="ud-detail-badge">{detail.category}</span>
          </div>

          <div className="ud-detail-rule" />

          <div>
            <h2>Description</h2>
            <p>{detail.description}</p>
          </div>

          <div className="ud-detail-specs" aria-label="Listing metadata">
            {detail.meta.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          <div className="ud-detail-actions">
            {detail.product ? (
              <>
                <button
                  type="button"
                  className="core-btn-primary ud-detail-action"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? 'Adding...' : 'Add to cart'}
                </button>
                {cartNotice ? (
                  <p className="ud-detail-cart-notice">
                    {cartNotice}{' '}
                    <a href={themeLink('/cart')}>View cart</a>
                  </p>
                ) : null}
              </>
            ) : detail.property ? (
              <PropertyBookingForm property={detail.property} themeLink={themeLink} />
            ) : detail.job ? (
              <JobApplyForm job={detail.job} themeLink={themeLink} />
            ) : detail.vehicle ? (
              <VehicleInquiryForm vehicle={detail.vehicle} themeLink={themeLink} />
            ) : detail.service ? (
              <ServiceConsultationForm service={detail.service} themeLink={themeLink} />
            ) : detail.classified ? (
              <ClassifiedInquiryForm classified={detail.classified} themeLink={themeLink} />
            ) : detail.event ? (
              <EventBookingForm event={detail.event} themeLink={themeLink} />
            ) : (
              <a href={themeLink(detail.actionHref)} className="core-btn-primary ud-detail-action">
                {detail.actionLabel}
              </a>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
