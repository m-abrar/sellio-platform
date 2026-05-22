'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import { EventListing } from '@sellio/types';
import { EventCard, ShimmerCard } from './components';

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

function ExploreDirectory() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter states sync from URL parameters
  const [search, setSearch] = useState<string>(searchParams.get('q') || '');
  const [category, setCategory] = useState<string>(searchParams.get('category') || '');
  const [location, setLocation] = useState<string>(searchParams.get('location') || '');
  const [genre, setGenre] = useState<string>(searchParams.get('genre') || '');

  // Pagination states
  const [events, setEvents] = useState<EventListing[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [errorTrace, setErrorTrace] = useState<string | null>(null);

  // Sidebar filters populated dynamically
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

  // Synchronize state back to URL parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (category) params.set('category', category);
    if (location) params.set('location', location);
    if (genre) params.set('genre', genre);
    
    router.replace(`/preview/events_corporate/explore?${params.toString()}`);
    setPage(1); // Reset page on filter changes
  }, [search, category, location, genre, router]);

  // Load events
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setErrorTrace(null);
        
        // Fetch from dynamic backend
        const res = await api.getEvents({
          q: search || undefined,
          category: category || undefined,
          location: location || undefined,
          genre: genre || undefined,
          page: 1,
          per_page: 6
        });

        if (res && res.data) {
          setEvents(res.data);
          setHasMore(res.meta ? res.meta.current_page < res.meta.last_page : false);
          extractUniqueFilters(res.data);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err: any) {
        console.error("Explore API query exception. Falling back...", err);
        setErrorTrace(
          `DATABASE_OFFLINE_DIAGNOSTICS_TRACE\n` +
          `STATUS: [OFFLINE] | LATENCY: [TIMEOUT] | REASON: [${err.message || 'axios connection refused'}]\n` +
          `ACTION: Gracefully activated premium offline node resilience. Loading high-fidelity local catalog backups...`
        );
        // Client side filtering for fallback
        const filteredMock = FALLBACK_EVENTS.filter(e => {
          const matchesQ = search ? e.title.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase()) : true;
          const matchesCat = category ? e.specs?.category === category : true;
          const matchesLoc = location ? e.location?.city === location : true;
          const matchesGen = genre ? e.specs?.event_genre === genre : true;
          return matchesQ && matchesCat && matchesLoc && matchesGen;
        });
        setEvents(filteredMock);
        setHasMore(false);
        extractUniqueFilters(FALLBACK_EVENTS);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [search, category, location, genre]);

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

  // Handle Load More pagination
  async function loadMore() {
    if (loadingMore || !hasMore) return;
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const res = await api.getEvents({
        q: search || undefined,
        category: category || undefined,
        location: location || undefined,
        genre: genre || undefined,
        page: nextPage,
        per_page: 6
      });

      if (res && res.data) {
        setEvents(prev => [...prev, ...res.data]);
        setPage(nextPage);
        setHasMore(res.meta ? res.meta.current_page < res.meta.last_page : false);
      }
    } catch (err) {
      console.error("Pagination load failed.", err);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      <section className="ecc-detail-header" aria-labelledby="ecc-explore-header-title">
        <div className="ecc-mono" style={{ marginBottom: '1.5rem' }}>GLOBAL_SUMMITS // CONFERENCES</div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, color: 'var(--ecc-obsidian)', letterSpacing: '-2px', lineHeight: 1.1 }} id="ecc-explore-header-title">
          Explore Technical Conventions
        </h1>
      </section>

      <section className="ecc-detail-container" style={{ paddingTop: '5rem' }}>
        {/* Offline Warning Panel */}
        {errorTrace && (
          <div className="ecc-diagnostics-card" id="ecc-explore-diagnostics">
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

        {/* Stateful Filters bar */}
        <div className="ecc-explore-filters">
          <div>
            <input 
              type="text" 
              placeholder="Search conventions..." 
              className="ecc-filter-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Keyword input search"
            />
          </div>
          <div>
            <select 
              className="ecc-filter-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by Category"
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
              aria-label="Filter by Location"
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
              aria-label="Filter by Genre"
            >
              <option value="">All Genres</option>
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        {/* Main Grid */}
        {loading ? (
          <div className="ecc-explore-grid">
            {[1, 2, 3, 4, 5, 6].map(n => <ShimmerCard key={n} />)}
          </div>
        ) : events.length > 0 ? (
          <div>
            <div className="ecc-explore-grid">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: '6rem' }}>
                <button 
                  className="ec-btn-primary" 
                  style={{ padding: '1.25rem 5rem' }} 
                  onClick={loadMore}
                  disabled={loadingMore}
                  id="ecc-btn-load-more"
                >
                  {loadingMore ? 'SYNCING_NODES...' : 'LOAD MORE CONVENTIONS'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '8rem 0', color: 'var(--ecc-text-muted)' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '2.5rem' }}><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ecc-obsidian)', marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>No Conventions Listed</h3>
            <p style={{ fontWeight: 300, fontSize: '1.05rem' }}>No dynamic events matched the selected facet settings.</p>
            <button 
              className="ec-btn-outline" 
              style={{ marginTop: '3rem', padding: '1.1rem 3.5rem' }}
              onClick={() => { setSearch(''); setCategory(''); setLocation(''); setGenre(''); }}
            >
              RESET ALL FACETS
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function ShimmerDirectory() {
  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      <section className="ecc-detail-header">
        <div className="ecc-mono ecc-shimmer" style={{ width: '120px', height: '16px' }}></div>
        <div className="ecc-shimmer" style={{ width: '400px', height: '48px', marginTop: '1.5rem' }}></div>
      </section>
      <section className="ecc-detail-container" style={{ paddingTop: '5rem' }}>
        <div className="ecc-explore-grid">
          {[1, 2, 3].map(n => <ShimmerCard key={n} />)}
        </div>
      </section>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<ShimmerDirectory />}>
      <ExploreDirectory />
    </Suspense>
  );
}
