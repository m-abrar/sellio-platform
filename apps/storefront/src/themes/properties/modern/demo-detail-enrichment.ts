import type { Amenity, PropertyFeature } from '@sellio/types';
import type { PropertyDetail } from './property-detail-types';

type DemoAmenity = Amenity & { icon?: string };

/** Extra API-shaped fields for preview demo listings when the backend is offline. */
const demoImage = (n: number) =>
  `/demo-assets/properties/item-${String(n).padStart(2, '0')}.svg`;

const ENRICHMENTS: Record<string, Partial<PropertyDetail>> = {
  'skyline-glass-tower-42a': {
    tags: ['Penthouse', 'Smart climate', 'Observatory access'],
    gallery: [
      { id: 101, url: demoImage(1), hero: demoImage(1), thumbnail: demoImage(1), order: 1 },
      { id: 102, url: demoImage(2), hero: demoImage(2), thumbnail: demoImage(2), order: 2 },
      { id: 103, url: demoImage(3), hero: demoImage(3), thumbnail: demoImage(3), order: 3 },
      { id: 104, url: demoImage(4), hero: demoImage(4), thumbnail: demoImage(4), order: 4 },
      { id: 105, url: demoImage(5), hero: demoImage(5), thumbnail: demoImage(5), order: 5 },
      { id: 106, url: demoImage(6), hero: demoImage(6), thumbnail: demoImage(6), order: 6 },
    ],
    latitude: 40.7484,
    longitude: -73.9857,
    amenities: [
      { id: 1, title: 'Rooftop observatory', slug: 'rooftop', icon: '🔭' },
      { id: 2, title: 'Smart climate', slug: 'climate', icon: '🌡️' },
      { id: 3, title: 'Private elevator', slug: 'elevator', icon: '🛗' },
      { id: 4, title: 'Concierge', slug: 'concierge', icon: '🛎️' },
    ] as DemoAmenity[],
    features: [
      { id: 1, title: 'Floor-to-ceiling glazing', slug: 'glazing' },
      { id: 2, title: 'Corner exposure', slug: 'corner', pivot: { value: 'NE / SW' } },
    ] as PropertyFeature[],
    scores: [
      { id: 1, title: 'Transit', score: 9.2, units: '/10', description: 'Grand Central 4 min walk' },
      { id: 2, title: 'Walkability', score: 98, units: 'score' },
    ],
    neighborhoods: [
      { id: 1, title: 'Gramercy Park', distance_miles: 0.4 },
      { id: 2, title: 'Union Square', distance_miles: 0.7 },
    ],
    owner: {
      id: 1,
      name: 'Alex Rivera',
      username: 'arivera',
      avatar_url: '/demo-assets/users/avatar-01.svg',
    },
    brand: { id: 1, title: 'Urban Properties Realty' },
    rules: 'No smoking. Quiet hours 10pm–8am.',
    policies: '48-hour cancellation for tours.',
    video: 'https://example.com/video',
    virtual_tour: 'https://example.com/tour',
  },
  'transit-hub-residences-c': {
    gallery: [
      { id: 201, url: demoImage(5), hero: demoImage(5), thumbnail: demoImage(5), order: 1 },
      { id: 202, url: demoImage(7), hero: demoImage(7), thumbnail: demoImage(7), order: 2 },
      { id: 203, url: demoImage(8), hero: demoImage(8), thumbnail: demoImage(8), order: 3 },
      { id: 204, url: demoImage(9), hero: demoImage(9), thumbnail: demoImage(9), order: 4 },
    ],
    tags: ['Micro-unit', 'Rail-adjacent'],
    latitude: 35.6812,
    longitude: 139.7671,
    amenities: [
      { id: 1, title: 'Amenity deck', slug: 'deck', icon: '🏙️' },
      { id: 2, title: 'Acoustic glazing', slug: 'glazing', icon: '🔇' },
    ] as DemoAmenity[],
    fees: [{ id: 1, title: 'Cleaning fee', amount: 85, charge_type: 'per stay' }],
    pricing: {
      base_price: 1850000,
      price_formatted: '$1,850,000',
      currency_symbol: '$',
      price_per_night: 420,
    },
    owner: {
      id: 2,
      name: 'Mika Tanaka',
      username: 'mtanaka',
      avatar_url: '/demo-assets/users/avatar-02.svg',
    },
  },
};

export function enrichDemoDetail(slug: string, detail: PropertyDetail): PropertyDetail {
  const extra = ENRICHMENTS[slug];
  if (!extra) return detail;

  const merged: PropertyDetail = { ...detail, ...extra };

  if (extra.location && detail.location) {
    merged.location = { ...detail.location, ...extra.location };
  } else if (extra.location) {
    merged.location = extra.location;
  }

  if (extra.pricing) {
    merged.pricing = { ...detail.pricing, ...extra.pricing };
  }

  if (extra.latitude != null) {
    const lat = Number(extra.latitude);
    merged.latitude = lat;
    if (merged.location) {
      merged.location = { ...merged.location, latitude: lat };
    }
  }
  if (extra.longitude != null) {
    const lng = Number(extra.longitude);
    merged.longitude = lng;
    if (merged.location) {
      merged.location = { ...merged.location, longitude: lng };
    }
  }

  return merged;
}
