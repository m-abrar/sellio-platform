'use client';

import React, { useEffect, useState } from 'react';

import { LocalHeader, LocalFooter } from './components';
import { getAdminBaseUrl } from '@/lib/admin-urls';
import { CatalogSyncAlert } from '@/themes/classifieds/shared/CatalogSyncAlert';
import { loadClassifiedDetailPage } from '@/themes/classifieds/shared/catalog';
import {
  redirectToClassifiedInquiryConfirmation,
  saveClassifiedInquirySnapshot,
} from '@/themes/classifieds/shared/classified-inquiry-confirmation';
import {
  getLocalCategoryLabel,
  mapClassifiedToLocalCard,
  type LocalCardItem,
} from '@/themes/classifieds/shared/listing-utils';
import { submitClassifiedInquiry } from '@/themes/classifieds/shared/submit-inquiry';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';

const adminCreateClassifiedUrl = `${getAdminBaseUrl()}/admin/classifieds/create`;

export default function ProductPage({ slug }: { slug: string }) {
  const themeLink = useClassifiedsThemeLink();

  const [item, setItem] = useState<LocalCardItem | null>(null);
  const [related, setRelated] = useState<LocalCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerOffer, setBuyerOffer] = useState('');
  const [buyerNotes, setBuyerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function loadListingDetails() {
      setLoading(true);
      setNotFound(false);
      const result = await loadClassifiedDetailPage(slug);

      if (result.mode === 'live' && result.listing) {
        setItem(mapClassifiedToLocalCard(result.listing));
        setRelated(result.related.map(mapClassifiedToLocalCard));
        setApiError(null);
      } else if (result.mode === 'not-found') {
        setItem(null);
        setRelated([]);
        setNotFound(true);
        setApiError(result.alertError);
      } else {
        setItem(null);
        setRelated([]);
        setNotFound(false);
        setApiError(result.alertError);
      }

      setLoading(false);
    }

    if (slug) {
      loadListingDetails();
    }
  }, [slug]);

  const buildInquiryMessage = () => {
    const parts = [buyerNotes.trim()].filter(Boolean);
    return parts.length ? parts.join('\n\n') : undefined;
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail) {
      setFormError('Please fill in your name and email to send an inquiry.');
      return;
    }

    if (!item) return;

    setFormError(null);
    setIsSubmitting(true);

    const result = await submitClassifiedInquiry({
      slug,
      fullName: buyerName,
      email: buyerEmail,
      message: buildInquiryMessage(),
      offerPrice: buyerOffer.trim() || item.price,
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    saveClassifiedInquirySnapshot({
      id: result.inquiryId,
      listingId: item.id,
      listingTitle: item.title,
      listingSlug: item.slug,
      contactName: buyerName,
      contactEmail: buyerEmail,
      offerPrice: buyerOffer.trim() || item.price,
      message: buildInquiryMessage(),
      status: 'pending',
    });

    redirectToClassifiedInquiryConfirmation(themeLink, result.inquiryId);
  };

  return (
    <div className="cl-product-wrapper">
      <LocalHeader
        onPostClick={() => window.open(adminCreateClassifiedUrl, '_blank', 'noopener,noreferrer')}
        onLocationClick={() => { location.href = themeLink('/'); }}
        locationName={item?.neighborhood || 'Nearby'}
        homeHref={themeLink('/')}
      />

      <div className="cl-product-container">
        <div>
          <a href={themeLink('/')} className="cl-product-back-link">
            &larr; Back to Neighborhood Listings
          </a>
        </div>

        {apiError && (
          <div className="cl-alert-slot">
            <CatalogSyncAlert classPrefix="cl" variant="production" error={apiError} />
          </div>
        )}

        {loading ? (
          <div className="cl-product-main-grid">
            <div className="cl-product-gallery">
              <div className="cl-product-main-img-wrap cl-shimmer-block" />
            </div>
            <div className="cl-product-details-block">
              <div className="cl-shimmer-title" style={{ height: '32px', width: '70%' }} />
              <div className="cl-shimmer-price" style={{ height: '40px', width: '30%' }} />
              <div className="cl-shimmer-block" style={{ height: '150px' }} />
            </div>
          </div>
        ) : notFound || !item ? (
          <div className="cl-empty-state">
            <h3>Listing not found</h3>
            <p>This neighborhood listing is unavailable or may have been removed.</p>
            <a href={themeLink('/')} className="cl-btn-post cl-empty-cta">
              Back to listings
            </a>
          </div>
        ) : (
          <>
            <div className="cl-product-main-grid">
              <div className="cl-product-gallery-column">
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
                      <span className="cl-product-spec-value">
                        {item.categoryIcon} {getLocalCategoryLabel(item.category)}
                      </span>
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
                      <span className="cl-product-badge">{getLocalCategoryLabel(item.category)}</span>
                      <span className="cl-product-badge cl-badge-excellent">{item.conditionLabel}</span>
                      <span className="cl-product-badge">📍 {item.neighborhood}</span>
                    </div>
                  </div>

                  <div className="cl-product-description-divider">
                    <h4 className="cl-product-card-title cl-product-description-heading">Description</h4>
                    <p className="cl-product-description">
                      {item.description ||
                        `This item is listed by a verified neighbor in the ${item.neighborhood} area. Perfect for local pickup and secure face-to-face neighborhood handovers.`}
                    </p>
                  </div>
                </div>

                <div className="cl-product-seller-card">
                  <div className="cl-product-seller-avatar">{item.sellerInitials}</div>
                  <div className="cl-product-seller-info">
                    <h5 className="cl-product-seller-name">{item.sellerName}</h5>
                    <span className="cl-product-seller-badge">
                      🛡️ Verified Neighbor &bull; {item.neighborhood}
                    </span>
                  </div>
                </div>

                <div className="cl-product-booking-drawer">
                  <h4 className="cl-product-card-title cl-booking-drawer-title">✉️ Inquire & Reserve</h4>
                  <p className="cl-booking-drawer-lead">
                    Send a secure community message to {item.sellerName} and request to schedule a local
                    inspection or pickup.
                  </p>

                  <form onSubmit={handleInquirySubmit} className="cl-booking-form">
                    {formError && (
                      <p className="cl-form-error" role="alert">
                        {formError}
                      </p>
                    )}
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
                        className="cl-booking-input cl-booking-textarea"
                        placeholder="e.g. I can pick this up tomorrow at 5pm."
                        value={buyerNotes}
                        onChange={(e) => setBuyerNotes(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="cl-product-btn-reserve" disabled={isSubmitting}>
                      {isSubmitting ? 'Sending...' : 'Send Message & Request Pickup'}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {related.length > 0 && (
              <div className="cl-related-section">
                <h3 className="cl-related-title">🌿 Other Neighborhood Offers</h3>
                <div className="cl-related-grid">
                  {related.map((relItem) => (
                    <a
                      key={relItem.id}
                      href={themeLink(`/product/${relItem.slug}`)}
                      className="cl-related-card"
                      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                    >
                      <div className="cl-related-img-wrap">
                        <img src={relItem.image} className="cl-related-img" alt={relItem.title} />
                      </div>
                      <div className="cl-related-info">
                        <h4 className="cl-related-card-title">{relItem.title}</h4>
                        <div className="cl-related-price-row">
                          <span className="cl-related-price">{relItem.price}</span>
                          <span className="cl-related-distance">📍 {relItem.distance} mi</span>
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

      <LocalFooter />
    </div>
  );
}
