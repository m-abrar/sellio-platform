'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Property, Category, Location } from '@sellio/types';
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
} from './components/explore';
import {
  applyBedroomFilter,
  fetchPropertyCatalogPage,
  resolveCatalogFailure,
  resolveCategoryIdBySlug,
  filterRentalProperties,
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
import { mapPropertyToLeaseCard } from './property-utils';

interface ExplorePageProps {
  initialCategorySlug?: string;
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

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const skipDebounceRef = useRef(false);
  const isInitialFetchRef = useRef(true);

  const heroKicker = useThemeContent('explore.kicker', 'Search rentals');
  const heroTitle = useThemeContent('explore.title', 'Every listing shows \nmonthly rent upfront.');
  const heroHighlight = useThemeContent('explore.highlight', 'monthly rent');
  const heroDescription = useThemeContent(
    'explore.description',
    'Narrow results by city, price, bedrooms, and property type. Each card shows the true monthly lease price.',
  );
  const searchPlaceholder = useThemeContent(
    'explore.search_placeholder',
    'City, neighborhood, or building name…',
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
  }, [clientReady, searchParamsKey, searchParams]);

  useEffect(() => {
    if (!clientReady) return;
    document.body.classList.toggle('pr-explore-filters-open', mobileFiltersOpen);
    return () => document.body.classList.remove('pr-explore-filters-open');
  }, [clientReady, mobileFiltersOpen]);

  const catalogFilters = (): PropertyCatalogFilters => ({
    searchQuery,
    selectedCategory,
    selectedLocation,
    selectedBedrooms,
    selectedPriceRange,
  });

  const updateUrlParams = (
    query: string,
    loc: string | number,
    cat: string | number,
    beds: string,
    price: string,
  ) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (loc) params.set('loc', String(loc));
    if (cat) params.set('cat', String(cat));
    if (beds) params.set('beds', beds);
    if (price) params.set('price', price);

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
      const rentals = filterRentalProperties(result.data);
      if (isLoadMore) {
        setProperties((prev) => [...prev, ...rentals]);
      } else {
        setProperties(rentals);
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
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedLocation('');
    setSelectedCategory('');
    setSelectedBedrooms('');
    setSelectedPriceRange('');
    setMobileFiltersOpen(false);
  };

  const handleRemoveChip = (chipId: string) => {
    switch (chipId) {
      case 'q':
        setSearchQuery('');
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
      list = list.filter((property) =>
        matchesExplorePriceRange(property, selectedPriceRange),
      );
    }

    return sortExploreProperties(list, sort);
  }, [properties, useFallback, selectedBedrooms, selectedPriceRange, sort]);

  const exploreCards = useMemo(
    () => filteredProperties.map((property, index) => mapPropertyToLeaseCard(property, index)),
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
        locations,
        categories,
      }),
    [
      searchQuery,
      selectedLocation,
      selectedCategory,
      selectedBedrooms,
      selectedPriceRange,
      locations,
      categories,
    ],
  );

  const heroTitleLines = heroTitle.split('\n');

  if (!clientReady) {
    return <ExploreLoadingShell />;
  }

  return (
    <div className="pr-explore-page">
      <section className="pr-explore-hero">
        <div className="pr-explore-hero__inner">
          <ExplorePageHeader />

          <span className="pr-mono pr-explore-hero__kicker">{heroKicker}</span>
          <h1 className="pr-explore-hero__title">
            {heroTitleLines.map((line, index) => (
              <React.Fragment key={index}>
                {line.includes(heroHighlight) ? (
                  <>
                    {line.split(heroHighlight).map((part, partIndex, parts) => (
                      <React.Fragment key={partIndex}>
                        {part}
                        {partIndex < parts.length - 1 && (
                          <span className="pr-explore-hero__highlight">{heroHighlight}</span>
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
          <p className="pr-explore-hero__description">{heroDescription}</p>

          <form
            className="pr-explore-search"
            onSubmit={(event) => {
              event.preventDefault();
              handleRefineSearch();
            }}
          >
            <div className="pr-explore-search__field">
              <span className="pr-explore-search__icon" aria-hidden="true">
                ⌕
              </span>
              <input
                type="search"
                className="pr-explore-search__input"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                aria-label="Search rentals"
              />
            </div>
            <button type="submit" className="pr-btn-primary pr-explore-search__btn">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="pr-explore-layout">
        <ExploreFilters
          categories={categories}
          locations={locations}
          selectedLocation={selectedLocation}
          selectedCategory={selectedCategory}
          selectedBedrooms={selectedBedrooms}
          selectedPriceRange={selectedPriceRange}
          mobileOpen={mobileFiltersOpen}
          onMobileClose={() => setMobileFiltersOpen(false)}
          onLocationChange={setSelectedLocation}
          onCategoryChange={setSelectedCategory}
          onBedroomsChange={setSelectedBedrooms}
          onPriceRangeChange={setSelectedPriceRange}
          onRefine={handleRefineSearch}
          onClear={handleClearFilters}
        />

        <div className="pr-explore-results">
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
            <div className="pr-explore-load-more-wrap">
              <button
                type="button"
                className="pr-explore-load-more"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading more...' : 'Load more rentals'}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
