import type { EventListing } from '@sellio/types';

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

export function findCorporateFallbackEvent(slug: string): EventListing | undefined {
  return CORPORATE_FALLBACK_EVENTS.find((event) => event.slug === slug);
}

export function findClassicFallbackEvent(slug: string): EventListing | undefined {
  return CLASSIC_FALLBACK_EVENTS.find((event) => event.slug === slug);
}

export function getCorporateRelatedEvents(slug: string): EventListing[] {
  return CORPORATE_FALLBACK_EVENTS.filter((event) => event.slug !== slug);
}

export function getClassicRelatedEvents(slug: string): EventListing[] {
  return CLASSIC_FALLBACK_EVENTS.filter((event) => event.slug !== slug);
}
