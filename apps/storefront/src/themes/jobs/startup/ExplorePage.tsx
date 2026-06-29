'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { JobListing, Category, Location } from '@/types';
import { OpportunityCard, OpportunityGrid } from './components/OpportunityGrid';
import { CatalogSyncAlert } from '@/themes/jobs/shared/CatalogSyncAlert';
import {
  fetchJobsExplore,
  filterFallbackJobs,
  resolveJobsFailure,
} from '@/themes/jobs/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/jobs/shared/useDemoFallbackAllowed';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

function ExplorePageContent({ initialCategorySlug }: { initialCategorySlug?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeLink = useJobsThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const exploreEyebrow = useThemeContent('explore.eyebrow', 'Discover Opportunities');
  const exploreHeading = useThemeContent('explore.heading', 'Venture Catalog.');
  const exploreDescription = useThemeContent('explore.description', 'Search and filter thousands of roles at venture-backed startups and high-growth companies.');

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
      <div className="growth-explore-header">
        <div className="growth-explore-eyebrow">{exploreEyebrow}</div>
        <h1 className="growth-explore-heading">{exploreHeading}</h1>
        <p className="growth-explore-description">{exploreDescription}</p>
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
            <label className="growth-filter-label">Category</label>
            <div className="growth-select-wrapper">
              <select
                className="growth-select"
                value={selectedCategory}
                onChange={(e) => updateFilter('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>{cat.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="growth-filter-group">
            <label className="growth-filter-label">Location</label>
            <div className="growth-select-wrapper">
              <select
                className="growth-select"
                value={selectedLocation}
                onChange={(e) => updateFilter('location', e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.slug}>{loc.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="growth-filter-group">
            <label className="growth-filter-label">Work Style</label>
            <div className="growth-select-wrapper">
              <select
                className="growth-select"
                value={selectedWorkplace}
                onChange={(e) => updateFilter('workplace', e.target.value)}
              >
                <option value="">All Workplace Types</option>
                {workplaceTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="growth-filter-group">
            <label className="growth-filter-label">Experience Level</label>
            <div className="growth-select-wrapper">
              <select
                className="growth-select"
                value={selectedExperience}
                onChange={(e) => updateFilter('experience', e.target.value)}
              >
                <option value="">All Experience Levels</option>
                {experienceLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
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
            Reset Filters
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
                <div className="growth-load-more-row">
                  <button
                    type="button"
                    className="growth-btn-primary"
                    disabled={loadingMore}
                    onClick={loadMoreJobs}
                    style={{ padding: '1.5rem 4rem', fontSize: '0.9rem' }}
                  >
                    {loadingMore ? 'Loading...' : 'Load More Jobs'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="gr-empty-state" role="status">
              <h3>No positions match your search.</h3>
              <p>Try adjusting your filters or search terms.</p>
              <button type="button" className="growth-btn-outline" style={{ marginTop: '2rem' }} onClick={() => router.push(themeLink('/explore'))}>
                Reset Filters
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
        Loading opportunities...
      </div>
    }>
      <ExplorePageContent initialCategorySlug={initialCategorySlug} />
    </Suspense>
  );
}
