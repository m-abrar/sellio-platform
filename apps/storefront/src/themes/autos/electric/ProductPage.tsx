'use client';

import React, { useState, useEffect } from 'react';
import type { Vehicle } from '@/types';
import { ElectricHeader, ElectricFooter } from './components';
import { CatalogSyncAlert } from '@/themes/autos/shared/CatalogSyncAlert';
import { fetchVehicleDetail, resolveVehicleFailure } from '@/themes/autos/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/autos/shared/useDemoFallbackAllowed';
import { submitVehicleInquiry } from '@/themes/autos/shared/submit-vehicle-inquiry';
import { useAutosThemeLink } from '@/themes/autos/shared/useAutosThemeLink';
import {
  saveVehicleInquirySnapshot,
  redirectToVehicleInquiryConfirmation,
} from '@/themes/autos/shared/vehicle-inquiry-confirmation';
import { LiveChatWidget } from '@/components/chat/LiveChatWidget';

interface EVItem {
  id: number;
  title: string;
  price: string;
  numericPrice: number;
  range: string;
  battery: string;
  charge: string;
  acCharge: string;
  acceleration: string;
  motorType: string;
  image: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
}

// Fallback EV models
const FALLBACK_CLASSIFIEDS: EVItem[] = [
  { id: 1, title: "2025 Tesla Model Y", price: "$47,000 USD", numericPrice: 47000, range: "330 Miles", battery: "75 kWh", charge: "250 kW", acCharge: "11.5 kW", acceleration: "4.8s", motorType: "Dual Motor AWD", image: "/themes/autos/electric/tesla_y.png", slug: "tesla-model-y", brand: "Tesla", category: "Electric", description: "The Model Y is a fully electric mid-size SUV with premium seating capacity, advanced autopilot autopilot driver assists, and peak acceleration metrics." },
  { id: 2, title: "2025 Rivian R1T", price: "$70,000 USD", numericPrice: 70000, range: "314 Miles", battery: "135 kWh", charge: "200 kW", acCharge: "11.5 kW", acceleration: "3.0s", motorType: "Quad Motor AWD", image: "/themes/autos/electric/rivian_r1t.png", slug: "rivian-r1t", brand: "Rivian", category: "Electric", description: "An electric adventure truck designed for any terrain. Extremely powerful quad-motor drive system, versatile truck bed capacity, and spacious custom cabin." },
  { id: 3, title: "2024 Kia EV6", price: "$42,000 USD", numericPrice: 42000, range: "310 Miles", battery: "77.4 kWh", charge: "350 kW", acCharge: "10.9 kW", acceleration: "4.6s", motorType: "Single Motor RWD", image: "/themes/autos/electric/kia_ev6.png", slug: "kia-ev6", brand: "Kia", category: "Electric", description: "Aerodynamic crossover styling built on high-power 800V architecture enabling ultra-fast charging capabilities. Exceptional handling and interior cabin styling." },
  { id: 4, title: "2024 Lucid Air", price: "$87,400 USD", numericPrice: 87400, range: "410 Miles", battery: "112 kWh", charge: "300 kW", acCharge: "19.2 kW", acceleration: "3.5s", motorType: "Dual Motor AWD", image: "/themes/autos/electric/lucid_air.png", slug: "lucid-air", brand: "Lucid", category: "Electric", description: "Breathtaking premium executive EV luxury sedan. Industry-leading EPA range performance, spacious layout coordinates, and modern digital cockpit layouts." },
];

