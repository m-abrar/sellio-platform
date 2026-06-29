import type { EventListing } from '@/types';

const published = { is_published: true, is_featured: true, rating: 4.8 };

export const CORPORATE_FALLBACK_EVENTS: EventListing[] = [
  {
    id: 101,
    title: 'FORUM26: World Engineering Summit',
    slug: 'forum26-world-engineering-summit',
    description:
      'The premier global assembly for architectural engineering and distributed systems. Shaping the future of technical infrastructure.',
    schedule: {
      start_at: '2026-10-14T09:00:00Z',
      end_at: '2026-10-16T17:00:00Z',
      duration_hours: 48,
      is_virtual: false,
    },
    ticketing: {
      is_paid: true,
      is_free: false,
      base_price: 599,
      sale_price: 499,
      price_formatted: '$499.00',
      price_formatted_k: '$0.5k',
      max_attendees: 5000,
      tickets_left: 1420,
    },
    specs: {
      category: 'Summit',
      type: 'Conference',
      brand: 'Forum26 Series',
      event_genre: 'Distributed Systems',
      venue_size: 'Large',
      tags: ['Scale', 'Architecture', 'AI'],
    },
    media: {
      poster: '/themes/events/corporate/1.webp',
      preview: '/themes/events/corporate/1.webp',
      gallery: [],
    },
    location: {
      address: 'Moscone Center, 747 Howard St',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      latitude: 37.784,
      longitude: -122.401,
      map_title: 'Moscone Center',
    },
    status: { ...published, rating: 4.9 },
  },
  {
    id: 102,
    title: 'Distributed Systems Expo 2026',
    slug: 'distributed-systems-expo-2026',
    description:
      'Deep dive into reactive systems, microservices coordination, and event-driven data platforms at scale.',
    schedule: {
      start_at: '2026-11-05T09:00:00Z',
      end_at: '2026-11-06T18:00:00Z',
      duration_hours: 18,
      is_virtual: false,
    },
    ticketing: {
      is_paid: true,
      is_free: false,
      base_price: 399,
      sale_price: 399,
      price_formatted: '$399.00',
      price_formatted_k: '$0.4k',
      max_attendees: 1500,
      tickets_left: 450,
    },
    specs: {
      category: 'Expo',
      type: 'Exhibition',
      brand: 'Systems Group',
      event_genre: 'Cloud Native',
      venue_size: 'Medium',
      tags: ['Kubernetes', 'Kafka', 'Go'],
    },
    media: {
      poster: '/themes/events/corporate/2.webp',
      preview: '/themes/events/corporate/2.webp',
      gallery: [],
    },
    location: {
      address: 'San Jose Convention Center',
      city: 'San Jose',
      state: 'CA',
      country: 'USA',
      latitude: 37.329,
      longitude: -121.889,
      map_title: 'San Jose Convention Center',
    },
    status: { ...published, rating: 4.7 },
  },
  {
    id: 103,
    title: 'Enterprise Cyber Security Forum',
    slug: 'enterprise-cyber-security-forum',
    description:
      'Hardening the digital core against modern threats. Interactive panels on zero trust architectures and automated threat response.',
    schedule: {
      start_at: '2026-12-10T10:00:00Z',
      end_at: '2026-12-12T16:00:00Z',
      duration_hours: 24,
      is_virtual: true,
    },
    ticketing: {
      is_paid: false,
      is_free: true,
      base_price: 0,
      sale_price: 0,
      price_formatted: 'Free',
      price_formatted_k: 'Free',
      max_attendees: 10000,
      tickets_left: 8200,
    },
    specs: {
      category: 'Security',
      type: 'Virtual Event',
      brand: 'Cyber Shield Inc.',
      event_genre: 'Cybersecurity',
      venue_size: 'Unlimited',
      tags: ['Zero Trust', 'Cloud', 'SecOps'],
    },
    media: {
      poster: '/themes/events/corporate/3.webp',
      preview: '/themes/events/corporate/3.webp',
      gallery: [],
    },
    location: {
      address: 'Virtual Stream Platform',
      city: 'Online',
      state: 'Global',
      country: 'WW',
      latitude: 0,
      longitude: 0,
      map_title: 'Online Portal',
    },
    status: published,
  },
  {
    id: 104,
    title: 'AI & Neural Scaling Summit 2026',
    slug: 'ai-neural-scaling-summit-2026',
    description:
      'Gathering leading practitioners training and deploying large-scale neural network paradigms and agent systems globally.',
    schedule: {
      start_at: '2026-10-22T08:30:00Z',
      end_at: '2026-10-23T18:00:00Z',
      duration_hours: 20,
      is_virtual: false,
    },
    ticketing: {
      is_paid: true,
      is_free: false,
      base_price: 799,
      sale_price: 699,
      price_formatted: '$699.00',
      price_formatted_k: '$0.7k',
      max_attendees: 3000,
      tickets_left: 890,
    },
    specs: {
      category: 'AI Summit',
      type: 'Conference',
      brand: 'Nexus Logic',
      event_genre: 'Artificial Intelligence',
      venue_size: 'Large',
      tags: ['Deep Learning', 'LLMs', 'Scale'],
    },
    media: {
      poster: '/themes/events/corporate/4.webp',
      preview: '/themes/events/corporate/4.webp',
      gallery: [],
    },
    location: {
      address: 'Palace of Fine Arts',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      latitude: 37.802,
      longitude: -122.448,
      map_title: 'Palace of Fine Arts',
    },
    status: { ...published, rating: 4.9 },
  },
];

