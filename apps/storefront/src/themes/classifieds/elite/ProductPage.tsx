'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ClassifiedListing } from '@sellio/types';
import { CatalogSyncAlert } from '@/themes/classifieds/shared/CatalogSyncAlert';
import {
  fetchClassifiedDetail,
  fetchClassifiedsHome,
  getRelatedFromApi,
  resolveClassifiedFailure,
} from '@/themes/classifieds/shared/catalog';
import { submitClassifiedInquiry } from '@/themes/classifieds/shared/submit-inquiry';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';
import { useDemoFallbackAllowed } from '@/themes/classifieds/shared/useDemoFallbackAllowed';

const getAssetPrice = (item: ClassifiedListing): string => {
  return item.pricing?.formatted || item.pricing?.formatted_short || `$${(item.pricing?.sale_price || item.pricing?.base_price || 0).toLocaleString()}`;
};

const getAssetCategoryLabel = (item: ClassifiedListing): string => {
  const categoryKey = (item.taxonomy?.category || '').toString().toLowerCase();
  if (categoryKey === 'motors') return 'Exotic Motors';
  if (categoryKey === 'art') return 'Fine Art Portfolio';
  if (categoryKey === 'spirits') return 'Rare Vintages';
  if (categoryKey === 'horology') return 'Luxury Horology';
  return item.taxonomy?.category || 'Elite Asset';
};

const getAssetLocation = (item: ClassifiedListing): string => {
  if (!item.location) return 'Vetted Origin';
  return `${item.location.city || 'Geneva'}, ${item.location.state || 'Switzerland'}`;
};

const getAssetVaultId = (item: ClassifiedListing): string => {
  return item.item_specs?.dimensions || `VAULT_${(item.location?.city || 'GENEVA').toUpperCase()}_${item.id}`;
};

const getAssetGrade = (item: ClassifiedListing): string => {
  return item.item_specs?.condition_label || 'Certified Museum Grade';
};

