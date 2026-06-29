'use client';

import React, { useEffect, useState } from 'react';
import type { ServiceListing } from '@/types';
import { PractitionerCard, VitalityHUD } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/services/shared/CatalogSyncAlert';
import { fetchServicesHome, resolveServicesFailure } from '@/themes/services/shared/catalog';
import { mapServiceToHealthPractitioner } from '@/themes/services/shared/service-utils';
import { useDemoFallbackAllowed } from '@/themes/services/shared/useDemoFallbackAllowed';
import { useServicesThemeLink } from '@/themes/services/shared/useServicesThemeLink';

export default function Page() {
  const themeLink = useServicesThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const heroKicker = useThemeContent('hero.kicker', 'Precision Healthcare');
  const heroTitle = useThemeContent('hero.title', 'Precision \nMedicine, \nDelivered.');
  const heroDescription = useThemeContent('hero.description', 'Connect with an elite network of specialists and diagnosticians. We engineer personalized physiological protocols for peak human performance.');
  const heroPrimaryCta = useThemeContent('hero.primary_cta_label', 'Book a Consultation');
  const heroSecondaryCta = useThemeContent('hero.secondary_cta_label', 'View Clinicians');
  const hudPractitionersLabel = useThemeContent('hud.practitioners_label', 'PRACTITIONERS');
  const hudPractitionersSub = useThemeContent('hud.practitioners_sub', 'Vetted specialists active across our global clinical network.');
  const hudAccuracyLabel = useThemeContent('hud.accuracy_label', 'ACCURACY');
  const hudAccuracySub = useThemeContent('hud.accuracy_sub', 'Precision monitoring with real-time clinical data.');
  const hudResponseLabel = useThemeContent('hud.response_label', 'RESPONSE RATE');
  const hudResponseSub = useThemeContent('hud.response_sub', 'Fast consultation response across our care network.');
  const registryKicker = useThemeContent('registry.kicker', 'Our Specialists');
  const registryTitle = useThemeContent('registry.title', 'Top Rated \nPractitioners.');
  const registryDescription = useThemeContent('registry.description', 'Our rigorous vetting process ensures every specialist meets our highest clinical standards.');
  const protocolsKicker = useThemeContent('protocols.kicker', 'Care Plans');
  const protocolsTitle = useThemeContent('protocols.title', 'Optimized \nPhysiology.');
  const protocolsDescription = useThemeContent('protocols.description', 'Move beyond reactive care. Our elite protocols integrate preventive diagnostics, continuous biomarker tracking, and personalized nutritional algorithms.');

  const [services, setServices] = useState<ServiceListing[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    async function loadServices() {
      setLoadingServices(true);
      const result = await fetchServicesHome({ per_page: 6 });

      if (result.ok && result.response.data?.length) {
        setServices(result.response.data);
        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'No services returned from API.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveServicesFailure(allowDemo, 'health');

        if (resolution.mode === 'demo') {
          setServices(resolution.services);
          setUseFallback(true);
        } else {
          setServices([]);
          setUseFallback(false);
        }
      }

      setLoadingServices(false);
    }

    loadServices();
  }, [allowDemo]);

  const scrollToRegistry = () => {
    document.getElementById('registry')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProtocols = () => {
    document.getElementById('protocols')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="services-health-theme">
      <section className="sh-hero" id="sh-hero-section" aria-labelledby="sh-hero-title">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
              <div style={{ padding: '0.5rem 1.5rem', background: 'var(--sh-teal-light)', color: 'var(--sh-teal)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '1px' }}>{heroKicker}</div>
              <div className="sh-mono" style={{ fontSize: '0.65rem', opacity: 0.6 }}>Platform Verified</div>
          </div>
          <h1 className="sh-heading-xl" id="sh-hero-title">
            {heroTitle.split('\n').map((line, index) => (
              <React.Fragment key={`${line}-${index}`}>
                {index > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </h1>
          <p style={{ marginTop: '4rem', fontSize: '1.25rem', color: 'var(--sh-grey)', lineHeight: 1.8, maxWidth: '600px', fontWeight: 300 }}>
            {heroDescription}
          </p>
          <div style={{ marginTop: '5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <button type="button" className="sh-btn-primary" onClick={scrollToProtocols}>
              {heroPrimaryCta}
            </button>
            <button type="button" className="sh-btn-outline-clinicians" onClick={scrollToRegistry}>
              {heroSecondaryCta}
            </button>
          </div>
        </div>
        <div className="sh-hero-img-wrapper">
          <img src="/themes/services/health/10.webp" alt="Clinical Excellence" className="sh-hero-img" />
          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--sh-border)', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--sh-teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sh-teal)', fontSize: '1.25rem', fontWeight: 700 }}>+</div>
              <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--sh-blue)' }}>End-to-End Encrypted</div>
                  <div className="sh-mono" style={{ fontSize: '0.6rem', opacity: 0.6, marginTop: '0.2rem' }}>HIPAA COMPLIANT</div>
              </div>
          </div>
        </div>
      </section>

      <section className="sh-section sh-hud-section" id="telemetry" aria-label="Telemetry HUD">
          <VitalityHUD label={hudPractitionersLabel} value="1.2k+" sub={hudPractitionersSub} />
          <VitalityHUD label={hudAccuracyLabel} value="99.9%" sub={hudAccuracySub} />
          <VitalityHUD label={hudResponseLabel} value="0.01s" sub={hudResponseSub} />
      </section>

      <section className="sh-section" id="registry" aria-labelledby="sh-registry-title">
          <div className="sh-registry-header">
              <div>
                  <div className="sh-mono" style={{ marginBottom: '1.5rem' }}>{registryKicker}</div>
                  <h2 className="sh-heading-xl sh-registry-heading">
                    {registryTitle.split('\n').map((line, index) => (
                      <React.Fragment key={`${line}-${index}`}>
                        {index > 0 && <br />}
                        {line}
                      </React.Fragment>
                    ))}
                  </h2>
              </div>
              <div className="sh-registry-desc">
                  {registryDescription}
              </div>
          </div>

          {apiError && useFallback && (
            <div className="sh-alert-slot">
              <CatalogSyncAlert variant="demo" error={apiError} classPrefix="sh" />
            </div>
          )}
          {apiError && !useFallback && (
            <div className="sh-alert-slot">
              <CatalogSyncAlert variant="production" error={apiError} classPrefix="sh" />
            </div>
          )}

          <div className="sh-specialist-grid">
            {loadingServices ? (
              [1, 2, 3, 4].map((item) => (
                <div className="sh-specialist-card sh-listing-skeleton" key={item}>
                  <div className="sh-skeleton-circle" />
                  <div className="sh-skeleton-line sh-skeleton-line-title" />
                  <div className="sh-skeleton-line" />
                  <div className="sh-skeleton-line sh-skeleton-line-short" />
                </div>
              ))
            ) : services.length === 0 ? (
              <div className="sh-listing-state">
                <div className="sh-listing-kicker">No Practitioners Yet</div>
                <h3>No live services are published yet.</h3>
                <p>Add service records in the admin panel to populate this grid.</p>
              </div>
            ) : (
              services.slice(0, 6).map((service, index) => {
                const practitioner = mapServiceToHealthPractitioner(service, index);
                return (
                  <a className="sh-practitioner-link" href={themeLink(`/product/${practitioner.slug}`)} key={service.id}>
                    <PractitionerCard {...practitioner} />
                  </a>
                );
              })
            )}
          </div>
      </section>

      <section className="sh-section sh-pricing-section" id="protocols" aria-labelledby="sh-protocols-title">
          <div className="sh-pricing-body">
              <div className="sh-mono" style={{ marginBottom: '2rem', color: 'var(--sh-teal)' }}>{protocolsKicker}</div>
              <h2 className="sh-heading-xl" id="sh-protocols-title" style={{ color: 'white', fontSize: 'clamp(3rem, 5vw, 4.5rem)', marginBottom: '3rem' }}>
                {protocolsTitle.split('\n').map((line, index) => (
                  <React.Fragment key={`${line}-${index}`}>
                    {index > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.7, lineHeight: 1.8, marginBottom: '4rem', fontWeight: 300 }}>
                  {protocolsDescription}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                  {['Biomarker Telemetry', 'Genetic Mapping', '24/7 Concierge'].map((item) => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', opacity: 0.9 }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--sh-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: 'white' }}>✓</div>
                          {item.toUpperCase()}
                      </div>
                  ))}
              </div>
          </div>
          <div className="sh-pricing-cards">
              <div className="sh-plan-card">
                  <div>
                      <div className="sh-mono" style={{ marginBottom: '0.5rem' }}>STANDARD PLAN</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800 }}>$49<span style={{ fontSize: '1rem', opacity: 0.5 }}>/mo</span></div>
                  </div>
                  <button type="button" className="sh-plan-btn" onClick={scrollToRegistry}>SELECT</button>
              </div>
              <div className="sh-plan-card sh-plan-card-pro">
                  <div>
                      <div className="sh-mono" style={{ marginBottom: '0.5rem', color: 'white' }}>VITALITY PRO</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800 }}>$149<span style={{ fontSize: '1rem', opacity: 0.7 }}>/mo</span></div>
                  </div>
                  <button type="button" className="sh-plan-btn-pro" onClick={scrollToRegistry}>Get Started</button>
              </div>
          </div>
      </section>

      <div style={{ height: '6rem' }}></div>
    </div>
  );
}
