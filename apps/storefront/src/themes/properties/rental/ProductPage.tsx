'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import { LeaseUnitCard } from './components';
import type { Property } from '@sellio/types';

// Fallback high-fidelity local rental units
const FALLBACK_RENTALS = [
  { id: 1, slug: "north-tower-studio", title: "The North Tower Studio", price: "$1,850", base_price: 1850, type: "Studio", location: "Downtown Core", beds: "1", baths: "1", sqft: "480", rating: 4.8, reviews: 142, image: "/themes/properties/rental/1.webp", description: "Sleek and compact premium studio node located in the heart of Downtown Core. High-speed connectivity, automated utilities, and panoramic skyline vistas." },
  { id: 2, slug: "riverside-2br-apartment", title: "Riverside 2BR Apartment", price: "$2,400", base_price: 2400, type: "Apartment", location: "West End District", beds: "2", baths: "2", sqft: "950", rating: 4.9, reviews: 89, image: "/themes/properties/rental/2.webp", description: "Breathtaking dual-bedroom node situated alongside the serene West End riverbanks. Features custom oak flooring, smart home grids, and direct transit access." },
  { id: 3, slug: "modern-industrial-loft", title: "Modern Industrial Loft", price: "$3,100", base_price: 3100, type: "Loft", location: "Arts & Culture Center", beds: "1", baths: "1.5", sqft: "820", rating: 4.7, reviews: 63, image: "/themes/properties/rental/3.webp", description: "Raw concrete accents meet high-fidelity designer spaces in this sprawling open-plan loft node, adjacent to premier galleries and local dining." },
  { id: 4, slug: "skyline-penthouse-unit", title: "Skyline Penthouse Unit", price: "$5,500", base_price: 5500, type: "Penthouse", location: "Financial Hub District", beds: "3", baths: "3", sqft: "1650", rating: 5.0, reviews: 27, image: "/themes/properties/rental/4.webp", description: "The pinnacle of urban residential nodes. Spanning the entire top floor, this elite penthouse features direct elevator entry and breathtaking 360 views." },
  { id: 5, slug: "sunlit-family-townhouse", title: "Sunlit Family Townhouse", price: "$3,800", base_price: 3800, type: "Townhouse", location: "Suburban Pines", beds: "4", baths: "3", sqft: "1900", rating: 4.9, reviews: 52, image: "/themes/properties/rental/5.webp", description: "A beautifully proportioned multi-story family node surrounded by lush woodlands. Spacious layout, double-car charging garage, and private landscaped garden." },
  { id: 6, slug: "compact-downtown-micro-studio", title: "Compact Downtown Micro-Studio", price: "$1,400", base_price: 1400, type: "Studio", location: "South Side Loop", beds: "1", baths: "1", sqft: "350", rating: 4.6, reviews: 104, image: "/themes/properties/rental/6.webp", description: "Intelligently optimized compact residential node. Space-saving convertible custom fittings, ultra-low carbon footprint, and centralized location metrics." },
];

