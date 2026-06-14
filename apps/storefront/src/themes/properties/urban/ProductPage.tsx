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
  return property.location?.title || [property.city, property.state].filter(Boolean).join(', ') || property.address || 'Node TBA';
}

function getPropertyImage(property: Property) {
  return property.featured_image || property.thumbnail_image || '/themes/properties/urban/1.webp';
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
        else setErrorMessage('Unit not found.');
      } catch (error: unknown) {
        if (!isMounted) return;
        setErrorMessage(error instanceof Error ? error.message : 'The registry unit could not be synchronized.');
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
      storageKey: 'sellio_properties_urban_inquiries',
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

  if (loading) {
    return (
      <main className="pu-detail-page" aria-busy="true">
        <div className="pu-detail-skeleton pu-detail-hero-skeleton" />
        <div className="pu-detail-line pu-detail-line-title" />
      </main>
    );
  }

  if (errorMessage || !property) {
    return (
      <main className="pu-detail-page">
        <section className="pu-detail-state" role="status">
          <div className="pu-detail-kicker">Registry Offline</div>
          <h1>Unit could not be loaded.</h1>
          <p>{errorMessage}</p>
          <a href={themeLink('/')} className="pu-btn pu-btn-primary">Return to Registry</a>
        </section>
      </main>
    );
  }

  return (
    <main className="pu-detail-page">
      <a href={themeLink('/')} className="pu-detail-back">&larr; Back to Registry Nodes</a>
      <section className="pu-detail-grid">
        <div className="pu-detail-media"><img src={getPropertyImage(property)} alt={property.title} /></div>
        <article className="pu-detail-panel">
          <div className="pu-detail-kicker">{property.specs?.category || 'Registry Unit'}</div>
          <h1>{property.title}</h1>
          <div className="pu-detail-price">{getPropertyPrice(property)}</div>
          <p className="pu-detail-description">{property.description || property.short_description || 'This live unit is synchronized from the Sellio catalog.'}</p>
          <div className="pu-detail-specs">
            <div><span>Location</span><strong>{getPropertyLocation(property)}</strong></div>
            {area && <div><span>Area</span><strong>{area}</strong></div>}
          </div>
        </article>
      </section>
      <section className="pu-detail-inquiry">
        <h2>Request Unit Access</h2>
        {isSubmitted ? (
          <div className="pu-detail-success" role="status">Inquiry synchronized.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            <label>Notes<textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
            <button className="pu-btn pu-btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Submit Inquiry'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
