'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocalHeader, LocalFooter } from './components';
import { getAdminBaseUrl } from '@/lib/admin-urls';
import { CatalogSyncAlert } from '@/themes/classifieds/shared/CatalogSyncAlert';
import {
  fetchClassifiedDetail,
  fetchClassifiedsHome,
  getRelatedFromApi,
  resolveClassifiedFailure,
} from '@/themes/classifieds/shared/catalog';
import {
  mapClassifiedToLocalCard,
  type LocalCardItem,
} from '@/themes/classifieds/shared/listing-utils';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';
import { useDemoFallbackAllowed } from '@/themes/classifieds/shared/useDemoFallbackAllowed';

const adminCreateClassifiedUrl = `${getAdminBaseUrl()}/admin/classifieds/create`;

export default function ProductPage({ slug }: { slug: string }) {
  const router = useRouter();
  const themeLink = useClassifiedsThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const [item, setItem] = useState<LocalCardItem | null>(null);
  const [related, setRelated] = useState<LocalCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerOffer, setBuyerOffer] = useState('');
  const [buyerNotes, setBuyerNotes] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState<Record<string, string> | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function loadListingDetails() {
      setLoading(true);
      setNotFound(false);
      const result = await fetchClassifiedDetail(slug);

      if (result.ok && result.response.data) {
        setItem(mapClassifiedToLocalCard(result.response.data));
        setRelated(
          getRelatedFromApi(
            result.response.data,
            result.response.related_classifieds,
            slug,
            undefined,
          ).map(mapClassifiedToLocalCard),
        );
        setUseFallback(false);
        setApiError(null);

        if (
          !result.response.related_classifieds?.length &&
          result.response.data.taxonomy?.category
        ) {
          const listResult = await fetchClassifiedsHome();
          if (listResult.ok && listResult.response.data) {
            setRelated(
              getRelatedFromApi(
                result.response.data,
                undefined,
                slug,
                listResult.response.data,
              ).map(mapClassifiedToLocalCard),
            );
          }
        }
      } else {
        const errorMsg = result.ok ? 'Listing not found or API returned no data.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveClassifiedFailure(slug, allowDemo, 'local');

        if (resolution.mode === 'demo') {
          setItem(mapClassifiedToLocalCard(resolution.listing));
          setRelated(resolution.related.map(mapClassifiedToLocalCard));
          setUseFallback(true);
        } else if (resolution.mode === 'notFound') {
          setItem(null);
          setNotFound(true);
          setUseFallback(false);
        } else {
          setItem(null);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    if (slug) {
      loadListingDetails();
    }
  }, [slug, allowDemo]);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail) {
      setFormError('Please fill in your name and email to send an inquiry.');
      return;
    }

    if (!item) return;

    setFormError(null);

    const orderData = {
      orderId: `ORD-${Date.now()}-${item.id}`,
      listingId: String(item.id),
      title: item.title,
      price: item.price,
      buyerName,
      buyerEmail,
      offerPrice: buyerOffer || item.price,
      notes: buyerNotes,
      date: new Date().toLocaleString(),
      theme: 'classifieds_local',
    };

    try {
      const existing = localStorage.getItem('sellio_classifieds_local_orders');
      const list = existing ? JSON.parse(existing) : [];
      list.push(orderData);
      localStorage.setItem('sellio_classifieds_local_orders', JSON.stringify(list));
    } catch (storageError) {
      console.error('LocalStorage write failed:', storageError);
    }

    setOrderSuccess(true);
    setOrderSuccessData(orderData);
  };

  const handleBackNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(themeLink(''));
  };

  return (
    <div className="cl-product-wrapper">
      <LocalHeader
        onPostClick={() => window.open(adminCreateClassifiedUrl, '_blank', 'noopener,noreferrer')}
        onLocationClick={handleLocationClick}
        locationName={item?.neighborhood || 'Capitol Hill'}
        homeHref={themeLink('')}
      />

      <div className="cl-product-container">
        <div>
          <a href={themeLink('')} className="cl-product-back-link" onClick={handleBackNavigation}>
            &larr; Back to Neighborhood Listings
          </a>
        </div>

        {(useFallback || apiError) && apiError && (
          <div className="cl-alert-slot">
            <CatalogSyncAlert
              classPrefix="cl"
              variant={useFallback ? 'demo' : 'production'}
              error={apiError}
            />
          </div>
        )}

        {loading ? (
          <div className="cl-product-main-grid">
            <div className="cl-product-gallery">
              <div className="cl-product-main-img-wrap" style={{ animation: 'cl-shimmer-pulse 1.5s infinite' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(66,165,245,0.06)' }} />
              </div>
            </div>
            <div className="cl-product-details-block">
              <div style={{ height: '32px', width: '70%', backgroundColor: 'rgba(51, 65, 85, 0.12)', borderRadius: '4px', animation: 'cl-shimmer-pulse 1.5s infinite' }} />
              <div style={{ height: '40px', width: '30%', backgroundColor: 'rgba(102, 187, 106, 0.18)', borderRadius: '4px', animation: 'cl-shimmer-pulse 1.5s infinite' }} />
              <div style={{ height: '150px', width: '100%', backgroundColor: 'rgba(51, 65, 85, 0.06)', borderRadius: '12px', animation: 'cl-shimmer-pulse 1.5s infinite' }} />
            </div>
          </div>
        ) : notFound || !item ? (
          <div className="cl-empty-state">
            <h3>Listing not found</h3>
            <p>This neighborhood listing is unavailable or may have been removed.</p>
            <a href={themeLink('')} className="cl-btn-post" style={{ display: 'inline-flex', marginTop: '1rem' }}>
              Back to listings
            </a>
          </div>
        ) : (
          <>
            <div className="cl-product-main-grid">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="cl-product-gallery">
                  <div className="cl-product-main-img-wrap">
                    <img src={item.image} className="cl-product-main-img" alt={item.title} />
                  </div>
                </div>

                <div className="cl-product-description-card">
                  <h4 className="cl-product-card-title">Neighborhood Spec Sheets</h4>
                  <div className="cl-product-specs-grid">
                    <div className="cl-product-spec-item">
                      <span className="cl-product-spec-label">Condition Level</span>
                      <span className="cl-product-spec-value">{item.conditionLabel}</span>
                    </div>
                    <div className="cl-product-spec-item">
                      <span className="cl-product-spec-label">Proximity</span>
                      <span className="cl-product-spec-value">📍 {item.distance} miles away</span>
                    </div>
                    <div className="cl-product-spec-item">
                      <span className="cl-product-spec-label">Exchange Neighborhood</span>
                      <span className="cl-product-spec-value">{item.neighborhood}</span>
                    </div>
                    <div className="cl-product-spec-item">
                      <span className="cl-product-spec-label">Item Category</span>
                      <span className="cl-product-spec-value">{item.categoryIcon} {item.category}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="cl-product-details-block">
                <div className="cl-product-description-card">
                  <div className="cl-product-meta-header">
                    <div className="cl-product-title-row">
                      <h1 className="cl-product-title">{item.title}</h1>
                    </div>
                    <div className="cl-product-price">{item.price}</div>
                    <div className="cl-product-meta-row">
                      <span className="cl-product-badge">{item.category}</span>
                      <span className="cl-product-badge cl-badge-excellent">{item.conditionLabel}</span>
                      <span className="cl-product-badge">📍 {item.neighborhood}</span>
                    </div>
                  </div>

                  <div style={{ borderTop: '1.5px dashed var(--cl-border)', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
                    <h4 className="cl-product-card-title" style={{ color: 'var(--cl-text-main)', fontSize: '0.95rem', fontWeight: 800 }}>Description</h4>
                    <p className="cl-product-description">
                      {item.description ||
                        `This item is listed by a verified neighbor in the ${item.neighborhood} community group. Perfect for local pickup and secure face-to-face neighborhood handovers.`}
                    </p>
                  </div>
                </div>

                <div className="cl-product-seller-card">
                  <div className="cl-product-seller-avatar">{item.sellerInitials}</div>
                  <div className="cl-product-seller-info">
                    <h5 className="cl-product-seller-name">{item.sellerName}</h5>
                    <span className="cl-product-seller-badge">🛡️ Verified Neighbor &bull; {item.neighborhood}</span>
                  </div>
                </div>

                <div className="cl-product-booking-drawer">
                  <h4 className="cl-product-card-title" style={{ margin: 0 }}>✉️ Inquire & Reserve</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--cl-text-muted)', fontWeight: 600 }}>
                    Send a secure community message to {item.sellerName} and request to schedule a local inspection or pickup.
                  </div>

                  {orderSuccess && orderSuccessData ? (
                    <div className="cl-booking-receipt">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cl-primary-green)', fontWeight: 900, fontSize: '0.95rem' }}>
                        <span>✓</span> <span>Inquiry Dispatch Complete!</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--cl-text-muted)', fontWeight: 600, borderBottom: '1px dashed var(--cl-primary-green)', paddingBottom: '0.5rem' }}>
                        Your message has been saved locally. Receipt:
                      </div>
                      <div className="cl-receipt-row">
                        <span>Receipt ID:</span>
                        <span style={{ fontFamily: 'monospace' }}>{orderSuccessData.orderId}</span>
                      </div>
                      <div className="cl-receipt-row">
                        <span>Contact Name:</span>
                        <span>{orderSuccessData.buyerName}</span>
                      </div>
                      <div className="cl-receipt-row">
                        <span>Proposed Price:</span>
                        <span style={{ color: 'var(--cl-primary-green)' }}>{orderSuccessData.offerPrice}</span>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {formError && <p className="cl-form-error" role="alert">{formError}</p>}
                      <div className="cl-booking-form-group">
                        <label className="cl-booking-label">Your Name *</label>
                        <input
                          type="text"
                          required
                          className="cl-booking-input"
                          placeholder="e.g. Alice Cooper"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                        />
                      </div>
                      <div className="cl-booking-form-group">
                        <label className="cl-booking-label">Your Secure Email *</label>
                        <input
                          type="email"
                          required
                          className="cl-booking-input"
                          placeholder="e.g. alice@example.com"
                          value={buyerEmail}
                          onChange={(e) => setBuyerEmail(e.target.value)}
                        />
                      </div>
                      <div className="cl-booking-form-group">
                        <label className="cl-booking-label">Your Price Offer (Optional)</label>
                        <input
                          type="text"
                          className="cl-booking-input"
                          placeholder={`Default is ${item.price}`}
                          value={buyerOffer}
                          onChange={(e) => setBuyerOffer(e.target.value)}
                        />
                      </div>
                      <div className="cl-booking-form-group">
                        <label className="cl-booking-label">Add a note for {item.sellerName} (Optional)</label>
                        <textarea
                          rows={2}
                          className="cl-booking-input"
                          style={{ resize: 'none', height: '60px' }}
                          placeholder="e.g. I can pick this up tomorrow at 5pm."
                          value={buyerNotes}
                          onChange={(e) => setBuyerNotes(e.target.value)}
                        />
                      </div>
                      <button type="submit" className="cl-product-btn-reserve">
                        Send Message & Request Pickup
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {related.length > 0 && (
              <div className="cl-related-section">
                <h3 className="cl-related-title">🌿 Other Neighborhood Offers</h3>
                <div className="cl-related-grid">
                  {related.map((relItem) => (
                    <div
                      key={relItem.id}
                      className="cl-related-card"
                      onClick={() => router.push(themeLink(`/product/${relItem.slug}`))}
                    >
                      <div className="cl-related-img-wrap">
                        <img src={relItem.image} className="cl-related-img" alt={relItem.title} />
                      </div>
                      <div className="cl-related-info">
                        <h4 className="cl-related-card-title">{relItem.title}</h4>
                        <div className="cl-related-price-row">
                          <span className="cl-related-price">{relItem.price}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--cl-text-muted)', fontWeight: 700 }}>📍 {relItem.distance} mi</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <LocalFooter />
    </div>
  );
}

function handleLocationClick() {
  // Location radius is controlled on the home map view.
}
