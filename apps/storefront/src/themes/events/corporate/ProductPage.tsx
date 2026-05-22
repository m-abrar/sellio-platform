'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@sellio/api-client';
import { EventListing } from '@sellio/types';
import { EventCard } from './components';

const FALLBACK_EVENTS: EventListing[] = [
  {
    id: 101,
    title: "FORUM26: World Engineering Summit",
    slug: "forum26-world-engineering-summit",
    description: "The premier global assembly for architectural engineering and distributed systems. Shaping the future of technical infrastructure. Over three days, delegates will explore systems architectural limits, scalable designs, distributed ledger integrity, and secure network infrastructure patterns.",
    schedule: {
      start_at: "2026-10-14T09:00:00Z",
      end_at: "2026-10-16T17:00:00Z",
      duration_hours: 48,
      is_virtual: false,
    },
    ticketing: {
      is_paid: true,
      is_free: false,
      base_price: 599.00,
      sale_price: 499.00,
      price_formatted: "$499.00",
      price_formatted_k: "$0.5k",
      max_attendees: 5000,
      tickets_left: 1420
    },
    specs: {
      category: "Summit",
      type: "Conference",
      brand: "Forum26 Series",
      event_genre: "Distributed Systems",
      venue_size: "5,000 Delegates",
      tags: ["Scale", "Architecture", "AI"]
    },
    media: {
      poster: "/themes/events/corporate/1.webp",
      preview: "/themes/events/corporate/1.webp",
      gallery: []
    },
    location: {
      address: "Moscone Center, 747 Howard St",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      latitude: 37.784,
      longitude: -122.401,
      map_title: "Moscone Center"
    },
    status: {
      is_published: true,
      is_featured: true,
      rating: 4.9
    }
  },
  {
    id: 102,
    title: "Distributed Systems Expo 2026",
    slug: "distributed-systems-expo-2026",
    description: "Deep dive into reactive systems, microservices coordination, and event-driven data platforms at scale. A highly technical exhibition and networking symposium.",
    schedule: {
      start_at: "2026-11-05T09:00:00Z",
      end_at: "2026-11-06T18:00:00Z",
      duration_hours: 18,
      is_virtual: false,
    },
    ticketing: {
      is_paid: true,
      is_free: false,
      base_price: 399.00,
      sale_price: 399.00,
      price_formatted: "$399.00",
      price_formatted_k: "$0.4k",
      max_attendees: 1500,
      tickets_left: 450
    },
    specs: {
      category: "Expo",
      type: "Exhibition",
      brand: "Systems Group",
      event_genre: "Cloud Native",
      venue_size: "1,500 Attendees",
      tags: ["Kubernetes", "Kafka", "Go"]
    },
    media: {
      poster: "/themes/events/corporate/2.webp",
      preview: "/themes/events/corporate/2.webp",
      gallery: []
    },
    location: {
      address: "San Jose Convention Center",
      city: "San Jose",
      state: "CA",
      country: "USA",
      latitude: 37.329,
      longitude: -121.889,
      map_title: "San Jose Convention Center"
    },
    status: {
      is_published: true,
      is_featured: true,
      rating: 4.7
    }
  },
  {
    id: 103,
    title: "Enterprise Cyber Security Forum",
    slug: "enterprise-cyber-security-forum",
    description: "Hardening the digital core against modern threats. Interactive panels on zero trust architectures, advanced threat modeling, cryptography paradigms, and automated threat response in clouds.",
    schedule: {
      start_at: "2026-12-10T10:00:00Z",
      end_at: "2026-12-12T16:00:00Z",
      duration_hours: 24,
      is_virtual: true,
    },
    ticketing: {
      is_paid: false,
      is_free: true,
      base_price: 0,
      sale_price: 0,
      price_formatted: "Free",
      price_formatted_k: "Free",
      max_attendees: 10000,
      tickets_left: 8200
    },
    specs: {
      category: "Security",
      type: "Virtual Event",
      brand: "Cyber Shield Inc.",
      event_genre: "Cybersecurity",
      venue_size: "Unlimited Stream",
      tags: ["Zero Trust", "Cloud", "SecOps"]
    },
    media: {
      poster: "/themes/events/corporate/3.webp",
      preview: "/themes/events/corporate/3.webp",
      gallery: []
    },
    location: {
      address: "Virtual Stream Platform",
      city: "Online",
      state: "Global",
      country: "WW",
      latitude: 0,
      longitude: 0,
      map_title: "Online Portal"
    },
    status: {
      is_published: true,
      is_featured: true,
      rating: 4.8
    }
  },
  {
    id: 104,
    title: "AI & Neural Scaling Summit 2026",
    slug: "ai-neural-scaling-summit-2026",
    description: "Gathering leading practitioners training and deploying large-scale neural network paradigms and agent systems globally. Topics include transformer layers, distributed GPU fabrics, hyperparameter schedules, and alignment frameworks.",
    schedule: {
      start_at: "2026-10-22T08:30:00Z",
      end_at: "2026-10-23T18:00:00Z",
      duration_hours: 20,
      is_virtual: false,
    },
    ticketing: {
      is_paid: true,
      is_free: false,
      base_price: 799.00,
      sale_price: 699.00,
      price_formatted: "$699.00",
      price_formatted_k: "$0.7k",
      max_attendees: 3000,
      tickets_left: 890
    },
    specs: {
      category: "AI Summit",
      type: "Conference",
      brand: "Nexus Logic",
      event_genre: "Artificial Intelligence",
      venue_size: "3,000 Delegates",
      tags: ["Deep Learning", "LLMs", "Scale"]
    },
    media: {
      poster: "/themes/events/corporate/4.webp",
      preview: "/themes/events/corporate/4.webp",
      gallery: []
    },
    location: {
      address: "Palace of Fine Arts",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      latitude: 37.802,
      longitude: -122.448,
      map_title: "Palace of Fine Arts"
    },
    status: {
      is_published: true,
      is_featured: true,
      rating: 4.9
    }
  }
];

