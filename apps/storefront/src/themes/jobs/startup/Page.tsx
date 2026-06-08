'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { JobListing } from '@sellio/types';
import { OpportunityGrid, MissionControlSection } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/jobs/shared/CatalogSyncAlert';
import { fetchJobsHome, resolveJobsFailure } from '@/themes/jobs/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/jobs/shared/useDemoFallbackAllowed';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';

export default function Page() {
  const router = useRouter();
  const themeLink = useJobsThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
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
    async function loadJobs() {
      setLoading(true);
      const result = await fetchJobsHome(6);

      if (result.ok && result.response.data) {
        setJobs(result.response.data);
        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'No jobs returned from API.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveJobsFailure(allowDemo, 'startup');

        if (resolution.mode === 'demo') {
          setJobs(resolution.jobs);
          setUseFallback(true);
        } else {
          setJobs([]);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadJobs();
  }, [allowDemo]);

  const goToExplore = () => {
    router.push(themeLink('/explore'));
  };

  return (
    <div>
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
              <button type="button" className="growth-btn-primary" onClick={goToExplore}>
                {heroPrimaryCta}
              </button>
              <button type="button" className="growth-btn-outline" onClick={goToExplore}>
                {heroSecondaryCta}
              </button>
          </div>
      </section>

      <section style={{ padding: '4rem 6%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.5)', borderTop: '1px solid var(--growth-border)', borderBottom: '1px solid var(--growth-border)', color: 'var(--growth-dim)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '3px' }}>
          <span>{trustLeft}</span>
          <span>LATENCY: {loading ? '...' : apiError && !useFallback ? 'TIMEOUT' : '14ms'}</span>
          <span>{trustRight}</span>
          <span>{trustNetwork}</span>
      </section>

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

      {apiError && useFallback && (
        <div style={{ padding: '0 6%' }} className="gr-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="gr" />
        </div>
      )}
      {apiError && !useFallback && (
        <div style={{ padding: '0 6%' }} className="gr-alert-slot">
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="gr" />
        </div>
      )}

      <OpportunityGrid jobs={jobs} loading={loading} />

      <MissionControlSection />

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
          <button type="button" className="growth-btn-primary" style={{ padding: '2rem 6rem', fontSize: '1.1rem' }} onClick={goToExplore}>
            {ctaButtonLabel}
          </button>
      </section>
    </div>
  );
}
