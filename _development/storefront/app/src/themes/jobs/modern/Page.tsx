'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { JobListing } from '@sellio/types';
import { ModernHeader, ModernJobCard, ModernFooter } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

const fallbackLogos = [
  '/themes/jobs/modern/1.webp',
  '/themes/jobs/modern/2.webp',
  '/themes/jobs/modern/3.webp',
  '/themes/jobs/modern/4.webp',
  '/themes/jobs/modern/5.webp',
  '/themes/jobs/modern/6.webp',
];

function mapJobToCard(job: JobListing, index: number) {
  return {
    title: job.title,
    company: job.company?.name || job.employer?.name || 'Innovative Company',
    location: job.location?.display || [job.location?.city, job.location?.state].filter(Boolean).join(', ') || 'Remote',
    type: job.employment?.workplace || job.employment?.type || 'Full-Time',
    level: job.employment?.experience_level || 'Mid-Level',
    salary: job.compensation?.range_compact || job.compensation?.range_full || 'Competitive',
    logo: job.company?.logo_card || job.company?.logo || fallbackLogos[index % fallbackLogos.length],
    slug: job.slug,
  };
}

export default function Page() {
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

        console.error('Failed to load jobs modern listings:', error);
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
    <div className="jobs-modern-wrapper">
      <ModernHeader />

      {/* Hero */}
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
            <input type="text" className="jm-search-input" placeholder="Job title, skill, or company" />
            <div className="jm-search-divider"></div>
            <input type="text" className="jm-search-input" placeholder="City or Remote" />
            <button className="jm-btn jm-btn-primary" style={{ margin: '4px' }}>Search</button>
        </div>
      </section>

      {/* Stats */}
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

      {/* Job Grid */}
      <section className="jm-section" id="discover">
          <div className="jm-section-header">
              <h2 className="jm-section-title">{jobsTitle}</h2>
              <a href="#" className="jm-btn jm-btn-outline">{jobsViewAll}</a>
          </div>

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
              ) : jobError ? (
                <div className="jm-listing-state">
                  <div className="jm-listing-kicker">Job Sync Offline</div>
                  <h3>Curated roles could not be loaded.</h3>
                  <p>{jobError}</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="jm-listing-state">
                  <div className="jm-listing-kicker">Empty Job Registry</div>
                  <h3>No live jobs are published yet.</h3>
                  <p>Add job records in the backend and this modern grid will hydrate automatically.</p>
                </div>
              ) : (
                jobs.slice(0, 6).map((job, index) => {
                  const card = mapJobToCard(job, index);
                  return (
                    <a className="jm-job-link" href={`/product/${card.slug}`} key={job.id}>
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
