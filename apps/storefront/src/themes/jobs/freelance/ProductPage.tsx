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
          setErrorMessage('Gig listing not found.');
        }
      } catch (error: unknown) {
        if (!isMounted) return;
        console.error('Failed to load jobs freelance detail:', error);
        setErrorMessage(error instanceof Error ? error.message : 'The gig listing could not be synchronized.');
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
        const stored = JSON.parse(localStorage.getItem('sellio_jobs_freelance_applications') || '[]');
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
        localStorage.setItem('sellio_jobs_freelance_applications', JSON.stringify(stored));
        setIsSubmitted(true);
        setForm({ name: '', email: '', portfolio: '', note: '' });
      } catch (error) {
        console.error('Failed to persist gig application:', error);
      }
      setIsSubmitting(false);
    }, 800);
  };

  if (loading) {
    return (
      <main className="jf-detail-page" aria-busy="true">
        <div className="jf-detail-back-skeleton" />
        <section className="jf-detail-grid">
          <div className="jf-detail-main">
            <div className="jf-detail-line jf-detail-line-title" />
            <div className="jf-detail-line" />
          </div>
          <div className="jf-detail-sidebar jf-detail-skeleton" />
        </section>
      </main>
    );
  }

  if (errorMessage || !job) {
    return (
      <main className="jf-detail-page">
        <section className="jf-detail-state" role="status">
          <div className="jf-detail-kicker">Gig Unavailable</div>
          <h1>Gig could not be loaded.</h1>
          <p>{errorMessage || 'The requested gig does not exist or has been removed.'}</p>
          <a href={getThemeLink('')} className="jf-btn jf-btn-primary">Return to Gigs</a>
        </section>
      </main>
    );
  }

  return (
    <main className="jf-detail-page">
      <a href={getThemeLink('')} className="jf-detail-back">&larr; Back to Popular Gigs</a>

      <header className="jf-detail-header">
        <div className="jf-detail-kicker">{job.taxonomy?.category || 'Professional Service'}</div>
        <h1>{job.title}</h1>
        <div className="jf-detail-company">{job.company?.name || 'Independent Client'}</div>
        <div className="jf-detail-meta">
          <span>{job.location?.display || 'Remote'}</span>
          <span>{job.employment?.type || 'Contract'}</span>
          <span>{job.compensation?.range_compact || 'Project rate'}</span>
        </div>
      </header>

      <section className="jf-detail-grid">
        <article className="jf-detail-main">
          <h2>Gig Overview</h2>
          <p>{job.description || 'This live gig listing is synchronized from the Sellio jobs catalog.'}</p>
          <div className="jf-detail-specs">
            <div><span>Workplace</span><strong>{job.employment?.workplace || 'Remote'}</strong></div>
            <div><span>Experience</span><strong>{job.employment?.experience_level || 'Professional'}</strong></div>
            <div><span>Engagement</span><strong>{job.employment?.type || 'Contract'}</strong></div>
          </div>
          {job.taxonomy?.tags && (
            <div className="jf-detail-tags">
              {job.taxonomy.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          )}
        </article>

        <aside className="jf-detail-sidebar">
          <div className="jf-detail-salary">{job.compensation?.range_full || job.compensation?.range_compact || 'Project rate'}</div>
          <div className="jf-detail-apply">
            <h3>Submit Proposal</h3>
            {isSubmitted ? (
              <div className="jf-detail-success" role="status">Proposal saved.</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label>Full Name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
                <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
                <label>Portfolio URL<input type="url" value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} /></label>
                <label>Proposal<textarea rows={4} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label>
                <button className="jf-btn jf-btn-primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Send Proposal'}
                </button>
              </form>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}
