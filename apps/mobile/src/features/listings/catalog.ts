import { ListingCategoryDefinition } from './types';

export const LISTING_CATEGORIES: ListingCategoryDefinition[] = [
  { id: 'products', title: 'Products', icon: 'PR', endpoint: '/v1/products' },
  { id: 'properties', title: 'Properties', icon: 'HO', endpoint: '/v1/properties' },
  { id: 'autos', title: 'Vehicles', icon: 'VE', endpoint: '/v1/vehicles' },
  { id: 'events', title: 'Events', icon: 'EV', endpoint: '/v1/events' },
  { id: 'services', title: 'Services', icon: 'SV', endpoint: '/v1/services' },
  { id: 'jobs', title: 'Jobs', icon: 'JB', endpoint: '/v1/jobs' },
  { id: 'classifieds', title: 'Classifieds', icon: 'CL', endpoint: '/v1/classifieds' },
];
