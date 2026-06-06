'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import type { ClassifiedListing } from '@sellio/types';
import {
  classifiedCategoriesMatch,
  getClassifiedCategoryKey,
  getClassifiedCategoryTitle,
} from '@/lib/classified-category';

// Premium high-fidelity Classifieds Elite fallback listings matching Page.tsx
const FALLBACK_CLASSIFIEDS: ClassifiedListing[] = [
  {
    id: 1,
    title: "1963 Ferrari 250 GTO Berlinetta",
    slug: "1963-ferrari-250-gto-berlinetta",
    description: "One of only 36 models ever built by Scaglietti. Completely documented ownership lineage, Ferrari Classiche certified. Features matching numbers, pristine race record, and iconic Rosso Corsa paintwork.",
    pricing: {
      base_price: 72000000,
      sale_price: 72000000,
      is_on_sale: false,
      discount: null,
      formatted: "$72,000,000",
      formatted_short: "$72M",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Classiche A+",
      badge_class: "cd-badge-like-new",
      quantity: 1,
      dimensions: "VAULT_MILAN_98"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=400",
    },
    taxonomy: {
      category: "motors",
      brand: "Ferrari"
    },
    location: {
      city: "Maranello",
      state: "Italy"
    },
    status: {
      is_published: true,
      is_featured: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 2,
    title: "Claude Monet 'Water Lilies' (1906 Oil)",
    slug: "claude-monet-water-lilies-1906-oil",
    description: "A signature oil on canvas masterpiece from Monet's highly coveted water garden series in Giverny. Flawless canvas preservation, documented in major museum exhibitions globally.",
    pricing: {
      base_price: 54000000,
      sale_price: 54000000,
      is_on_sale: false,
      discount: null,
      formatted: "$54,000,000",
      formatted_short: "$54M",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Certified Museum Grade",
      badge_class: "cd-badge-like-new",
      quantity: 1,
      dimensions: "VAULT_GENEVA_12"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400",
    },
    taxonomy: {
      category: "art",
      brand: "Claude Monet"
    },
    location: {
      city: "Paris",
      state: "France"
    },
    status: {
      is_published: true,
      is_featured: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 3,
    title: "Macallan Fine & Rare 1926 Whisky (60 Year)",
    slug: "macallan-fine-rare-1926-whisky-60-year",
    description: "Voted the most collectible single-malt bottle in existence. Matured in seasoned sherry casks for 60 years. Hand-signed label from the master distiller with original presentation chest.",
    pricing: {
      base_price: 1900000,
      sale_price: 1900000,
      is_on_sale: false,
      discount: null,
      formatted: "$1,900,000",
      formatted_short: "$1.9M",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Grade 10 Cask",
      badge_class: "cd-badge-like-new",
      quantity: 1,
      dimensions: "VAULT_EDINBURGH_44"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?q=80&w=400",
    },
    taxonomy: {
      category: "spirits",
      brand: "Macallan"
    },
    location: {
      city: "Speyside",
      state: "Scotland"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 4,
    title: "Patek Philippe Sky Moon Tourbillon",
    slug: "patek-philippe-sky-moon-tourbillon",
    description: "One of the most complicated wristwatches in horological history. Dual-faced dial showing cathedral gongs minute repeater, perpetual calendar, solar time, and sky chart configurations.",
    pricing: {
      base_price: 3200000,
      sale_price: 3200000,
      is_on_sale: false,
      discount: null,
      formatted: "$3,200,000",
      formatted_short: "$3.2M",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Patek Seal Perfect",
      badge_class: "cd-badge-like-new",
      quantity: 1,
      dimensions: "VAULT_ZURICH_87"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400",
    },
    taxonomy: {
      category: "horology",
      brand: "Patek Philippe"
    },
    location: {
      city: "Geneva",
      state: "Switzerland"
    },
    status: {
      is_published: true,
      is_featured: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 5,
    title: "The Pink Star Oval Vivid Diamond Ring",
    slug: "the-pink-star-oval-vivid-diamond-ring",
    description: "A monumental 59.60 carat oval mixed-cut fancy vivid pink diamond. Flawless clarity grade, verified by GIA. Mounted on an elegant premium platinum band setting.",
    pricing: {
      base_price: 71200000,
      sale_price: 71200000,
      is_on_sale: false,
      discount: null,
      formatted: "$71,200,000",
      formatted_short: "$71.2M",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Flawless Fancy Vivid",
      badge_class: "cd-badge-like-new",
      quantity: 1,
      dimensions: "VAULT_LONDON_02"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400",
    },
    taxonomy: {
      category: "art",
      brand: "Sotheby's Fine Jewelry"
    },
    location: {
      city: "London",
      state: "United Kingdom"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 6,
    title: "Koenigsegg Jesko Absolut Hypercar",
    slug: "koenigsegg-jesko-absolut-hypercar",
    description: "The fastest car Koenigsegg will ever build. Custom carbon weave active bodywork, 1600 HP twin-turbo V8, and custom titanium exhaust components. 1 of 1 signature specification.",
    pricing: {
      base_price: 3400000,
      sale_price: 3400000,
      is_on_sale: false,
      discount: null,
      formatted: "$3,400,000",
      formatted_short: "$3.4M",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Factory Certified 1 of 1",
      badge_class: "cd-badge-like-new",
      quantity: 1,
      dimensions: "VAULT_GOTHENBURG_30"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=400",
    },
    taxonomy: {
      category: "motors",
      brand: "Koenigsegg"
    },
    location: {
      city: "Ängelholm",
      state: "Sweden"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: false,
      is_shipping: false
    }
  }
];

// Helper translators matching Page.tsx
const getAssetPrice = (item: ClassifiedListing): string => {
  return item.pricing?.formatted || item.pricing?.formatted_short || `$${(item.pricing?.sale_price || item.pricing?.base_price || 0).toLocaleString()}`;
};

const getAssetCategoryLabel = (item: ClassifiedListing): string => {
  const categoryKey = getClassifiedCategoryKey(item.taxonomy?.category);
  if (!categoryKey) return 'Elite Asset';
  if (categoryKey === 'motors') return 'Exotic Motors';
  if (categoryKey === 'art') return 'Fine Art Portfolio';
  if (categoryKey === 'spirits') return 'Rare Vintages';
  if (categoryKey === 'horology') return 'Luxury Horology';
  return getClassifiedCategoryTitle(item.taxonomy?.category, categoryKey);
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

  // Component states
  const [item, setItem] = useState<ClassifiedListing | null>(null);
  const [related, setRelated] = useState<ClassifiedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [errorTrace, setErrorTrace] = useState<string>('');

  // Inquiry concierge states
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
        return `/preview/classifieds_elite${path}`;
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
          setItem(response.data);
          setUseFallback(false);

          // Get related items
          if (response.related_classifieds && response.related_classifieds.length > 0) {
            setRelated(response.related_classifieds);
          } else {
            const listRes = await api.getClassifieds();
            if (listRes && listRes.data) {
              const matched = listRes.data
                .filter(c => classifiedCategoriesMatch(c.taxonomy?.category, response.data.taxonomy?.category) && c.slug !== slug)
                .slice(0, 3);
              setRelated(matched);
            }
          }
        } else {
          console.warn("Classifieds Elite details response returned empty. Loading fallback.");
          loadFallbackDetails();
        }
      } catch (err: any) {
        console.error("[Offline Resilience] failed to fetch elite listing details: ", err);
        setErrorTrace(err?.stack || err?.message || String(err));
        loadFallbackDetails();
      } finally {
        setLoading(false);
      }
    };

    const loadFallbackDetails = () => {
      const matched = FALLBACK_CLASSIFIEDS.find(c => c.slug === slug) || FALLBACK_CLASSIFIEDS[0];
      setItem(matched);
      setUseFallback(true);

      const relatedMatched = FALLBACK_CLASSIFIEDS
        .filter(c => classifiedCategoriesMatch(c.taxonomy?.category, matched.taxonomy?.category) && c.slug !== slug)
        .slice(0, 3);
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
      orderId: `ELITE-INQ-${Date.now()}-${item.id}`,
      listingId: item.id,
      title: item.title,
      price: getAssetPrice(item),
      vaultId: getAssetVaultId(item),
      buyerName,
      buyerEmail,
      offerPrice: buyerOffer || getAssetPrice(item),
      notes: buyerNotes,
      date: new Date().toLocaleString(),
      theme: 'classifieds_elite'
    };

    // Save to LocalStorage
    try {
      const existing = localStorage.getItem('sellio_classifieds_elite_orders');
      const list = existing ? JSON.parse(existing) : [];
      list.push(orderData);
      localStorage.setItem('sellio_classifieds_elite_orders', JSON.stringify(list));
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

  return (
    <div className="elite-product-wrapper">
      <div className="elite-product-container">
        <div>
          <a href="#" className="elite-product-back-link" onClick={handleBackNavigation}>
            &larr; Return to Private Vault Catalog
          </a>
        </div>

        {/* Resilience diagnostics trace block */}
        {useFallback && errorTrace && (
          <div className="elite-resilience-panel" style={{
            backgroundColor: '#0c0c0d',
            border: '2.5px dashed var(--prem-accent)',
            borderRadius: '16px',
            padding: '1.75rem',
            margin: '0 0 2.5rem 0',
            fontFamily: 'var(--prem-sans)',
            boxShadow: '0 8px 32px rgba(212, 175, 55, 0.05)',
            color: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--prem-accent)', fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.6rem', fontFamily: 'var(--prem-serif)', letterSpacing: '1px' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--prem-accent)' }}></span>
              VAULT RESILIENCE LAYER: Private Catalog Backups Engaged
            </div>
            <div style={{ color: 'var(--prem-muted)', fontSize: '0.85rem', lineHeight: '1.6' }}>
              <strong>DIAGNOSTICS TRACE:</strong> {errorTrace}
            </div>
          </div>
        )}

        {loading ? (
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
        ) : !item ? (
          <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
            <h3 style={{ fontFamily: 'var(--prem-serif)', color: '#ffffff' }}>Asset not found in private registry.</h3>
          </div>
        ) : (
          <>
            <div className="elite-product-main-grid">
              {/* Left Column: Image and Specs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="elite-product-gallery">
                  <div className="elite-product-main-img-wrap">
                    <img src={item.media?.main_photo || item.media?.thumbnail || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=600"} className="elite-product-main-img" alt={item.title} />
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

              {/* Right Column: Title, description, and Concierge Form */}
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
                      {item.description || "This extremely high-value asset has been vetted and listed by our private global advisory node. Authentication certificate is sealed under secured vault storage. Documented ownership lineage is fully verifiable."}
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

                {/* Secure Concierge Booking Form */}
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

            {/* Related Vault Collections */}
            {related.length > 0 && (
              <div className="elite-related-section">
                <h3 className="elite-related-title">🏺 Other High-Value Vaults</h3>
                <div className="elite-related-grid">
                  {related.map((relItem) => (
                    <div 
                      key={relItem.id} 
                      className="elite-related-card"
                      onClick={() => router.push(getThemeLink(`/product/${relItem.slug}`))}
                    >
                      <div className="elite-related-img-wrap">
                        <img src={relItem.media?.thumbnail || relItem.media?.main_photo || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=400"} className="elite-related-img" alt={relItem.title} />
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
          </>
        )}
      </div>

      {/* Styled JSX for pulse skeleton and visual enhancements */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .4; }
        }
      `}</style>

    </div>
  );
}
