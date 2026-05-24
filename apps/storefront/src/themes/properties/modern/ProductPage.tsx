'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';

interface ProductPageProps {
  slug: string;
}

function getThemeLink(path: string) {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/preview/')) {
    const themeKey = window.location.pathname.split('/')[2];
    return `/preview/${themeKey}${path}`;
  }
  return path || '/';
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
  return property.featured_image || property.thumbnail_image || '/themes/properties/modern/1.webp';
}

export default function ProductPage({ slug }: ProductPageProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

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
          setErrorMessage('Property not found.');
        }
      } catch (error: unknown) {
        if (!isMounted) return;
        console.error('Failed to load properties modern detail:', error);
        setErrorMessage(error instanceof Error ? error.message : 'The property could not be synchronized.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProperty();
    return () => { isMounted = false; };
  }, [slug]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!property || !form.name || !form.email) return;

    try {
      const stored = JSON.parse(localStorage.getItem('sellio_properties_modern_inquiries') || '[]');
      stored.push({
        id: Date.now(),
        property_id: property.id,
        property_title: property.title,
        contact_name: form.name,
        contact_email: form.email,
        message: form.message,
        submitted_at: new Date().toISOString(),
      });
      localStorage.setItem('sellio_properties_modern_inquiries', JSON.stringify(stored));
      setIsSubmitted(true);
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Failed to persist property inquiry:', error);
    }
  };

  const beds = property?.specs?.bedrooms ?? property?.number_of_bedrooms;
  const baths = property?.specs?.bathrooms ?? property?.number_of_bathrooms;
  const area = property?.specs?.area_formatted || (property?.area_sq_ft ? `${Number(property.area_sq_ft).toLocaleString()} sqft` : null);

  if (loading) {
    return (
      <main className="urban-detail-page" aria-busy="true">
        <div className="urban-detail-back-skeleton" />
        <section className="urban-detail-grid">
          <div className="urban-detail-media urban-detail-skeleton" />
          <div className="urban-detail-panel">
            <div className="urban-detail-line urban-detail-line-title" />
            <div className="urban-detail-line" />
            <div className="urban-detail-line urban-detail-line-short" />
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage || !property) {
    return (
      <main className="urban-detail-page">
        <section className="urban-detail-state" role="status">
          <div className="urban-detail-kicker">Structure Unavailable</div>
          <h1>Property could not be loaded.</h1>
          <p>{errorMessage || 'The requested structure does not exist or has been removed.'}</p>
          <a href={getThemeLink('')} className="urban-btn-primary">Return to Structures</a>
        </section>
      </main>
    );
  }

  return (
    <main className="urban-detail-page">
      <a href={getThemeLink('')} className="urban-detail-back">&larr; Back to Structures</a>

      <section className="urban-detail-grid">
        <div className="urban-detail-media">
          <img src={getPropertyImage(property)} alt={property.title} />
        </div>

        <article className="urban-detail-panel">
          <div className="urban-detail-kicker">{property.specs?.category || 'Urban Structure'}</div>
          <h1>{property.title}</h1>
          <div className="urban-detail-price">{getPropertyPrice(property)}</div>
          <p className="urban-detail-description">
            {property.description || property.short_description || 'This live property is synchronized from the Sellio catalog.'}
          </p>
          <div className="urban-detail-specs">
            <div><span>Location</span><strong>{getPropertyLocation(property)}</strong></div>
            {beds != null && <div><span>Bedrooms</span><strong>{beds}</strong></div>}
            {baths != null && <div><span>Bathrooms</span><strong>{baths}</strong></div>}
            {area && <div><span>Area</span><strong>{area}</strong></div>}
          </div>
        </article>
      </section>

      <section className="urban-detail-inquiry">
        <div>
          <div className="urban-detail-kicker">Schedule Viewing</div>
          <h2>Request a structure walkthrough.</h2>
          <p>Share your contact details. This records the inquiry locally for the preview flow.</p>
        </div>
        {isSubmitted ? (
          <div className="urban-detail-success" role="status">Inquiry saved successfully.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Full Name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            <label>Message<textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
            <button className="urban-btn-primary" type="submit">Send Inquiry</button>
          </form>
        )}
      </section>
    </main>
  );
}
