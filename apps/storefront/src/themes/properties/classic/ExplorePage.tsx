'use client';
import React, { useEffect, useState } from 'react';
import type { Property, Category, Location } from '@sellio/types';
import { EstateCard, FilterSidebar } from './components';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  applyBedroomFilter,
  fetchPropertyCatalogPage,
  resolveCatalogFailure,
  resolveCategoryIdBySlug,
  type PropertyCatalogFilters,
} from './catalog';
import { CatalogRegistryAlert } from './components/CatalogRegistryAlert';
import { useDemoFallbackAllowed } from './hooks/useDemoFallbackAllowed';

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

  const [estates, setEstates] = useState<Property[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedLocation, setSelectedLocation] = useState<string | number>(initialLoc);
  const [selectedCategory, setSelectedCategory] = useState<string | number>(initialCat);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>(initialBeds);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>(initialPrice);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    if (!initialCategorySlug) return;

    const categoryId = resolveCategoryIdBySlug(initialCategorySlug, categories, allowDemoCatalog);

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
      const pathname = window.location.pathname;
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  const fetchProperties = async (pageToFetch = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    const result = await fetchPropertyCatalogPage(pageToFetch, catalogFilters());

    if (result.ok) {
      if (isLoadMore) {
        setEstates((prev) => [...prev, ...result.data]);
      } else {
        setEstates(result.data);
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
        setEstates((prev) => [...prev, ...resolution.estates]);
      } else {
        setEstates(resolution.estates);
      }
      setCurrentPage(1);
      setLastPage(1);
      return;
    }

    setUseFallback(false);
    setCategories([]);
    setLocations([]);
    if (!isLoadMore) {
      setEstates([]);
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

  const displayEstates = useFallback
    ? estates
    : applyBedroomFilter(estates, selectedBedrooms);

  return (
    <div className="pc-container-base pc-page-shell" style={{ background: 'var(--pc-bone)', minHeight: '100vh' }}>
      
      <section className="pc-section pc-section--compact">
        <div className="pc-page-header">
          <div>
            <div className="pc-caps pc-section-eyebrow" style={{ color: 'var(--pc-teal)', opacity: 0.4 }}>Global Provenance Catalog</div>
            <h1 className="pc-serif" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 900, letterSpacing: '-2px', color: 'var(--pc-teal)' }}>
              The <span className="pc-italic" style={{ fontWeight: 400 }}>Catalogue.</span>
            </h1>
          </div>
          <div style={{ maxWidth: '400px', width: '100%' }}>
            <div className="pc-search-bar-frame">
              <div className="pc-search-bar pc-search-bar--compact">
                <div className="pc-search-inner">
                  <input
                    type="text"
                    className="pc-search-input"
                    placeholder="Filter region, manor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleRefineSearch(); }}
                  />
                </div>
                <button type="button" className="pc-btn-primary" onClick={handleRefineSearch}>
                  FIND
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pc-section pc-section--listing">
        <div className="pc-main-grid">
          <FilterSidebar
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

          <div className="pc-listing-column">
            {apiError && useFallback && <CatalogRegistryAlert variant="demo" error={apiError} />}
            {apiError && !useFallback && <CatalogRegistryAlert variant="production" error={apiError} />}

            {loading && displayEstates.length === 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem' }} className="pc-estate-grid-skeleton">
                <style dangerouslySetInnerHTML={{ __html: `
                  .pc-skeleton-card {
                    background: var(--pc-white);
                    border: 1px solid var(--pc-border);
                    height: 550px;
                    opacity: 0.6;
                    animation: pcPulse 1.5s infinite ease-in-out;
                  }
                  @keyframes pcPulse {
                    0% { opacity: 0.4; }
                    50% { opacity: 0.8; }
                    100% { opacity: 0.4; }
                  }
                  @media (min-width: 992px) {
                    .pc-estate-grid-skeleton { grid-template-columns: repeat(2, 1fr) !important; }
                  }
                ` }} />
                <div className="pc-skeleton-card" />
                <div className="pc-skeleton-card" />
              </div>
            ) : displayEstates.length > 0 ? (
              <div>
                <div className="pc-section-header pc-results-meta" style={{ alignItems: 'center', fontSize: '0.8rem', color: 'var(--pc-text-muted)' }}>
                  <div className="pc-caps" style={{ opacity: 0.5 }}>
                    {displayEstates.length} Listing{displayEstates.length !== 1 ? 's' : ''} Cataloged
                  </div>
                  <div style={{ fontWeight: 800 }}>SORT: PROVENANCE DEFAULT</div>
                </div>

                <div className="pc-estate-grid">
                  {displayEstates.map((property) => (
                    <EstateCard
                      key={property.id}
                      property={property}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="pc-empty-state" style={{ border: '1px dashed var(--pc-border)', background: 'var(--pc-white)' }}>
                <h4 className="pc-serif" style={{ fontSize: '2rem', color: 'var(--pc-teal)' }}>No Listings Located</h4>
                <p style={{ color: 'var(--pc-text-muted)', fontSize: '1rem' }}>
                  Adjust your search guidelines or filter specifications to locate available estates.
                </p>
              </div>
            )}

            {!useFallback && currentPage < lastPage && (
              <div className="pc-load-more">
                <button
                  type="button"
                  className="pc-btn-outline"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'LOCATING ARCHIVES...' : 'LOAD MORE ESTATES'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
