'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { JobListing } from '@sellio/types';
import { BlueCollarHeader, BlueCollarJobCard, BlueCollarFooter } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/jobs/shared/CatalogSyncAlert';
import { fetchJobsHome, resolveJobsFailure } from '@/themes/jobs/shared/catalog';
import { mapJobToBlueCollarCard } from '@/themes/jobs/shared/job-utils';
import { useDemoFallbackAllowed } from '@/themes/jobs/shared/useDemoFallbackAllowed';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';

export default function Page() {
  const router = useRouter();
  const themeLink = useJobsThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const heroTitle = useThemeContent('hero.title', 'Hard Work \nPays Off.');
  const heroDescription = useThemeContent('hero.description', 'Find high-paying jobs in construction, manufacturing, transportation, and skilled trades. No desk required.');
  const tradesTitle = useThemeContent('trades.title', 'Browse By Trade');
  const jobsTitle = useThemeContent('jobs.title', 'Latest Openings');
  const jobsLoadMore = useThemeContent('jobs.load_more_label', 'Load More Jobs');
  const ctaTitle = useThemeContent('cta.title', 'Need Workers Fast?');
  const ctaDescription = useThemeContent('cta.description', 'Access our database of over 50,000 certified tradespeople ready to start tomorrow.');
  const ctaButton = useThemeContent('cta.button_label', 'Post Your Job Now');

  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    async function loadJobs() {
      setLoadingJobs(true);
      const result = await fetchJobsHome(6);

      if (result.ok && result.response.data?.length) {
        setJobs(result.response.data);
        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'No jobs returned from API.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveJobsFailure(allowDemo, 'blue_collar');

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
  }, [allowDemo]);

  const goToExplore = (query?: string) => {
    const path = query ? `/explore?q=${encodeURIComponent(query)}` : '/explore';
    router.push(themeLink(path));
  };

  return (
    <div className="jobs-blue-collar-wrapper">
      <BlueCollarHeader />

      <section className="jbc-hero" id="jbc-hero-section" aria-labelledby="jbc-hero-title">
        <div className="jbc-hero-overlay"></div>
        <div className="jbc-hero-content">
            <h1 className="jbc-hero-title" id="jbc-hero-title">
              {heroTitle.includes('Pays Off.') ? (
                <>
                  {heroTitle.replace('Pays Off.', '')}
                  <span>Pays Off.</span>
                </>
              ) : heroTitle}
            </h1>
            <p className="jbc-hero-subtitle">{heroDescription}</p>

            <div className="jbc-search-box" aria-label="Search Filter Bar">
                <input type="text" className="jbc-search-input" placeholder="Job Title or Trade (e.g., Welder)" aria-label="Trade Search Input" readOnly onFocus={() => goToExplore()} />
                <div className="jbc-search-divider"></div>
                <input type="text" className="jbc-search-input" placeholder="City or ZIP Code" aria-label="City Search Input" readOnly onFocus={() => goToExplore()} />
                <button type="button" className="jbc-btn jbc-btn-primary" style={{ border: 'none', margin: '4px' }} onClick={() => goToExplore()}>Search</button>
            </div>
        </div>
      </section>

      <section className="jbc-section" id="jbc-trades-section" style={{ backgroundColor: 'white' }} aria-labelledby="jbc-trades-title">
          <h2 className="jbc-section-title" id="jbc-trades-title">{tradesTitle}</h2>
          <div className="jbc-trades-grid">
              {['Construction', 'Manufacturing', 'Transportation', 'Maintenance', 'Warehousing', 'Energy'].map((trade) => (
                   <a href={themeLink('/explore')} key={trade} className="jbc-trade-link">{trade}</a>
              ))}
          </div>
      </section>

      <section className="jbc-section" id="jobs" aria-labelledby="jbc-jobs-title">
          <div className="jbc-jobs-header">
              <h2 className="jbc-section-title" id="jbc-jobs-title" style={{ marginBottom: 0 }}>{jobsTitle}</h2>
              <select className="jbc-sort-select" aria-label="Sort Jobs Select" defaultValue="recent" onChange={() => goToExplore()}>
                  <option value="recent">Most Recent</option>
                  <option value="wage">Highest Wage</option>
                  <option value="closest">Closest to Me</option>
              </select>
          </div>

          {apiError && useFallback && (
            <div className="jbc-alert-slot">
              <CatalogSyncAlert variant="demo" error={apiError} classPrefix="jbc" />
            </div>
          )}
          {apiError && !useFallback && (
            <div className="jbc-alert-slot">
              <CatalogSyncAlert variant="production" error={apiError} classPrefix="jbc" />
            </div>
          )}

          <div className="jbc-job-grid">
              {loadingJobs ? (
                [1, 2, 3, 4, 5, 6].map((item) => (
                  <div className="jbc-job-card jbc-listing-skeleton" key={item}>
                    <div className="jbc-skeleton-line jbc-skeleton-line-title" />
                    <div className="jbc-skeleton-line" />
                    <div className="jbc-skeleton-line jbc-skeleton-line-short" />
                  </div>
                ))
              ) : jobs.length === 0 ? (
                <div className="jbc-listing-state">
                  <div className="jbc-listing-kicker">Empty Job Registry</div>
                  <h3>No live jobs are published yet.</h3>
                  <p>Browse the explore page or add job records in the backend to hydrate this grid.</p>
                  <button type="button" className="jbc-btn jbc-btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => goToExplore()}>Explore jobs</button>
                </div>
              ) : (
                jobs.slice(0, 6).map((job) => {
                  const card = mapJobToBlueCollarCard(job);
                  return (
                    <a className="jbc-job-link" href={themeLink(`/product/${card.slug}`)} key={job.id}>
                      <BlueCollarJobCard {...card} />
                    </a>
                  );
                })
              )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button type="button" className="jbc-btn jbc-btn-secondary" onClick={() => goToExplore()}>{jobsLoadMore}</button>
          </div>
      </section>

      <section className="jbc-cta" id="jbc-employers-section">
          <h2>{ctaTitle}</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', fontWeight: 500 }}>{ctaDescription}</p>
          <button type="button" className="jbc-btn jbc-btn-primary" style={{ fontSize: '1.25rem', padding: '1rem 3rem' }} onClick={() => goToExplore()}>{ctaButton}</button>
      </section>

      <BlueCollarFooter />
    </div>
  );
}
