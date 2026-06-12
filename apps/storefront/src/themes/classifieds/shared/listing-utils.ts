import type { Category, ClassifiedListing } from '@sellio/types';
import {
  getClassifiedCategoryKey,
  getClassifiedCategoryTitle,
} from '@/lib/classified-category';

const LOCAL_IMAGE_FALLBACK =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23e2e8f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="18"%3ENo photo%3C/text%3E%3C/svg%3E';

export type LocalCardItem = {
  id: number;
  title: string;
  price: string;
  numericPrice: number;
  distance: string;
  numericDistance: number;
  neighborhood: string;
  image: string;
  sellerInitials: string;
  sellerName: string;
  category: string;
  categoryIcon: string;
  conditionLabel: string;
  mapTop: number;
  mapLeft: number;
  slug: string;
  description?: string;
};

export type GeneralCardItem = {
  id: number;
  title: string;
  price: string;
  numericPrice: number;
  image: string;
  seller: string;
  isSaved: boolean;
  category: string;
  localPickup: boolean;
  delivery: boolean;
  dateAdded: number;
  slug: string;
  description?: string;
  conditionLabel?: string;
  quantity?: number;
};

export type CategoryPill = { id: string; name: string; icon: string };

const parseMapCoords = (dimensions: unknown): string[] => {
  if (typeof dimensions === 'string') {
    return dimensions.split(',').map((part) => part.trim()).filter(Boolean);
  }
  return [];
};

export function getLocalCategoryIcon(category: string): string {
  if (category === 'bikes') return '🚲';
  if (category === 'home') return '🏡';
  if (category === 'kids') return '🧸';
  if (category === 'pets') return '🐾';
  if (category === 'garage') return '🏷️';
  if (category === 'free') return '🆓';
  return '📍';
}

export function getLocalCategoryLabel(slug: string): string {
  if (slug === 'bikes') return 'Bikes & Outdoor';
  if (slug === 'home') return 'Home & Garden';
  if (slug === 'kids') return 'Kids & Baby';
  if (slug === 'pets') return 'Pet Supplies';
  if (slug === 'garage') return 'Garage Sales';
  if (slug === 'free') return 'Free Stuff';
  return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
}

export function formatListingLocation(item: ClassifiedListing): string {
  const city = item.location?.city;
  const state = item.location?.state;

  if (city && state) {
    return `${city}, ${state}`;
  }

  if (city) {
    return city;
  }

  return 'Nearby';
}

export function deriveAreaLabelFromListings(listings: ClassifiedListing[]): string {
  if (!listings.length) {
    return 'Your area';
  }

  const cityCounts = new Map<string, number>();

  listings.forEach((item) => {
    const city = item.location?.city;
    if (city) {
      cityCounts.set(city, (cityCounts.get(city) ?? 0) + 1);
    }
  });

  let topCity = '';
  let topCount = 0;

  cityCounts.forEach((count, city) => {
    if (count > topCount) {
      topCity = city;
      topCount = count;
    }
  });

  const sample =
    listings.find((item) => item.location?.city === topCity) ?? listings[0];

  return formatListingLocation(sample);
}

export function getClassifiedListingImage(item: ClassifiedListing): string {
  return item.media?.main_photo || item.media?.thumbnail || LOCAL_IMAGE_FALLBACK;
}

export function getGeneralCategoryIcon(slug: string): string {
  if (slug === 'electronics') return '📱';
  if (slug === 'vehicles') return '🚗';
  if (slug === 'real-estate') return '🏠';
  if (slug === 'home' || slug === 'home-goods') return '🛋️';
  if (slug === 'fashion') return '👕';
  if (slug === 'services') return '🔧';
  return '📦';
}

