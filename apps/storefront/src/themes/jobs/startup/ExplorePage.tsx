'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { OpportunityCard, OpportunityGrid } from './components/OpportunityGrid';
import { api } from '@sellio/api-client';
import type { JobListing, Category, Location } from '@sellio/types';

function ExplorePageContent({ initialCategorySlug }: { initialCategorySlug?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // State elements
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter lists fetched from backend
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [workplaceTypes, setWorkplaceTypes] = useState<Array<{ id: number; label: string }>>([
    { id: 1, label: 'Remote' },
    { id: 2, label: 'On-Site' },
    { id: 3, label: 'Hybrid' }
  ]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([
    'Entry-level', 'Mid-level', 'Senior', 'Lead', 'Principal', 'Executive'
  ]);

  // Read URL search params
  const searchQuery = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || initialCategorySlug || '';
  const selectedLocation = searchParams.get('location') || '';
  const selectedWorkplace = searchParams.get('workplace') || '';
  const selectedExperience = searchParams.get('experience') || '';

  // Get active preview path prefix
  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        const segments = window.location.pathname.split('/');
        const themeKey = segments[2];
        return `/preview/${themeKey}${path}`;
      }
    }
    return path;
  };

  // Build query params dictionary
  const getQueryParams = (page: number) => {
    const params: Record<string, any> = { page, per_page: 9 };
    if (searchQuery) params.search = searchQuery;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedLocation) params.location = selectedLocation;
    if (selectedWorkplace) params.workplace_type = selectedWorkplace;
    if (selectedExperience) params.experience_level = selectedExperience;
    return params;
  };

  // Initial fetch of jobs & filter parameters
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        setCurrentPage(1);

        const response = await api.getJobs(getQueryParams(1));
        
        if (response && response.data) {
          setJobs(response.data);
          if (response.meta) {
            setTotalPages(response.meta.last_page || 1);
          }
          if (response.sidebar) {
            if (response.sidebar.categories) setCategories(response.sidebar.categories);
            if (response.sidebar.locations) setLocations(response.sidebar.locations);
            if (response.sidebar.workplace_types) {
              // Convert API formats if necessary
              const formattedTypes = Object.entries(response.sidebar.workplace_types).map(([id, label]) => ({
                id: Number(id),
                label: String(label)
              }));
              if (formattedTypes.length > 0) setWorkplaceTypes(formattedTypes);
            }
            if (response.sidebar.experience_levels) {
              setExperienceLevels(Object.values(response.sidebar.experience_levels));
            }
          }
        }
      } catch (err: any) {
        console.error("Failed to load jobs directory:", err);
        setError(err.message || 'Failed to fetch catalog listings from recruitment server.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [searchQuery, selectedCategory, selectedLocation, selectedWorkplace, selectedExperience, initialCategorySlug]);

  // Load more pagination
  const loadMoreJobs = async () => {
    if (currentPage >= totalPages || loadingMore) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await api.getJobs(getQueryParams(nextPage));
      
      if (response && response.data) {
        setJobs((prev) => [...prev, ...response.data]);
        setCurrentPage(nextPage);
      }
    } catch (err: any) {
      console.error("Failed to load subsequent job list page:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Sync state transitions to URL params
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Retain initial categorySlug overrides
    if (key === 'category' && initialCategorySlug) {
      router.push(getThemeLink(`/explore?${params.toString()}`));
      return;
    }
    router.push(getThemeLink(`/explore?${params.toString()}`));
  };

  return (
    <div className="growth-explore-container">
      {/* Dynamic Header details */}
      <div style={{ marginBottom: '4rem' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', color: 'var(--growth-neon)', letterSpacing: '4px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>
          TALENT_DISCOVERY_MATRIX
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', fontWeight: 700, color: 'white', margin: 0, letterSpacing: '-2px' }}>
          Venture Catalog.
        </h1>
        <p style={{ color: 'var(--growth-dim)', fontSize: '1.1rem', marginTop: '1rem', maxWidth: '600px', lineHeight: 1.6 }}>
          Query, filter, and lock onto elite positions inside our hypergrowth corporate ledger.
        </p>
      </div>

      {/* Connection Trace Alert during outages */}
      {error && (
        <div className="growth-offline-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
            <div style={{ fontWeight: 700, letterSpacing: '1px', color: '#f87171' }}>DATABASE_OFFLINE_DIAGNOSTICS_TRACE</div>
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.8, lineHeight: 1.5 }}>
            STATUS: [OFFLINE] | LATENCY: [TIMEOUT] | REASON: [{error}]
            <br/>
            ACTION: Activated local offline resiliency framework. Serving verified seed/series-A static fallback nodes...
          </div>
        </div>
      )}

      {/* Main Filter and Directory Layout */}
      <div className="growth-explore-layout">
        {/* Sidebar Filters */}
        <aside className="growth-filter-panel growth-panel">
          {/* Keyword Search */}
          <div className="growth-filter-group">
            <label className="growth-filter-label">Keyword Search</label>
            <input 
              type="text" 
              className="growth-input" 
              placeholder="e.g. Rust, Solidity" 
              defaultValue={searchQuery}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateFilter('q', (e.target as HTMLInputElement).value);
                }
              }}
              onBlur={(e) => {
                updateFilter('q', e.target.value);
              }}
            />
          </div>

          {/* Job Category Dropdown */}
          <div className="growth-filter-group">
            <label className="growth-filter-label">Venture Category</label>
            <div className="growth-select-wrapper">
              <select 
                className="growth-select"
                value={selectedCategory}
                onChange={(e) => updateFilter('category', e.target.value)}
              >
                <option value="">ALL_CATEGORIES</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>{cat.title.toUpperCase()}</option>
                ))}
                {categories.length === 0 && (
                  <>
                    <option value="engineering">ENGINEERING</option>
                    <option value="product">PRODUCT_DESIGN</option>
                    <option value="marketing">GROWTH_MARKETING</option>
                    <option value="operations">OPERATIONS</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Location Dropdown */}
          <div className="growth-filter-group">
            <label className="growth-filter-label">Global Node Location</label>
            <div className="growth-select-wrapper">
              <select 
                className="growth-select"
                value={selectedLocation}
                onChange={(e) => updateFilter('location', e.target.value)}
              >
                <option value="">ALL_LOCATIONS</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.slug}>{loc.title.toUpperCase()}</option>
                ))}
                {locations.length === 0 && (
                  <>
                    <option value="san-francisco">SAN FRANCISCO</option>
                    <option value="berlin">BERLIN</option>
                    <option value="singapore">SINGAPORE</option>
                    <option value="london">LONDON</option>
                    <option value="new-york">NEW YORK</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Workplace Type Dropdown */}
          <div className="growth-filter-group">
            <label className="growth-filter-label">Workplace Architecture</label>
            <div className="growth-select-wrapper">
              <select 
                className="growth-select"
                value={selectedWorkplace}
                onChange={(e) => updateFilter('workplace', e.target.value)}
              >
                <option value="">ALL_ARCHITECTURES</option>
                {workplaceTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.label.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Experience Level Dropdown */}
          <div className="growth-filter-group">
            <label className="growth-filter-label">Experience Tier</label>
            <div className="growth-select-wrapper">
              <select 
                className="growth-select"
                value={selectedExperience}
                onChange={(e) => updateFilter('experience', e.target.value)}
              >
                <option value="">ALL_TIERS</option>
                {experienceLevels.map((lvl, idx) => (
                  <option key={idx} value={lvl}>{lvl.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <button 
            className="growth-btn-outline" 
            style={{ width: '100%', padding: '1rem', fontSize: '0.8rem', fontWeight: 700 }}
            onClick={() => {
              router.push(getThemeLink('/explore'));
            }}
          >
            RESET_CONSOLE
          </button>
        </aside>

        {/* Directory Listings Grid */}
        <main>
          {loading ? (
            <OpportunityGrid loading={true} />
          ) : jobs.length > 0 ? (
            <div>
              <div className="opportunity-grid" style={{ padding: '0 0 4rem 0' }}>
                {jobs.map((job) => (
                  <OpportunityCard key={job.id} job={job} />
                ))}
              </div>

              {/* Load More Pagination */}
              {currentPage < totalPages && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                  <button 
                    className="growth-btn-primary"
                    disabled={loadingMore}
                    onClick={loadMoreJobs}
                    style={{ padding: '1.5rem 4rem', fontSize: '0.9rem' }}
                  >
                    {loadingMore ? 'SYNCHRONIZING...' : 'SYNC_MORE_NODES'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="growth-panel" style={{ padding: '6rem 4rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🛰️</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'white', margin: 0 }}>
                No active nodes matching query.
              </h3>
              <p style={{ color: 'var(--growth-dim)', marginTop: '0.5rem' }}>
                Try resetting or modifying console filters to sync alternate positions.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ExplorePage({ initialCategorySlug }: { initialCategorySlug?: string }) {
  return (
    <Suspense fallback={
      <div className="p-20 text-center" style={{ fontFamily: 'var(--font-heading)', color: 'var(--growth-dim)' }}>
        Loading Discovery matrix...
      </div>
    }>
      <ExplorePageContent initialCategorySlug={initialCategorySlug} />
    </Suspense>
  );
}
