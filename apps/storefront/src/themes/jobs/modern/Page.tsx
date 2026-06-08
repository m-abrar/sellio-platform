'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { JobListing } from '@sellio/types';
import { ModernHeader, ModernJobCard, ModernFooter } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/jobs/shared/CatalogSyncAlert';
import { fetchJobsHome, resolveJobsFailure } from '@/themes/jobs/shared/catalog';
import { mapJobToModernCard } from '@/themes/jobs/shared/job-utils';
import { useDemoFallbackAllowed } from '@/themes/jobs/shared/useDemoFallbackAllowed';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';

export default function Page() {
  const router = useRouter();
  const themeLink = useJobsThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const heroBadge = useThemeContent('hero.badge', '🚀 Over 10,000+ new roles added this week');
  const heroTitle = useThemeContent('hero.title', 'Find work that \nmatches your ambition.');
  const heroDescription = useThemeContent('hero.description', 'The modern way to discover roles at innovative startups and world-class tech companies.');

  const statsUsersVal = useThemeContent('stats.users_value', '2M+');
  const statsUsersLbl = useThemeContent('stats.users_label', 'Active Users');
  const statsCompaniesVal = useThemeContent('stats.companies_value', '50k');
  const statsCompaniesLbl = useThemeContent('stats.companies_label', 'Companies');
  const statsSalaryVal = useThemeContent('stats.salary_value', '$120k');
  const statsSalaryLbl = useThemeContent('stats.salary_label', 'Avg Salary');

  const jobsTitle = useThemeContent('jobs.title', 'Curated for you');
  const jobsViewAll = useThemeContent('jobs.view_all_label', 'View All Roles');

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
        const resolution = resolveJobsFailure(allowDemo, 'modern');

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

  const goToExplore = () => {
    router.push(themeLink('/explore'));
  };

  return (
    <div className="jobs-modern-wrapper">
      <ModernHeader />

      <section className="jm-hero">
        <div className="jm-hero-badge">{heroBadge}</div>
        <h1 className="jm-hero-title">
          {heroTitle.split('\n').map((line, index) => {
            const hasGradient = line.toLowerCase().includes('matches your ambition.');
            if (hasGradient) {
              const parts = line.split(/matches your ambition\./i);
              return (
                <React.Fragment key={`${line}-${index}`}>
                  {index > 0 && <br />}
                  {parts[0]}<span className="jm-text-gradient">matches your ambition.</span>{parts[1]}
                </React.Fragment>
              );
            }
            return (
              <React.Fragment key={`${line}-${index}`}>
                {index > 0 && <br />}
                {line}
              </React.Fragment>
            );
          })}
        </h1>
        <p className="jm-hero-subtitle">{heroDescription}</p>

        <div className="jm-search-box">
            <input type="text" className="jm-search-input" placeholder="Job title, skill, or company" readOnly onFocus={goToExplore} />
            <div className="jm-search-divider"></div>
            <input type="text" className="jm-search-input" placeholder="City or Remote" readOnly onFocus={goToExplore} />
            <button type="button" className="jm-btn jm-btn-primary" style={{ margin: '4px' }} onClick={goToExplore}>Search</button>
        </div>
      </section>

      <div className="jm-stats">
          <div className="jm-stat-item">
              <div className="jm-stat-number jm-text-gradient">{statsUsersVal}</div>
              <div className="jm-stat-label">{statsUsersLbl}</div>
          </div>
          <div className="jm-stat-item">
              <div className="jm-stat-number jm-text-gradient">{statsCompaniesVal}</div>
              <div className="jm-stat-label">{statsCompaniesLbl}</div>
          </div>
          <div className="jm-stat-item">
              <div className="jm-stat-number jm-text-gradient">{statsSalaryVal}</div>
              <div className="jm-stat-label">{statsSalaryLbl}</div>
          </div>
      </div>

      <section className="jm-section" id="discover">
          <div className="jm-section-header">
              <h2 className="jm-section-title">{jobsTitle}</h2>
              <a href={themeLink('/explore')} className="jm-btn jm-btn-outline">{jobsViewAll}</a>
          </div>

          {apiError && useFallback && (
            <div className="jm-alert-slot">
              <CatalogSyncAlert variant="demo" error={apiError} classPrefix="jm" />
            </div>
          )}
          {apiError && !useFallback && (
            <div className="jm-alert-slot">
              <CatalogSyncAlert variant="production" error={apiError} classPrefix="jm" />
            </div>
          )}

          <div className="jm-grid">
              {loadingJobs ? (
                [1, 2, 3, 4, 5, 6].map((item) => (
                  <div className="jm-job-card jm-glass jm-listing-skeleton" key={item}>
                    <div className="jm-skeleton-logo" />
                    <div className="jm-skeleton-line jm-skeleton-line-title" />
                    <div className="jm-skeleton-line" />
                    <div className="jm-skeleton-line jm-skeleton-line-short" />
                  </div>
                ))
              ) : jobs.length === 0 ? (
                <div className="jm-listing-state">
                  <div className="jm-listing-kicker">Empty Job Registry</div>
                  <h3>No live jobs are published yet.</h3>
                  <p>Browse the explore page or add job records in the backend to hydrate this grid.</p>
                  <a href={themeLink('/explore')} className="jm-btn jm-btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block', textDecoration: 'none' }}>Explore roles</a>
                </div>
              ) : (
                jobs.slice(0, 6).map((job, index) => {
                  const card = mapJobToModernCard(job, index);
                  return (
                    <a className="jm-job-link" href={themeLink(`/product/${card.slug}`)} key={job.id}>
                      <ModernJobCard {...card} />
                    </a>
                  );
                })
              )}
          </div>
      </section>

      <ModernFooter />
    </div>
  );
}
