'use client';

import React, { useEffect, useState } from 'react';
import type { JobListing } from '@sellio/types';
import { CatalogSyncAlert } from '@/themes/jobs/shared/CatalogSyncAlert';
import { fetchJobDetail, resolveJobFailure } from '@/themes/jobs/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/jobs/shared/useDemoFallbackAllowed';
import { useJobApplyFlow } from '@/themes/jobs/shared/useJobApplyFlow';
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
  const {
    user,
    authMode,
    setAuthMode,
    authPassword,
    setAuthPassword,
    authBusy,
    isSubmitting,
    applicationId,
    isSubmitted,
    formError,
    handleAuthSubmit,
    handleApplySubmit,
  } = useJobApplyFlow(slug);

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
        const errorMsg = result.ok ? 'Job not found or API returned no data.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveJobFailure(slug, allowDemo, 'modern');

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!job) return;

    await handleApplySubmit(form, {
      useFallback,
      storageKey: 'sellio_jobs_modern_applications',
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.company?.name,
    });
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

  if (notFound || (!job && !useFallback)) {
    return (
      <main className="jm-detail-page">
        <section className="jm-detail-state jm-glass" role="status">
          <div className="jm-detail-kicker">Listing Unavailable</div>
          <h1>Role could not be loaded.</h1>
          <p>{apiError || 'The requested job does not exist or has been removed.'}</p>
          <a href={themeLink('/')} className="jm-btn jm-btn-primary">Return to Jobs</a>
        </section>
      </main>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <main className="jm-detail-page">
      <a href={themeLink('/')} className="jm-detail-back">&larr; Back to Curated Roles</a>

      {apiError && useFallback && (
        <div className="jm-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="jm" />
        </div>
      )}
      {apiError && !useFallback && (
        <div className="jm-alert-slot">
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="jm" />
        </div>
      )}

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
              <div className="jm-detail-success" role="status">
                {useFallback ? 'Application saved.' : `Application #${applicationId ?? '—'} submitted.`}
              </div>
            ) : !useFallback && !user ? (
              <form onSubmit={(e) => { e.preventDefault(); void handleAuthSubmit(form); }}>
                <p>Sign in to apply for this role.</p>
                {formError && <div className="jm-detail-error" role="alert">{formError}</div>}
                <label>Full Name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
                <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <button type="button" className="jm-btn jm-btn-primary" onClick={() => setAuthMode('login')} disabled={authMode === 'login'}>Login</button>
                  <button type="button" className="jm-btn jm-btn-primary" onClick={() => setAuthMode('register')} disabled={authMode === 'register'}>Register</button>
                </div>
                <label>Password<input required type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} /></label>
                <button className="jm-btn jm-btn-primary" type="submit" disabled={authBusy}>{authBusy ? 'Please wait…' : 'Sign in to apply'}</button>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                {formError && <div className="jm-detail-error" role="alert">{formError}</div>}
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
