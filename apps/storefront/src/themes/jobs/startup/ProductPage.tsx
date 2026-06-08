'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { JobListing } from '@sellio/types';

interface ProductPageProps {
  slug: string;
}

interface JobApplicationForm {
  name: string;
  email: string;
  portfolio: string;
  note: string;
}

export default function ProductPage({ slug }: ProductPageProps) {
  const [job, setJob] = useState<JobListing | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Concierge Form state
  const [form, setForm] = useState<JobApplicationForm>({ name: '', email: '', portfolio: '', note: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Active preview router link helper
  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        const segments = window.location.pathname.split('/');
        const themeKey = segments[2];
        return `/preview/${themeKey}${path}`;
      }
    }
    return path;
  };

  useEffect(() => {
    async function loadJobDetails() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.getJobDetails(slug);
        if (response && response.data) {
          setJob(response.data);
          if (response.related_jobs) {
            setRelatedJobs(response.related_jobs.slice(0, 3));
          }
        }
      } catch (err: any) {
        console.error("Failed to load live job details, fallback to static mock content:", err);
        setError(err.message || 'Failed to sync live database job parameters.');
        
        // Premium fallback mockup based on the slug
        const fallbackJobs: Record<string, JobListing> = {
          'nexus-rust-engineer': {
            id: 991,
            title: "Founding Engineer (Rust)",
            slug: "nexus-rust-engineer",
            description: "Nexus.AI is looking for an elite Founding Rust Engineer to architect our high-throughput distributed system node pipelines. You will own the core messaging substrate and compile lightning-fast, sandboxed client processes.",
            employment: {
              type: "Full-time",
              workplace: "Remote",
              workplace_id: 1,
              experience_level: "Senior / Principal",
              education: "B.Sc. / M.Sc. in Computer Science or Equivalent",
              is_full_time: true,
              is_contract: false
            },
            compensation: {
              min: 140000,
              max: 210000,
              frequency: "yearly",
              range_compact: "$140k–$210k/yr",
              range_full: "$140,000 - $210,000/yr"
            },
            company: {
              name: "Nexus.AI",
              logo: null
            },
            taxonomy: {
              category: "Engineering",
              badge_class: "bg-primary-subtle text-primary-emphasis",
              tags: ["Rust", "Distributed Systems", "WebAssembly", "Series A"]
            },
            location: {
              display: "San Francisco / Remote",
              city: "San Francisco",
              country: "United States"
            },
            status: {
              is_published: true,
              is_featured: true,
              is_expired: false
            }
          }
        };

        const resolvedFallback = fallbackJobs[slug] || {
          id: 999,
          title: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          slug: slug,
          description: "Hypergrowth startup looking for a mission-critical specialist to optimize our dynamic corporate networks and implement foundational microservice systems.",
          employment: {
            type: "Full-time",
            workplace: "Hybrid",
            workplace_id: 3,
            experience_level: "Senior Level",
            education: "Relevant industry experience",
            is_full_time: true,
            is_contract: false
          },
          compensation: {
            min: 120000,
            max: 180000,
            frequency: "yearly",
            range_compact: "$120k–$180k/yr",
            range_full: "$120,000 - $180,000/yr"
          },
          company: {
            name: "Venture Corp",
            logo: null
          },
          taxonomy: {
            category: "Technical Talent",
            tags: ["Startup", "Next.js", "Docker", "Seed"]
          },
          location: {
            display: "Berlin / Remote",
            city: "Berlin",
            country: "Germany"
          },
          status: {
            is_published: true,
            is_featured: false,
            is_expired: false
          }
        };

        setJob(resolvedFallback);
      } finally {
        setLoading(false);
      }
    }

    loadJobDetails();
  }, [slug]);

  // Form submit handler
  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    setIsSubmitting(true);

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const storedApplications = JSON.parse(localStorage.getItem('sellio_jobs_startup_applications') || '[]');
        const newApplication = {
          id: Date.now(),
          job_id: job?.id,
          job_title: job?.title,
          company: job?.company?.name,
          candidate_name: form.name,
          candidate_email: form.email,
          portfolio: form.portfolio,
          cover_note: form.note,
          submitted_at: new Date().toISOString()
        };
        storedApplications.push(newApplication);
        localStorage.setItem('sellio_jobs_startup_applications', JSON.stringify(storedApplications));
      }
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="growth-details-header" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="growth-skeleton" style={{ width: '120px', height: '24px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}></div>
        <div className="growth-skeleton" style={{ width: '40%', height: '50px', marginTop: '2rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }}></div>
        <div className="growth-skeleton" style={{ width: '20%', height: '30px', marginTop: '1.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-20 text-center" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'white' }}>Node Registry Error</h2>
        <p style={{ color: 'var(--growth-dim)' }}>Job listing with slug {slug} could not be synchronized.</p>
        <a href={getThemeLink('/explore')} className="growth-btn-outline" style={{ display: 'inline-block', margin: '2rem auto', textDecoration: 'none' }}>
          &larr; BACK_TO_CONSOLE
        </a>
      </div>
    );
  }

  const isRemote = job.employment?.workplace_id === 1;
  const isHybrid = job.employment?.workplace_id === 3;
  const isOnsite = job.employment?.workplace_id === 2;

  // Custom mocked equity parameters for Jobs Startup themes based on job ID
  const equityShareLow = (job.id % 3 === 0) ? '1.5%' : (job.id % 2 === 0) ? '1.0%' : '0.5%';
  const equityShareHigh = (job.id % 3 === 0) ? '2.5%' : (job.id % 2 === 0) ? '2.0%' : '1.5%';
  const percentFill = (job.id % 3 === 0) ? '75%' : (job.id % 2 === 0) ? '50%' : '30%';

  return (
    <div>
      {/* Header Banner */}
      <header className="growth-details-header">
        <div className="growth-details-glow"></div>
        
        {/* Connection Exception trace during active outages */}
        {error && (
          <div className="growth-offline-panel" style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>⚠️</span>
              <div style={{ fontWeight: 700, letterSpacing: '1px', color: '#f87171' }}>DATABASE_OFFLINE_DIAGNOSTICS_TRACE</div>
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8, lineHeight: 1.5 }}>
              STATUS: [OFFLINE] | LATENCY: [TIMEOUT] | REASON: [{error}]
              <br/>
              ACTION: Activated local offline resiliency framework. Serving verified seed/series-A static fallback nodes...
            </div>
          </div>
        )}

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
            <a 
              href={getThemeLink('/explore')} 
              style={{ color: 'var(--growth-neon)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '2px' }}
            >
              &larr; BACK_TO_CONSOLE
            </a>
            <span style={{ color: 'var(--growth-dim)' }}>/</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--growth-dim)', letterSpacing: '2px', fontWeight: 600 }}>
              {job.taxonomy?.category?.toUpperCase() || 'ENGINEERING'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="venture-logo" style={{ width: '80px', height: '80px', borderRadius: '16px', background: 'var(--growth-purple)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2.5rem', fontWeight: 900, color: 'white' }}>
              {job.company?.name ? job.company.name[0] : 'V'}
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', fontWeight: 700, color: 'white', margin: 0, letterSpacing: '-2px' }}>
                {job.title}
              </h1>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--growth-neon)', marginTop: '0.5rem' }}>
                {job.company?.name || 'Venture Startup'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <section className="growth-details-grid">
        {/* Main Content Area */}
        <div className="growth-detail-main">
          {/* Details Overview Panel */}
          <div className="growth-panel" style={{ padding: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'white', fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--growth-border)', paddingBottom: '1rem' }}>
              MISSION_OBJECTIVE
            </h2>
            <p style={{ color: 'var(--growth-dim)', fontSize: '1.1rem', lineHeight: 1.8, margin: 0 }}>
              {job.description}
            </p>
          </div>

          {/* Specifications Grid */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'white', fontSize: '1.8rem', marginBottom: '1.5rem' }}>
              NODE_SPECIFICATIONS
            </h2>
            <div className="growth-spec-grid">
              <div className="growth-spec-card growth-panel">
                <div className="growth-spec-title">Workplace Model</div>
                <div className="growth-spec-value">{job.employment?.workplace || 'Remote'}</div>
              </div>
              <div className="growth-spec-card growth-panel">
                <div className="growth-spec-title">Employment Arrangement</div>
                <div className="growth-spec-value">{job.employment?.type || 'Full-time'}</div>
              </div>
              <div className="growth-spec-card growth-panel">
                <div className="growth-spec-title">Experience Level</div>
                <div className="growth-spec-value">{job.employment?.experience_level || 'Senior Level'}</div>
              </div>
              <div className="growth-spec-card growth-panel">
                <div className="growth-spec-title">Required Education</div>
                <div className="growth-spec-value">{job.employment?.education || 'Equiv Experience'}</div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {job.taxonomy?.tags && job.taxonomy.tags.length > 0 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'white', fontSize: '1.2rem', marginBottom: '1rem', letterSpacing: '1px' }}>
                TECHNOLOGY_TAGS
              </h2>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {job.taxonomy.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    style={{ 
                      fontSize: '0.8rem', 
                      background: 'rgba(255,255,255,0.05)', 
                      border: '1px solid var(--growth-border)', 
                      padding: '0.5rem 1.25rem', 
                      borderRadius: '8px', 
                      color: 'var(--growth-neon)',
                      fontWeight: 600
                    }}
                  >
                    #{tag.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="growth-detail-sidebar">
          {/* Compensation Widget */}
          <div className="growth-panel" style={{ padding: '2.5rem' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--growth-dim)', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Financial Package
            </div>
            
            {/* Salary */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>
                {job.compensation?.range_compact || '$120k - $160k'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--growth-dim)', fontWeight: 600, marginTop: '0.25rem' }}>
                LIVE_BASE_SALARY ({job.compensation?.frequency?.toUpperCase() || 'YEARLY'})
              </div>
            </div>

            {/* Interactive Equity Gauge */}
            <div style={{ borderTop: '1px solid var(--growth-border)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--growth-dim)' }}>EQUITY_SHARE_GAGE</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--growth-neon)' }}>
                  {equityShareLow} - {equityShareHigh}
                </span>
              </div>
              
              {/* Equity Progress Bar */}
              <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden', position: 'relative' }}>
                <div style={{ width: percentFill, height: '100%', background: 'linear-gradient(to right, var(--growth-purple), var(--growth-neon))', borderRadius: '100px' }}></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--growth-dim)', marginTop: '0.5rem', fontWeight: 700 }}>
                <span>MIN_NODE_0.0%</span>
                <span>MAX_NODE_5.0%</span>
              </div>
            </div>
          </div>

          {/* Talent Concierge Application Form */}
          <div className="growth-panel growth-apply-desk">
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem', letterSpacing: '-1px' }}>
              Initialize Growth Node
            </h3>
            <p style={{ color: 'var(--growth-dim)', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '2rem' }}>
              Submit your candidate node details to initialize live contract negotiations.
            </p>

            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--growth-neon)', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                  TALENT_NODE_SYNCHRONIZED
                </h4>
                <p style={{ color: 'var(--growth-dim)', fontSize: '0.8rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
                  Candidate ledger successfully time-stamped. Scopes saved under key `sellio_jobs_startup_applications`.
                </p>
                <button 
                  className="growth-btn-outline" 
                  style={{ marginTop: '1.5rem', width: '100%', padding: '0.8rem' }}
                  onClick={() => setIsSubmitted(false)}
                >
                  SUBMIT_ANOTHER
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit}>
                <div className="growth-form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    className="growth-input" 
                    required 
                    placeholder="Candidate Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="growth-form-group">
                  <label>Candidate Email</label>
                  <input 
                    type="email" 
                    className="growth-input" 
                    required 
                    placeholder="name@node.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="growth-form-group">
                  <label>GitHub or Portfolio URL</label>
                  <input 
                    type="url" 
                    className="growth-input" 
                    placeholder="https://github.com/nodal"
                    value={form.portfolio}
                    onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
                  />
                </div>
                <div className="growth-form-group">
                  <label>Cover Note (Mission Specs)</label>
                  <textarea 
                    className="growth-textarea" 
                    placeholder="Describe your technical capabilities..."
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                  />
                </div>
                <button 
                  type="submit" 
                  className="growth-btn-primary" 
                  disabled={isSubmitting}
                  style={{ width: '100%', padding: '1.25rem', fontSize: '0.9rem', marginTop: '1rem' }}
                >
                  {isSubmitting ? 'INITIALIZING...' : 'INITIALIZE_GROWTH_NODE'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Related Startup Openings */}
      {relatedJobs.length > 0 && (
        <section style={{ padding: '6rem 6%', borderTop: '1px solid var(--growth-border)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'white', fontSize: '2.5rem', fontWeight: 700, marginBottom: '3rem', letterSpacing: '-1px' }}>
            Related Nodes.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {relatedJobs.map((rj) => {
              const rjLink = getThemeLink(`/product/${rj.slug}`);
              const rjEquity = (rj.id % 3 === 0) ? '1.5% - 2.5%' : (rj.id % 2 === 0) ? '1.0% - 2.0%' : '0.5% - 1.5%';
              return (
                <div 
                  key={rj.id} 
                  className="opportunity-card growth-panel"
                  style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                  onClick={() => {
                    window.location.href = rjLink;
                  }}
                >
                  <div>
                    <span className="opp-badge">{rj.employment?.workplace?.toUpperCase() || 'REMOTE'}</span>
                    <h3 className="opp-title" style={{ marginTop: '1rem' }}>{rj.title}</h3>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--growth-neon)', marginBottom: '0.5rem' }}>
                      {rj.company?.name || 'Venture Startup'}
                    </div>
                    <div style={{ color: 'var(--growth-dim)', fontSize: '0.9rem', marginBottom: '2.5rem' }}>📍 {rj.location?.display}</div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--growth-border)' }}>
                    <div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--growth-dim)', fontWeight: 800 }}>EQUITY_SHARE</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700 }}>{rjEquity}</div>
                    </div>
                    <a 
                      href={rjLink} 
                      className="opp-join-btn"
                      style={{ 
                        background: 'none', 
                        border: '1px solid var(--growth-neon)', 
                        color: 'var(--growth-neon)', 
                        padding: '0.5rem 1.5rem', 
                        borderRadius: '8px', 
                        fontSize: '0.75rem', 
                        fontWeight: 700, 
                        textDecoration: 'none' 
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      APPLY
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
