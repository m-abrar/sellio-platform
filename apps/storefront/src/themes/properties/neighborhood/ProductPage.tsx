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
  return property.location?.title || [property.city, property.state].filter(Boolean).join(', ') || property.address || 'Neighborhood TBA';
}

function getPropertyImage(property: Property) {
  return property.featured_image || property.thumbnail_image || '/themes/properties/neighborhood/1.webp';
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
        else setErrorMessage('Home not found.');
      } catch (error: unknown) {
        if (!isMounted) return;
        setErrorMessage(error instanceof Error ? error.message : 'The home listing could not be synchronized.');
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
      storageKey: 'sellio_properties_neighborhood_inquiries',
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

  const beds = property?.specs?.bedrooms ?? property?.number_of_bedrooms;
  const baths = property?.specs?.bathrooms ?? property?.number_of_bathrooms;
  const area = property?.specs?.area_formatted || (property?.area_sq_ft ? `${Number(property.area_sq_ft).toLocaleString()} sqft` : null);

  if (loading) {
    return (
      <main className="pn-detail-page" aria-busy="true">
        <div className="pn-detail-skeleton pn-detail-hero-skeleton" />
        <div className="pn-detail-line pn-detail-line-title" />
      </main>
    );
  }

  if (errorMessage || !property) {
    return (
      <main className="pn-detail-page">
        <section className="pn-detail-state" role="status">
          <div className="pn-detail-kicker">Home Unavailable</div>
          <h1>Listing could not be loaded.</h1>
          <p>{errorMessage}</p>
          <a href={themeLink('')} className="pn-btn pn-btn-primary">Return to Homes</a>
        </section>
      </main>
    );
  }

  return (
    <main className="pn-detail-page">
      <a href={themeLink('')} className="pn-detail-back">&larr; Back to Neighborly Homes</a>
      <section className="pn-detail-grid">
        <div className="pn-detail-media"><img src={getPropertyImage(property)} alt={property.title} /></div>
        <article className="pn-detail-panel">
          <div className="pn-detail-kicker">{property.specs?.category || 'Neighborly Home'}</div>
          <h1>{property.title}</h1>
          <div className="pn-detail-price">{getPropertyPrice(property)}</div>
          <p className="pn-detail-description">{property.description || property.short_description || 'This live home is synchronized from the Sellio catalog.'}</p>
          <div className="pn-detail-specs">
            <div><span>Neighborhood</span><strong>{getPropertyLocation(property)}</strong></div>
            {beds != null && <div><span>Bedrooms</span><strong>{beds}</strong></div>}
            {baths != null && <div><span>Bathrooms</span><strong>{baths}</strong></div>}
            {area && <div><span>Area</span><strong>{area}</strong></div>}
          </div>
        </article>
      </section>
      <section className="pn-detail-inquiry">
        <h2>Schedule a Home Tour</h2>
        {isSubmitted ? (
          <div className="pn-detail-success" role="status">Tour request saved.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            <label>Message<textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
            <button className="pn-btn pn-btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Request Tour'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
