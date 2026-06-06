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
  const [form, setForm] = useState({ name: '', email: '', phone: '', note: '' });
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
        console.error('Failed to load jobs blue_collar detail:', error);
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
        const stored = JSON.parse(localStorage.getItem('sellio_jobs_blue_collar_applications') || '[]');
        stored.push({
          id: Date.now(),
          job_id: job.id,
          job_title: job.title,
          company: job.company?.name,
          candidate_name: form.name,
          candidate_email: form.email,
          phone: form.phone,
          cover_note: form.note,
          submitted_at: new Date().toISOString(),
        });
        localStorage.setItem('sellio_jobs_blue_collar_applications', JSON.stringify(stored));
        setIsSubmitted(true);
        setForm({ name: '', email: '', phone: '', note: '' });
      } catch (error) {
        console.error('Failed to persist job application:', error);
      }
      setIsSubmitting(false);
    }, 800);
  };

  if (loading) {
    return (
      <main className="jbc-detail-page" aria-busy="true">
        <div className="jbc-detail-back-skeleton" />
        <section className="jbc-detail-grid">
          <div className="jbc-detail-main">
            <div className="jbc-detail-line jbc-detail-line-title" />
            <div className="jbc-detail-line" />
          </div>
          <div className="jbc-detail-sidebar jbc-detail-skeleton" />
        </section>
      </main>
    );
  }

  if (errorMessage || !job) {
    return (
      <main className="jbc-detail-page">
        <section className="jbc-detail-state" role="status">
          <div className="jbc-detail-kicker">Opening Unavailable</div>
          <h1>Job could not be loaded.</h1>
          <p>{errorMessage || 'The requested opening does not exist or has been removed.'}</p>
          <a href={getThemeLink('')} className="jbc-btn jbc-btn-primary">Return to Openings</a>
        </section>
      </main>
    );
  }

  return (
    <main className="jbc-detail-page">
      <a href={getThemeLink('')} className="jbc-detail-back">&larr; Back to Latest Openings</a>

      <header className="jbc-detail-header">
        <div className="jbc-detail-kicker">{job.taxonomy?.category || 'Skilled Trade'}</div>
        <h1>{job.title}</h1>
        <div className="jbc-detail-company">{job.company?.name || 'Local Employer'}</div>
        <div className="jbc-detail-meta">
          <span>{job.location?.display || 'On-site'}</span>
          <span>{job.employment?.type || 'Full-Time'}</span>
          <span>{job.compensation?.range_compact || 'Hourly + Benefits'}</span>
        </div>
      </header>

      <section className="jbc-detail-grid">
        <article className="jbc-detail-main">
          <h2>Job Description</h2>
          <p>{job.description || 'This live job opening is synchronized from the Sellio jobs catalog.'}</p>
          <div className="jbc-detail-specs">
            <div><span>Workplace</span><strong>{job.employment?.workplace || 'On-site'}</strong></div>
            <div><span>Experience</span><strong>{job.employment?.experience_level || 'All levels'}</strong></div>
            <div><span>Schedule</span><strong>{job.employment?.type || 'Full-Time'}</strong></div>
          </div>
          {job.taxonomy?.tags && (
            <div className="jbc-detail-tags">
              {job.taxonomy.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          )}
        </article>

        <aside className="jbc-detail-sidebar">
          <div className="jbc-detail-salary">{job.compensation?.range_full || job.compensation?.range_compact || 'Competitive Pay'}</div>
          <div className="jbc-detail-apply">
            <h3>Apply Now</h3>
            {isSubmitted ? (
              <div className="jbc-detail-success" role="status">Application submitted.</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label>Full Name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
                <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
                <label>Phone<input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
                <label>Notes<textarea rows={4} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label>
                <button className="jbc-btn jbc-btn-primary" type="submit" disabled={isSubmitting}>
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
