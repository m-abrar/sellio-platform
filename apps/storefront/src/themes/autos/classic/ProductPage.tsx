'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Vehicle } from '@sellio/types';
import { ClassicCarCard } from './components';
import { CatalogSyncAlert } from '@/themes/autos/shared/CatalogSyncAlert';
import { fetchVehicleDetail, resolveVehicleFailure } from '@/themes/autos/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/autos/shared/useDemoFallbackAllowed';
import { submitVehicleInquiry } from '@/themes/autos/shared/submit-vehicle-inquiry';
import { useAutosThemeLink } from '@/themes/autos/shared/useAutosThemeLink';

interface ClassicCarItem {
  id: number;
  title: string;
  desc: string;
  price: string;
  numericPrice: number;
  image: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  transmission: string;
  engine: string;
  bodyStyle: string;
  extColor: string;
  intColor: string;
  appraisalScore: string;
  description: string;
  dealer: string;
  location: string;
}

const FALLBACK_CARS: ClassicCarItem[] = [
  { id: 1, title: "1965 Ford Mustang Convertible", desc: "1965 Manual | V8 Engine", price: "$45,000", numericPrice: 45000, image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=600", slug: "1965-ford-mustang", make: "Ford", model: "Mustang", year: 1965, transmission: "4-Speed Manual", engine: "289 cubic inch (4.7L) V8", bodyStyle: "Convertible", extColor: "Wimbledon White", intColor: "Red Luxury Vinyl", appraisalScore: "94/100", dealer: "Classic Motors Showroom", location: "New York", description: "This classic Wimbledon White 1965 Mustang convertible represents American automotive history at its absolute finest. Features a meticulously restored 289 cubic-inch V8 engine, period-correct red luxury vinyl seating, smooth-shifting 4-speed manual gearbox, and functional white drop-top canvas. Documented history, pristine interior, and runs beautifully." },
  { id: 2, title: "1970 Porsche 911 T", desc: "1970 Manual | Rally-Ready Flat-6", price: "$120,000", numericPrice: 120000, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600", slug: "1970-porsche-911", make: "Porsche", model: "911", year: 1970, transmission: "5-Speed Manual", engine: "2.2L Flat-Six Cylinder", bodyStyle: "Coupe", extColor: "Guards Red", intColor: "Black Leatherette", appraisalScore: "96/100", dealer: "Stuttgart Heritage", location: "Los Angeles", description: "Rally-ready, matching numbers 1970 Porsche 911 T Coupe finished in classic Guards Red. Power comes from its highly original 2.2-liter air-cooled flat-six engine paired with a 5-speed manual transaxle. Equipped with period-correct Fuchs wheels, custom auxiliary driving spotlights, and a fully restored black cockpit cabin. An investible classic ready for rally events or concours showcases." },
  { id: 3, title: "1961 Jaguar E-Type Coupe", desc: "1961 Manual | Series 1 Restored", price: "$185,000", numericPrice: 185000, image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600", slug: "1961-jaguar-etype", make: "Jaguar", model: "E-Type", year: 1961, transmission: "4-Speed Manual", engine: "3.8L Inline-Six Cylinder", bodyStyle: "Coupe", extColor: "British Racing Green", intColor: "Tan Leather", appraisalScore: "98/100", dealer: "Coventry Vintage", location: "Chicago", description: "Meticulously restored early Series 1 flat-floor Jaguar E-Type Coupe. Finished in gorgeous British Racing Green over premium biscuit tan leather hides. Features the famous 3.8-liter inline-six cylinder engine with triple SU carburetors, original aluminum center console, bucket seats, and beautiful chrome wire wheels. Extensively detailed nut-and-bolt restoration with full certificates." },
  { id: 4, title: "1955 Mercedes-Benz 300 SL", desc: "1955 Manual | Iconic Gullwing Coupe", price: "$1,500,000", numericPrice: 1500000, image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600", slug: "1955-mercedes-300sl", make: "Mercedes-Benz", model: "300 SL", year: 1955, transmission: "4-Speed Manual", engine: "3.0L Fuel-Injected M186 I6", bodyStyle: "Gullwing Coupe", extColor: "Silver Metallic", intColor: "Blue Plaid Cloth", appraisalScore: "99/100", dealer: "Mercedes Classic Center", location: "Dallas", description: "Extremely rare and highly original 1955 Mercedes-Benz 300 SL Gullwing Coupe. Legendary silver metallic finish over correct blue plaid fabric and blue leather bolsters. Powered by the ground-breaking 3.0-liter direct fuel-injected inline-six engine and 4-speed manual transmission. A single-owner pedigree, matching numbers, and museum-grade preservation." },
];

const translateVehicle = (rawItem: Vehicle): ClassicCarItem => {
  const item = rawItem as any;
  const generatedSlug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const numericPrice = Number(item.pricing?.base_price) || 45000;
  const priceStr = item.pricing?.formatted || `$${numericPrice.toLocaleString()}`;
  
  const year = Number(item.specs?.year) || 1965;
  const make = item.specs?.make || item.title.split(' ')[0] || 'Unknown';
  const model = item.specs?.model || item.title.split(' ').slice(1).join(' ') || 'Collector Series';
  
  const transmission = item.specs?.transmission || "4-Speed Manual";
  const engine = item.specs?.engine || "V8 Engine";
  
  // Deterministic vintage details based on ID
  const bodyStyles = ["Coupe", "Convertible", "Sedan", "Roadster"];
  const extColors = ["Guards Red", "Wimbledon White", "British Racing Green", "Silver Metallic", "Deep Indigo Blue"];
  const intColors = ["Tan Leather", "Red Luxury Vinyl", "Black Leatherette", "Blue Plaid Cloth"];
  const appraisalScores = ["92/100", "94/100", "95/100", "97/100", "99/100"];

  const bodyStyle = item.specs?.body_style || bodyStyles[item.id % 4];
  const extColor = item.specs?.exterior_color || extColors[item.id % 5];
  const intColor = item.specs?.interior_color || intColors[item.id % 4];
  const appraisalScore = item.specs?.appraisal_score || appraisalScores[item.id % 5];
  
  const descStr = `${year} ${transmission} | ${engine}`;
  const loc = item.city || item.location?.title || 'New York';
  const dealerName = item.dealer?.name || item.dealer_name || item.company?.title || 'Classic Motors Showroom';

  const imageId = item.id ? (item.id % 8) + 1 : 1;
  const fallbackImages = [
    "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=600",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=600",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600",
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600",
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600"
  ];
  const mainImage = item.featured_image || item.media?.main_photo || item.image || fallbackImages[imageId - 1];

  return {
    id: item.id,
    title: item.title.startsWith('19') || item.title.startsWith('20') ? item.title : `${year} ${item.title}`,
    desc: descStr,
    price: priceStr,
    numericPrice,
    image: mainImage,
    slug: generatedSlug,
    make,
    model,
    year,
    transmission,
    engine,
    bodyStyle,
    extColor,
    intColor,
    appraisalScore,
    location: loc,
    dealer: dealerName,
    description: item.description || "Beautiful and rigorously vetted vintage masterpiece. Certified matching numbers, authenticated history profile, clean title, and collector-grade maintenance records. Truly a rolling investment ready for showcases."
  };
};

export default function ProductPage({ slug }: { slug: string }) {
  const router = useRouter();
  const themeLink = useAutosThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  // Dynamic States
  const [car, setCar] = useState<ClassicCarItem | null>(null);
  const [related, setRelated] = useState<ClassicCarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Bid forms states
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [receiptCode, setReceiptCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVehicle() {
      setLoading(true);
      const result = await fetchVehicleDetail(slug);

      if (result.ok) {
        setCar(translateVehicle(result.response.data));
        const relatedRaw = result.response.related_vehicles || [];
        setRelated(
          relatedRaw
            .map(translateVehicle)
            .filter((item) => item.slug !== slug)
            .slice(0, 3),
        );
        setUseFallback(false);
        setApiError(null);
      } else {
        setApiError(result.error);
        const resolution = resolveVehicleFailure(slug, allowDemo, 'classic');

        if (resolution.mode === 'demo') {
          setCar(translateVehicle(resolution.vehicle));
          setRelated(resolution.related.map(translateVehicle));
          setUseFallback(true);
        } else {
          setCar(null);
          setRelated([]);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadVehicle();
  }, [slug, allowDemo]);

  const handleCollectorInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!car || !clientName || !clientEmail || !offerPrice) {
      setFormError('Please fill in name, email, and your offer amount.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    const formattedOffer = offerPrice.startsWith('$')
      ? offerPrice
      : `$${Number(offerPrice).toLocaleString()}`;
    const inquiryMessage = [
      `Offer: ${formattedOffer}`,
      clientNotes.trim(),
    ]
      .filter(Boolean)
      .join('\n');

    const result = await submitVehicleInquiry({
      vehicleId: car.id,
      vehicleSlug: car.slug,
      useFallback,
      storageKey: 'sellio_autos_classic_orders',
      fullName: clientName,
      email: clientEmail,
      phone: clientPhone,
      message: inquiryMessage,
      demoRecord: {
        id: Date.now(),
        vehicleTitle: car.title,
        vehicleSlug: car.slug,
        vehiclePrice: car.price,
        clientName,
        clientEmail,
        clientPhone,
        offerPrice: formattedOffer,
        clientNotes,
        receiptCode: `SHA256-CL${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    setReceiptCode(String(result.inquiryId));
    setBookingSuccess(true);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <div className="ac-shimmer-pulse" style={{ width: '60px', height: '60px', borderRadius: '50%', border: '5px solid #e2e8f0', borderTopColor: 'var(--ac-primary)', animation: 'spin 1s infinite linear' }}></div>
        <p style={{ color: '#555', fontWeight: 600, fontFamily: 'var(--ac-font-heading)' }}>Authenticating provenance records...</p>
        <style jsx global>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!car) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <span style={{ fontSize: '3rem' }}>⚠️</span>
        <h3 style={{ color: 'var(--ac-primary)', fontWeight: 700, marginTop: '1rem', fontFamily: 'var(--ac-font-heading)' }}>Collector Masterpiece Not Found</h3>
        <p style={{ color: '#666' }}>We couldn't locate the specified vintage automobile record.</p>
        <button onClick={() => router.push(themeLink('/'))} className="ac-btn ac-btn-cta">Return to Showroom</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 5%' }}>
      {/* Back to Showroom Breadcrumb */}
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => router.push(themeLink('/'))} 
          style={{ background: 'none', border: 'none', color: 'var(--ac-dark)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', padding: 0 }}
        >
          ← Back to Collector Showroom
        </button>
      </div>

      {useFallback && apiError && (
        <div className="ac-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ac" />
        </div>
      )}
      {apiError && !useFallback && (
        <div className="ac-alert-slot">
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="ac" />
        </div>
      )}

      {/* Main Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: '3rem', alignItems: 'start' }} className="ac-details-grid">
        {/* Left column: Images, Specs, Description */}
        <div>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
            <img 
              src={car.image} 
              alt={car.title} 
              style={{ width: '100%', maxHeight: '520px', objectFit: 'cover' }} 
            />
          </div>

          {/* Vetted Specs Grid */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
            <h4 style={{ fontFamily: 'var(--ac-font-heading)', color: 'var(--ac-dark)', fontWeight: 700, fontSize: '1.4rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
              Vetted Historical Specifications
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>📅 Model Year</span>
                <span style={{ fontSize: '1.1rem', color: 'var(--ac-dark)', fontWeight: 700, marginTop: '0.25rem' }}>{car.year}</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>🏎️ Body Style</span>
                <span style={{ fontSize: '1.1rem', color: 'var(--ac-dark)', fontWeight: 700, marginTop: '0.25rem' }}>{car.bodyStyle}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>⚙️ Transmission</span>
                <span style={{ fontSize: '1.1rem', color: 'var(--ac-dark)', fontWeight: 700, marginTop: '0.25rem' }}>{car.transmission}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>🚀 Engine displacement</span>
                <span style={{ fontSize: '1.1rem', color: 'var(--ac-dark)', fontWeight: 700, marginTop: '0.25rem' }}>{car.engine}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>🎨 Exterior Color</span>
                <span style={{ fontSize: '1.1rem', color: 'var(--ac-dark)', fontWeight: 700, marginTop: '0.25rem' }}>{car.extColor}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>🪑 Interior Cabin</span>
                <span style={{ fontSize: '1.1rem', color: 'var(--ac-dark)', fontWeight: 700, marginTop: '0.25rem' }}>{car.intColor}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>⭐ Appraisal Grade</span>
                <span style={{ fontSize: '1.1rem', color: 'var(--ac-primary)', fontWeight: 800, marginTop: '0.25rem' }}>{car.appraisalScore}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontFamily: 'var(--ac-font-heading)', color: 'var(--ac-dark)', fontWeight: 700, fontSize: '1.4rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              Historical Provenance & Details
            </h4>
            <p style={{ color: '#555', lineHeight: 1.8, fontSize: '1.05rem', margin: 0 }}>
              {car.description}
            </p>
          </div>
        </div>

        {/* Right column: Form and Details */}
        <div>
          {/* Main Valuation/Price Card */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: 'var(--ac-font-heading)', color: 'var(--ac-dark)', fontWeight: 800, fontSize: '1.9rem', margin: '0 0 0.5rem 0' }}>{car.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.9rem', color: '#777' }}>🏪 Curated by:</span>
              <strong style={{ color: '#333' }}>{car.dealer}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--ac-primary)', fontFamily: 'var(--ac-font-heading)' }}>{car.price}</span>
              <span style={{ color: '#999', fontSize: '0.9rem' }}>Estimated Valuation</span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--ac-light)', borderRadius: '4px', fontSize: '0.9rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📍</span>
              <span style={{ color: '#555' }}>Vetted pickup showroom coordinates: <strong>{car.location}</strong></span>
            </div>
          </div>

          {/* Stateful Concierge & Bid Desk Drawer */}
          <div style={{ backgroundColor: '#1d1d1f', color: '#f5f5f7', borderRadius: '8px', padding: '2.5rem', boxShadow: '0 4px 25px rgba(0,0,0,0.15)', border: '1px solid #333' }}>
            {!bookingSuccess ? (
              <form onSubmit={handleCollectorInquiry}>
                <h4 style={{ fontFamily: 'var(--ac-font-heading)', color: '#fff', fontWeight: 700, fontSize: '1.3rem', margin: '0 0 0.5rem 0' }}>Acquisitions Concierge</h4>
                <p style={{ color: '#b5b5b7', fontSize: '0.85rem', margin: '0 0 1.5rem 0', lineHeight: 1.4 }}>Request an private viewing or submit a certified purchase offer to the broker.</p>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e5e5e7', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Collector Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)} 
                    placeholder="Winston Churchill" 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2d2d2f', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e5e5e7', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Secured Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    value={clientEmail} 
                    onChange={(e) => setClientEmail(e.target.value)} 
                    placeholder="winston@concierge.com" 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2d2d2f', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e5e5e7', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Purchase Offer Bid ($) *</label>
                  <input 
                    type="text" 
                    required 
                    value={offerPrice} 
                    onChange={(e) => setOfferPrice(e.target.value)} 
                    placeholder={car.price} 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2d2d2f', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e5e5e7', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Secure Phone Number (Optional)</label>
                  <input 
                    type="tel" 
                    value={clientPhone} 
                    onChange={(e) => setClientPhone(e.target.value)} 
                    placeholder="+1 (555) 123-4567" 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2d2d2f', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e5e5e7', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Special Custodian Requests</label>
                  <textarea 
                    value={clientNotes} 
                    onChange={(e) => setClientNotes(e.target.value)} 
                    placeholder="E.g., Request shipping transport quotes..." 
                    rows={3}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2d2d2f', color: '#fff', outline: 'none', fontFamily: 'inherit', resize: 'none' }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="ac-btn ac-btn-gold" 
                  style={{ width: '100%', padding: '0.9rem', borderRadius: '4px', fontSize: '1rem', fontWeight: 700 }}
                >
                  {isSubmitting ? 'Authenticating Bid...' : 'Submit Acquisitions Offer'}
                </button>
                {formError && (
                  <p style={{ color: '#fca5a5', fontSize: '0.85rem', marginTop: '0.75rem', textAlign: 'center' }}>
                    {formError}
                  </p>
                )}
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <span style={{ fontSize: '3rem' }}>📜</span>
                <h4 style={{ color: 'var(--ac-secondary)', fontWeight: 800, marginTop: '1rem', marginBottom: '0.5rem', fontSize: '1.4rem', fontFamily: 'var(--ac-font-heading)' }}>Offer Submitted!</h4>
                <p style={{ color: '#b5b5b7', fontSize: '0.9rem', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>
                  Bespoke offer registered. The custodian broker at <strong>{car.dealer}</strong> has locked your acquisition file.
                </p>

                {/* Secure Invoice Receipt */}
                <div style={{ border: '1px dashed #555', padding: '1rem', borderRadius: '4px', backgroundColor: '#2d2d2f', textAlign: 'left', marginBottom: '1.5rem' }}>
                  <h6 style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Acquisition Registry Code</h6>
                  <code style={{ display: 'block', wordBreak: 'break-all', fontSize: '0.85rem', color: 'var(--ac-secondary)', fontFamily: 'monospace', fontWeight: 700 }}>
                    {receiptCode}
                  </code>
                  
                  <hr style={{ border: 0, borderTop: '1px solid #444', margin: '0.75rem 0' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#b5b5b7', marginBottom: '0.25rem' }}>
                    <span>Vetted Masterpiece:</span>
                    <strong style={{ color: '#fff' }}>{car.title}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#b5b5b7', marginBottom: '0.25rem' }}>
                    <span>Collector:</span>
                    <strong style={{ color: '#fff' }}>{clientName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#b5b5b7' }}>
                    <span>Locked Bid Offer:</span>
                    <strong style={{ color: 'var(--ac-secondary)' }}>{offerPrice.startsWith('$') ? offerPrice : `$${Number(offerPrice).toLocaleString()}`}</strong>
                  </div>
                </div>

                <button 
                  onClick={() => setBookingSuccess(false)} 
                  className="ac-btn ac-btn-gold" 
                  style={{ width: '100%', borderRadius: '4px', padding: '0.75rem' }}
                >
                  Submit Alternative Inquiry
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related collector cars carousel */}
      {related.length > 0 && (
        <section style={{ marginTop: '5rem', borderTop: '2px solid #e2e8f0', paddingTop: '3rem' }}>
          <h3 style={{ fontFamily: 'var(--ac-font-heading)', color: 'var(--ac-dark)', fontWeight: 800, fontSize: '1.8rem', marginBottom: '2rem' }}>Related Masterpieces Vetted</h3>
          <div className="ac-grid">
            {related.map(item => (
              <ClassicCarCard 
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
