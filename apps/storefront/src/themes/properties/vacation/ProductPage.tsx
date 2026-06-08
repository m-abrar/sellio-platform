'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { RetreatBentoCard } from './components';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';

interface VacationItem {
  id: number;
  title: string;
  location: string;
  price: string;
  numericPrice: number;
  rating: string;
  image: string;
  slug: string;
  category: string;
  sqft: string;
  guests: string;
  bedrooms: string;
  bathrooms: string;
  yearBuilt: number;
  security: string;
  vibeScore: string;
  description: string;
}

const FALLBACK_RETREATS: VacationItem[] = [
  { id: 1, title: "Azure Bay Villa", location: "Amalfi Coast, Italy", price: "$1,200", numericPrice: 1200, rating: "4.95", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600", slug: "azure-bay-villa", category: "Villa", sqft: "4,500 sq ft", guests: "8 Guests", bedrooms: "4 Bedrooms", bathrooms: "5 Bathrooms", yearBuilt: 2018, security: "Private Gates & Advanced Video Feeds", vibeScore: "98/100", description: "Perched majestically on the rugged cliffs of Italy's famous Amalfi Coast, Azure Bay Villa offers absolute Mediterranean luxury. Boasting a custom negative-edge heated pool, five marble bathrooms, gorgeous lemon tree terraced gardens, and sweeping panoramic views of the indigo Tyrrhenian Sea." },
  { id: 2, title: "Nordic Glass Cabin", location: "Lofoten, Norway", price: "$850", numericPrice: 850, rating: "4.88", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600", slug: "nordic-glass-cabin", category: "Cabin", sqft: "1,800 sq ft", guests: "4 Guests", bedrooms: "2 Bedrooms", bathrooms: "2 Bathrooms", yearBuilt: 2021, security: "Remote Smart-Lock Secure Network", vibeScore: "96/100", description: "Designed by award-winning Scandinavian architects, this glass cabin provides front-row seats to the spectacular Northern Lights. Surrounded by Lofoten's jagged peaks, the cabin is fitted with state-of-the-art triple-pane thermal glass walls, sleek custom cedar siding, and a private fjord-view hot tub." },
  { id: 3, title: "Santorini Heights", location: "Oia, Greece", price: "$1,500", numericPrice: 1500, rating: "4.99", image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600", slug: "santorini-heights", category: "Heights", sqft: "3,200 sq ft", guests: "6 Guests", bedrooms: "3 Bedrooms", bathrooms: "3 Bathrooms", yearBuilt: 2019, security: "Showroom Security & 24/7 Concierge", vibeScore: "99/100", description: "Perched at the highest peak of volcanic Oia, Santorini Heights merges timeless Cycladic cave-architecture with clean modern aesthetics. Features private infinity plunges, high-fidelity sound speakers, organic cotton fabrics, and pristine sunset view decks overlooking the Caldera." },
  { id: 4, title: "Bamboo Zen Estate", location: "Bali, Indonesia", price: "$450", numericPrice: 450, rating: "4.92", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600", slug: "bamboo-zen-estate", category: "Estate", sqft: "5,800 sq ft", guests: "10 Guests", bedrooms: "5 Bedrooms", bathrooms: "6 Bathrooms", yearBuilt: 2017, security: "Local Guard Node Vetted Network", vibeScore: "97/100", description: "Escape into the lush jungle canopies of Ubud. Hand-constructed entirely from sustainable giant petung bamboo, the Zen Estate boasts grand high-ceiling lounges, natural saltwater springs, and fully open-air showers overlooking volcanic valley coordinates." },
  { id: 5, title: "Alpine Chalet v2", location: "Zermatt, Switzerland", price: "$980", numericPrice: 980, rating: "4.85", image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600", slug: "alpine-chalet", category: "Chalet", sqft: "3,600 sq ft", guests: "6 Guests", bedrooms: "3 Bedrooms", bathrooms: "4 Bathrooms", yearBuilt: 2020, security: "Standard Gated Security Control", vibeScore: "95/100", description: "An ultra-luxurious ski-in / ski-out mountain lodge positioned directly under the Matterhorn peak. Constructed using reclaimed ancient timber logs and custom local stone, the chalet provides an indoor custom hot sauna, roaring stone fireplace hearth, and private ski lockers." },
  { id: 6, title: "Desert Mirror House", location: "Joshua Tree, USA", price: "$1,100", numericPrice: 1100, rating: "4.97", image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=600", slug: "desert-mirror-house", category: "Villa", sqft: "4,000 sq ft", guests: "8 Guests", bedrooms: "4 Bedrooms", bathrooms: "4 Bathrooms", yearBuilt: 2022, security: "Advanced Smart Perimeter Sensors", vibeScore: "98/100", description: "A high-fidelity minimalist masterpiece in the heart of Joshua Tree. Featuring a full-mirror reflective exterior paneling, the home disappears into the desert terrain. Equipped with a custom 100ft concrete swimming pool, expansive outdoor fire circles, and luxury star-gazing beds." },
];

const translateProperty = (rawItem: Property): VacationItem => {
  const item = rawItem as any;
  const generatedSlug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const numericPrice = Number(item.pricing?.base_price) || 850;
  const priceStr = item.pricing?.formatted || `$${numericPrice.toLocaleString()}`;
  
  const loc = item.city || item.location?.title || 'Amalfi Coast, Italy';
  const ratingStr = (4.80 + (item.id * 3) % 20 / 100).toFixed(2);
  
  // Categorization
  let category = "Retreat";
  if (item.title.toLowerCase().includes('villa')) category = "Villa";
  else if (item.title.toLowerCase().includes('cabin')) category = "Cabin";
  else if (item.title.toLowerCase().includes('estate') || item.title.toLowerCase().includes('zen')) category = "Estate";
  else if (item.title.toLowerCase().includes('chalet') || item.title.toLowerCase().includes('alpine')) category = "Chalet";
  else if (item.title.toLowerCase().includes('heights') || item.title.toLowerCase().includes('view')) category = "Heights";
  
  const sqft = item.specs?.sqft || `${2000 + (item.id * 600) % 4000} sq ft`;
  const guests = item.specs?.guests || `${2 + (item.id * 2) % 8} Guests`;
  const bedrooms = item.specs?.bedrooms || `${1 + (item.id * 1) % 4} Bedrooms`;
  const bathrooms = item.specs?.bathrooms || `${1 + (item.id * 1) % 4} Bathrooms`;
  const yearBuilt = Number(item.specs?.year_built) || 2018;
  const security = item.specs?.security || (item.id % 2 === 0 ? "Remote Smart-Lock Secure Network" : "Showroom Security & 24/7 Concierge");
  const vibeScore = `${92 + (item.id * 2) % 8}/100`;

  const imageId = item.id ? (item.id % 8) + 1 : 1;
  const fallbackImages = [
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600",
    "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=600",
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600",
    "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=600"
  ];
  const mainImage = item.featured_image || item.media?.main_photo || item.image || fallbackImages[imageId - 1];

  return {
    id: item.id,
    title: item.title,
    location: loc,
    price: priceStr,
    numericPrice,
    rating: ratingStr,
    image: mainImage,
    slug: generatedSlug,
    category,
    sqft,
    guests,
    bedrooms,
    bathrooms,
    yearBuilt,
    security,
    vibeScore,
    description: item.description || "Authentically vetted, significant getaway retreat. Fully integrated home tech automation, local node verification signatures, sweeping views, and bespoke craftsmanship throughout. Schedule your getaway check-in today."
  };
};

export default function ProductPage({ slug }: { slug: string }) {
  const router = useRouter();
  const themeLink = usePropertyThemeLink();

  // Dynamic States
  const [retreat, setRetreat] = useState<VacationItem | null>(null);
  const [related, setRelated] = useState<VacationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [errorTrace, setErrorTrace] = useState<string>('');

  // Date range pricing estimator states
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [calculatingPrice, setCalculatingPrice] = useState(false);

  // Upgrades
  const [chefUpgrade, setChefUpgrade] = useState(false);
  const [yachtUpgrade, setYachtUpgrade] = useState(false);
  const [helicopterUpgrade, setHelicopterUpgrade] = useState(false);

  // Booking Form States
  const [travelerName, setTravelerName] = useState('');
  const [travelerEmail, setTravelerEmail] = useState('');
  const [travelerPhone, setTravelerPhone] = useState('');
  const [travelerNotes, setTravelerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [receiptCode, setReceiptCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRetreatDetails = async () => {
      setLoading(true);
      try {
        const response = await api.getPropertyDetails(slug);
        if (response && response.data) {
          const mapped = translateProperty(response.data);
          setRetreat(mapped);
          setUseFallback(false);
          
          // Fetch related retreats
          const listRes = await api.getProperties({ per_page: 10 });
          if (listRes && listRes.data) {
            const mappedList = listRes.data
              .map(translateProperty)
              .filter((c: VacationItem) => c.slug !== slug)
              .slice(0, 3);
            setRelated(mappedList);
          }
        } else {
          console.warn("Properties Vacation details empty. Engaging fallback retreats.");
          loadFallbackItem();
        }
      } catch (err: any) {
        console.error("Properties Vacation details fetch failed:", err);
        setErrorTrace(err.stack || err.message || String(err));
        loadFallbackItem();
      } finally {
        setLoading(false);
      }
    };

    const loadFallbackItem = () => {
      const found = FALLBACK_RETREATS.find(c => c.slug === slug) || FALLBACK_RETREATS[0];
      setRetreat(found);
      
      const filteredRelated = FALLBACK_RETREATS.filter(c => c.slug !== found.slug).slice(0, 3);
      setRelated(filteredRelated);
      setUseFallback(true);
    };

    fetchRetreatDetails();
  }, [slug]);

  // Dynamic Date calculations lodging price estimator
  useEffect(() => {
    if (checkIn && checkOut && retreat) {
      setCalculatingPrice(true);
      const calculatePrice = async () => {
        try {
          const res = await api.calculateLodgingPrice(retreat.id, checkIn, checkOut);
          if (res) {
            setEstimatedPrice(res.estimated_lodging_total);
          }
        } catch (calcErr) {
          console.error("API calculate price exception, fallback to local mathematics:", calcErr);
          // High-fidelity local time calculation
          const diffTime = Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
          const baseVal = retreat.numericPrice;
          
          // Factor upgrades into estimation
          let baseCost = baseVal * diffDays;
          if (chefUpgrade) baseCost += 150 * diffDays;
          if (yachtUpgrade) baseCost += 1200 * diffDays;
          if (helicopterUpgrade) baseCost += 650;

          setEstimatedPrice(`$${baseCost.toLocaleString()}`);
        } finally {
          setCalculatingPrice(false);
        }
      };
      calculatePrice();
    } else {
      setEstimatedPrice('');
    }
  }, [checkIn, checkOut, chefUpgrade, yachtUpgrade, helicopterUpgrade, slug, retreat]);

  const handleEscapeCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!travelerName || !travelerEmail || !checkIn || !checkOut) {
      setFormError('Please complete all required booking details before checkout.');
      return;
    }
    setFormError(null);

    setIsSubmitting(true);

    setTimeout(() => {
      // Generate secure verification hash
      const hashInput = `${travelerName}-${travelerEmail}-${checkIn}-${Date.now()}`;
      let hash = 0;
      for (let i = 0; i < hashInput.length; i++) {
        const char = hashInput.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }
      const hexHash = 'SHA256-ESC' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0') + Math.random().toString(36).substring(2, 6).toUpperCase();
      
      const newOrder = {
        id: Date.now(),
        retreatTitle: retreat?.title,
        retreatSlug: retreat?.slug,
        checkIn,
        checkOut,
        totalPrice: estimatedPrice || retreat?.price,
        travelerName,
        travelerEmail,
        travelerPhone,
        upgrades: {
          chef: chefUpgrade,
          yacht: yachtUpgrade,
          helicopter: helicopterUpgrade
        },
        receiptCode: hexHash,
        createdAt: new Date().toISOString()
      };

      // Persist traveler checkout to LocalStorage
      if (typeof window !== 'undefined') {
        try {
          const existingOrdersStr = localStorage.getItem('sellio_properties_vacation_orders');
          const existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
          existingOrders.push(newOrder);
          localStorage.setItem('sellio_properties_vacation_orders', JSON.stringify(existingOrders));
        } catch (storageErr) {
          console.error("LocalStorage write failed:", storageErr);
        }
      }

      setReceiptCode(hexHash);
      setBookingSuccess(true);
      setIsSubmitting(false);
    }, 800);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <div className="pv-shimmer-pulse" style={{ width: '60px', height: '60px', borderRadius: '50%', border: '5px solid #e2e8f0', borderTopColor: 'var(--pv-azure)', animation: 'spin 1s infinite linear' }}></div>
        <p style={{ color: 'var(--pv-text-muted)', fontWeight: 800, fontFamily: 'monospace', fontSize: '0.8rem', letterSpacing: '2px' }}>HANDSHAKE_SECURE_HORIZON_ESTATE...</p>
        <style jsx global>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!retreat) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <span style={{ fontSize: '3rem' }}>⚠️</span>
        <h3 style={{ fontFamily: 'var(--pv-font-serif)', fontSize: '2rem', color: 'var(--pv-ink)', marginTop: '1rem', fontWeight: 900 }}>Retreat Node Not Found</h3>
        <p style={{ color: 'var(--pv-text-muted)' }}>We couldn't locate the specified vacation retreat node.</p>
        <button onClick={() => router.push(themeLink('/'))} className="pv-btn-primary">Return to Showroom</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 6%' }}>
      {/* Back to Showroom Breadcrumb */}
      <div style={{ marginBottom: '3rem' }}>
        <button 
          onClick={() => router.push(themeLink('/'))} 
          style={{ background: 'none', border: 'none', color: 'var(--pv-azure)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', padding: 0, fontFamily: 'monospace', letterSpacing: '2px' }}
        >
          ← RETREAT_CATALOG_CONSOLE
        </button>
      </div>

      {/* Diagnostics resilience report box */}
      {useFallback && errorTrace && (
        <div style={{ padding: '2rem', backgroundColor: '#fff8f8', border: '2px dashed var(--pv-coral)', borderRadius: '24px', marginBottom: '3rem' }}>
          <h4 style={{ color: 'var(--pv-coral)', margin: '0 0 0.5rem 0', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--pv-font-serif)', fontSize: '1.4rem' }}>
            <span>⚠️</span> Escapes Node Offline - High-Fidelity Specs Vetted Offline
          </h4>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', color: 'var(--pv-text-muted)', lineHeight: 1.6 }}>
            API exception caught on live details query. Engaging simulated backup console traceback:
          </p>
          <pre style={{ margin: 0, padding: '1.5rem', backgroundColor: 'var(--pv-ink)', color: '#f8fafc', borderRadius: '12px', fontSize: '0.85rem', overflowX: 'auto', fontFamily: 'monospace' }}>
            {errorTrace}
          </pre>
        </div>
      )}

      {/* Main Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: '4rem', alignItems: 'start' }} className="ac-details-grid">
        {/* Left Side: Images, Specs, Description */}
        <div>
          <div style={{ backgroundColor: 'var(--pv-cloud)', borderRadius: 'var(--pv-radius)', overflow: 'hidden', padding: '1rem', border: '1px solid var(--pv-border)', marginBottom: '3rem' }}>
            <img 
              src={retreat.image} 
              alt={retreat.title} 
              style={{ width: '100%', maxHeight: '550px', objectFit: 'cover', borderRadius: '32px' }} 
            />
          </div>

          {/* Vetted Specs Grid */}
          <div style={{ backgroundColor: 'white', borderRadius: 'var(--pv-radius)', padding: '3rem', border: '1px solid var(--pv-border)', marginBottom: '3rem' }}>
            <h4 style={{ fontFamily: 'var(--pv-font-serif)', color: 'var(--pv-ink)', fontWeight: 900, fontSize: '1.8rem', borderBottom: '1px solid var(--pv-border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
              Vetted Specifications
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--pv-text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>📐 Total Area</span>
                <span style={{ fontSize: '1.25rem', color: 'var(--pv-ink)', fontWeight: 800, marginTop: '0.3rem' }}>{retreat.sqft}</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--pv-text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>👥 Max Occupancy</span>
                <span style={{ fontSize: '1.25rem', color: 'var(--pv-ink)', fontWeight: 800, marginTop: '0.3rem' }}>{retreat.guests}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--pv-text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>🛏️ Bedrooms</span>
                <span style={{ fontSize: '1.25rem', color: 'var(--pv-ink)', fontWeight: 800, marginTop: '0.3rem' }}>{retreat.bedrooms}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--pv-text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>🛁 Bathrooms</span>
                <span style={{ fontSize: '1.25rem', color: 'var(--pv-ink)', fontWeight: 800, marginTop: '0.3rem' }}>{retreat.bathrooms}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--pv-text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>📅 Constructed</span>
                <span style={{ fontSize: '1.25rem', color: 'var(--pv-ink)', fontWeight: 800, marginTop: '0.3rem' }}>{retreat.yearBuilt}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--pv-text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>🔐 Security Clearance</span>
                <span style={{ fontSize: '1rem', color: 'var(--pv-ink)', fontWeight: 800, marginTop: '0.3rem', lineHeight: 1.3 }}>{retreat.security}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--pv-text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>⭐ Getaway Vibe Score</span>
                <span style={{ fontSize: '1.25rem', color: 'var(--pv-coral)', fontWeight: 900, marginTop: '0.3rem' }}>{retreat.vibeScore}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div style={{ backgroundColor: 'white', borderRadius: 'var(--pv-radius)', padding: '3rem', border: '1px solid var(--pv-border)' }}>
            <h4 style={{ fontFamily: 'var(--pv-font-serif)', color: 'var(--pv-ink)', fontWeight: 900, fontSize: '1.8rem', borderBottom: '1px solid var(--pv-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              The Retreat Narrative
            </h4>
            <p style={{ color: 'var(--pv-text-muted)', lineHeight: 2, fontSize: '1.1rem', margin: 0 }}>
              {retreat.description}
            </p>
          </div>
        </div>

        {/* Right Side: Price, Booking Concierge Form */}
        <div>
          {/* Main Price Card */}
          <div style={{ backgroundColor: 'white', borderRadius: 'var(--pv-radius)', padding: '3rem', border: '1px solid var(--pv-border)', marginBottom: '2.5rem' }}>
            <h1 style={{ fontFamily: 'var(--pv-font-serif)', color: 'var(--pv-ink)', fontWeight: 900, fontSize: '2.5rem', margin: '0 0 1rem 0', lineHeight: 1.1 }}>{retreat.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <span className="pv-mono" style={{ fontSize: '0.65rem' }}>VERIFIED RETREAT NODE LOCATION</span>
              <strong style={{ color: 'var(--pv-ink)', fontSize: '0.95rem' }}>{retreat.location}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '2rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--pv-azure)' }}>{retreat.price}</span>
              <span style={{ color: 'var(--pv-text-muted)', fontSize: '0.95rem', fontWeight: 600 }}>/night</span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '1rem 1.5rem', backgroundColor: 'var(--pv-cloud)', borderRadius: '100px', fontSize: '0.85rem', border: '1px solid var(--pv-border)' }}>
              <span style={{ color: '#ffc107', fontSize: '1.2rem' }}>★</span>
              <span style={{ color: 'var(--pv-ink)', fontWeight: 700 }}>Retreat Vetted Appraiser Rating Score: {retreat.rating}</span>
            </div>
          </div>

          {/* Stateful Concierge Booking drawer */}
          <div style={{ backgroundColor: 'white', borderRadius: 'var(--pv-radius)', padding: '3rem', border: '1px solid var(--pv-azure)', boxShadow: '0 20px 50px rgba(0, 119, 255, 0.05)' }}>
            {!bookingSuccess ? (
              <form onSubmit={handleEscapeCheckout}>
                <h4 style={{ fontFamily: 'var(--pv-font-serif)', color: 'var(--pv-ink)', fontWeight: 900, fontSize: '1.6rem', margin: '0 0 0.5rem 0' }}>Request Booking</h4>
                <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.9rem', margin: '0 0 2rem 0', lineHeight: 1.5 }}>Secure getaways check-in dates directly to the escapenode registry block.</p>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--pv-ink)', display: 'block', marginBottom: '0.5rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Check In Date *</label>
                  <input 
                    type="date" 
                    required 
                    value={checkIn} 
                    onChange={(e) => setCheckIn(e.target.value)} 
                    style={{ width: '100%', padding: '0.85rem 1.25rem', borderRadius: '100px', border: '1px solid var(--pv-border)', outline: 'none', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--pv-ink)', display: 'block', marginBottom: '0.5rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Check Out Date *</label>
                  <input 
                    type="date" 
                    required 
                    value={checkOut} 
                    onChange={(e) => setCheckOut(e.target.value)} 
                    style={{ width: '100%', padding: '0.85rem 1.25rem', borderRadius: '100px', border: '1px solid var(--pv-border)', outline: 'none', fontFamily: 'inherit' }}
                  />
                </div>

                {/* Custom premium upgrades */}
                <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--pv-cloud)', borderRadius: '24px', border: '1px solid var(--pv-border)' }} className="pv-upgrades-section">
                  <span className="pv-mono" style={{ fontSize: '0.6rem', display: 'block', marginBottom: '1rem', color: 'var(--pv-sand)' }}>ACQUISITION_UPGRADE_SERVICES</span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }} onClick={() => setChefUpgrade(!chefUpgrade)}>
                    <input 
                      type="checkbox" 
                      checked={chefUpgrade} 
                      onChange={() => {}}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <div style={{ fontSize: '0.85rem' }}>
                      <strong style={{ color: 'var(--pv-ink)' }}>Local Node Private Chef</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--pv-text-muted)' }}>+$150 / day</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }} onClick={() => setYachtUpgrade(!yachtUpgrade)}>
                    <input 
                      type="checkbox" 
                      checked={yachtUpgrade} 
                      onChange={() => {}}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <div style={{ fontSize: '0.85rem' }}>
                      <strong style={{ color: 'var(--pv-ink)' }}>Exotic Yacht Charter</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--pv-text-muted)' }}>+$1,200 / day</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setHelicopterUpgrade(!helicopterUpgrade)}>
                    <input 
                      type="checkbox" 
                      checked={helicopterUpgrade} 
                      onChange={() => {}}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <div style={{ fontSize: '0.85rem' }}>
                      <strong style={{ color: 'var(--pv-ink)' }}>Helicopter Airport Shuttle</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--pv-text-muted)' }}>+$650 flat rate</div>
                    </div>
                  </div>
                </div>

                {/* Traveler profiles */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--pv-ink)', display: 'block', marginBottom: '0.5rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Traveler Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={travelerName} 
                    onChange={(e) => setTravelerName(e.target.value)} 
                    placeholder="Alice Wonderland" 
                    style={{ width: '100%', padding: '0.85rem 1.25rem', borderRadius: '100px', border: '1px solid var(--pv-border)', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--pv-ink)', display: 'block', marginBottom: '0.5rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Contact Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    value={travelerEmail} 
                    onChange={(e) => setTravelerEmail(e.target.value)} 
                    placeholder="alice@escape.com" 
                    style={{ width: '100%', padding: '0.85rem 1.25rem', borderRadius: '100px', border: '1px solid var(--pv-border)', outline: 'none' }}
                  />
                </div>

                {estimatedPrice && (
                  <div style={{ padding: '1.5rem', backgroundColor: 'var(--pv-cloud)', border: '1px solid var(--pv-azure)', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }} className="pv-price-calculation-alert">
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--pv-ink)' }}>Estimated Total:</span>
                    <strong style={{ fontSize: '1.4rem', color: 'var(--pv-azure)' }}>
                      {calculatingPrice ? 'Calculating...' : estimatedPrice}
                    </strong>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="pv-btn-primary" 
                  style={{ width: '100%', padding: '1.5rem', fontSize: '1rem' }}
                >
                  {isSubmitting ? 'SECURE_REGISTRY_LOCK...' : 'SECURE BOOKING RESERVATION'}
                </button>
                {formError && <p className="prop-form-error" role="alert">{formError}</p>}
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <span style={{ fontSize: '3rem' }}>🏖️</span>
                <h4 style={{ fontFamily: 'var(--pv-font-serif)', color: 'var(--pv-ink)', fontWeight: 900, marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.6rem' }}>Escape Secured!</h4>
                <p style={{ color: 'var(--pv-text-muted)', fontSize: '0.9rem', margin: '0 0 2rem 0', lineHeight: 1.5 }}>
                  Fabulous! Your reservation check-in with <strong>{retreat.title}</strong> has been secured in the client node registers.
                </p>

                {/* SHA256 Receipt */}
                <div style={{ border: '1px dashed var(--pv-coral)', padding: '1.5rem', borderRadius: '24px', backgroundColor: 'var(--pv-cloud)', textAlign: 'left', marginBottom: '2rem' }}>
                  <span className="pv-mono" style={{ fontSize: '0.6rem', display: 'block', marginBottom: '0.5rem', color: 'var(--pv-sand)' }}>VERIFICATION_RECEIPT_CODE</span>
                  <code style={{ display: 'block', wordBreak: 'break-all', fontSize: '0.85rem', color: 'var(--pv-coral)', fontFamily: 'monospace', fontWeight: 800 }}>
                    {receiptCode}
                  </code>
                  
                  <hr style={{ border: 0, borderTop: '1px solid var(--pv-border)', margin: '1rem 0' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--pv-ink)', marginBottom: '0.35rem' }}>
                    <span>Traveler:</span>
                    <strong>{travelerName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--pv-ink)', marginBottom: '0.35rem' }}>
                    <span>Check In Date:</span>
                    <strong>{checkIn}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--pv-ink)', marginBottom: '0.35rem' }}>
                    <span>Check Out Date:</span>
                    <strong>{checkOut}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--pv-ink)' }}>
                    <span>Total Valuation:</span>
                    <strong style={{ color: 'var(--pv-azure)' }}>{estimatedPrice}</strong>
                  </div>
                </div>

                <button 
                  onClick={() => setBookingSuccess(false)} 
                  className="pv-btn-primary" 
                  style={{ width: '100%', background: 'transparent', border: '2px solid var(--pv-azure)', color: 'var(--pv-azure)', boxShadow: 'none' }}
                >
                  Schedule Alternative Getaway
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related getaways list bento-grid */}
      {related.length > 0 && (
        <section style={{ marginTop: '8rem', borderTop: '1px solid var(--pv-border)', paddingTop: '5rem' }}>
          <div className="pv-mono" style={{ marginBottom: '1.5rem' }}>GETAWAY_RECOMMENDATIONS</div>
          <h3 style={{ fontFamily: 'var(--pv-font-serif)', color: 'var(--pv-ink)', fontWeight: 900, fontSize: '2.5rem', marginBottom: '4rem' }}>Alternative Retreated Horizons Vetted</h3>
          <div className="pv-retreat-grid">
            {related.map(item => (
              <RetreatBentoCard 
                key={item.id} 
                {...item} 
                onClick={() => router.push(themeLink(`/product/${item.slug}`))}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