export const CLASSIC_FALLBACK_EVENTS: EventListing[] = [
  {
    id: 201,
    title: 'Vienna Philharmonic at Royal Albert Hall',
    slug: 'vienna-philharmonic-royal-albert-hall',
    description:
      'An evening of Brahms and Mahler performed by the Vienna Philharmonic under a celebrated guest conductor.',
    schedule: {
      start_at: '2026-09-18T19:30:00Z',
      end_at: '2026-09-18T22:00:00Z',
      duration_hours: 2.5,
      is_virtual: false,
    },
    ticketing: {
      is_paid: true,
      is_free: false,
      base_price: 185,
      sale_price: 165,
      price_formatted: '£165.00',
      price_formatted_k: '£0.2k',
      max_attendees: 5200,
      tickets_left: 412,
    },
    specs: {
      category: 'Orchestral',
      type: 'Concert',
      brand: 'LegacyArts Presents',
      event_genre: 'Classical',
      venue_size: 'Grand Hall',
      tags: ['Symphony', 'Brahms', 'Mahler'],
    },
    media: {
      poster: '/themes/events/classic/1.webp',
      preview: '/themes/events/classic/1.webp',
      gallery: [],
    },
    location: {
      address: 'Royal Albert Hall',
      city: 'London',
      state: 'England',
      country: 'UK',
      latitude: 51.501,
      longitude: -0.177,
      map_title: 'Royal Albert Hall',
    },
    status: { ...published, rating: 4.9 },
  },
  {
    id: 202,
    title: 'Bolshoi Ballet: Swan Lake',
    slug: 'bolshoi-ballet-swan-lake',
    description:
      'The definitive production of Tchaikovsky’s masterpiece, staged with full orchestra and principal dancers.',
    schedule: {
      start_at: '2026-10-02T20:00:00Z',
      end_at: '2026-10-02T23:00:00Z',
      duration_hours: 3,
      is_virtual: false,
    },
    ticketing: {
      is_paid: true,
      is_free: false,
      base_price: 220,
      sale_price: 195,
      price_formatted: '$195.00',
      price_formatted_k: '$0.2k',
      max_attendees: 2800,
      tickets_left: 156,
    },
    specs: {
      category: 'Ballet',
      type: 'Performance',
      brand: 'Bolshoi Theatre',
      event_genre: 'Dance',
      venue_size: 'Opera House',
      tags: ['Tchaikovsky', 'Ballet', 'Premiere'],
    },
    media: {
      poster: '/themes/events/classic/2.webp',
      preview: '/themes/events/classic/2.webp',
      gallery: [],
    },
    location: {
      address: 'Lincoln Center',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      latitude: 40.772,
      longitude: -73.984,
      map_title: 'Lincoln Center',
    },
    status: published,
  },
  {
    id: 203,
    title: 'Metropolitan Opera Gala',
    slug: 'metropolitan-opera-gala',
    description:
      'A black-tie gala featuring arias from Verdi, Puccini, and Wagner with the full Metropolitan Opera ensemble.',
    schedule: {
      start_at: '2026-11-12T19:00:00Z',
      end_at: '2026-11-12T22:30:00Z',
      duration_hours: 3.5,
      is_virtual: false,
    },
    ticketing: {
      is_paid: true,
      is_free: false,
      base_price: 350,
      sale_price: 350,
      price_formatted: '$350.00',
      price_formatted_k: '$0.4k',
      max_attendees: 3800,
      tickets_left: 89,
    },
    specs: {
      category: 'Opera',
      type: 'Gala',
      brand: 'Metropolitan Opera',
      event_genre: 'Vocal',
      venue_size: 'Opera House',
      tags: ['Verdi', 'Puccini', 'Gala'],
    },
    media: {
      poster: '/themes/events/classic/3.webp',
      preview: '/themes/events/classic/3.webp',
      gallery: [],
    },
    location: {
      address: 'Metropolitan Opera House',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      latitude: 40.772,
      longitude: -73.984,
      map_title: 'Metropolitan Opera House',
    },
    status: { ...published, rating: 4.95 },
  },
  {
    id: 204,
    title: 'Shakespeare in the Park: Hamlet',
    slug: 'shakespeare-in-the-park-hamlet',
    description:
      'An open-air production of Hamlet featuring a celebrated ensemble cast and live chamber orchestra.',
    schedule: {
      start_at: '2026-08-05T20:00:00Z',
      end_at: '2026-08-05T23:00:00Z',
      duration_hours: 3,
      is_virtual: false,
    },
    ticketing: {
      is_paid: false,
      is_free: true,
      base_price: 0,
      sale_price: 0,
      price_formatted: 'Free admission',
      price_formatted_k: 'Free',
      max_attendees: 1800,
      tickets_left: 620,
    },
    specs: {
      category: 'Theatre',
      type: 'Open Air',
      brand: 'Public Theatre',
      event_genre: 'Drama',
      venue_size: 'Amphitheatre',
      tags: ['Shakespeare', 'Hamlet', 'Summer'],
    },
    media: {
      poster: '/themes/events/classic/4.webp',
      preview: '/themes/events/classic/4.webp',
      gallery: [],
    },
    location: {
      address: 'Delacorte Theater',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      latitude: 40.779,
      longitude: -73.969,
      map_title: 'Central Park',
    },
    status: published,
  },
];

