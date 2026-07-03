'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import type { Property } from '@/types';
import { submitPropertyInquiry } from '@/themes/properties/shared/submit-property-inquiry';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';
import { calculateRoi, getInvestmentMetric, INVESTMENT_METHODOLOGY_NOTE, type InvestmentMetric } from './investment-metrics';

// ─── ROI calculator ─────────────────────────────────────────────────────────
// Real amortization math on the actual listing price; down payment / rate /
// term are the buyer's own assumptions, same as any mortgage calculator.

function formatCurrency(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

function RoiCalculatorSection({
  price,
  metric,
  hoaAnnual,
}: {
  price: number;
  metric: InvestmentMetric;
  hoaAnnual: number;
}) {
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRatePct, setInterestRatePct] = useState(6.5);
  const [loanTermYears, setLoanTermYears] = useState(30);

  const breakdown = calculateRoi({
    price,
    downPaymentPct,
    interestRatePct,
    loanTermYears,
    annualIncome: metric.annualAmount,
    hoaAnnual,
  });

  return (
    <section className="pi-detail-roi">
      <h2>Investment Calculator</h2>
      <p className="pi-mono pi-methodology-note">
        Adjust financing assumptions below — the payment math is a standard fixed-rate amortization
        calculation on this listing&apos;s price. {metric.label} (${Math.round(metric.annualAmount).toLocaleString()}/yr) is used as the projected income.
      </p>

      <div className="pi-roi-grid">
        <div className="pi-roi-inputs">
          <label>
            Down payment
            <div className="pi-roi-input-row">
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={downPaymentPct}
                onChange={(e) => setDownPaymentPct(Number(e.target.value))}
              />
              <span className="pi-mono">{downPaymentPct}%</span>
            </div>
          </label>
          <label>
            Interest rate
            <div className="pi-roi-input-row">
              <input
                type="range"
                min={0}
                max={15}
                step={0.1}
                value={interestRatePct}
                onChange={(e) => setInterestRatePct(Number(e.target.value))}
              />
              <span className="pi-mono">{interestRatePct.toFixed(1)}%</span>
            </div>
          </label>
          <label>
            Loan term
            <div className="pi-roi-input-row">
              <input
                type="range"
                min={5}
                max={30}
                step={5}
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(Number(e.target.value))}
              />
              <span className="pi-mono">{loanTermYears} yrs</span>
            </div>
          </label>
        </div>

        <table className="pi-roi-table">
          <tbody>
            <tr><td>Purchase price</td><td className="pi-mono">{formatCurrency(price)}</td></tr>
            <tr><td>Down payment</td><td className="pi-mono">{formatCurrency(breakdown.downPayment)}</td></tr>
            <tr><td>Loan amount</td><td className="pi-mono">{formatCurrency(breakdown.loanAmount)}</td></tr>
            <tr><td>Est. monthly mortgage</td><td className="pi-mono">{formatCurrency(breakdown.monthlyMortgage)}</td></tr>
            <tr><td>{metric.label}</td><td className="pi-mono">{formatCurrency(metric.annualAmount)}</td></tr>
            {hoaAnnual > 0 && <tr><td>HOA (annual)</td><td className="pi-mono">-{formatCurrency(hoaAnnual)}</td></tr>}
            <tr className="pi-roi-row-highlight">
              <td>Est. net annual cash flow</td>
              <td className="pi-mono">{formatCurrency(breakdown.netAnnualCashFlow)}</td>
            </tr>
            <tr className="pi-roi-row-highlight">
              <td>Cash-on-cash ROI</td>
              <td className="pi-mono">{breakdown.cashOnCashRoiPct !== null ? `${breakdown.cashOnCashRoiPct.toFixed(1)}%` : 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

interface ProductPageProps {
  slug: string;
}

function getPropertyPrice(property: Property) {
  return property.pricing?.price_formatted || (
    property.base_price ? `$${Number(property.base_price).toLocaleString()}` : 'Price on request'
  );
}

function getPropertyLocation(property: Property) {
  return property.location?.title || [property.city, property.state].filter(Boolean).join(', ') || property.address || 'Market TBA';
}

function getPropertyImage(property: Property) {
  return property.featured_image || property.thumbnail_image || '/themes/properties/investment/1.webp';
}

export default function ProductPage({ slug }: ProductPageProps) {
  const themeLink = usePropertyThemeLink();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadProperty() {
      try {
        const response = await api.getPropertyDetails(slug);
        if (!isMounted) return;
        if (response?.data) { setProperty(response.data); setErrorMessage(null); }
        else setErrorMessage('Asset not found.');
      } catch (error: unknown) {
        if (!isMounted) return;
        setErrorMessage(error instanceof Error ? error.message : 'The portfolio asset could not be synchronized.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProperty();
    return () => { isMounted = false; };
  }, [slug]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!property || !form.name || !form.email) {
      setFormError('Please enter your name and email to submit an inquiry.');
      return;
    }
    setFormError(null);
    setIsSubmitting(true);

    const result = await submitPropertyInquiry({
      propertyId: property.id,
      useFallback: false,
      storageKey: 'sellio_properties_investment_inquiries',
      fullName: form.name,
      email: form.email,
      message: form.message,
      demoRecord: {
        id: Date.now(),
        property_id: property.id,
        property_title: property.title,
        contact_name: form.name,
        contact_email: form.email,
        message: form.message,
        submitted_at: new Date().toISOString(),
      },
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    setIsSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  const area = property?.specs?.area_formatted || (property?.area_sq_ft ? `${Number(property.area_sq_ft).toLocaleString()} sqft` : null);
  const metric = property ? getInvestmentMetric(property) : null;

  if (loading) {
    return (
      <main className="pi-detail-page" aria-busy="true">
        <div className="pi-detail-skeleton pi-detail-hero-skeleton" />
        <div className="pi-detail-line pi-detail-line-title" />
      </main>
    );
  }

  if (errorMessage || !property) {
    return (
      <main className="pi-detail-page">
        <section className="pi-detail-state" role="status">
          <div className="pi-detail-kicker">Asset Unavailable</div>
          <h1>Portfolio asset could not be loaded.</h1>
          <p>{errorMessage}</p>
          <a href={themeLink('/')} className="pi-btn pi-btn-primary">Return to Portfolio</a>
        </section>
      </main>
    );
  }

  return (
    <main className="pi-detail-page">
      <a href={themeLink('/')} className="pi-detail-back">&larr; Back to Asset Performance</a>
      <section className="pi-detail-grid">
        <div className="pi-detail-media"><img src={getPropertyImage(property)} alt={property.title} /></div>
        <article className="pi-detail-panel">
          <div className="pi-detail-kicker">{property.specs?.category || 'Investment Asset'}</div>
          <h1>{property.title}</h1>
          <div className="pi-detail-price">{getPropertyPrice(property)}</div>
          <p className="pi-detail-description">{property.description || property.short_description || 'This investment property is part of the Sellio portfolio.'}</p>
          <div className="pi-detail-specs">
            <div><span>Market</span><strong>{getPropertyLocation(property)}</strong></div>
            {area && <div><span>Area</span><strong>{area}</strong></div>}
            {metric && <div><span>{metric.label}</span><strong>{metric.value}*</strong></div>}
          </div>
          {metric && <p className="pi-mono pi-methodology-note" style={{ marginTop: '2rem' }}>*{INVESTMENT_METHODOLOGY_NOTE}</p>}
        </article>
      </section>

      {metric?.kind === 'yield' && (
        <RoiCalculatorSection
          price={Number(property.pricing?.base_price ?? property.base_price) || 0}
          metric={metric}
          hoaAnnual={(Number(property.pricing?.hoa ?? property.hoa) || 0) * 12}
        />
      )}

      <section className="pi-detail-inquiry">
        <h2>Request Investment Brief</h2>
        {metric?.kind === 'revenue' ? (
          <p className="pi-detail-description">
            This is a short-term rental listing rather than a purchasable asset, so an investment brief
            doesn&apos;t apply here. Reach out to our team directly to ask about this property.
          </p>
        ) : isSubmitted ? (
          <div className="pi-detail-success" role="status">Brief request saved.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            <label>Investment Notes<textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
            {formError && <p className="pi-detail-form-error" role="alert">{formError}</p>}
            <button className="pi-btn pi-btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Request Brief'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
