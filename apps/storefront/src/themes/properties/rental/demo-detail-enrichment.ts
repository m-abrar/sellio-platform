import type { Amenity, PropertyFeature } from '@sellio/types';
import type { PropertyDetail } from './property-detail-types';

const demoImage = (n: number) => `/demo-assets/properties/item-${String(n).padStart(2, '0')}.svg`;

type DemoAmenity = Amenity & { icon?: string };

function galleryItems(indices: number[]) {
  return indices.map((n, order) => ({
    id: 100 + n,
    url: demoImage(n),
    hero: demoImage(n),
    thumbnail: demoImage(n),
    order: order + 1,
  }));
}

const ENRICHMENTS: Record<string, Partial<PropertyDetail>> = {
  'north-tower-studio': {
    tags: ['Studio', 'Pet friendly', 'Transit nearby'],
    gallery: galleryItems([1, 2, 3, 4]),
    latitude: 40.7128,
    longitude: -74.006,
    amenities: [
      { id: 1, title: 'In-unit laundry', slug: 'laundry', icon: '🧺' },
      { id: 2, title: 'High-speed Wi‑Fi', slug: 'wifi', icon: '📶' },
      { id: 3, title: 'Gym access', slug: 'gym', icon: '🏋️' },
    ] as DemoAmenity[],
    features: [
      { id: 1, title: 'Smart thermostat', slug: 'thermostat' },
      { id: 2, title: 'Keyless entry', slug: 'keyless' },
    ] as PropertyFeature[],
    owner: {
      id: 1,
      name: 'Jordan Lee',
      username: 'jlee',
      avatar_url: '/demo-assets/users/avatar-01.svg',
    },
    brand: { id: 1, title: 'RentEase Property Management' },
    rules: 'No smoking. Quiet hours 10pm–8am.',
    policies: 'First month + security deposit due at signing.',
  },
  'riverside-2br-apartment': {
    tags: ['River view', '2 bed', 'Parking available'],
    gallery: galleryItems([2, 5, 6, 7]),
    latitude: 40.7282,
    longitude: -73.9942,
    amenities: [
      { id: 1, title: 'Riverwalk access', slug: 'river', icon: '🌊' },
      { id: 2, title: 'Dishwasher', slug: 'dishwasher', icon: '🍽️' },
      { id: 3, title: 'Balcony', slug: 'balcony', icon: '🪴' },
    ] as DemoAmenity[],
    owner: {
      id: 2,
      name: 'Morgan Ellis',
      avatar_url: '/demo-assets/users/avatar-02.svg',
    },
  },
  'modern-industrial-loft': {
    tags: ['Loft', 'Exposed brick', 'Arts district'],
    gallery: galleryItems([3, 4, 8, 9]),
    latitude: 40.7265,
    longitude: -74.0015,
    amenities: [
      { id: 1, title: '14-ft ceilings', slug: 'ceilings', icon: '📐' },
      { id: 2, title: 'Polished concrete floors', slug: 'floors', icon: '✨' },
    ] as DemoAmenity[],
  },
  'skyline-penthouse-unit': {
    tags: ['Penthouse', 'Private elevator', 'Panoramic views'],
    gallery: galleryItems([4, 10, 11, 12]),
    latitude: 40.7549,
    longitude: -73.984,
    amenities: [
      { id: 1, title: 'Private elevator', slug: 'elevator', icon: '🛗' },
      { id: 2, title: 'Wine cellar', slug: 'wine', icon: '🍷' },
      { id: 3, title: 'Concierge', slug: 'concierge', icon: '🛎️' },
    ] as DemoAmenity[],
    owner: {
      id: 3,
      name: 'Alex Rivera',
      avatar_url: '/demo-assets/users/avatar-03.svg',
    },
  },
  'sunlit-family-townhouse': {
    tags: ['Family', 'Garden', 'Garage'],
    gallery: galleryItems([5, 6, 7, 8]),
    latitude: 40.6892,
    longitude: -73.9442,
    amenities: [
      { id: 1, title: 'Private garden', slug: 'garden', icon: '🌳' },
      { id: 2, title: '2-car garage', slug: 'garage', icon: '🚗' },
    ] as DemoAmenity[],
  },
  'compact-downtown-micro-studio': {
    tags: ['Micro-studio', 'Transit hub', 'Utilities included'],
    gallery: galleryItems([6, 1, 2, 3]),
    latitude: 40.7505,
    longitude: -73.9934,
    amenities: [
      { id: 1, title: 'Murphy bed', slug: 'murphy', icon: '🛏️' },
      { id: 2, title: 'Utilities included', slug: 'utilities', icon: '💡' },
    ] as DemoAmenity[],
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
    if (merged.location) merged.location = { ...merged.location, latitude: lat };
  }
  if (extra.longitude != null) {
    const lng = Number(extra.longitude);
    merged.longitude = lng;
    if (merged.location) merged.location = { ...merged.location, longitude: lng };
  }

  return merged;
}
