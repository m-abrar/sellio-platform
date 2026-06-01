import type { Property, Category, Location } from '@sellio/types';
import { getMonthlyRent } from './property-utils';

export type ExploreSort = 'newest' | 'price-asc' | 'price-desc';

export function getExploreSortPrice(property: Property): number {
  return getMonthlyRent(property);
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

export function getMonthlyRentPriceRangeOptions() {
  return [
    { value: '', label: 'Any monthly rent' },
    { value: 'under-1500', label: 'Under $1,500 / mo' },
    { value: '1500-2500', label: '$1,500 – $2,500 / mo' },
    { value: '2500-4000', label: '$2,500 – $4,000 / mo' },
    { value: '4000-plus', label: '$4,000+ / mo' },
  ];
}

const VALID_PRICE_RANGES = new Set([
  '',
  'under-1500',
  '1500-2500',
  '2500-4000',
  '4000-plus',
]);

export function normalizeExplorePriceRange(value: string): string {
  return VALID_PRICE_RANGES.has(value) ? value : '';
}

export function matchesExplorePriceRange(property: Property, range: string): boolean {
  if (!range) return true;
  const value = getMonthlyRent(property);
  if (range === 'under-1500') return value > 0 && value < 1500;
  if (range === '1500-2500') return value >= 1500 && value <= 2500;
  if (range === '2500-4000') return value >= 2500 && value <= 4000;
  if (range === '4000-plus') return value >= 4000;
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
  locations: Location[];
  categories: Category[];
}): ExploreFilterChip[] {
  const chips: ExploreFilterChip[] = [];

  if (input.searchQuery.trim()) {
    chips.push({ id: 'q', label: `"${input.searchQuery.trim()}"` });
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
    const match = getMonthlyRentPriceRangeOptions().find(
      (option) => option.value === input.selectedPriceRange,
    );
    if (match) {
      chips.push({ id: 'price', label: match.label });
    }
  }

  return chips;
}
