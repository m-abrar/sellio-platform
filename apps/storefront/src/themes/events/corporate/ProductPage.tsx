'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import type { EventListing } from '@sellio/types';
import Link from 'next/link';
import { EventCard } from './components';
import { loadEventDetailPage } from '@/themes/events/shared/catalog';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';
import { redirectToEventBookingReserve } from '@/themes/events/shared/event-booking-utils';
import {
  formatEventDateLong,
  getCorporateEventImage,
  getEventLocationLabel,
} from '@/themes/events/shared/event-utils';
import {
  eventTicketOptionKey,
  type EventTicketOption,
} from '@/themes/events/shared/event-tickets';

function formatVenueCapacity(value?: string | number | null): string {
  if (value === null || value === undefined || value === '') return 'Not specified';
  const numeric = Number(value);
  if (!Number.isNaN(numeric) && numeric > 0) return `Up to ${numeric.toLocaleString()} attendees`;
  return String(value);
}

function buildGalleryImages(event: EventListing): string[] {
  const images: string[] = [];
  if (event.media?.poster) images.push(event.media.poster);
  if (event.media?.gallery && event.media.gallery.length > 0) {
    const sorted = [...event.media.gallery].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    for (const g of sorted) {
      if (g.url && !images.includes(g.url)) images.push(g.url);
    }
  }
  if (images.length === 0) images.push(getCorporateEventImage(event));
  return images;
}

