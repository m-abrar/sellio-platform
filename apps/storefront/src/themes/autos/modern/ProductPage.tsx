'use client';

import React, { useState, useEffect } from 'react';
import type { Vehicle } from '@sellio/types';
import Link from 'next/link';
import { ModernHeader, ModernCarCard, ModernFooter } from './components';
import {
  loadVehicleDetailPage,
} from '@/themes/autos/shared/catalog';
import { useAutosThemeLink } from '@/themes/autos/shared/useAutosThemeLink';
import {
  formatVehiclePrice,
  getVehicleImage,
  getVehicleSpecLabel,
} from '@/themes/autos/shared/vehicle-utils';
import { submitVehicleInquiry } from '@/themes/autos/shared/submit-vehicle-inquiry';
import {
  saveVehicleInquirySnapshot,
  redirectToVehicleInquiryConfirmation,
} from '@/themes/autos/shared/vehicle-inquiry-confirmation';

interface ProductPageProps {
  slug: string;
}

export default function ProductPage({ slug }: ProductPageProps) {
  const themeLink = useAutosThemeLink();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [relatedVehicles, setRelatedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [downPaymentPercent, setDownPaymentPercent] = useState(15);
  const [interestAPR, setInterestAPR] = useState(4.9);
  const [loanTerm, setLoanTerm] = useState(48);

  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [customCeramicCoating, setCustomCeramicCoating] = useState(false);
  const [customWinterTires, setCustomWinterTires] = useState(false);
  const [customPerformanceTuning, setCustomPerformanceTuning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVehicle() {
      setLoading(true);
      const result = await loadVehicleDetailPage(slug, 'modern', false);

      setVehicle(result.vehicle);
      setRelatedVehicles(result.related);
      setApiError(result.alertError);
      setLoading(false);
    }

    loadVehicle();
  }, [slug]);

  const calculateMonthlyPayment = () => {
    if (!vehicle) return '0.00';

    const basePrice = Number(vehicle.pricing?.base_price || 0);
    let adjustedPrice = basePrice;
    if (customCeramicCoating) adjustedPrice += 1200;
    if (customWinterTires) adjustedPrice += 1500;
    if (customPerformanceTuning) adjustedPrice += 2500;

    const downPayment = (adjustedPrice * downPaymentPercent) / 100;
    const principal = adjustedPrice - downPayment;
    const monthlyRate = interestAPR / 12 / 100;

    if (monthlyRate === 0) {
      return (principal / loanTerm).toFixed(2);
    }

    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) /
      (Math.pow(1 + monthlyRate, loanTerm) - 1);

    return isNaN(payment) ? '0.00' : payment.toFixed(2);
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
    setIsSubmitting(true);

    const result = await submitVehicleInquiry({
      vehicleId: vehicle.id,
      vehicleSlug: vehicle.slug,
      useFallback: false,
      storageKey: 'sellio_autos_modern_orders',
      fullName: inquiryName,
      email: inquiryEmail,
      phone: inquiryPhone,
      message: buildInquiryMessage(),
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
      message: buildInquiryMessage(),
      status: 'pending',
    });
    resetInquiryForm();
    redirectToVehicleInquiryConfirmation(themeLink, result.inquiryId);
  };

  if (loading) {
    return (
      <div className="md-loading-screen">
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontWeight: 600, letterSpacing: '0.04em' }}>Loading vehicle details...</h2>
          <div className="md-loading-bar" />
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="md-loading-screen">
        <div style={{ textAlign: 'center', maxWidth: '420px', padding: '0 1.5rem' }}>
          <h2 style={{ marginBottom: '0.75rem' }}>Vehicle Not Found</h2>
          <p className="md-text-muted" style={{ marginBottom: '1.75rem' }}>
            {apiError || 'The requested vehicle could not be found in our inventory.'}
          </p>
          <Link href={themeLink('/explore')} className="md-btn md-btn-cta">
            Back to inventory
          </Link>
        </div>
      </div>
    );
  }

  const specFields = [
    { label: 'Make', value: vehicle.specs?.make || 'N/A' },
    { label: 'Model', value: vehicle.specs?.model || 'N/A' },
    { label: 'Year', value: vehicle.specs?.year || '2025' },
    { label: 'Engine', value: vehicle.specs?.engine || 'Electric' },
    { label: 'Transmission', value: vehicle.specs?.transmission || 'Automatic' },
    { label: 'Mileage', value: vehicle.specs?.mileage || 'Available Now' },
    { label: 'Drivetrain', value: vehicle.specs?.drivetrain || 'AWD' },
    { label: 'Warranty', value: vehicle.specs?.warranty || '48 Months' },
  ];

  return (
    <>
      <ModernHeader />

      <div className="md-detail-shell">
        <nav className="md-breadcrumb" aria-label="Breadcrumb">
          <Link href={themeLink('/')}>Home</Link>
          <span>/</span>
          <Link href={themeLink('/explore')}>Inventory</Link>
          <span>/</span>
          <span>{vehicle.title}</span>
        </nav>

        <div className="md-detail-grid">
          <div>
            <div className="md-detail-panel md-detail-panel--hero-img">
              <img src={getVehicleImage(vehicle)} alt={vehicle.title} />
            </div>

            <div className="md-detail-panel">
              <h4 style={{ fontWeight: 700, margin: '0 0 0.85rem', fontSize: '1.05rem' }}>Description</h4>
              <p className="md-text-muted" style={{ lineHeight: 1.65, fontSize: '0.95rem', margin: 0 }}>
                {vehicle.description ||
                  vehicle.short_description ||
                  'No description available for this vehicle model.'}
              </p>
            </div>
          </div>

          <div>
            <span className="md-condition-badge">{vehicle.specs?.condition || 'Premium Spec'}</span>
            <h1 className="md-detail-title">{vehicle.title}</h1>
            <p className="md-detail-price">{formatVehiclePrice(vehicle)}</p>

            <div className="md-detail-panel">
              <div className="md-spec-grid">
                {specFields.map((field) => (
                  <div key={field.label} className="md-spec-item">
                    <label>{field.label}</label>
                    <span>{field.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md-form-panel">
              <h4>Tailor & Secure Your Ride</h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' }}>
                <label className="md-upgrade-option">
                  <input
                    type="checkbox"
                    checked={customCeramicCoating}
                    onChange={(e) => setCustomCeramicCoating(e.target.checked)}
                  />
                  <span>
                    Premium Ceramic Coating (<strong>+$1,200</strong>)
                  </span>
                </label>

                <label className="md-upgrade-option">
                  <input
                    type="checkbox"
                    checked={customWinterTires}
                    onChange={(e) => setCustomWinterTires(e.target.checked)}
                  />
                  <span>
                    Winter Tires Pack (<strong>+$1,500</strong>)
                  </span>
                </label>

                <label className="md-upgrade-option">
                  <input
                    type="checkbox"
                    checked={customPerformanceTuning}
                    onChange={(e) => setCustomPerformanceTuning(e.target.checked)}
                  />
                  <span>
                    AI Performance Tuning (<strong>+$2,500</strong>)
                  </span>
                </label>
              </div>

              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
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
                <button
                  type="submit"
                  className="md-btn md-btn-cta"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.95rem' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending inquiry...' : 'Lock In Quote & Secure Ride'}
                </button>
              </form>
            </div>

            <div className="md-form-panel">
              <h4>Monthly Lease Estimator</h4>

              <div className="md-estimator-result">
                <span className="md-text-muted" style={{ fontSize: '0.92rem' }}>
                  Estimated monthly payment
                </span>
                <span className="md-estimator-value">${calculateMonthlyPayment()}/mo</span>
              </div>

              <div className="md-range-row">
                <label>
                  <span>
                    Down Payment (<strong>{downPaymentPercent}%</strong>)
                  </span>
                  <span>
                    $
                    {((Number(vehicle.pricing?.base_price || 0) * downPaymentPercent) / 100).toLocaleString()}
                  </span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                />
              </div>

              <div className="md-range-row">
                <label>
                  <span>
                    Interest Rate (<strong>{interestAPR}% APR</strong>)
                  </span>
                </label>
                <input
                  type="range"
                  min="1.9"
                  max="9.9"
                  step="0.5"
                  value={interestAPR}
                  onChange={(e) => setInterestAPR(Number(e.target.value))}
                />
              </div>

              <div className="md-range-row">
                <label>
                  <span>
                    Lease Duration (<strong>{loanTerm} months</strong>)
                  </span>
                </label>
                <input
                  type="range"
                  min="24"
                  max="72"
                  step="12"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        <section className="md-related-section">
          <div className="md-section-header" style={{ textAlign: 'left', margin: '0 0 2rem' }}>
            <span className="md-section-eyebrow">You may also like</span>
            <h2 className="md-section-title" style={{ textAlign: 'left' }}>
              Related Vehicles
            </h2>
          </div>

          <div className="md-grid">
            {relatedVehicles.slice(0, 3).map((car) => (
              <ModernCarCard
                key={car.id}
                title={car.title}
                desc={getVehicleSpecLabel(car)}
                price={formatVehiclePrice(car)}
                image={getVehicleImage(car)}
                slug={car.slug}
                year={car.specs?.year}
                condition={car.specs?.condition}
                fuelType={car.specs?.engine}
              />
            ))}
          </div>
        </section>
      </div>

      <ModernFooter />
    </>
  );
}
