'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import type { ClassifiedListing } from '@sellio/types';
import { PremiumHeader, PremiumFooter } from './components';

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
const FALLBACK_CLASSIFIEDS: ClassifiedListing[] = [
  {
    id: 1,
    title: "Global SaaS Platform & API",
    slug: "global-saas-platform-api",
    description: "Recurring revenue subscription model with high-margin customer base and fully automated delivery workflow.",
    pricing: {
      base_price: 2500000,
      sale_price: 2500000,
      is_on_sale: false,
      discount: null,
      formatted: "$2,500,000",
      formatted_short: "$2.5M",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "Fully Remote",
      state: "Global"
    },
    taxonomy: {
      category: "tech"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400"
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: true,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 2,
    title: "Upscale Urban Health Club",
    slug: "upscale-urban-health-club",
    description: "Established high-tier brand in a fast-growing metropolitan area with stable recurring memberships.",
    pricing: {
      base_price: 950000,
      sale_price: 950000,
      is_on_sale: false,
      discount: null,
      formatted: "$950,000",
      formatted_short: "$950K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "New York City",
      state: "NY"
    },
    taxonomy: {
      category: "hospitality"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400"
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: true,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 3,
    title: "B2B Logistics & Warehousing",
    slug: "b2b-logistics-warehousing",
    description: "Asset-heavy operation with stable long-term contracts and prime midwest hub access.",
    pricing: {
      base_price: 1200000,
      sale_price: 1200000,
      is_on_sale: false,
      discount: null,
      formatted: "$1,200,000",
      formatted_short: "$1.2M",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "Chicago",
      state: "IL"
    },
    taxonomy: {
      category: "manufacturing"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400"
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: true,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 4,
    title: "Niche E-Commerce Coffee Brand",
    slug: "niche-e-commerce-coffee-brand",
    description: "Fully custom Shopify setup specializing in organic micro-lot coffee blends with solid organic search presence.",
    pricing: {
      base_price: 350000,
      sale_price: 350000,
      is_on_sale: false,
      discount: null,
      formatted: "$350,000",
      formatted_short: "$350K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "Remote",
      state: "US"
    },
    taxonomy: {
      category: "retail"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=400"
    },
    item_specs: {
      condition_rating: 4,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: false,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 5,
    title: "Local Cafe & Organic Bakery",
    slug: "local-cafe-organic-bakery",
    description: "Highly rated local spot in historic district featuring state-of-the-art kitchen equipment and high foot traffic.",
    pricing: {
      base_price: 120000,
      sale_price: 120000,
      is_on_sale: false,
      discount: null,
      formatted: "$120,000",
      formatted_short: "$120K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "Seattle",
      state: "WA"
    },
    taxonomy: {
      category: "hospitality"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400"
    },
    item_specs: {
      condition_rating: 4,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: false,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 6,
    title: "Regional Trucking Fleet Operation",
    slug: "regional-trucking-fleet-operation",
    description: "Operable fleet of 12 well-maintained semi-trucks, active CDL driver rosters, and contracted shipping lanes.",
    pricing: {
      base_price: 800000,
      sale_price: 800000,
      is_on_sale: false,
      discount: null,
      formatted: "$800,000",
      formatted_short: "$800K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "Dallas",
      state: "TX"
    },
    taxonomy: {
      category: "manufacturing"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=400"
    },
    item_specs: {
      condition_rating: 4,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: false,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  }
];

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
  const router = useRouter();

  // Component states
  const [item, setItem] = useState<OpportunityItem | null>(null);
  const [related, setRelated] = useState<OpportunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [errorTrace, setErrorTrace] = useState<string>('');

  // Inquiry/Booking states
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerOffer, setBuyerOffer] = useState('');
  const [buyerNotes, setBuyerNotes] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState<any>(null);

  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        return `/preview/classifieds_premium${path}`;
      }
    }
    return path;
  };

  useEffect(() => {
    const fetchListingDetails = async () => {
      setLoading(true);
      try {
        const response = await api.getClassifiedDetails(slug);
        if (response && response.data) {
          setItem(translateOpportunity(response.data));
          setUseFallback(false);

          // Get related items
          if (response.related_classifieds && response.related_classifieds.length > 0) {
            setRelated(response.related_classifieds.map(translateOpportunity));
          } else {
            const listRes = await api.getClassifieds();
            if (listRes && listRes.data) {
              const matched = listRes.data
                .filter(c => c.taxonomy?.category === response.data.taxonomy?.category && c.slug !== slug)
                .slice(0, 3)
                .map(translateOpportunity);
              setRelated(matched);
            }
          }
        } else {
          console.warn("Classified details response returned empty. Loading fallback.");
          loadFallbackDetails();
        }
      } catch (err: any) {
        console.error("[Offline Resilience] failed to fetch listing details: ", err);
        setErrorTrace(err?.stack || err?.message || String(err));
        loadFallbackDetails();
      } finally {
        setLoading(false);
      }
    };

    const loadFallbackDetails = () => {
      const matched = FALLBACK_CLASSIFIEDS.find(c => c.slug === slug) || FALLBACK_CLASSIFIEDS[0];
      setItem(translateOpportunity(matched));
      setUseFallback(true);

      const relatedMatched = FALLBACK_CLASSIFIEDS
        .filter(c => c.taxonomy?.category === matched.taxonomy?.category && c.slug !== slug)
        .slice(0, 3)
        .map(translateOpportunity);
      setRelated(relatedMatched);
    };

    if (slug) {
      fetchListingDetails();
    }
  }, [slug]);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!item) return;

    const orderData = {
      orderId: `PREM-INQ-${Date.now()}-${item.id}`,
      listingId: item.id,
      title: item.title,
      price: item.price,
      buyerName,
      buyerEmail,
      offerPrice: buyerOffer || item.price,
      notes: buyerNotes,
      date: new Date().toLocaleString(),
      theme: 'classifieds_premium'
    };

    // Save to LocalStorage
    try {
      const existing = localStorage.getItem('sellio_classifieds_premium_orders');
      const list = existing ? JSON.parse(existing) : [];
      list.push(orderData);
      localStorage.setItem('sellio_classifieds_premium_orders', JSON.stringify(list));
    } catch (e) {
      console.error("LocalStorage write failed:", e);
    }

    setOrderSuccess(true);
    setOrderSuccessData(orderData);
  };

  const handleBackNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(getThemeLink(''));
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
        onPostClick={() => alert("🔑 Institutional M&A Hub:\nPlease authenticate using your brokerage secure key to list a new private memorandum opportunity.")} 
      />

      <div className="cp-product-container">
        <div>
          <a href="#" className="cp-product-back-link" onClick={handleBackNavigation}>
            &larr; Return to M&A Investment Catalog
          </a>
        </div>

        {/* Resilience diagnostics trace block */}
        {useFallback && errorTrace && (
          <div className="cp-resilience-panel" style={{
            backgroundColor: '#ffffff',
            border: '2.5px dashed var(--cp-teal)',
            borderRadius: '12px',
            padding: '1.75rem',
            marginBottom: '2.5rem',
            fontFamily: 'var(--cp-font-body)',
            boxShadow: 'var(--cp-shadow-md)',
            color: 'var(--cp-navy)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--cp-teal)', fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.6rem', fontFamily: 'var(--cp-font-heading)', letterSpacing: '0.5px' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--cp-teal)' }}></span>
              🛰️ VETTED NETWORK DIAGNOSTICS & RESILIENCE PANEL
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem' }}>
              Status: Local Database Node Offline. Activating Vetted sovereign proxy backup assets gracefully.
            </div>
            <pre style={{ margin: 0, padding: '0.8rem 1.25rem', backgroundColor: '#f1f5f9', border: '1px solid var(--cp-border)', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#334155', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>{errorTrace}</pre>
          </div>
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
            <h3 style={{ fontFamily: 'var(--cp-font-heading)', color: 'var(--cp-navy)' }}>Acquisition profile not found.</h3>
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

                  {orderSuccess && orderSuccessData ? (
                    <div className="cp-booking-receipt">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cp-teal)', fontWeight: 900, fontSize: '0.95rem' }}>
                        <span>✓</span> <span>Prospectus Memorandum Requested!</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, borderBottom: '1px dashed var(--cp-teal)', paddingBottom: '0.5rem' }}>
                        An M&A coordinator will review your professional credentials and deliver the complete data room vault via encrypted transmission. Receipt:
                      </div>
                      <div className="cp-receipt-row">
                        <span>Transaction ID:</span>
                        <span style={{ fontFamily: 'monospace' }}>{orderSuccessData.orderId}</span>
                      </div>
                      <div className="cp-receipt-row">
                        <span>Acquisition Candidate:</span>
                        <span>{orderSuccessData.title}</span>
                      </div>
                      <div className="cp-receipt-row">
                        <span>Target Valuation Offer:</span>
                        <span style={{ color: 'var(--cp-teal)' }}>{orderSuccessData.offerPrice}</span>
                      </div>
                      <div className="cp-receipt-row" style={{ fontWeight: 800 }}>
                        <span>Status:</span>
                        <span>Credential Screening</span>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                  )}
                </div>
              </div>
            </div>

            {/* Related Opportunities */}
            {related.length > 0 && (
              <div className="cp-related-section">
                <h3 className="cp-related-title">💼 Related Acquisition Prospects</h3>
                <div className="cp-related-grid">
                  {related.map((relItem) => (
                    <div 
                      key={relItem.id} 
                      className="cp-related-card"
                      onClick={() => router.push(getThemeLink(`/product/${relItem.slug}`))}
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
                    </div>
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