export const MUSIC_FALLBACK_EVENTS: EventListing[] = [
  {
    id: 301,
    title: 'Electric Pulse Festival 2026',
    slug: 'electric-pulse-festival-2026',
    description: 'A three-day electronic music takeover featuring global headliners, immersive light rigs, and 120dB precision sound.',
    schedule: { start_at: '2026-07-18T18:00:00Z', end_at: '2026-07-20T04:00:00Z', duration_hours: 34, is_virtual: false },
    ticketing: { is_paid: true, is_free: false, base_price: 249, sale_price: 199, price_formatted: '$199.00', price_formatted_k: '$0.2k', max_attendees: 25000, tickets_left: 4200 },
    specs: { category: 'Festival', type: 'Live', brand: 'PULSE Series', event_genre: 'Electronic', venue_size: 'Large', tags: ['House', 'Techno', 'Live'] },
    media: { poster: '/themes/events/music/11.webp', preview: '/themes/events/music/11.webp', gallery: [] },
    location: { address: 'Bayfront Park', city: 'Miami', state: 'FL', country: 'USA', latitude: 25.775, longitude: -80.186, map_title: 'Bayfront Park' },
    status: { ...published, rating: 4.8 },
  },
  {
    id: 302,
    title: 'Underground House Sessions',
    slug: 'underground-house-sessions',
    description: 'Intimate warehouse sessions with curated underground house selectors and analog sound systems.',
    schedule: { start_at: '2026-09-12T22:00:00Z', end_at: '2026-09-13T06:00:00Z', duration_hours: 8, is_virtual: false },
    ticketing: { is_paid: true, is_free: false, base_price: 65, sale_price: 55, price_formatted: '€55.00', price_formatted_k: '€0.1k', max_attendees: 800, tickets_left: 120 },
    specs: { category: 'Club Night', type: 'Live', brand: 'Sonic Node', event_genre: 'House', venue_size: 'Medium', tags: ['Underground', 'Vinyl', 'Warehouse'] },
    media: { poster: '/themes/events/music/12.webp', preview: '/themes/events/music/12.webp', gallery: [] },
    location: { address: 'RAW Gelände', city: 'Berlin', state: 'BE', country: 'Germany', latitude: 52.52, longitude: 13.405, map_title: 'RAW Gelände' },
    status: published,
  },
  {
    id: 303,
    title: 'Bass Culture Live',
    slug: 'bass-culture-live',
    description: 'Heavy bass programming with live MC showcases, dubstep collectives, and festival-grade sub arrays.',
    schedule: { start_at: '2026-10-03T19:00:00Z', end_at: '2026-10-04T02:00:00Z', duration_hours: 7, is_virtual: false },
    ticketing: { is_paid: true, is_free: false, base_price: 89, sale_price: 79, price_formatted: '£79.00', price_formatted_k: '£0.1k', max_attendees: 5000, tickets_left: 890 },
    specs: { category: 'Concert', type: 'Live', brand: 'Bass Registry', event_genre: 'Bass', venue_size: 'Large', tags: ['Dubstep', 'Drum & Bass', 'Live MC'] },
    media: { poster: '/themes/events/music/13.webp', preview: '/themes/events/music/13.webp', gallery: [] },
    location: { address: 'Printworks London', city: 'London', state: 'England', country: 'UK', latitude: 51.497, longitude: -0.032, map_title: 'Printworks London' },
    status: published,
  },
  {
    id: 304,
    title: 'Sonic Summit LA',
    slug: 'sonic-summit-la',
    description: 'West coast showcase of chart-topping artists, brand activations, and high-fidelity festival production.',
    schedule: { start_at: '2026-11-08T16:00:00Z', end_at: '2026-11-08T23:59:00Z', duration_hours: 8, is_virtual: false },
    ticketing: { is_paid: true, is_free: false, base_price: 149, sale_price: 129, price_formatted: '$129.00', price_formatted_k: '$0.1k', max_attendees: 12000, tickets_left: 2100 },
    specs: { category: 'Summit', type: 'Festival', brand: 'Sonic Pulse', event_genre: 'Pop/Electronic', venue_size: 'Large', tags: ['Headliners', 'LA', 'Live'] },
    media: { poster: '/themes/events/music/14.webp', preview: '/themes/events/music/14.webp', gallery: [] },
    location: { address: 'LA State Historic Park', city: 'Los Angeles', state: 'CA', country: 'USA', latitude: 34.062, longitude: -118.234, map_title: 'LA State Historic Park' },
    status: { ...published, rating: 4.7 },
  },
];

