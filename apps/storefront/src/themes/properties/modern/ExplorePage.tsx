'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Property, Category, Location } from '@/types';
import { useSearchParams, useRouter } from 'next/navigation';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useClientReady } from '@/hooks/useClientReady';
import {
  ExploreFilters,
  CatalogRegistryAlert,
  ExplorePageHeader,
  ExploreResultsToolbar,
  ExplorePropertyGrid,
  ExploreLoadingShell,
} from './components';
import {
  applyBedroomFilter,
  fetchPropertyCatalogPage,
  resolveCatalogFailure,
  resolveCategoryIdBySlug,
  type PropertyCatalogFilters,
} from './catalog';
import { useDemoFallbackAllowed } from './hooks/useDemoFallbackAllowed';
import {
  buildExploreFilterChips,
  normalizeExplorePriceRange,
  sortExploreProperties,
  matchesExplorePriceRange,
  type ExploreSort,
} from './explore-utils';
import { matchesListingFilter, type ListingFilter } from './listing-mode';
import { mapPropertyToExploreCard } from './property-utils';

interface ExplorePageProps {
  initialCategorySlug?: string;
}

const SALE_PRICE_RANGES = new Set(['under-500k', '500k-1m', '1m-2m', '2m-plus']);
const RENTAL_PRICE_RANGES = new Set(['under-200', '200-400', '400-plus']);

function parseListingFilter(value: string | null): ListingFilter {
  if (value === 'rental' || value === 'sale') return value;
  return 'all';
}

