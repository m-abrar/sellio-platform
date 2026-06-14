'use client';
import React, { useEffect, useState } from 'react';
import { TechJobCard } from './components';
import { CatalogSyncAlert } from '@/themes/jobs/shared/CatalogSyncAlert';
import { fetchJobDetail, resolveJobFailure } from '@/themes/jobs/shared/catalog';
import {
  translateJobListingToTechJob,
  type TechJobCardData,
} from '@/themes/jobs/shared/job-utils';
import { useDemoFallbackAllowed } from '@/themes/jobs/shared/useDemoFallbackAllowed';
import { useJobApplyFlow } from '@/themes/jobs/shared/useJobApplyFlow';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';

type TechJob = TechJobCardData;

export default function ProductPage({ slug }: { slug: string }) {
  const themeLink = useJobsThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const [job, setJob] = useState<TechJob | null>(null);
  const [related, setRelated] = useState<TechJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [applicationReceipt, setApplicationReceipt] = useState<Record<string, string> | null>(null);
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
  } = useJobApplyFlow(slug);

  useEffect(() => {
    async function loadJobDetails() {
      setLoading(true);
      setNotFound(false);
      const result = await fetchJobDetail(slug);

      if (result.ok && result.response.data) {
        setJob(translateJobListingToTechJob(result.response.data));
        setRelated(
          (result.response.related_jobs || [])
            .slice(0, 3)
            .map(translateJobListingToTechJob),
        );
        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'Job not found or API returned no data.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveJobFailure(slug, allowDemo, 'tech');

        if (resolution.mode === 'demo') {
          setJob(translateJobListingToTechJob(resolution.job));
          setRelated(resolution.related.map(translateJobListingToTechJob));
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

    loadJobDetails();
  }, [slug, allowDemo]);

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job || !name || !email || !githubUrl) {
      return;
    }

    const result = await handleApplySubmit(
      { name, email, portfolio: githubUrl, note: coverNote },
      {
        useFallback,
        storageKey: 'sellio_jobs_tech_orders',
        jobId: Number(job.id),
        jobTitle: job.title,
        companyName: typeof job.company === 'string' ? job.company : undefined,
      },
    );

    if (result?.ok) {
      setApplicationReceipt({
        applicationId: String(result.applicationId),
        timestamp: new Date().toLocaleString(),
        jobTitle: job.title,
        company: typeof job.company === 'string' ? job.company : '',
        applicantName: name,
        applicantEmail: email,
        githubUrl,
        shaHash: `SHA256-${result.applicationId}`,
      });
      setName('');
      setEmail('');
      setGithubUrl('');
      setCoverNote('');
    }
  };

  if (loading) {
    return (
      <div className="jt-layout-base" style={{ padding: '4rem 6%', minHeight: '80vh', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .jt-shimmer {
            background: linear-gradient(90deg, #182235 25%, #24324d 50%, #182235 75%);
            background-size: 200% 100%;
            animation: jtShimmer 1.5s infinite linear;
          }
          @keyframes jtShimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}} />
        <div className="jt-shimmer" style={{ height: '300px', borderRadius: '16px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '4rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="jt-shimmer" style={{ height: '40px', width: '70%', borderRadius: '8px' }} />
            <div className="jt-shimmer" style={{ height: '20px', width: '90%', borderRadius: '8px' }} />
            <div className="jt-shimmer" style={{ height: '180px', borderRadius: '16px' }} />
          </div>
          <div className="jt-shimmer" style={{ height: '400px', borderRadius: '16px' }} />
        </div>
      </div>
    );
  }

  if (notFound || (!job && !useFallback)) {
    return (
      <div className="jt-layout-base text-center" style={{ padding: '8rem 2rem', color: 'var(--jt-text-main)' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Developer Node Not Resolved</h2>
        <p style={{ color: 'var(--jt-text-muted)', margin: '2rem 0 4rem' }}>{apiError || 'The requested engineering opportunity could not be recovered from DevJobs registries.'}</p>
        <a href={themeLink('/')} className="jt-btn jt-btn-primary" style={{ textDecoration: 'none' }}>Back to Listings</a>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <div className="jt-layout-base" style={{ padding: '0 6% 8rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '3rem 0 4rem' }}>
        <a
          href={themeLink('/')}
          style={{
            color: 'var(--jt-text-main)',
            fontWeight: 800,
            fontSize: '0.9rem',
            fontFamily: 'var(--jt-font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
          }}
        >
          ← Back to Listings
        </a>
      </div>

      {apiError && useFallback && (
        <div className="jt-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="jt" />
        </div>
      )}
      {apiError && !useFallback && (
        <div className="jt-alert-slot">
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="jt" />
        </div>
      )}

      {/* Details Sprawling Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '6rem', alignItems: 'start' }}>
        
        {/* Left main content block */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: '3.5rem' }}>
            <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '0.5rem', border: '1px solid var(--jt-border)' }}>
              <img src={job.logo} alt={job.company} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--jt-text-main)', letterSpacing: '-1.5px', marginBottom: '0.5rem', lineHeight: 1.15 }}>
                {job.title}
              </h1>
              <div style={{ fontSize: '1.25rem', color: 'var(--jt-purple)', fontWeight: 800, fontFamily: 'var(--jt-font-mono)' }}>
                {job.company}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '4rem' }} className="jt-job-tags">
            {job.skills.map((skill: string) => (
              <span key={skill} className="jt-skill-tag" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', fontWeight: 700 }}>
                {skill}
              </span>
            ))}
          </div>

          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--jt-text-main)', marginBottom: '1.5rem', fontFamily: 'var(--jt-font-mono)' }}>Opportunity specs</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
            {[
              { label: 'SALARY_RANGE', value: job.salary },
              { label: 'WORKPLACE_ARCHITECTURE', value: job.location },
              { label: 'ENGAGEMENT_PROFILE', value: job.type },
              { label: 'POSTED_TIMESTAMP', value: job.time }
            ].map((spec, i) => (
              <div key={i} style={{ padding: '1.5rem', background: 'var(--jt-bg-light)', borderRadius: '12px', border: '1px solid var(--jt-border)' }}>
                <div style={{ fontSize: '0.65rem', fontFamily: 'var(--jt-font-mono)', color: 'var(--jt-text-muted)', marginBottom: '0.5rem', fontWeight: 800 }}>{spec.label}</div>
                <div style={{ fontWeight: 800, color: 'var(--jt-text-main)', fontSize: '1rem' }}>{spec.value}</div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--jt-text-main)', marginBottom: '1.5rem', fontFamily: 'var(--jt-font-mono)' }}>Scope of Work & Autonomy</h3>
          <p style={{ fontSize: '1.1rem', color: 'var(--jt-text-muted)', lineHeight: 1.8 }}>
            {job.description}
          </p>
          
          <div style={{ background: 'rgba(168, 85, 247, 0.02)', border: '1px solid var(--jt-border)', padding: '3rem', borderRadius: '16px', marginTop: '4rem' }}>
            <h4 style={{ color: 'var(--jt-text-main)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', fontFamily: 'var(--jt-font-mono)' }}>{`./candidate_expectations.md`}</h4>
            <ul style={{ color: 'var(--jt-text-muted)', paddingLeft: '1.5rem', lineHeight: '1.8', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>Proven commercial systems delivery in core technical domains.</li>
              <li>High autonomy capacity. You'll operate directly with product leads and engineering squads.</li>
              <li>Strong testing advocacy and solid cryptographic/networking appreciation.</li>
            </ul>
          </div>
        </div>

        {/* Right Application sidebar desk */}
        <div>
          {applicationReceipt ? (
            /* Successful Application Invoice Receipt */
            <div style={{
              background: '#090d16',
              border: '2px solid var(--jt-purple)',
              padding: '4rem 3.5rem',
              borderRadius: '24px',
              color: 'white',
              boxShadow: 'var(--pr-shadow-lg)',
              animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <div className="jt-mono" style={{ color: 'var(--jt-purple)', marginBottom: '2rem', fontFamily: 'var(--jt-font-mono)', fontWeight: 800 }}>APPLICATION_PIPELINE_ROUTED</div>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '1.5rem', color: 'white' }}>Node Synced!</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.6, lineHeight: 1.7, marginBottom: '3rem' }}>
                Your candidate routing sequence completed successfully. Stripe, Linear or Vercel gateways have dispatched your node parameters.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2.5rem', marginBottom: '3.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ opacity: 0.4 }} className="jt-mono">ROUTE_REF_ID</span>
                  <span style={{ fontWeight: 800, fontFamily: 'monospace' }}>{applicationReceipt.applicationId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ opacity: 0.4 }} className="jt-mono">APPLICANT</span>
                  <span style={{ fontWeight: 800 }}>{applicationReceipt.applicantName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ opacity: 0.4 }} className="jt-mono">DISPATCH_GATE</span>
                  <span style={{ fontWeight: 800 }}>{applicationReceipt.applicantEmail}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ opacity: 0.4 }} className="jt-mono">GITHUB_NODE</span>
                  <span style={{ fontWeight: 800, color: 'var(--jt-purple)', textDecoration: 'underline' }} onClick={() => window.open(applicationReceipt.githubUrl, '_blank')}>{applicationReceipt.githubUrl.replace('https://', '')}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                  <span style={{ opacity: 0.4, fontSize: '0.75rem' }} className="jt-mono">SHA_256_VERIFICATION_HASH</span>
                  <span style={{ fontWeight: 800, color: 'var(--jt-purple)', fontSize: '0.75rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>{applicationReceipt.shaHash}</span>
                </div>
              </div>

              <button 
                className="jt-btn jt-btn-primary" 
                style={{ width: '100%', padding: '1.5rem', borderRadius: '8px' }}
                onClick={() => setApplicationReceipt(null)}
              >
                SUBMIT NEW APPLICATION
              </button>
            </div>
          ) : !useFallback && !user ? (
            <div style={{
              background: 'var(--jt-bg-light)',
              border: '1px solid var(--jt-border)',
              padding: '4rem 3.5rem',
              borderRadius: '24px',
              boxShadow: 'var(--pr-shadow-md)'
            }}>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1rem' }}>Sign in to apply</h3>
              <form onSubmit={(e) => { e.preventDefault(); void handleAuthSubmit({ name, email, portfolio: githubUrl, note: coverNote }); }}>
                {formError && <p style={{ color: '#f87171', marginBottom: '1rem' }} role="alert">{formError}</p>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  <input type="text" required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="jt-search-input" />
                  <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="jt-search-input" />
                  <input type="password" required placeholder="Password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="jt-search-input" />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <button type="button" className="jt-btn jt-btn-primary" onClick={() => setAuthMode('login')} disabled={authMode === 'login'}>Login</button>
                  <button type="button" className="jt-btn jt-btn-primary" onClick={() => setAuthMode('register')} disabled={authMode === 'register'}>Register</button>
                </div>
                <button type="submit" className="jt-btn jt-btn-primary" disabled={authBusy}>{authBusy ? 'Please wait…' : 'Continue'}</button>
              </form>
            </div>
          ) : (
            /* Stateful application form desk */
            <div style={{
              background: 'var(--jt-bg-light)',
              border: '1px solid var(--jt-border)',
              padding: '4rem 3.5rem',
              borderRadius: '24px',
              boxShadow: 'var(--pr-shadow-md)'
            }}>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--jt-text-main)', marginBottom: '1rem', fontFamily: 'var(--jt-font-mono)' }}>Apply Directly</h3>
              <p style={{ color: 'var(--jt-text-muted)', fontSize: '0.9rem', marginBottom: '3rem', lineHeight: 1.6 }}>
                Submit your developer specifications node directly to the engineering lead directory with absolute data provenance.
              </p>

              <form onSubmit={handleApplicationSubmit}>
                {formError && (
                  <p style={{ color: '#f87171', marginBottom: '1rem', fontSize: '0.9rem' }} role="alert">{formError}</p>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3.5rem' }}>
                  <div>
                    <label className="pr-booking-label" style={{ fontSize: '0.7rem', color: 'var(--jt-text-muted)', display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--jt-font-mono)' }}>Full Name</label>
                    <input 
                      type="text"
                      className="jt-search-input"
                      style={{ width: '100%', backgroundColor: 'var(--jt-bg)', border: '1px solid var(--jt-border)', color: 'var(--jt-text-main)', padding: '0.8rem 1.2rem', borderRadius: '8px', outline: 'none' }}
                      placeholder="e.g. Linus Torvalds"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="pr-booking-label" style={{ fontSize: '0.7rem', color: 'var(--jt-text-muted)', display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--jt-font-mono)' }}>Email Address</label>
                    <input 
                      type="email"
                      className="jt-search-input"
                      style={{ width: '100%', backgroundColor: 'var(--jt-bg)', border: '1px solid var(--jt-border)', color: 'var(--jt-text-main)', padding: '0.8rem 1.2rem', borderRadius: '8px', outline: 'none' }}
                      placeholder="e.g. linus@kernel.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="pr-booking-label" style={{ fontSize: '0.7rem', color: 'var(--jt-text-muted)', display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--jt-font-mono)' }}>GitHub Profile Link</label>
                    <input 
                      type="url"
                      className="jt-search-input"
                      style={{ width: '100%', backgroundColor: 'var(--jt-bg)', border: '1px solid var(--jt-border)', color: 'var(--jt-text-main)', padding: '0.8rem 1.2rem', borderRadius: '8px', outline: 'none' }}
                      placeholder="e.g. https://github.com/torvalds"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="pr-booking-label" style={{ fontSize: '0.7rem', color: 'var(--jt-text-muted)', display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--jt-font-mono)' }}>Cover Letter Notes</label>
                    <textarea 
                      className="jt-search-input"
                      rows={4}
                      style={{ width: '100%', backgroundColor: 'var(--jt-bg)', border: '1px solid var(--jt-border)', color: 'var(--jt-text-main)', padding: '0.8rem 1.2rem', borderRadius: '8px', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                      placeholder="Summary of developer node specs or significant systems built..."
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="jt-btn jt-btn-primary"
                  style={{ width: '100%', padding: '1.6rem', borderRadius: '8px', fontSize: '1rem' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'AUTHORIZING DISPATCH...' : '⚡ INITIALIZE APPLICATION GATEWAY'}
                </button>
              </form>
            </div>
          )}
        </div>

      </div>

      {/* Suggested related developer roles carousel */}
      <section style={{ marginTop: '12rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--jt-text-main)', marginBottom: '1rem', letterSpacing: '-1.5px', fontFamily: 'var(--jt-font-mono)' }}>Suggested Roles</h2>
        <p style={{ color: 'var(--jt-text-muted)', marginBottom: '4rem' }}>Alternative engineering listings matching active category stacks.</p>
        
        <div className="jt-job-list">
          {related.map((r, i) => (
            <a key={i} href={themeLink(`/product/${r.slug}`)} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <TechJobCard {...r} />
            </a>
          ))}
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
