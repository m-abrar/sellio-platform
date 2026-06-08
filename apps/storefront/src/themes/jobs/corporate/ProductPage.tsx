'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { JobListing } from '@sellio/types';

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
        console.error('Failed to load jobs corporate detail:', error);
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

  if (errorMessage || !job) {
    return (
      <main className="jc-detail-page">
        <section className="jc-detail-state" role="status">
          <div className="jc-detail-kicker">Listing Unavailable</div>
          <h1>Job could not be loaded.</h1>
          <p>{errorMessage || 'The requested job does not exist or has been removed.'}</p>
          <a href={getThemeLink('')} className="jc-btn jc-btn-navy">Return to Jobs</a>
        </section>
      </main>
    );
  }

  return (
    <main className="jc-detail-page">
      <a href={getThemeLink('')} className="jc-detail-back">
        <span aria-hidden="true">&larr;</span>
        Back to Job Board
      </a>

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
