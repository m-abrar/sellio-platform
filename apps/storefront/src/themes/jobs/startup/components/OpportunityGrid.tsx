'use client';

import React from 'react';
import Link from 'next/link';
import type { JobListing } from '@sellio/types';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';
import { formatJobCompensation, getJobLocationDisplay } from '@/themes/jobs/shared/job-utils';

const cleanLabel = (s: string) => s.replace(/_/g, ' ').toUpperCase();

interface OpportunityCardProps {
  job: JobListing;
}

export const OpportunityCard = ({ job }: OpportunityCardProps) => {
  const themeLink = useJobsThemeLink();
  const displayCompany = job.company?.name || 'Venture Startup';
  const displayLocation = getJobLocationDisplay(job);
  const displayStage = job.employment?.workplace || 'Remote';
  const displayCompensation = formatJobCompensation(job);
  const detailsUrl = themeLink(`/product/${job.slug}`);

  return (
    <Link href={detailsUrl} className="opportunity-card growth-panel" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        <div>
          <span className="opp-badge">{cleanLabel(displayStage)}</span>
          <h3 className="opp-title" style={{ marginTop: '1rem', fontSize: '1.4rem' }}>{job.title}</h3>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--growth-neon)', marginBottom: '0.5rem' }}>{displayCompany}</div>
          <div style={{ color: 'var(--growth-dim)', fontSize: '0.9rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            {displayLocation}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--growth-border)' }}>
          <div>
            <div style={{ fontSize: '0.6rem', color: 'var(--growth-dim)', fontWeight: 800 }}>COMPENSATION</div>
            <div style={{ fontSize: '1rem', fontWeight: 700 }}>{displayCompensation}</div>
          </div>
          <span
            className="opp-join-btn"
            style={{
              background: 'none',
              border: '1px solid var(--growth-neon)',
              color: 'var(--growth-neon)',
              padding: '0.5rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            APPLY
          </span>
        </div>
      </div>
    </Link>
  );
};

interface OpportunityGridProps {
  jobs?: JobListing[];
  loading?: boolean;
}

export const OpportunityGrid = ({ jobs = [], loading }: OpportunityGridProps) => {
  if (loading) {
    return (
      <section className="opportunity-grid">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div key={idx} className="opportunity-card growth-panel growth-skeleton-card" style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="growth-skeleton" style={{ width: '80px', height: '20px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}></div>
              <div className="growth-skeleton" style={{ width: '70%', height: '28px', marginTop: '1.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}></div>
              <div className="growth-skeleton" style={{ width: '40%', height: '20px', marginTop: '1rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="growth-skeleton" style={{ width: '100px', height: '24px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}></div>
              <div className="growth-skeleton" style={{ width: '70px', height: '30px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}></div>
            </div>
          </div>
        ))}
      </section>
    );
  }

  if (jobs.length === 0) {
    return (
      <section className="gr-empty-state" role="status">
        <h3>No venture roles published yet.</h3>
        <p>Add jobs in the admin panel or enable demo fallback during local preview setup.</p>
      </section>
    );
  }

  return (
    <section className="opportunity-grid">
      {jobs.map((job) => (
        <OpportunityCard key={job.id} job={job} />
      ))}
    </section>
  );
};
