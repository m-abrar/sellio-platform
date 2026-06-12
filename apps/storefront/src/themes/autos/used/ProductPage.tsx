'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Vehicle } from '@sellio/types';
import { UsedCarCard } from './components';
import { CatalogSyncAlert } from '@/themes/autos/shared/CatalogSyncAlert';
import { fetchVehicleDetail, resolveVehicleFailure } from '@/themes/autos/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/autos/shared/useDemoFallbackAllowed';
import { submitVehicleInquiry } from '@/themes/autos/shared/submit-vehicle-inquiry';
import { useAutosThemeLink } from '@/themes/autos/shared/useAutosThemeLink';

interface UsedCarItem {
  id: number;
  title: string;
  price: string;
  numericPrice: number;
  mileage: string;
  numericMileage: number;
  location: string;
  dealer: string;
  image: string;
  slug: string;
  brand: string;
  year: number;
  transmission: string;
  engine: string;
  drivetrain: string;
  warranty: string;
  description: string;
}

const FALLBACK_CARS: UsedCarItem[] = [
  { id: 1, title: "2018 Honda Civic Sedan", price: "$15,500", numericPrice: 15500, mileage: "40,000 miles", numericMileage: 40000, location: "New York", dealer: "AutoWorld Dealership", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600", slug: "2018-honda-civic", brand: "Honda", year: 2018, transmission: "6-Speed Manual", engine: "2.0L 4-Cylinder", drivetrain: "Front-Wheel Drive (FWD)", warranty: "30-Day Dealership Warranty", description: "Sleek, well-maintained sporty sedan. Famous for bulletproof reliability, dynamic highway handling, custom premium package upgrades, and outstanding fuel efficiency." },
  { id: 2, title: "2020 Toyota Camry XLE", price: "$19,800", numericPrice: 19800, mileage: "25,000 miles", numericMileage: 25000, location: "Los Angeles", dealer: "City Motors", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600", slug: "2020-toyota-camry", brand: "Toyota", year: 2020, transmission: "8-Speed Automatic", engine: "2.5L 4-Cylinder", drivetrain: "Front-Wheel Drive (FWD)", warranty: "Certified Pre-Owned Warranty", description: "Elegant Camry model in flawless condition. Fully leather-wrapped premium seats, high-fidelity sound speakers, state-of-the-art radar driver safety controls, and pristine maintenance logs." },
  { id: 3, title: "2016 Ford Focus SE", price: "$9,200", numericPrice: 9200, mileage: "60,000 miles", numericMileage: 60000, location: "Chicago", dealer: "Honest Used Cars", image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=600", slug: "2016-ford-focus", brand: "Ford", year: 2016, transmission: "6-Speed Automatic", engine: "2.0L Direct Injection", drivetrain: "Front-Wheel Drive (FWD)", warranty: "30-Day Dealership Warranty", description: "Affordable and compact hatchback. Exceptionally responsive chassis, agile handling, and generous rear storage room. Excellent daily commuter choice." },
  { id: 4, title: "2019 Mazda 3 Touring", price: "$17,000", numericPrice: 17000, mileage: "30,000 miles", numericMileage: 30000, location: "Dallas", dealer: "Zoom Motors", image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600", slug: "2019-mazda-3", brand: "Mazda", year: 2019, transmission: "6-Speed Automatic", engine: "2.5L SkyActiv-G", drivetrain: "All-Wheel Drive (AWD)", warranty: "90-Day / 3,000-Mile Limited Warranty", description: "Premium, luxury-inspired compact vehicle with robust SkyActiv performance. Beautiful leather trim details, modern touch display controls, and highly responsive power steering dynamics." },
  { id: 5, title: "2017 Hyundai Elantra SE", price: "$11,500", numericPrice: 11500, mileage: "55,000 miles", numericMileage: 55000, location: "Miami", dealer: "Prime Autos", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600", slug: "2017-hyundai-elantra", brand: "Hyundai", year: 2017, transmission: "6-Speed Automatic", engine: "2.0L 4-Cylinder", drivetrain: "Front-Wheel Drive (FWD)", warranty: "30-Day Dealership Warranty", description: "Highly reliable sedan offering outstanding fuel savings, a remarkably quiet cabin feel, dual-zone temperature selectors, and pristine maintenance records." },
  { id: 6, title: "2019 Jeep Grand Cherokee", price: "$24,500", numericPrice: 24500, mileage: "42,000 miles", numericMileage: 42000, location: "Houston", dealer: "Elite Drives", image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=600", slug: "2019-jeep-grand-cherokee", brand: "Jeep", year: 2019, transmission: "8-Speed Automatic", engine: "3.6L V6 Engine", drivetrain: "Four-Wheel Drive (4WD)", warranty: "Certified Pre-Owned Warranty", description: "Rugged and capable four-wheel drive SUV. Exceptional towing power limits, deep cargo dimensions, luxurious touch interior elements, and full off-road driving modes." },
];

const translateVehicle = (rawItem: Vehicle): UsedCarItem => {
  const item = rawItem as any;
  const generatedSlug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  
  const numericPrice = Number(item.pricing?.base_price) || 15000;
  const priceStr = item.pricing?.formatted || `$${numericPrice.toLocaleString()}`;
  
  const specsMileage = item.specs?.mileage;
  const numericMileage = specsMileage ? Number(specsMileage) : (item.mileage ? Number(item.mileage) : 35000);
  const mileageStr = `${numericMileage.toLocaleString()} miles`;
  
  const loc = item.city || item.location?.title || 'New York';
  const dealerName = item.dealer?.name || item.dealer_name || item.company?.title || 'DriveHub Dealership';
  
  const year = Number(item.specs?.year) || 2019;
  
  let transmission = item.specs?.transmission || "6-Speed Automatic";
  let engine = item.specs?.engine || "2.0L 4-Cylinder";
  let drivetrain = item.specs?.drivetrain || "Front-Wheel Drive (FWD)";
  let warranty = "30-Day Dealership Warranty";
  
  if (item.title.toLowerCase().includes('manual') || item.title.toLowerCase().includes('civic')) {
    transmission = "6-Speed Manual";
  }
  
  if (item.title.toLowerCase().includes('v6') || item.title.toLowerCase().includes('cherokee')) {
    engine = "3.6L V6 Engine";
    drivetrain = "Four-Wheel Drive (4WD)";
  } else if (item.title.toLowerCase().includes('camry')) {
    engine = "2.5L 4-Cylinder";
  }
  
  if (item.id % 3 === 0) {
    warranty = "90-Day / 3,000-Mile Limited Warranty";
  } else if (item.id % 3 === 1) {
    warranty = "Certified Pre-Owned Warranty";
  }

  const imageId = item.id ? (item.id % 8) + 1 : 1;
  const fallbackImages = [
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=600",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600",
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600",
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600",
    "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=600",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600"
  ];
  
  const mainImage = item.featured_image || item.media?.main_photo || item.image || fallbackImages[imageId - 1];

  return {
    id: item.id,
    title: item.title.startsWith('20') ? item.title : `${year} ${item.title}`,
    price: priceStr,
    numericPrice,
    mileage: mileageStr,
    numericMileage,
    location: loc,
    dealer: dealerName,
    image: mainImage,
    slug: generatedSlug,
    brand: item.specs?.make || item.title.split(' ')[0] || 'Unknown',
    year,
    transmission,
    engine,
    drivetrain,
    warranty,
    description: item.description || "Beautiful, rigorously inspected used vehicle in great condition. Fully loaded comfort, excellent fuel efficiency, clean title, and perfect maintenance records. Stop by for a dynamic test drive today."
  };
};

export default function ProductPage({ slug }: { slug: string }) {
  const router = useRouter();
  const themeLink = useAutosThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  // Dynamic States
  const [car, setCar] = useState<UsedCarItem | null>(null);
  const [related, setRelated] = useState<UsedCarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Booking drawer states
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [financingNeeded, setFinancingNeeded] = useState(false);
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
        const resolution = resolveVehicleFailure(slug, allowDemo, 'used');

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

  const handleTestDriveBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!car || !clientName || !clientEmail || !bookingDate) {
      setFormError('Please fill in name, email, and your preferred test drive date.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    const inquiryMessage = [
      `Test drive date: ${bookingDate}`,
      financingNeeded ? 'Financing assistance requested' : '',
    ]
      .filter(Boolean)
      .join('\n');

    const result = await submitVehicleInquiry({
      vehicleId: car.id,
      useFallback,
      storageKey: 'sellio_autos_used_orders',
      fullName: clientName,
      email: clientEmail,
      phone: clientPhone,
      preferredDate: bookingDate,
      message: inquiryMessage,
      demoRecord: {
        id: Date.now(),
        vehicleTitle: car.title,
        vehicleSlug: car.slug,
        vehiclePrice: car.price,
        clientName,
        clientEmail,
        clientPhone,
        bookingDate,
        financingNeeded,
        receiptCode: `SHA256-R${Date.now()}`,
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
        <div className="us-shimmer-pulse" style={{ width: '60px', height: '60px', borderRadius: '50%', border: '5px solid #e2e8f0', borderTopColor: 'var(--us-orange)', animation: 'spin 1s infinite linear' }}></div>
        <p style={{ color: '#666', fontWeight: 600 }}>Loading vehicle specifications...</p>
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
        <h3 style={{ color: 'var(--us-blue)', fontWeight: 700, marginTop: '1rem' }}>Vehicle Not Found</h3>
        <p style={{ color: '#666' }}>We couldn't locate the specified vehicle listing.</p>
        <button onClick={() => router.push(themeLink('/'))} className="us-btn us-btn-orange">Return to Showroom</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 5%' }}>
      {/* Back to Catalog Breadcrumb */}
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => router.push(themeLink('/'))} 
          style={{ background: 'none', border: 'none', color: 'var(--us-blue)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', padding: 0 }}
        >
          ← Back to Used Showroom
        </button>
      </div>

      {useFallback && apiError && (
        <div className="us-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="us" />
        </div>
      )}
      {apiError && !useFallback && (
        <div className="us-alert-slot">
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="us" />
        </div>
      )}

      {/* Main Product Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: '2.5rem', alignItems: 'start' }} className="us-details-grid">
        {/* Left Side: Images, Specs, Description */}
        <div>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
            <img 
              src={car.image} 
              alt={car.title} 
              style={{ width: '100%', maxHeight: '480px', objectFit: 'cover' }} 
            />
          </div>

          {/* Used Car Specifications Grid */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
            <h4 className="us-text-blue us-fw-bold" style={{ fontSize: '1.4rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
              Vehicle Specifications
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', color: '#999', textTransform: 'uppercase', fontWeight: 600 }}>⏱️ Odometer Mileage</span>
                <span style={{ fontSize: '1.1rem', color: '#333', fontWeight: 700, marginTop: '0.2rem' }}>{car.mileage}</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', color: '#999', textTransform: 'uppercase', fontWeight: 600 }}>📅 Model Year</span>
                <span style={{ fontSize: '1.1rem', color: '#333', fontWeight: 700, marginTop: '0.2rem' }}>{car.year}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', color: '#999', textTransform: 'uppercase', fontWeight: 600 }}>⚙️ Transmission</span>
                <span style={{ fontSize: '1.1rem', color: '#333', fontWeight: 700, marginTop: '0.2rem' }}>{car.transmission}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', color: '#999', textTransform: 'uppercase', fontWeight: 600 }}>🚀 Engine Power</span>
                <span style={{ fontSize: '1.1rem', color: '#333', fontWeight: 700, marginTop: '0.2rem' }}>{car.engine}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', color: '#999', textTransform: 'uppercase', fontWeight: 600 }}>🛣️ Drivetrain Style</span>
                <span style={{ fontSize: '1.1rem', color: '#333', fontWeight: 700, marginTop: '0.2rem' }}>{car.drivetrain}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', color: '#999', textTransform: 'uppercase', fontWeight: 600 }}>🛡️ Warranty Type</span>
                <span style={{ fontSize: '1.1rem', color: 'var(--us-orange)', fontWeight: 700, marginTop: '0.2rem' }}>{car.warranty}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <h4 className="us-text-blue us-fw-bold" style={{ fontSize: '1.4rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              Seller Description
            </h4>
            <p style={{ color: '#555', lineHeight: 1.7, fontSize: '1.05rem', margin: 0 }}>
              {car.description}
            </p>
          </div>
        </div>

        {/* Right Side: Price, Booking Desk Form */}
        <div>
          {/* Main Price Card */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
            <h1 className="us-text-blue us-fw-bold" style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>{car.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.95rem', color: '#777' }}>🏪 Offered by:</span>
              <strong style={{ color: '#333' }}>{car.dealer}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--us-orange)' }}>{car.price}</span>
              <span style={{ color: '#999', fontSize: '0.9rem' }}>+ fees & taxes</span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--us-light-gray)', borderRadius: '8px', fontSize: '0.9rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📍</span>
              <span style={{ color: '#555' }}>Vehicles pickup ready in <strong>{car.location}</strong></span>
            </div>
          </div>

          {/* Stateful Test-Drive Booking Drawer desk */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            {!bookingSuccess ? (
              <form onSubmit={handleTestDriveBooking}>
                <h4 className="us-text-blue us-fw-bold" style={{ fontSize: '1.3rem', margin: '0 0 0.5rem 0' }}>Schedule a Test Drive</h4>
                <p style={{ color: '#666', fontSize: '0.85rem', margin: '0 0 1.5rem 0' }}>Submit a request to book a test drive directly at the dealership lobby.</p>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: '0.4rem' }}>Your Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)} 
                    placeholder="John Doe" 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e0', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: '0.4rem' }}>Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    value={clientEmail} 
                    onChange={(e) => setClientEmail(e.target.value)} 
                    placeholder="john@example.com" 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e0', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: '0.4rem' }}>Phone Number (Optional)</label>
                  <input 
                    type="tel" 
                    value={clientPhone} 
                    onChange={(e) => setClientPhone(e.target.value)} 
                    placeholder="(555) 000-0000" 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e0', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: '0.4rem' }}>Preferred Date *</label>
                  <input 
                    type="date" 
                    required 
                    value={bookingDate} 
                    onChange={(e) => setBookingDate(e.target.value)} 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e0', outline: 'none', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="checkbox" 
                    id="financing" 
                    checked={financingNeeded} 
                    onChange={(e) => setFinancingNeeded(e.target.checked)} 
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <label htmlFor="financing" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4a5568', cursor: 'pointer' }}>
                    I am interested in dealership financing
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="us-btn us-btn-orange" 
                  style={{ width: '100%', padding: '0.9rem', borderRadius: '8px', fontSize: '1rem' }}
                >
                  {isSubmitting ? 'Submitting Reservation...' : 'Request Booking Appointment'}
                </button>
                {formError && (
                  <p style={{ color: '#c53030', fontSize: '0.85rem', marginTop: '0.75rem', textAlign: 'center' }}>
                    {formError}
                  </p>
                )}
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <span style={{ fontSize: '3rem' }}>🎉</span>
                <h4 style={{ color: 'var(--us-blue)', fontWeight: 800, marginTop: '1rem', marginBottom: '0.5rem', fontSize: '1.4rem' }}>Test Drive Booked!</h4>
                <p style={{ color: '#555', fontSize: '0.9rem', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>
                  Excellent! Your appointment with <strong>{car.dealer}</strong> has been dynamically locked inside client-side records.
                </p>

                {/* SHA-256 Receipt layout */}
                <div style={{ border: '1px dashed #cbd5e0', padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--us-light-gray)', textAlign: 'left', marginBottom: '1.5rem' }}>
                  <h6 style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#777', textTransform: 'uppercase', fontWeight: 700 }}>Verification Code</h6>
                  <code style={{ display: 'block', wordBreak: 'break-all', fontSize: '0.85rem', color: 'var(--us-orange)', fontFamily: 'monospace', fontWeight: 700 }}>
                    {receiptCode}
                  </code>
                  
                  <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '0.75rem 0' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#555', marginBottom: '0.25rem' }}>
                    <span>Customer:</span>
                    <strong>{clientName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#555', marginBottom: '0.25rem' }}>
                    <span>Date Requested:</span>
                    <strong>{bookingDate}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#555' }}>
                    <span>Financing Assistance:</span>
                    <strong>{financingNeeded ? 'Yes' : 'No'}</strong>
                  </div>
                </div>

                <button 
                  onClick={() => setBookingSuccess(false)} 
                  className="us-btn us-btn-outline" 
                  style={{ width: '100%', borderRadius: '8px', padding: '0.75rem' }}
                >
                  Schedule Another Appointment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related listings carousel */}
      {related.length > 0 && (
        <section style={{ marginTop: '5rem', borderTop: '2px solid #e2e8f0', paddingTop: '3rem' }}>
          <h3 className="us-text-blue us-fw-bold" style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Related Vehicles You Might Like</h3>
          <div className="us-grid">
            {related.map(item => (
              <UsedCarCard 
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
