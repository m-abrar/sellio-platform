'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import type { EventListing, EventTicketDataMap } from '@sellio/types';
import { EventCard } from './components';
import { CatalogSyncAlert } from '@/themes/events/shared/CatalogSyncAlert';
import { fetchEventDetail, resolveEventFailure } from '@/themes/events/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/events/shared/useDemoFallbackAllowed';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';
import { redirectToEventBookingReserve } from '@/themes/events/shared/event-booking-utils';
import { getCorporateEventImage } from '@/themes/events/shared/event-utils';
import {
  buildEventTicketOptions,
  eventTicketOptionKey,
  type EventTicketOption,
} from '@/themes/events/shared/event-tickets';

export default function ProductPage() {
  const { slug } = useParams() as { slug: string };
  const themeLink = useEventsThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const [event, setEvent] = useState<EventListing | null>(null);
  const [related, setRelated] = useState<EventListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [ticketOptions, setTicketOptions] = useState<EventTicketOption[]>([]);
  const [selectedTicketKey, setSelectedTicketKey] = useState<string>('');
  const [ticketType, setTicketType] = useState<'general' | 'vip'>('general');
  const [ticketsCount, setTicketsCount] = useState<number>(1420);

  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;

      setLoading(true);
      setNotFound(false);
      const result = await fetchEventDetail(slug);

      if (result.ok && result.response.data) {
        const ticketData = result.response.meta?.ticket_data ?? {};
        const options = buildEventTicketOptions(ticketData);

        setEvent(result.response.data);
        setTicketOptions(options);
        setSelectedTicketKey(options[0] ? eventTicketOptionKey(options[0]) : '');
        setTicketsCount(
          options[0]?.available ?? result.response.data.ticketing?.tickets_left ?? 0,
        );
        setRelated(result.response.related_events || []);
        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'Event not found or API returned no data.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveEventFailure(slug, allowDemo, 'corporate');

        if (resolution.mode === 'demo') {
          setEvent(resolution.event);
          setTicketsCount(resolution.event.ticketing?.tickets_left || 1200);
          setRelated(resolution.related);
          setUseFallback(true);
        } else if (resolution.mode === 'notFound') {
          setEvent(null);
          setNotFound(true);
          setUseFallback(false);
        } else {
          setEvent(null);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadProduct();
  }, [slug, allowDemo]);

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

    if (!useFallback) {
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
      return;
    }

    const price =
      ticketType === 'general'
        ? event.ticketing?.sale_price || event.ticketing?.base_price || 0
        : (event.ticketing?.sale_price || event.ticketing?.base_price || 0) * 2;

    const registrationPayload = {
      event_id: event.id,
      event_title: event.title,
      event_slug: event.slug,
      ticket_type: ticketType,
      price,
      delegate_name: fullName,
      delegate_email: email,
      delegate_company: company,
      special_requests: specialRequests,
      booked_at: new Date().toISOString(),
    };

    const existing = localStorage.getItem('sellio_events_corporate_registrations');
    const list = existing ? JSON.parse(existing) : [];
    list.push(registrationPayload);
    localStorage.setItem('sellio_events_corporate_registrations', JSON.stringify(list));

    setTicketsCount((prev) => (prev > 0 ? prev - 1 : 0));
    setIsBooked(true);
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

  if (notFound || !event) {
    return (
      <div style={{ padding: '12rem 8% 8rem', textAlign: 'center', background: 'white', minHeight: '100vh' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Convention Specs Missing</h2>
        <p style={{ color: 'var(--ecc-text-muted)', marginTop: '1.5rem' }}>
          The requested event listing details could not be found.
        </p>
        <a href={themeLink('')} className="ec-btn-primary" style={{ display: 'inline-block', marginTop: '2rem', textDecoration: 'none' }}>
          Browse Conventions
        </a>
      </div>
    );
  }

  const basePriceVal = event.ticketing?.sale_price || event.ticketing?.base_price || 0;
  const demoPrice = ticketType === 'general' ? basePriceVal : basePriceVal * 2;
  const livePrice = selectedTicket?.price ?? basePriceVal;
  const currentPrice = useFallback ? demoPrice : livePrice;
  const formattedPrice = event.ticketing?.is_free || currentPrice <= 0
    ? 'Free'
    : `$${Number(currentPrice).toFixed(2)}`;
  const passesLeft = useFallback
    ? ticketsCount
    : selectedTicket?.available ?? event.ticketing?.tickets_left ?? 0;

  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      <section className="ecc-detail-header" aria-labelledby="ecc-event-detail-title">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
          <span className="ecc-event-card-tag" style={{ marginBottom: 0 }}>{event.specs?.category || 'Convention'}</span>
          {event.schedule?.is_virtual && (
            <span className="ecc-mono" style={{ color: 'var(--ecc-blue)', background: 'rgba(0,113,227,0.08)', padding: '0.35rem 0.85rem', borderRadius: '50px', fontSize: '0.65rem' }}>VIRTUAL PORTAL</span>
          )}
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: 'var(--ecc-obsidian)', letterSpacing: '-2.5px', lineHeight: 1.05 }} id="ecc-event-detail-title">
          {event.title}
        </h1>
      </section>

      <section className="ecc-detail-container">
        {apiError && useFallback && (
          <div className="ecc-alert-slot">
            <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ecc" />
          </div>
        )}

        <div className="ecc-detail-grid">
          <div>
            <div className="ecc-event-poster-wrapper" style={{ borderRadius: 'var(--ecc-radius-md)', height: '480px', marginBottom: '4rem', boxShadow: '0 20px 40px rgba(0,0,0,0.04)' }}>
              <img src={getCorporateEventImage(event)} alt={event.title} className="ecc-event-poster" />
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ecc-obsidian)', marginBottom: '2rem', letterSpacing: '-0.5px' }}>About the Convention</h2>
            <div className="ecc-rich-description">
              <p>{event.description}</p>
              <p>Join thousands of industry veterans and developers at our structured masterclass formats. Deep dive into practical implementation architectures, interact directly with core engineering faculty during panel breakout programs, and secure technical accreditations.</p>
            </div>

            <div className="ecc-specs-grid">
              <div className="ecc-spec-item">
                <span className="ecc-spec-label">Domain Genre</span>
                <span className="ecc-spec-value">{event.specs?.event_genre || 'Software Engineering'}</span>
              </div>
              <div className="ecc-spec-item">
                <span className="ecc-spec-label">Conventioneer Type</span>
                <span className="ecc-spec-value">{event.specs?.type || 'Conference'}</span>
              </div>
              <div className="ecc-spec-item">
                <span className="ecc-spec-label">Venue / Grid capacity</span>
                <span className="ecc-spec-value">{event.specs?.venue_size || 'Moscone Center'}</span>
              </div>
              <div className="ecc-spec-item">
                <span className="ecc-spec-label">Brand Series</span>
                <span className="ecc-spec-value">{event.specs?.brand || 'Forum26 series'}</span>
              </div>
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ecc-obsidian)', marginBottom: '2rem', letterSpacing: '-0.5px', marginTop: '4rem' }}>Location & Host venue</h2>
            <p style={{ color: 'var(--ecc-text-muted)', fontSize: '1.1rem', lineHeight: 1.8, fontWeight: 300, marginBottom: '2.5rem' }}>
              {event.location?.address ? `${event.location.address}, ${event.location.city}, ${event.location.state || ''} ${event.location.country || ''}` : 'Moscone Center, San Francisco, California, USA'}
            </p>

            <div style={{
              width: '100%',
              height: '350px',
              borderRadius: 'var(--ecc-radius-md)',
              background: '#f4f4f6',
              border: '1.5px solid var(--ecc-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '1rem',
              color: 'var(--ecc-text-muted)',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ecc-blue)' }}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="18"></line><line x1="15" y1="6" x2="15" y2="21"></line></svg>
              <span className="ecc-mono" style={{ fontSize: '0.7rem' }}>INTERACTIVE MAP LAYER // ACTIVE</span>
              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--ecc-obsidian)' }}>{event.location?.map_title || event.location?.city || 'San Francisco Center Grid'}</span>
            </div>
          </div>

          <div>
            <div className="ecc-booking-desk">
              <h3 className="ecc-booking-title">Get Delegate Pass</h3>

              <div className="ecc-ticket-tabs">
                {useFallback ? (
                  <>
                    <button
                      type="button"
                      className={`ecc-ticket-tab ${ticketType === 'general' ? 'ecc-ticket-tab-active' : ''}`}
                      onClick={() => { if (!isBooked) setTicketType('general'); }}
                      aria-label="General pass ticket selection option"
                    >
                      GENERAL PASS
                    </button>
                    <button
                      type="button"
                      className={`ecc-ticket-tab ${ticketType === 'vip' ? 'ecc-ticket-tab-active' : ''}`}
                      onClick={() => { if (!isBooked) setTicketType('vip'); }}
                      aria-label="VIP Deluxe ticket selection option"
                    >
                      VIP DELUXE
                    </button>
                  </>
                ) : ticketOptions.length > 0 ? (
                  ticketOptions.map((option) => {
                    const key = eventTicketOptionKey(option);
                    return (
                      <button
                        key={key}
                        type="button"
                        className={`ecc-ticket-tab ${selectedTicketKey === key ? 'ecc-ticket-tab-active' : ''}`}
                        onClick={() => {
                          setSelectedTicketKey(key);
                          setTicketsCount(option.available);
                        }}
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
              {!useFallback && selectedTicket && (
                <p className="ecc-mono" style={{ fontSize: '0.7rem', marginBottom: '1rem' }}>
                  {selectedTicket.occurrenceLabel}
                </p>
              )}

              <div className="ecc-price-summary">
                <span className="ecc-summary-label">Pass Valuation</span>
                <span className="ecc-summary-val">{formattedPrice}</span>
              </div>

              {isBooked ? (
                <div className="ecc-success-alert" id="ecc-success-notice">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#059669', marginBottom: '1rem', display: 'inline-block' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Pass Reserved!</h4>
                  <p style={{ fontWeight: 300, fontSize: '0.85rem' }}>
                    Congratulations! Your {ticketType === 'vip' ? 'VIP Deluxe' : 'General'} pass registration has been logged. Look out for an email confirmation.
                  </p>
                </div>
              ) : (
                <form className="ecc-booking-form" onSubmit={handleBooking}>
                  <div className="ecc-form-group">
                    <label className="ecc-form-label" htmlFor="ecc-field-name">Delegate Full Name</label>
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
                      placeholder="e.g. sarah@nexustech.com"
                      className="ecc-form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="ecc-form-group">
                    <label className="ecc-form-label" htmlFor="ecc-field-company">Company / Organization</label>
                    <input
                      id="ecc-field-company"
                      type="text"
                      placeholder="e.g. Nexus Tech Logic"
                      className="ecc-form-input"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                  <div className="ecc-form-group">
                    <label className="ecc-form-label" htmlFor="ecc-field-requests">Special Requirements</label>
                    <textarea
                      id="ecc-field-requests"
                      placeholder="Accessibility requirements, dietary details, seat choices..."
                      className="ecc-form-input"
                      style={{ resize: 'none', height: '100px' }}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                    ></textarea>
                  </div>

                  {formError && (
                    <p className="ecc-form-error" role="alert">{formError}</p>
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
                    disabled={!useFallback && !selectedTicket}
                  >
                    {useFallback ? 'RESERVE MY SEAT NOW' : 'CONTINUE TO PAYMENT'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="ecc-related-section" aria-labelledby="ecc-related-header-title">
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div className="ecc-mono">FACET_SYNCHRONIZED // OPTIONS</div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--ecc-obsidian)', letterSpacing: '-1.5px', marginTop: '1rem' }} id="ecc-related-header-title">
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
