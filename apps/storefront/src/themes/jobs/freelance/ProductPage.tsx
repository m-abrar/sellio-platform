'use client';

import React, { useEffect, useState } from 'react';
import type { JobListing } from '@/types';
import { CatalogSyncAlert } from '@/themes/jobs/shared/CatalogSyncAlert';
import { fetchJobDetail, resolveJobFailure } from '@/themes/jobs/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/jobs/shared/useDemoFallbackAllowed';
import { useJobApplyFlow } from '@/themes/jobs/shared/useJobApplyFlow';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';
import {
  saveJobApplicationSnapshot,
  redirectToJobApplicationConfirmation,
} from '@/themes/jobs/shared/job-application-confirmation';

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
    formError,
    handleAuthSubmit,
    handleApplySubmit,
  } = useJobApplyFlow(slug, {
    onSuccess: (appId) => {
      saveJobApplicationSnapshot({
        id: appId,
        jobId: job?.id ?? 0,
        jobTitle: job?.title ?? 'Job Application',
        jobSlug: job?.slug,
        applicantName: form.name,
        applicantEmail: form.email,
        status: 'pending',
      });
      redirectToJobApplicationConfirmation(themeLink, appId);
    },
  });

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!job) return;

    await handleApplySubmit(form, {
      useFallback,
      storageKey: 'sellio_jobs_freelance_applications',
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.company?.name,
    });
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
            {!useFallback && !user ? (
              <form onSubmit={(e) => { e.preventDefault(); void handleAuthSubmit(form); }}>
                <p>Sign in to submit your request.</p>
                {formError && <div className="jf-detail-error" role="alert">{formError}</div>}
                <label>Full Name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
                <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <button type="button" className="jf-btn jf-btn-primary" onClick={() => setAuthMode('login')} disabled={authMode === 'login'}>Login</button>
                  <button type="button" className="jf-btn jf-btn-primary" onClick={() => setAuthMode('register')} disabled={authMode === 'register'}>Register</button>
                </div>
                <label>Password<input required type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} /></label>
                <button className="jf-btn jf-btn-primary" type="submit" disabled={authBusy}>{authBusy ? 'Please wait…' : 'Sign in to apply'}</button>
              </form>
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
