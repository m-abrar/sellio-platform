'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { JobListing } from '@sellio/types';
import { FreelanceHeader, GigCard, FreelanceFooter } from './components';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';

const fallbackAvatars = [
  '/themes/jobs/freelance/1.webp',
  '/themes/jobs/freelance/2.webp',
  '/themes/jobs/freelance/3.webp',
  '/themes/jobs/freelance/4.webp',
];

const fallbackImages = [
  '/themes/jobs/freelance/10.webp',
  '/themes/jobs/freelance/11.webp',
  '/themes/jobs/freelance/12.webp',
  '/themes/jobs/freelance/13.webp',
];

function mapJobToGig(job: JobListing, index: number) {
  const companyName = job.company?.name || job.employer?.name || 'Top Freelancer';
  const price = job.compensation?.range_compact || job.compensation?.range_full || 'Quote';

  return {
    title: job.title,
    name: companyName,
    avatar: job.company?.logo_card || job.company?.logo || fallbackAvatars[index % fallbackAvatars.length],
    image: job.company?.photos?.[0]?.url || fallbackImages[index % fallbackImages.length],
    rating: 4.9,
    reviews: job.status?.application_count || 100 + index * 47,
    price,
    slug: job.slug,
  };
}

export default function Page() {
  const heroTitle = useThemeContent('hero.title', 'Find the perfect freelance services\nfor your business');
  
  const gigsTitle = useThemeContent('gigs.title', 'Popular professional services');
  
  const promoTitle = useThemeContent('promo.title', 'A whole world of freelance talent at your fingertips');
  const promoButton = useThemeContent('promo.button_label', 'Explore GigHive Pro');
  const promoImage = useThemeMedia('promo.image', '/themes/jobs/freelance/14.webp');

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

        console.error('Failed to load jobs freelance listings:', error);
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
    <div className="jobs-freelance-wrapper">
      <FreelanceHeader />

      {/* Hero */}
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

      {/* Search Bar */}
      <div className="jf-search-container">
          <span style={{ padding: '1rem', fontSize: '1.25rem', color: 'var(--jf-text-muted)' }}>🔍</span>
          <input type="text" className="jf-search-input" placeholder='Try "logo design" or "React developer"' />
          <button className="jf-btn jf-btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Search</button>
      </div>

      {/* Categories Slider */}
      <div className="jf-categories">
          <div className="jf-cat-pill active">All Categories</div>
          <div className="jf-cat-pill">Graphics & Design</div>
          <div className="jf-cat-pill">Programming & Tech</div>
          <div className="jf-cat-pill">Digital Marketing</div>
          <div className="jf-cat-pill">Video & Animation</div>
          <div className="jf-cat-pill">Writing & Translation</div>
          <div className="jf-cat-pill">Music & Audio</div>
          <div className="jf-cat-pill">Business</div>
      </div>

      {/* Popular Gigs */}
      <section className="jf-section" id="explore">
          <h2 className="jf-section-title">
              {gigsTitle}
          </h2>
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
              ) : jobError ? (
                <div className="jf-listing-state">
                  <div className="jf-listing-kicker">Gig Sync Offline</div>
                  <h3>Popular services could not be loaded.</h3>
                  <p>{jobError}</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="jf-listing-state">
                  <div className="jf-listing-kicker">Empty Gig Registry</div>
                  <h3>No live jobs are published yet.</h3>
                  <p>Add job records in the backend and this freelance grid will hydrate automatically.</p>
                </div>
              ) : (
                jobs.slice(0, 6).map((job, index) => {
                  const gig = mapJobToGig(job, index);
                  return (
                    <a className="jf-gig-link" href={`/product/${gig.slug}`} key={job.id}>
                      <GigCard {...gig} />
                    </a>
                  );
                })
              )}
          </div>
      </section>

      {/* Promo Block */}
      <section className="jf-promo">
          <div>
              <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>{promoTitle}</h2>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', fontSize: '1.2rem', lineHeight: 1.8 }}>
                  <li>✓ The best for every budget</li>
                  <li>✓ Quality work done quickly</li>
                  <li>✓ Protected payments, every time</li>
                  <li>✓ 24/7 support</li>
              </ul>
              <button className="jf-btn" style={{ backgroundColor: 'white', color: 'var(--jf-accent)' }}>{promoButton}</button>
          </div>
          <div className="d-none d-lg-block" style={{ width: '40%' }}>
              <img src={promoImage} alt="Team" style={{ width: '100%', borderRadius: '16px', transform: 'rotate(5deg)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }} />
          </div>
      </section>

      <FreelanceFooter />
    </div>
  );
}
