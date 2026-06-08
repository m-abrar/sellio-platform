'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@sellio/api-client';
import type { Vehicle } from '@sellio/types';
import { LuxuryHeader, LuxuryCarCard, LuxuryFooter } from './components';

interface ProductPageProps {
  slug: string;
}

const STATIC_VEHICLES_MAP: Record<string, any> = {
  'mercedes-s-class': {
    id: 101,
    title: "2025 Mercedes S-Class",
    slug: "mercedes-s-class",
    description: "A pinnacle of luxury motoring. This 2025 Mercedes S-Class combines advanced mild-hybrid performance with an interior modeled after premium executive lounges. Features ambient multi-contour seating, cinematic dashboard displays, and unmatched road comfort.",
    short_description: "Mild-hybrid luxury sedan with state-of-the-art cabin diagnostics.",
    pricing: { base_price: 110000, formatted: "$110,000", is_lease: true, is_selling: true },
    specs: { year: 2025, make: "Mercedes-Benz", model: "S-Class", vin: "WD19999**********", condition: "9.9/10", mileage: "5,000 mi", raw_mileage: 5000, mileage_units: "mi", engine: "Gasoline (Mild Hybrid)", transmission: "Automatic", fuel_economy: "24.5 mpg", drivetrain: "AWD", exterior_color: "Obsidian Black", warranty: "48 Months" },
    media: { main_photo: "/themes/autos/luxury/mercedes.png" },
    location: { address: "100 Prestige Way", city: "Los Angeles", state: "CA", country: "USA" }
  },
  'rolls-royce-phantom': {
    id: 102,
    title: "2024 Rolls Royce Phantom",
    slug: "rolls-royce-phantom",
    description: "The absolute benchmark of automotive status. Crafted by hand in Goodwood, this Phantom presents an unyielding V12 profile, soundproofing that creates a museum-like silence inside the cabin, and bespoke starlight headlining.",
    short_description: "Hand-crafted V12 masterpiece representing ultimate status.",
    pricing: { base_price: 420000, formatted: "$420,000", is_lease: false, is_selling: true },
    specs: { year: 2024, make: "Rolls Royce", model: "Phantom", vin: "SCA8888**********", condition: "10/10", mileage: "2,100 mi", raw_mileage: 2100, mileage_units: "mi", engine: "6.75L V12 Twin-Turbo", transmission: "Automatic", fuel_economy: "14.2 mpg", drivetrain: "RWD", exterior_color: "Selenite Grey", warranty: "72 Months" },
    media: { main_photo: "/themes/autos/luxury/rolls.png" },
    location: { address: "500 Heritage Blvd", city: "Miami", state: "FL", country: "USA" }
  },
  'porsche-taycan': {
    id: 103,
    title: "2025 Porsche Taycan Turbo",
    slug: "porsche-taycan",
    description: "A blistering electric sports saloon that bridges historic track heritage with the performance of tomorrow. Rapid charging architecture combined with high-precision cornering dynamics makes the Taycan an exhilarating experience.",
    short_description: "All-electric performance coupe with lightning-fast charging.",
    pricing: { base_price: 160000, formatted: "$160,000", is_lease: true, is_selling: true },
    specs: { year: 2025, make: "Porsche", model: "Taycan Turbo", vin: "WP03333**********", condition: "9.8/10", mileage: "800 mi", raw_mileage: 800, mileage_units: "mi", engine: "Electric Dual Motor", transmission: "Automatic", fuel_economy: "85.0 MPGe", drivetrain: "AWD", exterior_color: "Chalk White", warranty: "36 Months" },
    media: { main_photo: "/themes/autos/luxury/porsche.png" },
    location: { address: "75 Circuit Lane", city: "Austin", state: "TX", country: "USA" }
  },
  'bentley-continental': {
    id: 104,
    title: "2023 Bentley Continental GT",
    slug: "bentley-continental",
    description: "Grand touring defined. This Continental GT represents the perfect intersection between raw sportiness and classic British craftsmanship. Meticulously finished wood veneers align with a high-torque performance profile.",
    short_description: "Exquisite grand tourer combining speed and craftsmanship.",
    pricing: { base_price: 245000, formatted: "$245,000", is_lease: true, is_selling: true },
    specs: { year: 2023, make: "Bentley", model: "Continental GT", vin: "SCB5555**********", condition: "9.6/10", mileage: "6,500 mi", raw_mileage: 6500, mileage_units: "mi", engine: "4.0L V8 Twin-Turbo", transmission: "Automatic", fuel_economy: "19.0 mpg", drivetrain: "AWD", exterior_color: "Tanzanite Blue", warranty: "36 Months" },
    media: { main_photo: "/themes/autos/luxury/bentley.png" },
    location: { address: "12 British Way", city: "Greenwich", state: "CT", country: "USA" }
  }
};