export default function ProductPage({ slug }: { slug: string }) {
  const router = useRouter();
  const themeLink = useClassifiedsThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const [item, setItem] = useState<ClassifiedListing | null>(null);
  const [related, setRelated] = useState<ClassifiedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerOffer, setBuyerOffer] = useState('');
  const [buyerNotes, setBuyerNotes] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState<any>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchListingDetails() {
      setLoading(true);
      setNotFound(false);
      const result = await fetchClassifiedDetail(slug);

      if (result.ok && result.response.data) {
        setItem(result.response.data);
        setUseFallback(false);
        setApiError(null);
        setRelated(
          getRelatedFromApi(
            result.response.data,
            result.response.related_classifieds,
            slug,
            undefined,
          ),
        );

        if (!result.response.related_classifieds?.length) {
          const listResult = await fetchClassifiedsHome({ limit: 4 });
          if (listResult.ok && listResult.response.data) {
            setRelated(
              getRelatedFromApi(
                result.response.data,
                undefined,
                slug,
                listResult.response.data,
              ),
            );
          }
        }
      } else {
        const errorMsg = result.ok ? 'Listing not found or API returned no data.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveClassifiedFailure(slug, allowDemo, 'elite');

        if (resolution.mode === 'demo') {
          setItem(resolution.listing);
          setRelated(resolution.related);
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
      fetchListingDetails();
    }
  }, [slug, allowDemo]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail) {
      setFormError('Please fill in all required fields.');
      return;
    }
    setFormError(null);

    if (!item) return;

    const assetPrice = getAssetPrice(item);
    setIsSubmitting(true);

    const result = await submitClassifiedInquiry({
      slug,
      useFallback,
      storageKey: 'sellio_classifieds_elite_orders',
      fullName: buyerName,
      email: buyerEmail,
      message: buyerNotes.trim() || undefined,
      offerPrice: buyerOffer.trim() || assetPrice,
      demoOrderData: {
        orderId: `ELITE-INQ-${Date.now()}-${item.id}`,
        listingId: item.id,
        title: item.title,
        price: assetPrice,
        vaultId: getAssetVaultId(item),
        buyerName,
        buyerEmail,
        offerPrice: buyerOffer || assetPrice,
        notes: buyerNotes,
        date: new Date().toLocaleString(),
        theme: 'classifieds_elite',
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
      offerPrice: buyerOffer || assetPrice,
    });
  };

  const handleBackNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(themeLink(''));
  };

  if (loading) {
    return (
      <div className="elite-product-wrapper">
        <div className="elite-product-container">
          <div className="elite-product-main-grid">
            <div className="elite-product-gallery">
              <div className="elite-product-main-img-wrap" style={{ animation: 'pulse 1.5s infinite' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: '#18181b' }} />
              </div>
            </div>
            <div className="elite-product-details-block">
              <div style={{ height: '32px', width: '70%', backgroundColor: '#18181b', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
              <div style={{ height: '40px', width: '30%', backgroundColor: '#18181b', borderRadius: '4px', animation: 'pulse 1.5s infinite', marginTop: '1rem' }} />
              <div style={{ height: '150px', width: '100%', backgroundColor: '#18181b', borderRadius: '12px', animation: 'pulse 1.5s infinite', marginTop: '1.5rem' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="elite-product-wrapper">
        {(useFallback || apiError) && apiError && (
          <CatalogSyncAlert
            classPrefix="ce"
            variant={useFallback ? 'demo' : 'production'}
            error={apiError}
          />
        )}
        <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
          <h3 style={{ fontFamily: 'var(--prem-serif)', color: '#ffffff' }}>
            {notFound ? 'Asset not found in private registry.' : 'Unable to load private vault listing.'}
          </h3>
          <button
            className="elite-modal-cta"
            style={{ marginTop: '1.25rem' }}
            onClick={() => router.push(themeLink(''))}
          >
            Return to Private Vault Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="elite-product-wrapper">
      <div className="elite-product-container">
        <div>
          <a href="#" className="elite-product-back-link" onClick={handleBackNavigation}>
            &larr; Return to Private Vault Catalog
          </a>
        </div>

        {(useFallback || apiError) && apiError && (
          <CatalogSyncAlert
            classPrefix="ce"
            variant={useFallback ? 'demo' : 'production'}
            error={apiError}
          />
        )}

        <div className="elite-product-main-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="elite-product-gallery">
              <div className="elite-product-main-img-wrap">
                <img src={item.media?.main_photo || item.media?.thumbnail || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=600'} className="elite-product-main-img" alt={item.title} />
              </div>
            </div>

            <div className="elite-product-description-card">
              <h4 className="elite-product-card-title">Secured Vault Specifications</h4>
              <div className="elite-product-specs-grid">
                <div className="elite-product-spec-item">
                  <span className="elite-product-spec-label">Custodian Appraisal Grade</span>
                  <span className="elite-product-spec-value">{getAssetGrade(item)}</span>
                </div>
                <div className="elite-product-spec-item">
                  <span className="elite-product-spec-label">Assigned Vault ID</span>
                  <span className="elite-product-spec-value" style={{ fontFamily: 'monospace' }}>{getAssetVaultId(item)}</span>
                </div>
                <div className="elite-product-spec-item">
                  <span className="elite-product-spec-label">Registry Origin</span>
                  <span className="elite-product-spec-value">{getAssetLocation(item)}</span>
                </div>
                <div className="elite-product-spec-item">
                  <span className="elite-product-spec-label">Asset Classification</span>
                  <span className="elite-product-spec-value">{getAssetCategoryLabel(item)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="elite-product-details-block">
            <div className="elite-product-description-card">
              <div className="elite-product-meta-header">
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--prem-accent)', letterSpacing: '4px', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                  🛡️ Curated Exclusive Vault Listing
                </span>
                <h1 className="elite-product-title">{item.title}</h1>
                <div className="elite-product-price">{getAssetPrice(item)}</div>
                <div className="elite-product-meta-row">
                  <span className="elite-product-badge">{getAssetCategoryLabel(item)}</span>
                  <span className="elite-product-badge">📍 {getAssetLocation(item).split(',')[0]}</span>
                  <span className="elite-product-badge" style={{ fontFamily: 'monospace' }}>{getAssetVaultId(item)}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px dashed var(--prem-border)', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
                <h4 className="elite-product-card-title" style={{ fontSize: '0.95rem', fontWeight: 800 }}>Acquisition Description</h4>
                <p className="elite-product-description">
                  {item.description || 'This extremely high-value asset has been vetted and listed by our private global advisory node. Authentication certificate is sealed under secured vault storage. Documented ownership lineage is fully verifiable.'}
                </p>
              </div>
            </div>

            <div className="elite-product-seller-card">
              <div className="elite-product-seller-avatar">GA</div>
              <div className="elite-product-seller-info">
                <h5 className="elite-product-seller-name">Global Advisory Vaults</h5>
                <span className="elite-product-seller-badge">🔒 Vetted Advisory Custodian &bull; {getAssetLocation(item)}</span>
              </div>
            </div>

            <div className="elite-product-booking-drawer">
              <h4 className="elite-product-card-title" style={{ margin: 0 }}>💼 Request Prospectus Memorandum</h4>
              <div style={{ fontSize: '0.8rem', color: 'var(--prem-muted)', lineHeight: '1.5', fontWeight: 600 }}>
                Provide your professional details to establish encrypted communication with the key vault custodian at <span style={{ fontFamily: 'monospace', color: 'var(--prem-accent)' }}>{getAssetVaultId(item)}</span>.
              </div>

              {orderSuccess && orderSuccessData ? (
                <div className="elite-booking-receipt">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--prem-accent)', fontWeight: 900, fontSize: '0.95rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    <span>✓</span> <span>Prospectus Requested!</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--prem-muted)', fontWeight: 600, borderBottom: '1px dashed var(--prem-accent)', paddingBottom: '0.5rem', lineHeight: '1.5' }}>
                    Advisory invitation pending brokerage handshake. An encrypted communications node will launch shortly.
                  </div>
                  <div className="elite-receipt-row">
                    <span>Prospectus ID:</span>
                    <span style={{ fontFamily: 'monospace', color: '#ffffff' }}>{orderSuccessData.orderId}</span>
                  </div>
                  <div className="elite-receipt-row">
                    <span>Broker Account:</span>
                    <span style={{ color: '#ffffff' }}>{orderSuccessData.buyerName}</span>
                  </div>
                  <div className="elite-receipt-row">
                    <span>Target Capital Offer:</span>
                    <span style={{ color: 'var(--prem-accent)' }}>{orderSuccessData.offerPrice}</span>
                  </div>
                  <div className="elite-receipt-row" style={{ fontWeight: 800 }}>
                    <span>Status:</span>
                    <span>Security Screening</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {formError && <div className="ce-form-error">{formError}</div>}
                  <div className="elite-booking-form-group">
                    <label className="elite-booking-label">Broker / Investor Name *</label>
                    <input
                      type="text"
                      required
                      className="elite-booking-input"
                      placeholder="e.g. Sterling H. Croft"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                    />
                  </div>
                  <div className="elite-booking-form-group">
                    <label className="elite-booking-label">Encrypted Terminal Email *</label>
                    <input
                      type="email"
                      required
                      className="elite-booking-input"
                      placeholder="e.g. croft@advisory-vaults.net"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                    />
                  </div>
                  <div className="elite-booking-form-group">
                    <label className="elite-booking-label">Proposed Acquisition Capital Offer (Optional)</label>
                    <input
                      type="text"
                      className="elite-booking-input"
                      placeholder={`Default is ${getAssetPrice(item)}`}
                      value={buyerOffer}
                      onChange={(e) => setBuyerOffer(e.target.value)}
                    />
                  </div>
                  <div className="elite-booking-form-group">
                    <label className="elite-booking-label">Confidential Advisory Notes (Optional)</label>
                    <textarea
                      rows={2}
                      className="elite-booking-input"
                      style={{ resize: 'none', height: '60px' }}
                      placeholder="e.g. Advise if physical vault inspection at Geneva is available during June..."
                      value={buyerNotes}
                      onChange={(e) => setBuyerNotes(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="elite-product-btn-reserve">
                    Submit Member Prospectus Request
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="elite-related-section" id="ce-catalog">
            <h3 className="elite-related-title">🏺 Other High-Value Vaults</h3>
            <div className="elite-related-grid">
              {related.map((relItem) => (
                <div
                  key={relItem.id}
                  className="elite-related-card"
                  onClick={() => router.push(themeLink(`/product/${relItem.slug}`))}
                >
                  <div className="elite-related-img-wrap">
                    <img src={relItem.media?.thumbnail || relItem.media?.main_photo || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=400'} className="elite-related-img" alt={relItem.title} />
                  </div>
                  <div className="elite-related-info">
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--prem-accent)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                      🛡️ {getAssetCategoryLabel(relItem)}
                    </span>
                    <h4 className="elite-related-card-title">{relItem.title}</h4>
                    <div className="elite-related-price-row">
                      <span className="elite-related-price">{getAssetPrice(relItem)}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--prem-muted)', fontWeight: 800 }}>📍 {getAssetLocation(relItem).split(',')[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .4; }
        }
      `}</style>
    </div>
  );
}
