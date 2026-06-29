'use client';

import React, { useEffect, useState } from 'react';
import type { JobListing } from '@/types';
import { CorporateHeader, JobCard, DashboardCard, CorporateFooter } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/jobs/shared/CatalogSyncAlert';
import { fetchJobsHome, resolveJobsFailure } from '@/themes/jobs/shared/catalog';
import { mapJobToCorporateCard } from '@/themes/jobs/shared/job-utils';
import { useDemoFallbackAllowed } from '@/themes/jobs/shared/useDemoFallbackAllowed';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';

export default function Page() {
  const themeLink = useJobsThemeLink();
  const allowDemo = useDemoFallbackAllowed();
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
  const emptyKicker = useThemeContent('empty.kicker', 'No roles yet');
  const emptyTitle = useThemeContent('empty.title', 'No live jobs are published yet.');
  const emptyDescription = useThemeContent('empty.description', 'Add job records in the admin panel and they will appear here automatically.');
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadJobs() {
      setLoadingJobs(true);
      const result = await fetchJobsHome(6);

      if (!isMounted) return;

      if (result.ok && result.response.data) {
        setJobs(Array.isArray(result.response.data) ? result.response.data : []);
        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'No jobs returned from API.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveJobsFailure(allowDemo, 'corporate');

        if (resolution.mode === 'demo') {
          setJobs(resolution.jobs);
          setUseFallback(true);
        } else {
          setJobs([]);
          setUseFallback(false);
        }
      }

      setLoadingJobs(false);
    }

    loadJobs();

    return () => {
      isMounted = false;
    };
  }, [allowDemo]);

  return (
    <div className="jobs-corporate-wrapper">
      <CorporateHeader />

      <section className="jc-hero">
        <h1 className="jc-hero-title">{heroTitle}</h1>
        <p className="jc-hero-subtitle">{heroDescription}</p>

        <div className="jc-search-container">
            <input type="text" className="jc-search-input" placeholder={keywordPlaceholder} />
            <div className="jc-search-divider"></div>
            <input type="text" className="jc-search-input" placeholder={locationPlaceholder} />
            <button type="button" className="jc-btn jc-btn-navy jc-search-btn">{searchButtonLabel}</button>
        </div>
      </section>

      <div className="jc-layout">
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

              {apiError && useFallback && (
                <div className="jc-alert-slot">
                  <CatalogSyncAlert variant="demo" error={apiError} classPrefix="jc" />
                </div>
              )}
              {apiError && !useFallback && (
                <div className="jc-alert-slot">
                  <CatalogSyncAlert variant="production" error={apiError} classPrefix="jc" />
                </div>
              )}

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
                  ) : jobs.length === 0 ? (
                    <div className="jc-empty-state" role="status">
                      <div className="jc-listing-kicker">{emptyKicker}</div>
                      <h3>{emptyTitle}</h3>
                      <p>{emptyDescription}</p>
                    </div>
                  ) : (
                    jobs.slice(0, 6).map((job, index) => {
                      const card = mapJobToCorporateCard(job, index);
                      return (
                        <a className="jc-job-link" href={themeLink(`/product/${card.slug}`)} key={job.id}>
                          <JobCard {...card} />
                        </a>
                      );
                    })
                  )}
              </div>

              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                  <button type="button" className="jc-btn jc-btn-outline">{loadMoreLabel}</button>
              </div>
          </main>
      </div>

      <CorporateFooter />
    </div>
  );
}
