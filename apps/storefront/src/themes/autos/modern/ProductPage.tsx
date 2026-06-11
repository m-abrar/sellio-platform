'use client';

import React, { useState, useEffect } from 'react';
import type { Vehicle } from '@sellio/types';
import Link from 'next/link';
import { ModernHeader, ModernCarCard, ModernFooter } from './components';
import { CatalogSyncAlert } from '@/themes/autos/shared/CatalogSyncAlert';
import {
  fetchVehicleDetail,
  getFallbackRelatedVehicles,
  resolveVehicleFailure,
} from '@/themes/autos/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/autos/shared/useDemoFallbackAllowed';
import { useAutosThemeLink } from '@/themes/autos/shared/useAutosThemeLink';
import {
  formatVehiclePrice,
  getVehicleImage,
  getVehicleSpecLabel,
} from '@/themes/autos/shared/vehicle-utils';
import { api } from '@/lib/storefront-api';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVehicle() {
      setLoading(true);
      const result = await fetchVehicleDetail(slug);

      if (result.ok) {
        setVehicle(result.response.data);
        setRelatedVehicles(result.response.related_vehicles || []);
        setUseFallback(false);
        setApiError(null);
      } else {
        setApiError(result.error);
        const resolution = resolveVehicleFailure(slug, allowDemo, 'modern');

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

    loadVehicle();
  }, [slug, allowDemo]);

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

  const buildInquiryMessage = () => {
    const upgrades = [];
    if (customCeramicCoating) upgrades.push('Ceramic Coating ($1,200)');
    if (customWinterTires) upgrades.push('Winter Tires Pack ($1,500)');
    if (customPerformanceTuning) upgrades.push('AI Performance Tuning ($2,500)');

    const basePrice = Number(vehicle?.pricing?.base_price || 0);
    let finalQuote = basePrice;
    if (customCeramicCoating) finalQuote += 1200;
    if (customWinterTires) finalQuote += 1500;
    if (customPerformanceTuning) finalQuote += 2500;

    const lines = [
      `Estimated monthly payment: $${calculateMonthlyPayment()}/mo`,
      `Finance: ${downPaymentPercent}% down, ${interestAPR}% APR, ${loanTerm} months`,
      `Configured quote: $${finalQuote.toLocaleString()}`,
    ];

    if (upgrades.length) {
      lines.push(`Selected upgrades: ${upgrades.join(', ')}`);
    }

    return lines.join('\n');
  };

  const resetInquiryForm = () => {
    setInquiryName('');
    setInquiryEmail('');
    setInquiryPhone('');
    setCustomCeramicCoating(false);
    setCustomWinterTires(false);
    setCustomPerformanceTuning(false);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle || !inquiryName || !inquiryEmail || !inquiryPhone) {
      setFormError('Please fill in your contact information.');
      return;
    }

    setFormError(null);

    if (useFallback) {
      const newOrder = {
        id: Date.now(),
        vehicle_id: vehicle.id,
        vehicle_title: vehicle.title,
        vehicle_slug: vehicle.slug,
        customer_name: inquiryName,
        customer_email: inquiryEmail,
        customer_phone: inquiryPhone,
        selected_upgrades: buildInquiryMessage(),
        timestamp: new Date().toISOString(),
      };

      const existing = localStorage.getItem('sellio_autos_modern_orders');
      const list = existing ? JSON.parse(existing) : [];
      list.push(newOrder);
      localStorage.setItem('sellio_autos_modern_orders', JSON.stringify(list));
      setInquirySuccess(true);
      resetInquiryForm();
      setTimeout(() => setInquirySuccess(false), 5000);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createVehicleInquiry(vehicle.id, {
        full_name: inquiryName.trim(),
        email: inquiryEmail.trim(),
        phone: inquiryPhone.trim(),
        message: buildInquiryMessage(),
      });
      setInquirySuccess(true);
      resetInquiryForm();
      setTimeout(() => setInquirySuccess(false), 5000);
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      setFormError(axiosError.response?.data?.message ?? 'Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            {apiError || 'The requested vehicle specs sheet could not be mapped.'}
          </p>
          <Link href={themeLink('/explore')} className="md-btn md-btn-cta">
            Back to inventory
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
          <Link href={themeLink('/')} style={{ color: '#007bff', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href={themeLink('/explore')} style={{ color: '#007bff', textDecoration: 'none' }}>
            Listings
          </Link>
          <span>/</span>
          <span style={{ color: '#333', fontWeight: 600 }}>{vehicle.title}</span>
        </div>

        {useFallback && apiError && (
          <div className="md-alert-slot">
            <CatalogSyncAlert variant="demo" error={apiError} classPrefix="md" />
          </div>
        )}

        {/* Hero Specs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
          
          {/* Images block */}
          <div>
            <div style={{ overflow: 'hidden', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', backgroundColor: 'white', padding: '1rem', marginBottom: '1.5rem' }}>
              <img 
                src={getVehicleImage(vehicle)} 
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
                {formatVehiclePrice(vehicle)}
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
                  🎉 <strong>Inquiry sent!</strong> {useFallback ? 'Your quote request was saved in demo mode.' : 'The dealer will contact you shortly with next steps.'}
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {formError && (
                    <p className="md-form-error" role="alert">
                      {formError}
                    </p>
                  )}
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
                  <button type="submit" className="md-btn md-btn-cta" style={{ width: '100%', boxSizing: 'border-box', padding: '1rem' }} disabled={isSubmitting}>
                    {isSubmitting ? 'Sending inquiry...' : 'Lock In Quote & Secure Ride'}
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
              relatedVehicles.slice(0, 3).map((car) => (
                <ModernCarCard
                  key={car.id}
                  title={car.title}
                  desc={getVehicleSpecLabel(car)}
                  price={formatVehiclePrice(car)}
                  image={getVehicleImage(car)}
                  slug={car.slug}
                />
              ))
            ) : useFallback ? (
              getFallbackRelatedVehicles(slug, 'modern').map((car) => (
                <ModernCarCard
                  key={car.id}
                  title={car.title}
                  desc={getVehicleSpecLabel(car)}
                  price={formatVehiclePrice(car)}
                  image={getVehicleImage(car)}
                  slug={car.slug}
                />
              ))
            ) : null}
          </div>
        </section>

      </div>

      <ModernFooter />
    </div>
  );
}