export const CREATIVE_FALLBACK_EVENTS: EventListing[] = [
  {
    id: 401,
    title: 'Algorithmic Light Lab',
    slug: 'algorithmic-light-lab',
    description: 'Interactive light installations driven by generative algorithms and real-time audience input modules.',
    schedule: { start_at: '2026-08-22T18:00:00Z', end_at: '2026-08-23T02:00:00Z', duration_hours: 8, is_virtual: false },
    ticketing: { is_paid: true, is_free: false, base_price: 45, sale_price: 45, price_formatted: '¥4,500', price_formatted_k: '¥4.5k', max_attendees: 600, tickets_left: 88 },
    specs: { category: 'Installation', type: 'Lab', brand: 'Creative Node', event_genre: 'Digital Art', venue_size: 'Medium', tags: ['Generative', 'Light', 'Interactive'] },
    media: { poster: '/themes/events/creative/1.webp', preview: '/themes/events/creative/1.webp', gallery: [] },
    location: { address: 'TeamLab Planets', city: 'Tokyo', state: 'Tokyo', country: 'Japan', latitude: 35.649, longitude: 139.789, map_title: 'TeamLab Planets' },
    status: published,
  },
  {
    id: 402,
    title: 'Bio-Digital Synthesis',
    slug: 'bio-digital-synthesis',
    description: 'Experimental assemblies merging biofeedback sensors with modular synthesizers and projection mapping.',
    schedule: { start_at: '2026-09-15T20:00:00Z', end_at: '2026-09-16T01:00:00Z', duration_hours: 5, is_virtual: false },
    ticketing: { is_paid: true, is_free: false, base_price: 38, sale_price: 38, price_formatted: '€38.00', price_formatted_k: '€0.0k', max_attendees: 400, tickets_left: 56 },
    specs: { category: 'Workshop', type: 'Lab', brand: 'Resonance Lab', event_genre: 'Bio-Art', venue_size: 'Small', tags: ['Synthesis', 'Biofeedback', 'Modular'] },
    media: { poster: '/themes/events/creative/2.webp', preview: '/themes/events/creative/2.webp', gallery: [] },
    location: { address: 'NDSM Wharf', city: 'Amsterdam', state: 'NH', country: 'Netherlands', latitude: 52.401, longitude: 4.892, map_title: 'NDSM Wharf' },
    status: published,
  },
  {
    id: 403,
    title: 'Resonance Wave Assembly',
    slug: 'resonance-wave-assembly',
    description: 'Community-driven audio-visual performances with open-protocol artist nodes and live coding stages.',
    schedule: { start_at: '2026-10-10T19:00:00Z', end_at: '2026-10-11T03:00:00Z', duration_hours: 8, is_virtual: false },
    ticketing: { is_paid: false, is_free: true, base_price: 0, sale_price: 0, price_formatted: 'Free entry', price_formatted_k: 'Free', max_attendees: 900, tickets_left: 320 },
    specs: { category: 'Assembly', type: 'Performance', brand: 'Wave Collective', event_genre: 'AV Performance', venue_size: 'Medium', tags: ['Live Coding', 'Community', 'Open Protocol'] },
    media: { poster: '/themes/events/creative/3.webp', preview: '/themes/events/creative/3.webp', gallery: [] },
    location: { address: 'Brooklyn Navy Yard', city: 'Brooklyn', state: 'NY', country: 'USA', latitude: 40.699, longitude: -73.971, map_title: 'Brooklyn Navy Yard' },
    status: published,
  },
  {
    id: 404,
    title: 'Modular Art Pulse',
    slug: 'modular-art-pulse',
    description: 'A decentralized showcase of artisan makers, kinetic sculptures, and algorithmic print studios.',
    schedule: { start_at: '2026-11-01T17:00:00Z', end_at: '2026-11-02T00:00:00Z', duration_hours: 7, is_virtual: false },
    ticketing: { is_paid: true, is_free: false, base_price: 28, sale_price: 28, price_formatted: '$28.00', price_formatted_k: '$0.0k', max_attendees: 750, tickets_left: 190 },
    specs: { category: 'Showcase', type: 'Exhibition', brand: 'Artisan Registry', event_genre: 'Mixed Media', venue_size: 'Medium', tags: ['Sculpture', 'Print', 'Kinetic'] },
    media: { poster: '/themes/events/creative/4.webp', preview: '/themes/events/creative/4.webp', gallery: [] },
    location: { address: 'Pearl District Studios', city: 'Portland', state: 'OR', country: 'USA', latitude: 45.523, longitude: -122.676, map_title: 'Pearl District' },
    status: published,
  },
];

