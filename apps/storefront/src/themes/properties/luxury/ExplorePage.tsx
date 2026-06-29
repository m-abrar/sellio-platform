'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { api } from '@/lib/api-client';
import type { Property, Category, Location } from '@/types';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { LUXURY_FALLBACK_ESTATES, FALLBACK_CATEGORIES, FALLBACK_LOCATIONS } from './fallback-data';

interface EstateCardProps {
  title: string;
  price: string;
  location: string;
  tag: string;
  image: string;
  slug: string;
}

const EstateCard = ({ title, price, location, tag, image, slug }: EstateCardProps) => {
  const themeLink = usePropertyThemeLink();
  return (
    <a href={themeLink(`/product/${slug}`)} className="estate-card-premium estate-card-link">
      <div className="estate-card-img-overflow">
        <img src={image} alt={title} className="estate-card-img" loading="lazy" />
      </div>
      <div className="estate-card-info">
        <span className="estate-card-tag">{tag}</span>
        <h3 className="estate-card-title">{title}</h3>
        <div className="estate-card-meta">
          <span className="estate-card-price">{price}</span>
          <span className="estate-card-location">{location.toUpperCase()}</span>
        </div>
      </div>
    </a>
  );
};

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const headerEyebrow = useThemeContent('explore.eyebrow', 'Portfolio Directory');
  const headerTitle = useThemeContent('explore.title', 'The Collection.');
  const headerDescription = useThemeContent('explore.description', 'Browse and filter premier estates from our verified global portfolio.');
  const loadMoreLabel = useThemeContent('explore.load_more_label', 'Load More');
  const loadingLabel = useThemeContent('explore.loading_label', 'Loading...');

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

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedLocation, setSelectedLocation] = useState<string | number>(initialLoc);
  const [selectedCategory, setSelectedCategory] = useState<string | number>(initialCat);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>(initialBeds);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>(initialPrice);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const updateUrlParams = (
    query: string, loc: string | number, cat: string | number, beds: string, price: string,
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

  const triggerFallback = (isLoadMore: boolean) => {
    setCategories(FALLBACK_CATEGORIES);
    setLocations(FALLBACK_LOCATIONS);

    let filtered = [...LUXURY_FALLBACK_ESTATES];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    }
    if (selectedCategory) filtered = filtered.filter((e) => e.category_id === Number(selectedCategory));
    if (selectedLocation) filtered = filtered.filter((e) => e.location_id === Number(selectedLocation));
    if (selectedBedrooms) filtered = filtered.filter((e) => e.number_of_bedrooms >= Number(selectedBedrooms));
    if (selectedPriceRange) {
      filtered = filtered.filter((e) => {
        const val = Number(e.pricing?.base_price || e.base_price);
        if (selectedPriceRange === '1m-5m') return val >= 1000000 && val <= 5000000;
        if (selectedPriceRange === '5m-10m') return val >= 5000000 && val <= 10000000;
        if (selectedPriceRange === '10m-plus') return val >= 10000000;
        return true;
      });
    }

    if (isLoadMore) {
      setEstates((prev) => [...prev, ...filtered]);
    } else {
      setEstates(filtered);
    }
    setCurrentPage(1);
    setLastPage(1);
  };

  const fetchProperties = async (pageToFetch = 1, isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const params: Record<string, unknown> = { page: pageToFetch, per_page: 6 };
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory) params.category_id = selectedCategory;
      if (selectedLocation) params.location = selectedLocation;
      if (selectedPriceRange) {
        params.property_type = 'sale';
        if (selectedPriceRange === '1m-5m') { params.min_price = 1000000; params.max_price = 5000000; }
        else if (selectedPriceRange === '5m-10m') { params.min_price = 5000000; params.max_price = 10000000; }
        else if (selectedPriceRange === '10m-plus') { params.min_price = 10000000; }
      }

      const response = await api.getProperties(params);
      if (response?.data?.length > 0) {
        if (isLoadMore) setEstates((prev) => [...prev, ...response.data]);
        else setEstates(response.data);

        if (response.sidebar) {
          setCategories(response.sidebar.categories || []);
          setLocations(response.sidebar.locations || []);
        }
        if (response.meta) {
          setCurrentPage(response.meta.current_page);
          setLastPage(response.meta.last_page);
        }
      } else {
        triggerFallback(isLoadMore);
      }
    } catch {
      triggerFallback(isLoadMore);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProperties(1, false);
    updateUrlParams(searchQuery, selectedLocation, selectedCategory, selectedBedrooms, selectedPriceRange);
  }, [searchQuery, selectedLocation, selectedCategory, selectedBedrooms, selectedPriceRange]);

  const handleLoadMore = () => {
    if (currentPage < lastPage) fetchProperties(currentPage + 1, true);
  };

  return (
    <div className="luxury-premium-wrapper pl-explore-page">

      <div className="pl-explore-header">
        <span className="showcase-eyebrow">{headerEyebrow}</span>
        <h1 className="pl-explore-title">{headerTitle}</h1>
        <p className="pl-explore-description">{headerDescription}</p>
      </div>

      <div className="luxury-filter-bar">
        <input
          type="text"
          placeholder="Search estates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="luxury-filter-input"
          aria-label="Search estates"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="luxury-filter-select"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="luxury-filter-select"
          aria-label="Filter by location"
        >
          <option value="">All Locations</option>
          {locations.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
        </select>
        <select
          value={selectedBedrooms}
          onChange={(e) => setSelectedBedrooms(e.target.value)}
          className="luxury-filter-select"
          aria-label="Minimum bedrooms"
        >
          <option value="">Min. Bedrooms</option>
          <option value="2">2+ Beds</option>
          <option value="4">4+ Beds</option>
          <option value="6">6+ Beds</option>
          <option value="8">8+ Beds</option>
        </select>
        <select
          value={selectedPriceRange}
          onChange={(e) => setSelectedPriceRange(e.target.value)}
          className="luxury-filter-select"
          aria-label="Price range"
        >
          <option value="">Price Range</option>
          <option value="1m-5m">$1M – $5M</option>
          <option value="5m-10m">$5M – $10M</option>
          <option value="10m-plus">$10M+</option>
        </select>
      </div>

      {loading && estates.length === 0 ? (
        <div className="showcase-grid pl-explore-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="estate-card-premium showcase-skeleton-card">
              <div className="showcase-skeleton-img" />
              <div className="estate-card-info">
                <div className="showcase-skeleton-tag" />
                <div className="showcase-skeleton-title" />
                <div className="estate-card-meta">
                  <div className="showcase-skeleton-price" />
                  <div className="showcase-skeleton-loc" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : estates.length === 0 ? (
        <div className="pl-explore-empty">
          <span className="pl-explore-empty-icon" aria-hidden="true">✦</span>
          <h3 className="pl-explore-empty-title">No properties found.</h3>
          <p className="pl-explore-empty-body">Try adjusting your filters or clearing your search.</p>
        </div>
      ) : (
        <>
          <div className="showcase-grid pl-explore-grid">
            {estates.map((prop, i) => {
              const price = prop.pricing?.price_formatted || (prop.base_price ? `$${Number(prop.base_price).toLocaleString()}` : '');
              const loc = prop.location?.title || prop.city || 'Exclusive Location';
              const tag = prop.is_featured ? 'FEATURED' : 'SIGNATURE';
              const image = prop.featured_image || prop.primary_image_url || '/themes/properties/luxury/3.webp';
              return (
                <EstateCard
                  key={prop.id || i}
                  title={prop.title}
                  price={price}
                  location={loc}
                  tag={tag}
                  image={image}
                  slug={prop.slug}
                />
              );
            })}
          </div>

          {currentPage < lastPage && (
            <div className="pl-load-more-wrap">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="luxury-btn-outline"
              >
                {loadingMore ? loadingLabel : loadMoreLabel}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="pl-suspense-loading">Loading Ledger...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