const translateVehicleToEV = (car: Vehicle): EVItem => {
  const generatedSlug = car.slug || car.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  // High-fidelity static EV values for Round 2 dynamic database mapping as requested
  let range = "310 Miles";
  let battery = "77.4 kWh";
  let charge = "250 kW";
  let acCharge = "11.5 kW";
  let acceleration = "4.8s";
  let motorType = "Dual Motor AWD";
  let modelYear = car.specs?.year || 2025;
  
  if (car.title.toLowerCase().includes('tesla')) {
    range = "330 Miles";
    battery = "75 kWh";
    charge = "250 kW";
    acCharge = "11.5 kW";
    acceleration = "4.8s";
    motorType = "Dual Motor AWD";
  } else if (car.title.toLowerCase().includes('rivian')) {
    range = "314 Miles";
    battery = "135 kWh";
    charge = "200 kW";
    acCharge = "11.5 kW";
    acceleration = "3.0s";
    motorType = "Quad Motor AWD";
  } else if (car.title.toLowerCase().includes('lucid')) {
    range = "410 Miles";
    battery = "112 kWh";
    charge = "300 kW";
    acCharge = "19.2 kW";
    acceleration = "3.5s";
    motorType = "Dual Motor AWD";
  } else {
    // Deterministic variations by ID
    range = `${300 + (car.id * 15) % 120} Miles`;
    battery = `${65 + (car.id * 8) % 70} kWh`;
    charge = `${150 + (car.id * 50) % 210} kW`;
    acCharge = "10.9 kW";
    acceleration = `${4.0 + (car.id * 0.3) % 2.5}s`;
    motorType = car.id % 2 === 0 ? "Dual Motor AWD" : "Single Motor RWD";
  }

  const cat = car.taxonomy?.category;
  const categoryStr = typeof cat === 'string' ? cat : (cat && typeof cat === 'object' ? (cat.title || 'Electric') : 'Electric');
  
  return {
    id: car.id,
    title: car.title.startsWith('20') ? car.title : `${modelYear} ${car.title}`,
    price: car.pricing?.formatted || `$${Number(car.pricing?.base_price || 0).toLocaleString()} USD`,
    numericPrice: car.pricing?.base_price || 0,
    range,
    battery,
    charge,
    acCharge,
    acceleration,
    motorType,
    image: car.media?.main_photo || car.featured_image || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=600",
    slug: generatedSlug,
    brand: car.specs?.make || car.title.split(' ')[0] || "EV",
    category: categoryStr,
    description: car.description || "Fully dynamic premium electric vehicle. Delivers unparalleled zero-emissions driving efficiency, instant motor torque, and a high-fidelity digital cockpit layout."
  };
};

