'use client';

import React, { useState, useEffect } from 'react';
import type { ClassifiedListing } from '@sellio/types';
import { PremiumHeader, PremiumFooter } from './components';
import { CatalogSyncAlert } from '@/themes/classifieds/shared/CatalogSyncAlert';
import {
  fetchClassifiedDetail,
  fetchClassifiedsHome,
  getRelatedFromApi,
  resolveClassifiedFailure,
} from '@/themes/classifieds/shared/catalog';
import {
  saveClassifiedInquirySnapshot,
  redirectToClassifiedInquiryConfirmation,
} from '@/themes/classifieds/shared/classified-inquiry-confirmation';
import { submitClassifiedInquiry } from '@/themes/classifieds/shared/submit-inquiry';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';
import { useDemoFallbackAllowed } from '@/themes/classifieds/shared/useDemoFallbackAllowed';
import { LiveChatWidget } from '@/components/chat/LiveChatWidget';

interface OpportunityItem {
  id: number;
  title: string;
  price: string;
  numericPrice: number;
  description: string;
  location: string;
  category: string;
  image: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  slug: string;
}

// Fallback opportunities matching Page.tsx
// Translators to fit OpportunityItem schema
const translateOpportunity = (item: ClassifiedListing): OpportunityItem => {
  const generatedSlug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return {
    id: item.id,
    title: item.title,
    price: item.pricing?.formatted || item.pricing?.formatted_short || `$${(item.pricing?.sale_price || item.pricing?.base_price || 0).toLocaleString()}`,
    numericPrice: item.pricing?.sale_price || item.pricing?.base_price || 0,
    description: item.description || "Established business acquisition opportunity with verified cash flows.",
    location: item.location ? `${item.location.city || 'Remote'}, ${item.location.state || 'Global'}` : "Fully Remote",
    category: item.taxonomy?.category || "tech",
    image: item.media?.main_photo || item.media?.thumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400",
    isVerified: (item.item_specs?.condition_rating && item.item_specs.condition_rating >= 4) || item.status?.is_featured || false,
    isFeatured: item.status?.is_featured || false,
    slug: generatedSlug
  };
};