export function getGeneralCategoryLabel(slug: string): string {
  if (slug === 'electronics') return 'Electronics';
  if (slug === 'vehicles') return 'Vehicles';
  if (slug === 'real-estate') return 'Real Estate';
  if (slug === 'home' || slug === 'home-goods') return 'Home Goods';
  if (slug === 'fashion') return 'Fashion';
  if (slug === 'services') return 'Services';
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function mapClassifiedToLocalCard(item: ClassifiedListing): LocalCardItem {
  const generatedSlug =
    item.slug ||
    item.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const coords = parseMapCoords(item.item_specs?.dimensions);
  const mapTop = coords.length === 2 ? parseInt(coords[0], 10) : 20 + ((item.id * 7) % 70);
  const mapLeft = coords.length === 2 ? parseInt(coords[1], 10) : 15 + ((item.id * 9) % 75);
  const numericDistance = item.id * 0.45;
  const categoryKey = getClassifiedCategoryKey(item.taxonomy?.category) || 'home';
  const seller = item.taxonomy?.brand || item.seller?.name || 'Neighbor';
  const initials =
    seller
      .split(' ')
      .map((word) => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'N';
  const isFree = item.pricing?.sale_price === 0 || item.pricing?.base_price === 0;
  const priceLabel = isFree
    ? 'Free'
    : item.pricing?.formatted ||
      `$${(item.pricing?.sale_price || item.pricing?.base_price || 0).toLocaleString()}`;

  return {
    id: item.id,
    title: item.title,
    price: priceLabel,
    numericPrice: item.pricing?.sale_price || item.pricing?.base_price || 0,
    distance: numericDistance.toFixed(1),
    numericDistance,
    neighborhood: formatListingLocation(item),
    image: getClassifiedListingImage(item),
    sellerInitials: initials,
    sellerName: seller,
    category: categoryKey,
    categoryIcon: getLocalCategoryIcon(categoryKey),
    conditionLabel: item.item_specs?.condition_label || 'Good',
    mapTop,
    mapLeft,
    slug: generatedSlug,
    description: item.description,
  };
}

export function mapClassifiedToGeneralCard(item: ClassifiedListing): GeneralCardItem {
  const generatedSlug =
    item.slug ||
    item.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  return {
    id: item.id,
    title: item.title,
    price:
      item.pricing?.formatted ||
      item.pricing?.formatted_short ||
      `$${(item.pricing?.sale_price || item.pricing?.base_price || 0).toLocaleString()}`,
    numericPrice: item.pricing?.sale_price || item.pricing?.base_price || 0,
    image:
      item.media?.main_photo ||
      item.media?.thumbnail ||
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400',
    seller: item.taxonomy?.brand || 'Verified Seller',
    isSaved: false,
    category: item.taxonomy?.category || 'electronics',
    localPickup: !item.status?.is_shipping,
    delivery: item.status?.is_shipping || false,
    dateAdded: item.id,
    slug: generatedSlug,
    description: item.description,
    conditionLabel: item.item_specs?.condition_label || 'Great',
    quantity: item.item_specs?.quantity || 1,
  };
}

export function buildLocalCategoriesFromSidebar(categories: Category[]): CategoryPill[] {
  const pills: CategoryPill[] = [{ id: 'all', name: 'All Nearby', icon: '📍' }];
  categories.forEach((cat) => {
    const id = cat.slug || String(cat.id);
    if (!pills.some((pill) => pill.id === id)) {
      pills.push({
        id,
        name: cat.title,
        icon: getLocalCategoryIcon(cat.slug || ''),
      });
    }
  });
  return pills;
}

export function buildLocalCategoriesFromListings(listings: ClassifiedListing[]): CategoryPill[] {
  const pills: CategoryPill[] = [{ id: 'all', name: 'All Nearby', icon: '📍' }];
  listings.forEach((item) => {
    const catKey = getClassifiedCategoryKey(item.taxonomy?.category);
    if (catKey && !pills.some((pill) => pill.id === catKey)) {
      pills.push({
        id: catKey,
        name: getClassifiedCategoryTitle(
          item.taxonomy?.category,
          getLocalCategoryLabel(catKey),
        ),
        icon: getLocalCategoryIcon(catKey),
      });
    }
  });
  return pills;
}

export function buildGeneralCategoriesFromSidebar(categories: Category[]): CategoryPill[] {
  const pills: CategoryPill[] = [{ id: 'all', name: 'All Listings', icon: '📂' }];
  categories.forEach((cat) => {
    const id = cat.slug || String(cat.id);
    if (!pills.some((pill) => pill.id === id)) {
      pills.push({
        id,
        name: cat.title,
        icon: getGeneralCategoryIcon(cat.slug || ''),
      });
    }
  });
  return pills;
}

export function buildGeneralCategoriesFromListings(listings: ClassifiedListing[]): CategoryPill[] {
  const pills: CategoryPill[] = [{ id: 'all', name: 'All Listings', icon: '📂' }];
  listings.forEach((item) => {
    const catSlug = item.taxonomy?.category;
    if (catSlug && !pills.some((pill) => pill.id === catSlug)) {
      pills.push({
        id: catSlug,
        name: getGeneralCategoryLabel(catSlug),
        icon: getGeneralCategoryIcon(catSlug),
      });
    }
  });
  return pills;
}