export default function ExplorePage({ initialCategorySlug }: ExplorePageProps) {
  const clientReady = useClientReady();
  const router = useRouter();
  const searchParams = useSearchParams();
  const allowDemoCatalog = useDemoFallbackAllowed();

  const initialSearch = searchParams.get('q') || '';
  const initialLoc = searchParams.get('loc') || '';
  const initialCat = searchParams.get('cat') || '';
  const initialBeds = searchParams.get('beds') || '';
  const initialPrice = normalizeExplorePriceRange(searchParams.get('price') || '');
  const initialMode = parseListingFilter(searchParams.get('mode'));
  const searchParamsKey = searchParams.toString();

  const [properties, setProperties] = useState<Property[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sort, setSort] = useState<ExploreSort>('newest');

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedLocation, setSelectedLocation] = useState<string | number>(initialLoc);
  const [selectedCategory, setSelectedCategory] = useState<string | number>(initialCat);
  const [selectedBedrooms, setSelectedBedrooms] = useState(initialBeds);
  const [selectedPriceRange, setSelectedPriceRange] = useState(initialPrice);
  const [listingFilter, setListingFilter] = useState<ListingFilter>(initialMode);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const skipDebounceRef = useRef(false);
  const isInitialFetchRef = useRef(true);

  const heroKicker = useThemeContent('explore.kicker', 'Property search');
  const heroTitle = useThemeContent('explore.title', 'Find your next home.');
  const heroHighlight = useThemeContent('explore.highlight', 'home');
  const heroDescription = useThemeContent(
    'explore.description',
    'Browse homes and apartments for rent or sale. Filter by location, price, bedrooms, and property type.',
  );
  const searchPlaceholder = useThemeContent(
    'explore.search_placeholder',
    'Search by city, neighborhood, or keyword...',
  );

  useEffect(() => {
    if (!initialCategorySlug) return;
    const categoryId = resolveCategoryIdBySlug(
      initialCategorySlug,
      categories || [],
      allowDemoCatalog,
    );
    if (categoryId !== undefined) {
      setSelectedCategory(categoryId);
    }
  }, [initialCategorySlug, categories, allowDemoCatalog]);

  useEffect(() => {
    if (!clientReady) return;
    setSearchQuery(searchParams.get('q') || '');
    setSelectedLocation(searchParams.get('loc') || '');
    setSelectedCategory(searchParams.get('cat') || '');
    setSelectedBedrooms(searchParams.get('beds') || '');
    setSelectedPriceRange(normalizeExplorePriceRange(searchParams.get('price') || ''));
    setListingFilter(parseListingFilter(searchParams.get('mode')));
  }, [clientReady, searchParamsKey, searchParams]);

  useEffect(() => {
    if (!selectedPriceRange) return;
    if (listingFilter === 'rental' && SALE_PRICE_RANGES.has(selectedPriceRange)) {
      setSelectedPriceRange('');
    }
    if (listingFilter === 'sale' && RENTAL_PRICE_RANGES.has(selectedPriceRange)) {
      setSelectedPriceRange('');
    }
  }, [listingFilter, selectedPriceRange]);

  useEffect(() => {
    if (!clientReady) return;
    document.body.classList.toggle('pm-explore-filters-open', mobileFiltersOpen);
    return () => document.body.classList.remove('pm-explore-filters-open');
  }, [clientReady, mobileFiltersOpen]);

  const catalogFilters = (): PropertyCatalogFilters => ({
    searchQuery,
    selectedCategory,
    selectedLocation,
    selectedBedrooms,
    selectedPriceRange,
    listingFilter,
  });

  const updateUrlParams = (
    query: string,
    loc: string | number,
    cat: string | number,
    beds: string,
    price: string,
    mode: ListingFilter,
  ) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (loc) params.set('loc', String(loc));
    if (cat) params.set('cat', String(cat));
    if (beds) params.set('beds', beds);
    if (price) params.set('price', price);
    if (mode !== 'all') params.set('mode', mode);

    if (typeof window !== 'undefined') {
      const suffix = params.toString();
      router.push(`${window.location.pathname}${suffix ? `?${suffix}` : ''}`, {
        scroll: false,
      });
    }
  };

  const fetchProperties = async (pageToFetch = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    const result = await fetchPropertyCatalogPage(pageToFetch, catalogFilters(), 9);

    if (result.ok) {
      if (isLoadMore) {
        setProperties((prev) => [...prev, ...result.data]);
      } else {
        setProperties(result.data);
      }
      setCategories(result.categories);
      setLocations(result.locations);
      setCurrentPage(result.currentPage);
      setLastPage(result.lastPage);
      setUseFallback(false);
      setApiError(null);
    } else {
      setApiError(result.error);
      applyCatalogFailure(isLoadMore);
    }

    setLoading(false);
    setLoadingMore(false);
  };

  const applyCatalogFailure = (isLoadMore: boolean) => {
    const resolution = resolveCatalogFailure(catalogFilters(), allowDemoCatalog);

    if (resolution.mode === 'demo') {
      setUseFallback(true);
      setCategories(resolution.categories);
      setLocations(resolution.locations);
      if (isLoadMore) {
        setProperties((prev) => [...prev, ...resolution.estates]);
      } else {
        setProperties(resolution.estates);
      }
      setCurrentPage(1);
      setLastPage(1);
      return;
    }

    setUseFallback(false);
    setCategories([]);
    setLocations([]);
    if (!isLoadMore) {
      setProperties([]);
    }
    setCurrentPage(1);
    setLastPage(1);
  };

  useEffect(() => {
    if (!clientReady) return;

    if (skipDebounceRef.current) {
      skipDebounceRef.current = false;
      return;
    }

    const delay = isInitialFetchRef.current ? 0 : 320;
    isInitialFetchRef.current = false;

    const timer = window.setTimeout(() => {
      fetchProperties(1, false);
      updateUrlParams(
        searchQuery,
        selectedLocation,
        selectedCategory,
        selectedBedrooms,
        selectedPriceRange,
        listingFilter,
      );
    }, delay);

    return () => window.clearTimeout(timer);
  }, [
    clientReady,
    searchQuery,
    selectedLocation,
    selectedCategory,
    selectedBedrooms,
    selectedPriceRange,
    listingFilter,
  ]);

  const handleRefineSearch = () => {
    setMobileFiltersOpen(false);
    skipDebounceRef.current = true;
    fetchProperties(1, false);
    updateUrlParams(
      searchQuery,
      selectedLocation,
      selectedCategory,
      selectedBedrooms,
      selectedPriceRange,
      listingFilter,
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedLocation('');
    setSelectedCategory('');
    setSelectedBedrooms('');
    setSelectedPriceRange('');
    setListingFilter('all');
    setMobileFiltersOpen(false);
  };

  const handleRemoveChip = (chipId: string) => {
    switch (chipId) {
      case 'q':
        setSearchQuery('');
        break;
      case 'mode':
        setListingFilter('all');
        break;
      case 'loc':
        setSelectedLocation('');
        break;
      case 'cat':
        setSelectedCategory('');
        break;
      case 'beds':
        setSelectedBedrooms('');
        break;
      case 'price':
        setSelectedPriceRange('');
        break;
      default:
        break;
    }
  };

  const handleLoadMore = () => {
    if (useFallback) return;
    if (currentPage < lastPage) {
      fetchProperties(currentPage + 1, true);
    }
  };

  const filteredProperties = useMemo(() => {
    let list = properties;

    if (!useFallback) {
      list = applyBedroomFilter(list, selectedBedrooms);
      list = list.filter((property) => matchesListingFilter(property, listingFilter));
      list = list.filter((property) =>
        matchesExplorePriceRange(property, selectedPriceRange, listingFilter),
      );
    }

    return sortExploreProperties(list, sort);
  }, [
    properties,
    useFallback,
    selectedBedrooms,
    listingFilter,
    selectedPriceRange,
    sort,
  ]);

  const exploreCards = useMemo(
    () => filteredProperties.map((property, index) => mapPropertyToExploreCard(property, index)),
    [filteredProperties],
  );

  const filterChips = useMemo(
    () =>
      buildExploreFilterChips({
        searchQuery,
        selectedLocation,
        selectedCategory,
        selectedBedrooms,
        selectedPriceRange,
        listingFilter,
        locations,
        categories,
      }),
    [
      searchQuery,
      selectedLocation,
      selectedCategory,
      selectedBedrooms,
      selectedPriceRange,
      listingFilter,
      locations,
      categories,
    ],
  );

  const heroTitleLines = heroTitle.split('\n');

  if (!clientReady) {
    return <ExploreLoadingShell />;
  }

  return (
    <div className="pm-explore-page">
      <section className="pm-explore-hero">
        <div className="pm-explore-hero__inner">
          <ExplorePageHeader />

          <span className="urban-section-kicker pm-explore-hero__kicker">{heroKicker}</span>
          <h1 className="pm-explore-hero__title">
            {heroTitleLines.map((line, index) => (
              <React.Fragment key={index}>
                {line.includes(heroHighlight) ? (
                  <>
                    {line.split(heroHighlight).map((part, partIndex, parts) => (
                      <React.Fragment key={partIndex}>
                        {part}
                        {partIndex < parts.length - 1 && (
                          <span className="pm-explore-hero__highlight">{heroHighlight}</span>
                        )}
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  line
                )}
                {index < heroTitleLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <p className="pm-explore-hero__description">{heroDescription}</p>

          <form
            className="pm-explore-search"
            onSubmit={(event) => {
              event.preventDefault();
              handleRefineSearch();
            }}
          >
            <div className="pm-explore-search__field">
              <span className="pm-explore-search__icon" aria-hidden="true">
                ⌕
              </span>
              <input
                type="search"
                className="pm-explore-search__input"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                aria-label="Search properties"
              />
            </div>
            <button type="submit" className="urban-btn-primary pm-explore-search__btn">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="pm-explore-layout">
        <ExploreFilters
          categories={categories}
          locations={locations}
          selectedLocation={selectedLocation}
          selectedCategory={selectedCategory}
          selectedBedrooms={selectedBedrooms}
          selectedPriceRange={selectedPriceRange}
          listingFilter={listingFilter}
          mobileOpen={mobileFiltersOpen}
          onMobileClose={() => setMobileFiltersOpen(false)}
          onLocationChange={setSelectedLocation}
          onCategoryChange={setSelectedCategory}
          onBedroomsChange={setSelectedBedrooms}
          onPriceRangeChange={setSelectedPriceRange}
          onListingFilterChange={setListingFilter}
          onRefine={handleRefineSearch}
          onClear={handleClearFilters}
        />

        <div className="pm-explore-results">
          {apiError && useFallback && <CatalogRegistryAlert variant="demo" error={apiError} />}
          {apiError && !useFallback && (
            <CatalogRegistryAlert variant="production" error={apiError} />
          )}

          <ExploreResultsToolbar
            resultCount={filteredProperties.length}
            loading={loading}
            sort={sort}
            chips={filterChips}
            onSortChange={setSort}
            onClearFilters={handleClearFilters}
            onRemoveChip={handleRemoveChip}
            onOpenFilters={() => setMobileFiltersOpen(true)}
          />

          <ExplorePropertyGrid items={exploreCards} loading={loading} />

          {!useFallback && currentPage < lastPage && !loading && (
            <div className="pm-load-more">
              <button
                type="button"
                className="urban-btn-secondary pm-explore-load-more"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading more...' : 'Load more properties'}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
