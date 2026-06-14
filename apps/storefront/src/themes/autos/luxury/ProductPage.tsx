'use client';

import React, { useState, useEffect } from 'react';
import type { Vehicle } from '@sellio/types';
import { LuxuryHeader, LuxuryCarCard, LuxuryFooter } from './components';
import { CatalogSyncAlert } from '@/themes/autos/shared/CatalogSyncAlert';
import {
  fetchVehicleDetail,
  resolveVehicleFailure,
} from '@/themes/autos/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/autos/shared/useDemoFallbackAllowed';
import { useAutosThemeLink } from '@/themes/autos/shared/useAutosThemeLink';
import { submitVehicleInquiry } from '@/themes/autos/shared/submit-vehicle-inquiry';
import {
  saveVehicleInquirySnapshot,
  redirectToVehicleInquiryConfirmation,
} from '@/themes/autos/shared/vehicle-inquiry-confirmation';
import {
  formatVehiclePrice,
  getLuxuryVehicleImage,
  getLuxuryVehicleSpecLabel,
} from '@/themes/autos/shared/vehicle-utils';

interface ProductPageProps {
  slug: string;
}

export default function ProductPage({ slug }: ProductPageProps) {
  const themeLink = useAutosThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [relatedVehicles, setRelatedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

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
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadVehicleDetails() {
      setLoading(true);
      const result = await fetchVehicleDetail(slug);

      if (result.ok) {
        setVehicle(result.response.data);
        setRelatedVehicles(result.response.related_vehicles || []);
        setUseFallback(false);
        setApiError(null);
      } else {
        setApiError(result.error);
        const resolution = resolveVehicleFailure(slug, allowDemo, 'luxury');

        if (resolution.mode === 'demo') {
          setVehicle(resolution.vehicle);
          setRelatedVehicles(resolution.related);
          setUseFallback(true);
        } else {
          setVehicle(null);
          setRelatedVehicles([]);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadVehicleDetails();
  }, [slug, allowDemo]);

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

  const handleVIPInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle || !inquiryName || !inquiryEmail || !inquiryPhone || !inquiryDate) {
      setFormError('Please fill in all required booking details.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    const preferredTime = inquiryTime.includes('PM')
      ? 'PM'
      : inquiryTime.includes('AM')
        ? 'AM'
        : 'Anytime';

    const result = await submitVehicleInquiry({
      vehicleId: vehicle.id,
      vehicleSlug: vehicle.slug,
      useFallback,
      storageKey: 'sellio_autos_luxury_inquiries',
      fullName: inquiryName,
      email: inquiryEmail,
      phone: inquiryPhone,
      preferredDate: inquiryDate,
      preferredTime,
      message: inquiryTime ? `Preferred time: ${inquiryTime}` : undefined,
      demoRecord: {
        id: Date.now(),
        vehicle_id: vehicle.id,
        vehicle_title: vehicle.title,
        name: inquiryName,
        email: inquiryEmail,
        phone: inquiryPhone,
        preferred_date: inquiryDate,
        preferred_time: inquiryTime || '12:00 PM',
        timestamp: new Date().toISOString(),
      },
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    saveVehicleInquirySnapshot({
      id: result.inquiryId,
      vehicleId: vehicle.id,
      vehicleTitle: vehicle.title,
      vehicleSlug: vehicle.slug,
      contactName: inquiryName,
      contactEmail: inquiryEmail,
      contactPhone: inquiryPhone,
      status: 'pending',
    });
    redirectToVehicleInquiryConfirmation(themeLink, result.inquiryId);
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
          <p style={{ color: 'var(--lx-text-muted)', marginBottom: '2rem' }}>
            {apiError || 'The requested vehicle could not be loaded from the ledger.'}
          </p>
          <a href={themeLink('/explore')} className="lx-btn lx-btn-gold">
            Back to catalog
          </a>
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

      {useFallback && apiError && (
        <div className="lx-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="lx" />
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

            <form onSubmit={handleVIPInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {formError && (
                <p className="lx-form-error" role="alert">
                  {formError}
                </p>
              )}

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

          </div>

        </div>
      </section>

      {/* Related Premium Showroom Grid */}
      {relatedVehicles.length > 0 && (
        <section className="lx-section" style={{ borderTop: '1px solid #333', backgroundColor: '#111' }}>
          <h3 className="lx-section-title" style={{ color: '#fff' }}>Related Masterpieces</h3>
          <div className="lx-grid">
            {relatedVehicles.slice(0, 3).map((car) => (
              <LuxuryCarCard
                key={car.slug}
                title={car.title}
                specs={getLuxuryVehicleSpecLabel(car)}
                price={formatVehiclePrice(car)}
                image={getLuxuryVehicleImage(car)}
                slug={car.slug}
              />
            ))}
          </div>
        </section>
      )}

      <LuxuryFooter />
    </div>
  );
}
