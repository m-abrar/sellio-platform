'use client';

import React, { useEffect, useState, Suspense } from 'react';
import type { JobListing, Category, Location } from '@sellio/types';
import { useSearchParams, useRouter } from 'next/navigation';
import { CatalogSyncAlert } from '@/themes/jobs/shared/CatalogSyncAlert';
import {
  fetchJobsExplore,
  filterFallbackJobs,
  resolveJobsFailure,
  type JobsThemeVariant,
} from '@/themes/jobs/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/jobs/shared/useDemoFallbackAllowed';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';

export type JobsExploreClassPrefix = 'jt' | 'jm' | 'jbc' | 'jf';

export interface JobsExplorePageProps {
  variant: JobsThemeVariant;
  classPrefix: JobsExploreClassPrefix;
  pageEyebrow: string;
  pageTitle: string;
  pageSubtitle: string;
  emptyTitle: string;
  emptyDescription: string;
  loadMoreLabel: string;
  resetLabel: string;
  filterSectionClass: string;
  searchInputClass: string;
  selectClass: string;
  gridClass: string;
  primaryBtnClass: string;
  outlineBtnClass: string;
  renderJobCard: (job: JobListing) => React.ReactNode;
}

function ExplorePageContent({
  variant,
  classPrefix,
  pageEyebrow,
  pageTitle,
  pageSubtitle,
  emptyTitle,
  emptyDescription,
  loadMoreLabel,
  resetLabel,
  filterSectionClass,
  searchInputClass,
  selectClass,
  gridClass,
  primaryBtnClass,
  outlineBtnClass,
  renderJobCard,
}: JobsExplorePageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const themeLink = useJobsThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const searchQuery = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedLocation = searchParams.get('location') || '';
  const selectedWorkplace = searchParams.get('workplace') || '';
  const selectedExperience = searchParams.get('experience') || '';

  const [search, setSearch] = useState(searchQuery);
  const [category, setCategory] = useState(selectedCategory);
  const [location, setLocation] = useState(selectedLocation);
  const [workplace, setWorkplace] = useState(selectedWorkplace);
  const [experience, setExperience] = useState(selectedExperience);

  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [workplaceTypes] = useState([
    { id: 1, label: 'Remote' },
    { id: 2, label: 'On-Site' },
    { id: 3, label: 'Hybrid' },
  ]);
  const [experienceLevels] = useState([
    'Entry-level',
    'Mid-level',
    'Senior',
    'Lead',
    'Principal',
    'Executive',
  ]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (category) params.set('category', category);
    if (location) params.set('location', location);
    if (workplace) params.set('workplace', workplace);
    if (experience) params.set('experience', experience);
    router.replace(themeLink(`/explore?${params.toString()}`));
    setPage(1);
  }, [search, category, location, workplace, experience, router, themeLink]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const filters = { search, category, location, workplace, experience };
      const result = await fetchJobsExplore({
        q: search || undefined,
        search: search || undefined,
        category: category || undefined,
        location: location || undefined,
        workplace_type: workplace || undefined,
        experience_level: experience || undefined,
        page: 1,
        per_page: 9,
      });

      if (result.ok && result.response.data) {
        setJobs(result.response.data);
        setTotalPages(result.response.meta?.last_page || 1);
        if (result.response.sidebar) {
          if (result.response.sidebar.categories) setCategories(result.response.sidebar.categories);
          if (result.response.sidebar.locations) setLocations(result.response.sidebar.locations);
        }
        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'No jobs returned from API.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveJobsFailure(allowDemo, variant);

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
  }, [search, category, location, workplace, experience, allowDemo, variant]);

  async function loadMore() {
    if (page >= totalPages || loadingMore || useFallback) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const result = await fetchJobsExplore({
        q: search || undefined,
        search: search || undefined,
        category: category || undefined,
        location: location || undefined,
        workplace_type: workplace || undefined,
        experience_level: experience || undefined,
        page: nextPage,
        per_page: 9,
      });

      if (result.ok && result.response.data) {
        setJobs((prev) => [...prev, ...result.response.data]);
        setPage(nextPage);
      }
    } catch (err) {
      console.error('Failed to load more jobs:', err);
    } finally {
      setLoadingMore(false);
    }
  }

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setLocation('');
    setWorkplace('');
    setExperience('');
  };

  return (
    <div className={`${classPrefix}-explore-page`}>
      <section className={`${classPrefix}-explore-hero`}>
        <a href={themeLink('/')} className={`${classPrefix}-explore-back`}>
          ← Back to home
        </a>
        <div className={`${classPrefix}-explore-eyebrow`}>{pageEyebrow}</div>
        <h1>{pageTitle}</h1>
        <p>{pageSubtitle}</p>
      </section>

      {apiError && useFallback && (
        <div className={`${classPrefix}-alert-slot`}>
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix={classPrefix} />
        </div>
      )}
      {apiError && !useFallback && (
        <div className={`${classPrefix}-alert-slot`}>
          <CatalogSyncAlert variant="production" error={apiError} classPrefix={classPrefix} />
        </div>
      )}

      <div className={filterSectionClass}>
        <input
          type="text"
          className={searchInputClass}
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Keyword search"
        />
        <select className={selectClass} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.title}</option>
          ))}
        </select>
        <select className={selectClass} value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.slug}>{loc.title}</option>
          ))}
        </select>
        <select className={selectClass} value={workplace} onChange={(e) => setWorkplace(e.target.value)}>
          <option value="">All Workplace Types</option>
          {workplaceTypes.map((type) => (
            <option key={type.id} value={String(type.id)}>{type.label}</option>
          ))}
        </select>
        <select className={selectClass} value={experience} onChange={(e) => setExperience(e.target.value)}>
          <option value="">All Experience Levels</option>
          {experienceLevels.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className={gridClass}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className={`${classPrefix}-explore-shimmer`} style={{ minHeight: 280, opacity: 0.35, background: 'rgba(0,0,0,0.06)', borderRadius: 12 }} />
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <>
          <div className={gridClass}>
            {jobs.map((job) => (
              <React.Fragment key={job.id}>{renderJobCard(job)}</React.Fragment>
            ))}
          </div>
          {page < totalPages && (
            <div className={`${classPrefix}-explore-load-more`}>
              <button type="button" className={primaryBtnClass} onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? 'Loading...' : loadMoreLabel}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className={`${classPrefix}-empty-state`} role="status">
          <h3>{emptyTitle}</h3>
          <p>{emptyDescription}</p>
          <button type="button" className={outlineBtnClass} onClick={resetFilters}>
            {resetLabel}
          </button>
        </div>
      )}
    </div>
  );
}

export default function JobsExplorePage(props: JobsExplorePageProps) {
  return (
    <Suspense fallback={<div style={{ padding: '6rem 5%', textAlign: 'center' }}>Loading jobs...</div>}>
      <ExplorePageContent {...props} />
    </Suspense>
  );
}