export default function ProductPage({ slug }: ProductPageProps) {
  // Dynamic States
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [relatedVehicles, setRelatedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Leasing Calculator Inputs
  const [downPaymentPercent, setDownPaymentPercent] = useState(20); // Default 20%
  const [interestAPR, setInterestAPR] = useState(5.9); // Default 5.9% APR
  const [loanTerm, setLoanTerm] = useState(60); // Default 60 Months

  // Inquiry VIP reservation form inputs
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryDate, setInquiryDate] = useState('');
  const [inquiryTime, setInquiryTime] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState(false);

  useEffect(() => {
    async function loadVehicleDetails() {
      try {
        setLoading(true);
        // Call explicit getVehicleDetails API endpoint
        const response = await api.getVehicleDetails(slug);
        
        if (response && response.success && response.data) {
          setVehicle(response.data);
          
          if (response.related_vehicles) {
            setRelatedVehicles(response.related_vehicles);
          }
        }
        setError(null);
      } catch (err: any) {
        console.error("API error loading vehicle details page:", err);
        const errorMsg = err.response?.data?.message || err.message || "AxiosError: Network Error - Server offline at http://127.0.0.1:8000/api";
        setError(errorMsg);
        
        // Dynamic matching of fallback mock assets when API goes offline
        const matchedMock = STATIC_VEHICLES_MAP[slug] || STATIC_VEHICLES_MAP['rolls-royce-phantom'];
        setVehicle(matchedMock);
        
        // Populate fallback related vehicles using other entries in the map
        const otherMocks = Object.values(STATIC_VEHICLES_MAP).filter((car: any) => car.slug !== slug);
        setRelatedVehicles(otherMocks);
      } finally {
        setLoading(false);
      }
    }

    loadVehicleDetails();
  }, [slug]);

  // Dynamic Monthly Payment Lease/Finance Estimator calculation
  const calculateMonthlyPayment = () => {
    if (!vehicle) return "0.00";
    
    const basePrice = Number(vehicle.pricing?.base_price || 0);
    const downPaymentAmount = (basePrice * downPaymentPercent) / 100;
    const principalAmount = basePrice - downPaymentAmount;

    // Monthly interest calculation
    const monthlyRate = (interestAPR / 12) / 100;

    if (monthlyRate === 0) {
      return (principalAmount / loanTerm).toFixed(2);
    }

    const payment = (principalAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
                    (Math.pow(1 + monthlyRate, loanTerm) - 1);
                    
    return isNaN(payment) ? "0.00" : payment.toFixed(2);
  };

  const handleVIPInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !inquiryPhone || !inquiryDate) {
      alert("Please fill in all the required booking criteria.");
      return;
    }

    // Save inquiry dynamically to local storage under key 'sellio_autos_luxury_inquiries'
    const newInquiry = {
      id: Date.now(),
      vehicle_id: vehicle?.id || 0,
      vehicle_title: vehicle?.title || "Supercar Asset",
      name: inquiryName,
      email: inquiryEmail,
      phone: inquiryPhone,
      preferred_date: inquiryDate,
      preferred_time: inquiryTime || "12:00 PM",
      timestamp: new Date().toISOString()
    };

    const existing = localStorage.getItem('sellio_autos_luxury_inquiries');
    const list = existing ? JSON.parse(existing) : [];
    list.push(newInquiry);
    localStorage.setItem('sellio_autos_luxury_inquiries', JSON.stringify(list));

    setInquirySuccess(true);
    
    // Clear fields
    setInquiryName('');
    setInquiryEmail('');
    setInquiryPhone('');
    setInquiryDate('');
    setInquiryTime('');
    
    // Toast auto fade
    setTimeout(() => {
      setInquirySuccess(false);
    }, 5000);
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#1a1a1a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#c3a16d', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ letterSpacing: '2px' }}>PREPARING MANORIAL SHOWROOM PROVENANCE...</h2>
          <div className="lx-skeleton" style={{ height: '4px', width: '200px', backgroundColor: '#333', margin: '2rem auto', borderRadius: '4px' }}></div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div style={{ backgroundColor: '#1a1a1a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontFamily: 'sans-serif', padding: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 className="lx-text-gold">Asset Not Located</h2>
          <p style={{ color: 'var(--lx-text-muted)', marginBottom: '2rem' }}>The requested vehicle could not be loaded from the ledger.</p>
          <a href="/preview/autos_luxury/explore" className="lx-btn lx-btn-gold">Back to Catalog</a>
        </div>
      </div>
    );
  }

  const basePriceValue = Number(vehicle.pricing?.base_price || 0);

  return (
    <div className="autos-luxury-wrapper">
      <LuxuryHeader />

      {/* Cinematic Parallax Blur Header */}
      <section className="lx-hero" style={{ 
        height: '60vh', 
        backgroundImage: `url(${vehicle.media?.main_photo || vehicle.featured_image || "/themes/autos/luxury/mercedes.png"})`,
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '4rem 5%'
      }}>
        <div className="lx-hero-overlay" style={{ background: 'linear-gradient(to top, rgba(26,26,26,1) 0%, rgba(26,26,26,0.3) 50%, rgba(0,0,0,0.5) 100%)' }}></div>
        <div className="lx-hero-content" style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h1 className="lx-heading" style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 900, marginBottom: '0.5rem', color: '#fff' }}>
              {vehicle.title}
            </h1>
            <p style={{ color: 'var(--lx-text-gold)', fontFamily: 'var(--lx-font-body)', fontSize: '1.25rem', letterSpacing: '1px', margin: 0 }}>
              {vehicle.specs?.make} {vehicle.specs?.model}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: 'var(--lx-text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Acquisition Valuation</span>
            <span className="lx-car-price" style={{ fontSize: '3rem', display: 'block' }}>
              {vehicle.pricing?.formatted || `$${basePriceValue.toLocaleString()}`}
            </span>
          </div>
        </div>
      </section>

      {/* Showroom Network Connection Diagnostics Alert */}
      {error && (
        <div className="lx-error-alert" style={{
            border: '2px solid var(--lx-gold)',
            borderRadius: '8px',
            padding: '1.5rem',
            margin: '2rem 5% 0',
            backgroundColor: 'rgba(26, 26, 26, 0.9)',
            boxShadow: '0 0 15px rgba(195, 161, 109, 0.2)'
        }}>
            <h4 className="lx-text-gold" style={{ fontFamily: 'var(--lx-font-heading)', fontSize: '1.4rem', margin: '0 0 0.5rem' }}>
                🛰️ Showroom Diagnostics Connection Trace
            </h4>
            <p style={{ fontSize: '0.95rem', margin: '0 0 1rem', color: 'var(--lx-text-muted)', lineHeight: 1.6 }}>
                The vehicle discovery engine detected an offline API connection. Rendering luxury backup showroom database.
            </p>
            <div style={{
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                backgroundColor: '#000',
                padding: '1rem',
                borderRadius: '4px',
                color: '#ff4d4d',
                overflowX: 'auto',
                border: '1px solid #333'
            }}>
                {error}
            </div>
        </div>
      )}

      {/* Main Details and Spec Ledger */}
      <section className="lx-section">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', alignItems: 'start' }}>
          
          {/* Main Specifications Ledger */}
          <div>
            <h3 className="lx-heading lx-text-gold" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Provenance & Specifications</h3>
            <p style={{ lineHeight: 1.8, fontSize: '1.1rem', color: '#ddd', marginBottom: '2.5rem' }}>
              {vehicle.description}
            </p>

            {/* Spec Sheet Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
              
              <div className="lx-testimonial-card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--lx-gold)', backgroundColor: 'var(--lx-bg-card)' }}>
                <small style={{ color: 'var(--lx-text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '0.75rem' }}>Production Year</small>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{vehicle.specs?.year}</span>
              </div>

              <div className="lx-testimonial-card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--lx-gold)', backgroundColor: 'var(--lx-bg-card)' }}>
                <small style={{ color: 'var(--lx-text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '0.75rem' }}>Odometer Mileage</small>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{vehicle.specs?.mileage}</span>
              </div>

              <div className="lx-testimonial-card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--lx-gold)', backgroundColor: 'var(--lx-bg-card)' }}>
                <small style={{ color: 'var(--lx-text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '0.75rem' }}>Engine Architecture</small>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{vehicle.specs?.engine}</span>
              </div>

              <div className="lx-testimonial-card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--lx-gold)', backgroundColor: 'var(--lx-bg-card)' }}>
                <small style={{ color: 'var(--lx-text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '0.75rem' }}>Transmission Type</small>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{vehicle.specs?.transmission}</span>
              </div>

              <div className="lx-testimonial-card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--lx-gold)', backgroundColor: 'var(--lx-bg-card)' }}>
                <small style={{ color: 'var(--lx-text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '0.75rem' }}>Drivetrain System</small>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{vehicle.specs?.drivetrain}</span>
              </div>

              <div className="lx-testimonial-card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--lx-gold)', backgroundColor: 'var(--lx-bg-card)' }}>
                <small style={{ color: 'var(--lx-text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '0.75rem' }}>Exterior Finish</small>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{vehicle.specs?.exterior_color}</span>
              </div>

              <div className="lx-testimonial-card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--lx-gold)', backgroundColor: 'var(--lx-bg-card)' }}>
                <small style={{ color: 'var(--lx-text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '0.75rem' }}>Fuel Economy</small>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{vehicle.specs?.fuel_economy}</span>
              </div>

              <div className="lx-testimonial-card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--lx-gold)', backgroundColor: 'var(--lx-bg-card)' }}>
                <small style={{ color: 'var(--lx-text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '0.75rem' }}>Condition Score</small>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{vehicle.specs?.condition || "9.5/10"}</span>
              </div>

              <div className="lx-testimonial-card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--lx-gold)', backgroundColor: 'var(--lx-bg-card)' }}>
                <small style={{ color: 'var(--lx-text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '0.75rem' }}>VIP Warranty</small>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{vehicle.specs?.warranty || "36 Months"}</span>
              </div>

            </div>

            {/* Glassmorphic Dynamic Lease/Finance Calculator */}
            <div style={{
              background: '#242424',
              borderRadius: '10px',
              padding: '2.5rem',
              border: '1px solid #333',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
              marginBottom: '3rem'
            }}>
              <h4 className="lx-heading lx-text-gold" style={{ fontSize: '1.5rem', margin: '0 0 1.5rem' }}>
                🧮 Elite Financing Estimator
              </h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                
                {/* Down Payment % Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <span>Down Payment</span>
                    <span className="lx-text-gold">{downPaymentPercent}% (${(basePriceValue * downPaymentPercent / 100).toLocaleString()})</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="80"
                    step="5"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--lx-gold)' }}
                  />
                </div>

                {/* APR Interest Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <span>Interest Rate (APR)</span>
                    <span className="lx-text-gold">{interestAPR}%</span>
                  </div>
                  <input 
                    type="range"
                    min="2"
                    max="15"
                    step="0.1"
                    value={interestAPR}
                    onChange={(e) => setInterestAPR(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--lx-gold)' }}
                  />
                </div>

              </div>

              {/* Term Duration Selectors */}
              <div style={{ marginBottom: '2.5rem' }}>
                <span style={{ fontSize: '0.9rem', display: 'block', marginBottom: '0.75rem', color: 'var(--lx-text-muted)' }}>Loan Term Period</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[24, 36, 48, 60, 72].map(months => (
                    <button 
                      key={months}
                      type="button"
                      className={`lx-btn ${loanTerm === months ? 'lx-btn-gold' : 'lx-btn-outline'}`}
                      style={{ padding: '0.5rem 1rem', borderRadius: '4px', flex: 1, fontSize: '0.9rem' }}
                      onClick={() => setLoanTerm(months)}
                    >
                      {months} Mo
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Rate Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #333', paddingTop: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--lx-text-muted)', textTransform: 'uppercase' }}>Estimated Monthly Rate</span>
                  <span style={{ display: 'block', fontSize: '2rem', fontWeight: 700, color: 'var(--lx-gold)' }}>
                    ${Number(calculateMonthlyPayment()).toLocaleString()}/mo
                  </span>
                </div>
                <small style={{ color: 'var(--lx-text-muted)', maxWidth: '250px', textAlign: 'right', fontSize: '0.75rem', lineHeight: 1.4 }}>
                  Taxes, license, and dealer administration fees excluded. Formulated on prime catalog criteria.
                </small>
              </div>

            </div>

          </div>

          {/* Side VIP Reservation Desk */}
          <div style={{ 
            background: 'var(--lx-bg-filter)',
            borderRadius: '10px',
            border: '2px solid var(--lx-gold)',
            padding: '2rem',
            position: 'sticky',
            top: '100px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
          }}>
            <h4 className="lx-heading lx-text-gold" style={{ fontSize: '1.4rem', margin: '0 0 0.5rem', textAlign: 'center' }}>
              ⚜️ Showroom VIP Desk
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--lx-text-muted)', margin: '0 0 1.5rem', textAlign: 'center', lineHeight: 1.4 }}>
              Register for a private private viewing of this vehicle asset.
            </p>

            {inquirySuccess ? (
              <div style={{
                backgroundColor: 'rgba(195, 161, 109, 0.1)',
                border: '1px solid var(--lx-gold)',
                color: '#fff',
                padding: '1.5rem',
                borderRadius: '8px',
                textAlign: 'center',
                boxShadow: '0 0 10px rgba(195,161,109,0.3)',
                margin: '1rem 0'
              }}>
                <h5 className="lx-text-gold" style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>Acquisition Registered</h5>
                <p style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                  Your private viewing VIP reservation is synchronized. A private curator will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleVIPInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <div>
                  <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem', color: '#ccc' }}>Full Name *</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name"
                    className="lx-select"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem', color: '#ccc' }}>Email Address *</label>
                  <input 
                    type="email" 
                    placeholder="name@luxury.com"
                    className="lx-select"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem', color: '#ccc' }}>Phone Contact *</label>
                  <input 
                    type="tel" 
                    placeholder="+1 (555) 000-0000"
                    className="lx-select"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    required
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem', color: '#ccc' }}>Viewing Date *</label>
                    <input 
                      type="date" 
                      className="lx-select"
                      style={{ width: '100%', boxSizing: 'border-box' }}
                      required
                      value={inquiryDate}
                      onChange={(e) => setInquiryDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem', color: '#ccc' }}>Time Preference</label>
                    <input 
                      type="time" 
                      className="lx-select"
                      style={{ width: '100%', boxSizing: 'border-box' }}
                      value={inquiryTime}
                      onChange={(e) => setInquiryTime(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="lx-btn lx-btn-gold" style={{ width: '100%', padding: '0.8rem', marginTop: '1rem', borderRadius: '4px' }}>
                  Schedule Private Viewing
                </button>

                <p style={{ fontSize: '0.7rem', color: 'var(--lx-text-muted)', margin: 0, textAlign: 'center', lineHeight: 1.4 }}>
                  By scheduling, you agree to our private showroom access codes and credentials guidelines.
                </p>

              </form>
            )}

          </div>

        </div>
      </section>

      {/* Related Premium Showroom Grid */}
      {relatedVehicles.length > 0 && (
        <section className="lx-section" style={{ borderTop: '1px solid #333', backgroundColor: '#111' }}>
          <h3 className="lx-section-title" style={{ color: '#fff' }}>Related Masterpieces</h3>
          <div className="lx-grid">
            {relatedVehicles.slice(0, 3).map((car) => {
              // Standard rendering of the related card
              const relatedSpecs = `${car.specs?.year || ''} ${car.specs?.engine || ''} | ${car.specs?.transmission || ''} | ${car.specs?.mileage || ''}`;
              
              const isStaticModel = !car.id || car.id >= 100;
              const title = car.title;
              const specs = isStaticModel ? (car as any).specs : relatedSpecs;
              const price = isStaticModel ? (car as any).price : (car.pricing?.formatted || `$${Number(car.pricing?.base_price || 0).toLocaleString()}`);
              const image = isStaticModel ? (car as any).image : (car.media?.main_photo || car.featured_image || "/themes/autos/luxury/mercedes.png");

              return (
                <LuxuryCarCard 
                  key={car.slug}
                  title={title}
                  specs={specs}
                  price={price}
                  image={image}
                  slug={car.slug}
                />
              );
            })}
          </div>
        </section>
      )}

      <LuxuryFooter />
    </div>
  );
}
