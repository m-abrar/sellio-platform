import type { Property } from '@/types';

const demoImage = (n: number) => `/demo-assets/properties/item-${String(n).padStart(2, '0')}.svg`;

export type RentalUnitCard = {
  id: number;
  slug: string;
  title: string;
  price: string;
  type: string;
  location: string;
  beds: string;
  baths: string;
  sqft: string;
  image: string;
  scarcityLabel: string | null;
};

export function getMonthlyRent(property: Property): number {
  const nightly = Number(property.pricing?.price_per_night ?? 0);
  if (nightly > 0 && nightly < 5000) {
    return nightly;
  }
  let raw = Number(property.pricing?.base_price ?? property.base_price ?? 0);
  if (raw > 100000) {
    raw = 1200 + (Number(property.id) % 8) * 450;
  }
  return raw;
}

export function formatMonthlyRent(property: Property): string {
  return `$${getMonthlyRent(property).toLocaleString()}`;
}

export function getRentalScarcityLabel(property: Property): string | null {
  const stock = (property as Property & { stock_count?: number }).stock_count;
  if (typeof stock === 'number' && stock > 0 && stock <= 3) {
    return stock === 1 ? 'Last unit' : `Only ${stock} left`;
  }
  if (property.maximum_guests > 0 && property.maximum_guests <= 2) {
    return 'High demand';
  }
  return null;
}

function getCategoryTitle(property: Property): string {
  const cat = property.specs?.category ?? (property as Property & { category?: { title?: string } }).category;
  if (typeof cat === 'string') return cat;
  if (cat && typeof cat === 'object' && 'title' in cat) {
    return String((cat as { title?: string }).title || 'Apartment');
  }
  const byId: Record<number, string> = {
    1: 'Studio',
    2: 'Apartment',
    3: 'Loft',
    4: 'Penthouse',
    5: 'Townhouse',
  };
  return byId[property.category_id] || 'Apartment';
}

function extractImageUrl(item: unknown): string | null {
  if (typeof item === 'string' && item.trim()) return item;
  if (!item || typeof item !== 'object') return null;
  const record = item as Record<string, unknown>;
  for (const key of ['hero', 'url', 'original_url', 'thumbnail', 'preview']) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value;
  }
  return null;
}

export function getPropertyLocation(property: Property): string {
  return (
    property.location?.title ||
    [property.city, property.state].filter(Boolean).join(', ') ||
    property.address ||
    'Location TBA'
  );
}

export function getPropertySpecs(property: Property) {
  return {
    beds: property.specs?.bedrooms ?? property.number_of_bedrooms,
    baths: property.specs?.bathrooms ?? property.number_of_bathrooms,
    area:
      property.specs?.area_formatted ||
      (property.area_sq_ft ? `${Number(property.area_sq_ft).toLocaleString()} sq ft` : null),
    parking: property.specs?.parking_spots ?? property.number_of_parking_spots,
    year: property.specs?.year_built ?? property.year_built,
    category:
      property.specs?.category ||
      (property as Property & { category?: { title?: string } }).category?.title ||
      'Rental',
  };
}

export function collectPropertyImages(property: Property, index = 0): string[] {
  const images: string[] = [];
  const add = (url?: string | null) => {
    if (url && !images.includes(url)) images.push(url);
  };

  if (Array.isArray(property.gallery)) {
    const items = [...property.gallery].sort((a, b) => {
      const left = (a as { order?: number })?.order ?? 0;
      const right = (b as { order?: number })?.order ?? 0;
      return left - right;
    });
    items.forEach((item) => add(extractImageUrl(item)));
  }

  add(property.primary_image_url);
  add(property.featured_image);
  add(property.thumbnail_url);

  if (Array.isArray(property.media)) {
    property.media.forEach((item) => add(extractImageUrl(item)));
  }

  const featured = property.featured_image || property.primary_image_url;
  if (featured) {
    const existing = images.indexOf(featured);
    if (existing > 0) {
      images.splice(existing, 1);
      images.unshift(featured);
    } else if (existing === -1) {
      images.unshift(featured);
    }
  }

  if (!images.length) {
    images.push(`/themes/properties/rental/${(index % 6) + 1}.webp`);
    images.push(demoImage((index % 6) + 1));
  }

  return images;
}

export function mapPropertyToLeaseCard(property: Property, index = 0): RentalUnitCard {
  const beds = property.specs?.bedrooms ?? property.number_of_bedrooms ?? 1;
  const baths = property.specs?.bathrooms ?? property.number_of_bathrooms ?? 1;
  const sqft =
    property.specs?.area_formatted ||
    (property.area_sq_ft ? `${Number(property.area_sq_ft).toLocaleString()} sq ft` : '—');

  return {
    id: property.id,
    slug: property.slug,
    title: property.title,
    price: formatMonthlyRent(property),
    type: getCategoryTitle(property),
    location:
      property.location?.title ||
      [property.city, property.state].filter(Boolean).join(', ') ||
      property.address ||
      'Location TBA',
    beds: String(beds),
    baths: String(baths),
    sqft: String(sqft),
    image: collectPropertyImages(property, index)[0],
    scarcityLabel: getRentalScarcityLabel(property),
  };
}

export function isRentalProperty(property: Property): boolean {
  return (
    Boolean(property.is_rental) ||
    property.specs?.property_type?.toLowerCase() === 'rent' ||
    getMonthlyRent(property) < 50000
  );
}
