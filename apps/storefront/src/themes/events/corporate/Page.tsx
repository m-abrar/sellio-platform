'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@sellio/api-client';
import { EventListing } from '@sellio/types';
import { SpeakerCard, AgendaItem, EventCard, ShimmerCard } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

const FALLBACK_EVENTS: EventListing[] = [
  {
    id: 101,
    title: "FORUM26: World Engineering Summit",
    slug: "forum26-world-engineering-summit",
    description: "The premier global assembly for architectural engineering and distributed systems. Shaping the future of technical infrastructure.",
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
      venue_size: "Large",
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
    description: "Deep dive into reactive systems, microservices coordination, and event-driven data platforms at scale.",
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
      venue_size: "Medium",
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
    description: "Hardening the digital core against modern threats. Interactive panels on zero trust architectures and automated threat response.",
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
      venue_size: "Unlimited",
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
    description: "Gathering leading practitioners training and deploying large-scale neural network paradigms and agent systems globally.",
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
      venue_size: "Large",
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

export default function Page() {
  const heroEyebrow = useThemeContent('hero.eyebrow', 'WORLD_ENGINEERING_SUMMIT // 2026');
  const heroTitle = useThemeContent('hero.title', 'The Future of\nStructural Excellence.');
  const heroHighlight = useThemeContent('hero.highlight', 'Structural');
  const heroPrimaryCta = useThemeContent('hero.primary_cta_label', 'GET DELEGATE PASS');
  const heroSecondaryCta = useThemeContent('hero.secondary_cta_label', 'VIEW FULL SCHEDULE');
  const catalogEyebrow = useThemeContent('catalog.eyebrow', 'CONVENTIONS_CATALOG // DIRECTORY');
  const catalogTitle = useThemeContent('catalog.title', 'Active Summits & Expos');
  const speakersEyebrow = useThemeContent('speakers.eyebrow', 'FACULTY_SYNC // 2026');
  const speakersTitle = useThemeContent('speakers.title', 'Distinguished Speakers');
  const agendaEyebrow = useThemeContent('agenda.eyebrow', 'CURATED_SCHEDULE // DAY_01');
  const agendaTitle = useThemeContent('agenda.title', 'The Agenda');
  const agendaDescription = useThemeContent('agenda.description', 'Four tracks of intense technical exploration, ranging from core infrastructure to product design philosophy.');
  const agendaCta = useThemeContent('agenda.cta_label', 'DOWNLOAD FULL PROGRAM PDF');
  const ctaTitle = useThemeContent('cta.title', 'Secure Your\nSeat in History.');
  const ctaHighlight = useThemeContent('cta.highlight', 'Seat in History.');
  const ctaDescription = useThemeContent('cta.description', 'Registration closes September 30. Join 5,000+ industry leaders for the most influential engineering event of the year.');
  const ctaButton = useThemeContent('cta.button_label', 'RESERVE MY FORUM PASS');
  const [events, setEvents] = useState<EventListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorTrace, setErrorTrace] = useState<string | null>(null);

  // Stateful filters
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [genre, setGenre] = useState<string>('');

  // Sidebar dynamic unique items
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

  const speakers = [
    { name: "Dr. Sarah Chen", role: "Chief AI Officer", company: "Nexus Logic", image: "/themes/events/corporate/1.webp" },
    { name: "Marcus Thorne", role: "VP of Engineering", company: "Scale Flow", image: "/themes/events/corporate/2.webp" },
    { name: "Elena Rodriguez", role: "Product Director", company: "Cloud Core", image: "/themes/events/corporate/3.webp" },
    { name: "James Wilson", role: "Security Lead", company: "Cyber Shield", image: "/themes/events/corporate/4.webp" },
  ];

  const agenda = [
    { time: "09:00 AM", title: "Opening Keynote: The Future of Distributed Intelligence", speaker: "Dr. Sarah Chen", track: "KEYNOTE" },
    { time: "11:00 AM", title: "Scaling High-Availability Microservices", speaker: "Marcus Thorne", track: "ENGINEERING" },
    { time: "01:30 PM", title: "Designing for Global User Adoption", speaker: "Elena Rodriguez", track: "PRODUCT" },
    { time: "03:30 PM", title: "Hardening the Digital Core", speaker: "James Wilson", track: "SECURITY" },
  ];

  function extractUniqueFilters(data: EventListing[]) {
    const cats = new Set<string>();
    const locs = new Set<string>();
    const gens = new Set<string>();

    data.forEach(item => {
      if (item.specs?.category) cats.add(item.specs.category);
      if (item.location?.city) locs.add(item.location.city);
      if (item.specs?.event_genre) gens.add(item.specs.event_genre);
    });

    setCategories(Array.from(cats));
    setLocations(Array.from(locs));
    setGenres(Array.from(gens));
  }

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await api.getEvents({ per_page: 20 });
        if (res && res.data) {
          setEvents(res.data);
          extractUniqueFilters(res.data);
        } else {
          throw new Error("No data received from API");
        }
      } catch (err: unknown) {
        console.error("Laravel Database connection failure. Activating resilience fallback.", err);
        setErrorTrace(
          `DATABASE_OFFLINE_DIAGNOSTICS_TRACE\n` +
          `STATUS: [OFFLINE] | LATENCY: [TIMEOUT] | REASON: [${err instanceof Error ? err.message : 'axios connection refused'}]\n` +
          `ACTION: Gracefully activated premium offline node resilience. Loading high-fidelity local catalog backups...`
        );
        setEvents(FALLBACK_EVENTS);
        extractUniqueFilters(FALLBACK_EVENTS);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Frontend filter processing
  const filteredEvents = events.filter(e => {
    const matchesSearch = search ? e.title.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase()) : true;
    const matchesCategory = category ? e.specs?.category === category : true;
    const matchesLocation = location ? e.location?.city === location : true;
    const matchesGenre = genre ? e.specs?.event_genre === genre : true;
    return matchesSearch && matchesCategory && matchesLocation && matchesGenre;
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="ec-hero" aria-labelledby="ecc-hero-title">
        <div className="ecc-mono" style={{ marginBottom: '2rem' }}>{heroEyebrow}</div>
        <h1 className="ecc-heading-xl" id="ecc-hero-title">
          {heroTitle.split(heroHighlight).map((part, index, parts) => (
            <React.Fragment key={`${part}-${index}`}>{part}{index < parts.length - 1 && <span style={{ color: 'var(--ecc-blue)' }}>{heroHighlight}</span>}</React.Fragment>
          ))}
        </h1>
        
        <div className="ec-hero-meta">
            <div>
                <div className="ecc-mono" style={{ color: 'var(--ecc-text-muted)', marginBottom: '0.5rem' }}>DATE</div>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--ecc-obsidian)' }}>OCTOBER 14-16</div>
            </div>
            <div>
                <div className="ecc-mono" style={{ color: 'var(--ecc-text-muted)', marginBottom: '0.5rem' }}>LOCATION</div>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--ecc-obsidian)' }}>SAN FRANCISCO, CA</div>
            </div>
            <div>
                <div className="ecc-mono" style={{ color: 'var(--ecc-text-muted)', marginBottom: '0.5rem' }}>CAPACITY</div>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--ecc-obsidian)' }}>5,000 DELEGATES</div>
            </div>
        </div>

        <div style={{ marginTop: '5rem', display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }} className="ecc-hero-buttons">
            <button className="ec-btn-primary" id="ecc-btn-explore" onClick={() => document.getElementById('ecc-explore-section')?.scrollIntoView({ behavior: 'smooth' })}>
              {heroPrimaryCta}
            </button>
            <button className="ec-btn-outline" id="ecc-btn-schedule" onClick={() => document.getElementById('ecc-agenda-section')?.scrollIntoView({ behavior: 'smooth' })}>
              {heroSecondaryCta}
            </button>
        </div>
      </section>

      {/* Dynamic Explore & Search Section */}
      <section className="ecc-section" id="ecc-explore-section" aria-labelledby="ecc-explore-title" style={{ paddingBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <div className="ecc-mono">{catalogEyebrow}</div>
            <h2 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 800, marginTop: '1.5rem', letterSpacing: '-2px', color: 'var(--ecc-obsidian)', lineHeight: 1.1 }} id="ecc-explore-title">
              {catalogTitle}
            </h2>
        </div>

        {/* Resilience Diagnostic Tracer block */}
        {errorTrace && (
          <div className="ecc-diagnostics-card" id="ecc-diagnostics-notice">
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

        {/* Stateful Filters Console */}
        <div className="ecc-explore-filters">
          <div>
            <input 
              type="text" 
              placeholder="Search by keywords..." 
              className="ecc-filter-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Keyword search"
            />
          </div>
          <div>
            <select 
              className="ecc-filter-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Category filter"
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <select 
              className="ecc-filter-select"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-label="Location filter"
            >
              <option value="">All Locations</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <select 
              className="ecc-filter-select"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              aria-label="Genre filter"
            >
              <option value="">All Genres</option>
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        {/* Event Cards Grid */}
        {loading ? (
          <div className="ecc-explore-grid">
            {[1, 2, 3].map(n => <ShimmerCard key={n} />)}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="ecc-explore-grid">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--ecc-text-muted)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '2rem' }}><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--ecc-obsidian)', marginBottom: '0.5rem' }}>No Events Found</h3>
            <p style={{ fontWeight: 300 }}>Try altering your search filters or clear inputs to recover listings.</p>
            <button 
              className="ec-btn-outline" 
              style={{ marginTop: '2.5rem', padding: '1rem 3rem' }}
              onClick={() => { setSearch(''); setCategory(''); setLocation(''); setGenre(''); }}
            >
              CLEAR FILTER CRITERIA
            </button>
          </div>
        )}
      </section>

      {/* Speakers Section */}
      <section className="ecc-section" id="ecc-speakers-section" aria-labelledby="ecc-speakers-title">
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <div className="ecc-mono">{speakersEyebrow}</div>
            <h2 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 800, marginTop: '1.5rem', letterSpacing: '-2px', color: 'var(--ecc-obsidian)', lineHeight: 1.1 }} id="ecc-speakers-title">{speakersTitle}</h2>
        </div>
        
        <div className="ec-speaker-grid">
          {speakers.map((s, i) => (
            <SpeakerCard key={i} {...s} />
          ))}
        </div>
      </section>

      {/* Agenda Section */}
      <section className="ecc-section" style={{ background: 'var(--ecc-bone)', borderRadius: 'var(--ecc-radius-md)' }} id="ecc-agenda-section" aria-labelledby="ecc-agenda-title">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6rem' }}>
            <div>
                <div className="ecc-mono">{agendaEyebrow}</div>
                <h2 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 800, marginTop: '1.5rem', letterSpacing: '-2px', color: 'var(--ecc-obsidian)', lineHeight: 1.1 }} id="ecc-agenda-title">{agendaTitle}</h2>
            </div>
            <p style={{ maxWidth: '400px', color: 'var(--ecc-text-muted)', fontSize: '1.1rem', lineHeight: 1.8, fontWeight: 300 }} className="ecc-agenda-intro">
                {agendaDescription}
            </p>
        </div>

        <div className="ec-agenda-list">
          {agenda.map((item, i) => (
            <AgendaItem key={i} {...item} />
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '6rem' }}>
            <button className="ec-btn-outline" id="ecc-btn-agenda-pdf" onClick={() => alert('Downloading technical agenda program PDF.')}>{agendaCta}</button>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="ecc-section" style={{ textAlign: 'center' }} aria-labelledby="ecc-cta-title">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: 'clamp(2.8rem, 8vw, 5rem)', fontWeight: 900, letterSpacing: '-3px', marginBottom: '3rem', color: 'var(--ecc-obsidian)', lineHeight: 1.1 }} id="ecc-cta-title">
                  {ctaTitle.split(ctaHighlight).map((part, index, parts) => (
                    <React.Fragment key={`${part}-${index}`}>{part}{index < parts.length - 1 && <span style={{ color: 'var(--ecc-blue)' }}>{ctaHighlight}</span>}</React.Fragment>
                  ))}
              </h2>
              <p style={{ color: 'var(--ecc-text-muted)', fontSize: '1.5rem', lineHeight: 1.6, marginBottom: '5rem', fontWeight: 300 }}>
                  {ctaDescription}
              </p>
              <button className="ec-btn-primary" style={{ padding: '2rem 6rem', fontSize: '1.25rem' }} id="ecc-btn-cta-pass" onClick={() => document.getElementById('ecc-explore-section')?.scrollIntoView({ behavior: 'smooth' })}>
                  {ctaButton}
              </button>
          </div>
      </section>
    </div>
  );
}