export default function ProductPage({ slug }: { slug: string }) {
  const themeLink = useAutosThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  // Component states
  const [item, setItem] = useState<EVItem | null>(null);
  const [related, setRelated] = useState<EVItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Lease Estimator Calculator state variables
  const [downPayment, setDownPayment] = useState(5000);
  const [leaseTerm, setLeaseTerm] = useState(36);
  const [includeWallCharger, setIncludeWallCharger] = useState(false);

  // Reservation Form state variables
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerNotes, setBuyerNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVehicle() {
      if (!slug) return;

      setLoading(true);
      const result = await fetchVehicleDetail(slug);

      if (result.ok) {
        setItem(translateVehicleToEV(result.response.data));
        const relatedRaw = result.response.related_vehicles || [];
        setRelated(
          relatedRaw
            .filter((car) => car.slug !== slug)
            .slice(0, 3)
            .map(translateVehicleToEV),
        );
        setUseFallback(false);
        setApiError(null);
      } else {
        setApiError(result.error);
        const resolution = resolveVehicleFailure(slug, allowDemo, 'electric');

        if (resolution.mode === 'demo') {
          setItem(translateVehicleToEV(resolution.vehicle));
          setRelated(resolution.related.map(translateVehicleToEV));
          setUseFallback(true);
        } else {
          setItem(null);
          setRelated([]);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadVehicle();
  }, [slug, allowDemo]);

  // Compute monthly lease dynamically
  const calculateLeaseRate = () => {
    if (!item) return 0;
    const baseValue = item.numericPrice;
    const residualFactor = 0.55; // EV residual value after term
    const moneyFactor = 0.0025; // Equates to ~6% APR
    
    let vehicleCapitalizedCost = baseValue - downPayment;
    if (includeWallCharger) vehicleCapitalizedCost += 850;

    const depreciationFee = (vehicleCapitalizedCost - (baseValue * residualFactor)) / leaseTerm;
    const financeFee = (vehicleCapitalizedCost + (baseValue * residualFactor)) * moneyFactor;
    
    const monthlyRate = depreciationFee + financeFee;
    return Math.max(99, Math.round(monthlyRate));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (!item) return;

    setFormError(null);

    const inquiryMessage = [
      `Down payment: $${downPayment.toLocaleString()}`,
      `Lease term: ${leaseTerm} months`,
      `Estimated monthly: $${calculateLeaseRate()}/mo`,
      includeWallCharger ? 'Wall charger included' : '',
      buyerNotes.trim(),
    ]
      .filter(Boolean)
      .join('\n');

    const orderData = {
      orderId: `EV-RES-${Date.now()}-${item.id}`,
      listingId: item.id,
      title: item.title,
      price: item.price,
      buyerName,
      buyerEmail,
      downPayment,
      leaseTerm,
      includeWallCharger,
      computedMonthlyLease: `$${calculateLeaseRate()}/mo`,
      notes: buyerNotes,
      date: new Date().toLocaleString(),
      theme: 'autos_electric',
    };

    const result = await submitVehicleInquiry({
      vehicleId: item.id,
      vehicleSlug: item.slug,
      useFallback,
      storageKey: 'sellio_autos_electric_orders',
      fullName: buyerName,
      email: buyerEmail,
      message: inquiryMessage,
      demoRecord: orderData,
    });

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    saveVehicleInquirySnapshot({
      id: result.inquiryId,
      vehicleId: item.id,
      vehicleTitle: item.title,
      vehicleSlug: item.slug,
      contactName: buyerName,
      contactEmail: buyerEmail,
      message: inquiryMessage,
      status: 'pending',
    });
    redirectToVehicleInquiryConfirmation(themeLink, result.inquiryId);
  };

  return (
    <div className="ev-product-wrapper">
      <ElectricHeader />

      <div className="ev-product-container">
        <div>
          <a href={themeLink('/')} className="ev-product-back-link">
            &larr; Back to EV Catalog Showcase
          </a>
        </div>

        {useFallback && apiError && (
          <div className="ev-alert-slot">
            <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ev" />
          </div>
        )}
        {apiError && !useFallback && (
          <div className="ev-alert-slot">
            <CatalogSyncAlert variant="production" error={apiError} classPrefix="ev" />
          </div>
        )}

        {loading ? (
          <div className="ev-product-main-grid">
            <div className="ev-product-gallery">
              <div className="ev-product-main-img-wrap" style={{ animation: 'ev-pulse 1.5s infinite', backgroundColor: 'var(--ev-card-bg)' }} />
            </div>
            <div className="ev-product-details-block">
              <div style={{ height: '32px', width: '70%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
              <div style={{ height: '40px', width: '30%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginTop: '1rem' }} />
              <div style={{ height: '150px', width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginTop: '1.5rem' }} />
            </div>
          </div>
        ) : !item ? (
          <div style={{ textAlign: 'center', padding: '6rem 1rem', background: 'var(--ev-card-bg)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ fontFamily: 'var(--ev-font-main)', color: 'var(--ev-accent-green)' }}>Vehicle profile not found in EV registry.</h3>
          </div>
        ) : (
          <>
            <div className="ev-product-main-grid">
              {/* Left Column: Gallery & EV Spec sheet */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="ev-product-gallery">
                  <div className="ev-product-main-img-wrap">
                    <img src={item.image} className="ev-product-main-img" alt={item.title} loading="lazy" />
                  </div>
                </div>

                <div className="ev-product-description-card">
                  <h4 className="ev-product-card-title">EV Performance Spec Sheet</h4>
                  <div className="ev-product-specs-grid">
                    <div className="ev-product-spec-item">
                      <span className="ev-product-spec-label">EPA Range Estimator</span>
                      <span className="ev-product-spec-value">⚡ {item.range}</span>
                    </div>
                    <div className="ev-product-spec-item">
                      <span className="ev-product-spec-label">Battery Capacity</span>
                      <span className="ev-product-spec-value">🔋 {item.battery}</span>
                    </div>
                    <div className="ev-product-spec-item">
                      <span className="ev-product-spec-label">DC Fast Charge Max</span>
                      <span className="ev-product-spec-value">🔌 {item.charge}</span>
                    </div>
                    <div className="ev-product-spec-item">
                      <span className="ev-product-spec-label">AC Level 2 Rate</span>
                      <span className="ev-product-spec-value">⚙️ {item.acCharge}</span>
                    </div>
                    <div className="ev-product-spec-item">
                      <span className="ev-product-spec-label">0-60 MPH Time</span>
                      <span className="ev-product-spec-value">🏁 {item.acceleration}</span>
                    </div>
                    <div className="ev-product-spec-item">
                      <span className="ev-product-spec-label">Drivetrain Configuration</span>
                      <span className="ev-product-spec-value">{item.motorType}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Title, Description, Lease Calculator, Booking Form */}
              <div className="ev-product-details-block">
                <div className="ev-product-description-card">
                  <div className="ev-product-meta-header">
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--ev-accent-green)', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                      ⚡ Fully Electric drivetrain
                    </span>
                    <h1 className="ev-product-title">{item.title}</h1>
                    <div className="ev-product-price">{item.price}</div>
                    <div className="ev-product-meta-row">
                      <span className="ev-product-badge">{item.brand}</span>
                      <span className="ev-product-badge ev-product-badge-verified">Zero Emissions</span>
                      <span className="ev-product-badge">📍 Global Stock</span>
                    </div>
                  </div>
                  
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
                    <h4 className="ev-product-card-title" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ev-accent-blue)' }}>Sustainable Highlights</h4>
                    <p className="ev-product-description">
                      {item.description} Featuring state-of-the-art battery packaging, over-the-air smart tech diagnostics updates, lower operational costs, and immediate torque deliveries.
                    </p>
                  </div>
                </div>

                {/* Monthly Lease Rate Calculator */}
                <div className="ev-product-booking-drawer" style={{ borderColor: 'var(--ev-accent-blue)', boxShadow: '0 0 15px rgba(0,255,255,0.1)' }}>
                  <h4 className="ev-product-card-title" style={{ margin: 0, border: 'none', padding: 0, color: 'var(--ev-accent-blue)' }}>💻 Live Lease rate Estimator</h4>
                  <div style={{ fontSize: '0.8rem', opacity: 0.75, lineHeight: '1.5' }}>
                    Configure monthly payment rates in real-time. Residual value estimations and DC network rates computed dynamically.
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '1.25rem' }}>
                    <div className="ev-booking-form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                        <span>Down Payment</span>
                        <span className="ev-text-green">${downPayment.toLocaleString()}</span>
                      </div>
                      <input 
                        type="range" 
                        min="2000" 
                        max="20000" 
                        step="500"
                        value={downPayment}
                        onChange={(e) => setDownPayment(Number(e.target.value))}
                        style={{ accentColor: 'var(--ev-accent-green)', cursor: 'pointer', marginTop: '0.5rem' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', opacity: 0.5 }}>
                        <span>Min $2,000</span>
                        <span>Max $20,000</span>
                      </div>
                    </div>

                    <div className="ev-booking-form-group">
                      <label className="ev-booking-label">Lease Duration Term</label>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                        {[24, 36, 48].map((term) => (
                          <button 
                            key={term}
                            type="button"
                            onClick={() => setLeaseTerm(term)}
                            style={{
                              flex: 1,
                              padding: '0.5rem',
                              backgroundColor: leaseTerm === term ? 'var(--ev-accent-blue)' : 'var(--ev-bg-dark)',
                              color: leaseTerm === term ? 'var(--ev-bg-dark)' : '#ffffff',
                              border: `1px solid ${leaseTerm === term ? 'var(--ev-accent-blue)' : 'rgba(255,255,255,0.1)'}`,
                              borderRadius: '6px',
                              fontWeight: 600,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              transition: 'var(--ev-transition)'
                            }}
                          >
                            {term} Months
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--ev-bg-dark)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Home Wallbox Installation</span>
                        <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>Level 2 AC AC Home Charging (+$850)</span>
                      </div>
                      <input 
                        type="checkbox"
                        checked={includeWallCharger}
                        onChange={(e) => setIncludeWallCharger(e.target.checked)}
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: 'var(--ev-accent-green)',
                          cursor: 'pointer'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', backgroundColor: 'rgba(0,255,255,0.04)', border: '1px solid rgba(0,255,255,0.15)', borderRadius: '8px', marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Estimated Cost:</span>
                      <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--ev-accent-blue)', textShadow: '0 0 10px rgba(0,255,255,0.2)' }}>
                        ${calculateLeaseRate()}<span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9' }}> / mo</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Secure Test Drive & Reservation Desk */}
                <div className="ev-product-booking-drawer">
                  <h4 className="ev-product-card-title" style={{ margin: 0, border: 'none', padding: 0 }}>🌱 Secure Grid Reservation</h4>
                  <div style={{ fontSize: '0.8rem', opacity: 0.75, lineHeight: '1.5' }}>
                    Reserve your allocation or schedule a secure L2-charged test drive node with verified EV advisory specialists.
                  </div>

                  <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="ev-booking-form-group">
                      <label className="ev-booking-label">Client Name *</label>
                      <input
                        type="text"
                        required
                        className="ev-booking-input"
                        placeholder="e.g. Liam Sterling"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                      />
                    </div>
                    <div className="ev-booking-form-group">
                      <label className="ev-booking-label">Secure Grid Email *</label>
                      <input
                        type="email"
                        required
                        className="ev-booking-input"
                        placeholder="e.g. liam@sustainable.io"
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                      />
                    </div>
                    <div className="ev-booking-form-group">
                      <label className="ev-booking-label">Configuration & Charging Request Notes (Optional)</label>
                      <textarea
                        rows={2}
                        className="ev-booking-input"
                        style={{ resize: 'none', height: '60px' }}
                        placeholder="e.g. Vetting standard DC rate maps. Advise if physical charging adapters are supplied..."
                        value={buyerNotes}
                        onChange={(e) => setBuyerNotes(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="ev-product-btn-reserve">
                      Lock Grid Allocation & Request Test Drive
                    </button>
                    {formError && (
                      <p style={{ color: '#fca5a5', fontSize: '0.85rem', marginTop: '0.75rem', textAlign: 'center' }}>
                        {formError}
                      </p>
                    )}
                  </form>
                </div>

                <div className="sl-chat-section">
                  <p className="sl-chat-section-label">Have questions?</p>
                  <LiveChatWidget vertical="vehicles" listingId={item.id} listingTitle={item.title} />
                </div>
              </div>
            </div>

            {/* Related EV Models */}
            {related.length > 0 && (
              <div className="ev-related-section">
                <h3 className="ev-related-title">⚡ Other High-Power EV Models</h3>
                <div className="ev-related-grid">
                  {related.map((relItem) => (
                    <a
                      key={relItem.id}
                      href={themeLink(`/product/${relItem.slug}`)}
                      className="ev-related-card"
                      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                    >
                      <div className="ev-related-img-wrap">
                        <img src={relItem.image} className="ev-related-img" alt={relItem.title} />
                      </div>
                      <div className="ev-related-info">
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--ev-accent-green)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                          ⚡ {relItem.brand}
                        </span>
                        <h4 className="ev-related-card-title">{relItem.title}</h4>
                        <div className="ev-related-price-row">
                          <span className="ev-related-price">{relItem.price.split(' ')[0]}</span>
                          <span style={{ fontSize: '0.75rem', opacity: 0.7, fontWeight: 600 }}>⚡ {relItem.range.split(' ')[0]} mi</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes ev-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .4; }
        }
      `}</style>

      <ElectricFooter />
    </div>
  );
}
