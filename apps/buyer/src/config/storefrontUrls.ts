import { ModuleType } from '../types';
import { resolveStorefrontBaseUrl } from './resolveApiBaseUrl';

const STOREFRONT_BASE_URL = resolveStorefrontBaseUrl();

const MODULE_PATH_PREFIX: Record<ModuleType, string> = {
  properties: 'properties',
  events: 'events',
  autos: 'vehicles',
  services: 'services',
  jobs: 'jobs',
  classifieds: 'classifieds',
  products: 'product',
};

const MODULE_ALIASES: Record<string, ModuleType> = {
  property: 'properties',
  properties: 'properties',
  event: 'events',
  events: 'events',
  auto: 'autos',
  autos: 'autos',
  vehicle: 'autos',
  vehicles: 'autos',
  service: 'services',
  services: 'services',
  job: 'jobs',
  jobs: 'jobs',
  joblisting: 'jobs',
  joblistings: 'jobs',
  classified: 'classifieds',
  classifieds: 'classifieds',
  product: 'products',
  products: 'products',
};

export function normalizeStorefrontModule(module?: string | null): ModuleType {
  if (!module) {
    return 'products';
  }

  const key = module.trim().toLowerCase();
  return MODULE_ALIASES[key] || 'products';
}

export function storefrontListingUrl(
  slugOrId?: string | number | null,
  module?: string | null,
): string {
  if (!slugOrId) {
    return `${STOREFRONT_BASE_URL}/explore`;
  }

  const normalizedModule = normalizeStorefrontModule(module);
  const prefix = MODULE_PATH_PREFIX[normalizedModule];

  return `${STOREFRONT_BASE_URL}/${prefix}/${encodeURIComponent(String(slugOrId))}`;
}

export const storefrontExploreUrl = () => `${STOREFRONT_BASE_URL}/explore`;
