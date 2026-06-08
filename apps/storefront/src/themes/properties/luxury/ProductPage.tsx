'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';

interface ProductPageProps {
  slug: string;
}

const FALLBACK_ESTATES: Property[] = [
  { id: 1, user_id: 1, category_id: 1, type_id: 1, location_id: 1, title: "The Pemberley Manor", slug: "pemberley-manor", description: "A majestic historic manor situated in the heart of Hertfordshire, featuring sweeping countryside views and rich architectural history. Built during the Regency period, Pemberley Manor offers exceptionally grand proportions, beautiful sash windows, and intricate original moldings.\n\nThe extensive grounds include pristine manicured lawns, a private serpentine lake, and mature oak forests. A truly unparalleled heritage opportunity.", base_price: 14200000, number_of_bedrooms: 6, number_of_bathrooms: 5, maximum_guests: 10, minimum_rental_days: 7, maximum_rental_days: 30, area_sq_ft: 12000, area_sq_m: 1114, number_of_parking_spots: 4, hoa: 200, year_built: 1815, address: "Pemberley Park", city: "Hertfordshire", state: "Herts", country: "UK", zip_code: "AL1 1AB", status: "active", is_published: true, is_featured: true, is_rental: false, is_sale: true, created_at: "", updated_at: "", pricing: { base_price: 14200000, price_formatted: "$14,200,000", currency_symbol: "$" }, location: { id: 1, title: "Hertfordshire", country: "UK", slug: "hertfordshire" }, specs: { bedrooms: 6, bathrooms: 5, area_formatted: "12,000 Sq Ft", year_built: 1815, category: "Country Manors", property_type: "Sale" }, featured_image: "/themes/properties/luxury/3.webp", short_description: "A majestic historic manor situated in the heart of Hertfordshire, featuring sweeping countryside views and rich architectural history." },
  { id: 2, user_id: 1, category_id: 2, type_id: 1, location_id: 2, title: "Florentine Palazzo", slug: "florentine-palazzo", description: "An authentic Renaissance palace in central Florence, with original frescoes, grand vaulted halls, and private courtyard gardens. Steeped in history, this Palazzo was designed by master architects of the 16th century and preserves spectacular historical provenance.", base_price: 22500000, number_of_bedrooms: 8, number_of_bathrooms: 7, maximum_guests: 16, minimum_rental_days: 3, maximum_rental_days: 14, area_sq_ft: 18500, area_sq_m: 1718, number_of_parking_spots: 2, hoa: 500, year_built: 1540, address: "Via dei Bardi", city: "Florence", state: "Tuscany", country: "Italy", zip_code: "50125", status: "active", is_published: true, is_featured: false, is_rental: false, is_sale: true, created_at: "", updated_at: "", pricing: { base_price: 22500000, price_formatted: "$22,500,000", currency_symbol: "$" }, location: { id: 2, title: "Florence", country: "Italy", slug: "florence" }, specs: { bedrooms: 8, bathrooms: 7, area_formatted: "18,500 Sq Ft", year_built: 1540, category: "Historic Chateaus", property_type: "Sale" }, featured_image: "/themes/properties/luxury/4.webp", short_description: "An authentic Renaissance palace in central Florence, with original frescoes, grand vaulted halls, and private courtyard gardens." },
  { id: 3, user_id: 1, category_id: 3, type_id: 1, location_id: 3, title: "Colonial River Estate", slug: "colonial-river-estate", description: "A meticulously preserved classic colonial estate on the banks of the James River, boasting rich heritage and timeless charm.", base_price: 8900000, number_of_bedrooms: 5, number_of_bathrooms: 4, maximum_guests: 8, minimum_rental_days: 1, maximum_rental_days: 365, area_sq_ft: 8200, area_sq_m: 761, number_of_parking_spots: 3, hoa: 100, year_built: 1742, address: "River Road", city: "Virginia", state: "VA", country: "USA", zip_code: "23220", status: "active", is_published: true, is_featured: false, is_rental: false, is_sale: true, created_at: "", updated_at: "", pricing: { base_price: 8900000, price_formatted: "$8,900,000", currency_symbol: "$" }, location: { id: 3, title: "Virginia", country: "USA", slug: "virginia" }, specs: { bedrooms: 5, bathrooms: 4, area_formatted: "8,200 Sq Ft", year_built: 1742, category: "Colonial Estates", property_type: "Sale" }, featured_image: "/themes/properties/luxury/3.webp", short_description: "A meticulously preserved classic colonial estate on the banks of the James River, boasting rich heritage and timeless charm." }
];

