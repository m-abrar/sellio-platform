'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { JobListing } from '@sellio/types';

interface ProductPageProps {
  slug: string;
}

function getThemeLink(path: string) {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/preview/')) {
    const themeKey = window.location.pathname.split('/')[2];
    return `/preview/${themeKey}${path}`;
  }
  return path || '/';
}

export default function ProductPage({ slug }: ProductPageProps) {
  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', portfolio: '', note: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadJob() {
      try {
        const response = await api.getJobDetails(slug);
        if (!isMounted) return;
        if (response?.data) {
          setJob(response.data);
          setErrorMessage(null);
        } else {
          setErrorMessage('Job listing not found.');
        }
      } catch (error: unknown) {
        if (!isMounted) return;
        console.error('Failed to load jobs modern detail:', error);
        setErrorMessage(error instanceof Error ? error.message : 'The job listing could not be synchronized.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadJob();
    return () => { isMounted = false; };
  }, [slug]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!job || !form.name || !form.email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem('sellio_jobs_modern_applications') || '[]');
        stored.push({
          id: Date.now(),
          job_id: job.id,
          job_title: job.title,
          company: job.company?.name,
          candidate_name: form.name,
          candidate_email: form.email,
          portfolio: form.portfolio,
          cover_note: form.note,
          submitted_at: new Date().toISOString(),
        });
        localStorage.setItem('sellio_jobs_modern_applications', JSON.stringify(stored));
        setIsSubmitted(true);
        setForm({ name: '', email: '', portfolio: '', note: '' });
      } catch (error) {
        console.error('Failed to persist job application:', error);
      }
      setIsSubmitting(false);
    }, 800);
  };

  if (loading) {
    return (
      <main className="jm-detail-page" aria-busy="true">
        <div className="jm-detail-back-skeleton" />
        <section className="jm-detail-grid">
          <div className="jm-detail-main jm-glass">
            <div className="jm-detail-line jm-detail-line-title" />
            <div className="jm-detail-line" />
          </div>
          <div className="jm-detail-sidebar jm-detail-skeleton" />
        </section>
      </main>
    );
  }

  if (errorMessage || !job) {
    return (
      <main className="jm-detail-page">
        <section className="jm-detail-state jm-glass" role="status">
          <div className="jm-detail-kicker">Listing Unavailable</div>
          <h1>Role could not be loaded.</h1>
          <p>{errorMessage || 'The requested job does not exist or has been removed.'}</p>
          <a href={getThemeLink('')} className="jm-btn jm-btn-primary">Return to Jobs</a>
        </section>
      </main>
    );
  }

  return (
    <main className="jm-detail-page">
      <a href={getThemeLink('')} className="jm-detail-back">&larr; Back to Curated Roles</a>

      <header className="jm-detail-header jm-glass">
        <div className="jm-detail-kicker">{job.taxonomy?.category || 'Modern Role'}</div>
        <h1>{job.title}</h1>
        <div className="jm-detail-company">{job.company?.name || 'Growth Company'}</div>
        <div className="jm-detail-meta">
          <span>{job.location?.display || 'Remote'}</span>
          <span>{job.employment?.type || 'Full-Time'}</span>
          <span>{job.compensation?.range_compact || 'Competitive'}</span>
        </div>
      </header>

      <section className="jm-detail-grid">
        <article className="jm-detail-main jm-glass">
          <h2>Role Overview</h2>
          <p>{job.description || 'This live job listing is synchronized from the Sellio jobs catalog.'}</p>
          <div className="jm-detail-specs">
            <div><span>Workplace</span><strong>{job.employment?.workplace || 'Hybrid'}</strong></div>
            <div><span>Experience</span><strong>{job.employment?.experience_level || 'Mid-Senior'}</strong></div>
            <div><span>Education</span><strong>{job.employment?.education || 'Relevant experience'}</strong></div>
          </div>
          {job.taxonomy?.tags && (
            <div className="jm-detail-tags">
              {job.taxonomy.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          )}
        </article>

        <aside className="jm-detail-sidebar jm-glass">
          <div className="jm-detail-salary">{job.compensation?.range_full || job.compensation?.range_compact || 'Competitive'}</div>
          <div className="jm-detail-apply">
            <h3>Apply for this role</h3>
            {isSubmitted ? (
              <div className="jm-detail-success" role="status">Application saved.</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label>Full Name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
                <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
                <label>Portfolio<input type="url" value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} /></label>
                <label>Cover Note<textarea rows={4} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label>
                <button className="jm-btn jm-btn-primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}
