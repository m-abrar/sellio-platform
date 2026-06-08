'use client';

import React, { useEffect, useState } from 'react';
import type { JobListing } from '@sellio/types';
import { CatalogSyncAlert } from '@/themes/jobs/shared/CatalogSyncAlert';
import { fetchJobDetail, resolveJobFailure } from '@/themes/jobs/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/jobs/shared/useDemoFallbackAllowed';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';

interface ProductPageProps {
  slug: string;
}

export default function ProductPage({ slug }: ProductPageProps) {
  const themeLink = useJobsThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', portfolio: '', note: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function loadJob() {
      setLoading(true);
      setNotFound(false);
      const result = await fetchJobDetail(slug);

      if (result.ok && result.response.data) {
        setJob(result.response.data);
        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'Gig not found or API returned no data.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveJobFailure(slug, allowDemo, 'freelance');

        if (resolution.mode === 'demo') {
          setJob(resolution.job);
          setUseFallback(true);
        } else if (resolution.mode === 'notFound') {
          setJob(null);
          setNotFound(true);
          setUseFallback(false);
        } else {
          setJob(null);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadJob();
  }, [slug, allowDemo]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!job || !form.name || !form.email) {
      setFormError('Please enter your name and email to apply.');
      return;
    }

    setFormError(null);
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

  if (notFound || (!job && !useFallback)) {
    return (
      <main className="jf-detail-page">
        <section className="jf-detail-state" role="status">
          <div className="jf-detail-kicker">Gig Unavailable</div>
          <h1>Gig could not be loaded.</h1>
          <p>{apiError || 'The requested gig does not exist or has been removed.'}</p>
          <a href={themeLink('/')} className="jf-btn jf-btn-primary">Return to Gigs</a>
        </section>
      </main>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <main className="jf-detail-page">
      <a href={themeLink('/')} className="jf-detail-back">&larr; Back to Popular Services</a>

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

      <header className="jf-detail-header">
        <div className="jf-detail-kicker">{job.taxonomy?.category || 'Professional Service'}</div>
        <h1>{job.title}</h1>
        <div className="jf-detail-company">{job.company?.name || 'Top Freelancer'}</div>
        <div className="jf-detail-meta">
          <span>{job.location?.display || 'Remote'}</span>
          <span>{job.employment?.type || 'Contract'}</span>
          <span>{job.compensation?.range_compact || 'Quote on request'}</span>
        </div>
      </header>

      <section className="jf-detail-grid">
        <article className="jf-detail-main">
          <h2>Service Overview</h2>
          <p>{job.description || 'This live gig listing is synchronized from the Sellio jobs catalog.'}</p>
          {job.taxonomy?.tags && (
            <div className="jf-detail-tags">
              {job.taxonomy.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          )}
        </article>

        <aside className="jf-detail-sidebar">
          <div className="jf-detail-salary">{job.compensation?.range_full || job.compensation?.range_compact || 'Quote on request'}</div>
          <div className="jf-detail-apply">
            <h3>Request this service</h3>
            {isSubmitted ? (
              <div className="jf-detail-success" role="status">Request saved.</div>
            ) : (
              <form onSubmit={handleSubmit}>
                {formError && <div className="jf-detail-error" role="alert">{formError}</div>}
                <label>Full Name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
                <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
                <label>Portfolio<input type="url" value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} /></label>
                <label>Project Brief<textarea rows={4} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label>
                <button className="jf-btn jf-btn-primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}
