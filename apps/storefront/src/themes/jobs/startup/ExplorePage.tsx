'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { JobListing, Category, Location } from '@sellio/types';
import { OpportunityCard, OpportunityGrid } from './components/OpportunityGrid';
import { CatalogSyncAlert } from '@/themes/jobs/shared/CatalogSyncAlert';
import {
  fetchJobsExplore,
  filterFallbackJobs,
  resolveJobsFailure,
} from '@/themes/jobs/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/jobs/shared/useDemoFallbackAllowed';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';

function ExplorePageContent({ initialCategorySlug }: { initialCategorySlug?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeLink = useJobsThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [workplaceTypes, setWorkplaceTypes] = useState<Array<{ id: number; label: string }>>([
    { id: 1, label: 'Remote' },
    { id: 2, label: 'On-Site' },
    { id: 3, label: 'Hybrid' },
  ]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([
    'Entry-level', 'Mid-level', 'Senior', 'Lead', 'Principal', 'Executive',
  ]);

  const searchQuery = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || initialCategorySlug || '';
  const selectedLocation = searchParams.get('location') || '';
  const selectedWorkplace = searchParams.get('workplace') || '';
  const selectedExperience = searchParams.get('experience') || '';

  const getQueryParams = (page: number) => {
    const params: Record<string, unknown> = { page, per_page: 9 };
    if (searchQuery) params.search = searchQuery;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedLocation) params.location = selectedLocation;
    if (selectedWorkplace) params.workplace_type = selectedWorkplace;
    if (selectedExperience) params.experience_level = selectedExperience;
    return params;
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setCurrentPage(1);
      const filters = {
        search: searchQuery,
        category: selectedCategory,
        location: selectedLocation,
        workplace: selectedWorkplace,
        experience: selectedExperience,
      };

      const result = await fetchJobsExplore(getQueryParams(1));

      if (result.ok && result.response.data) {
        setJobs(result.response.data);
        setTotalPages(result.response.meta?.last_page || 1);

        if (result.response.sidebar) {
          if (result.response.sidebar.categories) setCategories(result.response.sidebar.categories);
          if (result.response.sidebar.locations) setLocations(result.response.sidebar.locations);
          if (result.response.sidebar.workplace_types) {
            const formattedTypes = Object.entries(result.response.sidebar.workplace_types).map(([id, label]) => ({
              id: Number(id),
              label: String(label),
            }));
            if (formattedTypes.length > 0) setWorkplaceTypes(formattedTypes);
          }
          if (result.response.sidebar.experience_levels) {
            setExperienceLevels(Object.values(result.response.sidebar.experience_levels));
          }
        }

        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'No jobs returned from API.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveJobsFailure(allowDemo, 'startup');

        if (resolution.mode === 'demo') {
          setJobs(filterFallbackJobs(resolution.jobs, filters));
          setTotalPages(1);
          setUseFallback(true);
        } else {
          setJobs([]);
          setTotalPages(1);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadData();
  }, [searchQuery, selectedCategory, selectedLocation, selectedWorkplace, selectedExperience, initialCategorySlug, allowDemo]);

  const loadMoreJobs = async () => {
    if (currentPage >= totalPages || loadingMore || useFallback) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const result = await fetchJobsExplore(getQueryParams(nextPage));

      if (result.ok && result.response.data) {
        setJobs((prev) => [...prev, ...result.response.data]);
        setCurrentPage(nextPage);
      }
    } catch (err) {
      console.error('Failed to load subsequent job list page:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(themeLink(`/explore?${params.toString()}`));
  };

  return (
    <div className="growth-explore-container">
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

      {apiError && useFallback && (
        <div className="gr-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="gr" />
        </div>
      )}
      {apiError && !useFallback && (
        <div className="gr-alert-slot">
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="gr" />
        </div>
      )}

      <div className="growth-explore-layout">
        <aside className="growth-filter-panel growth-panel">
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
              </select>
            </div>
          </div>

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
              </select>
            </div>
          </div>

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

          <div className="growth-filter-group">
            <label className="growth-filter-label">Experience Tier</label>
            <div className="growth-select-wrapper">
              <select
                className="growth-select"
                value={selectedExperience}
                onChange={(e) => updateFilter('experience', e.target.value)}
              >
                <option value="">ALL_TIERS</option>
                {experienceLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            className="growth-btn-outline"
            style={{ width: '100%', padding: '1rem', fontSize: '0.8rem', fontWeight: 700 }}
            onClick={() => router.push(themeLink('/explore'))}
          >
            RESET_CONSOLE
          </button>
        </aside>

        <main>
          {loading ? (
            <OpportunityGrid loading />
          ) : jobs.length > 0 ? (
            <div>
              <div className="opportunity-grid" style={{ padding: '0 0 4rem 0' }}>
                {jobs.map((job) => (
                  <OpportunityCard key={job.id} job={job} />
                ))}
              </div>

              {currentPage < totalPages && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                  <button
                    type="button"
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
            <div className="gr-empty-state" role="status">
              <h3>No active nodes matching query.</h3>
              <p>Try resetting or modifying console filters to sync alternate positions.</p>
              <button type="button" className="growth-btn-outline" style={{ marginTop: '2rem' }} onClick={() => router.push(themeLink('/explore'))}>
                RESET_CONSOLE
              </button>
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
