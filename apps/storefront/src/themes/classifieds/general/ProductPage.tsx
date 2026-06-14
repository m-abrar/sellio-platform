'use client';

import React, { useEffect, useState } from 'react';
import { GeneralHeader, GeneralFooter } from './components';
import { CatalogSyncAlert } from '@/themes/classifieds/shared/CatalogSyncAlert';
import {
  fetchClassifiedDetail,
  fetchClassifiedsHome,
  getRelatedFromApi,
  resolveClassifiedFailure,
} from '@/themes/classifieds/shared/catalog';
import {
  mapClassifiedToGeneralCard,
  type GeneralCardItem,
} from '@/themes/classifieds/shared/listing-utils';
import { submitClassifiedInquiry } from '@/themes/classifieds/shared/submit-inquiry';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';
import { useDemoFallbackAllowed } from '@/themes/classifieds/shared/useDemoFallbackAllowed';

export default function ProductPage({ slug }: { slug: string }) {
  const themeLink = useClassifiedsThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const [item, setItem] = useState<GeneralCardItem | null>(null);
  const [related, setRelated] = useState<GeneralCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerOffer, setBuyerOffer] = useState('');
  const [buyerMessage, setBuyerMessage] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState<Record<string, string> | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadListingDetails() {
      setLoading(true);
      setNotFound(false);
      const result = await fetchClassifiedDetail(slug);

      if (result.ok && result.response.data) {
        setItem(mapClassifiedToGeneralCard(result.response.data));
        setRelated(
          getRelatedFromApi(
            result.response.data,
            result.response.related_classifieds,
            slug,
            undefined,
          ).map(mapClassifiedToGeneralCard),
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
              ).map(mapClassifiedToGeneralCard),
            );
          }
        }
      } else {
        const errorMsg = result.ok ? 'Listing not found or API returned no data.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveClassifiedFailure(slug, allowDemo, 'general');

        if (resolution.mode === 'demo') {
          setItem(mapClassifiedToGeneralCard(resolution.listing));
          setRelated(resolution.related.map(mapClassifiedToGeneralCard));
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

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail) {
      setFormError('Please enter your name and email to contact the seller.');
      return;
    }

    if (!item) return;

    setFormError(null);
    setIsSubmitting(true);

    const result = await submitClassifiedInquiry({
      slug,
      useFallback,
      storageKey: 'sellio_classifieds_general_orders',
      fullName: buyerName,
      email: buyerEmail,
      message: buyerMessage.trim() || undefined,
      offerPrice: buyerOffer.trim() || item.price,
      demoOrderData: {
        orderId: `ORD-${Date.now()}-${item.id}`,
        listingId: String(item.id),
        title: item.title,
        price: item.price,
        buyerName,
        buyerEmail,
        offerPrice: buyerOffer || item.price,
        message: buyerMessage,
        date: new Date().toLocaleString(),
        theme: 'classifieds_general',
      },
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    setOrderSuccess(true);
    setOrderSuccessData({
      ...result.summary,
      offerPrice: buyerOffer || item.price,
    });
  };

  return (
    <div className="cg-product-wrapper">
      <GeneralHeader
        searchTerm=""
        onSearchChange={() => {}}
        onReset={() => {}}
      />

      <div className="cg-product-container">
        <div>
          <a href={themeLink('/')} className="cg-product-back-link">
            &larr; Back to Catalog Listings
          </a>
        </div>

        {(useFallback || apiError) && apiError && (
          <div className="cg-alert-slot">
            <CatalogSyncAlert
              classPrefix="cg"
              variant={useFallback ? 'demo' : 'production'}
              error={apiError}
            />
          </div>
        )}

        {loading ? (
          <div className="cg-product-main-grid">
            <div className="cg-product-gallery">
              <div className="cg-product-main-img-wrap" style={{ animation: 'cg-shimmer-pulse 1.5s infinite' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,123,255,0.04)' }} />
              </div>
            </div>
            <div className="cg-product-details-block">
              <div style={{ height: '32px', width: '70%', backgroundColor: 'rgba(30, 41, 59, 0.12)', borderRadius: '4px', animation: 'cg-shimmer-pulse 1.5s infinite' }} />
              <div style={{ height: '40px', width: '30%', backgroundColor: 'rgba(0, 123, 255, 0.15)', borderRadius: '4px', animation: 'cg-shimmer-pulse 1.5s infinite' }} />
              <div style={{ height: '150px', width: '100%', backgroundColor: 'rgba(30, 41, 59, 0.06)', borderRadius: '12px', animation: 'cg-shimmer-pulse 1.5s infinite' }} />
            </div>
          </div>
        ) : notFound || !item ? (
          <div className="cg-empty-state">
            <h3>Listing not found</h3>
            <p>This catalog listing is unavailable or may have been removed.</p>
            <a href={themeLink('/')} className="cg-btn cg-btn-primary" style={{ display: 'inline-flex', marginTop: '1rem' }}>
              Back to listings
            </a>
          </div>
        ) : (
          <>
            <div className="cg-product-main-grid">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="cg-product-gallery">
                  <div className="cg-product-main-img-wrap">
                    <img src={item.image} className="cg-product-main-img" alt={item.title} />
                  </div>
                </div>

                <div className="cg-product-description-card">
                  <h4 className="cg-product-card-title">Product Description</h4>
                  <p className="cg-product-description">
                    {item.description || 'No description provided by the seller. Please use the inquiry form to request details.'}
                  </p>
                </div>
              </div>

              <div className="cg-product-details-block">
                <div className="cg-product-description-card">
                  <div className="cg-product-meta-header">
                    <div className="cg-product-title-row">
                      <h1 className="cg-product-title">{item.title}</h1>
                    </div>
                    <div className="cg-product-price">{item.price}</div>
                    <div className="cg-product-meta-row">
                      <span className="cg-product-badge">{item.category}</span>
                      <span className="cg-product-badge">{item.conditionLabel || 'Good'}</span>
                      {item.delivery && <span className="cg-product-badge">✓ Shipping Available</span>}
                      {item.localPickup && <span className="cg-product-badge">✓ Pickup Available</span>}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--cg-border)', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
                    <h4 className="cg-product-card-title" style={{ color: 'var(--cg-text-main)', fontSize: '0.95rem', fontWeight: 800 }}>Specifications</h4>
                    <div className="cg-product-specs-grid">
                      <div className="cg-product-spec-item">
                        <span className="cg-product-spec-label">Condition</span>
                        <span className="cg-product-spec-value">{item.conditionLabel || 'Great'}</span>
                      </div>
                      <div className="cg-product-spec-item">
                        <span className="cg-product-spec-label">Quantity</span>
                        <span className="cg-product-spec-value">{item.quantity || 1} available</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="cg-product-seller-card">
                  <div className="cg-product-seller-avatar">👤</div>
                  <div className="cg-product-seller-info">
                    <h5 className="cg-product-seller-name">{item.seller}</h5>
                    <span className="cg-product-seller-badge">🛡️ Verified ClasaFind Member</span>
                  </div>
                </div>

                <div className="cg-product-booking-drawer">
                  <h4 className="cg-product-card-title" style={{ margin: 0 }}>✉️ Contact Seller</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--cg-text-muted)', fontWeight: 600 }}>
                    Submit an offer or request details. Messages are routed to {item.seller}.
                  </div>

                  {orderSuccess && orderSuccessData ? (
                    <div className="cg-booking-receipt">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cg-primary)', fontWeight: 800, fontSize: '0.95rem' }}>
                        <span>✓</span> <span>Message Securely Dispatched!</span>
                      </div>
                      <div className="cg-receipt-row">
                        <span>Transaction ID:</span>
                        <span style={{ fontFamily: 'monospace' }}>{orderSuccessData.orderId}</span>
                      </div>
                      <div className="cg-receipt-row">
                        <span>Offered Price:</span>
                        <span style={{ color: 'var(--cg-primary)' }}>{orderSuccessData.offerPrice}</span>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {formError && <p className="cg-form-error" role="alert">{formError}</p>}
                      <div className="cg-booking-form-group">
                        <label className="cg-booking-label">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          className="cg-booking-input"
                          placeholder="e.g. John Doe"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                        />
                      </div>
                      <div className="cg-booking-form-group">
                        <label className="cg-booking-label">Your Email Address *</label>
                        <input
                          type="email"
                          required
                          className="cg-booking-input"
                          placeholder="e.g. john@example.com"
                          value={buyerEmail}
                          onChange={(e) => setBuyerEmail(e.target.value)}
                        />
                      </div>
                      <div className="cg-booking-form-group">
                        <label className="cg-booking-label">Your Price Offer (Optional)</label>
                        <input
                          type="text"
                          className="cg-booking-input"
                          placeholder={`Default price is ${item.price}`}
                          value={buyerOffer}
                          onChange={(e) => setBuyerOffer(e.target.value)}
                        />
                      </div>
                      <div className="cg-booking-form-group">
                        <label className="cg-booking-label">Type your message to {item.seller}</label>
                        <textarea
                          rows={2}
                          className="cg-booking-input"
                          style={{ resize: 'none', height: '60px' }}
                          placeholder="e.g. Is the price negotiable?"
                          value={buyerMessage}
                          onChange={(e) => setBuyerMessage(e.target.value)}
                        />
                      </div>
                      <button type="submit" className="cg-product-btn-reserve" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending…' : 'Dispatch Message to Seller'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {related.length > 0 && (
              <div className="cg-related-section">
                <h3 className="cg-related-title">📦 Other Bargains You Might Like</h3>
                <div className="cg-related-grid">
                  {related.map((relItem) => (
                    <a
                      key={relItem.id}
                      href={themeLink(`/product/${relItem.slug}`)}
                      className="cg-related-card"
                      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                    >
                      <div className="cg-related-img-wrap">
                        <img src={relItem.image} className="cg-related-img" alt={relItem.title} />
                      </div>
                      <div className="cg-related-info">
                        <h4 className="cg-related-card-title">{relItem.title}</h4>
                        <div className="cg-related-price-row">
                          <span className="cg-related-price">{relItem.price}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--cg-text-muted)', fontWeight: 600 }}>👤 {relItem.seller}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <GeneralFooter />
    </div>
  );
}
