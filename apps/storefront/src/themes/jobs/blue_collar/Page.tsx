'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { JobListing } from '@sellio/types';
import { BlueCollarHeader, BlueCollarJobCard, BlueCollarFooter } from './components';

function formatTimeAgo(dateStr?: string | null) {
  if (!dateStr) {
    return 'Recently';
  }

  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) {
    return 'Posted Today';
  }

  if (hours < 24) {
    return `${hours} Hours Ago`;
  }

  const days = Math.floor(hours / 24);
  return days === 1 ? '1 Day Ago' : `${days} Days Ago`;
}

function mapJobToCard(job: JobListing) {
  return {
    title: job.title,
    company: job.company?.name || job.employer?.name || 'Local Employer',
    location: job.location?.display || [job.location?.city, job.location?.state].filter(Boolean).join(', ') || 'On-site',
    type: job.employment?.type || 'Full-Time',
    wage: job.compensation?.range_compact || job.compensation?.range_full || 'Competitive',
    time: formatTimeAgo(job.created_at),
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

        console.error('Failed to load jobs blue_collar listings:', error);
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
    <div className="jobs-blue-collar-wrapper">
      <BlueCollarHeader />

      {/* Hero */}
      <section className="jbc-hero" id="jbc-hero-section" aria-labelledby="jbc-hero-title">
        <div className="jbc-hero-overlay"></div>
        <div className="jbc-hero-content">
            <h1 className="jbc-hero-title" id="jbc-hero-title">Hard Work <span>Pays Off.</span></h1>
            <p className="jbc-hero-subtitle">Find high-paying jobs in construction, manufacturing, transportation, and skilled trades. No desk required.</p>

            <div className="jbc-search-box" aria-label="Search Filter Bar">
                <input type="text" className="jbc-search-input" placeholder="Job Title or Trade (e.g., Welder)" aria-label="Trade Search Input" />
                <div className="jbc-search-divider"></div>
                <input type="text" className="jbc-search-input" placeholder="City or ZIP Code" aria-label="City Search Input" />
                <button className="jbc-btn jbc-btn-primary" style={{ border: 'none', margin: '4px' }} onClick={() => alert('Searching listings...')}>Search</button>
            </div>
        </div>
      </section>

      {/* Categories */}
      <section className="jbc-section" id="jbc-trades-section" style={{ backgroundColor: 'white' }} aria-labelledby="jbc-trades-title">
          <h2 className="jbc-section-title" id="jbc-trades-title">Browse By Trade</h2>
          <div className="jbc-trades-grid">
              {['Construction', 'Manufacturing', 'Transportation', 'Maintenance', 'Warehousing', 'Energy'].map(trade => (
                  <a href="#" key={trade} className="jbc-trade-link"
                     onClick={(e) => { e.preventDefault(); alert(`Filtering jobs for ${trade}...`); }}
                  >
                      {trade}
                  </a>
              ))}
          </div>
      </section>

      {/* Job Grid */}
      <section className="jbc-section" id="jobs" aria-labelledby="jbc-jobs-title">
          <div className="jbc-jobs-header">
              <h2 className="jbc-section-title" id="jbc-jobs-title" style={{ marginBottom: 0 }}>Latest Openings</h2>
              <select className="jbc-sort-select" aria-label="Sort Jobs Select">
                  <option>Most Recent</option>
                  <option>Highest Wage</option>
                  <option>Closest to Me</option>
              </select>
          </div>

          <div className="jbc-job-grid">
              {loadingJobs ? (
                [1, 2, 3, 4, 5, 6].map((item) => (
                  <div className="jbc-job-card jbc-listing-skeleton" key={item}>
                    <div className="jbc-skeleton-line jbc-skeleton-line-title" />
                    <div className="jbc-skeleton-line" />
                    <div className="jbc-skeleton-line jbc-skeleton-line-short" />
                  </div>
                ))
              ) : jobError ? (
                <div className="jbc-listing-state">
                  <div className="jbc-listing-kicker">Job Sync Offline</div>
                  <h3>Latest openings could not be loaded.</h3>
                  <p>{jobError}</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="jbc-listing-state">
                  <div className="jbc-listing-kicker">Empty Job Registry</div>
                  <h3>No live jobs are published yet.</h3>
                  <p>Add job records in the backend and this trades grid will hydrate automatically.</p>
                </div>
              ) : (
                jobs.slice(0, 6).map((job) => {
                  const card = mapJobToCard(job);
                  return (
                    <a className="jbc-job-link" href={`/product/${card.slug}`} key={job.id}>
                      <BlueCollarJobCard {...card} />
                    </a>
                  );
                })
              )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button className="jbc-btn jbc-btn-secondary" onClick={() => alert('Loading more blue-collar jobs...')}>Load More Jobs</button>
          </div>
      </section>

      {/* CTA */}
      <section className="jbc-cta" id="jbc-employers-section">
          <h2>Need Workers Fast?</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', fontWeight: 500 }}>Access our database of over 50,000 certified tradespeople ready to start tomorrow.</p>
          <button className="jbc-btn jbc-btn-primary" style={{ fontSize: '1.25rem', padding: '1rem 3rem' }} onClick={() => alert('Employer onboarding portal...')}>Post Your Job Now</button>
      </section>

      <BlueCollarFooter />
    </div>
  );
}
