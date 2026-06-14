'use client';

import React, { useEffect, useState } from 'react';
import type { JobListing } from '@sellio/types';
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
  const [form, setForm] = useState({ name: '', email: '', phone: '', note: '' });
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
        const errorMsg = result.ok ? 'Job not found or API returned no data.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveJobFailure(slug, allowDemo, 'blue_collar');

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

    await handleApplySubmit(
      {
        name: form.name,
        email: form.email,
        portfolio: '',
        note: [form.phone && `Phone: ${form.phone}`, form.note].filter(Boolean).join('\n'),
      },
      {
        useFallback,
        storageKey: 'sellio_jobs_blue_collar_applications',
        jobId: job.id,
        jobTitle: job.title,
        companyName: job.company?.name,
      },
    );
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

  if (notFound || (!job && !useFallback)) {
    return (
      <main className="jbc-detail-page">
        <section className="jbc-detail-state" role="status">
          <div className="jbc-detail-kicker">Listing Unavailable</div>
          <h1>Job could not be loaded.</h1>
          <p>{apiError || 'The requested job does not exist or has been removed.'}</p>
          <a href={themeLink('/')} className="jbc-btn jbc-btn-primary">Return to Jobs</a>
        </section>
      </main>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <main className="jbc-detail-page">
      <a href={themeLink('/')} className="jbc-detail-back">&larr; Back to Latest Openings</a>

      {apiError && useFallback && (
        <div className="jbc-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="jbc" />
        </div>
      )}
      {apiError && !useFallback && (
        <div className="jbc-alert-slot">
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="jbc" />
        </div>
      )}

      <header className="jbc-detail-header">
        <div className="jbc-detail-kicker">{job.taxonomy?.category || 'Skilled Trade'}</div>
        <h1>{job.title}</h1>
        <div className="jbc-detail-company">{job.company?.name || 'Local Employer'}</div>
        <div className="jbc-detail-meta">
          <span>{job.location?.display || 'On-site'}</span>
          <span>{job.employment?.type || 'Full-Time'}</span>
          <span>{job.compensation?.range_compact || 'Competitive'}</span>
        </div>
      </header>

      <section className="jbc-detail-grid">
        <article className="jbc-detail-main">
          <h2>Job Overview</h2>
          <p>{job.description || 'This live job listing is synchronized from the Sellio jobs catalog.'}</p>
          {job.taxonomy?.tags && (
            <div className="jbc-detail-tags">
              {job.taxonomy.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          )}
        </article>

        <aside className="jbc-detail-sidebar">
          <div className="jbc-detail-salary">{job.compensation?.range_full || job.compensation?.range_compact || 'Competitive'}</div>
          <div className="jbc-detail-apply">
            <h3>Apply for this job</h3>
            {!useFallback && !user ? (
              <form onSubmit={(e) => { e.preventDefault(); void handleAuthSubmit({ name: form.name, email: form.email, portfolio: '', note: '' }); }}>
                <p>Sign in to apply for this job.</p>
                {formError && <div className="jbc-detail-error" role="alert">{formError}</div>}
                <label>Full Name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
                <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <button type="button" className="jbc-btn jbc-btn-primary" onClick={() => setAuthMode('login')} disabled={authMode === 'login'}>Login</button>
                  <button type="button" className="jbc-btn jbc-btn-primary" onClick={() => setAuthMode('register')} disabled={authMode === 'register'}>Register</button>
                </div>
                <label>Password<input required type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} /></label>
                <button className="jbc-btn jbc-btn-primary" type="submit" disabled={authBusy}>{authBusy ? 'Please wait…' : 'Sign in to apply'}</button>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                {formError && <div className="jbc-detail-error" role="alert">{formError}</div>}
                <label>Full Name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
                <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
                <label>Phone<input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
                <label>Cover Note<textarea rows={4} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label>
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
