'use client';

import React, { useEffect, useState } from 'react';
import { addProductToCart } from '@/themes/unifieds/shared/cart';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import { fetchVerticalDetail, VERTICAL_LABELS, type Vertical, type VerticalDetail } from '@/themes/unifieds/shared/multiVertical';
import {
  ClassifiedInquiryForm,
  JobApplyForm,
  ServiceConsultationForm,
  VehicleInquiryForm,
} from './InteractionForms';

interface ProductPageProps {
  slug: string;
  vertical?: Vertical;
}

export default function ProductPage({ slug, vertical = 'products' }: ProductPageProps) {
  const [detail, setDetail] = useState<VerticalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
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
        setLoadError(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        console.error('Failed to retrieve unified minimal listing detail:', error);
        setDetail(null);
        setLoadError(error instanceof Error ? error.message : 'The requested listing does not exist or has been removed.');
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
      console.error('Failed to add product to cart storage:', error);
      setCartNotice('Unable to update your cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="usm-product-details-container" style={{ padding: '8rem 6% 6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
          <div style={{ aspectRatio: '4/3', borderRadius: '8px', background: '#f3f4f6', animation: 'pulse 1.5s infinite' }} />
          <div>
            <div style={{ height: '14px', background: '#e5e7eb', width: '25%', borderRadius: '4px', marginBottom: '20px', animation: 'pulse 1.5s infinite' }} />
            <div style={{ height: '38px', background: '#e5e7eb', width: '80%', borderRadius: '4px', marginBottom: '25px', animation: 'pulse 1.5s infinite' }} />
            <div style={{ height: '24px', background: '#e5e7eb', width: '35%', borderRadius: '4px', marginBottom: '30px', animation: 'pulse 1.5s infinite' }} />
            <div style={{ height: '80px', background: '#e5e7eb', width: '100%', borderRadius: '4px', marginBottom: '40px', animation: 'pulse 1.5s infinite' }} />
            <div style={{ height: '50px', background: '#e5e7eb', width: '50%', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
          </div>
        </div>
      </div>
    );
  }

  if (loadError || !detail) {
    return (
      <div className="usm-product-details-container" style={{ padding: '10rem 6% 10rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--usm-font-heading)', fontSize: '2rem', marginBottom: '1.5rem' }}>{VERTICAL_LABELS[vertical]} listing not found</h2>
        <p style={{ color: '#666', marginBottom: '2.5rem' }}>
          {loadError || 'The requested listing does not exist or has been removed.'}
        </p>
        <a href={themeLink('/explore')} className="silent-btn-primary" style={{ textDecoration: 'none', padding: '0.8rem 2.5rem' }}>
          Browse the catalog
        </a>
      </div>
    );
  }

  return (
    <div className="usm-product-details-container" style={{ padding: '8rem 6% 6rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <a
          href={themeLink(`/explore?vertical=${detail.vertical}`)}
          style={{ textDecoration: 'none', color: '#666', fontSize: '0.9rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to {detail.label.toLowerCase()} listings
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4.5rem', alignItems: 'start' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px', border: '1px solid var(--usm-border)', background: 'var(--usm-ghost)', boxShadow: 'var(--usm-shadow)' }}>
          <img
            src={detail.image}
            alt={detail.title}
            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
          />
        </div>

        <div>
          <span style={{ color: 'var(--usm-primary)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', display: 'block', marginBottom: '1.5rem' }}>
            {detail.kicker}
          </span>

          <h1 style={{ fontFamily: 'var(--usm-font-heading)', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 600, color: 'var(--usm-ink)', lineHeight: 1.2, margin: '0 0 1.5rem' }}>
            {detail.title}
          </h1>

          <div style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--usm-primary)', margin: '0 0 1rem' }}>
            {detail.price}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#888', border: '1px solid var(--usm-border)', borderRadius: '999px', padding: '0.3rem 0.9rem' }}>{detail.label}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#888', border: '1px solid var(--usm-border)', borderRadius: '999px', padding: '0.3rem 0.9rem' }}>{detail.category}</span>
          </div>

          <div style={{ height: '1px', background: 'var(--usm-border)', margin: '2.5rem 0' }} />

          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', color: '#111' }}>
              Description
            </h3>
            <p style={{ color: '#555', lineHeight: 1.8, fontSize: '1.05rem', fontWeight: 300 }}>
              {detail.description}
            </p>
          </div>

          <div style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {detail.meta.map((item) => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', borderBottom: '1px solid var(--usm-border)', paddingBottom: '0.75rem' }}>
                <span style={{ color: '#888' }}>{item.label}</span>
                <strong style={{ color: 'var(--usm-ink)', fontWeight: 600 }}>{item.value}</strong>
              </div>
            ))}
          </div>

          <div style={{ height: '1px', background: 'var(--usm-border)', margin: '2.5rem 0' }} />

          {detail.product ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                type="button"
                className="silent-btn-primary"
                style={{ flex: 1, padding: '1.2rem 3rem', fontSize: '0.9rem', letterSpacing: '2px', fontWeight: 600 }}
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? 'ADDING...' : 'ADD TO CART'}
              </button>
              {cartNotice ? (
                <p style={{ color: '#555', fontSize: '0.95rem', margin: 0 }}>
                  {cartNotice}{' '}
                  <a href={themeLink('/cart')} style={{ color: 'var(--usm-primary)', fontWeight: 600, textDecoration: 'none' }}>
                    View cart
                  </a>
                </p>
              ) : null}
            </div>
          ) : detail.job ? (
            <JobApplyForm job={detail.job} themeLink={themeLink} />
          ) : detail.vehicle ? (
            <VehicleInquiryForm vehicle={detail.vehicle} themeLink={themeLink} />
          ) : detail.service ? (
            <ServiceConsultationForm service={detail.service} themeLink={themeLink} />
          ) : detail.classified ? (
            <ClassifiedInquiryForm classified={detail.classified} themeLink={themeLink} />
          ) : (
            <a href={themeLink(detail.actionHref)} className="silent-btn-primary" style={{ textDecoration: 'none' }}>
              {detail.actionLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
