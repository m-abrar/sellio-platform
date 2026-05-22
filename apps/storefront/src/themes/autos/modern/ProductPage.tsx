'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@sellio/api-client';
import type { Vehicle } from '@sellio/types';
import Link from 'next/link';
import { ModernHeader, ModernCarCard, ModernFooter } from './components';

interface ProductPageProps {
  slug: string;
}

const STATIC_VEHICLES_MAP: Record<string, any> = {
  'tesla-model-3': {
    id: 201,
    title: "2025 Tesla Model 3",
    slug: "tesla-model-3",
    description: "The absolute standard in modern electric commuting. This Tesla Model 3 features dual-motor AWD, an expansive minimalist interior with cinematic center screen, and industry-leading Autopilot driver assist arrays.",
    short_description: "Futuristic all-electric dual-motor sedan with full autonomy suites.",
    pricing: { base_price: 39000, formatted: "$39,000", is_lease: true, is_selling: true },
    specs: { year: 2025, make: "Tesla", model: "Model 3", vin: "5YJ3E1EA**********", condition: "New", mileage: "Available Now", raw_mileage: 0, mileage_units: "mi", engine: "Electric Dual Motor", transmission: "Automatic", fuel_economy: "132 MPGe", drivetrain: "AWD", exterior_color: "Pearl White", warranty: "48 Months" },
    media: { main_photo: "/themes/autos/modern/11.webp" },
    location: { address: "88 Electric Blvd", city: "Palo Alto", state: "CA", country: "USA" }
  },
  'bmw-i4': {
    id: 202,
    title: "2025 BMW i4",
    slug: "bmw-i4",
    description: "Gran Coupe styling meets advanced electric mobility. The BMW i4 delivers signature brand dynamics, high-torque acceleration, and a curved display cockpit that seamlessly maps the drive.",
    short_description: "All-electric premium Gran Coupe showcasing athletic performance.",
    pricing: { base_price: 55000, formatted: "$55,000", is_lease: true, is_selling: true },
    specs: { year: 2025, make: "BMW", model: "i4", vin: "WBA31AW0**********", condition: "New", mileage: "800 mi", raw_mileage: 800, mileage_units: "mi", engine: "eDrive40 Electric", transmission: "Automatic", fuel_economy: "109 MPGe", drivetrain: "RWD", exterior_color: "Portimao Blue", warranty: "48 Months" },
    media: { main_photo: "/themes/autos/modern/12.webp" },
    location: { address: "100 Bavarian Way", city: "Munich", state: "Bavaria", country: "Germany" }
  },
  'toyota-corolla': {
    id: 203,
    title: "2025 Toyota Corolla",
    slug: "toyota-corolla",
    description: "The world's most trusted everyday vehicle, upgraded for the future. Efficient, reliable, and featuring Toyota Safety Sense 3.0 suite to safeguard every leg of your travel.",
    short_description: "Unmatched daily reliability meets smart hybrid efficiency.",
    pricing: { base_price: 22000, formatted: "$22,000", is_lease: false, is_selling: true },
    specs: { year: 2025, make: "Toyota", model: "Corolla", vin: "JTDDPRA1**********", condition: "New", mileage: "50 mi", raw_mileage: 50, mileage_units: "mi", engine: "2.0L 4-Cylinder Hybrid", transmission: "CVT", fuel_economy: "41.0 mpg", drivetrain: "FWD", exterior_color: "Classic Silver", warranty: "36 Months" },
    media: { main_photo: "/themes/autos/modern/13.webp" },
    location: { address: "25 Safety Avenue", city: "Toyota", state: "Aichi", country: "Japan" }
  },
  'audi-e-tron-gt': {
    id: 204,
    title: "2025 Audi e-tron GT",
    slug: "audi-e-tron-gt",
    description: "A blistering electric masterpiece of automotive design. Aerodynamic sculpts, quattro handling, and pure battery-propelled acceleration combined in a design that stops spectators in their tracks.",
    short_description: "Aerodynamic dual-motor luxury tourer with hyper-charging options.",
    pricing: { base_price: 88000, formatted: "$88,000", is_lease: true, is_selling: true },
    specs: { year: 2025, make: "Audi", model: "e-tron GT", vin: "WA1EABFF**********", condition: "New", mileage: "150 mi", raw_mileage: 150, mileage_units: "mi", engine: "Dual Motor e-quattro", transmission: "2-Speed Automatic", fuel_economy: "85.0 MPGe", drivetrain: "AWD", exterior_color: "Kemora Gray", warranty: "48 Months" },
    media: { main_photo: "/themes/autos/modern/14.webp" },
    location: { address: "55 Progressive Loop", city: "Ingolstadt", state: "Bavaria", country: "Germany" }
  },
  'hyundai-ioniq-6': {
    id: 205,
    title: "2025 Hyundai IONIQ 6",
    slug: "hyundai-ioniq-6",
    description: "An incredibly aerodynamic electric streamliner engineered to maximize efficiency. Features interactive pixel light accents, custom premium audio, and rapid 800V charging compatibility.",
    short_description: "Ultra-aerodynamic EV streamliner with 800V charging capabilities.",
    pricing: { base_price: 46000, formatted: "$46,000", is_lease: true, is_selling: true },
    specs: { year: 2025, make: "Hyundai", model: "IONIQ 6", vin: "KMHCF4AE**********", condition: "New", mileage: "300 mi", raw_mileage: 300, mileage_units: "mi", engine: "Electric Propulsion", transmission: "Automatic", fuel_economy: "140 MPGe", drivetrain: "RWD", exterior_color: "Digital Teal", warranty: "60 Months" },
    media: { main_photo: "/themes/autos/modern/15.webp" },
    location: { address: "90 Streamline Plaza", city: "Seoul", state: "Seoul", country: "South Korea" }
  }
};

