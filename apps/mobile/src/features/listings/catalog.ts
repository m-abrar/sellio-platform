import { ListingCategoryDefinition } from './types';

export const LISTING_CATEGORIES: ListingCategoryDefinition[] = [
  { id: 'products', title: 'Products', icon: '🛍️', endpoint: '/v1/products' },
  { id: 'properties', title: 'Properties', icon: '🏠', endpoint: '/v1/properties' },
  { id: 'autos', title: 'Vehicles', icon: '🚗', endpoint: '/v1/vehicles' },
  { id: 'events', title: 'Events', icon: '🎟️', endpoint: '/v1/events' },
  { id: 'services', title: 'Services', icon: '🛠️', endpoint: '/v1/services' },
  { id: 'jobs', title: 'Jobs', icon: '💼', endpoint: '/v1/jobs' },
  { id: 'classifieds', title: 'Classifieds', icon: '🏷️', endpoint: '/v1/classifieds' },
];