export default function ProductPage({ slug }: { slug: string }) {
  const themeLink = useClassifiedsThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  // Component states
  const [item, setItem] = useState<OpportunityItem | null>(null);
  const [related, setRelated] = useState<OpportunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Inquiry/Booking states
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerOffer, setBuyerOffer] = useState('');
  const [buyerNotes, setBuyerNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchListingDetails = async () => {
      setLoading(true);
      setNotFound(false);
      const result = await fetchClassifiedDetail(slug);

      if (result.ok && result.response.data) {
        setItem(translateOpportunity(result.response.data));
        setRelated(
          getRelatedFromApi(
            result.response.data,
            result.response.related_classifieds,
            slug,
            undefined,
          ).map(translateOpportunity),
        );
        setUseFallback(false);
        setApiError(null);

        if (
          !result.response.related_classifieds?.length &&
          result.response.data.taxonomy?.category
        ) {
          const listResult = await fetchClassifiedsHome({ limit: 4 });
          if (listResult.ok && listResult.response.data) {
            setRelated(
              getRelatedFromApi(
                result.response.data,
                undefined,
                slug,
                listResult.response.data,
              ).map(translateOpportunity),
            );
          }
        }
      } else {
        const errorMsg = result.ok ? 'Listing not found or API returned no data.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveClassifiedFailure(slug, allowDemo, 'premium');

        if (resolution.mode === 'demo') {
          setItem(translateOpportunity(resolution.listing));
          setRelated(resolution.related.map(translateOpportunity));
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
    };

    if (slug) {
      fetchListingDetails();
    }
  }, [slug, allowDemo]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (!item) return;
    setFormError(null);
    setIsSubmitting(true);

    const result = await submitClassifiedInquiry({
      slug,
      useFallback,
      storageKey: 'sellio_classifieds_premium_orders',
      fullName: buyerName,
      email: buyerEmail,
      message: buyerNotes.trim() || undefined,
      offerPrice: buyerOffer.trim() || item.price,
      demoOrderData: {
        orderId: `PREM-INQ-${Date.now()}-${item.id}`,
        listingId: String(item.id),
        title: item.title,
        price: item.price,
        buyerName,
        buyerEmail,
        offerPrice: buyerOffer || item.price,
        notes: buyerNotes,
        date: new Date().toLocaleString(),
        theme: 'classifieds_premium',
      },
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
      message: buyerNotes.trim() || undefined,
      status: 'pending',
    });
    redirectToClassifiedInquiryConfirmation(themeLink, result.inquiryId);
  };

  // Generate premium opportunity spec multipliers based on category
  const getEbitdaMultiple = (cat: string) => {
    if (cat === 'tech') return '6.8x Multiple';
    if (cat === 'retail') return '3.8x Multiple';
    if (cat === 'hospitality') return '3.2x Multiple';
    return '4.5x Multiple';
  };

  const getFinancialGrade = (cat: string) => {
    if (cat === 'tech') return 'High Margin SaaS';
    if (cat === 'retail') return 'Asset-backed Estate';
    if (cat === 'hospitality') return 'Foot-Traffic Strong';
    return 'Contracted CDL Lane';
  };

  const getCategoryLabel = (cat: string) => {
    if (cat === 'tech') return 'Technology & SaaS';
    if (cat === 'retail') return 'Real Estate & Retail';
    if (cat === 'hospitality') return 'Hospitality & F&B';
    if (cat === 'manufacturing') return 'Logistics & Industry';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <div className="cp-product-wrapper">
      <PremiumHeader
        homeHref={themeLink('/')}
      />

      <div className="cp-product-container">
        <div>
          <a href={themeLink('/')} className="cp-product-back-link">
            &larr; Return to Catalog
          </a>
        </div>

        {(useFallback || apiError) && apiError && (
          <CatalogSyncAlert
            classPrefix="cp"
            variant={useFallback ? 'demo' : 'production'}
            error={apiError}
          />
        )}

        {loading ? (
          <div className="cp-product-main-grid">
            <div className="cp-product-gallery">
              <div className="cp-product-main-img-wrap" style={{ animation: 'cp-shimmer-pulse 1.5s infinite' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: '#f1f5f9' }} />
              </div>
            </div>
            <div className="cp-product-details-block">
              <div style={{ height: '32px', width: '70%', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
              <div style={{ height: '40px', width: '30%', backgroundColor: 'rgba(20, 184, 166, 0.1)', borderRadius: '4px', marginTop: '1rem' }} />
              <div style={{ height: '150px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '12px', marginTop: '1.5rem' }} />
            </div>
          </div>
        ) : !item ? (
          <div style={{ textAlign: 'center', padding: '6rem 1rem', background: '#ffffff', borderRadius: '12px', border: '1px solid var(--cp-border)' }}>
            <h3 style={{ fontFamily: 'var(--cp-font-heading)', color: 'var(--cp-navy)' }}>
              {notFound ? 'Acquisition profile not found.' : 'Unable to load acquisition profile.'}
            </h3>
          </div>
        ) : (
          <>
            <div className="cp-product-main-grid">
              {/* Left Column: Image and Specs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="cp-product-gallery">
                  <div className="cp-product-main-img-wrap">
                    <img src={item.image} className="cp-product-main-img" alt={item.title} />
                  </div>
                </div>

                <div className="cp-product-description-card">
                  <h4 className="cp-product-card-title">Institutional Spec Sheets</h4>
                  <div className="cp-product-specs-grid">
                    <div className="cp-product-spec-item">
                      <span className="cp-product-spec-label">EBITDA Multiple</span>
                      <span className="cp-product-spec-value">{getEbitdaMultiple(item.category)}</span>
                    </div>
                    <div className="cp-product-spec-item">
                      <span className="cp-product-spec-label">Vetting Grade</span>
                      <span className="cp-product-spec-value">{getFinancialGrade(item.category)}</span>
                    </div>
                    <div className="cp-product-spec-item">
                      <span className="cp-product-spec-label">Geographic Scope</span>
                      <span className="cp-product-spec-value">📍 {item.location}</span>
                    </div>
                    <div className="cp-product-spec-item">
                      <span className="cp-product-spec-label">Industry classification</span>
                      <span className="cp-product-spec-value">{getCategoryLabel(item.category)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Title, description, broker info, and request form */}
              <div className="cp-product-details-block">
                <div className="cp-product-description-card">
                  <div className="cp-product-meta-header">
                    {item.isVerified && (
                      <span className="cp-badge-verified" style={{ alignSelf: 'flex-start', padding: '0.4rem 0.85rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', border: '1px solid rgba(20, 184, 166, 0.25)', backgroundColor: 'rgba(20, 184, 166, 0.08)', color: 'var(--cp-teal)' }}>
                        🛡️ Vetted M&A Opportunity
                      </span>
                    )}
                    <h1 className="cp-product-title">{item.title}</h1>
                    <div className="cp-product-price">{item.price}</div>
                    <div className="cp-product-meta-row">
                      <span className="cp-product-badge">{getCategoryLabel(item.category)}</span>
                      <span className="cp-product-badge">📍 {item.location.split(',')[0]}</span>
                      <span className="cp-product-badge cp-product-badge-verified">EBITDA Vetted</span>
                    </div>
                  </div>
                  
                  <div style={{ borderTop: '1.5px solid var(--cp-border)', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
                    <h4 className="cp-product-card-title" style={{ fontSize: '1.05rem', fontWeight: 800 }}>Opportunity Memorandum</h4>
                    <p className="cp-product-description">
                      {item.description} This business represents a stellar asset-backed acquisition prospect with proven operational frameworks, active revenue channels, and a complete onboarding transition plan. Vetted by third-party accounting professionals.
                    </p>
                  </div>
                </div>

                <div className="cp-product-seller-card">
                  <div className="cp-product-seller-avatar">GP</div>
                  <div className="cp-product-seller-info">
                    <h5 className="cp-product-seller-name">Global Partners Brokerage</h5>
                    <span className="cp-product-seller-badge">💼 Certified M&A Advisory Vetting Hub &bull; {item.location}</span>
                  </div>
                </div>

                {/* Secure Request Form */}
                <div className="cp-product-booking-drawer">
                  <h4 className="cp-product-card-title" style={{ margin: 0, border: 'none', padding: 0 }}>✉️ Request Prospectus Memorandum</h4>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.5', fontWeight: 600 }}>
                    Coordinate directly with the certified broker assigning this opportunity. Fill in your investor credentials to request the full audit logs and tax schedules.
                  </div>

                  <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {formError && (
                        <p
                          style={{
                            margin: 0,
                            color: '#b91c1c',
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '6px',
                            padding: '0.6rem 0.8rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                          }}
                          role="alert"
                        >
                          {formError}
                        </p>
                      )}
                      <div className="cp-booking-form-group">
                        <label className="cp-booking-label">Broker / Lead Investor Name *</label>
                        <input
                          type="text"
                          required
                          className="cp-booking-input"
                          placeholder="e.g. Richard Hendricks"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                        />
                      </div>
                      <div className="cp-booking-form-group">
                        <label className="cp-booking-label">Sovereign / Corporate Email *</label>
                        <input
                          type="email"
                          required
                          className="cp-booking-input"
                          placeholder="e.g. richard@piedpiper.com"
                          value={buyerEmail}
                          onChange={(e) => setBuyerEmail(e.target.value)}
                        />
                      </div>
                      <div className="cp-booking-form-group">
                        <label className="cp-booking-label">Proposed Acquisition Offer Capital (USD)</label>
                        <input
                          type="text"
                          className="cp-booking-input"
                          placeholder={`Default is ${item.price}`}
                          value={buyerOffer}
                          onChange={(e) => setBuyerOffer(e.target.value)}
                        />
                      </div>
                      <div className="cp-booking-form-group">
                        <label className="cp-booking-label">Confidential Investor Notes (Optional)</label>
                        <textarea
                          rows={2}
                          className="cp-booking-input"
                          style={{ resize: 'none', height: '60px' }}
                          placeholder="e.g. Vetting active EBITDA multiples. Requesting audit reports for Q3..."
                          value={buyerNotes}
                          onChange={(e) => setBuyerNotes(e.target.value)}
                        />
                      </div>
                      <button type="submit" className="cp-product-btn-reserve">
                        Submit Confidential Prospectus Request
                      </button>
                    </form>
                </div>

                <div className="sl-chat-section">
                  <p className="sl-chat-section-label">Have questions?</p>
                  <LiveChatWidget vertical="classifieds" listingId={item.id} listingTitle={item.title} />
                </div>
              </div>
            </div>

            {/* Related Opportunities */}
            {related.length > 0 && (
              <div className="cp-related-section">
                <h3 className="cp-related-title">💼 Related Acquisition Prospects</h3>
                <div className="cp-related-grid">
                  {related.map((relItem) => (
                    <a
                      key={relItem.id}
                      href={themeLink(`/product/${relItem.slug}`)}
                      className="cp-related-card"
                      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                    >
                      <div className="cp-related-img-wrap">
                        <img src={relItem.image} className="cp-related-img" alt={relItem.title} />
                      </div>
                      <div className="cp-related-info">
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--cp-teal)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                          🛡️ {getCategoryLabel(relItem.category)}
                        </span>
                        <h4 className="cp-related-card-title">{relItem.title}</h4>
                        <div className="cp-related-price-row">
                          <span className="cp-related-price">{relItem.price}</span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>📍 {relItem.location.split(',')[0]}</span>
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

      <PremiumFooter />
    </div>
  );
}
