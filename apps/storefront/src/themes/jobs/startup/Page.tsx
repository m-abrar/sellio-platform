'use client';

import React, { useEffect, useState } from 'react';
import { OpportunityGrid, MissionControlSection } from './components';
import { api } from '@sellio/api-client';
import type { JobListing } from '@sellio/types';

export default function Page() {
  const [jobs, setJobs] = useState<JobListing[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const response = await api.getJobs({ per_page: 6 });
        if (response && response.data) {
          setJobs(response.data);
        }
      } catch (err: any) {
        console.error("Failed to load live jobs database, using static fallback mockups:", err);
        setError(err.message || 'Network connectivity latency or database server offline.');
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
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'var(--growth-neon)', letterSpacing: '8px', marginBottom: '2.5rem', fontWeight: 700 }}>SYNCHRONIZE_TALENT_V5</div>
          <h1>Join the <br/><span>Hypergrowth.</span></h1>
          <p style={{ maxWidth: '800px', fontSize: '1.25rem', color: 'var(--growth-dim)', lineHeight: 1.8, marginBottom: '5rem' }}>
              The high-fidelity distribution node for venture-backed talent. Connect your career node to the world's most innovative startup network.
          </p>
          <div style={{ display: 'flex', gap: '2rem' }}>
              <button 
                className="growth-btn-primary"
                onClick={() => {
                  window.location.href = getThemeLink('/explore');
                }}
              >
                EXPLORE_VENTURES
              </button>
              <button 
                className="growth-btn-outline"
                onClick={() => {
                  window.location.href = getThemeLink('/explore');
                }}
              >
                VENTURE_CAPITAL_ACCESS
              </button>
          </div>
      </section>

      {/* Trust Bar */}
      <section style={{ padding: '4rem 6%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.5)', borderTop: '1px solid var(--growth-border)', borderBottom: '1px solid var(--growth-border)', color: 'var(--growth-dim)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '3px' }}>
          <span>VENTURE_FUNDING_SYNC: ACTIVE</span>
          <span>LATENCY: {loading ? '...' : error ? 'TIMEOUT' : '14ms'}</span>
          <span>EQUITY_VERIFIED: TRUE</span>
          <span>NETWORK_NODE: 5.0_ELITE</span>
      </section>

      {/* Stats Bar */}
      <section style={{ padding: '6rem 6%', display: 'flex', justifyContent: 'center', gap: '8rem' }}>
          <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)' }}>450+</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--growth-dim)', fontWeight: 800, letterSpacing: '2px', marginTop: '0.5rem' }}>VERIFIED_STARTUPS</div>
          </div>
          <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)' }}>$1.2B+</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--growth-dim)', fontWeight: 800, letterSpacing: '2px', marginTop: '0.5rem' }}>TOTAL_EQUITY_VALUE</div>
          </div>
          <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)' }}>12k+</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--growth-dim)', fontWeight: 800, letterSpacing: '2px', marginTop: '0.5rem' }}>NODAL_CONNECTIONS</div>
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
          <h2 style={{ fontSize: '6rem', fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: '3.5rem', letterSpacing: '-4px', color: 'white' }}>Accelerate <br/>Your Future.</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 5rem', fontSize: '1.25rem', color: 'var(--growth-dim)' }}>
              Initialize your professional growth node and gain access to high-fidelity equity structures and mission-critical roles.
          </p>
          <button 
            className="growth-btn-primary" 
            style={{ padding: '2rem 6rem', fontSize: '1.1rem' }}
            onClick={() => {
              window.location.href = getThemeLink('/explore');
            }}
          >
            INITIALIZE_GROWTH_NODE
          </button>
      </section>
    </div>
  );
}
