import type { Property, Category, Location } from '@sellio/types';
import type { ListingFilter } from './listing-mode';
import { getPropertyListingMode } from './listing-mode';

export type ExploreSort = 'newest' | 'price-asc' | 'price-desc';

export function getExploreSortPrice(property: Property): number {
  const mode = getPropertyListingMode(property);
  if (mode === 'rental') {
    return Number(property.pricing?.price_per_night ?? property.base_price ?? 0);
  }
  return Number(property.pricing?.base_price ?? property.base_price ?? 0);
}

export function sortExploreProperties(
  properties: Property[],
  sort: ExploreSort,
): Property[] {
  const sorted = [...properties];

  sorted.sort((left, right) => {
    if (sort === 'newest') {
      return Number(right.id ?? 0) - Number(left.id ?? 0);
    }

    const leftPrice = getExploreSortPrice(left);
    const rightPrice = getExploreSortPrice(right);
    return sort === 'price-asc' ? leftPrice - rightPrice : rightPrice - leftPrice;
  });

  return sorted;
}

export function getSalePriceRangeOptions() {
  return [
    { value: '', label: 'Any price' },
    { value: 'under-500k', label: 'Under $500K' },
    { value: '500k-1m', label: '$500K – $1M' },
    { value: '1m-2m', label: '$1M – $2M' },
    { value: '2m-plus', label: '$2M+' },
  ];
}

export function getRentalPriceRangeOptions() {
  return [
    { value: '', label: 'Any nightly rate' },
    { value: 'under-200', label: 'Under $200 / night' },
    { value: '200-400', label: '$200 – $400 / night' },
    { value: '400-plus', label: '$400+ / night' },
  ];
}

const VALID_PRICE_RANGES = new Set([
  '',
  'under-500k',
  '500k-1m',
  '1m-2m',
  '2m-plus',
  'under-200',
  '200-400',
  '400-plus',
]);

/** Drops legacy explore URL values (e.g. 1m-5m from an earlier build). */
export function normalizeExplorePriceRange(value: string): string {
  return VALID_PRICE_RANGES.has(value) ? value : '';
}

export function getExplorePriceRangeOptions(listingFilter: ListingFilter) {
  if (listingFilter === 'rental') {
    return getRentalPriceRangeOptions();
  }
  if (listingFilter === 'sale') {
    return getSalePriceRangeOptions();
  }

  return [
    { value: '', label: 'Any price' },
    ...getSalePriceRangeOptions()
      .slice(1)
      .map((option) => ({ ...option, label: `Buy: ${option.label}` })),
    ...getRentalPriceRangeOptions()
      .slice(1)
      .map((option) => ({ ...option, label: `Rent: ${option.label}` })),
  ];
}

function matchesSalePriceRange(property: Property, range: string): boolean {
  const value = Number(property.pricing?.base_price ?? property.base_price ?? 0);
  if (range === 'under-500k') return value > 0 && value < 500000;
  if (range === '500k-1m') return value >= 500000 && value <= 1000000;
  if (range === '1m-2m') return value >= 1000000 && value <= 2000000;
  if (range === '2m-plus') return value >= 2000000;
  return true;
}

function matchesRentalPriceRange(property: Property, range: string): boolean {
  const value = Number(property.pricing?.price_per_night ?? property.base_price ?? 0);
  if (range === 'under-200') return value > 0 && value < 200;
  if (range === '200-400') return value >= 200 && value <= 400;
  if (range === '400-plus') return value >= 400;
  return true;
}

export function matchesExplorePriceRange(
  property: Property,
  range: string,
  listingFilter: ListingFilter,
): boolean {
  if (!range) return true;

  const mode = getPropertyListingMode(property);
  const saleRanges = ['under-500k', '500k-1m', '1m-2m', '2m-plus'];
  const rentalRanges = ['under-200', '200-400', '400-plus'];

  if (saleRanges.includes(range)) {
    if (listingFilter === 'rental') return false;
    return mode === 'sale' && matchesSalePriceRange(property, range);
  }

  if (rentalRanges.includes(range)) {
    if (listingFilter === 'sale') return false;
    return mode === 'rental' && matchesRentalPriceRange(property, range);
  }

  return true;
}

export type ExploreFilterChip = {
  id: string;
  label: string;
};

export function buildExploreFilterChips(input: {
  searchQuery: string;
  selectedLocation: string | number;
  selectedCategory: string | number;
  selectedBedrooms: string;
  selectedPriceRange: string;
  listingFilter: ListingFilter;
  locations: Location[];
  categories: Category[];
}): ExploreFilterChip[] {
  const chips: ExploreFilterChip[] = [];

  if (input.searchQuery.trim()) {
    chips.push({ id: 'q', label: `"${input.searchQuery.trim()}"` });
  }

  if (input.listingFilter !== 'all') {
    chips.push({
      id: 'mode',
      label: input.listingFilter === 'rental' ? 'For rent' : 'For sale',
    });
  }

  if (input.selectedLocation) {
    const location = input.locations.find(
      (item) =>
        item.slug === input.selectedLocation ||
        String(item.id) === String(input.selectedLocation),
    );
    chips.push({
      id: 'loc',
      label: location?.title || String(input.selectedLocation),
    });
  }

  if (input.selectedCategory) {
    const category = input.categories.find(
      (item) => String(item.id) === String(input.selectedCategory),
    );
    chips.push({
      id: 'cat',
      label: category?.title || 'Property type',
    });
  }

  if (input.selectedBedrooms) {
    chips.push({
      id: 'beds',
      label: `${input.selectedBedrooms}+ bedrooms`,
    });
  }

  if (input.selectedPriceRange) {
    const label = getPriceRangeLabel(input.selectedPriceRange, input.listingFilter);
    if (label && label !== input.selectedPriceRange) {
      chips.push({ id: 'price', label });
    }
  }

  return chips;
}

export function getPriceRangeLabel(
  range: string,
  _listingFilter: ListingFilter,
): string {
  const sale = getSalePriceRangeOptions().find((option) => option.value === range);
  if (sale) return sale.label;
  const rental = getRentalPriceRangeOptions().find((option) => option.value === range);
  if (rental) return rental.label;
  return '';
}
