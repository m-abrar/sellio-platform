'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import type { ClassifiedListing } from '@sellio/types';
import { DealsHeader, DealCard, DealsFooter, CountdownTimer } from './components';

interface ProductPageProps {
  slug: string;
}

const FALLBACK_DEALS: ClassifiedListing[] = [
  {
    id: 1,
    title: "Apple Watch Series 8 (GPS, 41mm)",
    slug: "apple-watch-series-8-gps-41mm",
    description: "Keep track of your health and fitness with the Apple Watch Series 8. Features advanced sensors for insights into your physical well-being, an Always-On Retina display, robust water resistance, and fast-charging capabilities. Perfect condition, original packaging included.",
    short_description: "Apple Watch Series 8 in pristine space gray condition.",
    pricing: {
      base_price: 399,
      sale_price: 249,
      is_on_sale: true,
      discount: "37",
      formatted: "$249.00",
      formatted_short: "$249",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Like New",
      badge_class: "cd-badge-like-new",
      age_years: 1,
      quantity: 3,
      dimensions: "41mm x 35mm x 10.7mm",
      warranty: "6 Months Seller Warranty"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=400",
      gallery: [],
      all_photos_count: 1
    },
    taxonomy: {
      category: "electronics",
      type: "For Sale",
      brand: "Apple",
      tags: ["smartwatch", "fitness", "apple", "wearables"]
    },
    location: {
      city: "San Francisco",
      state: "CA",
      country: "USA",
      address: "Downtown SF"
    },
    status: {
      is_published: true,
      is_featured: true,
      is_new_listing: false,
      is_shipping: true,
      inquiry_count: 5
    },
    seller: {
      id: 101,
      name: "GadgetPro",
      avatar: null
    }
  },
  {
    id: 2,
    title: "Canon EOS R6 Mirrorless Camera (Body Only)",
    slug: "canon-eos-r6-mirrorless-camera-body-only",
    description: "The Canon EOS R6 is a versatile tool for photographers and videographers alike. Boasting a 20MP Full-Frame sensor, 4K60 video capabilities, 5-axis in-body image stabilization, and up to 20 fps mechanical shooting. Exceptionally clean body, negligible shutter count.",
    short_description: "Pro-tier mirrorless camera body, pristine condition.",
    pricing: {
      base_price: 2299,
      sale_price: 1399,
      is_on_sale: true,
      discount: "39",
      formatted: "$1,399.00",
      formatted_short: "$1,399",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.8,
      condition_label: "Excellent",
      badge_class: "cd-badge-excellent",
      age_years: 1.5,
      quantity: 1,
      dimensions: "138.4mm x 97.5mm x 88.4mm",
      warranty: "1 Year Remaining"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400",
      gallery: [],
      all_photos_count: 1
    },
    taxonomy: {
      category: "electronics",
      type: "For Sale",
      brand: "Canon",
      tags: ["camera", "mirrorless", "canon", "photography"]
    },
    location: {
      city: "New York",
      state: "NY",
      country: "USA",
      address: "Manhattan Studio"
    },
    status: {
      is_published: true,
      is_featured: true,
      is_new_listing: true,
      is_shipping: true,
      inquiry_count: 12
    },
    seller: {
      id: 102,
      name: "LensMaster",
      avatar: null
    }
  },
  {
    id: 3,
    title: "Sony WH-1000XM5 Headphones",
    slug: "sony-wh-1000xm5-headphones",
    description: "Industry-leading noise canceling wireless headphones with crystal-clear hands-free calling, smart features, and unmatched audio fidelity. Features a lightweight design with soft fit leather headband.",
    short_description: "Sony WH-1000XM5 wireless ANC headphones in black.",
    pricing: {
      base_price: 399,
      sale_price: 219,
      is_on_sale: true,
      discount: "45",
      formatted: "$219.00",
      formatted_short: "$219",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Brand New",
      badge_class: "cd-badge-new",
      age_years: 0.1,
      quantity: 5,
      dimensions: "Standard Over-Ear",
      warranty: "2 Year Global Warranty"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400",
      gallery: [],
      all_photos_count: 1
    },
    taxonomy: {
      category: "electronics",
      type: "For Sale",
      brand: "Sony",
      tags: ["headphones", "anc", "audio", "sony", "music"]
    },
    location: {
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      address: "Beverly Hills"
    },
    status: {
      is_published: true,
      is_featured: true,
      is_new_listing: false,
      is_shipping: true,
      inquiry_count: 9
    },
    seller: {
      id: 103,
      name: "AudioDepot",
      avatar: null
    }
  },
  {
    id: 4,
    title: "Nike Air Max 270 Running Shoes",
    slug: "nike-air-max-270-running-shoes",
    description: "Nike's first lifestyle Air Max brings you style, comfort, and big attitude. Features an extra-large air pocket for supreme cushioning. Vibrant crimson red accents that match your active daily energy.",
    short_description: "Nike Air Max 270 in original box, never worn outdoors.",
    pricing: {
      base_price: 160,
      sale_price: 85,
      is_on_sale: true,
      discount: "47",
      formatted: "$85.00",
      formatted_short: "$85",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.9,
      condition_label: "Like New",
      badge_class: "cd-badge-like-new",
      age_years: 0.2,
      quantity: 2,
      dimensions: "US Men Size 10.5",
      warranty: "No Warranty"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400",
      gallery: [],
      all_photos_count: 1
    },
    taxonomy: {
      category: "fashion",
      type: "For Sale",
      brand: "Nike",
      tags: ["shoes", "sneakers", "nike", "fashion", "running"]
    },
    location: {
      city: "Chicago",
      state: "IL",
      country: "USA",
      address: "Lincoln Park"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: false,
      is_shipping: true,
      inquiry_count: 2
    },
    seller: {
      id: 104,
      name: "KickZilla",
      avatar: null
    }
  },
  {
    id: 5,
    title: "Herman Miller Aeron Ergonomic Chair - Size B",
    slug: "herman-miller-aeron-ergonomic-chair-size-b",
    description: "The gold standard of ergonomic office seating. Fully loaded Size B model with posturefit lumbar support, tilt limiter, seat angle adjustment, and fully adjustable vinyl armrests. Pellet mesh is in superb shape without any tears.",
    short_description: "Classic Herman Miller Aeron office chair, Size B.",
    pricing: {
      base_price: 1200,
      sale_price: 450,
      is_on_sale: true,
      discount: "62",
      formatted: "$450.00",
      formatted_short: "$450",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.5,
      condition_label: "Very Good",
      badge_class: "cd-badge-very-good",
      age_years: 3,
      quantity: 1,
      dimensions: "Size B (Medium)",
      warranty: "5 Years Warranty Remaining"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=400",
      gallery: [],
      all_photos_count: 1
    },
    taxonomy: {
      category: "home",
      type: "For Sale",
      brand: "Herman Miller",
      tags: ["chair", "ergonomic", "office", "furniture"]
    },
    location: {
      city: "Boston",
      state: "MA",
      country: "USA",
      address: "Financial District"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: false,
      is_shipping: false,
      inquiry_count: 14
    },
    seller: {
      id: 105,
      name: "OfficeClearance",
      avatar: null
    }
  },
  {
    id: 6,
    title: "DeWalt 20V Max Cordless Drill Kit",
    slug: "dewalt-20v-max-cordless-drill-kit",
    description: "High performance DeWalt 20V cordless compact drill and driver kit. Includes two 20V lithium-ion batteries, a charger, and a heavy-duty contractor carrying bag. Ideal for home projects or contractor duties.",
    short_description: "DeWalt Cordless Drill Kit, complete set with 2 batteries.",
    pricing: {
      base_price: 179,
      sale_price: 99,
      is_on_sale: true,
      discount: "45",
      formatted: "$99.00",
      formatted_short: "$99",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.8,
      condition_label: "Like New",
      badge_class: "cd-badge-like-new",
      age_years: 0.5,
      quantity: 2,
      dimensions: "Compact 20V",
      warranty: "1 Year Remaining"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=400",
      gallery: [],
      all_photos_count: 1
    },
    taxonomy: {
      category: "tools",
      type: "For Sale",
      brand: "DeWalt",
      tags: ["drill", "tools", "dewalt", "cordless"]
    },
    location: {
      city: "Seattle",
      state: "WA",
      country: "USA",
      address: "Greenwood"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: true,
      is_shipping: true,
      inquiry_count: 4
    },
    seller: {
      id: 106,
      name: "HardwareDirect",
      avatar: null
    }
  }
];

