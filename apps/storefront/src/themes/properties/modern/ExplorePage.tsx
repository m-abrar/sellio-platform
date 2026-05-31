'use client';

import React, { useEffect, useState } from 'react';
import type { Property, Category, Location } from '@sellio/types';
import { useSearchParams, useRouter } from 'next/navigation';
import { ExploreFilters, CatalogRegistryAlert } from './components';
import { StructureGrid } from './components/StructureGrid';
import {
  applyBedroomFilter,
  fetchPropertyCatalogPage,
  resolveCatalogFailure,
  resolveCategoryIdBySlug,
  type PropertyCatalogFilters,
} from './catalog';
import { useDemoFallbackAllowed } from './hooks/useDemoFallbackAllowed';
import { mapPropertyToStructure } from './property-utils';

interface ExplorePageProps {
  initialCategorySlug?: string;
}

export default function ExplorePage({ initialCategorySlug }: ExplorePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const allowDemoCatalog = useDemoFallbackAllowed();

  const initialSearch = searchParams.get('q') || '';
  const initialLoc = searchParams.get('loc') || '';
  const initialCat = searchParams.get('cat') || '';
  const initialBeds = searchParams.get('beds') || '';
  const initialPrice = searchParams.get('price') || '';

  const [properties, setProperties] = useState<Property[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedLocation, setSelectedLocation] = useState<string | number>(initialLoc);
  const [selectedCategory, setSelectedCategory] = useState<string | number>(initialCat);
  const [selectedBedrooms, setSelectedBedrooms] = useState(initialBeds);
  const [selectedPriceRange, setSelectedPriceRange] = useState(initialPrice);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

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
      router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
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
    fetchProperties(1, false);
    updateUrlParams(
      searchQuery,
      selectedLocation,
      selectedCategory,
      selectedBedrooms,
      selectedPriceRange,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation, selectedCategory, selectedBedrooms, selectedPriceRange]);

  const handleRefineSearch = () => {
    fetchProperties(1, false);
    updateUrlParams(
      searchQuery,
      selectedLocation,
      selectedCategory,
      selectedBedrooms,
      selectedPriceRange,
    );
  };

  const handleLoadMore = () => {
    if (useFallback) return;
    if (currentPage < lastPage) {
      fetchProperties(currentPage + 1, true);
    }
  };

  const displayProperties = useFallback
    ? properties
    : applyBedroomFilter(properties, selectedBedrooms);

  const structureItems = displayProperties.map(mapPropertyToStructure);

  return (
    <div className="pm-explore-page">
      <section className="pm-explore-hero">
        <span className="urban-hero-kicker">Property search</span>
        <h1>
          Find your next <span>home.</span>
        </h1>
        <form
          className="pm-explore-search"
          onSubmit={(event) => {
            event.preventDefault();
            handleRefineSearch();
          }}
        >
          <input
            type="search"
            className="pm-explore-search__input"
            placeholder="Search by city, neighborhood, or keyword..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <button type="submit" className="urban-btn-primary">
            Search properties
          </button>
        </form>
      </section>

      <section className="pm-explore-layout">
        <ExploreFilters
          categories={categories}
          locations={locations}
          selectedLocation={selectedLocation}
          selectedCategory={selectedCategory}
          selectedBedrooms={selectedBedrooms}
          selectedPriceRange={selectedPriceRange}
          onLocationChange={setSelectedLocation}
          onCategoryChange={setSelectedCategory}
          onBedroomsChange={setSelectedBedrooms}
          onPriceRangeChange={setSelectedPriceRange}
          onRefine={handleRefineSearch}
        />

        <div className="pm-explore-results">
          {apiError && useFallback && <CatalogRegistryAlert variant="demo" error={apiError} />}
          {apiError && !useFallback && (
            <CatalogRegistryAlert variant="production" error={apiError} />
          )}

          <StructureGrid items={structureItems} loading={loading} error={null} showExploreLink={false} />

          {!useFallback && currentPage < lastPage && (
            <div className="pm-load-more">
              <button
                type="button"
                className="urban-btn-secondary"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading...' : 'Load more properties'}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