export default function ProductPage() {
  const { slug } = useParams() as { slug: string };
  const themeLink = useEventsThemeLink();
  const [event, setEvent] = useState<EventListing | null>(null);
  const [related, setRelated] = useState<EventListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [ticketOptions, setTicketOptions] = useState<EventTicketOption[]>([]);
  const [selectedTicketKey, setSelectedTicketKey] = useState<string>('');

  const [galleryIndex, setGalleryIndex] = useState<number>(0);
  const [galleryPaused, setGalleryPaused] = useState<boolean>(false);

  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      const result = await loadEventDetailPage(slug, false, 'corporate');
      setEvent(result.event);
      setRelated(result.related);
      setTicketOptions(result.ticketOptions);
      setSelectedTicketKey(result.ticketOptions[0] ? eventTicketOptionKey(result.ticketOptions[0]) : '');
      setApiError(result.alertError);
      setLoading(false);
    }
    loadProduct();
  }, [slug]);

  const galleryImages = event ? buildGalleryImages(event) : [];

  useEffect(() => {
    if (galleryImages.length <= 1 || galleryPaused) return;
    const timer = setInterval(() => {
      setGalleryIndex((i) => (i + 1) % galleryImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [galleryImages.length, galleryPaused]);

  const selectedTicket = ticketOptions.find(
    (option) => eventTicketOptionKey(option) === selectedTicketKey,
  );

  function handleBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!event || !fullName || !email) {
      setFormError('Please enter your full name and professional email.');
      return;
    }
    setFormError(null);
    if (!selectedTicket) {
      setFormError('No tickets are currently available for this event.');
      return;
    }
    redirectToEventBookingReserve(themeLink, {
      eventId: event.id,
      occurrenceId: selectedTicket.occurrenceId,
      ticketTypeId: selectedTicket.ticketTypeId,
      quantity: 1,
      fullName,
      email,
    });
  }

  if (loading) {
    return (
      <div style={{ background: 'white', minHeight: '100vh' }}>
        <section className="ecc-detail-header">
          <div className="ecc-mono ecc-shimmer" style={{ width: '100px', height: '16px' }}></div>
          <div className="ecc-shimmer" style={{ width: '500px', height: '48px', marginTop: '2rem' }}></div>
        </section>
        <section className="ecc-detail-container">
          <div className="ecc-detail-grid">
            <div>
              <div className="ecc-shimmer" style={{ width: '100%', height: '400px', borderRadius: '24px' }}></div>
              <div className="ecc-shimmer" style={{ width: '100%', height: '150px', marginTop: '3rem', borderRadius: '12px' }}></div>
            </div>
            <div className="ecc-shimmer" style={{ width: '100%', height: '500px', borderRadius: '24px' }}></div>
          </div>
        </section>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="ecc-empty-state" style={{ minHeight: '70vh', paddingTop: '12rem' }} role="status">
        <h3>Event Not Found</h3>
        <p>{apiError || 'The requested event could not be found in our catalog.'}</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
          <Link href={themeLink('/explore')} className="ec-btn-primary" style={{ textDecoration: 'none' }}>
            Browse Events
          </Link>
          <Link href={themeLink('/')} className="ec-btn-outline" style={{ textDecoration: 'none' }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = selectedTicket?.price ?? event.ticketing?.sale_price ?? event.ticketing?.base_price ?? 0;
  const formattedPrice =
    event.ticketing?.is_free || currentPrice <= 0
      ? 'Free'
      : event.ticketing?.price_formatted || `$${Number(currentPrice).toFixed(2)}`;
  const passesLeft = selectedTicket?.available ?? event.ticketing?.tickets_left ?? 0;
  const locationLine = [
    event.location?.address,
    event.location?.city,
    event.location?.state,
    event.location?.country,
  ]
    .filter(Boolean)
    .join(', ');

  const hasCoords =
    typeof event.location?.latitude === 'number' &&
    typeof event.location?.longitude === 'number';
  const lat = event.location?.latitude;
  const lon = event.location?.longitude;
  const mapSrc = hasCoords && lat != null && lon != null
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${(lon - 0.015).toFixed(5)},${(lat - 0.015).toFixed(5)},${(lon + 0.015).toFixed(5)},${(lat + 0.015).toFixed(5)}&layer=mapnik&marker=${lat},${lon}`
    : null;

  const isLowInventory = passesLeft > 0 && passesLeft < 30;
  const isSoldOut = passesLeft <= 0 && ticketOptions.length > 0;

  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      <section className="ecc-detail-header" aria-labelledby="ecc-event-detail-title">
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <span className="ecc-event-card-tag" style={{ marginBottom: 0 }}>
            {event.specs?.category || 'Summit'}
          </span>
          {event.specs?.type && (
            <span className="ecc-event-card-tag" style={{ marginBottom: 0, background: 'var(--ecc-bone)', color: 'var(--ecc-text-main)' }}>
              {event.specs.type}
            </span>
          )}
          {event.schedule?.is_virtual && (
            <span
              className="ecc-mono"
              style={{ color: 'var(--ecc-blue)', background: 'rgba(0,113,227,0.08)', padding: '0.35rem 0.85rem', borderRadius: '50px', fontSize: '0.65rem' }}
            >
              VIRTUAL EVENT
            </span>
          )}
        </div>
        <h1
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: 'var(--ecc-obsidian)', letterSpacing: '-2.5px', lineHeight: 1.05 }}
          id="ecc-event-detail-title"
        >
          {event.title}
        </h1>
        <p className="ecc-results-meta" style={{ marginTop: '1.25rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {formatEventDateLong(event)}
          </span>
          <span style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {getEventLocationLabel(event)}
          </span>
        </p>
      </section>

      <section className="ecc-detail-container">
        <div className="ecc-detail-grid">
          {/* Left column */}
          <div>
            {/* Image gallery with auto-rotate (pauses on hover/interaction) */}
            <div
              style={{ position: 'relative', borderRadius: 'var(--ecc-radius-md)', overflow: 'hidden', height: '480px', marginBottom: galleryImages.length > 1 ? '1rem' : '4rem', background: 'var(--ecc-bone)', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
              onMouseEnter={() => setGalleryPaused(true)}
              onMouseLeave={() => setGalleryPaused(false)}
            >
              <img
                src={galleryImages[galleryIndex]}
                alt={`${event.title} — image ${galleryIndex + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.4s ease' }}
              />
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={() => { setGalleryPaused(true); setGalleryIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length); }}
                    style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={() => { setGalleryPaused(true); setGalleryIndex((i) => (i + 1) % galleryImages.length); }}
                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                  <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.4rem' }}>
                    {galleryImages.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`Go to image ${i + 1}`}
                        onClick={() => { setGalleryPaused(true); setGalleryIndex(i); }}
                        style={{ width: i === galleryIndex ? '24px' : '8px', height: '8px', borderRadius: '4px', background: i === galleryIndex ? 'white' : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', transition: 'all 0.2s', padding: 0 }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {galleryImages.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '4rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {galleryImages.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setGalleryPaused(true); setGalleryIndex(i); }}
                    style={{ flexShrink: 0, width: '80px', height: '56px', borderRadius: '8px', overflow: 'hidden', border: i === galleryIndex ? '2px solid var(--ecc-blue)' : '2px solid transparent', cursor: 'pointer', padding: 0, background: 'none' }}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </button>
                ))}
              </div>
            )}

            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ecc-obsidian)', marginBottom: '2rem', letterSpacing: '-0.5px' }}>About This Event</h2>
            <div className="ecc-rich-description">
              <p>{event.description || 'No description available for this event.'}</p>
            </div>

            <div className="ecc-specs-grid">
              <div className="ecc-spec-item">
                <span className="ecc-spec-label">Category</span>
                <span className="ecc-spec-value">{event.specs?.category || '—'}</span>
              </div>
              <div className="ecc-spec-item">
                <span className="ecc-spec-label">Event Type</span>
                <span className="ecc-spec-value">{event.specs?.type || '—'}</span>
              </div>
              <div className="ecc-spec-item">
                <span className="ecc-spec-label">Venue Capacity</span>
                <span className="ecc-spec-value">{formatVenueCapacity(event.specs?.venue_size ?? event.ticketing?.max_attendees)}</span>
              </div>
              <div className="ecc-spec-item">
                <span className="ecc-spec-label">Organizer</span>
                <span className="ecc-spec-value">{event.organizer?.name || '—'}</span>
              </div>
              {event.specs?.event_genre && (
                <div className="ecc-spec-item">
                  <span className="ecc-spec-label">Genre</span>
                  <span className="ecc-spec-value">{event.specs.event_genre}</span>
                </div>
              )}
              {event.specs?.tags && event.specs.tags.length > 0 && (
                <div className="ecc-spec-item" style={{ gridColumn: '1 / -1' }}>
                  <span className="ecc-spec-label">Tags</span>
                  <span className="ecc-spec-value" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                    {event.specs.tags.map((tag) => (
                      <span key={tag} style={{ background: 'var(--ecc-bone)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--ecc-text-muted)' }}>{tag}</span>
                    ))}
                  </span>
                </div>
              )}
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ecc-obsidian)', marginBottom: '2rem', letterSpacing: '-0.5px', marginTop: '4rem' }}>Location & Venue</h2>
            {locationLine && (
              <p style={{ color: 'var(--ecc-text-muted)', fontSize: '1.05rem', lineHeight: 1.8, fontWeight: 300, marginBottom: '2rem' }}>
                {locationLine}
              </p>
            )}

            {mapSrc ? (
              <div style={{ borderRadius: 'var(--ecc-radius-md)', overflow: 'hidden', border: '1px solid var(--ecc-border)', marginBottom: '1rem' }}>
                <iframe
                  src={mapSrc}
                  title={`Map for ${event.title}`}
                  width="100%"
                  height="320"
                  style={{ display: 'block', border: 'none' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <div className="ecc-map-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ecc-blue)' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="ecc-mono" style={{ fontSize: '0.7rem' }}>VENUE LOCATION</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--ecc-obsidian)' }}>{getEventLocationLabel(event)}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--ecc-text-muted)' }}>Venue coordinates not available</span>
              </div>
            )}
            {hasCoords && lat != null && lon != null && (
              <a
                href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=15`}
                target="_blank"
                rel="noopener noreferrer"
                className="ecc-mono"
                style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: '0.7rem', color: 'var(--ecc-blue)', textDecoration: 'none' }}
              >
                OPEN IN FULL MAP →
              </a>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="ecc-booking-desk">
              <h3 className="ecc-booking-title">Reserve Your Pass</h3>

              {isSoldOut && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                  <p style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>Sold Out</p>
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>All tickets for this event have been claimed.</p>
                </div>
              )}

              {isLowInventory && (
                <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span style={{ color: '#ea580c', fontSize: '0.85rem', fontWeight: 600 }}>Only {passesLeft} passes left — act fast</span>
                </div>
              )}

              {/* Ticket type selection */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="ecc-form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Pass Type</label>
                <div className="ecc-ticket-tabs">
                  {ticketOptions.length > 0 ? (
                    ticketOptions.map((option) => {
                      const key = eventTicketOptionKey(option);
                      return (
                        <button
                          key={key}
                          type="button"
                          className={`ecc-ticket-tab ${selectedTicketKey === key ? 'ecc-ticket-tab-active' : ''}`}
                          onClick={() => setSelectedTicketKey(key)}
                          aria-label={`${option.ticketName} ticket option`}
                        >
                          {option.ticketName}
                        </button>
                      );
                    })
                  ) : (
                    <p className="ecc-form-error">No tickets available for upcoming dates.</p>
                  )}
                </div>
                {selectedTicket && (
                  <p style={{ color: 'var(--ecc-text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    {selectedTicket.occurrenceLabel}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="ecc-price-summary" style={{ marginBottom: '2rem' }}>
                <span className="ecc-summary-label">Pass Price</span>
                <span className="ecc-summary-val">{formattedPrice}</span>
              </div>

              <form className="ecc-booking-form" onSubmit={handleBooking}>
                <div className="ecc-form-group">
                  <label className="ecc-form-label" htmlFor="ecc-field-name">Full Name</label>
                  <input
                    id="ecc-field-name"
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    className="ecc-form-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="ecc-form-group">
                  <label className="ecc-form-label" htmlFor="ecc-field-email">Professional Email</label>
                  <input
                    id="ecc-field-email"
                    type="email"
                    placeholder="e.g. sarah@company.com"
                    className="ecc-form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="ecc-form-group">
                  <label className="ecc-form-label" htmlFor="ecc-field-company">Company <span style={{ color: 'var(--ecc-text-muted)', fontWeight: 400 }}>(optional)</span></label>
                  <input
                    id="ecc-field-company"
                    type="text"
                    placeholder="Your organization"
                    className="ecc-form-input"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                <div className="ecc-form-group">
                  <label className="ecc-form-label" htmlFor="ecc-field-requests">Special Requirements <span style={{ color: 'var(--ecc-text-muted)', fontWeight: 400 }}>(optional)</span></label>
                  <textarea
                    id="ecc-field-requests"
                    placeholder="Accessibility needs, dietary preferences..."
                    className="ecc-form-input"
                    style={{ resize: 'none', height: '90px' }}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </div>

                {formError && (
                  <p className="ecc-form-error" role="alert">{formError}</p>
                )}

                <button
                  type="submit"
                  className="ec-btn-primary"
                  style={{ width: '100%', borderRadius: '12px', marginTop: '0.5rem' }}
                  id="ecc-btn-reserve"
                  disabled={!selectedTicket || isSoldOut}
                >
                  Continue to Payment
                </button>
              </form>

              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--ecc-text-muted)' }}>Availability</span>
                  <span style={{ fontWeight: 700, color: isSoldOut ? '#dc2626' : isLowInventory ? '#f97316' : 'var(--ecc-obsidian)' }}>
                    {isSoldOut ? 'Sold Out' : `${passesLeft} passes left`}
                  </span>
                </div>
                {event.organizer?.name && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--ecc-text-muted)' }}>Hosted by</span>
                    <span style={{ fontWeight: 600, color: 'var(--ecc-obsidian)' }}>{event.organizer.name}</span>
                  </div>
                )}
              </div>

              <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--ecc-text-muted)', marginTop: '1.5rem', lineHeight: 1.6 }}>
                Secure checkout · Instant confirmation · Refund policy applies
              </p>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="ecc-related-section" aria-labelledby="ecc-related-header-title">
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div className="ecc-mono">YOU MAY ALSO LIKE</div>
            <h2
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--ecc-obsidian)', letterSpacing: '-1.5px', marginTop: '1rem' }}
              id="ecc-related-header-title"
            >
              More Events to Explore
            </h2>

            <div className="ecc-carousel-container">
              <div className="ecc-carousel-grid">
                {related.map((item) => (
                  <div className="ecc-carousel-item" key={item.id}>
                    <EventCard event={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
