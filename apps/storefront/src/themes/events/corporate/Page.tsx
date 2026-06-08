'use client';
import React, { useState, useEffect } from 'react';
import type { EventListing } from '@sellio/types';
import { SpeakerCard, AgendaItem, EventCard, ShimmerCard } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/events/shared/CatalogSyncAlert';
import {
  extractEventFilters,
  fetchEventsHome,
  resolveEventsFailure,
} from '@/themes/events/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/events/shared/useDemoFallbackAllowed';

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
  const allowDemo = useDemoFallbackAllowed();
  const [events, setEvents] = useState<EventListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

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

      if (result.ok && result.response.data) {
        setEvents(result.response.data);
        applyFilterOptions(result.response.data);
        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'No events returned from API.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveEventsFailure(allowDemo, 'corporate');

        if (resolution.mode === 'demo') {
          setEvents(resolution.events);
          applyFilterOptions(resolution.events);
          setUseFallback(true);
        } else {
          setEvents([]);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadData();
  }, [allowDemo]);

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

        {apiError && useFallback && (
          <div className="ecc-alert-slot">
            <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ecc" />
          </div>
        )}
        {apiError && !useFallback && (
          <div className="ecc-alert-slot">
            <CatalogSyncAlert variant="production" error={apiError} classPrefix="ecc" />
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
          <div className="ecc-empty-state" role="status">
            <h3>No Events Found</h3>
            <p>Try altering your search filters or clear inputs to recover listings.</p>
            <button
              type="button"
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
            <button
              type="button"
              className="ec-btn-outline"
              id="ecc-btn-agenda-pdf"
              onClick={() => document.getElementById('ecc-explore-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {agendaCta}
            </button>
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
