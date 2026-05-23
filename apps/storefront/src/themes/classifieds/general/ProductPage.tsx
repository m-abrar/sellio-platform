'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import type { ClassifiedListing } from '@sellio/types';
import { GeneralHeader, GeneralFooter } from './components';

interface ListingItem {
  id: number;
  title: string;
  price: string;
  numericPrice: number;
  image: string;
  seller: string;
  isSaved: boolean;
  category: string;
  localPickup: boolean;
  delivery: boolean;
  dateAdded: number;
  slug: string;
  description?: string;
  conditionLabel?: string;
  quantity?: number;
}

const FALLBACK_CLASSIFIEDS: ClassifiedListing[] = [
  {
    id: 1,
    title: "iPhone 13 Pro - 256GB Gold Unlocked",
    slug: "iphone-13-pro-256gb-gold-unlocked",
    description: "Pristine gold iPhone 13 Pro. 256GB storage, fully factory unlocked. Battery health is at 90%, screen and chassis are free of major scratches.",
    pricing: {
      base_price: 799,
      sale_price: 799,
      is_on_sale: false,
      discount: null,
      formatted: "$799",
      formatted_short: "$799",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Dallas", state: "TX" },
    taxonomy: { category: "electronics", brand: "User113" },
    media: { main_photo: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Great", badge_class: "cg-badge-great", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: true }
  },
  {
    id: 2,
    title: "Sony A7III Mirrorless Camera Body",
    slug: "sony-a7iii-mirrorless-camera-body",
    description: "Well-maintained Sony A7III body only. Low shutter count, comes with original strap, box, and 2 batteries.",
    pricing: {
      base_price: 1200,
      sale_price: 1200,
      is_on_sale: false,
      discount: null,
      formatted: "$1,200",
      formatted_short: "$1.2K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Seattle", state: "WA" },
    taxonomy: { category: "electronics", brand: "PhotoPro" },
    media: { main_photo: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400" },
    item_specs: { condition_rating: 5, condition_label: "Excellent", badge_class: "cg-badge-excellent", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 3,
    title: "Sony Noise Canceling Headphones WH-CH720N",
    slug: "sony-noise-canceling-headphones-wh-ch720n",
    description: "Lightweight over-ear headphones with superior active noise canceling. Comes with charging cable.",
    pricing: {
      base_price: 120,
      sale_price: 120,
      is_on_sale: false,
      discount: null,
      formatted: "$120",
      formatted_short: "$120",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Boston", state: "MA" },
    taxonomy: { category: "electronics", brand: "AudioFan" },
    media: { main_photo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Great", badge_class: "cg-badge-great", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: true }
  },
  {
    id: 4,
    title: "2018 Honda Civic EX - Low Mileage",
    slug: "2018-honda-civic-ex-low-mileage",
    description: "EX trim model with only 45k miles. Single owner, clean title, and up-to-date maintenance records.",
    pricing: {
      base_price: 16500,
      sale_price: 16500,
      is_on_sale: false,
      discount: null,
      formatted: "$16,500",
      formatted_short: "$16.5K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Dallas", state: "TX" },
    taxonomy: { category: "vehicles", brand: "AutoSeller99" },
    media: { main_photo: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Great", badge_class: "cg-badge-great", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 5,
    title: "Classic Road Bike - Excellent Frame",
    slug: "classic-road-bike-excellent-frame",
    description: "Vintage steel frame road bike, recently tuned up with brand new tires, tubes, and handlebar tape.",
    pricing: {
      base_price: 450,
      sale_price: 450,
      is_on_sale: false,
      discount: null,
      formatted: "$450",
      formatted_short: "$450",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Chicago", state: "IL" },
    taxonomy: { category: "vehicles", brand: "CyclistJoe" },
    media: { main_photo: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=400" },
    item_specs: { condition_rating: 5, condition_label: "Excellent", badge_class: "cg-badge-excellent", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: true }
  },
  {
    id: 6,
    title: "Cozy 1-Bedroom Condo near Downtown",
    slug: "cozy-1-bedroom-condo-near-downtown",
    description: "Charming 1-bedroom condo with updated appliances, in-unit laundry, and a beautiful balcony view.",
    pricing: {
      base_price: 145000,
      sale_price: 145000,
      is_on_sale: false,
      discount: null,
      formatted: "$145,000",
      formatted_short: "$145K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Denver", state: "CO" },
    taxonomy: { category: "real-estate", brand: "AgentSarah" },
    media: { main_photo: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Great", badge_class: "cg-badge-great", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 7,
    title: "Spacious Suburb Family Home (4B/3B)",
    slug: "spacious-suburb-family-home-4b-3b",
    description: "Stunning 4-bedroom, 3-bathroom suburban home with huge backyard and renovated kitchen.",
    pricing: {
      base_price: 245000,
      sale_price: 245000,
      is_on_sale: false,
      discount: null,
      formatted: "$245,000",
      formatted_short: "$245K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Houston", state: "TX" },
    taxonomy: { category: "real-estate", brand: "BrokerBill" },
    media: { main_photo: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400" },
    item_specs: { condition_rating: 5, condition_label: "Excellent", badge_class: "cg-badge-excellent", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: true }
  },
  {
    id: 8,
    title: "Ergonomic Mesh Office Chair",
    slug: "ergonomic-mesh-office-chair",
    description: "Fully adjustable ergonomic desk chair. High-back design with supportive lumbar pad, mesh cooling back, and lockable tilt.",
    pricing: {
      base_price: 180,
      sale_price: 180,
      is_on_sale: false,
      discount: null,
      formatted: "$180",
      formatted_short: "$180",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Austin", state: "TX" },
    taxonomy: { category: "home-goods", brand: "DeskBound" },
    media: { main_photo: "https://images.unsplash.com/photo-1589384267710-7a259678a59a?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Great", badge_class: "cg-badge-great", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: true }
  },
  {
    id: 9,
    title: "Solid Oak Coffee Table",
    slug: "solid-oak-coffee-table",
    description: "Solid oak wood coffee table with storage drawer underneath. Elegant natural oak oil finish, very robust.",
    pricing: {
      base_price: 150,
      sale_price: 150,
      is_on_sale: false,
      discount: null,
      formatted: "$150",
      formatted_short: "$150",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "San Antonio", state: "TX" },
    taxonomy: { category: "home-goods", brand: "CarpenterCo" },
    media: { main_photo: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Great", badge_class: "cg-badge-great", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: false }
  },
  {
    id: 10,
    title: "Vintage Leather Jacket - Brown (M)",
    slug: "vintage-leather-jacket-brown-m",
    description: "Authentic brown cowhide leather jacket. Soft inner lining, heavy duty zippers, standard medium fit.",
    pricing: {
      base_price: 95,
      sale_price: 95,
      is_on_sale: false,
      discount: null,
      formatted: "$95",
      formatted_short: "$95",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Dallas", state: "TX" },
    taxonomy: { category: "fashion", brand: "ClassicRiders" },
    media: { main_photo: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Great", badge_class: "cg-badge-great", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: true }
  },
  {
    id: 11,
    title: "Designer Sunglasses - Unisex Aviators",
    slug: "designer-sunglasses-unisex-aviators",
    description: "Gold frame polarized aviators. Excellent UV protection, extremely lightweight, includes clean storage leather case.",
    pricing: {
      base_price: 110,
      sale_price: 110,
      is_on_sale: false,
      discount: null,
      formatted: "$110",
      formatted_short: "$110",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Miami", state: "FL" },
    taxonomy: { category: "fashion", brand: "StyleVault" },
    media: { main_photo: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400" },
    item_specs: { condition_rating: 5, condition_label: "Excellent", badge_class: "cg-badge-excellent", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 12,
    title: "Mountain Trail Bike - 21 Speed Shimano",
    slug: "mountain-trail-bike-21-speed-shimano",
    description: "Ready to ride 21-speed trail bike. Dual disk brakes, front shock absorbers, high-traction mountain tires.",
    pricing: {
      base_price: 350,
      sale_price: 350,
      is_on_sale: false,
      discount: null,
      formatted: "$350",
      formatted_short: "$350",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Denver", state: "CO" },
    taxonomy: { category: "vehicles", brand: "JohnSmith" },
    media: { main_photo: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Great", badge_class: "cg-badge-great", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: false }
  }
];

const translateListing = (item: ClassifiedListing): ListingItem => {
  const generatedSlug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  return {
    id: item.id,
    title: item.title,
    price: item.pricing?.formatted || `$${(item.pricing?.sale_price || item.pricing?.base_price || 0).toLocaleString()}`,
    numericPrice: item.pricing?.sale_price || item.pricing?.base_price || 0,
    image: item.media?.main_photo || item.media?.thumbnail || "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=400",
    seller: item.taxonomy?.brand || "Verified Seller",
    isSaved: false,
    category: item.taxonomy?.category || "electronics",
    localPickup: item.item_specs?.dimensions !== 'shipping_only',
    delivery: item.status?.is_shipping || false,
    dateAdded: item.id,
    slug: generatedSlug,
    description: item.description,
    conditionLabel: item.item_specs?.condition_label || "Great",
    quantity: item.item_specs?.quantity || 1
  };
};

export default function ProductPage({ slug }: { slug: string }) {
  const router = useRouter();

  // Component states
  const [item, setItem] = useState<ListingItem | null>(null);
  const [related, setRelated] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [errorTrace, setErrorTrace] = useState<string>('');

  // Inquiry form states
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerOffer, setBuyerOffer] = useState('');
  const [buyerMessage, setBuyerMessage] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState<any>(null);

  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        return `/preview/classifieds_general${path}`;
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
      message: buyerMessage,
      date: new Date().toLocaleString(),
      theme: 'classifieds_general'
    };

    // Save to LocalStorage
    try {
      const existing = localStorage.getItem('sellio_classifieds_general_orders');
      const list = existing ? JSON.parse(existing) : [];
      list.push(orderData);
      localStorage.setItem('sellio_classifieds_general_orders', JSON.stringify(list));
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
    <div className="cg-product-wrapper">
      <GeneralHeader 
        searchTerm="" 
        onSearchChange={() => {}} 
        onReset={() => router.push(getThemeLink(''))} 
      />

      <div className="cg-product-container">
        <div>
          <a href="#" className="cg-product-back-link" onClick={handleBackNavigation}>
            &larr; Back to Catalog Listings
          </a>
        </div>

        {/* Resilience diagnostics trace block */}
        {useFallback && errorTrace && (
          <div className="cg-resilience-panel">
            <div className="cg-resilience-header">
              🛡️ <span>Database connection offline. Showing simulated catalog listing backup.</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--cg-text-muted)', fontWeight: 600 }}>
              The storefront engine captured a connection failure and loaded offline backlogs. Trace Details:
            </div>
            <pre className="cg-resilience-trace">{errorTrace}</pre>
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
        ) : !item ? (
          <div className="text-center p-20">
            <h3>Listing not found.</h3>
          </div>
        ) : (
          <>
            <div className="cg-product-main-grid">
              {/* Left Column: Image and Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="cg-product-gallery">
                  <div className="cg-product-main-img-wrap">
                    <img src={item.image} className="cg-product-main-img" alt={item.title} />
                  </div>
                </div>

                <div className="cg-product-description-card">
                  <h4 className="cg-product-card-title">Product Description</h4>
                  <p className="cg-product-description">
                    {item.description || "No description provided by the seller. Please use the inquiry form on the right to request details."}
                  </p>
                </div>
              </div>

              {/* Right Column: Spec sheet, Seller profile and inquiry form */}
              <div className="cg-product-details-block">
                <div className="cg-product-description-card">
                  <div className="cg-product-meta-header">
                    <div className="cg-product-title-row">
                      <h1 className="cg-product-title">{item.title}</h1>
                    </div>
                    <div className="cg-product-price">{item.price}</div>
                    <div className="cg-product-meta-row">
                      <span className="cg-product-badge">{item.category}</span>
                      <span className="cg-product-badge">{item.conditionLabel || "Good"}</span>
                      {item.delivery && <span className="cg-product-badge">✓ Shipping Available</span>}
                      {item.localPickup && <span className="cg-product-badge">✓ Pickup Available</span>}
                    </div>
                  </div>
                  
                  <div style={{ borderTop: '1px solid var(--cg-border)', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
                    <h4 className="cg-product-card-title" style={{ color: 'var(--cg-text-main)', fontSize: '0.95rem', fontWeight: 800 }}>Specifications</h4>
                    <div className="cg-product-specs-grid">
                      <div className="cg-product-spec-item">
                        <span className="cg-product-spec-label">Condition</span>
                        <span className="cg-product-spec-value">{item.conditionLabel || "Great"}</span>
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

                {/* Secure Inquiry Desk Form */}
                <div className="cg-product-booking-drawer">
                  <h4 className="cg-product-card-title" style={{ margin: 0 }}>✉️ Contact Seller</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--cg-text-muted)', fontWeight: 600 }}>
                    Submit an offer or request details. Messages are secure-routed instantly to {item.seller}.
                  </div>

                  {orderSuccess && orderSuccessData ? (
                    <div className="cg-booking-receipt">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cg-primary)', fontWeight: 800, fontSize: '0.95rem' }}>
                        <span>✓</span> <span>Message Securely Dispatched!</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--cg-text-muted)', fontWeight: 600, borderBottom: '1px dashed var(--cg-primary)', paddingBottom: '0.5rem' }}>
                        Your inquiry was saved statefully. Delivery reference logs:
                      </div>
                      <div className="cg-receipt-row">
                        <span>Transaction ID:</span>
                        <span style={{ fontFamily: 'monospace' }}>{orderSuccessData.orderId}</span>
                      </div>
                      <div className="cg-receipt-row">
                        <span>Recipient:</span>
                        <span>{item.seller}</span>
                      </div>
                      <div className="cg-receipt-row">
                        <span>Offered Price:</span>
                        <span style={{ color: 'var(--cg-primary)' }}>{orderSuccessData.offerPrice}</span>
                      </div>
                      <div className="cg-receipt-row" style={{ fontWeight: 800 }}>
                        <span>Channel status:</span>
                        <span>Open & Active</span>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                          placeholder="e.g. Is the price negotiable? I am interested in buying." 
                          value={buyerMessage}
                          onChange={(e) => setBuyerMessage(e.target.value)}
                        />
                      </div>
                      <button type="submit" className="cg-product-btn-reserve">
                        Dispatch Message to Seller
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Related items */}
            {related.length > 0 && (
              <div className="cg-related-section">
                <h3 className="cg-related-title">📦 Other Bargains You Might Like</h3>
                <div className="cg-related-grid">
                  {related.map((relItem) => (
                    <div 
                      key={relItem.id} 
                      className="cg-related-card"
                      onClick={() => router.push(getThemeLink(`/product/${relItem.slug}`))}
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
                    </div>
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
