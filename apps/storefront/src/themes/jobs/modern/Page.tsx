'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { JobListing } from '@sellio/types';
import { ModernHeader, ModernJobCard, ModernFooter } from './components';

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
        <div className="jm-hero-badge">🚀 Over 10,000+ new roles added this week</div>
        <h1 className="jm-hero-title">Find work that <br/><span className="jm-text-gradient">matches your ambition.</span></h1>
        <p className="jm-hero-subtitle">The modern way to discover roles at innovative startups and world-class tech companies.</p>

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
              <div className="jm-stat-number jm-text-gradient">2M+</div>
              <div className="jm-stat-label">Active Users</div>
          </div>
          <div className="jm-stat-item">
              <div className="jm-stat-number jm-text-gradient">50k</div>
              <div className="jm-stat-label">Companies</div>
          </div>
          <div className="jm-stat-item">
              <div className="jm-stat-number jm-text-gradient">$120k</div>
              <div className="jm-stat-label">Avg Salary</div>
          </div>
      </div>

      {/* Job Grid */}
      <section className="jm-section" id="discover">
          <div className="jm-section-header">
              <h2 className="jm-section-title">Curated for you</h2>
              <a href="#" className="jm-btn jm-btn-outline">View All Roles</a>
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
