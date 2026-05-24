'use client';

import React, { useEffect, useState } from 'react';
import { OpportunityGrid, MissionControlSection } from './components';
import { api } from '@sellio/api-client';
import type { JobListing } from '@sellio/types';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

export default function Page() {
  const [jobs, setJobs] = useState<JobListing[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const heroEyebrow = useThemeContent('hero.eyebrow', 'SYNCHRONIZE_TALENT_V5');
  const heroTitle = useThemeContent('hero.title', 'Join the\nHypergrowth.');
  const heroDescription = useThemeContent(
    'hero.description',
    "The high-fidelity distribution node for venture-backed talent. Connect your career node to the world's most innovative startup network."
  );
  const heroPrimaryCta = useThemeContent('hero.primary_cta_label', 'EXPLORE_VENTURES');
  const heroSecondaryCta = useThemeContent('hero.secondary_cta_label', 'VENTURE_CAPITAL_ACCESS');
  const trustLeft = useThemeContent('trust.left_text', 'VENTURE_FUNDING_SYNC: ACTIVE');
  const trustRight = useThemeContent('trust.right_text', 'EQUITY_VERIFIED: TRUE');
  const trustNetwork = useThemeContent('trust.network_text', 'NETWORK_NODE: 5.0_ELITE');
  const statsStartupsValue = useThemeContent('stats.startups_value', '450+');
  const statsStartupsLabel = useThemeContent('stats.startups_label', 'VERIFIED_STARTUPS');
  const statsEquityValue = useThemeContent('stats.equity_value', '$1.2B+');
  const statsEquityLabel = useThemeContent('stats.equity_label', 'TOTAL_EQUITY_VALUE');
  const statsConnectionsValue = useThemeContent('stats.connections_value', '12k+');
  const statsConnectionsLabel = useThemeContent('stats.connections_label', 'NODAL_CONNECTIONS');
  const ctaTitle = useThemeContent('cta.title', 'Accelerate\nYour Future.');
  const ctaDescription = useThemeContent(
    'cta.description',
    'Initialize your professional growth node and gain access to high-fidelity equity structures and mission-critical roles.'
  );
  const ctaButtonLabel = useThemeContent('cta.button_label', 'INITIALIZE_GROWTH_NODE');

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const response = await api.getJobs({ per_page: 6 });
        if (response && response.data) {
          setJobs(response.data);
        }
      } catch (err: unknown) {
        console.error("Failed to load live jobs database, using static fallback mockups:", err);
        setError(err instanceof Error ? err.message : 'Network connectivity latency or database server offline.');
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

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

  return (
    <div>
      {/* Hero Section */}
      <section className="growth-hero">
          <div className="growth-hero-glow"></div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'var(--growth-neon)', letterSpacing: '8px', marginBottom: '2.5rem', fontWeight: 700 }}>{heroEyebrow}</div>
          <h1>
            {heroTitle.split('\n').map((line, index) => (
              <React.Fragment key={`${line}-${index}`}>
                {index > 0 && <br />}
                {index === heroTitle.split('\n').length - 1 ? <span>{line}</span> : line}
              </React.Fragment>
            ))}
          </h1>
          <p style={{ maxWidth: '800px', fontSize: '1.25rem', color: 'var(--growth-dim)', lineHeight: 1.8, marginBottom: '5rem' }}>
              {heroDescription}
          </p>
          <div style={{ display: 'flex', gap: '2rem' }}>
              <button 
                className="growth-btn-primary"
                onClick={() => {
                  window.location.href = getThemeLink('/explore');
                }}
              >
                {heroPrimaryCta}
              </button>
              <button 
                className="growth-btn-outline"
                onClick={() => {
                  window.location.href = getThemeLink('/explore');
                }}
              >
                {heroSecondaryCta}
              </button>
          </div>
      </section>

      {/* Trust Bar */}
      <section style={{ padding: '4rem 6%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.5)', borderTop: '1px solid var(--growth-border)', borderBottom: '1px solid var(--growth-border)', color: 'var(--growth-dim)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '3px' }}>
          <span>{trustLeft}</span>
          <span>LATENCY: {loading ? '...' : error ? 'TIMEOUT' : '14ms'}</span>
          <span>{trustRight}</span>
          <span>{trustNetwork}</span>
      </section>

      {/* Stats Bar */}
      <section style={{ padding: '6rem 6%', display: 'flex', justifyContent: 'center', gap: '8rem' }}>
          <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)' }}>{statsStartupsValue}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--growth-dim)', fontWeight: 800, letterSpacing: '2px', marginTop: '0.5rem' }}>{statsStartupsLabel}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)' }}>{statsEquityValue}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--growth-dim)', fontWeight: 800, letterSpacing: '2px', marginTop: '0.5rem' }}>{statsEquityLabel}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)' }}>{statsConnectionsValue}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--growth-dim)', fontWeight: 800, letterSpacing: '2px', marginTop: '0.5rem' }}>{statsConnectionsLabel}</div>
          </div>
      </section>

      {/* Network Offline Diagnostics Warning Alert */}
      {error && (
        <div style={{ padding: '0 6%' }}>
          <div className="growth-offline-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>⚠️</span>
              <div style={{ fontWeight: 700, letterSpacing: '1px', color: '#f87171' }}>DATABASE_OFFLINE_DIAGNOSTICS_TRACE</div>
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8, lineHeight: 1.5 }}>
              STATUS: [OFFLINE] | LATENCY: [TIMEOUT] | REASON: [{error}]
              <br/>
              ACTION: Gracefully activated premium offline node resilience. Loading high-fidelity local catalog backups...
            </div>
          </div>
        </div>
      )}

      {/* Opportunity Grid */}
      <OpportunityGrid jobs={jobs} loading={loading} />

      {/* Mission Control */}
      <MissionControlSection />

      {/* Final CTA */}
      <section style={{ padding: '15rem 6%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: '1000px', height: '600px', background: 'radial-gradient(circle, var(--growth-purple) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(100px)', zIndex: -1 }}></div>
          <h2 style={{ fontSize: '6rem', fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: '3.5rem', letterSpacing: '-4px', color: 'white' }}>
            {ctaTitle.split('\n').map((line, index) => (
              <React.Fragment key={`${line}-${index}`}>
                {index > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 5rem', fontSize: '1.25rem', color: 'var(--growth-dim)' }}>
              {ctaDescription}
          </p>
          <button 
            className="growth-btn-primary" 
            style={{ padding: '2rem 6rem', fontSize: '1.1rem' }}
            onClick={() => {
              window.location.href = getThemeLink('/explore');
            }}
          >
            {ctaButtonLabel}
          </button>
      </section>
    </div>
  );
}
