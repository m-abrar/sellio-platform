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

interface JobApplication {
  id: number;
  job_id?: number;
  job_title?: string;
  company?: string;
  candidate_name: string;
  candidate_email: string;
  portfolio: string;
  cover_note: string;
  submitted_at: string;
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
    let isMounted = true;

    async function loadJob() {
      setLoading(true);
      setNotFound(false);
      const result = await fetchJobDetail(slug);

      if (!isMounted) return;

      if (result.ok && result.response.data) {
        setJob(result.response.data);
        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'Job not found or API returned no data.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveJobFailure(slug, allowDemo, 'corporate');

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
    return () => { isMounted = false; };
  }, [slug, allowDemo]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!job || !form.name || !form.email) {
      setFormError('Please enter your name and email to submit an application.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);
    setTimeout(() => {
      const application: JobApplication = {
        id: Date.now(),
        job_id: job.id,
        job_title: job.title,
        company: job.company?.name,
        candidate_name: form.name,
        candidate_email: form.email,
        portfolio: form.portfolio,
        cover_note: form.note,
        submitted_at: new Date().toISOString(),
      };

      try {
        const stored = JSON.parse(localStorage.getItem('sellio_jobs_corporate_applications') || '[]') as JobApplication[];
        stored.push(application);
        localStorage.setItem('sellio_jobs_corporate_applications', JSON.stringify(stored));
        setIsSubmitted(true);
        setForm({ name: '', email: '', portfolio: '', note: '' });
      } catch (error) {
        console.error('Failed to persist job application:', error);
        setFormError('Could not save your application locally. Please try again.');
      }
      setIsSubmitting(false);
    }, 800);
  };

  if (loading) {
    return (
      <main className="jc-detail-page" aria-busy="true">
        <div className="jc-detail-back-skeleton" />
        <section className="jc-detail-grid">
          <div className="jc-detail-main">
            <div className="jc-detail-line jc-detail-line-title" />
            <div className="jc-detail-line" />
            <div className="jc-detail-line jc-detail-line-short" />
          </div>
          <div className="jc-detail-sidebar jc-detail-skeleton" />
        </section>
      </main>
    );
  }

  if (notFound || !job) {
    return (
      <main className="jc-detail-page">
        <section className="jc-detail-state" role="status">
          <div className="jc-detail-kicker">Listing Unavailable</div>
          <h1>Job could not be loaded.</h1>
          <p>{apiError || 'The requested job does not exist or has been removed.'}</p>
          <a href={themeLink('')} className="jc-btn jc-btn-navy">Return to Jobs</a>
        </section>
      </main>
    );
  }

  return (
    <main className="jc-detail-page">
      <a href={themeLink('')} className="jc-detail-back">
        <span aria-hidden="true">&larr;</span>
        Back to Job Board
      </a>

      {apiError && useFallback && (
        <div className="jc-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="jc" />
        </div>
      )}

      <header className="jc-detail-header">
        <div className="jc-detail-kicker">{job.taxonomy?.category || 'Corporate Role'}</div>
        <h1>{job.title}</h1>
        <div className="jc-detail-company">{job.company?.name || 'Enterprise Partner'}</div>
        <div className="jc-detail-meta">
          <span>{job.location?.display || 'Remote'}</span>
          <span>{job.employment?.type || 'Full-Time'}</span>
          <span>{job.compensation?.range_compact || 'Competitive'}</span>
        </div>
      </header>

      <section className="jc-detail-grid">
        <article className="jc-detail-main">
          <h2>Role Overview</h2>
          <p>{job.description || 'This live job listing is synchronized from the Sellio jobs catalog.'}</p>

          <div className="jc-detail-specs">
            <div>
              <span>Workplace</span>
              <strong>{job.employment?.workplace || 'Hybrid'}</strong>
            </div>
            <div>
              <span>Experience</span>
              <strong>{job.employment?.experience_level || 'Mid-Senior'}</strong>
            </div>
            <div>
              <span>Education</span>
              <strong>{job.employment?.education || 'Relevant experience'}</strong>
            </div>
          </div>

          {job.taxonomy?.tags && job.taxonomy.tags.length > 0 && (
            <div className="jc-detail-tags">
              {job.taxonomy.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}
        </article>

        <aside className="jc-detail-sidebar">
          <div className="jc-detail-comp-card">
            <div className="jc-detail-kicker">Compensation</div>
            <div className="jc-detail-salary">{job.compensation?.range_full || job.compensation?.range_compact || 'Competitive'}</div>
          </div>

          <div className="jc-detail-apply">
            <h3>Apply for this role</h3>
            <p>Submit your application details. Saved locally for the preview flow.</p>

            {isSubmitted ? (
              <div className="jc-detail-success" role="status">
                Application saved successfully.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label>
                  Full Name
                  <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </label>
                <label>
                  Email
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </label>
                <label>
                  Portfolio / LinkedIn
                  <input type="url" value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} />
                </label>
                <label>
                  Cover Note
                  <textarea rows={4} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
                </label>
                {formError && <p className="jc-form-error" role="alert">{formError}</p>}
                <button className="jc-btn jc-btn-navy" type="submit" disabled={isSubmitting}>
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
