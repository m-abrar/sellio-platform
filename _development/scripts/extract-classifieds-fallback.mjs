import fs from 'fs';
import path from 'path';

const root = path.resolve('apps/storefront/src/themes/classifieds');

function extract(file) {
  const src = fs.readFileSync(path.join(root, file), 'utf8');
  const m = src.match(/const FALLBACK_CLASSIFIEDS: ClassifiedListing\[\] = (\[[\s\S]*?\n\]);/);
  if (!m) throw new Error(`no match in ${file}`);
  return m[1];
}

const local = extract('local/Page.tsx');
const general = extract('general/Page.tsx');

const out = `import type { ClassifiedListing } from '@sellio/types';

export const LOCAL_FALLBACK_CLASSIFIEDS: ClassifiedListing[] = ${local};

export const GENERAL_FALLBACK_CLASSIFIEDS: ClassifiedListing[] = ${general};

export const LOCAL_DEMO_CATEGORIES = [
  { id: 'all', name: 'All Nearby', icon: '📍' },
  { id: 'free', name: '🆓 Free Stuff', icon: '🆓' },
  { id: 'home', name: '🏡 Home & Garden', icon: '🏡' },
  { id: 'kids', name: '🧸 Kids & Baby', icon: '🧸' },
  { id: 'bikes', name: '🚲 Bikes & Outdoor', icon: '🚲' },
  { id: 'pets', name: '🐾 Pet Supplies', icon: '🐾' },
  { id: 'garage', name: '🏷️ Garage Sales', icon: '🏷️' },
];

export const GENERAL_DEMO_CATEGORIES = [
  { id: 'all', name: 'All Listings', icon: '📂' },
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'vehicles', name: 'Vehicles', icon: '🚗' },
  { id: 'real-estate', name: 'Real Estate', icon: '🏠' },
  { id: 'home', name: 'Home Goods', icon: '🛋️' },
  { id: 'fashion', name: 'Fashion', icon: '👕' },
  { id: 'services', name: 'Services', icon: '🔧' },
];

export function findLocalFallbackListing(slug: string) {
  return LOCAL_FALLBACK_CLASSIFIEDS.find((item) => item.slug === slug);
}

export function findGeneralFallbackListing(slug: string) {
  return GENERAL_FALLBACK_CLASSIFIEDS.find((item) => item.slug === slug);
}

export function getLocalRelatedListings(listing: ClassifiedListing, limit = 3) {
  return LOCAL_FALLBACK_CLASSIFIEDS.filter(
    (item) => item.taxonomy?.category === listing.taxonomy?.category && item.slug !== listing.slug,
  ).slice(0, limit);
}

export function getGeneralRelatedListings(listing: ClassifiedListing, limit = 3) {
  return GENERAL_FALLBACK_CLASSIFIEDS.filter(
    (item) => item.taxonomy?.category === listing.taxonomy?.category && item.slug !== listing.slug,
  ).slice(0, limit);
}
`;

fs.writeFileSync(path.join(root, 'shared/fallback-data.ts'), out);
console.log('wrote fallback-data.ts');