export const FESTIVAL_FALLBACK_EVENTS: EventListing[] = [
  {
    id: 501,
    title: 'Neon Desert Vibe',
    slug: 'neon-desert-vibe',
    description: 'High-intensity desert festival with neon stages, art cars, and sunrise sets across three curated zones.',
    schedule: { start_at: '2026-04-10T16:00:00Z', end_at: '2026-04-13T06:00:00Z', duration_hours: 62, is_virtual: false },
    ticketing: { is_paid: true, is_free: false, base_price: 399, sale_price: 349, price_formatted: '$349.00', price_formatted_k: '$0.3k', max_attendees: 18000, tickets_left: 2400 },
    specs: { category: 'Festival', type: 'Multi-Stage', brand: 'Neon Collective', event_genre: 'EDM', venue_size: 'Large', tags: ['Desert', 'Neon', 'Art Cars'] },
    media: { poster: '/themes/events/festival/11.webp', preview: '/themes/events/festival/11.webp', gallery: [] },
    location: { address: 'Moapa Valley', city: 'Las Vegas', state: 'NV', country: 'USA', latitude: 36.687, longitude: -114.593, map_title: 'Moapa Valley' },
    status: { ...published, rating: 4.9 },
  },
  {
    id: 502,
    title: 'Electric Horizon Fest',
    slug: 'electric-horizon-fest',
    description: 'Mediterranean waterfront festival blending house, techno, and live electronic ensembles at sunset.',
    schedule: { start_at: '2026-06-20T17:00:00Z', end_at: '2026-06-22T05:00:00Z', duration_hours: 36, is_virtual: false },
    ticketing: { is_paid: true, is_free: false, base_price: 189, sale_price: 169, price_formatted: '€169.00', price_formatted_k: '€0.2k', max_attendees: 22000, tickets_left: 5100 },
    specs: { category: 'Festival', type: 'Waterfront', brand: 'Horizon Series', event_genre: 'House/Techno', venue_size: 'Large', tags: ['Sunset', 'Waterfront', 'Live'] },
    media: { poster: '/themes/events/festival/12.webp', preview: '/themes/events/festival/12.webp', gallery: [] },
    location: { address: 'Parc del Fòrum', city: 'Barcelona', state: 'Catalonia', country: 'Spain', latitude: 41.411, longitude: 2.226, map_title: 'Parc del Fòrum' },
    status: published,
  },
  {
    id: 503,
    title: 'Pulse Collective Weekend',
    slug: 'pulse-collective-weekend',
    description: 'Island club takeover with pool stages, beach sets, and curated after-hours neon nodes.',
    schedule: { start_at: '2026-08-01T14:00:00Z', end_at: '2026-08-03T06:00:00Z', duration_hours: 40, is_virtual: false },
    ticketing: { is_paid: true, is_free: false, base_price: 299, sale_price: 279, price_formatted: '€279.00', price_formatted_k: '€0.3k', max_attendees: 8000, tickets_left: 980 },
    specs: { category: 'Weekender', type: 'Club Festival', brand: 'Pulse Node', event_genre: 'Dance', venue_size: 'Large', tags: ['Ibiza', 'Pool', 'After Hours'] },
    media: { poster: '/themes/events/festival/13.webp', preview: '/themes/events/festival/13.webp', gallery: [] },
    location: { address: 'Playa d\'en Bossa', city: 'Ibiza', state: 'Balearic Islands', country: 'Spain', latitude: 38.876, longitude: 1.396, map_title: 'Playa d\'en Bossa' },
    status: published,
  },
  {
    id: 504,
    title: 'Lumina Stage Series',
    slug: 'lumina-stage-series',
    description: 'Harbor-front light festival with synchronized LED stages, drone shows, and global DJ collectives.',
    schedule: { start_at: '2026-12-05T18:00:00Z', end_at: '2026-12-07T04:00:00Z', duration_hours: 34, is_virtual: false },
    ticketing: { is_paid: true, is_free: false, base_price: 219, sale_price: 199, price_formatted: 'A$199.00', price_formatted_k: 'A$0.2k', max_attendees: 15000, tickets_left: 3300 },
    specs: { category: 'Festival', type: 'Light Show', brand: 'Lumina Group', event_genre: 'Electronic', venue_size: 'Large', tags: ['Harbor', 'LED', 'Drones'] },
    media: { poster: '/themes/events/festival/14.webp', preview: '/themes/events/festival/14.webp', gallery: [] },
    location: { address: 'Darling Harbour', city: 'Sydney', state: 'NSW', country: 'Australia', latitude: -33.874, longitude: 151.2, map_title: 'Darling Harbour' },
    status: { ...published, rating: 4.8 },
  },
];