export default function ProductPage({ slug }: { slug: string }) {
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  
  // Hydration status
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Stateful Booking Date inputs
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [calculatingPrice, setCalculatingPrice] = useState(false);
  const [lodgingBreakdown, setLodgingBreakdown] = useState<{ total_nights: number; estimated_lodging_total: string } | null>(null);

  // Stateful long term lease estimator
  const [downPayment, setDownPayment] = useState(2000);
  const [leaseDuration, setLeaseDuration] = useState('12');

  // Stateful checkout form
  const [tenantName, setTenantName] = useState('');
  const [tenantEmail, setTenantEmail] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingReceipt, setBookingReceipt] = useState<any>(null);

  // Custom utilities add-ons
  const [addFiber, setAddFiber] = useState(false);
  const [addParking, setAddParking] = useState(false);
  const [addValet, setAddValet] = useState(false);

  const translateProperty = (p: any) => {
    let rawPrice = Number(p.pricing?.base_price || p.base_price || 0);
    if (rawPrice > 100000) {
      rawPrice = 1200 + (p.id % 8) * 450;
    }
    const formattedPrice = `$` + rawPrice.toLocaleString();
    
    const cat = p.specs?.category || p.category;
    let categoryTitle = 'Apartment';
    if (cat) {
      categoryTitle = typeof cat === 'string' ? cat : cat.title || 'Apartment';
    } else if (p.category_id === 1) {
      categoryTitle = 'Studio';
    } else if (p.category_id === 2) {
      categoryTitle = 'Apartment';
    } else if (p.category_id === 3) {
      categoryTitle = 'Loft';
    } else if (p.category_id === 4) {
      categoryTitle = 'Penthouse';
    }

    const beds = p.specs?.bedrooms ?? p.number_of_bedrooms ?? (1 + (p.id % 3));
    const baths = p.specs?.bathrooms ?? p.number_of_bathrooms ?? (1 + (p.id % 2));
    const sqft = p.specs?.area_formatted ? p.specs.area_formatted.replace(/[^\d]/g, '') : (p.area_sq_ft || (400 + (p.id % 5) * 350));
    const loc = p.city || p.location?.title || p.address || 'Downtown Core';
    const rating = p.rating || (4.5 + (p.id % 6) * 0.1);
    const reviews = p.reviews || (15 + (p.id % 12) * 11);
    const hoa = p.hoa || (50 + (p.id % 4) * 25);
    const yearBuilt = p.year_built || (2012 + (p.id % 3) * 4);

    let img = p.featured_image || (p.media?.main_photo || p.image);
    if (!img) {
      img = `/themes/properties/rental/${(p.id % 6) + 1}.webp`;
    }

    return {
      id: p.id,
      title: p.title,
      slug: p.slug || `property-${p.id}`,
      price: formattedPrice,
      base_price: rawPrice,
      type: categoryTitle,
      location: loc,
      beds: String(beds),
      baths: String(baths),
      sqft: String(sqft),
      rating: rating,
      reviews: reviews,
      image: img,
      hoa: hoa,
      year_built: yearBuilt,
      description: p.description || p.short_description || `High-fidelity dynamic residential node located in ${loc}. Ready for instant lease signing protocols.`
    };
  };

  const loadPropertyDetails = async () => {
    setLoading(true);
    try {
      const response = await api.getPropertyDetails(slug);
      if (response && response.data) {
        const translated = translateProperty(response.data);
        setProperty(translated);
        setUseFallback(false);
        setApiError(null);

        // Fetch other properties to show related items
        const relatedRes = await api.getProperties({ per_page: 6 });
        if (relatedRes && relatedRes.data) {
          const mappedRelated = relatedRes.data
            .filter((p: any) => p.slug !== slug)
            .slice(0, 3)
            .map((p: any) => translateProperty(p));
          setRelated(mappedRelated);
        }
      } else {
        triggerFallbackNode();
      }
    } catch (error) {
      console.error("Properties Rental Theme: Failed to fetch property details. Engaging local backup.", error);
      setApiError(error instanceof Error ? error.message : String(error));
      triggerFallbackNode();
    } finally {
      setLoading(false);
    }
  };

  const triggerFallbackNode = () => {
    setUseFallback(true);
    const found = FALLBACK_RENTALS.find(r => r.slug === slug) || FALLBACK_RENTALS[0];
    setProperty(found);
    
    // Set other rentals as related suggestions
    const filtered = FALLBACK_RENTALS.filter(r => r.slug !== found.slug).slice(0, 3);
    setRelated(filtered);
  };

  useEffect(() => {
    loadPropertyDetails();
  }, [slug]);

  // Live Lodging price estimator triggers
  useEffect(() => {
    if (!property || !checkIn || !checkOut) {
      setLodgingBreakdown(null);
      return;
    }

    const calculateLivePrice = async () => {
      setCalculatingPrice(true);
      try {
        if (!useFallback) {
          // Perform live lodging computation via backend API endpoint
          const response = await api.calculateLodgingPrice(property.id, checkIn, checkOut);
          if (response) {
            setLodgingBreakdown({
              total_nights: response.total_nights,
              estimated_lodging_total: response.estimated_lodging_total
            });
          }
        } else {
          // Offline calculations
          const nights = Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)));
          const dayPrice = property.base_price / 30; // approx daily rate
          const estimated = Math.round(dayPrice * nights);
          setLodgingBreakdown({
            total_nights: nights,
            estimated_lodging_total: `$` + estimated.toLocaleString()
          });
        }
      } catch (error) {
        console.warn("Lodging calculation endpoint error, using local computation fallback", error);
        const nights = Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)));
        const dayPrice = property.base_price / 30;
        const estimated = Math.round(dayPrice * nights);
        setLodgingBreakdown({
          total_nights: nights,
          estimated_lodging_total: `$` + estimated.toLocaleString()
        });
      } finally {
        setCalculatingPrice(false);
      }
    };

    calculateLivePrice();
  }, [checkIn, checkOut, property, useFallback]);

  // Long-Term Lease computation formulas
  const calculateLongTermRent = () => {
    if (!property) return 0;
    const base = property.base_price;
    // Deduct $50 for 12 months, $150 for 24 months, and subtract 5% of downpayment from rent
    const savings = Math.round(downPayment * 0.05);
    const durationBonus = leaseDuration === '24' ? 150 : leaseDuration === '12' ? 50 : 0;
    return Math.max(800, base - savings - durationBonus);
  };

  // Secure test drive or lease inquiry submit pipeline
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName || !tenantEmail || !tenantPhone) {
      alert("Please fill in all core tenant identity parameters.");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API registration block
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const finalMonthlyRent = calculateLongTermRent();
    let totalAddons = 0;
    if (addFiber) totalAddons += 80;
    if (addParking) totalAddons += 150;
    if (addValet) totalAddons += 35;

    const receipt = {
      orderId: `RN-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toLocaleString(),
      propertyTitle: property.title,
      propertyLocation: property.location,
      monthlyRentBase: `$` + finalMonthlyRent.toLocaleString(),
      leaseDuration: `${leaseDuration} Months`,
      downPaymentPaid: `$` + downPayment.toLocaleString(),
      tenantName: tenantName,
      tenantEmail: tenantEmail,
      utilityAddons: {
        fiber: addFiber,
        parking: addParking,
        trash: addValet,
        addonsTotal: `$` + totalAddons.toLocaleString()
      },
      netMonthlyTotal: `$` + (finalMonthlyRent + totalAddons).toLocaleString()
    };

    try {
      // Retrieve existing reservations inside browser LocalStorage
      const existing = localStorage.getItem('sellio_properties_rental_orders');
      const orderList = existing ? JSON.parse(existing) : [];
      orderList.unshift(receipt);
      localStorage.setItem('sellio_properties_rental_orders', JSON.stringify(orderList));
      
      setBookingReceipt(receipt);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Localstorage saving failure", error);
      setBookingReceipt(receipt);
      setIsSubmitting(false);
    }
  };

  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        return `/preview/properties_rental${path}`;
      }
    }
    return path;
  };

  if (loading) {
    return (
      <div className="pr-section" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .pr-shimmer {
            background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
            background-size: 200% 100%;
            animation: prShimmer 1.5s infinite linear;
          }
          @keyframes prShimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}} />
        <div className="pr-shimmer" style={{ height: '400px', borderRadius: '32px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="pr-shimmer" style={{ height: '40px', width: '60%', borderRadius: '100px' }} />
            <div className="pr-shimmer" style={{ height: '20px', width: '90%', borderRadius: '100px' }} />
            <div className="pr-shimmer" style={{ height: '150px', borderRadius: '24px' }} />
          </div>
          <div className="pr-shimmer" style={{ height: '450px', borderRadius: '32px' }} />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="pr-section text-center" style={{ padding: '8rem 2rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Rental Node Not Resolved</h2>
        <p style={{ color: 'var(--pr-text-muted)', margin: '2rem 0 4rem' }}>The requested residential listing could not be recovered from Sellio registries.</p>
        <button className="pr-btn-primary" onClick={() => router.push(getThemeLink('/'))}>Back to Showroom</button>
      </div>
    );
  }

  return (
    <div className="pr-section">
      {/* Detail Path header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }} className="ev-related-header">
        <button 
          onClick={() => router.push(getThemeLink('/'))}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--pr-slate)',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          &larr; BACK_TO_REGISTRY
        </button>
        <div className="pr-mono" style={{ fontSize: '0.7rem' }}>VERIFIED NODE // {property.slug.toUpperCase()}</div>
      </div>

      {/* Diagnostics Warn overlay */}
      {useFallback && apiError && (
        <div style={{
          background: '#0f172a',
          border: '1px dashed #00d1ff',
          borderLeft: '4px solid #00d1ff',
          padding: '2rem',
          borderRadius: '24px',
          marginBottom: '4rem',
          color: '#f8fafc',
          boxShadow: 'var(--pr-shadow-lg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }} className="pr-mono">
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5a5f', animation: 'pulse 1.5s infinite' }}></span>
            <span style={{ color: '#00d1ff', fontSize: '0.7rem' }}>API_CONNECTION_EXCEPTION_TRACE</span>
          </div>
          <p style={{ margin: '0 0 1rem 0', color: 'var(--pr-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Viewing high-fidelity backup simulation parameters because the live database connection threw a {apiError}. Specifications have loaded safely.
          </p>
        </div>
      )}

      {/* Sprawling Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '6rem', alignItems: 'start' }} className="pr-hero">
        
        {/* Left column details content */}
        <div>
          <div className="pr-hero-image-wrapper" style={{ padding: '1rem', borderRadius: '24px', marginBottom: '4rem' }}>
            <img src={property.image} alt={property.title} className="pr-hero-image" style={{ borderRadius: '16px' }} />
            <div style={{ 
              position: 'absolute', 
              top: '1.5rem', 
              left: '1.5rem', 
              background: 'var(--pr-slate)', 
              color: 'white', 
              padding: '0.6rem 1.5rem', 
              borderRadius: '100px', 
              fontWeight: 900, 
              fontSize: '0.75rem', 
              letterSpacing: '1px'
            }}>
              {property.type.toUpperCase()}
            </div>
            <div style={{ 
              position: 'absolute', 
              bottom: '1.5rem', 
              right: '1.5rem', 
              background: 'var(--pr-white)', 
              padding: '0.6rem 1.5rem', 
              borderRadius: '100px', 
              fontWeight: 800, 
              fontSize: '0.75rem',
              color: 'var(--pr-slate)',
              boxShadow: 'var(--pr-shadow-md)'
            }}>
              ★ {property.rating.toFixed(1)} ({property.reviews} Reviews)
            </div>
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '2rem', lineHeight: 1.15 }}>
            {property.title}
          </h1>

          <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '4rem' }} className="pr-filter-links">
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>🛏️ {property.beds} Bedrooms</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>🚿 {property.baths} Bathrooms</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>📐 {property.sqft} SQFT Area</div>
          </div>

          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--pr-slate)' }}>Node Provenance Profile</h3>
          <p style={{ fontSize: '1.1rem', color: 'var(--pr-text-muted)', lineHeight: 1.8, marginBottom: '5rem' }}>
            {property.description}
          </p>

          {/* Dynamic Technical Specs matrix */}
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--pr-slate)' }}>Specification Matrix</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '6rem' }}>
            {[
              { label: 'PROXIMITY_EXCHANGE', value: property.location },
              { label: 'ANNUAL_HOA_MAPPED', value: `$${property.hoa}/mo` },
              { label: 'YEAR_CONSTRUCTED', value: String(property.year_built) },
              { label: 'SECURITY_NODE_CLASS', value: 'Level 5 SECURE_NODE' },
              { label: 'LEASING_STATUS', value: 'Ready for cryptographic sign' },
              { label: 'UTILITY_COMPATIBILITY', value: 'Automated digital routing' }
            ].map((spec, i) => (
              <div key={i} style={{ padding: '1.5rem 2rem', background: 'var(--pr-white)', borderRadius: '16px', border: '1px solid var(--pr-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="pr-mono" style={{ fontSize: '0.65rem' }}>{spec.label}</span>
                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{spec.value}</span>
              </div>
            ))}
          </div>

          {/* Stateful Monthly Lease calculator for long-term options */}
          <div style={{ background: 'var(--pr-white)', padding: '4rem', borderRadius: '32px', border: '1px solid var(--pr-border)', boxShadow: 'var(--pr-shadow-md)' }}>
            <div className="pr-mono" style={{ marginBottom: '1.5rem' }}>LONG_TERM_LEASE_ESTIMATOR</div>
            <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.5px' }}>Custom Monthly Lease Estimator</h3>
            <p style={{ color: 'var(--pr-text-muted)', fontSize: '0.95rem', marginBottom: '3rem', lineHeight: 1.6 }}>
              Commit to an initial down-payment security reserve and choose your duration profile to dynamically calculate adjustments in your monthly rent.
            </p>

            <div style={{ marginBottom: '3.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, marginBottom: '1rem' }}>
                <span>Security Deposit Reserve</span>
                <span style={{ color: 'var(--pr-mint)' }}>${downPayment.toLocaleString()}</span>
              </div>
              <input 
                type="range"
                min="0"
                max="10000"
                step="500"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--pr-mint)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--pr-text-muted)', marginTop: '0.5rem' }} className="pr-mono">
                <span>$0 (MIN)</span>
                <span>$10,000 (MAX)</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
              <div>
                <label className="pr-booking-label" style={{ marginBottom: '0.8rem', display: 'block' }}>Lease Duration Profile</label>
                <select 
                  className="pr-booking-input" 
                  style={{ width: '100%' }}
                  value={leaseDuration}
                  onChange={(e) => setLeaseDuration(e.target.value)}
                >
                  <option value="6">6 Months Short Lease</option>
                  <option value="12">12 Months Premium Lease</option>
                  <option value="24">24 Months Extended Lease (-$150/mo)</option>
                </select>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className="pr-mono" style={{ fontSize: '0.65rem' }}>ESTIMATED MONTHLY RENT</div>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--pr-slate)', letterSpacing: '-1px', marginTop: '0.5rem' }}>
                  ${calculateLongTermRent().toLocaleString()}
                  <span style={{ fontSize: '1rem', color: 'var(--pr-text-muted)', fontWeight: 700 }}>/mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column booking sidebar card */}
        <div>
          {bookingReceipt ? (
            /* Successful Invoice Receipt */
            <div style={{
              background: '#0f172a',
              border: '2px solid #00d1ff',
              padding: '4rem 3.5rem',
              borderRadius: '32px',
              color: 'white',
              boxShadow: 'var(--pr-shadow-lg)',
              animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <div className="pr-mono" style={{ color: 'var(--pr-mint)', marginBottom: '2rem' }}>LEASING_PROTOCOL_SIGNED</div>
              <h3 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: '1.5rem', color: 'white' }}>Node Secure!</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.6, lineHeight: 1.7, marginBottom: '3rem' }}>
                The cryptographic lease transaction has completed successfully. Your tenant profile has been mapped to {bookingReceipt.propertyTitle}.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2.5rem', marginBottom: '3.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ opacity: 0.4 }} className="pr-mono">TRANSACTION_ID</span>
                  <span style={{ fontWeight: 800, fontFamily: 'monospace' }}>{bookingReceipt.orderId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ opacity: 0.4 }} className="pr-mono">TENANT_NAME</span>
                  <span style={{ fontWeight: 800 }}>{bookingReceipt.tenantName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ opacity: 0.4 }} className="pr-mono">LEASE_TERM</span>
                  <span style={{ fontWeight: 800 }}>{bookingReceipt.leaseDuration}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ opacity: 0.4 }} className="pr-mono">DEPOSIT_RESERVE</span>
                  <span style={{ fontWeight: 800, color: 'var(--pr-mint)' }}>{bookingReceipt.downPaymentPaid}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ opacity: 0.4 }} className="pr-mono">UTILITY_ADDONS</span>
                  <span style={{ fontWeight: 800 }}>{bookingReceipt.utilityAddons.addonsTotal}/mo</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', borderTop: '1px dashed rgba(255,255,255,0.15)', paddingTop: '2rem' }}>
                  <span style={{ fontWeight: 900 }} className="pr-mono">NET_MONTHLY</span>
                  <span style={{ fontWeight: 900, color: 'var(--pr-mint)' }}>{bookingReceipt.netMonthlyTotal}</span>
                </div>
              </div>

              <button 
                className="pr-btn-primary" 
                style={{ width: '100%', padding: '1.5rem' }}
                onClick={() => setBookingReceipt(null)}
              >
                CREATE NEW LEASE NODE
              </button>
            </div>
          ) : (
            /* Stateful Interactive Booking form */
            <div style={{
              background: 'var(--pr-white)',
              border: '1px solid var(--pr-border)',
              padding: '4rem 3.5rem',
              borderRadius: '32px',
              boxShadow: 'var(--pr-shadow-md)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                  <div className="pr-mono" style={{ fontSize: '0.65rem' }}>BASE_LEASE_RATE</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--pr-slate)', letterSpacing: '-1.5px', marginTop: '0.25rem' }}>
                    {property.price}
                    <span style={{ fontSize: '0.9rem', color: 'var(--pr-text-muted)', fontWeight: 700 }}>/mo</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="pr-mono" style={{ fontSize: '0.65rem', color: 'var(--pr-coral)' }}>★ {property.rating.toFixed(1)}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--pr-text-muted)', fontWeight: 700, marginTop: '0.25rem' }}>{property.reviews} Reviews</div>
                </div>
              </div>

              {/* Dynamic Lodging price dates input selector */}
              <div style={{ borderTop: '1px solid var(--pr-border)', borderBottom: '1px solid var(--pr-border)', padding: '2.5rem 0', marginBottom: '3.5rem' }}>
                <h4 className="pr-mono" style={{ fontSize: '0.65rem', marginBottom: '2rem' }}>Lodging / Short-Stay Estimator</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div>
                    <label className="pr-booking-label" style={{ fontSize: '0.65rem', marginBottom: '0.5rem', display: 'block' }}>Check-In</label>
                    <input 
                      type="date"
                      className="pr-booking-input"
                      style={{ width: '100%', padding: '0.6rem 0.8rem' }}
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="pr-booking-label" style={{ fontSize: '0.65rem', marginBottom: '0.5rem', display: 'block' }}>Check-Out</label>
                    <input 
                      type="date"
                      className="pr-booking-input"
                      style={{ width: '100%', padding: '0.6rem 0.8rem' }}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                </div>

                {calculatingPrice ? (
                  <div className="pr-mono" style={{ fontSize: '0.65rem', color: 'var(--pr-mint)' }}>CALCULATING_LODGING_TOTAL...</div>
                ) : lodgingBreakdown ? (
                  <div style={{ background: 'var(--pr-bg)', padding: '1.5rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Short-Stay Total</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--pr-text-muted)' }}>({lodgingBreakdown.total_nights} Nights stay)</div>
                    </div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--pr-mint)' }}>
                      {lodgingBreakdown.estimated_lodging_total}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--pr-text-muted)', fontStyle: 'italic' }}>
                    Select dates to estimate immediate lodging price quote.
                  </div>
                )}
              </div>

              {/* Lease dispatch form */}
              <form onSubmit={handleCheckoutSubmit}>
                <h4 className="pr-mono" style={{ fontSize: '0.65rem', marginBottom: '2rem' }}>Tenant Protocol Identity</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3.5rem' }}>
                  <div>
                    <label className="pr-booking-label" style={{ fontSize: '0.65rem', marginBottom: '0.5rem', display: 'block' }}>Full Name</label>
                    <input 
                      type="text"
                      className="pr-booking-input"
                      style={{ width: '100%', padding: '0.8rem 1.2rem' }}
                      placeholder="e.g. John Doe"
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="pr-booking-label" style={{ fontSize: '0.65rem', marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
                    <input 
                      type="email"
                      className="pr-booking-input"
                      style={{ width: '100%', padding: '0.8rem 1.2rem' }}
                      placeholder="e.g. john@example.com"
                      value={tenantEmail}
                      onChange={(e) => setTenantEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="pr-booking-label" style={{ fontSize: '0.65rem', marginBottom: '0.5rem', display: 'block' }}>Contact Phone</label>
                    <input 
                      type="tel"
                      className="pr-booking-input"
                      style={{ width: '100%', padding: '0.8rem 1.2rem' }}
                      placeholder="e.g. +1 555-0199"
                      value={tenantPhone}
                      onChange={(e) => setTenantPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Optional utilities add-on checkboxes */}
                <h4 className="pr-mono" style={{ fontSize: '0.65rem', marginBottom: '2rem' }}>Bespoke Utility Routing</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '4rem' }}>
                  {[
                    { label: 'Fiber High-Speed Internet', cost: '+$80/mo', active: addFiber, setter: setAddFiber },
                    { label: 'Assigned Security Garage Park', cost: '+$150/mo', active: addParking, setter: setAddParking },
                    { label: 'Valet Trash Collection Node', cost: '+$35/mo', active: addValet, setter: setAddValet }
                  ].map((addon, i) => (
                    <label key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '1rem 1.5rem', border: '1px solid var(--pr-border)', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <input 
                          type="checkbox"
                          checked={addon.active}
                          onChange={(e) => addon.setter(e.target.checked)}
                          style={{ accentColor: 'var(--pr-mint)', width: '16px', height: '16px' }}
                        />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{addon.label}</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--pr-mint)' }}>{addon.cost}</span>
                    </label>
                  ))}
                </div>

                <button 
                  type="submit"
                  className="pr-btn-primary"
                  style={{ width: '100%', padding: '1.8rem', borderRadius: '16px', fontSize: '1rem' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'AUTHORIZING CRYPTO SIGN...' : '⚡ CONFIRM LEASE SIGN PROTOCOL'}
                </button>
              </form>
            </div>
          )}
        </div>

      </div>

      {/* Suggested related rental nodes carousel */}
      <section style={{ marginTop: '12rem' }} id="pr-discovery-grid">
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-1.5px' }}>Suggested Residential Nodes</h2>
        <p style={{ color: 'var(--pr-text-muted)', marginBottom: '4rem' }}>Alternative verified properties matching active profile categories.</p>
        
        <div className="pr-rent-grid">
          {related.map((r, i) => (
            <LeaseUnitCard 
              key={i} 
              {...r} 
              onClick={() => {
                setBookingReceipt(null);
                setCheckIn('');
                setCheckOut('');
                router.push(getThemeLink(`/product/${r.slug}`));
              }}
            />
          ))}
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
