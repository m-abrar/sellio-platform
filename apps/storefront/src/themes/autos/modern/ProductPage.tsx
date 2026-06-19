'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { Vehicle } from '@sellio/types';
import Link from 'next/link';
import { ModernHeader, ModernCarCard, ModernFooter } from './components';
import {
  loadVehicleDetailPage,
} from '@/themes/autos/shared/catalog';
import { useAutosThemeLink } from '@/themes/autos/shared/useAutosThemeLink';
import { useDemoFallbackAllowed } from '@/themes/autos/shared/useDemoFallbackAllowed';
import {
  formatVehiclePrice,
  getVehicleImage,
  getVehicleSpecLabel,
  getConditionLabel,
} from '@/themes/autos/shared/vehicle-utils';
import { LiveChatWidget } from '@/components/chat/LiveChatWidget';

function buildVehicleGallery(vehicle: Vehicle): string[] {
  const imgs: string[] = [];
  const add = (url?: string | null) => { if (url && !imgs.includes(url)) imgs.push(url); };
  add(vehicle.media?.main_photo);
  add(vehicle.featured_image);
  if (Array.isArray(vehicle.media?.gallery)) {
    [...vehicle.media.gallery]
      .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
      .forEach((g) => add(g.url));
  }
  if (!imgs.length) imgs.push(getVehicleImage(vehicle));
  return imgs;
}
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
  const allowDemo = useDemoFallbackAllowed();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [relatedVehicles, setRelatedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [galleryIndex, setGalleryIndex] = useState(0);
  const gallery = useMemo(() => vehicle ? buildVehicleGallery(vehicle) : [], [vehicle]);

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
      const result = await loadVehicleDetailPage(slug, 'modern', allowDemo);

      setVehicle(result.vehicle);
      setRelatedVehicles(result.related);
      setApiError(result.alertError);
      setLoading(false);
    }

    loadVehicle();
  }, [slug, allowDemo]);

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

  const conditionLabel = getConditionLabel(vehicle.specs?.condition as number | null) || vehicle.specs?.condition || 'Premium Spec';

  const specFields = [
    { label: 'Make', value: vehicle.specs?.make || 'N/A' },
    { label: 'Model', value: vehicle.specs?.model || 'N/A' },
    { label: 'Year', value: vehicle.specs?.year || '2025' },
    { label: 'Engine', value: vehicle.specs?.engine || 'N/A' },
    { label: 'Transmission', value: vehicle.specs?.transmission || 'Automatic' },
    { label: 'Mileage', value: vehicle.specs?.mileage || 'Available Now' },
    { label: 'Drivetrain', value: vehicle.specs?.drivetrain || 'AWD' },
    vehicle.specs?.exterior_color ? { label: 'Color', value: vehicle.specs.exterior_color } : null,
    vehicle.specs?.fuel_economy ? { label: 'Fuel Economy', value: vehicle.specs.fuel_economy } : null,
    { label: 'Warranty', value: vehicle.specs?.warranty || '48 Months' },
    vehicle.specs?.vin ? { label: 'VIN', value: vehicle.specs.vin } : null,
  ].filter((f): f is { label: string; value: string | number } => f !== null);

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
            <div className="md-detail-panel md-detail-panel--hero-img" style={{ position: 'relative', padding: '0', overflow: 'hidden' }}>
              <img
                src={gallery[galleryIndex] ?? getVehicleImage(vehicle)}
                alt={`${vehicle.title} — photo ${galleryIndex + 1}`}
                style={{ width: '100%', display: 'block', borderRadius: 'var(--md-radius-md)', objectFit: 'cover', maxHeight: '460px' }}
              />
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous photo"
                    onClick={() => setGalleryIndex((i) => (i - 1 + gallery.length) % gallery.length)}
                    style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >‹</button>
                  <button
                    type="button"
                    aria-label="Next photo"
                    onClick={() => setGalleryIndex((i) => (i + 1) % gallery.length)}
                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >›</button>
                  <div style={{ position: 'absolute', bottom: '0.75rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.4rem' }}>
                    {gallery.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`Photo ${i + 1}`}
                        onClick={() => setGalleryIndex(i)}
                        style={{ width: galleryIndex === i ? '24px' : '8px', height: '8px', borderRadius: '4px', background: galleryIndex === i ? 'var(--md-primary)' : 'rgba(255,255,255,0.6)', border: 'none', cursor: 'pointer', padding: 0, transition: 'width 0.2s' }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {gallery.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '0.75rem 0', scrollbarWidth: 'none' }}>
                {gallery.slice(0, 6).map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    aria-label={`View photo ${i + 1}`}
                    onClick={() => setGalleryIndex(i)}
                    style={{ flexShrink: 0, width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: galleryIndex === i ? '2px solid var(--md-primary)' : '2px solid transparent', cursor: 'pointer', padding: 0 }}
                  >
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </button>
                ))}
              </div>
            )}

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
            <span className="md-condition-badge">{conditionLabel}</span>
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

            <div className="sl-chat-section">
              <p className="sl-chat-section-label">Have questions?</p>
              <LiveChatWidget vertical="vehicles" listingId={vehicle.id} listingTitle={vehicle.title} />
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

        {relatedVehicles.length > 0 && (
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
                  condition={getConditionLabel(car.specs?.condition as number | null)}
                  fuelType={car.specs?.engine}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <ModernFooter />
    </>
  );
}
