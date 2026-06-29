'use client';

import React, { useState, useEffect } from 'react';
import type { Vehicle } from '@/types';
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
import { LiveChatWidget } from '@/components/chat/LiveChatWidget';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

interface ProductPageProps {
  slug: string;
}

export default function ProductPage({ slug }: ProductPageProps) {
  const themeLink = useAutosThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  // useThemeContent — all user-visible strings
  const labelPriceLabel = useThemeContent('detail.price_label', 'Acquisition Valuation');
  const labelSpecsHeading = useThemeContent('detail.specs_heading', 'Provenance & Specifications');
  const labelSpecYear = useThemeContent('detail.spec_year', 'Production Year');
  const labelSpecMileage = useThemeContent('detail.spec_mileage', 'Odometer Mileage');
  const labelSpecEngine = useThemeContent('detail.spec_engine', 'Engine Architecture');
  const labelSpecTransmission = useThemeContent('detail.spec_transmission', 'Transmission Type');
  const labelSpecDrivetrain = useThemeContent('detail.spec_drivetrain', 'Drivetrain System');
  const labelSpecColor = useThemeContent('detail.spec_color', 'Exterior Finish');
  const labelSpecEconomy = useThemeContent('detail.spec_economy', 'Fuel Economy');
  const labelSpecCondition = useThemeContent('detail.spec_condition', 'Condition Score');
  const labelSpecWarranty = useThemeContent('detail.spec_warranty', 'VIP Warranty');
  const labelFinanceHeading = useThemeContent('detail.finance_heading', 'Elite Financing Estimator');
  const labelFinanceDown = useThemeContent('finance.down_payment_label', 'Down Payment');
  const labelFinanceAPR = useThemeContent('finance.apr_label', 'Interest Rate (APR)');
  const labelFinanceTerm = useThemeContent('finance.term_label', 'Loan Term Period');
  const labelFinanceRate = useThemeContent('finance.rate_label', 'Estimated Monthly Rate');
  const labelFinanceDisclaimer = useThemeContent('finance.disclaimer', 'Taxes, license, and dealer administration fees excluded. Formulated on prime catalog criteria.');
  const labelVipHeading = useThemeContent('detail.vip_heading', 'Showroom VIP Desk');
  const labelVipDescription = useThemeContent('detail.vip_description', 'Register for a private viewing of this vehicle asset.');
  const labelFormName = useThemeContent('form.name_label', 'Full Name *');
  const labelFormEmail = useThemeContent('form.email_label', 'Email Address *');
  const labelFormPhone = useThemeContent('form.phone_label', 'Phone Contact *');
  const labelFormDate = useThemeContent('form.date_label', 'Viewing Date *');
  const labelFormTime = useThemeContent('form.time_label', 'Time Preference');
  const labelFormSubmit = useThemeContent('form.submit_label', 'Schedule Private Viewing');
  const labelFormPrivacy = useThemeContent('form.privacy_note', 'By scheduling, you agree to our private showroom access codes and credentials guidelines.');
  const labelRelatedHeading = useThemeContent('detail.related_heading', 'Related Masterpieces');

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [relatedVehicles, setRelatedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Finance estimator inputs
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestAPR, setInterestAPR] = useState(5.9);
  const [loanTerm, setLoanTerm] = useState(60);

  // VIP inquiry form inputs
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

  const calculateMonthlyPayment = () => {
    if (!vehicle) return '0.00';

    const basePrice = Number(vehicle.pricing?.base_price || 0);
    const downPaymentAmount = (basePrice * downPaymentPercent) / 100;
    const principalAmount = basePrice - downPaymentAmount;
    const monthlyRate = interestAPR / 12 / 100;

    if (monthlyRate === 0) {
      return (principalAmount / loanTerm).toFixed(2);
    }

    const payment =
      (principalAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) /
      (Math.pow(1 + monthlyRate, loanTerm) - 1);

    return isNaN(payment) ? '0.00' : payment.toFixed(2);
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
      <div className="lx-loading-state">
        <div className="lx-loading-state-inner">
          <h2 className="lx-loading-title">PREPARING MANORIAL SHOWROOM PROVENANCE...</h2>
          <div className="lx-skeleton lx-loading-bar"></div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="lx-notfound-state">
        <div className="lx-notfound-inner">
          <h2 className="lx-text-gold">Asset Not Located</h2>
          <p className="lx-notfound-message">
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

      {/* Cinematic Parallax Hero */}
      <section
        className="lx-detail-hero"
        style={{ backgroundImage: `url(${vehicle.media?.main_photo || vehicle.featured_image || '/themes/autos/luxury/mercedes.png'})` }}
      >
        <div className="lx-detail-hero-overlay"></div>
        <div className="lx-detail-hero-content">
          <div>
            <h1 className="lx-detail-title">{vehicle.title}</h1>
            <p className="lx-detail-subtitle">
              {vehicle.specs?.make} {vehicle.specs?.model}
            </p>
          </div>
          <div className="lx-detail-price-panel">
            <span className="lx-detail-price-label">{labelPriceLabel}</span>
            <span className="lx-car-price lx-detail-price-value">
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

      {/* Main Details + Spec Ledger */}
      <section className="lx-section">
        <div className="lx-detail-grid">

          {/* Left: Specs + Finance Calculator */}
          <div>
            <h3 className="lx-heading lx-text-gold lx-detail-section-title">{labelSpecsHeading}</h3>
            <p className="lx-detail-description">{vehicle.description}</p>

            {/* Spec Sheet */}
            <div className="lx-spec-sheet">
              <div className="lx-spec-tile">
                <small className="lx-spec-label">{labelSpecYear}</small>
                <span className="lx-spec-value">{vehicle.specs?.year}</span>
              </div>
              <div className="lx-spec-tile">
                <small className="lx-spec-label">{labelSpecMileage}</small>
                <span className="lx-spec-value">{vehicle.specs?.mileage}</span>
              </div>
              <div className="lx-spec-tile">
                <small className="lx-spec-label">{labelSpecEngine}</small>
                <span className="lx-spec-value">{vehicle.specs?.engine}</span>
              </div>
              <div className="lx-spec-tile">
                <small className="lx-spec-label">{labelSpecTransmission}</small>
                <span className="lx-spec-value">{vehicle.specs?.transmission}</span>
              </div>
              <div className="lx-spec-tile">
                <small className="lx-spec-label">{labelSpecDrivetrain}</small>
                <span className="lx-spec-value">{vehicle.specs?.drivetrain}</span>
              </div>
              <div className="lx-spec-tile">
                <small className="lx-spec-label">{labelSpecColor}</small>
                <span className="lx-spec-value">{vehicle.specs?.exterior_color}</span>
              </div>
              <div className="lx-spec-tile">
                <small className="lx-spec-label">{labelSpecEconomy}</small>
                <span className="lx-spec-value">{vehicle.specs?.fuel_economy}</span>
              </div>
              <div className="lx-spec-tile">
                <small className="lx-spec-label">{labelSpecCondition}</small>
                <span className="lx-spec-value">{vehicle.specs?.condition || '9.5/10'}</span>
              </div>
              <div className="lx-spec-tile">
                <small className="lx-spec-label">{labelSpecWarranty}</small>
                <span className="lx-spec-value">{vehicle.specs?.warranty || '36 Months'}</span>
              </div>
            </div>

            {/* Finance Calculator */}
            <div className="lx-finance-calc">
              <h4 className="lx-heading lx-text-gold lx-finance-calc-title">
                {labelFinanceHeading}
              </h4>

              <div className="lx-finance-sliders">
                {/* Down Payment */}
                <div>
                  <div className="lx-slider-header">
                    <span>{labelFinanceDown}</span>
                    <span className="lx-slider-value">
                      {downPaymentPercent}% (${(basePriceValue * downPaymentPercent / 100).toLocaleString()})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="5"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="lx-range"
                    aria-label="Down payment percentage"
                  />
                </div>

                {/* APR */}
                <div>
                  <div className="lx-slider-header">
                    <span>{labelFinanceAPR}</span>
                    <span className="lx-slider-value">{interestAPR}%</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="15"
                    step="0.1"
                    value={interestAPR}
                    onChange={(e) => setInterestAPR(Number(e.target.value))}
                    className="lx-range"
                    aria-label="Annual percentage rate"
                  />
                </div>
              </div>

              {/* Loan Term */}
              <div className="lx-term-row">
                <span className="lx-term-label">{labelFinanceTerm}</span>
                <div className="lx-term-buttons">
                  {[24, 36, 48, 60, 72].map(months => (
                    <button
                      key={months}
                      type="button"
                      className={`lx-btn lx-term-btn ${loanTerm === months ? 'lx-btn-gold' : 'lx-btn-outline'}`}
                      onClick={() => setLoanTerm(months)}
                    >
                      {months} Mo
                    </button>
                  ))}
                </div>
              </div>

              {/* Result */}
              <div className="lx-finance-result">
                <div>
                  <span className="lx-finance-result-label">{labelFinanceRate}</span>
                  <span className="lx-finance-result-amount">
                    ${Number(calculateMonthlyPayment()).toLocaleString()}/mo
                  </span>
                </div>
                <small className="lx-finance-disclaimer">{labelFinanceDisclaimer}</small>
              </div>
            </div>
          </div>

          {/* Right: VIP Reservation Desk */}
          <div className="lx-vip-desk">
            <h4 className="lx-heading lx-text-gold lx-vip-desk-title">{labelVipHeading}</h4>
            <p className="lx-vip-desk-intro">{labelVipDescription}</p>

            <form onSubmit={handleVIPInquirySubmit} className="lx-vip-form">
              {formError && (
                <p className="lx-form-error" role="alert">
                  {formError}
                </p>
              )}

              <div>
                <label htmlFor="vip-name" className="lx-form-label">{labelFormName}</label>
                <input
                  id="vip-name"
                  type="text"
                  placeholder="Enter your name"
                  className="lx-select lx-form-input"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="vip-email" className="lx-form-label">{labelFormEmail}</label>
                <input
                  id="vip-email"
                  type="email"
                  placeholder="name@luxury.com"
                  className="lx-select lx-form-input"
                  required
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="vip-phone" className="lx-form-label">{labelFormPhone}</label>
                <input
                  id="vip-phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="lx-select lx-form-input"
                  required
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                />
              </div>

              <div className="lx-form-date-row">
                <div>
                  <label htmlFor="vip-date" className="lx-form-label">{labelFormDate}</label>
                  <input
                    id="vip-date"
                    type="date"
                    className="lx-select lx-form-input"
                    required
                    value={inquiryDate}
                    onChange={(e) => setInquiryDate(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="vip-time" className="lx-form-label">{labelFormTime}</label>
                  <input
                    id="vip-time"
                    type="time"
                    className="lx-select lx-form-input"
                    value={inquiryTime}
                    onChange={(e) => setInquiryTime(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="lx-btn lx-btn-gold lx-vip-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? '...' : labelFormSubmit}
              </button>

              <p className="lx-vip-privacy">{labelFormPrivacy}</p>
            </form>

            <div className="sl-chat-section">
              <p className="sl-chat-section-label">Have questions?</p>
              <LiveChatWidget vertical="vehicles" listingId={vehicle.id} listingTitle={vehicle.title} />
            </div>
          </div>

        </div>
      </section>

      {/* Related Premium Showroom Grid */}
      {relatedVehicles.length > 0 && (
        <section className="lx-section lx-related-section">
          <h3 className="lx-section-title">{labelRelatedHeading}</h3>
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
