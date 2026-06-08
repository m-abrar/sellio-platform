'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { JobListing } from '@sellio/types';
import { FreelanceHeader, GigCard, FreelanceFooter } from './components';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/jobs/shared/CatalogSyncAlert';
import { fetchJobsHome, resolveJobsFailure } from '@/themes/jobs/shared/catalog';
import { mapJobToFreelanceGig } from '@/themes/jobs/shared/job-utils';
import { useDemoFallbackAllowed } from '@/themes/jobs/shared/useDemoFallbackAllowed';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';

export default function Page() {
  const router = useRouter();
  const themeLink = useJobsThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const heroTitle = useThemeContent('hero.title', 'Find the perfect freelance services\nfor your business');
  const gigsTitle = useThemeContent('gigs.title', 'Popular professional services');
  const promoTitle = useThemeContent('promo.title', 'A whole world of freelance talent at your fingertips');
  const promoButton = useThemeContent('promo.button_label', 'Explore GigHive Pro');
  const promoImage = useThemeMedia('promo.image', '/themes/jobs/freelance/14.webp');

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
        const resolution = resolveJobsFailure(allowDemo, 'freelance');

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
    <div className="jobs-freelance-wrapper">
      <FreelanceHeader />

      <section className="jf-hero">
        <h1 className="jf-hero-title">
          {heroTitle.split('\n').map((line, index) => {
            const hasItalic = line.toLowerCase().includes('freelance');
            if (hasItalic) {
              const parts = line.split(/freelance/i);
              return (
                <React.Fragment key={`${line}-${index}`}>
                  {index > 0 && <br />}
                  {parts[0]}<span style={{ fontStyle: 'italic' }}>freelance</span>{parts[1]}
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
      </section>

      <div className="jf-search-container">
          <span style={{ padding: '1rem', fontSize: '1.25rem', color: 'var(--jf-text-muted)' }}>🔍</span>
          <input type="text" className="jf-search-input" placeholder='Try "logo design" or "React developer"' readOnly onFocus={goToExplore} />
          <button type="button" className="jf-btn jf-btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }} onClick={goToExplore}>Search</button>
      </div>

      <div className="jf-categories">
          <button type="button" className="jf-cat-pill active" onClick={goToExplore}>All Categories</button>
          <button type="button" className="jf-cat-pill" onClick={goToExplore}>Graphics & Design</button>
          <button type="button" className="jf-cat-pill" onClick={goToExplore}>Programming & Tech</button>
          <button type="button" className="jf-cat-pill" onClick={goToExplore}>Digital Marketing</button>
          <button type="button" className="jf-cat-pill" onClick={goToExplore}>Video & Animation</button>
          <button type="button" className="jf-cat-pill" onClick={goToExplore}>Writing & Translation</button>
          <button type="button" className="jf-cat-pill" onClick={goToExplore}>Music & Audio</button>
          <button type="button" className="jf-cat-pill" onClick={goToExplore}>Business</button>
      </div>

      <section className="jf-section" id="explore">
          <h2 className="jf-section-title">{gigsTitle}</h2>

          {apiError && useFallback && (
            <div className="jf-alert-slot">
              <CatalogSyncAlert variant="demo" error={apiError} classPrefix="jf" />
            </div>
          )}
          {apiError && !useFallback && (
            <div className="jf-alert-slot">
              <CatalogSyncAlert variant="production" error={apiError} classPrefix="jf" />
            </div>
          )}

          <div className="jf-grid">
              {loadingJobs ? (
                [1, 2, 3, 4].map((item) => (
                  <div className="jf-gig-card jf-listing-skeleton" key={item}>
                    <div className="jf-skeleton-image" />
                    <div className="jf-skeleton-line jf-skeleton-line-title" />
                    <div className="jf-skeleton-line" />
                    <div className="jf-skeleton-line jf-skeleton-line-short" />
                  </div>
                ))
              ) : jobs.length === 0 ? (
                <div className="jf-listing-state">
                  <div className="jf-listing-kicker">Empty Gig Registry</div>
                  <h3>No live jobs are published yet.</h3>
                  <p>Browse the explore page or add job records in the backend to hydrate this grid.</p>
                  <button type="button" className="jf-btn jf-btn-primary" style={{ marginTop: '1.5rem' }} onClick={goToExplore}>Explore gigs</button>
                </div>
              ) : (
                jobs.slice(0, 6).map((job, index) => {
                  const gig = mapJobToFreelanceGig(job, index);
                  return (
                    <a className="jf-gig-link" href={themeLink(`/product/${gig.slug}`)} key={job.id}>
                      <GigCard {...gig} />
                    </a>
                  );
                })
              )}
          </div>
      </section>

      <section className="jf-promo">
          <div>
              <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>{promoTitle}</h2>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', fontSize: '1.2rem', lineHeight: 1.8 }}>
                  <li>✓ The best for every budget</li>
                  <li>✓ Quality work done quickly</li>
                  <li>✓ Protected payments, every time</li>
                  <li>✓ 24/7 support</li>
              </ul>
              <button type="button" className="jf-btn" style={{ backgroundColor: 'white', color: 'var(--jf-accent)' }} onClick={goToExplore}>{promoButton}</button>
          </div>
          <div className="d-none d-lg-block" style={{ width: '40%' }}>
              <img src={promoImage} alt="Team" style={{ width: '100%', borderRadius: '16px', transform: 'rotate(5deg)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }} />
          </div>
      </section>

      <FreelanceFooter />
    </div>
  );
}