export default function ProductPage({ slug }: ProductPageProps) {
  // Dynamic API States
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [relatedVehicles, setRelatedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Leasing Calculator Inputs
  const [downPaymentPercent, setDownPaymentPercent] = useState(15); // Default 15%
  const [interestAPR, setInterestAPR] = useState(4.9); // Default 4.9% APR
  const [loanTerm, setLoanTerm] = useState(48); // Default 48 Months

  // Booking inquiry form states
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  
  // Custom Performance/Aesthetic Upgrades
  const [customCeramicCoating, setCustomCeramicCoating] = useState(false);
  const [customWinterTires, setCustomWinterTires] = useState(false);
  const [customPerformanceTuning, setCustomPerformanceTuning] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        return `/preview/autos_modern${path}`;
      }
    }
    return path;
  };

  useEffect(() => {
    async function loadVehicle() {
      try {
        setLoading(true);
        const response = await api.getVehicleDetails(slug);
        
        if (response && response.success && response.data) {
          setVehicle(response.data);
          if (response.related_vehicles) {
            setRelatedVehicles(response.related_vehicles);
          }
        }
        setError(null);
      } catch (err: any) {
        console.error("API error loading vehicle details subpage:", err);
        const errorMsg = err.response?.data?.message || err.message || "AxiosError: Network Error - Server offline at http://127.0.0.1:8000/api";
        setError(errorMsg);
        
        // Retrieve offline simulation data
        const matched = STATIC_VEHICLES_MAP[slug] || STATIC_VEHICLES_MAP['tesla-model-3'];
        setVehicle(matched);
        
        const otherMocks = Object.values(STATIC_VEHICLES_MAP).filter((car: any) => car.slug !== slug);
        setRelatedVehicles(otherMocks);
      } finally {
        setLoading(false);
      }
    }

    loadVehicle();
  }, [slug]);

  // Estimator logic
  const calculateMonthlyPayment = () => {
    if (!vehicle) return "0.00";
    
    const basePrice = Number(vehicle.pricing?.base_price || 0);
    
    // Add custom adjustments if upgrades are selected
    let adjustedPrice = basePrice;
    if (customCeramicCoating) adjustedPrice += 1200;
    if (customWinterTires) adjustedPrice += 1500;
    if (customPerformanceTuning) adjustedPrice += 2500;

    const downPayment = (adjustedPrice * downPaymentPercent) / 100;
    const principal = adjustedPrice - downPayment;
    const monthlyRate = (interestAPR / 12) / 100;

    if (monthlyRate === 0) {
      return (principal / loanTerm).toFixed(2);
    }

    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
                    (Math.pow(1 + monthlyRate, loanTerm) - 1);
                    
    return isNaN(payment) ? "0.00" : payment.toFixed(2);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !inquiryPhone) {
      alert("Please fill in your contact information.");
      return;
    }

    const upgrades = [];
    if (customCeramicCoating) upgrades.push("Ceramic Coating ($1,200)");
    if (customWinterTires) upgrades.push("Winter Tires Pack ($1,500)");
    if (customPerformanceTuning) upgrades.push("AI Performance Tuning ($2,500)");

    const basePrice = Number(vehicle?.pricing?.base_price || 0);
    let finalQuote = basePrice;
    if (customCeramicCoating) finalQuote += 1200;
    if (customWinterTires) finalQuote += 1500;
    if (customPerformanceTuning) finalQuote += 2500;

    const newOrder = {
      id: Date.now(),
      vehicle_id: vehicle?.id || 0,
      vehicle_title: vehicle?.title || "Modern Vehicle",
      vehicle_slug: vehicle?.slug || "vehicle-slug",
      customer_name: inquiryName,
      customer_email: inquiryEmail,
      customer_phone: inquiryPhone,
      selected_upgrades: upgrades,
      estimated_monthly_payment: calculateMonthlyPayment(),
      final_quote: finalQuote,
      timestamp: new Date().toISOString()
    };

    const existing = localStorage.getItem('sellio_autos_modern_orders');
    const list = existing ? JSON.parse(existing) : [];
    list.push(newOrder);
    localStorage.setItem('sellio_autos_modern_orders', JSON.stringify(list));

    setInquirySuccess(true);
    setInquiryName('');
    setInquiryEmail('');
    setInquiryPhone('');
    setCustomCeramicCoating(false);
    setCustomWinterTires(false);
    setCustomPerformanceTuning(false);

    setTimeout(() => {
      setInquirySuccess(false);
    }, 5000);
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f4f7fa', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#007bff', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ letterSpacing: '2px', fontWeight: 600 }}>SYNCHRONIZING VEHICLE CATALOG SPECIFICATIONS...</h2>
          <div style={{ height: '4px', width: '200px', backgroundColor: '#e2e8f0', margin: '2rem auto', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', height: '100%', width: '50%', backgroundColor: '#007bff', animation: 'skeletonSlide 1.5s infinite linear' }}></div>
          </div>
        </div>
        <style>{`
          @keyframes skeletonSlide {
            0% { left: -50%; }
            100% { left: 100%; }
          }
        `}</style>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div style={{ backgroundColor: '#f4f7fa', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', padding: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Vehicle Not Found</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>The requested vehicle specs sheet could not be mapped.</p>
          <Link href={getThemeLink('/explore')} className="md-btn md-btn-cta">
            Back to Registry Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="autos-modern-wrapper" style={{ backgroundColor: '#f8fafc' }}>
      <ModernHeader />

      {/* Main Details Wrapper */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 5% 5rem' }}>
        
        {/* Breadcrumb navigation links */}
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
          <Link href={getThemeLink('/')} style={{ color: '#007bff', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href={getThemeLink('/explore')} style={{ color: '#007bff', textDecoration: 'none' }}>Listings</Link>
          <span>/</span>
          <span style={{ color: '#333', fontWeight: 600 }}>{vehicle.title}</span>
        </div>

        {/* Catalog Connection Offline Resiliency alerts */}
        {error && (
          <div className="md-error-alert" style={{
              border: '2px solid var(--md-primary)',
              borderRadius: '10px',
              padding: '1.5rem',
              marginBottom: '2rem',
              backgroundColor: 'rgba(0, 31, 64, 0.95)',
              boxShadow: '0 4px 20px rgba(0, 123, 255, 0.2)',
              color: 'white'
          }}>
              <h4 className="md-text-primary md-fw-bold" style={{ fontSize: '1.3rem', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#66b2ff' }}>
                  🛰️ DATABASE CONNECTION WARNING: Local catalog resilience fallback active
              </h4>
              <p style={{ fontSize: '0.95rem', margin: '0 0 1rem', color: '#ccc', lineHeight: 1.6 }}>
                  STATUS: [OFFLINE] | LATENCY: [TIMEOUT] <br/>
                  REASON: Axios connection failed to 127.0.0.1:8000. Laravel backend database node unresponsive.<br/>
                  ACTION: Gracefully activated premium offline node resilience. Loading high-fidelity local catalog backups...
              </p>
              <div style={{
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  backgroundColor: '#020d1a',
                  padding: '1rem',
                  borderRadius: '6px',
                  color: '#ff6b6b',
                  overflowX: 'auto',
                  border: '1px solid #002d5a'
              }}>
                  {error}
              </div>
          </div>
        )}

        {/* Hero Specs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
          
          {/* Images block */}
          <div>
            <div style={{ overflow: 'hidden', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', backgroundColor: 'white', padding: '1rem', marginBottom: '1.5rem' }}>
              <img 
                src={vehicle.media?.main_photo || vehicle.featured_image || "/themes/autos/modern/11.webp"} 
                alt={vehicle.title} 
                style={{ width: '100%', borderRadius: '8px', objectFit: 'contain' }}
              />
            </div>
            
            {/* Features highlight bar */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1.1rem' }}>Description</h4>
              <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>
                {vehicle.description || vehicle.short_description || "No descriptions available for this specific vehicle model."}
              </p>
            </div>
          </div>

          {/* Specs sheet and checkout form */}
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ 
                backgroundColor: 'rgba(0,123,255,0.1)', 
                color: 'var(--md-primary)', 
                fontWeight: 700, 
                fontSize: '0.85rem', 
                padding: '0.35rem 1rem', 
                borderRadius: '50px',
                textTransform: 'uppercase',
                display: 'inline-block',
                marginBottom: '1rem'
              }}>
                {vehicle.specs?.condition || 'Premium Spec'}
              </span>
              <h1 style={{ fontWeight: 700, fontSize: '2.5rem', marginBottom: '0.5rem', lineHeight: 1.2 }}>{vehicle.title}</h1>
              <h2 style={{ color: 'var(--md-primary)', fontWeight: 700, fontSize: '2rem', margin: 0 }}>
                {vehicle.pricing?.formatted || `$${Number(vehicle.pricing?.base_price || 0).toLocaleString()}`}
              </h2>
            </div>

            {/* Premium specs list grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '3rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#999', textTransform: 'uppercase', display: 'block' }}>Make</span>
                <span style={{ fontWeight: 600, color: '#333' }}>{vehicle.specs?.make || 'N/A'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#999', textTransform: 'uppercase', display: 'block' }}>Model</span>
                <span style={{ fontWeight: 600, color: '#333' }}>{vehicle.specs?.model || 'N/A'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#999', textTransform: 'uppercase', display: 'block' }}>Year</span>
                <span style={{ fontWeight: 600, color: '#333' }}>{vehicle.specs?.year || '2025'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#999', textTransform: 'uppercase', display: 'block' }}>Engine</span>
                <span style={{ fontWeight: 600, color: '#333' }}>{vehicle.specs?.engine || 'Electric'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#999', textTransform: 'uppercase', display: 'block' }}>Transmission</span>
                <span style={{ fontWeight: 600, color: '#333' }}>{vehicle.specs?.transmission || 'Automatic'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#999', textTransform: 'uppercase', display: 'block' }}>Mileage</span>
                <span style={{ fontWeight: 600, color: '#333' }}>{vehicle.specs?.mileage || 'Available Now'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#999', textTransform: 'uppercase', display: 'block' }}>Drivetrain</span>
                <span style={{ fontWeight: 600, color: '#333' }}>{vehicle.specs?.drivetrain || 'AWD'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#999', textTransform: 'uppercase', display: 'block' }}>Warranty</span>
                <span style={{ fontWeight: 600, color: '#333' }}>{vehicle.specs?.warranty || '48 Months'}</span>
              </div>
            </div>

            {/* Custom Interactive Upgrades Drawer */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '3rem' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.2rem', color: '#111' }}>Tailor & Secure Your Ride</h4>
              
              {/* Optional enhancements checkboxes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.95rem' }}>
                  <input 
                    type="checkbox" 
                    checked={customCeramicCoating}
                    onChange={(e) => setCustomCeramicCoating(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span>Premium Ceramic Coating (<strong>+$1,200</strong>)</span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.95rem' }}>
                  <input 
                    type="checkbox" 
                    checked={customWinterTires}
                    onChange={(e) => setCustomWinterTires(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span>Winter Tires Pack (<strong>+$1,500</strong>)</span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.95rem' }}>
                  <input 
                    type="checkbox" 
                    checked={customPerformanceTuning}
                    onChange={(e) => setCustomPerformanceTuning(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span>AI Performance Tuning (<strong>+$2,500</strong>)</span>
                </label>
              </div>

              {/* Stateful reservation inquiry forms */}
              {inquirySuccess ? (
                <div style={{ 
                  backgroundColor: '#d4edda', 
                  color: '#155724', 
                  padding: '1rem', 
                  borderRadius: '8px', 
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                  border: '1px solid #c3e6cb'
                }}>
                  🎉 <strong>Booking Secured!</strong> Your modern catalog quote inquiry has been successfully dispatched to the executive dealers desk. Check LocalStorage order registry keys!
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input 
                    type="text" 
                    className="md-search-input"
                    placeholder="Your Full Name"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                  <input 
                    type="email" 
                    className="md-search-input"
                    placeholder="Email Address"
                    required
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                  <input 
                    type="tel" 
                    className="md-search-input"
                    placeholder="Phone Number"
                    required
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                  <button type="submit" className="md-btn md-btn-cta" style={{ width: '100%', boxSizing: 'border-box', padding: '1rem' }}>
                    Lock In Quote & Secure Ride
                  </button>
                </form>
              )}
            </div>

            {/* Estimator monthly calculator */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.2rem', color: '#111' }}>Monthly Lease Estimator</h4>
              
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.95rem', color: '#666' }}>Estimated Monthly Lease Payment</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--md-primary)' }}>${calculateMonthlyPayment()}/mo</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem', color: '#444' }}>
                    <span>Down Payment (<strong>{downPaymentPercent}%</strong>)</span>
                    <span>${((Number(vehicle.pricing?.base_price || 0) * downPaymentPercent) / 100).toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="50" 
                    step="5"
                    value={downPaymentPercent} 
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem', color: '#444' }}>
                    <span>Interest Rate (<strong>{interestAPR}% APR</strong>)</span>
                  </div>
                  <input 
                    type="range" 
                    min="1.9" 
                    max="9.9" 
                    step="0.5"
                    value={interestAPR} 
                    onChange={(e) => setInterestAPR(Number(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem', color: '#444' }}>
                    <span>Lease Duration (<strong>{loanTerm} Months</strong>)</span>
                  </div>
                  <input 
                    type="range" 
                    min="24" 
                    max="72" 
                    step="12"
                    value={loanTerm} 
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Related models */}
        <section style={{ borderTop: '1px solid #e2e8f0', paddingTop: '4rem', marginTop: '4rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2.5rem' }}>Related Vehicles You Might Like</h2>
          
          <div className="md-grid">
            {relatedVehicles.length > 0 ? (
              relatedVehicles.slice(0, 3).map((car) => {
                const specLabel = `${car.specs?.year || car.year || '2025'} | ${car.specs?.engine || car.fuel_type || 'Electric'} | ${car.specs?.transmission || car.transmission || 'Automatic'}`;
                return (
                  <ModernCarCard 
                    key={car.id} 
                    title={car.title}
                    desc={specLabel}
                    price={car.pricing?.formatted || `$${Number(car.pricing?.base_price || 0).toLocaleString()}`}
                    image={car.media?.main_photo || car.featured_image || "/themes/autos/modern/11.webp"}
                    slug={car.slug}
                  />
                );
              })
            ) : (
              // Offline fallback models list
              Object.values(STATIC_VEHICLES_MAP)
                .filter(c => c.slug !== slug)
                .slice(0, 3)
                .map((car, idx) => (
                  <ModernCarCard 
                    key={idx} 
                    title={car.title}
                    desc={car.short_description}
                    price={car.pricing?.formatted}
                    image={car.media?.main_photo}
                    slug={car.slug}
                  />
                ))
            )}
          </div>
        </section>

      </div>

      <ModernFooter />
    </div>
  );
}
