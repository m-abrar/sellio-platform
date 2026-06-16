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
  return property.location?.title || [property.city, property.state].filter(Boolean).join(', ') || property.address || 'Location TBA';
}

function getPropertyImage(property: Property) {
  return property.featured_image || property.thumbnail_image || '/themes/properties/map/1.webp';
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
        if (response?.data) {
          setProperty(response.data);
          setErrorMessage(null);
        } else {
          setErrorMessage('This property could not be found.');
        }
      } catch (error: unknown) {
        if (!isMounted) return;
        setErrorMessage(error instanceof Error ? error.message : 'This property is temporarily unavailable.');
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
      storageKey: 'sellio_properties_map_inquiries',
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
  const latitude = Number(property?.location?.latitude);
  const longitude = Number(property?.location?.longitude);
  const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude) && latitude !== 0;

  if (loading) {
    return (
      <main className="pm-detail-page" aria-busy="true">
        <div className="pm-detail-skeleton pm-detail-hero-skeleton" />
        <div className="pm-detail-line pm-detail-line-title" />
      </main>
    );
  }

  if (errorMessage || !property) {
    return (
      <main className="pm-detail-page">
        <section className="pm-detail-state" role="status">
          <div className="pm-detail-kicker">Property Unavailable</div>
          <h1>This property could not be loaded.</h1>
          <p>{errorMessage}</p>
          <a href={themeLink('/')} className="pm-detail-btn">Back to Map Search</a>
        </section>
      </main>
    );
  }

  return (
    <main className="pm-detail-page">
      <a href={themeLink('/')} className="pm-detail-back">&larr; Back to Map Search</a>
      <section className="pm-detail-grid">
        <div className="pm-detail-media">
          <img src={getPropertyImage(property)} alt={property.title} />
        </div>
        <article className="pm-detail-panel">
          <div className="pm-detail-kicker">{property.specs?.category || 'Property'}</div>
          <h1>{property.title}</h1>
          <div className="pm-detail-price">{getPropertyPrice(property)}</div>
          <p className="pm-detail-description">
            {property.description || property.short_description || 'Contact us for full details about this property.'}
          </p>
          <div className="pm-detail-specs">
            <div><span>Location</span><strong>{getPropertyLocation(property)}</strong></div>
            {area && <div><span>Area</span><strong>{area}</strong></div>}
            {property.specs?.bedrooms && <div><span>Bedrooms</span><strong>{property.specs.bedrooms}</strong></div>}
            {property.specs?.bathrooms && <div><span>Bathrooms</span><strong>{property.specs.bathrooms}</strong></div>}
            {hasCoordinates && (
              <div><span>Coordinates</span><strong>{latitude.toFixed(4)}° N, {Math.abs(longitude).toFixed(4)}° W</strong></div>
            )}
          </div>
        </article>
      </section>
      <section className="pm-detail-inquiry">
        <h2>Request a Viewing</h2>
        {isSubmitted ? (
          <div className="pm-detail-success" role="status">
            Your inquiry has been sent. An agent will be in touch shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              Name
              <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label>
              Email
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label>
              Message
              <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="When are you available for a viewing?" />
            </label>
            {formError && <p className="prop-form-error">{formError}</p>}
            <button className="pm-detail-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send Inquiry'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
