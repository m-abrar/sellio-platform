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
  return property.location?.title || [property.city, property.state].filter(Boolean).join(', ') || property.address || 'Coordinates TBA';
}

function getPropertyImage(property: Property) {
  return property.featured_image || property.thumbnail_image || '/themes/properties/map/1.webp';
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
        if (response?.data) { setProperty(response.data); setErrorMessage(null); }
        else setErrorMessage('Registry node not found.');
      } catch (error: unknown) {
        if (!isMounted) return;
        setErrorMessage(error instanceof Error ? error.message : 'The spatial node could not be synchronized.');
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
      const stored = JSON.parse(localStorage.getItem('sellio_properties_map_inquiries') || '[]');
      stored.push({ id: Date.now(), property_id: property.id, property_title: property.title, contact_name: form.name, contact_email: form.email, message: form.message, submitted_at: new Date().toISOString() });
      localStorage.setItem('sellio_properties_map_inquiries', JSON.stringify(stored));
      setIsSubmitted(true);
      setForm({ name: '', email: '', message: '' });
    } catch (error) { console.error('Failed to persist inquiry:', error); }
  };

  const area = property?.specs?.area_formatted || (property?.area_sq_ft ? `${Number(property.area_sq_ft).toLocaleString()} sqft` : null);

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
          <div className="pm-detail-kicker">Node Unavailable</div>
          <h1>Registry node could not be loaded.</h1>
          <p>{errorMessage}</p>
          <a href={getThemeLink('')} className="pm-detail-btn">Return to Map Registry</a>
        </section>
      </main>
    );
  }

  return (
    <main className="pm-detail-page">
      <a href={getThemeLink('')} className="pm-detail-back">&larr; Back to Spatial Registry</a>
      <section className="pm-detail-grid">
        <div className="pm-detail-media"><img src={getPropertyImage(property)} alt={property.title} /></div>
        <article className="pm-detail-panel">
          <div className="pm-detail-kicker">{property.specs?.category || 'Spatial Node'}</div>
          <h1>{property.title}</h1>
          <div className="pm-detail-price">{getPropertyPrice(property)}</div>
          <p className="pm-detail-description">{property.description || property.short_description || 'This live registry node is synchronized from the Sellio catalog.'}</p>
          <div className="pm-detail-specs">
            <div><span>Location</span><strong>{getPropertyLocation(property)}</strong></div>
            {area && <div><span>Area</span><strong>{area}</strong></div>}
            {property.location?.latitude && property.location?.longitude && (
              <div><span>Coordinates</span><strong>{property.location.latitude.toFixed(4)}, {property.location.longitude.toFixed(4)}</strong></div>
            )}
          </div>
        </article>
      </section>
      <section className="pm-detail-inquiry">
        <h2>Request Site Visit</h2>
        {isSubmitted ? (
          <div className="pm-detail-success" role="status">Inquiry logged.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            <label>Notes<textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
            <button className="pm-detail-btn" type="submit">Submit Inquiry</button>
          </form>
        )}
      </section>
    </main>
  );
}
