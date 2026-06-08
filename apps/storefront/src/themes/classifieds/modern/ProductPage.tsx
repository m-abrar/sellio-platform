'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import type { ClassifiedListing } from '@sellio/types';
import { ModernHeader, ModernCard, ModernFooter } from './components';

interface ProductPageProps {
  slug: string;
}

// Premium high-fidelity Classifieds Modern fallback listings matching ClassifiedListing schema
const FALLBACK_CLASSIFIEDS: ClassifiedListing[] = [
  {
    id: 1,
    title: "Apple iPad Pro 12.9 (M2 Chip - 256GB)",
    slug: "apple-ipad-pro-12-9-m2-chip-256gb",
    description: "Mint condition Apple iPad Pro 12.9-inch with the powerhouse M2 chip. 256GB storage, space gray color. Includes original box, charger, and an extra screen protector. Display is gorgeous Liquid Retina XDR with ProMotion, True Tone, and P3 wide color. Unbeatable for creators and pros.",
    pricing: {
      base_price: 850,
      sale_price: 850,
      is_on_sale: false,
      discount: null,
      formatted: "$850.00",
      formatted_short: "$850",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Like New",
      badge_class: "cm-card-badge cyan",
      quantity: 1,
      age_years: 0.5,
      dimensions: "280.6 x 214.9 x 6.4 mm",
      warranty: "6 Months AppleCare remaining"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400",
      gallery: [
        { id: 1, url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600" },
        { id: 2, url: "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?q=80&w=600" },
        { id: 3, url: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=600" }
      ],
      all_photos_count: 3
    },
    taxonomy: {
      category: "electronics",
      brand: "Apple"
    },
    location: {
      city: "San Jose",
      state: "CA",
      country: "USA"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: true,
      is_shipping: true
    },
    seller: {
      id: 201,
      name: "Sophia Martinez",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150"
    }
  },
  {
    id: 2,
    title: "Chesterfield Vintage Leather Sofa",
    slug: "chesterfield-vintage-leather-sofa",
    description: "Stunning Chesterfield 3-seater sofa in aged oxblood vintage leather. Hand-tufted details, solid mahogany legs, and classic scroll arms. Incredibly comfortable and develops a gorgeous patina over time. Excellent retro centerpiece for your modern living room.",
    pricing: {
      base_price: 1200,
      sale_price: 1200,
      is_on_sale: false,
      discount: null,
      formatted: "$1,200.00",
      formatted_short: "$1,200",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.8,
      condition_label: "Excellent",
      badge_class: "cm-card-badge",
      quantity: 1,
      age_years: 3,
      dimensions: "220 x 95 x 75 cm",
      warranty: "No Warranty"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400",
      gallery: [
        { id: 1, url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600" },
        { id: 2, url: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=600" }
      ],
      all_photos_count: 2
    },
    taxonomy: {
      category: "furniture",
      brand: "Chesterfield"
    },
    location: {
      city: "Austin",
      state: "TX",
      country: "USA"
    },
    status: {
      is_published: true,
      is_featured: true,
      is_new_listing: false,
      is_shipping: false
    },
    seller: {
      id: 202,
      name: "Alexander Reed",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150"
    }
  },
  {
    id: 3,
    title: "DJI Mavic Air 2 Fly More Combo",
    slug: "dji-mavic-air-2-fly-more-combo",
    description: "Perfect working order DJI Mavic Air 2 drone. Fly More Combo includes 3 smart batteries, multi-charger hub, ND filter set, carrying bag, and replacement propellers. Excellent safety record with no crashes. Renders sharp 48MP photos and smooth 4K/60fps video.",
    pricing: {
      base_price: 850,
      sale_price: 650,
      is_on_sale: true,
      discount: "24",
      formatted: "$650.00",
      formatted_short: "$650",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.9,
      condition_label: "Like New",
      badge_class: "cm-card-badge",
      quantity: 1,
      age_years: 1,
      dimensions: "180 x 97 x 77 mm (Folded)",
      warranty: "3 Months Store Warranty"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?q=80&w=400",
      gallery: [
        { id: 1, url: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?q=80&w=600" },
        { id: 2, url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=600" }
      ],
      all_photos_count: 2
    },
    taxonomy: {
      category: "electronics",
      brand: "DJI"
    },
    location: {
      city: "Miami",
      state: "FL",
      country: "USA"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: false,
      is_shipping: true
    },
    seller: {
      id: 203,
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150"
    }
  },
  {
    id: 4,
    title: "Adidas Yeezy Boost 350 V2",
    slug: "adidas-yeezy-boost-350-v2",
    description: "Adidas Yeezy Boost 350 V2 'Carbon'. Size US 10.5. Deadstock condition, never worn, tags still attached. Purchased directly from Adidas Confirmed app. Fully authenticated with tags and original box in perfect condition. Primeknit styling is exceptionally beautiful.",
    pricing: {
      base_price: 220,
      sale_price: 220,
      is_on_sale: false,
      discount: null,
      formatted: "$220.00",
      formatted_short: "$220",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Brand New",
      badge_class: "cm-card-badge cyan",
      quantity: 1,
      age_years: 0.1,
      dimensions: "US Men 10.5 / EU 44.5",
      warranty: "Deadstock Authentic"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=400",
      gallery: [
        { id: 1, url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600" }
      ],
      all_photos_count: 1
    },
    taxonomy: {
      category: "fashion",
      brand: "Adidas"
    },
    location: {
      city: "Brooklyn",
      state: "NY",
      country: "USA"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: true,
      is_shipping: true
    },
    seller: {
      id: 204,
      name: "Jordan Kelly",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
    }
  }
];

export default function ProductPage({ slug }: ProductPageProps) {
  const router = useRouter();

  // Core API states
  const [listing, setListing] = useState<ClassifiedListing | null>(null);
  const [relatedListings, setRelatedListings] = useState<ClassifiedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [errorTrace, setErrorTrace] = useState<string | null>(null);

  // Stateful UI interactions
  const [activePhoto, setActivePhoto] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Booking Form States
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formQuantity, setFormQuantity] = useState(1);
  const [formNotes, setFormNotes] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');

  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        return `/preview/classifieds_modern${path}`;
      }
    }
    return path;
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const response = await api.getClassifiedDetails(slug);
        if (response && response.success && response.data) {
          setListing(response.data);
          setActivePhoto(response.data.media?.main_photo || '');
          setUseFallback(false);
          
          if (response.related_classifieds && response.related_classifieds.length > 0) {
            setRelatedListings(response.related_classifieds.filter(item => item.slug !== slug).slice(0, 4));
          } else {
            const allResp = await api.getClassifieds({ limit: 5 });
            if (allResp && allResp.data) {
              setRelatedListings(allResp.data.filter(item => item.slug !== slug).slice(0, 4));
            }
          }
        } else {
          console.warn("Classifieds Modern details failed. Loading fallback seeds.");
          setErrorTrace("Classifieds Modern details failed. Loading fallback seeds.");
          triggerFallback();
        }
      } catch (err: any) {
        console.error("AxiosError: Connection failed while trying to fetch classified details:", err);
        setErrorTrace(err?.stack || err?.message || String(err));
        triggerFallback();
      } finally {
        setLoading(false);
      }
    }

    function triggerFallback() {
      setUseFallback(true);
      const matched = FALLBACK_CLASSIFIEDS.find(item => item.slug === slug);
      if (matched) {
        setListing(matched);
        setActivePhoto(matched.media?.main_photo || '');
        setRelatedListings(FALLBACK_CLASSIFIEDS.filter(item => item.slug !== slug).slice(0, 4));
      } else {
        const defaultMock = FALLBACK_CLASSIFIEDS[0];
        setListing(defaultMock);
        setActivePhoto(defaultMock.media?.main_photo || '');
        setRelatedListings(FALLBACK_CLASSIFIEDS.filter(item => item.slug !== defaultMock.slug).slice(0, 4));
      }
    }

    loadData();
    setOrderComplete(false);
    setIsFavorite(false);
  }, [slug]);

  // Sync messaging details once the listing loads
  useEffect(() => {
    if (listing) {
      setFormNotes(`Hi! I am highly interested in purchasing your listed item: "${listing.title}". Please let me know the best time to connect.`);
    }
  }, [listing]);

  if (loading) {
    return (
      <div className="classifieds-modern-wrapper" style={{ padding: '4rem 6%', textAlign: 'center' }}>
        <ModernHeader 
          onPostClick={() => {}}
          searchTerm=""
          onSearchChange={() => {}}
        />
        {/* Shimmer layout */}
        <div style={{ maxWidth: '1200px', margin: '3rem auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <div style={{ height: '450px', backgroundColor: '#e2e8f0', borderRadius: '24px', animation: 'pulse 1.5s infinite' }}></div>
          <div>
            <div style={{ height: '35px', width: '60%', backgroundColor: '#e2e8f0', borderRadius: '8px', marginBottom: '1.5rem', animation: 'pulse 1.5s infinite' }}></div>
            <div style={{ height: '20px', width: '30%', backgroundColor: '#e2e8f0', borderRadius: '8px', marginBottom: '2.5rem', animation: 'pulse 1.5s infinite' }}></div>
            <div style={{ height: '100px', backgroundColor: '#e2e8f0', borderRadius: '16px', marginBottom: '2.5rem', animation: 'pulse 1.5s infinite' }}></div>
            <div style={{ height: '55px', backgroundColor: '#e2e8f0', borderRadius: '50px', animation: 'pulse 1.5s infinite' }}></div>
          </div>
        </div>
        <ModernFooter />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="classifieds-modern-wrapper" style={{ padding: '8rem 6%', textAlign: 'center' }}>
        <h2>Item Not Found</h2>
        <p style={{ color: 'var(--cm-text-muted)', marginBottom: '2rem' }}>The requested classified ad could not be fetched or does not exist.</p>
        <button className="cm-btn cm-btn-primary" onClick={() => router.push(getThemeLink('/'))}>Back to Catalog</button>
      </div>
    );
  }

  // Calculate pricing values
  const basePrice = listing.pricing?.base_price || 0;
  const salePrice = listing.pricing?.sale_price || basePrice;
  const isOnSale = listing.pricing?.is_on_sale || (salePrice < basePrice);
  const discountPercent = listing.pricing?.discount || (isOnSale && basePrice > 0 ? Math.round(((basePrice - salePrice) / basePrice) * 100).toString() : null);

  // Format Star Rating
  const starsArray = [];
  const rating = listing.item_specs?.condition_rating || 5;
  for (let i = 1; i <= 5; i++) {
    starsArray.push(i <= Math.floor(rating) ? '★' : '☆');
  }

  // Handle Checkout Booking Form Submission
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formEmail.trim() || !formPhone.trim()) {
      alert("❌ Please complete all required information fields!");
      return;
    }

    const orderId = 'CM-BARGAIN-' + Math.floor(Math.random() * 900000 + 100000);
    const existingOrders = JSON.parse(localStorage.getItem('sellio_classifieds_modern_orders') || '[]');
    
    const newOrder = {
      orderId,
      timestamp: new Date().toISOString(),
      listingId: listing.id,
      title: listing.title,
      slug: listing.slug,
      quantity: formQuantity,
      priceEach: salePrice,
      totalPrice: salePrice * formQuantity,
      buyer: {
        name: formName,
        email: formEmail,
        phone: formPhone,
        notes: formNotes
      }
    };

    localStorage.setItem('sellio_classifieds_modern_orders', JSON.stringify([newOrder, ...existingOrders]));
    setGeneratedRef(orderId);
    setOrderComplete(true);
  };

  return (
    <div className="classifieds-modern-wrapper">
      <ModernHeader 
        onPostClick={() => alert("📸 Modern Ad Builder: Secure ad wizard opened to list item.")} 
        searchTerm="" 
        onSearchChange={() => {}}
      />

      {/* Glassmorphic Connection failure banner */}
      {useFallback && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '2.5px dashed var(--cm-primary-orange)',
          borderRadius: '20px',
          padding: '1.75rem',
          margin: '2rem 6% 0',
          fontFamily: 'var(--cm-font)',
          boxShadow: 'var(--cm-shadow-md)',
          color: 'var(--cm-text-dark)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--cm-primary-orange)', fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.6rem' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--cm-primary-orange)', animation: 'pulse 1.5s infinite' }}></span>
            DATABASE RESILIENCE LAYER: Active Fallback Mode Enabled
          </div>
          <div style={{ color: 'var(--cm-text-dark)', fontSize: '0.825rem', lineHeight: '1.6' }}>
            <strong>DIAGNOSTICS TRACE:</strong> {errorTrace || 'Axios connection refused at backend port. Loaded simulation models.'}
          </div>
        </div>
      )}

      {/* Main Single Page Details */}
      <main style={{ padding: '3rem 6%', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Breadcrumb row */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#8892b0', marginBottom: '2.5rem', textTransform: 'capitalize' }}>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => router.push(getThemeLink('/'))} className="hover-orange">Catalog Home</span>
          <span>/</span>
          <span style={{ color: 'var(--cm-accent-cyan)' }}>{listing.taxonomy?.category || 'Bargains'}</span>
          <span>/</span>
          <span style={{ color: 'var(--cm-text-dark)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '300px' }}>{listing.title}</span>
        </div>

        {/* Dynamic Details Two Columns layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'start', marginBottom: '5rem' }}>
          
          {/* Left Column - Stateful Photo Gallery */}
          <div>
            <div style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '24px', 
              overflow: 'hidden', 
              boxShadow: 'var(--cm-shadow-md)', 
              border: '1.5px solid var(--cm-border)', 
              position: 'relative',
              height: '480px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              
              {/* Badging displays */}
              <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>
                {listing.status?.is_featured && <span className="cm-card-badge">Featured</span>}
                {listing.status?.is_new_listing && <span className="cm-card-badge cyan">New</span>}
                {isOnSale && <span className="cm-card-badge" style={{ backgroundColor: '#22c55e' }}>Sale</span>}
              </div>

              {/* Heart favorite button overlay */}
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: 'none',
                  boxShadow: 'var(--cm-shadow-md)',
                  cursor: 'pointer',
                  fontSize: '1.3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--cm-transition)',
                  zIndex: 10
                }}
              >
                {isFavorite ? '❤️' : '♡'}
              </button>

              <img 
                src={activePhoto || listing.media?.main_photo || "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600"} 
                alt={listing.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Gallery Thumbnail Selector */}
            {listing.media?.gallery && listing.media.gallery.length > 0 && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {listing.media.gallery.map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => setActivePhoto(photo.url)}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: activePhoto === photo.url ? '3px solid var(--cm-primary-orange)' : '1.5px solid var(--cm-border)',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'all 0.2s ease',
                      boxShadow: 'var(--cm-shadow-sm)'
                    }}
                  >
                    <img src={photo.url} alt="thumbnail gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Specs Showcase & Booking Form Trigger */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '2.5rem', border: '1.5px solid var(--cm-border)', boxShadow: 'var(--cm-shadow-md)' }}>
            
            {/* Title Section */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cm-accent-cyan)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <span>📁 {listing.taxonomy?.category}</span>
                {listing.taxonomy?.brand && (
                  <>
                    <span>•</span>
                    <span>🏷️ {listing.taxonomy.brand}</span>
                  </>
                )}
              </div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: '1.25', margin: '0 0 1rem 0', color: 'var(--cm-text-dark)', letterSpacing: '-0.75px' }}>
                {listing.title}
              </h1>

              {/* Star review layout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: '#FFB300', fontSize: '1.1rem', display: 'flex', gap: '2px', fontWeight: 700 }}>
                  {starsArray.join('')}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--cm-text-muted)' }}>
                  Condition: {listing.item_specs?.condition_label || 'Excellent'} ({rating}/5 Rating)
                </span>
              </div>
            </div>

            {/* Pricing Section */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', padding: '1.25rem 0', borderTop: '1.5px solid var(--cm-border)', borderBottom: '1.5px solid var(--cm-border)', marginBottom: '1.75rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--cm-primary-orange)' }}>
                ${salePrice.toLocaleString()}
              </span>
              
              {isOnSale && (
                <>
                  <span style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--cm-text-muted)', textDecoration: 'line-through' }}>
                    ${basePrice.toLocaleString()}
                  </span>
                  {discountPercent && (
                    <span style={{ 
                      backgroundColor: 'rgba(255, 103, 0, 0.1)', 
                      color: 'var(--cm-primary-orange)', 
                      fontSize: '0.8rem', 
                      fontWeight: 800, 
                      padding: '4px 10px', 
                      borderRadius: '8px',
                      marginLeft: '6px'
                    }}>
                      -{discountPercent}% OFF
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Description Paragraph */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--cm-text-dark)', marginBottom: '0.75rem' }}>Item Description</h3>
              <p style={{ fontSize: '0.9rem', color: '#4a5568', lineHeight: '1.6', margin: 0 }}>
                {listing.description}
              </p>
            </div>

            {/* Primary Action Booking Trigger */}
            <button 
              onClick={() => setDrawerOpen(true)}
              style={{
                width: '100%',
                padding: '1.1rem',
                borderRadius: '50px',
                backgroundColor: 'var(--cm-primary-orange)',
                color: '#ffffff',
                border: 'none',
                fontWeight: '800',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(255, 103, 0, 0.25)',
                transition: 'var(--cm-transition)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
              className="pulse-orange-btn"
            >
              📥 Secure This Bargain
            </button>

            {/* Seller profile card widget */}
            {listing.seller && (
              <div style={{ 
                marginTop: '2.5rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                backgroundColor: 'var(--cm-bg-light)', 
                padding: '1.25rem', 
                borderRadius: '16px',
                border: '1px solid var(--cm-border)'
              }}>
                <img 
                  src={listing.seller.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150"} 
                  alt={listing.seller.name}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cm-text-muted)', textTransform: 'uppercase' }}>Listed By</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--cm-text-dark)' }}>{listing.seller.name}</div>
                </div>
                <button 
                  onClick={() => alert(`💬 Chat Hub: Opening message drawer to chat with ${listing.seller?.name || 'Seller'}`)}
                  style={{
                    marginLeft: 'auto',
                    backgroundColor: 'transparent',
                    border: '1.5px solid var(--cm-accent-cyan)',
                    color: 'var(--cm-accent-cyan)',
                    padding: '6px 14px',
                    borderRadius: '50px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Message
                </button>
              </div>
            )}
          </div>
        </div>

        {/* High-Fidelity Specifications Grid Section */}
        <section style={{ marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--cm-text-dark)', marginBottom: '1.75rem', letterSpacing: '-0.75px' }}>
            Specification Matrix
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            
            {/* Spec 1 - Condition Info */}
            <div style={{ backgroundColor: '#ffffff', border: '1.5px solid var(--cm-border)', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--cm-shadow-sm)' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>⭐</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cm-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Item Condition</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--cm-text-dark)' }}>{listing.item_specs?.condition_label || 'Excellent'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--cm-text-muted)', marginTop: '4px' }}>Rated {rating} out of 5 stars</div>
            </div>

            {/* Spec 2 - Dimensions */}
            <div style={{ backgroundColor: '#ffffff', border: '1.5px solid var(--cm-border)', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--cm-shadow-sm)' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>📏</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cm-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Dimensions</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--cm-text-dark)' }}>{listing.item_specs?.dimensions || 'Standard Size'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--cm-text-muted)', marginTop: '4px' }}>Accurate measurement check</div>
            </div>

            {/* Spec 3 - Item Age */}
            <div style={{ backgroundColor: '#ffffff', border: '1.5px solid var(--cm-border)', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--cm-shadow-sm)' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>⏳</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cm-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Age of Asset</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--cm-text-dark)' }}>
                {listing.item_specs?.age_years !== undefined && listing.item_specs?.age_years !== null
                  ? `${listing.item_specs.age_years} ${listing.item_specs.age_years === 1 ? 'Year' : 'Years'}`
                  : 'N/A'
                }
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--cm-text-muted)', marginTop: '4px' }}>Accumulated vintage duration</div>
            </div>

            {/* Spec 4 - Stock Quantity */}
            <div style={{ backgroundColor: '#ffffff', border: '1.5px solid var(--cm-border)', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--cm-shadow-sm)' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>📦</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cm-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Available Stock</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--cm-text-dark)' }}>{listing.item_specs?.quantity || 1} Unit(s)</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--cm-text-muted)', marginTop: '4px' }}>Active database catalog records</div>
            </div>

            {/* Spec 5 - Warranty */}
            <div style={{ backgroundColor: '#ffffff', border: '1.5px solid var(--cm-border)', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--cm-shadow-sm)' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>🛡️</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cm-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Warranty & Protection</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--cm-text-dark)' }}>{listing.item_specs?.warranty || 'No Active Warranty'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--cm-text-muted)', marginTop: '4px' }}>Seller safeguard security assurance</div>
            </div>

            {/* Spec 6 - Location */}
            <div style={{ backgroundColor: '#ffffff', border: '1.5px solid var(--cm-border)', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--cm-shadow-sm)' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>📍</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cm-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Trading Location</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--cm-text-dark)' }}>
                {listing.location?.city ? `${listing.location.city}, ${listing.location.state || ''}` : 'Local pickup only'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--cm-text-muted)', marginTop: '4px' }}>Geolocalized collection coordinates</div>
            </div>

          </div>
        </section>

        {/* Related Bargains Section */}
        {relatedListings.length > 0 && (
          <section style={{ borderTop: '1.5px solid var(--cm-border)', paddingTop: '4rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--cm-text-dark)', marginBottom: '2rem', letterSpacing: '-0.75px' }}>
              Related Bargains
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
              {relatedListings.map((item) => (
                <div key={item.id} style={{ cursor: 'pointer' }} onClick={() => router.push(getThemeLink(`/product/${item.slug}`))}>
                  <ModernCard
                    title={item.title}
                    price={item.pricing?.formatted_short || item.pricing?.formatted || `$${item.pricing?.sale_price || item.pricing?.base_price}`}
                    location={`${item.location?.city || ''}, ${item.location?.state || ''}`}
                    time={item.status?.is_new_listing ? 'Just Now' : '1d ago'}
                    image={item.media?.thumbnail || item.media?.main_photo || "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400"}
                    isFeatured={item.status?.is_featured}
                    isRecent={item.status?.is_new_listing}
                    isSale={item.pricing?.is_on_sale}
                    isFavorite={false}
                    onQuickView={() => router.push(getThemeLink(`/product/${item.slug}`))}
                    onToggleFavorite={() => {}}
                    onShare={() => alert("🔗 Copied product link to clipboard!")}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Stateful Drawer booking slide-over panel */}
      {drawerOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(33, 37, 41, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          justifyContent: 'flex-end',
          zIndex: 4000,
          animation: 'cmFadeIn 0.3s ease-out'
        }}>
          
          {/* Drawer Inner Panel Container */}
          <div style={{
            backgroundColor: '#ffffff',
            width: '100%',
            maxWidth: '480px',
            height: '100%',
            boxShadow: '-10px 0 40px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            animation: 'drawerSlideLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            
            {/* Header section of drawer */}
            <div style={{ padding: '2rem', borderBottom: '1.5px solid var(--cm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--cm-text-dark)', margin: 0 }}>Secure This Bargain</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--cm-text-muted)', fontWeight: 600 }}>Reserve and submit buyer inquiry log</span>
              </div>
              <button 
                onClick={() => { setDrawerOpen(false); setOrderComplete(false); }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  fontWeight: 800,
                  color: 'var(--cm-text-muted)',
                  transition: 'color 0.2s'
                }}
                className="hover-orange"
              >
                ✕
              </button>
            </div>

            {/* Body contents */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
              {orderComplete ? (
                // Success screen UI representation
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ fontSize: '4.5rem', marginBottom: '1.5rem' }}>🎉</div>
                  <h4 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--cm-text-dark)', marginBottom: '0.5rem' }}>Inquiry Registered!</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--cm-text-muted)', lineHeight: '1.5', marginBottom: '2rem' }}>
                    Your bargain request reservation has been written. The seller will be notified of your booking coordinates.
                  </p>
                  
                  {/* Reference indicator dashboard */}
                  <div style={{
                    backgroundColor: 'rgba(0, 188, 212, 0.08)',
                    border: '1.5px dashed var(--cm-accent-cyan)',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    marginBottom: '2.5rem',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    color: 'var(--cm-text-dark)'
                  }}>
                    <strong>REF ID:</strong> {generatedRef}
                  </div>

                  <button 
                    onClick={() => { setDrawerOpen(false); setOrderComplete(false); }}
                    style={{
                      padding: '0.9rem 2.5rem',
                      borderRadius: '50px',
                      backgroundColor: 'var(--cm-accent-cyan)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0, 188, 212, 0.3)'
                    }}
                  >
                    Done Deal
                  </button>
                </div>
              ) : (
                // Form layout to register a reservation
                <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* Visual listing snapshot preview */}
                  <div style={{ display: 'flex', gap: '12px', padding: '1rem', backgroundColor: 'var(--cm-bg-light)', borderRadius: '12px', border: '1px solid var(--cm-border)' }}>
                    <img 
                      src={listing.media?.thumbnail || listing.media?.main_photo || "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=150"} 
                      alt={listing.title} 
                      style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--cm-text-dark)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', width: '280px' }}>{listing.title}</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--cm-primary-orange)', marginTop: '4px' }}>${salePrice.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Field 1 - Buyer Name */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cm-text-dark)', textTransform: 'uppercase' }}>Full Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Liam Anderson"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1.5px solid var(--cm-border)', fontSize: '0.9rem', outline: 'none' }}
                      className="cm-drawer-input"
                    />
                  </div>

                  {/* Field 2 - Email */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cm-text-dark)', textTransform: 'uppercase' }}>Email Address *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. liam@example.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1.5px solid var(--cm-border)', fontSize: '0.9rem', outline: 'none' }}
                      className="cm-drawer-input"
                    />
                  </div>

                  {/* Field 3 - Phone */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cm-text-dark)', textTransform: 'uppercase' }}>Phone Number *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. (555) 019-2834"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1.5px solid var(--cm-border)', fontSize: '0.9rem', outline: 'none' }}
                      className="cm-drawer-input"
                    />
                  </div>

                  {/* Field 4 - Quantity to reserve */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cm-text-dark)', textTransform: 'uppercase' }}>Inquiry Quantity *</label>
                    <select
                      value={formQuantity}
                      onChange={(e) => setFormQuantity(Number(e.target.value))}
                      style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1.5px solid var(--cm-border)', fontSize: '0.9rem', outline: 'none', backgroundColor: '#ffffff' }}
                    >
                      {Array.from({ length: Math.min(listing.item_specs?.quantity || 1, 10) }, (_, i) => i + 1).map((qty) => (
                        <option key={qty} value={qty}>{qty} Unit{qty > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  {/* Field 5 - Buyer messaging */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cm-text-dark)', textTransform: 'uppercase' }}>Inquiry Message</label>
                    <textarea 
                      rows={4}
                      placeholder="Specify custom notes or delivery requests..."
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1.5px solid var(--cm-border)', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                    />
                  </div>

                  {/* Checkout summary calculations */}
                  <div style={{ 
                    marginTop: '1rem', 
                    padding: '1.25rem', 
                    backgroundColor: 'rgba(255, 103, 0, 0.05)', 
                    border: '1.5px solid rgba(255, 103, 0, 0.1)', 
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--cm-text-muted)' }}>
                      <span>Unit Value</span>
                      <span>${salePrice.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--cm-text-muted)' }}>
                      <span>Inquiry Volume</span>
                      <span>x {formQuantity}</span>
                    </div>
                    <div style={{ height: '1px', backgroundColor: 'var(--cm-border)', margin: '4px 0' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 900, color: 'var(--cm-text-dark)' }}>
                      <span>Total Reservation</span>
                      <span style={{ color: 'var(--cm-primary-orange)' }}>${(salePrice * formQuantity).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    style={{
                      marginTop: '1rem',
                      padding: '1.1rem',
                      borderRadius: '50px',
                      backgroundColor: 'var(--cm-primary-orange)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      boxShadow: '0 6px 18px rgba(255, 103, 0, 0.2)',
                      transition: 'all 0.25s'
                    }}
                  >
                    Submit Booking Request
                  </button>

                </form>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Styled JSX for animations and unique hover states */}
      <style jsx global>{`
        @keyframes cmFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes drawerSlideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .hover-orange:hover {
          color: var(--cm-primary-orange) !important;
        }
        .pulse-orange-btn:hover {
          transform: translateY(-2px);
          background-color: #e65c00 !important;
          box-shadow: 0 12px 30px rgba(255, 103, 0, 0.45) !important;
        }
        .pulse-orange-btn:active {
          transform: translateY(0);
        }
        .cm-drawer-input:focus {
          border-color: var(--cm-accent-cyan) !important;
          box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.15);
        }
      `}</style>

      <ModernFooter />
    </div>
  );
}
