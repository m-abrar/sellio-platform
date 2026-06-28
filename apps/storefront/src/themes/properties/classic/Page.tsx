
'use client';
import React, { useEffect, useState } from 'react';
import { EstateCard, FilterSidebar } from './components';
import { DynamicTestimonials } from '@/components/testimonials/DynamicTestimonials';
import { useThemeContent, useThemeMedia, useThemeConfig } from '@/components/theme-content/ThemeContentProvider';
import type { Property, Category, Location } from '@sellio/types';
import {
  applyBedroomFilter,
  fetchPropertyCatalogPage,
  resolveCatalogFailure,
  type PropertyCatalogFilters,
} from './catalog';
import { CatalogRegistryAlert } from './components/CatalogRegistryAlert';
import { useClassicThemeLink } from './hooks/useClassicThemeLink';
import { useDemoFallbackAllowed } from './hooks/useDemoFallbackAllowed';

export default function Page() {
  const themeLink = useClassicThemeLink();
  const allowDemoCatalog = useDemoFallbackAllowed();
  const heroEyebrow = useThemeContent('hero.eyebrow', 'Global Registry // Vol. 2026');
  const heroTitle = useThemeContent('hero.title', 'The Heritage\nRegistry.');
  const heroDescription = useThemeContent(
    'hero.description',
    "A curated collection of the world's most distinguished historic properties. Every estate is verified for architectural provenance and heritage integrity.",
  );
  const heroImage = useThemeMedia('hero.image', '/themes/properties/classic/7.webp');
  const heroCtaLabel = useThemeContent('hero.primary_cta_label', 'DISCOVER');
  const collectionHeading = useThemeContent('collection.heading', 'The Collection.');
  const collectionDescription = useThemeContent(
    'collection.description',
    'The collection includes historic estates with verified architectural provenance and heritage significance.',
  );
  const collectionIssueLabel = useThemeContent('collection.issue_label', 'The Collection // 01');
  const loadMoreLabel = useThemeContent('collection.load_more_label', 'LOAD MORE ESTATES');
  const loadingLabel = useThemeContent('collection.loading_label', 'Loading...');
  const testimonialsEyebrow = useThemeContent('testimonials.eyebrow', 'Patron Feedback');
  const testimonialsTitle = useThemeContent('testimonials.title', 'Voices of Trust.');
  const showTestimonials = useThemeConfig('show_testimonials', true);
  const [estates, setEstates] = useState<Property[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | number>('');
  const [selectedCategory, setSelectedCategory] = useState<string | number>('');
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const catalogFilters = (): PropertyCatalogFilters => ({
    searchQuery,
    selectedCategory,
    selectedLocation,
    selectedBedrooms,
    selectedPriceRange,
  });

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

  // Perform initial search
  useEffect(() => {
    fetchProperties(1, false);
  }, []);

  const handleRefineSearch = () => {
    fetchProperties(1, false);
  };

  const handleLoadMore = () => {
    if (useFallback) return; // Fallbacks loaded all at once
    if (currentPage < lastPage) {
      fetchProperties(currentPage + 1, true);
    }
  };

  const displayEstates = useFallback
    ? estates
    : applyBedroomFilter(estates, selectedBedrooms);

  return (
    <div className="pc-container-base">
      {/* Cinematic Parallax Hero */}
      <section className="pc-hero">
        <div className="pc-hero-bg">
          <img src={heroImage} alt="" />
        </div>
        
        <div className="pc-hero-card">
          <div className="pc-caps pc-hero-eyebrow">{heroEyebrow}</div>
          <h1 className="pc-hero-title">
            {heroTitle.split('\n').map((line, index) => (
              <React.Fragment key={`${line}-${index}`}>
                {index > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </h1>
          <p className="pc-hero-desc">
            {heroDescription}
          </p>
          
          <div className="pc-search-bar-frame">
            <div className="pc-search-bar">
              <div className="pc-search-inner">
                <span className="pc-caps pc-search-kicker">SEARCH</span>
                <input
                  type="text"
                  className="pc-search-input"
                  placeholder="By Region, Era..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleRefineSearch(); }}
                />
              </div>
              <button type="button" className="pc-btn-primary" onClick={handleRefineSearch}>
                {heroCtaLabel}
              </button>
            </div>
          </div>
          <a href={themeLink('/explore')} className="pc-caps pc-hero-catalogue-link">
            VIEW FULL CATALOGUE →
          </a>
        </div>
      </section>

      {/* Orchestrated Collection Grid */}
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
            <div className="pc-section-header">
                <div>
                    <div className="pc-caps pc-section-eyebrow">
                      {useFallback ? 'Sample Properties // Preview' : collectionIssueLabel}
                    </div>
                    <h2 className="pc-serif pc-section-title">
                        {collectionHeading}
                    </h2>
                </div>
                <p className="pc-collection-desc">
                    {collectionDescription}
                </p>
            </div>

            {apiError && useFallback && (
              <CatalogRegistryAlert variant="demo" error={apiError} />
            )}
            {apiError && !useFallback && (
              <CatalogRegistryAlert variant="production" error={apiError} />
            )}

            {loading && displayEstates.length === 0 ? (
              <div className="pc-estate-grid-skeleton">
                <div className="pc-skeleton-card" />
                <div className="pc-skeleton-card" />
              </div>
            ) : displayEstates.length > 0 ? (
              <div className="pc-estate-grid">
                {displayEstates.map((property) => (
                  <EstateCard 
                    key={property.id} 
                    property={property} 
                  />
                ))}
              </div>
            ) : (
              <div className="pc-empty-state">
                <h4 className="pc-serif">No Properties Found</h4>
                <p>No heritage estates match the current filters. Try adjusting your search criteria.</p>
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
                      {loadingMore ? loadingLabel : loadMoreLabel}
                  </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="pc-divider" />

      {showTestimonials && (
        <DynamicTestimonials
          eyebrow={testimonialsEyebrow}
          title={testimonialsTitle}
          limit={3}
          variant="editorial"
          sectionClassName="pc-section pc-section--testimonials"
          titleWrapClassName="pc-testimonials-heading"
          titleClassName="pc-serif pc-testimonials-title"
          layoutClassName="pc-testimonials-grid"
          headingId="pc-testimonials-title"
        />
      )}
    </div>
  );
}