interface RelatedCardProps {
  title: string;
  price: string;
  location: string;
  tag: string;
  image: string;
  slug: string;
}

const RelatedCard = ({ title, price, location, tag, image, slug }: RelatedCardProps) => {
  const themeLink = usePropertyThemeLink();

  return (
    <div className="estate-card-premium" style={{ cursor: 'pointer' }} onClick={() => { window.location.href = themeLink(`/product/${slug}`); }}>
      <div style={{ overflow: 'hidden' }}>
        <img src={image} alt={title} className="estate-card-img" />
      </div>
      <div className="estate-card-info">
        <span className="estate-card-tag">{tag}</span>
        <h3 className="estate-card-title" style={{ fontSize: '1.8rem' }}>{title}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.15rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>{price}</span>
          <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600 }}>{location.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};

export default function ProductPage({ slug }: ProductPageProps) {
  const themeLink = usePropertyThemeLink();
  const [property, setProperty] = useState<Property | null>(null);
  const [related, setRelated] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Inquiry form states
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Lodging calculation pricing
  const [estimatingPrice, setEstimatingPrice] = useState(false);
  const [estimation, setEstimation] = useState<{ total_nights: number; estimated_lodging_total: string } | null>(null);
  const [inquiryAdded, setInquiryAdded] = useState(false);
  const [registryFeedback, setRegistryFeedback] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [inquiryDispatched, setInquiryDispatched] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      try {
        const response = await api.getPropertyDetails(slug);
        if (response && response.success && response.data) {
          setProperty(response.data);
          setRelated(response.related_properties || []);
          setUseFallback(false);
          setApiError(null);
        } else {
          setApiError("Database returned unsuccessful details payload. Using fallback.");
          loadFallback();
        }
      } catch (err: any) {
        setApiError(err instanceof Error ? err.message : String(err));
        loadFallback();
      } finally {
        setLoading(false);
      }
    };

    const loadFallback = () => {
      const matched = FALLBACK_ESTATES.find(e => e.slug === slug);
      if (matched) {
        setProperty(matched);
        setRelated(FALLBACK_ESTATES.filter(e => e.slug !== slug).slice(0, 2));
      } else {
        setProperty(FALLBACK_ESTATES[0]);
        setRelated(FALLBACK_ESTATES.slice(1, 3));
      }
      setUseFallback(true);
    };

    loadDetails();
  }, [slug]);

  // Estimator calculator logic
  useEffect(() => {
    const calculatePrice = async () => {
      if (!property || !checkIn || !checkOut) return;
      setEstimatingPrice(true);
      try {
        if (useFallback) {
          const inDate = new Date(checkIn);
          const outDate = new Date(checkOut);
          const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
          const basePriceVal = Number(property.pricing?.base_price || property.base_price || 25000);
          const estimatedTotal = (basePriceVal * 0.001 * diffDays).toFixed(2); // Mock daily rental logic
          setEstimation({
            total_nights: diffDays,
            estimated_lodging_total: estimatedTotal
          });
        } else {
          const result = await api.calculateLodgingPrice(property.id, checkIn, checkOut);
          setEstimation(result);
        }
      } catch (err) {
        console.warn("Calculation of seasonal rates failed.", err);
      } finally {
        setEstimatingPrice(false);
      }
    };
    calculatePrice();
  }, [checkIn, checkOut, property, useFallback]);

  // Check if listing has been collected
  useEffect(() => {
    if (!property) return;
    const currentList = JSON.parse(localStorage.getItem('sellio_luxury_inquiries') || '[]');
    const exists = currentList.some((item: any) => item.id === property.id);
    setInquiryAdded(exists);
  }, [property]);

  const handleAddToRegistry = () => {
    if (!property) return;
    const currentList = JSON.parse(localStorage.getItem('sellio_luxury_inquiries') || '[]');

    if (!currentList.some((item: any) => item.id === property.id)) {
      const updatedList = [...currentList, {
        id: property.id,
        title: property.title,
        slug: property.slug,
        featured_image: property.featured_image || property.thumbnail_image,
        location: property.location?.title || property.city,
        price: property.pricing?.price_formatted || property.base_price,
        beds: property.specs?.bedrooms ?? property.number_of_bedrooms,
        baths: property.specs?.bathrooms ?? property.number_of_bathrooms,
        area: property.specs?.area_formatted || `${property.area_sq_ft} SQFT`
      }];
      localStorage.setItem('sellio_luxury_inquiries', JSON.stringify(updatedList));
      setInquiryAdded(true);
      setRegistryFeedback('Estate collected successfully for direct coordination.');
    } else {
      const updatedList = currentList.filter((item: any) => item.id !== property.id);
      localStorage.setItem('sellio_luxury_inquiries', JSON.stringify(updatedList));
      setInquiryAdded(false);
      setRegistryFeedback('Estate removed from your Heritage collection.');
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      setFormError('Please complete the required details before dispatch.');
      return;
    }
    setFormError(null);
    setInquiryDispatched(true);
    setFullName('');
    setEmail('');
    setMessage('');
    setCheckIn('');
    setCheckOut('');
  };

  if (loading) {
    return (
      <div style={{ background: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'var(--font-serif)' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--luxury-charcoal)', fontStyle: 'italic' }}>Decoding Provenance Ledgers...</h2>
        <div style={{ width: '80px', height: '1px', background: 'var(--luxury-gold)', marginTop: '2rem' }} />
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{ background: 'var(--luxury-platinum)', minHeight: '100vh', padding: '12rem 2rem', textAlign: 'center', fontFamily: 'var(--font-sans)' }}>
        <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: 'var(--luxury-charcoal)', marginBottom: '2rem' }}>Estate Not Found</h2>
        <p style={{ color: '#666', marginBottom: '4rem' }}>The requested listing signature could not be matched with the Global Heritage Catalog.</p>
        <a href={themeLink('/')} className="luxury-btn-primary" style={{ textDecoration: 'none' }}>Return to Homepage</a>
      </div>
    );
  }

  const isRental = property.is_rental || property.status === 'rental';
  const displayTitle = property.title;
  const displayPrice = property.pricing?.price_formatted || (property.base_price ? `$${Number(property.base_price).toLocaleString()}` : '$1,000,000');
  const displayLocation = property.location?.title
    ? `${property.location.title}, ${property.location.country || ''}`
    : (property.city && property.country ? `${property.city}, ${property.country}` : 'Global Registry');
  const displayYear = property.specs?.year_built || property.year_built || '1815';
  const displayImage = property.featured_image || property.primary_image_url || '/themes/properties/luxury/3.webp';

  const beds = property.specs?.bedrooms ?? property.number_of_bedrooms ?? 5;
  const baths = property.specs?.bathrooms ?? property.number_of_bathrooms ?? 4;
  const area = property.specs?.area_formatted || (property.area_sq_ft ? `${property.area_sq_ft.toLocaleString()} SQFT` : '8,500 SQFT');
  const guestsCount = property.specs?.max_guests ?? property.maximum_guests ?? 8;
  const parking = property.specs?.parking_spots ?? property.number_of_parking_spots ?? 3;
  const categoryName = property.specs?.category || property.category?.title || 'Signature Estate';

  return (
    <div className="luxury-premium-wrapper" style={{ minHeight: '100vh' }}>
      
      {/* Immersive Parallax Header */}
      <section style={{ height: '70vh', position: 'relative', overflow: 'hidden', background: 'var(--luxury-charcoal)' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.65 }}>
          <img src={displayImage} alt={displayTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.75))' }} />
        
        <div style={{ position: 'absolute', bottom: '6rem', left: '5%', right: '5%', zIndex: 10, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--luxury-gold)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '4px' }}>{categoryName.toUpperCase()}</span>
              <div style={{ width: '30px', height: '1px', background: 'var(--luxury-gold)', opacity: 0.5 }} />
              <span style={{ color: 'var(--luxury-gold)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '4px' }}>EST. {displayYear}</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 900, color: '#ffffff', letterSpacing: '-2px', textShadow: '0 4px 15px rgba(0,0,0,0.4)', margin: 0 }}>
              {displayTitle}
            </h1>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.15)', padding: '2rem 3.5rem', color: '#ffffff', textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--luxury-gold)', letterSpacing: '2px' }}>ACQUISITION_VALUATION</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '1px', color: 'var(--luxury-gold)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>{displayPrice}</div>
          </div>
        </div>
      </section>

      {/* Main Details and Forms Section */}
      <section style={{ padding: '8rem 5% 10rem 5%' }}>
        
        {/* Offline Diagnostic Connection Alert */}
        {useFallback && apiError && (
          <div style={{
            padding: '1.5rem',
            background: 'rgba(212, 175, 55, 0.05)',
            border: '1px solid var(--luxury-gold)',
            borderRadius: '4px',
            marginBottom: '6rem',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem',
            color: 'var(--luxury-charcoal)',
            lineHeight: '1.6',
          }}>
            <span style={{ fontWeight: 800, color: 'var(--luxury-gold)', display: 'block', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>
              System Provenance Connection Alert
            </span>
            <p style={{ margin: 0, color: '#666' }}>
              This listing is running in <strong>Offline Provenance Fallback Mode</strong> due to database connections trace error.
            </p>
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              background: 'rgba(0,0,0,0.03)', 
              borderLeft: '3px solid var(--luxury-gold)', 
              fontFamily: 'monospace', 
              fontSize: '0.75rem', 
              color: '#888',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}>
              {apiError}
            </div>
          </div>
        )}

        <div className="luxury-details-container">
          
          {/* Left Column: Descriptions and Specs */}
          <div>
            <div style={{ borderBottom: '1px solid var(--luxury-border)', paddingBottom: '4rem', marginBottom: '4rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--luxury-gold)', display: 'block', letterSpacing: '3px', marginBottom: '1.5rem' }}>HISTORIC_ACCOUNT</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', fontWeight: 700, color: 'var(--luxury-charcoal)', marginBottom: '2.5rem', letterSpacing: '-1px' }}>
                Provenance & <span style={{ fontWeight: 400, fontStyle: 'italic' }}>Narrative.</span>
              </h2>
              <div style={{ fontSize: '1.15rem', color: '#555', lineHeight: 2, whiteSpace: 'pre-line', fontFamily: 'var(--font-sans)', fontWeight: 400 }}>
                {property.description}
              </div>
            </div>

            {/* Architectural Grid */}
            <div style={{ borderBottom: '1px solid var(--luxury-border)', paddingBottom: '4rem', marginBottom: '4rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--luxury-gold)', display: 'block', letterSpacing: '3px', marginBottom: '2.5rem' }}>ARCHITECTURAL_REGISTRY</span>
              <div className="luxury-spec-grid">
                {[
                  { label: "BEDROOMS", value: `${beds} Rooms` },
                  { label: "BATHROOMS", value: `${baths} Baths` },
                  { label: "TOTAL AREA", value: area },
                  { label: "MAX OCCUPANCY", value: `${guestsCount} Guests` },
                  { label: "PARKING DESK", value: `${parking} Spots` },
                  { label: "HOA DUES", value: property.hoa ? `$${property.hoa}/mo` : "Included" }
                ].map((s, i) => (
                  <div key={i} className="luxury-spec-tile">
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#999', letterSpacing: '2px', marginBottom: '0.8rem' }}>{s.label}</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--luxury-charcoal)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Section */}
            {property.amenities && property.amenities.length > 0 && (
              <div style={{ borderBottom: '1px solid var(--luxury-border)', paddingBottom: '4rem', marginBottom: '4rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--luxury-gold)', display: 'block', letterSpacing: '3px', marginBottom: '2.5rem' }}>PREMIUM_AMENITIES</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  {property.amenities.map(a => (
                    <div key={a.id} style={{ border: '1px solid var(--luxury-gold)', padding: '1rem 2rem', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--luxury-charcoal)', background: 'transparent' }}>
                      ❦ {a.title.toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features list */}
            {property.features && property.features.length > 0 && (
              <div style={{ borderBottom: '1px solid var(--luxury-border)', paddingBottom: '4rem', marginBottom: '4rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--luxury-gold)', display: 'block', letterSpacing: '3px', marginBottom: '2.5rem' }}>FEALTY_SPECIFICATIONS</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }} className="pc-feats-grid">
                  <style dangerouslySetInnerHTML={{ __html: `
                    @media (min-width: 600px) {
                      .pc-feats-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    }
                  ` }} />
                  {property.features.map(f => (
                    <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.95rem', color: '#555', fontFamily: 'var(--font-sans)' }}>
                      <span style={{ color: 'var(--luxury-gold)', fontSize: '1.3rem' }}>❖</span>
                      <span>{f.title} {f.pivot?.value ? `: ${f.pivot.value}` : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Gallery */}
            {property.gallery && property.gallery.length > 0 && (
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--luxury-gold)', display: 'block', letterSpacing: '3px', marginBottom: '2.5rem' }}>PROVENANCE_VISUAL_LEDGER</span>
                <div className="luxury-gallery-grid">
                  {property.gallery.map((img: string, idx: number) => (
                    <div key={idx} className="luxury-gallery-img-wrapper">
                      <img src={img} alt={`Visual Ledger ${idx}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Inquiry / Booking Form */}
          <aside>
            <div className="luxury-inquiry-card">
              
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--luxury-gold)', letterSpacing: '3px', display: 'block', marginBottom: '1rem' }}>CONCIERGE_DESK</span>
                <h3 className="luxury-inquiry-title">
                  Manorial <span>Inquiry.</span>
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem', fontWeight: 600, letterSpacing: '1px' }}>{displayLocation.toUpperCase()}</div>
              </div>

              {/* Inquiry Action Registry */}
              <button 
                onClick={handleAddToRegistry} 
                className="luxury-btn-primary" 
                style={{ 
                  width: '100%', 
                  padding: '1.5rem', 
                  marginBottom: '2rem', 
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  letterSpacing: '2px',
                  background: inquiryAdded ? 'transparent' : 'var(--luxury-charcoal)',
                  border: inquiryAdded ? '1px solid var(--luxury-charcoal)' : '1px solid transparent',
                  color: inquiryAdded ? 'var(--luxury-charcoal)' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {inquiryAdded ? '✓ ADDED TO HERITAGE REGISTRY' : '❦ COLLECT FOR DIRECT INQUIRY'}
              </button>
              {registryFeedback && (
                <p role="status" style={{ margin: '-1rem 0 2rem', fontSize: '0.8rem', color: 'var(--luxury-gold)', textAlign: 'center' }}>
                  {registryFeedback}
                </p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--luxury-border)' }} />
                <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#999', letterSpacing: '2px' }}>OR DISPATCH COORDINATION</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--luxury-border)' }} />
              </div>

              {inquiryDispatched ? (
                <div role="status" style={{ padding: '2.5rem 1.5rem', border: '1px solid var(--luxury-border)', background: 'var(--luxury-platinum)', textAlign: 'center' }}>
                  <span style={{ fontSize: '2rem', color: 'var(--luxury-gold)', display: 'block', marginBottom: '1rem' }}>✦</span>
                  <p style={{ fontSize: '0.9rem', color: 'var(--luxury-charcoal)', lineHeight: 1.8, margin: 0 }}>
                    An Estate Heritage Coordinator has been notified. We will verify architectural provenance and contact you shortly.
                  </p>
                  <button
                    type="button"
                    className="luxury-btn-primary"
                    style={{ marginTop: '2rem', width: '100%', padding: '1.25rem', fontSize: '0.75rem' }}
                    onClick={() => setInquiryDispatched(false)}
                  >
                    DISPATCH ANOTHER INQUIRY
                  </button>
                </div>
              ) : (
              <form onSubmit={handleInquirySubmit}>
                {/* Date Estimator if rental */}
                {isRental && (
                  <div style={{ background: 'var(--luxury-platinum)', padding: '2rem 1.5rem', border: '1px solid var(--luxury-border)', marginBottom: '2.5rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--luxury-gold)', display: 'block', letterSpacing: '2px', marginBottom: '1.5rem' }}>LODGING_RENTAL_ESTIMATOR</span>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div>
                        <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--luxury-charcoal)', display: 'block', marginBottom: '0.5rem', letterSpacing: '1px' }}>CHECK IN DATE</label>
                        <input 
                          type="date" 
                          required 
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          style={{ width: '100%', padding: '0.9rem', border: '1px solid var(--luxury-border)', background: '#ffffff', fontFamily: 'var(--font-sans)', outline: 'none', fontSize: '0.75rem', fontWeight: 700 }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--luxury-charcoal)', display: 'block', marginBottom: '0.5rem', letterSpacing: '1px' }}>CHECK OUT DATE</label>
                        <input 
                          type="date" 
                          required 
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          style={{ width: '100%', padding: '0.9rem', border: '1px solid var(--luxury-border)', background: '#ffffff', fontFamily: 'var(--font-sans)', outline: 'none', fontSize: '0.75rem', fontWeight: 700 }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--luxury-charcoal)', display: 'block', marginBottom: '0.5rem', letterSpacing: '1px' }}>PATRON COUNT</label>
                        <select 
                          value={guests} 
                          onChange={(e) => setGuests(e.target.value)}
                          style={{ width: '100%', padding: '0.9rem', border: '1px solid var(--luxury-border)', background: '#ffffff', outline: 'none', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-sans)' }}
                        >
                          {[...Array(guestsCount)].map((_, i) => (
                            <option key={i+1} value={i+1}>{i+1} Patron{i > 0 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {checkIn && checkOut && (
                      <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--luxury-border)' }}>
                        {estimatingPrice ? (
                          <div style={{ fontSize: '0.8rem', color: '#888', fontStyle: 'italic' }}>Calculating Manorial Seasonal Rates...</div>
                        ) : estimation ? (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--luxury-charcoal)', letterSpacing: '1px' }}>{estimation.total_nights} NIGHTS LODGING</span>
                            <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--luxury-gold)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>${Number(estimation.estimated_lodging_total).toLocaleString()}</span>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--luxury-charcoal)', display: 'block', marginBottom: '0.5rem', letterSpacing: '1px' }}>FULL NAME</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Grace Bennett"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ width: '100%', padding: '1rem', border: '1px solid var(--luxury-border)', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 600 }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--luxury-charcoal)', display: 'block', marginBottom: '0.5rem', letterSpacing: '1px' }}>EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="grace@pemberley.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '1rem', border: '1px solid var(--luxury-border)', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 600 }}
                  />
                </div>

                <div style={{ marginBottom: '3rem' }}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--luxury-charcoal)', display: 'block', marginBottom: '0.5rem', letterSpacing: '1px' }}>PATRON MESSAGE</label>
                  <textarea 
                    rows={4}
                    placeholder="Inquire on structural provenance, dynamic title registry, or manorial deeds allocation..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ width: '100%', padding: '1rem', border: '1px solid var(--luxury-border)', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 600, resize: 'none' }}
                  />
                </div>

                <button type="submit" className="luxury-btn-primary" style={{ width: '100%', padding: '1.5rem', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '3px' }}>
                  DISPATCH DIRECT INQUIRY
                </button>
                {formError && (
                  <p role="alert" style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#b45309', textAlign: 'center' }}>
                    {formError}
                  </p>
                )}
              </form>
              )}
              
              <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '3px', color: '#999' }}>
                HERITAGE_COORDINATION_DESK
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related Affiliations Showcase */}
      {related && related.length > 0 && (
        <section style={{ background: 'var(--luxury-platinum)', padding: '10rem 5%' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--luxury-gold)', display: 'block', letterSpacing: '4px', marginBottom: '1.5rem' }}>HERITAGE_AFFILIATIONS</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-2px', color: 'var(--luxury-charcoal)' }}>
                Related <span style={{ fontWeight: 400, fontStyle: 'italic' }}>Provenance.</span>
              </h3>
            </div>
            
            <div className="showcase-grid">
              {related.map((estate, idx) => {
                const price = estate.pricing?.price_formatted || (estate.base_price ? `$${Number(estate.base_price).toLocaleString()}` : '');
                const loc = estate.location?.title || estate.city || 'Exclusive Location';
                const tag = estate.is_featured ? 'FEATURED' : 'SIGNATURE';
                const image = estate.featured_image || estate.primary_image_url || '/themes/properties/luxury/3.webp';

                return (
                  <RelatedCard 
                    key={estate.id || idx} 
                    title={estate.title}
                    price={price}
                    location={loc}
                    tag={tag}
                    image={image}
                    slug={estate.slug}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
