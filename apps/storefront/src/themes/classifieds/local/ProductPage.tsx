'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import type { ClassifiedListing } from '@sellio/types';
import { LocalHeader, LocalFooter } from './components';

interface LocalItem {
  id: number;
  title: string;
  price: string;
  numericPrice: number;
  distance: string;
  numericDistance: number;
  neighborhood: string;
  image: string;
  sellerInitials: string;
  sellerName: string;
  category: string;
  categoryIcon: string;
  conditionLabel: string;
  mapTop: number;
  mapLeft: number;
  slug: string;
}

const FALLBACK_CLASSIFIEDS: ClassifiedListing[] = [
  {
    id: 1,
    title: "Like-New Trek Mountain Bike",
    slug: "like-new-trek-mountain-bike",
    description: "Trek mountain bike in pristine state. Multi-gear shifts, standard suspension, ready for mountain routes.",
    pricing: {
      base_price: 350,
      sale_price: 350,
      is_on_sale: false,
      discount: null,
      formatted: "$350",
      formatted_short: "$350",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Capitol Hill", state: "WA" },
    taxonomy: { category: "bikes", brand: "John Smith" },
    media: { main_photo: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=400" },
    item_specs: { condition_rating: 5, condition_label: "Excellent", badge_class: "cl-badge-excellent", quantity: 1, dimensions: "32,38" },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: false }
  },
  {
    id: 2,
    title: "Wooden Dining Table + 4 Chairs",
    slug: "wooden-dining-table-4-chairs",
    description: "Solid oak dining table set with 4 matching comfortable chairs. Minor wear on tabletop.",
    pricing: {
      base_price: 150,
      sale_price: 150,
      is_on_sale: false,
      discount: null,
      formatted: "$150",
      formatted_short: "$150",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "First Hill", state: "WA" },
    taxonomy: { category: "home", brand: "Marie Laurent" },
    media: { main_photo: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Good", badge_class: "cl-badge-good", quantity: 1, dimensions: "55,64" },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 3,
    title: "Box of Baby Clothes (0-6 months)",
    slug: "box-of-baby-clothes-0-6-months",
    description: "Clean assortment of unisex baby clothes. Gown, onesies, socks, and hats included.",
    pricing: {
      base_price: 0,
      sale_price: 0,
      is_on_sale: false,
      discount: null,
      formatted: "Free",
      formatted_short: "Free",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Capitol Hill", state: "WA" },
    taxonomy: { category: "kids", brand: "Alice Baker" },
    media: { main_photo: "https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Like New", badge_class: "cl-badge-likenew", quantity: 1, dimensions: "45,22" },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: false }
  },
  {
    id: 4,
    title: "Monstera Deliciosa Plant (Large)",
    slug: "monstera-deliciosa-plant-large",
    description: "Healthy indoor potted plant. 4 feet tall with wide split leaves, extremely easy to maintain.",
    pricing: {
      base_price: 40,
      sale_price: 40,
      is_on_sale: false,
      discount: null,
      formatted: "$40",
      formatted_short: "$40",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Queen Anne", state: "WA" },
    taxonomy: { category: "home", brand: "Ryan Taylor" },
    media: { main_photo: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Healthy", badge_class: "cl-badge-healthy", quantity: 1, dimensions: "18,58" },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 5,
    title: "IKEA Kallax Shelf Unit (White)",
    slug: "ikea-kallax-shelf-unit-white",
    description: "Standard Kallax organizer with 4 cube compartments. Clean condition, slight cosmetic scuffs.",
    pricing: {
      base_price: 45,
      sale_price: 45,
      is_on_sale: false,
      discount: null,
      formatted: "$45",
      formatted_short: "$45",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Belltown", state: "WA" },
    taxonomy: { category: "home", brand: "Karen Davis" },
    media: { main_photo: "https://images.unsplash.com/photo-1595514535115-d52fdfbc3075?q=80&w=400" },
    item_specs: { condition_rating: 3, condition_label: "Fair", badge_class: "cl-badge-fair", quantity: 1, dimensions: "72,46" },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 6,
    title: "Neighborhood Moving Sale - Sunday",
    slug: "neighborhood-moving-sale-sunday",
    description: "Huge selection of household tools, garage elements, vintage records, and winter jackets.",
    pricing: {
      base_price: 10,
      sale_price: 10,
      is_on_sale: false,
      discount: null,
      formatted: "Varies",
      formatted_short: "Varies",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Capitol Hill", state: "WA" },
    taxonomy: { category: "garage", brand: "Eric Wright" },
    media: { main_photo: "https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Multi-item", badge_class: "cl-badge-multi", quantity: 1, dimensions: "28,74" },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 7,
    title: "Dog Crate - Medium Size Wire",
    slug: "dog-crate-medium-size-wire",
    description: "Folds flat for storage. Security locks and bottom plastic tray are completely intact.",
    pricing: {
      base_price: 25,
      sale_price: 25,
      is_on_sale: false,
      discount: null,
      formatted: "$25",
      formatted_short: "$25",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Fremont", state: "WA" },
    taxonomy: { category: "pets", brand: "Peter Parker" },
    media: { main_photo: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Good", badge_class: "cl-badge-good", quantity: 1, dimensions: "12,15" },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 8,
    title: "Baby Jogger Stroller (Red)",
    slug: "baby-jogger-stroller-red",
    description: "Highly robust running stroller. Features three durable shock-absorbent all-terrain tires.",
    pricing: {
      base_price: 95,
      sale_price: 95,
      is_on_sale: false,
      discount: null,
      formatted: "$95",
      formatted_short: "$95",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Ballard", state: "WA" },
    taxonomy: { category: "kids", brand: "Mary Jane" },
    media: { main_photo: "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=400" },
    item_specs: { condition_rating: 5, condition_label: "Excellent", badge_class: "cl-badge-excellent", quantity: 1, dimensions: "82,84" },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  }
];

const translateListing = (item: ClassifiedListing): LocalItem => {
  const generatedSlug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const coords = item.item_specs?.dimensions?.split(",") || [];
  const mapTop = coords.length === 2 ? parseInt(coords[0]) : (20 + (item.id * 7) % 70);
  const mapLeft = coords.length === 2 ? parseInt(coords[1]) : (15 + (item.id * 9) % 75);
  const numericDistance = item.id * 0.45;
  const category = item.taxonomy?.category || "home";
  
  let categoryIcon = "📍";
  if (category === 'bikes') categoryIcon = '🚲';
  else if (category === 'home') categoryIcon = '🏡';
  else if (category === 'kids') categoryIcon = '🧸';
  else if (category === 'pets') categoryIcon = '🐾';
  else if (category === 'garage') categoryIcon = '🏷️';
  
  const seller = item.taxonomy?.brand || "Neighbor";
  const initials = seller.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase() || "N";
  
  const isFree = item.pricing?.sale_price === 0 || item.pricing?.base_price === 0;
  const priceLabel = isFree ? "Free" : (item.pricing?.formatted || `$${(item.pricing?.sale_price || item.pricing?.base_price || 0).toLocaleString()}`);
  
  return {
    id: item.id,
    title: item.title,
    price: priceLabel,
    numericPrice: item.pricing?.sale_price || item.pricing?.base_price || 0,
    distance: numericDistance.toFixed(1),
    numericDistance: numericDistance,
    neighborhood: item.location?.city || "Capitol Hill",
    image: item.media?.main_photo || item.media?.thumbnail || "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=400",
    sellerInitials: initials,
    sellerName: seller,
    category: category,
    categoryIcon: categoryIcon,
    conditionLabel: item.item_specs?.condition_label || "Good",
    mapTop: mapTop,
    mapLeft: mapLeft,
    slug: generatedSlug
  };
};

export default function ProductPage({ slug }: { slug: string }) {
  const router = useRouter();

  // Component states
  const [item, setItem] = useState<LocalItem | null>(null);
  const [related, setRelated] = useState<LocalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [errorTrace, setErrorTrace] = useState<string>('');

  // Inquiry drawer states
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
        return `/preview/classifieds_local${path}`;
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
          const mainItem = translateListing(response.data);
          setItem(mainItem);
          setUseFallback(false);

          // Get related items
          if (response.related_classifieds && response.related_classifieds.length > 0) {
            setRelated(response.related_classifieds.map(translateListing));
          } else {
            const listRes = await api.getClassifieds();
            if (listRes && listRes.data) {
              const matched = listRes.data
                .filter(c => c.taxonomy?.category === response.data.taxonomy?.category && c.slug !== slug)
                .slice(0, 3)
                .map(translateListing);
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
      const translatedMain = translateListing(matched);
      setItem(translatedMain);
      setUseFallback(true);

      const relatedMatched = FALLBACK_CLASSIFIEDS
        .filter(c => c.taxonomy?.category === matched.taxonomy?.category && c.slug !== slug)
        .slice(0, 3)
        .map(translateListing);
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
      orderId: `ORD-${Date.now()}-${item.id}`,
      listingId: item.id,
      title: item.title,
      price: item.price,
      buyerName,
      buyerEmail,
      offerPrice: buyerOffer || item.price,
      notes: buyerNotes,
      date: new Date().toLocaleString(),
      theme: 'classifieds_local'
    };

    // Save to LocalStorage
    try {
      const existing = localStorage.getItem('sellio_classifieds_local_orders');
      const list = existing ? JSON.parse(existing) : [];
      list.push(orderData);
      localStorage.setItem('sellio_classifieds_local_orders', JSON.stringify(list));
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
    <div className="cl-product-wrapper">
      <LocalHeader 
        onPostClick={() => alert("📸 Posting neighbor-to-neighbor listings is exclusive to verified local members. Please sign in.")}
        onLocationClick={() => alert("📍 Location bounds are locked to active municipal zones.")}
        locationName={item?.neighborhood || "Capitol Hill"}
      />

      <div className="cl-product-container">
        <div>
          <a href="#" className="cl-product-back-link" onClick={handleBackNavigation}>
            &larr; Back to Neighborhood Listings
          </a>
        </div>

        {/* Resilience diagnostics trace block */}
        {useFallback && errorTrace && (
          <div className="cl-resilience-panel">
            <div className="cl-resilience-header">
              🛡️ <span>Database connection offline. Showing backup neighborhood listing.</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--cl-text-muted)', fontWeight: 600 }}>
              The storefront engine intercepted a database network exception and loaded offline simulations. Structured Diagnostics:
            </div>
            <pre className="cl-resilience-trace">{errorTrace}</pre>
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
        ) : !item ? (
          <div className="text-center p-20">
            <h3>Listing not found.</h3>
          </div>
        ) : (
          <>
            <div className="cl-product-main-grid">
              {/* Left Column: Image and Specs */}
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

              {/* Right Column: Title, description, seller info, and Booking form */}
              <div className="cl-product-details-block">
                <div className="cl-product-description-card">
                  <div className="cl-product-meta-header">
                    <div className="cl-product-title-row">
                      <h1 className="cl-product-title">{item.title}</h1>
                    </div>
                    <div className="cl-product-price">{item.price}</div>
                    <div className="cl-product-meta-row">
                      <span className="cl-product-badge">{item.category}</span>
                      <span className={`cl-product-badge cl-badge-excellent`}>{item.conditionLabel}</span>
                      <span className="cl-product-badge">📍 {item.neighborhood}</span>
                    </div>
                  </div>
                  
                  <div style={{ borderTop: '1.5px dashed var(--cl-border)', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
                    <h4 className="cl-product-card-title" style={{ color: 'var(--cl-text-main)', fontSize: '0.95rem', fontWeight: 800 }}>Description</h4>
                    <p className="cl-product-description">
                      This item is listed by a verified neighbor in the {item.neighborhood} community group. 
                      Perfect for local pickup and secure face-to-face neighborhood handovers. Safe exchange points available!
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

                {/* Secure Inquiry Form */}
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
                        Your message has been secure-routed through the NeighborHood community hub. Receipt:
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
                      <div className="cl-receipt-row" style={{ fontWeight: 800 }}>
                        <span>Status:</span>
                        <span>Pending Handshake</span>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

            {/* Related Neighborhood Bargains */}
            {related.length > 0 && (
              <div className="cl-related-section">
                <h3 className="cl-related-title">🌿 Other Neighborhood Offers</h3>
                <div className="cl-related-grid">
                  {related.map((relItem) => (
                    <div 
                      key={relItem.id} 
                      className="cl-related-card"
                      onClick={() => router.push(getThemeLink(`/product/${relItem.slug}`))}
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