export type EventsFallbackVariant = 'corporate' | 'classic' | 'music' | 'creative' | 'festival';

const FALLBACK_BY_VARIANT: Record<EventsFallbackVariant, EventListing[]> = {
  corporate: CORPORATE_FALLBACK_EVENTS,
  classic: CLASSIC_FALLBACK_EVENTS,
  music: MUSIC_FALLBACK_EVENTS,
  creative: CREATIVE_FALLBACK_EVENTS,
  festival: FESTIVAL_FALLBACK_EVENTS,
};

export function getFallbackEvents(variant: EventsFallbackVariant): EventListing[] {
  return FALLBACK_BY_VARIANT[variant];
}

export function findFallbackEvent(slug: string, variant: EventsFallbackVariant): EventListing | undefined {
  return FALLBACK_BY_VARIANT[variant].find((event) => event.slug === slug);
}

export function getRelatedFallbackEvents(slug: string, variant: EventsFallbackVariant): EventListing[] {
  return FALLBACK_BY_VARIANT[variant].filter((event) => event.slug !== slug).slice(0, 3);
}

export function findCorporateFallbackEvent(slug: string): EventListing | undefined {
  return findFallbackEvent(slug, 'corporate');
}

export function findClassicFallbackEvent(slug: string): EventListing | undefined {
  return findFallbackEvent(slug, 'classic');
}

export function getCorporateRelatedEvents(slug: string): EventListing[] {
  return getRelatedFallbackEvents(slug, 'corporate');
}

export function getClassicRelatedEvents(slug: string): EventListing[] {
  return getRelatedFallbackEvents(slug, 'classic');
}
