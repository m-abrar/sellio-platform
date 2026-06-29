'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { api } from '@/lib/api-client';
import type { Property } from '@/types';
import { submitPropertyInquiry } from '@/themes/properties/shared/submit-property-inquiry';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';

interface ProductPageProps {
  slug: string;
}

// ─── Image collection ────────────────────────────────────────────────────────

function extractImageUrl(item: unknown): string | null {
  if (typeof item === 'string' && item.trim()) return item;
  if (!item || typeof item !== 'object') return null;
  const r = item as Record<string, unknown>;
  for (const k of ['hero', 'url', 'original_url', 'thumbnail', 'preview']) {
    if (typeof r[k] === 'string' && (r[k] as string).trim()) return r[k] as string;
  }
  return null;
}

function collectImages(property: Property): string[] {
  const imgs: string[] = [];
  const add = (url?: string | null) => { if (url && !imgs.includes(url)) imgs.push(url); };

  if (Array.isArray(property.gallery)) {
    const sorted = [...property.gallery].sort((a, b) => ((a as any).order ?? 0) - ((b as any).order ?? 0));
    sorted.forEach((item) => add(extractImageUrl(item)));
  }
  add((property as any).primary_image_url);
  add(property.featured_image);
  add(property.thumbnail_image);
  add((property as any).thumbnail_url);
  if (Array.isArray((property as any).media)) {
    (property as any).media.forEach((item: unknown) => add(extractImageUrl(item)));
  }

  const featured = property.featured_image || (property as any).primary_image_url;
  if (featured && imgs.indexOf(featured) > 0) {
    imgs.splice(imgs.indexOf(featured), 1);
    imgs.unshift(featured);
  }

  if (!imgs.length) imgs.push('/themes/properties/map/1.webp');
  return imgs;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getPrice(property: Property) {
  return property.pricing?.price_formatted ||
    (property.base_price ? `$${Number(property.base_price).toLocaleString()}` : 'Price on request');
}

function getLocation(property: Property) {
  return property.location?.title ||
    [property.city, property.state].filter(Boolean).join(', ') ||
    property.address || 'Location TBA';
}

// ─── Mini map ────────────────────────────────────────────────────────────────

function MiniMap({ lat, lng }: { lat: number; lng: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    function init(L: any) {
      if (mapRef.current) return;
      const map = L.map(el, { zoomControl: true, center: [lat, lng], zoom: 15, scrollWheelZoom: false });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);
      const icon = L.divIcon({ className: '', html: '<div class="pm-pin-bubble pm-pin-detail">This property</div>', iconSize: null, iconAnchor: [55, 18] });
      L.marker([lat, lng], { icon }).addTo(map);
      mapRef.current = map;
    }

    let cancelled = false;
    import('leaflet').then(({ default: L }) => {
      if (!cancelled) init(L);
    });

    return () => { cancelled = true; if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, [lat, lng]);

  return <div ref={containerRef} className="pm-mini-map" />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductPage({ slug }: ProductPageProps) {
  const themeLink = usePropertyThemeLink();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const images = useMemo(
    () => property ? collectImages(property) : [],
    [property],
  );

  // Auto-rotate gallery every 4.5 s; restarts whenever image count changes
  useEffect(() => {
    if (images.length <= 1) return;
    const count = images.length;
    const id = setInterval(() => {
      setActiveImage((cur) => (cur + 1) % count);
    }, 4500);
    return () => clearInterval(id);
  }, [images.length]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const response = await api.getPropertyDetails(slug);
        if (!isMounted) return;
        if (response?.data) { setProperty(response.data); setErrorMessage(null); }
        else setErrorMessage('This property could not be found.');
      } catch (err: unknown) {
        if (!isMounted) return;
        setErrorMessage(err instanceof Error ? err.message : 'This property is temporarily unavailable.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!property || !form.name || !form.email) {
      setFormError('Please enter your name and email.');
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
    if (!result.ok) { setFormError(result.error); return; }
    setIsSubmitted(true);
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  if (loading) {
    return (
      <main className="pm-detail-page" aria-busy="true">
        <div className="pm-detail-inner">
          <div className="pm-detail-skeleton pm-detail-hero-skeleton" />
          <div className="pm-detail-line pm-detail-line-title" />
          <div className="pm-detail-line" />
        </div>
      </main>
    );
  }

  if (errorMessage || !property) {
    return (
      <main className="pm-detail-page">
        <div className="pm-detail-inner">
          <section className="pm-detail-state" role="status">
            <div className="pm-detail-kicker">Property Unavailable</div>
            <h1>This property could not be loaded.</h1>
            <p>{errorMessage}</p>
            <a href={themeLink('/')} className="pm-detail-btn">Back to Map Search</a>
          </section>
        </div>
      </main>
    );
  }

  const price = getPrice(property);
  const location = getLocation(property);
  const beds = property.specs?.bedrooms ?? property.number_of_bedrooms;
  const baths = property.specs?.bathrooms ?? property.number_of_bathrooms;
  const area = property.specs?.area_formatted || (property.area_sq_ft ? `${Number(property.area_sq_ft).toLocaleString()} sqft` : null);
  const category = property.specs?.category || (property as any).category?.title || 'Property';
  const yearBuilt = property.specs?.year_built ?? (property as any).year_built;
  const parking = property.specs?.parking_spots ?? (property as any).number_of_parking_spots;
  const lat = Number(property.location?.latitude);
  const lng = Number(property.location?.longitude);
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0;

  return (
    <main className="pm-detail-page">
      <div className="pm-detail-inner">
      {/* Back */}
      <a href={themeLink('/')} className="pm-detail-back">
        ← Back to Map Search
      </a>

      {/* Hero image */}
      <div className="pm-detail-hero">
        <img
          src={images[activeImage]}
          alt={property.title}
          className="pm-detail-hero-img"
        />
        <div className="pm-detail-hero-overlay">
          <div className="pm-detail-kicker">{category}</div>
          <h1 className="pm-detail-hero-title">{property.title}</h1>
          <div className="pm-detail-hero-price">{price}</div>
        </div>
        {images.length > 1 && (
          <div className="pm-hero-arrows" aria-hidden="true">
            <button
              type="button"
              className="pm-hero-arrow"
              onClick={() => setActiveImage((i) => (i - 1 + images.length) % images.length)}
            >‹</button>
            <button
              type="button"
              className="pm-hero-arrow"
              onClick={() => setActiveImage((i) => (i + 1) % images.length)}
            >›</button>
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="pm-detail-thumbs">
          {images.slice(0, 6).map((src, i) => (
            <button
              key={src}
              type="button"
              className={`pm-detail-thumb${activeImage === i ? ' pm-thumb-active' : ''}`}
              onClick={() => setActiveImage(i)}
              aria-label={`View image ${i + 1}`}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}

      {/* Key facts strip */}
      <div className="pm-detail-facts">
        {beds != null && (
          <div className="pm-detail-fact">
            <span className="pm-fact-value">{beds}</span>
            <span className="pm-fact-label">Bedrooms</span>
          </div>
        )}
        {baths != null && (
          <div className="pm-detail-fact">
            <span className="pm-fact-value">{baths}</span>
            <span className="pm-fact-label">Bathrooms</span>
          </div>
        )}
        {area && (
          <div className="pm-detail-fact">
            <span className="pm-fact-value">{area}</span>
            <span className="pm-fact-label">Floor area</span>
          </div>
        )}
        {parking != null && (
          <div className="pm-detail-fact">
            <span className="pm-fact-value">{parking}</span>
            <span className="pm-fact-label">Parking</span>
          </div>
        )}
        {yearBuilt && (
          <div className="pm-detail-fact">
            <span className="pm-fact-value">{yearBuilt}</span>
            <span className="pm-fact-label">Year built</span>
          </div>
        )}
        <div className="pm-detail-fact">
          <span className="pm-fact-value pm-fact-location">{location}</span>
          <span className="pm-fact-label">Location</span>
        </div>
      </div>

      {/* 2-column: content | inquiry */}
      <div className="pm-detail-body">
        {/* Left: description + specs */}
        <div className="pm-detail-content">
          {(property.description || property.short_description) && (
            <section className="pm-detail-section">
              <h2 className="pm-detail-section-title">About this property</h2>
              <p className="pm-detail-description">
                {property.description || property.short_description}
              </p>
            </section>
          )}

          <section className="pm-detail-section">
            <h2 className="pm-detail-section-title">Property details</h2>
            <div className="pm-detail-specs">
              <div><span>Type</span><strong>{category}</strong></div>
              <div><span>Price</span><strong>{price}</strong></div>
              <div><span>Location</span><strong>{location}</strong></div>
              {area && <div><span>Area</span><strong>{area}</strong></div>}
              {beds != null && <div><span>Bedrooms</span><strong>{beds}</strong></div>}
              {baths != null && <div><span>Bathrooms</span><strong>{baths}</strong></div>}
              {parking != null && <div><span>Parking</span><strong>{parking} spot{parking !== 1 ? 's' : ''}</strong></div>}
              {yearBuilt && <div><span>Year built</span><strong>{yearBuilt}</strong></div>}
              {hasCoords && <div><span>Coordinates</span><strong>{lat.toFixed(4)}° N, {Math.abs(lng).toFixed(4)}° W</strong></div>}
            </div>
          </section>
        </div>

        {/* Right: inquiry panel */}
        <aside className="pm-detail-inquiry-panel">
          <div className="pm-inquiry-price">{price}</div>
          <div className="pm-inquiry-address">{location}</div>

          <h3 className="pm-inquiry-heading">Request a viewing</h3>

          {isSubmitted ? (
            <div className="pm-detail-success" role="status">
              Your inquiry has been sent. An agent will be in touch shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="pm-inquiry-form">
              <label className="pm-inquiry-label">
                Name
                <input
                  required
                  type="text"
                  className="pm-inquiry-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                />
              </label>
              <label className="pm-inquiry-label">
                Email
                <input
                  required
                  type="email"
                  className="pm-inquiry-input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                />
              </label>
              <label className="pm-inquiry-label">
                Phone (optional)
                <input
                  type="tel"
                  className="pm-inquiry-input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 555 000 0000"
                />
              </label>
              <label className="pm-inquiry-label">
                Message
                <textarea
                  rows={4}
                  className="pm-inquiry-input pm-inquiry-textarea"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="When are you available for a viewing?"
                />
              </label>
              {formError && <p className="prop-form-error">{formError}</p>}
              <button
                className="pm-detail-btn pm-inquiry-submit"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending…' : 'Send inquiry'}
              </button>
            </form>
          )}
        </aside>
      </div>

      {/* Mini map */}
      {hasCoords && (
        <section className="pm-detail-section pm-detail-map-section">
          <h2 className="pm-detail-section-title">Location on map</h2>
          <MiniMap lat={lat} lng={lng} />
        </section>
      )}
      </div>
    </main>
  );
}
