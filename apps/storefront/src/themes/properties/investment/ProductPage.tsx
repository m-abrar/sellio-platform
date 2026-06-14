'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { submitPropertyInquiry } from '@/themes/properties/shared/submit-property-inquiry';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';

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
  const yieldEstimate = property ? `${(5.2 + (property.id % 5) * 0.6).toFixed(1)}%` : null;

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
          <p className="pi-detail-description">{property.description || property.short_description || 'This live investment asset is synchronized from the Sellio catalog.'}</p>
          <div className="pi-detail-specs">
            <div><span>Market</span><strong>{getPropertyLocation(property)}</strong></div>
            {area && <div><span>Area</span><strong>{area}</strong></div>}
            {yieldEstimate && <div><span>Est. Yield</span><strong>{yieldEstimate}</strong></div>}
          </div>
        </article>
      </section>
      <section className="pi-detail-inquiry">
        <h2>Request Investment Brief</h2>
        {isSubmitted ? (
          <div className="pi-detail-success" role="status">Brief request saved.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            <label>Investment Notes<textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
            <button className="pi-btn pi-btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Request Brief'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