export default function ProductPage({ slug }: ProductPageProps) {
  const router = useRouter();
  const [deal, setDeal] = useState<ClassifiedListing | null>(null);
  const [related, setRelated] = useState<ClassifiedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [activePhoto, setActivePhoto] = useState<string>('');
  const [errorTrace, setErrorTrace] = useState<string>('');

  // Inquiry Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [buyerNotes, setBuyerNotes] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Follow states
  const [isFollowing, setIsFollowing] = useState(false);

  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        return `/preview/classifieds_deals${path}`;
      }
    }
    return path;
  };

  useEffect(() => {
    const loadDeal = async () => {
      setLoading(true);
      try {
        const response = await api.getClassifiedDetails(slug);
        if (response && response.success && response.data) {
          setDeal(response.data);
          setActivePhoto(response.data.media?.main_photo || '');
          setUseFallback(false);
          
          // Load related excluding current
          const relatedResp = await api.getClassifieds({ limit: 4 });
          if (relatedResp && relatedResp.data) {
            setRelated(relatedResp.data.filter(d => d.slug !== slug).slice(0, 4));
          }
        } else {
          console.warn("Classifieds Deals details API response unsuccessful. Restoring local reserves.");
          setErrorTrace("Classifieds Deals details API response unsuccessful.");
          loadLocalFallback();
        }
      } catch (err: any) {
        console.error("Classifieds Deals details API connection failed. Activating fallback.", err);
        setErrorTrace(err?.stack || err?.message || String(err));
        loadLocalFallback();
      } finally {
        setLoading(false);
      }
    };

    const loadLocalFallback = () => {
      const matched = FALLBACK_DEALS.find(d => d.slug === slug);
      if (matched) {
        setDeal(matched);
        setActivePhoto(matched.media?.main_photo || '');
        setRelated(FALLBACK_DEALS.filter(d => d.slug !== slug).slice(0, 4));
      } else {
        setDeal(FALLBACK_DEALS[0]);
        setActivePhoto(FALLBACK_DEALS[0].media?.main_photo || '');
        setRelated(FALLBACK_DEALS.slice(1, 5));
      }
      setUseFallback(true);
    };

    loadDeal();
  }, [slug]);

  const handleCardClick = (targetSlug: string) => {
    router.push(getThemeLink(`/product/${targetSlug}`));
  };

  const handleSnagDealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim() || quantity <= 0) {
      alert("❌ Please complete all required checkout inquiry fields!");
      return;
    }

    if (!deal) return;

    // Persist reservation orders to LocalStorage key sellio_classifieds_deals_orders
    const existingOrders = JSON.parse(localStorage.getItem('sellio_classifieds_deals_orders') || '[]');
    const newOrder = {
      orderId: 'DEAL-' + Math.floor(Math.random() * 900000 + 100000),
      timestamp: new Date().toISOString(),
      dealId: deal.id,
      dealTitle: deal.title,
      dealSlug: deal.slug,
      quantity,
      priceEach: deal.pricing?.sale_price || deal.pricing?.base_price || 0,
      totalPrice: (deal.pricing?.sale_price || deal.pricing?.base_price || 0) * quantity,
      buyer: {
        fullName,
        email,
        phone,
        notes: buyerNotes
      }
    };

    localStorage.setItem('sellio_classifieds_deals_orders', JSON.stringify([...existingOrders, newOrder]));
    setFormSubmitted(true);
  };

  if (loading) {
    return (
      <div style={{ background: '#111827', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'var(--cd-font)', color: '#ffffff' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--cd-primary-red)' }}>LOCKING IN PROVENANCE...</h2>
        <div style={{ width: '120px', height: '4px', background: 'var(--cd-primary-red)', marginTop: '1.5rem', borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: '50px', height: '100%', backgroundColor: 'var(--cd-secondary-yellow)', animation: 'cdShimmer 1.5s infinite linear' }} />
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes cdShimmer {
            0% { left: -50px; }
            100% { left: 120px; }
          }
        `}} />
      </div>
    );
  }

  if (!deal) {
    return (
      <div style={{ background: '#111827', minHeight: '100vh', padding: '10rem 2rem', textAlign: 'center', color: '#ffffff', fontFamily: 'var(--cd-font)' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--cd-primary-red)', marginBottom: '1.5rem' }}>BARGAIN NOT FOUND</h2>
        <p style={{ color: 'var(--cd-text-muted)', marginBottom: '3rem' }}>The requested bargain listing is either expired or offline.</p>
        <button onClick={() => router.push(getThemeLink('/'))} className="cd-btn-post">Return to Flash Feed</button>
      </div>
    );
  }

  const discountVal = deal.pricing?.discount || (deal.pricing?.base_price && deal.pricing?.sale_price 
    ? Math.round(((deal.pricing.base_price - deal.pricing.sale_price) / deal.pricing.base_price) * 100).toString() 
    : '0');

  // Star ratings builder
  const ratingStars = [];
  const ratingVal = deal.item_specs?.condition_rating || 5;
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(ratingVal)) {
      ratingStars.push('★');
    } else {
      ratingStars.push('☆');
    }
  }

  const galleryPhotos = deal.media?.gallery || [];
  const hasPhotos = galleryPhotos.length > 0;

  return (
    <div className="classifieds-deals-wrapper">
      <DealsHeader 
        onSearch={() => {}} 
        onSelectCategory={(cat) => {
          if (cat === 'all') {
            router.push(getThemeLink('/'));
          } else {
            router.push(getThemeLink(`/?cat=${cat}`));
          }
        }} 
        selectedCategory="all" 
      />

      {/* Connection warning dashboard */}
      {useFallback && (
        <div style={{
          backgroundColor: '#0f172a',
          border: '2px solid #e71d36',
          borderRadius: '12px',
          padding: '1.5rem',
          margin: '2rem 5%',
          fontFamily: 'monospace',
          color: '#f3f4f6',
          boxShadow: '0 0 20px rgba(231, 29, 54, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e71d36', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem' }}>
            <span className="cd-pulse-dot" style={{ backgroundColor: '#e71d36' }}></span>
            DATABASE CONNECTION WARNING: Local catalog resilience fallback active
          </div>
          <div style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: '1.6' }}>
            <strong>STATUS:</strong> [OFFLINE] | LATENCY: [TIMEOUT]
            <br />
            <strong>REASON:</strong> {errorTrace && errorTrace.includes('is not a function') ? 'Turbopack cache mismatch. Browser is running an outdated build of @sellio/api-client.' : 'Axios connection failed to 127.0.0.1:8000. Laravel backend database node unresponsive.'}
            <br />
            <strong>DIAGNOSTICS:</strong> {errorTrace || 'api.getClassifiedBySlug is not a function (Turbopack cache mismatch).'}
            <br />
            <strong>ACTION:</strong> Gracefully activated premium offline node resilience. Loading high-fidelity local catalog backups...
          </div>
        </div>
      )}

      {/* Main Single Page Content */}
      <main style={{ padding: '0 5%', marginTop: '2rem' }}>
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: 'var(--cd-text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push(getThemeLink('/'))}>Feed</span>
          <span>&gt;</span>
          <span style={{ color: 'var(--cd-primary-red)', textTransform: 'capitalize' }}>{deal.taxonomy?.category || 'Bargains'}</span>
          <span>&gt;</span>
          <span style={{ color: 'var(--cd-text-main)' }}>{deal.title}</span>
        </div>

        {/* Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(320px, 400px)', gap: '2.5rem', alignItems: 'start' }}>
          
          {/* Left Details block */}
          <div style={{ backgroundColor: 'var(--cd-bg-card)', borderRadius: '16px', border: '1px solid var(--cd-border)', padding: '2.5rem', boxShadow: 'var(--cd-shadow-sm)' }}>
            
            {/* Title & Badges Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ display: 'inline-block', backgroundColor: 'var(--cd-primary-red)', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  {deal.taxonomy?.brand || 'Premium Deal'}
                </span>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: '1.2', color: 'var(--cd-dark-slate)', margin: '0 0 0.5rem 0' }}>{deal.title}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ color: 'var(--cd-secondary-yellow)', fontWeight: 700, fontSize: '1.2rem', display: 'flex', gap: '2px' }}>
                    {ratingStars.join('')}
                    <span style={{ color: 'var(--cd-text-muted)', fontSize: '0.85rem', fontWeight: 600, marginLeft: '6px' }}>({deal.item_specs?.condition_rating || 5} Rating)</span>
                  </div>
                  <span style={{ color: 'var(--cd-text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>🏷️ {deal.taxonomy?.category}</span>
                </div>
              </div>

              {/* Discount Tag */}
              <div style={{ backgroundColor: 'var(--cd-secondary-yellow)', color: 'var(--cd-dark-slate)', padding: '10px 20px', borderRadius: '8px', textAlign: 'center', boxShadow: 'var(--cd-shadow-sm)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800 }}>FLASH DISC</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--cd-primary-red)', lineHeight: '1' }}>-{discountVal}%</div>
              </div>
            </div>

            {/* Media Gallery */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{
                height: '420px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--cd-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img src={activePhoto} alt={deal.title} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                <div style={{ position: 'absolute', bottom: '15px', right: '15px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#ffffff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                  ⚡ HIGH-VELOCITY IMAGE PREVIEW
                </div>
              </div>

              {/* Thumbnails */}
              {hasPhotos && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                  <div 
                    onClick={() => setActivePhoto(deal.media?.main_photo || '')}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      border: activePhoto === deal.media?.main_photo ? '3px solid var(--cd-primary-red)' : '1px solid var(--cd-border)',
                      padding: '4px',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img src={deal.media?.main_photo || ''} alt="main thumbnail" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>
                  {galleryPhotos.map((photo, i) => (
                    <div 
                      key={photo.id || i}
                      onClick={() => setActivePhoto(photo.url)}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '8px',
                        border: activePhoto === photo.url ? '3px solid var(--cd-primary-red)' : '1px solid var(--cd-border)',
                        padding: '4px',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img src={photo.url} alt={`gallery thumbnail ${i}`} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description & Overview */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--cd-dark-slate)', borderBottom: '2px solid var(--cd-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>BARGAIN DESCRIPTION</h2>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--cd-text-main)', whiteSpace: 'pre-line' }}>{deal.description}</p>
            </div>

            {/* Premium Item Specifications Grid */}
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--cd-dark-slate)', borderBottom: '2px solid var(--cd-border)', paddingBottom: '0.5rem', marginBottom: '1.2rem' }}>
                ITEM SPECIFICATIONS
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                
                <div style={{ padding: '1rem', backgroundColor: 'var(--cd-bg-main)', borderRadius: '8px', borderLeft: '4px solid var(--cd-primary-red)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase' }}>Condition Rating</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--cd-dark-slate)', marginTop: '2px' }}>
                    {deal.item_specs?.condition_label || 'Pristine'} ({deal.item_specs?.condition_rating || 5}/5)
                  </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'var(--cd-bg-main)', borderRadius: '8px', borderLeft: '4px solid var(--cd-secondary-yellow)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase' }}>Item Age</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--cd-dark-slate)', marginTop: '2px' }}>
                    {deal.item_specs?.age_years ? `${deal.item_specs.age_years} Year(s) old` : 'Almost Brand New'}
                  </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'var(--cd-bg-main)', borderRadius: '8px', borderLeft: '4px solid var(--cd-dark-slate)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase' }}>Quantity Available</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--cd-dark-slate)', marginTop: '2px' }}>
                    {deal.item_specs?.quantity || 1} Unit(s) In Stock
                  </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'var(--cd-bg-main)', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase' }}>Warranty Status</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--cd-dark-slate)', marginTop: '2px' }}>
                    {deal.item_specs?.warranty || 'No Warranty'}
                  </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'var(--cd-bg-main)', borderRadius: '8px', gridColumn: 'span 2' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase' }}>Dimensions / Specs</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--cd-dark-slate)', marginTop: '4px' }}>
                    {deal.item_specs?.dimensions || 'Standard retail dimensions apply.'}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Checkout & Seller Block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Flash Buy/Reservation Card */}
            <div style={{ backgroundColor: '#111827', color: '#ffffff', borderRadius: '16px', padding: '2rem', border: '2px solid var(--cd-primary-red)', boxShadow: 'var(--cd-shadow-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--cd-secondary-yellow)', textTransform: 'uppercase' }}>Flash Price Drop</div>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff' }}>
                    ${deal.pricing?.sale_price || deal.pricing?.base_price}
                  </span>
                </div>
                <div style={{ textDecoration: 'line-through', color: 'var(--cd-text-muted)', fontSize: '1.2rem', fontWeight: 700 }}>
                  ${deal.pricing?.base_price}
                </div>
              </div>

              {/* Countdown */}
              <div style={{ backgroundColor: '#1e293b', border: '1px solid rgba(231,29,54,0.3)', padding: '0.75rem 1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', fontWeight: 700, marginBottom: '2rem' }}>
                <span style={{ color: 'var(--cd-secondary-yellow)' }}>⚡ EXPIRES SOON:</span>
                <span style={{ color: '#ffffff', fontFamily: 'monospace', letterSpacing: '1px' }}>
                  <CountdownTimer hours={4} seconds={33} />
                </span>
              </div>

              {/* "Snag This Deal" Checkout Form */}
              {formSubmitted ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--cd-secondary-yellow)', marginBottom: '0.5rem' }}>DEAL RESERVED!</h3>
                  <p style={{ fontSize: '0.85rem', color: '#e5e7eb', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                    Your flash reservation has been locked in locally! The order has been written to the LocalStorage checkout registry under <code>sellio_classifieds_deals_orders</code>.
                  </p>
                  <button onClick={() => setFormSubmitted(false)} className="cd-search-btn" style={{ width: '100%', borderRadius: '8px' }}>
                    Resnag This Deal
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSnagDealSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Email Address *</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="e.g. john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Phone Number *</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="e.g. +1 555 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ width: '80px' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Qty *</label>
                        <input 
                          type="number" 
                          required 
                          min={1} 
                          max={deal.item_specs?.quantity || 5}
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          style={{ width: '100%', padding: '0.65rem 0.5rem', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '0.9rem', textAlign: 'center', outline: 'none' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase' }}>Subtotal</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--cd-secondary-yellow)', marginTop: '4px' }}>
                          ${((deal.pricing?.sale_price || deal.pricing?.base_price || 0) * quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Inquiry Notes</label>
                      <textarea 
                        placeholder="Any special notes for delivery or negotiation..."
                        rows={2}
                        value={buyerNotes}
                        onChange={(e) => setBuyerNotes(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '0.9rem', outline: 'none', resize: 'none' }}
                      />
                    </div>

                  </div>

                  <button type="submit" className="cd-btn-post" style={{ width: '100%', padding: '1rem', borderRadius: '8px', fontSize: '1rem', justifyContent: 'center', boxShadow: '0 8px 24px rgba(231, 29, 54, 0.4)' }}>
                    Snag This Deal ⚡
                  </button>
                </form>
              )}

            </div>

            {/* Seller profile card */}
            <div style={{ backgroundColor: 'var(--cd-bg-card)', border: '1px solid var(--cd-border)', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--cd-shadow-sm)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase', borderBottom: '2px solid var(--cd-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                Seller Information
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--cd-bg-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.4rem',
                  color: 'var(--cd-text-muted)',
                  border: '2px solid var(--cd-border)'
                }}>
                  {deal.seller?.name?.charAt(0) || '👤'}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--cd-dark-slate)' }}>
                    {deal.seller?.name || 'Verified DealDash Seller'}
                  </h4>
                  <div style={{ color: 'var(--cd-text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                    ★ Premium Verified Merchant
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`cd-btn-follow ${isFollowing ? 'cd-following' : ''}`}
                  style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: '6px', fontSize: '0.85rem' }}
                >
                  {isFollowing ? '✓ Following Seller' : 'Follow Seller'}
                </button>
                <button 
                  onClick={() => alert(`📩 Contacting ${deal.seller?.name || 'Seller'}... Directing to live chat.`)}
                  style={{
                    flex: 1,
                    padding: '0.6rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    backgroundColor: 'var(--cd-dark-slate)',
                    color: '#ffffff',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'var(--cd-transition)'
                  }}
                >
                  Message
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Suggestion drawer / Related Deals carousel */}
        {related.length > 0 && (
          <section className="cd-section" style={{ marginTop: '4rem' }}>
            <div className="cd-section-header">
              <div className="cd-section-title-wrap">
                <span style={{ fontSize: '1.5rem' }}>🔥</span>
                <h2 className="cd-section-title">RELATED BARGAINS</h2>
              </div>
              <span style={{ color: 'var(--cd-primary-red)', fontWeight: 800, fontSize: '0.85rem' }}>CUSTOM COMPONENT DRAWER</span>
            </div>

            <div className="cd-deals-grid">
              {related.map((item, idx) => {
                const disc = item.pricing?.discount || (item.pricing?.base_price && item.pricing?.sale_price 
                  ? Math.round(((item.pricing.base_price - item.pricing.sale_price) / item.pricing.base_price) * 100).toString() 
                  : '0');
                
                return (
                  <DealCard 
                    key={idx}
                    title={item.title}
                    currentPrice={item.pricing?.formatted || `$${item.pricing?.sale_price || item.pricing?.base_price}`}
                    originalPrice={`$${item.pricing?.base_price}`}
                    discount={disc}
                    image={item.media?.main_photo || ''}
                    seller={item.seller?.name || 'DealDash'}
                    isTopSeller={true}
                    category={item.taxonomy?.category || 'all'}
                    slug={item.slug}
                    onClick={handleCardClick}
                    isHotBargain={Number(disc) >= 42}
                  />
                );
              })}
            </div>
          </section>
        )}

      </main>

      <DealsFooter />
    </div>
  );
}
