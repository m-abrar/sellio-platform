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
  if (value === null || value === undefined || value === '') {
    return 'Not specified';
  }

  const numeric = Number(value);
  if (!Number.isNaN(numeric) && numeric > 0) {
    return `Up to ${numeric.toLocaleString()} attendees`;
  }

  return String(value);
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

  const selectedTicket = ticketOptions.find(
    (option) => eventTicketOptionKey(option) === selectedTicketKey,
  );

  function handleBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!event || !fullName || !email) {
      setFormError('Please input your name and professional email.');
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
        <h3>Convention Not Found</h3>
        <p>{apiError || 'The requested event listing could not be found in our catalog.'}</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
          <Link href={themeLink('/explore')} className="ec-btn-primary" style={{ textDecoration: 'none' }}>
            Browse Conventions
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

  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      <section className="ecc-detail-header" aria-labelledby="ecc-event-detail-title">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <span className="ecc-event-card-tag" style={{ marginBottom: 0 }}>
            {event.specs?.category || 'Convention'}
          </span>
          {event.schedule?.is_virtual && (
            <span
              className="ecc-mono"
              style={{ color: 'var(--ecc-blue)', background: 'rgba(0,113,227,0.08)', padding: '0.35rem 0.85rem', borderRadius: '50px', fontSize: '0.65rem' }}
            >
              VIRTUAL PORTAL
            </span>
          )}
        </div>
        <h1
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: 'var(--ecc-obsidian)', letterSpacing: '-2.5px', lineHeight: 1.05 }}
          id="ecc-event-detail-title"
        >
          {event.title}
        </h1>
        <p className="ecc-results-meta" style={{ marginTop: '1.25rem' }}>
          {formatEventDateLong(event)} · {getEventLocationLabel(event)}
        </p>
      </section>

      <section className="ecc-detail-container">
        <div className="ecc-detail-grid">
          <div>
            <div className="ecc-event-poster-wrapper" style={{ borderRadius: 'var(--ecc-radius-md)', height: '480px', marginBottom: '4rem', boxShadow: '0 20px 40px rgba(0,0,0,0.04)' }}>
              <img src={getCorporateEventImage(event)} alt={event.title} className="ecc-event-poster" />
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ecc-obsidian)', marginBottom: '2rem', letterSpacing: '-0.5px' }}>About the Convention</h2>
            <div className="ecc-rich-description">
              <p>{event.description || 'No description available for this event.'}</p>
            </div>

            <div className="ecc-specs-grid">
              <div className="ecc-spec-item">
                <span className="ecc-spec-label">Domain Genre</span>
                <span className="ecc-spec-value">{event.specs?.event_genre || '—'}</span>
              </div>
              <div className="ecc-spec-item">
                <span className="ecc-spec-label">Convention Type</span>
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
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ecc-obsidian)', marginBottom: '2rem', letterSpacing: '-0.5px', marginTop: '4rem' }}>Location & Host Venue</h2>
            <p style={{ color: 'var(--ecc-text-muted)', fontSize: '1.1rem', lineHeight: 1.8, fontWeight: 300, marginBottom: '2.5rem' }}>
              {locationLine || getEventLocationLabel(event)}
            </p>

            <div className="ecc-map-placeholder">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ecc-blue)' }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span className="ecc-mono" style={{ fontSize: '0.7rem' }}>VENUE LOCATION</span>
              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--ecc-obsidian)' }}>{getEventLocationLabel(event)}</span>
              {event.location?.latitude && event.location?.longitude && (
                <span style={{ fontSize: '0.85rem', color: 'var(--ecc-text-muted)' }}>
                  {event.location.latitude.toFixed(4)}, {event.location.longitude.toFixed(4)}
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="ecc-booking-desk">
              <h3 className="ecc-booking-title">Get Delegate Pass</h3>

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
                        {option.ticketName.toUpperCase()}
                      </button>
                    );
                  })
                ) : (
                  <p className="ecc-form-error">No ticket inventory is available for upcoming dates.</p>
                )}
              </div>

              {selectedTicket && (
                <p className="ecc-mono" style={{ fontSize: '0.7rem', marginBottom: '1rem' }}>
                  {selectedTicket.occurrenceLabel}
                </p>
              )}

              <div className="ecc-price-summary">
                <span className="ecc-summary-label">Pass Valuation</span>
                <span className="ecc-summary-val">{formattedPrice}</span>
              </div>

              <form className="ecc-booking-form" onSubmit={handleBooking}>
                <div className="ecc-form-group">
                  <label className="ecc-form-label" htmlFor="ecc-field-name">
                    Delegate Full Name
                  </label>
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
                  <label className="ecc-form-label" htmlFor="ecc-field-email">
                    Professional Email
                  </label>
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
                  <label className="ecc-form-label" htmlFor="ecc-field-company">
                    Company / Organization
                  </label>
                  <input
                    id="ecc-field-company"
                    type="text"
                    placeholder="Optional"
                    className="ecc-form-input"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                <div className="ecc-form-group">
                  <label className="ecc-form-label" htmlFor="ecc-field-requests">
                    Special Requirements
                  </label>
                  <textarea
                    id="ecc-field-requests"
                    placeholder="Accessibility requirements, dietary details..."
                    className="ecc-form-input"
                    style={{ resize: 'none', height: '100px' }}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  ></textarea>
                </div>

                {formError && (
                  <p className="ecc-form-error" role="alert">
                    {formError}
                  </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--ecc-text-muted)', margin: '1rem 0' }}>
                  <span>Passes Left</span>
                  <span style={{ fontWeight: 800, color: passesLeft < 100 ? '#dc2626' : 'var(--ecc-obsidian)' }}>
                    {passesLeft} Left
                  </span>
                </div>

                <button
                  type="submit"
                  className="ec-btn-primary"
                  style={{ width: '100%', borderRadius: '12px' }}
                  id="ecc-btn-reserve"
                  disabled={!selectedTicket}
                >
                  CONTINUE TO PAYMENT
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="ecc-related-section" aria-labelledby="ecc-related-header-title">
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div className="ecc-mono">FACET_SYNCHRONIZED // OPTIONS</div>
            <h2
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--ecc-obsidian)', letterSpacing: '-1.5px', marginTop: '1rem' }}
              id="ecc-related-header-title"
            >
              Other Curated Conventions
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
