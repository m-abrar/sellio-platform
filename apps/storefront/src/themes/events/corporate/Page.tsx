'use client';
import React, { useState, useEffect } from 'react';
import type { EventListing } from '@sellio/types';
import Link from 'next/link';
import { SpeakerCard, AgendaItem, EventCard, ShimmerCard } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/events/shared/CatalogSyncAlert';
import { extractEventFilters, fetchEventsHome } from '@/themes/events/shared/catalog';
import { useEventsThemeLink } from '@/themes/events/shared/useEventsThemeLink';

export default function Page() {
  const themeLink = useEventsThemeLink();
  const heroEyebrow = useThemeContent('hero.eyebrow', 'WORLD ENGINEERING SUMMIT // 2026');
  const heroTitle = useThemeContent('hero.title', 'The Future of\nStructural Excellence.');
  const heroHighlight = useThemeContent('hero.highlight', 'Structural');
  const heroPrimaryCta = useThemeContent('hero.primary_cta_label', 'GET DELEGATE PASS');
  const heroSecondaryCta = useThemeContent('hero.secondary_cta_label', 'VIEW FULL SCHEDULE');
  const catalogEyebrow = useThemeContent('catalog.eyebrow', 'EVENT CATALOG // DIRECTORY');
  const catalogTitle = useThemeContent('catalog.title', 'Active Summits & Expos');
  const speakersEyebrow = useThemeContent('speakers.eyebrow', 'FEATURED SPEAKERS // 2026');
  const speakersTitle = useThemeContent('speakers.title', 'Distinguished Speakers');
  const agendaEyebrow = useThemeContent('agenda.eyebrow', 'CURATED SCHEDULE // DAY 01');
  const agendaTitle = useThemeContent('agenda.title', 'The Agenda');
  const agendaDescription = useThemeContent('agenda.description', 'Four tracks of intense technical exploration, ranging from core infrastructure to product design philosophy.');
  const agendaCta = useThemeContent('agenda.cta_label', 'BROWSE FULL CATALOG');
  const ctaTitle = useThemeContent('cta.title', 'Secure Your\nSeat in History.');
  const ctaHighlight = useThemeContent('cta.highlight', 'Seat in History.');
  const ctaDescription = useThemeContent('cta.description', 'Registration closes September 30. Join 5,000+ industry leaders for the most influential engineering event of the year.');
  const ctaButton = useThemeContent('cta.button_label', 'RESERVE YOUR PASS');

  const [events, setEvents] = useState<EventListing[]>([]);
  const [inventoryTotal, setInventoryTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [genre, setGenre] = useState<string>('');

  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

  const speakers = [
    { name: 'Dr. Sarah Chen', role: 'Chief AI Officer', company: 'Nexus Logic', image: '/themes/events/corporate/1.webp' },
    { name: 'Marcus Thorne', role: 'VP of Engineering', company: 'Scale Flow', image: '/themes/events/corporate/2.webp' },
    { name: 'Elena Rodriguez', role: 'Product Director', company: 'Cloud Core', image: '/themes/events/corporate/3.webp' },
    { name: 'James Wilson', role: 'Security Lead', company: 'Cyber Shield', image: '/themes/events/corporate/4.webp' },
  ];

  const agenda = [
    { time: '09:00 AM', title: 'Opening Keynote: The Future of Distributed Intelligence', speaker: 'Dr. Sarah Chen', track: 'KEYNOTE' },
    { time: '11:00 AM', title: 'Scaling High-Availability Microservices', speaker: 'Marcus Thorne', track: 'ENGINEERING' },
    { time: '01:30 PM', title: 'Designing for Global User Adoption', speaker: 'Elena Rodriguez', track: 'PRODUCT' },
    { time: '03:30 PM', title: 'Hardening the Digital Core', speaker: 'James Wilson', track: 'SECURITY' },
  ];

  function applyFilterOptions(data: EventListing[]) {
    const filters = extractEventFilters(data);
    setCategories(filters.categories);
    setLocations(filters.locations);
    setGenres(filters.genres);
  }

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const result = await fetchEventsHome(20);

      if (result.ok && Array.isArray(result.response.data)) {
        setEvents(result.response.data);
        setInventoryTotal(result.response.meta?.total ?? result.response.data.length);
        applyFilterOptions(result.response.data);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'No events returned from API.' : result.error;
        setApiError(errorMsg);
        setEvents([]);
        setInventoryTotal(null);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = search
      ? event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesCategory = category ? event.specs?.category === category : true;
    const matchesLocation = location ? event.location?.city === location : true;
    const matchesGenre = genre ? event.specs?.event_genre === genre : true;
    return matchesSearch && matchesCategory && matchesLocation && matchesGenre;
  });

  const inventoryCount =
    inventoryTotal !== null ? String(inventoryTotal) : events.length > 0 ? String(events.length) : '—';

  return (
    <div>
      <section className="ec-hero" aria-labelledby="ecc-hero-title">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="ecc-mono" style={{ marginBottom: '2rem' }}>{heroEyebrow}</div>
          <h1 className="ecc-heading-xl" id="ecc-hero-title" style={{ marginBottom: '2rem' }}>
            {heroTitle.split(heroHighlight).map((part, index, parts) => (
              <React.Fragment key={`${part}-${index}`}>
                {part}
                {index < parts.length - 1 && <span style={{ color: '#60b3ff' }}>{heroHighlight}</span>}
              </React.Fragment>
            ))}
          </h1>
          <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.35rem)', lineHeight: 1.7, maxWidth: '660px', margin: '0 auto 3.5rem' }}>
            The world&apos;s leading platform for corporate summits, technical conferences, and executive forums. Register, connect, and build the future.
          </p>

          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }} className="ecc-hero-buttons">
            <Link href={themeLink('/explore')} className="ec-btn-primary" id="ecc-btn-explore" style={{ textDecoration: 'none' }}>
              {heroPrimaryCta}
            </Link>
            <button
              type="button"
              className="ec-btn-outline"
              id="ecc-btn-schedule"
              onClick={() => document.getElementById('ecc-agenda-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {heroSecondaryCta}
            </button>
          </div>

          <div className="ecc-hero-stats">
            <div className="ecc-hero-stat">
              <span className="ecc-hero-stat-value">{inventoryCount}</span>
              <span className="ecc-hero-stat-label">Live Events</span>
            </div>
            <div className="ecc-hero-stat">
              <span className="ecc-hero-stat-value">{categories.length || '—'}</span>
              <span className="ecc-hero-stat-label">Categories</span>
            </div>
            <div className="ecc-hero-stat">
              <span className="ecc-hero-stat-value">{locations.length || '—'}</span>
              <span className="ecc-hero-stat-label">Cities</span>
            </div>
          </div>
        </div>
      </section>

      <section className="ecc-section" id="ecc-explore-section" aria-labelledby="ecc-explore-title" style={{ paddingBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="ecc-mono">{catalogEyebrow}</div>
          <h2
            style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 800, marginTop: '1.5rem', letterSpacing: '-2px', color: 'var(--ecc-obsidian)', lineHeight: 1.1 }}
            id="ecc-explore-title"
          >
            {catalogTitle}
          </h2>
        </div>

        {apiError && (
          <div className="ecc-alert-slot">
            <CatalogSyncAlert variant="production" error={apiError} classPrefix="ecc" />
          </div>
        )}

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
            <select className="ecc-filter-select" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category filter">
              <option value="">All Categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select className="ecc-filter-select" value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Location filter">
              <option value="">All Locations</option>
              {locations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select className="ecc-filter-select" value={genre} onChange={(e) => setGenre(e.target.value)} aria-label="Genre filter">
              <option value="">All Genres</option>
              {genres.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!loading && filteredEvents.length > 0 && (
          <div className="ecc-results-meta">
            Showing <strong>{filteredEvents.length}</strong> event{filteredEvents.length !== 1 ? 's' : ''}
            {inventoryTotal !== null && filteredEvents.length !== inventoryTotal ? ` of ${inventoryTotal}` : ''}
          </div>
        )}

        {loading ? (
          <div className="ecc-explore-grid">
            {[1, 2, 3].map((n) => (
              <ShimmerCard key={n} />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="ecc-explore-grid">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="ecc-empty-state" role="status">
            <h3>No Events Found</h3>
            <p>Try altering your search filters or browse the full catalog.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
              <button
                type="button"
                className="ec-btn-outline"
                onClick={() => {
                  setSearch('');
                  setCategory('');
                  setLocation('');
                  setGenre('');
                }}
              >
                CLEAR FILTERS
              </button>
              <Link href={themeLink('/explore')} className="ec-btn-primary" style={{ textDecoration: 'none' }}>
                VIEW FULL CATALOG
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="ecc-section" id="ecc-speakers-section" aria-labelledby="ecc-speakers-title">
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <div className="ecc-mono">{speakersEyebrow}</div>
          <h2
            style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 800, marginTop: '1.5rem', letterSpacing: '-2px', color: 'var(--ecc-obsidian)', lineHeight: 1.1 }}
            id="ecc-speakers-title"
          >
            {speakersTitle}
          </h2>
        </div>

        <div className="ec-speaker-grid">
          {speakers.map((speaker) => (
            <SpeakerCard key={speaker.name} {...speaker} />
          ))}
        </div>
      </section>

      <section className="ecc-section" style={{ background: 'var(--ecc-bone)', borderRadius: 'var(--ecc-radius-md)' }} id="ecc-agenda-section" aria-labelledby="ecc-agenda-title">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6rem' }} className="ecc-agenda-header">
          <div>
            <div className="ecc-mono">{agendaEyebrow}</div>
            <h2
              style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 800, marginTop: '1.5rem', letterSpacing: '-2px', color: 'var(--ecc-obsidian)', lineHeight: 1.1 }}
              id="ecc-agenda-title"
            >
              {agendaTitle}
            </h2>
          </div>
          <p style={{ maxWidth: '400px', color: 'var(--ecc-text-muted)', fontSize: '1.1rem', lineHeight: 1.8, fontWeight: 300 }} className="ecc-agenda-intro">
            {agendaDescription}
          </p>
        </div>

        <div className="ec-agenda-list">
          {agenda.map((item) => (
            <AgendaItem key={`${item.time}-${item.title}`} {...item} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '6rem' }}>
          <Link href={themeLink('/explore')} className="ec-btn-outline" id="ecc-btn-agenda-pdf" style={{ textDecoration: 'none', display: 'inline-block' }}>
            {agendaCta}
          </Link>
        </div>
      </section>

      <section className="ecc-section" style={{ textAlign: 'center' }} aria-labelledby="ecc-cta-title">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2
            style={{ fontSize: 'clamp(2.8rem, 8vw, 5rem)', fontWeight: 900, letterSpacing: '-3px', marginBottom: '3rem', color: 'var(--ecc-obsidian)', lineHeight: 1.1 }}
            id="ecc-cta-title"
          >
            {ctaTitle.split(ctaHighlight).map((part, index, parts) => (
              <React.Fragment key={`${part}-${index}`}>
                {part}
                {index < parts.length - 1 && <span style={{ color: 'var(--ecc-blue)' }}>{ctaHighlight}</span>}
              </React.Fragment>
            ))}
          </h2>
          <p style={{ color: 'var(--ecc-text-muted)', fontSize: '1.5rem', lineHeight: 1.6, marginBottom: '5rem', fontWeight: 300 }}>
            {ctaDescription}
          </p>
          <Link href={themeLink('/explore')} className="ec-btn-primary" style={{ padding: '2rem 6rem', fontSize: '1.25rem', textDecoration: 'none', display: 'inline-block' }} id="ecc-btn-cta-pass">
            {ctaButton}
          </Link>
        </div>
      </section>
    </div>
  );
}