export default function ProductPage() {
  const { slug } = useParams() as { slug: string };
  const [event, setEvent] = useState<EventListing | null>(null);
  const [related, setRelated] = useState<EventListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorTrace, setErrorTrace] = useState<string | null>(null);

  // Stateful Ticket Choice
  const [ticketType, setTicketType] = useState<'general' | 'vip'>('general');
  const [ticketsCount, setTicketsCount] = useState<number>(1420);

  // Stateful booking form variables
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [isBooked, setIsBooked] = useState<boolean>(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setErrorTrace(null);
        
        const details = await api.getEventDetails(slug);
        if (details && details.data) {
          setEvent(details.data);
          setTicketsCount(details.data.ticketing?.tickets_left || 880);
          if (details.related_events) {
            setRelated(details.related_events);
          } else {
            // Pull fallback related based on category
            const rel = FALLBACK_EVENTS.filter(f => f.slug !== slug);
            setRelated(rel);
          }
        } else {
          throw new Error("No conference specs received from backend API");
        }
      } catch (err: any) {
        console.error("Product Page API failure. Launching resilience controller.", err);
        setErrorTrace(
          `DATABASE_OFFLINE_DIAGNOSTICS_TRACE\n` +
          `STATUS: [OFFLINE] | LATENCY: [TIMEOUT] | REASON: [${err.message || 'axios connection refused'}]\n` +
          `ACTION: Gracefully activated premium offline node resilience. Loading high-fidelity local catalog backups...`
        );
        
        // Find in local seed models
        const matched = FALLBACK_EVENTS.find(f => f.slug === slug) || FALLBACK_EVENTS[0];
        setEvent(matched);
        setTicketsCount(matched.ticketing?.tickets_left || 1200);
        
        // Related
        const rel = FALLBACK_EVENTS.filter(f => f.slug !== matched.slug);
        setRelated(rel);
      } finally {
        setLoading(false);
      }
    }
    if (slug) loadProduct();
  }, [slug]);

  // Handle Delegate reservation
  function handleBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName || !email) {
      alert('Please input your name and professional email.');
      return;
    }

    const price = ticketType === 'general'
      ? event?.ticketing?.sale_price || event?.ticketing?.base_price || 0
      : (event?.ticketing?.sale_price || event?.ticketing?.base_price || 0) * 2;

    const registrationPayload = {
      event_id: event?.id,
      event_title: event?.title,
      event_slug: event?.slug,
      ticket_type: ticketType,
      price: price,
      delegate_name: fullName,
      delegate_email: email,
      delegate_company: company,
      special_requests: specialRequests,
      booked_at: new Date().toISOString()
    };

    // Store in LocalStorage under key: sellio_events_corporate_registrations
    const existing = localStorage.getItem('sellio_events_corporate_registrations');
    const list = existing ? JSON.parse(existing) : [];
    list.push(registrationPayload);
    localStorage.setItem('sellio_events_corporate_registrations', JSON.stringify(list));

    // Update tickets left dynamically on UI for realism
    setTicketsCount(prev => (prev > 0 ? prev - 1 : 0));
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

  if (!event) {
    return (
      <div style={{ padding: '12rem 8% 8rem', textAlign: 'center', background: 'white', minHeight: '100vh' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Convention Specs Missing</h2>
        <p style={{ color: 'var(--ecc-text-muted)', marginTop: '1.5rem' }}>The requested event listing details could not be found.</p>
      </div>
    );
  }

  const basePriceVal = event.ticketing?.sale_price || event.ticketing?.base_price || 0;
  const currentPrice = ticketType === 'general' ? basePriceVal : basePriceVal * 2;
  const formattedPrice = event.ticketing?.is_free 
    ? 'Free' 
    : `$${currentPrice.toFixed(2)}`;

  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      {/* Detail Parallax Header */}
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

      {/* Main Grid content */}
      <section className="ecc-detail-container">
        {/* Offline warnings panel */}
        {errorTrace && (
          <div className="ecc-diagnostics-card" id="ecc-product-diagnostics">
            <div className="ecc-diagnostics-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              <span>DATABASE CONNECTION WARNING</span>
            </div>
            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>
              The dynamic Laravel API database is currently offline. Activating premium local node resilience fallback.
            </p>
            <pre className="ecc-diagnostics-trace">{errorTrace}</pre>
          </div>
        )}

        <div className="ecc-detail-grid">
          {/* Main Description */}
          <div>
            <div className="ecc-event-poster-wrapper" style={{ borderRadius: 'var(--ecc-radius-md)', height: '480px', marginBottom: '4rem', boxShadow: '0 20px 40px rgba(0,0,0,0.04)' }}>
              <img src={event.media?.poster || '/themes/events/corporate/1.webp'} alt={event.title} className="ecc-event-poster" />
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ecc-obsidian)', marginBottom: '2rem', letterSpacing: '-0.5px' }}>About the Convention</h2>
            <div className="ecc-rich-description">
              <p>{event.description}</p>
              <p>Join thousands of industry veterans and developers at our structured masterclass formats. Deep dive into practical implementation architectures, interact directly with core engineering faculty during panel breakout programs, and secure technical accreditations.</p>
            </div>

            {/* Specifications Details Grid */}
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

            {/* Venue Location specs */}
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ecc-obsidian)', marginBottom: '2rem', letterSpacing: '-0.5px', marginTop: '4rem' }}>Location & Host venue</h2>
            <p style={{ color: 'var(--ecc-text-muted)', fontSize: '1.1rem', lineHeight: 1.8, fontWeight: 300, marginBottom: '2.5rem' }}>
              {event.location?.address ? `${event.location.address}, ${event.location.city}, ${event.location.state || ''} ${event.location.country || ''}` : 'Moscone Center, San Francisco, California, USA'}
            </p>
            
            {/* Mock Map frame with obsidian border */}
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
              color: 'var(--ecc-text-muted)'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ecc-blue)' }}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="18"></line><line x1="15" y1="6" x2="15" y2="21"></line></svg>
              <span className="ecc-mono" style={{ fontSize: '0.7rem' }}>INTERACTIVE MAP LAYER // ACTIVE</span>
              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--ecc-obsidian)' }}>{event.location?.map_title || event.location?.city || 'San Francisco Center Grid'}</span>
            </div>
          </div>

          {/* Sticky Reservation Desk Widget */}
          <div>
            <div className="ecc-booking-desk">
              <h3 className="ecc-booking-title">Get Delegate Pass</h3>
              
              {/* Ticket selector tab desk */}
              <div className="ecc-ticket-tabs">
                <button 
                  className={`ecc-ticket-tab ${ticketType === 'general' ? 'ecc-ticket-tab-active' : ''}`}
                  onClick={() => { if (!isBooked) setTicketType('general'); }}
                  aria-label="General pass ticket selection option"
                >
                  GENERAL PASS
                </button>
                <button 
                  className={`ecc-ticket-tab ${ticketType === 'vip' ? 'ecc-ticket-tab-active' : ''}`}
                  onClick={() => { if (!isBooked) setTicketType('vip'); }}
                  aria-label="VIP Deluxe ticket selection option"
                >
                  VIP DELUXE
                </button>
              </div>

              {/* Price outline */}
              <div className="ecc-price-summary">
                <span className="ecc-summary-label">Pass Valuation</span>
                <span className="ecc-summary-val">{formattedPrice}</span>
              </div>

              {/* Booking Form */}
              {isBooked ? (
                <div className="ecc-success-alert" id="ecc-success-notice">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#059669', marginBottom: '1rem', display: 'inline-block' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Pass Reserved!</h4>
                  <p style={{ fontWeight: 300, fontSize: '0.85rem' }}>
                    Congratulations! Your {ticketType === 'vip' ? 'VIP Deluxe' : 'General'} pass registration has been logged under `sellio_events_corporate_registrations`. Look out for an email confirmation details.
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

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--ecc-text-muted)', margin: '1rem 0' }}>
                    <span>Passes Left</span>
                    <span style={{ fontWeight: 800, color: ticketsCount < 100 ? '#dc2626' : 'var(--ecc-obsidian)' }}>
                      {ticketsCount} Left
                    </span>
                  </div>

                  <button type="submit" className="ec-btn-primary" style={{ width: '100%', borderRadius: '12px' }} id="ecc-btn-reserve">
                    RESERVE MY SEAT NOW
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Events Carousel Section */}
      {related.length > 0 && (
        <section className="ecc-related-section" aria-labelledby="ecc-related-header-title">
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div className="ecc-mono">FACET_SYNCHRONIZED // OPTIONS</div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--ecc-obsidian)', letterSpacing: '-1.5px', marginTop: '1rem' }} id="ecc-related-header-title">
              Other Curated Conventions
            </h2>
            
            <div className="ecc-carousel-container">
              <div className="ecc-carousel-grid">
                {related.map(item => (
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
