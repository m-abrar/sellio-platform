'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { JobListing } from '@sellio/types';
import { CorporateHeader, JobCard, DashboardCard, CorporateFooter } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

const fallbackLogos = [
  '/themes/jobs/corporate/1.webp',
  '/themes/jobs/corporate/2.webp',
  '/themes/jobs/corporate/3.webp',
  '/themes/jobs/corporate/4.webp',
  '/themes/jobs/corporate/5.webp',
];

function formatTimeAgo(dateStr?: string | null) {
  if (!dateStr) {
    return 'Recently';
  }

  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) {
    return 'Just now';
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return days === 1 ? '1d ago' : `${days}d ago`;
}

function mapJobToCard(job: JobListing, index: number) {
  return {
    title: job.title,
    company: job.company?.name || job.employer?.name || 'Enterprise Partner',
    location: job.location?.display || [job.location?.city, job.location?.state].filter(Boolean).join(', ') || 'Remote',
    type: job.employment?.type || 'Full-Time',
    salary: job.compensation?.range_compact || job.compensation?.range_full || 'Competitive',
    time: formatTimeAgo(job.created_at),
    logo: job.company?.logo_card || job.company?.logo || fallbackLogos[index % fallbackLogos.length],
    slug: job.slug,
  };
}

export default function Page() {
  const heroTitle = useThemeContent('hero.title', 'Advance Your Corporate Career');
  const heroDescription = useThemeContent(
    'hero.description',
    'Discover premium opportunities at Fortune 500 companies and high-growth enterprises worldwide.'
  );
  const keywordPlaceholder = useThemeContent('search.keyword_placeholder', 'Job title, keywords, or company');
  const locationPlaceholder = useThemeContent('search.location_placeholder', 'City, state, or Remote');
  const searchButtonLabel = useThemeContent('search.button_label', 'Search Jobs');
  const jobTypeTitle = useThemeContent('filters.job_type_title', 'Job Type');
  const experienceTitle = useThemeContent('filters.experience_title', 'Experience Level');
  const workModelTitle = useThemeContent('filters.work_model_title', 'Work Model');
  const collectionTitle = useThemeContent('collection.title', 'Recommended for You');
  const sortRelevantLabel = useThemeContent('collection.sort_relevant_label', 'Sort by: Most Relevant');
  const sortRecentLabel = useThemeContent('collection.sort_recent_label', 'Sort by: Most Recent');
  const sortSalaryLabel = useThemeContent('collection.sort_salary_label', 'Sort by: Salary (High to Low)');
  const loadMoreLabel = useThemeContent('collection.load_more_label', 'Load More Results');
  const syncOfflineKicker = useThemeContent('sync.offline_kicker', 'Job Sync Offline');
  const syncOfflineTitle = useThemeContent('sync.offline_title', 'Recommended jobs could not be loaded.');
  const emptyKicker = useThemeContent('empty.kicker', 'Empty Job Registry');
  const emptyTitle = useThemeContent('empty.title', 'No live jobs are published yet.');
  const emptyDescription = useThemeContent('empty.description', 'Add job records in the backend and this corporate listing will hydrate automatically.');
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobError, setJobError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadJobs() {
      try {
        const response = await api.getJobs({ per_page: 6 });
        if (!isMounted) {
          return;
        }

        setJobs(Array.isArray(response.data) ? response.data : []);
        setJobError(null);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load jobs corporate listings:', error);
        setJobError(error instanceof Error ? error.message : 'Jobs are temporarily unavailable.');
      } finally {
        if (isMounted) {
          setLoadingJobs(false);
        }
      }
    }

    loadJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="jobs-corporate-wrapper">
      <CorporateHeader />

      {/* Hero */}
      <section className="jc-hero">
        <h1 className="jc-hero-title">{heroTitle}</h1>
        <p className="jc-hero-subtitle">{heroDescription}</p>

        <div className="jc-search-container">
            <input type="text" className="jc-search-input" placeholder={keywordPlaceholder} />
            <div className="jc-search-divider"></div>
            <input type="text" className="jc-search-input" placeholder={locationPlaceholder} />
            <button className="jc-btn jc-btn-navy jc-search-btn">{searchButtonLabel}</button>
        </div>
      </section>

      {/* Main Layout */}
      <div className="jc-layout">
          {/* Sidebar */}
          <aside className="jc-sidebar">
              <div className="jc-filter-group">
                  <div className="jc-sidebar-title">{jobTypeTitle}</div>
                  <label className="jc-filter-label"><input type="checkbox" /> Full-Time (1,240)</label>
                  <label className="jc-filter-label"><input type="checkbox" /> Contract (430)</label>
                  <label className="jc-filter-label"><input type="checkbox" /> Part-Time (120)</label>
              </div>

              <div className="jc-filter-group">
                  <div className="jc-sidebar-title">{experienceTitle}</div>
                  <label className="jc-filter-label"><input type="checkbox" /> Executive (80)</label>
                  <label className="jc-filter-label"><input type="checkbox" /> Director (250)</label>
                  <label className="jc-filter-label"><input type="checkbox" /> Mid-Senior Level (900)</label>
                  <label className="jc-filter-label"><input type="checkbox" /> Associate (300)</label>
              </div>

              <div className="jc-filter-group">
                  <div className="jc-sidebar-title">{workModelTitle}</div>
                  <label className="jc-filter-label"><input type="checkbox" /> Remote</label>
                  <label className="jc-filter-label"><input type="checkbox" /> Hybrid</label>
                  <label className="jc-filter-label"><input type="checkbox" /> On-site</label>
              </div>
          </aside>

          {/* Job Listings */}
          <main>
              <DashboardCard />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--jc-navy)' }}>{collectionTitle}</h2>
                  <select style={{ padding: '0.5rem', border: '1px solid var(--jc-border)', borderRadius: '4px', color: 'var(--jc-text-main)', outline: 'none' }}>
                      <option>{sortRelevantLabel}</option>
                      <option>{sortRecentLabel}</option>
                      <option>{sortSalaryLabel}</option>
                  </select>
              </div>

              <div className="jc-job-list">
                  {loadingJobs ? (
                    [1, 2, 3, 4, 5].map((item) => (
                      <div className="jc-job-card jc-listing-skeleton" key={item}>
                        <div className="jc-skeleton-logo" />
                        <div className="jc-skeleton-body">
                          <div className="jc-skeleton-line jc-skeleton-line-title" />
                          <div className="jc-skeleton-line" />
                          <div className="jc-skeleton-line jc-skeleton-line-short" />
                        </div>
                      </div>
                    ))
                  ) : jobError ? (
                    <div className="jc-listing-state">
                      <div className="jc-listing-kicker">{syncOfflineKicker}</div>
                      <h3>{syncOfflineTitle}</h3>
                      <p>{jobError}</p>
                    </div>
                  ) : jobs.length === 0 ? (
                    <div className="jc-listing-state">
                      <div className="jc-listing-kicker">{emptyKicker}</div>
                      <h3>{emptyTitle}</h3>
                      <p>{emptyDescription}</p>
                    </div>
                  ) : (
                    jobs.slice(0, 6).map((job, index) => {
                      const card = mapJobToCard(job, index);
                      return (
                        <a className="jc-job-link" href={`/product/${card.slug}`} key={job.id}>
                          <JobCard {...card} />
                        </a>
                      );
                    })
                  )}
              </div>

              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                  <button className="jc-btn jc-btn-outline">{loadMoreLabel}</button>
              </div>
          </main>
      </div>

      <CorporateFooter />
    </div>
  );
}
