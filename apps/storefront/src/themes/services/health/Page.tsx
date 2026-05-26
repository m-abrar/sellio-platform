'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { ServiceListing } from '@sellio/types';
import { PractitionerCard, VitalityHUD } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

const fallbackImages = [
  '/themes/services/health/15.webp',
  '/themes/services/health/16.webp',
  '/themes/services/health/17.webp',
  '/themes/services/health/18.webp',
];

function mapServiceToPractitioner(service: ServiceListing, index: number) {
  const specialty = service.professional?.category || service.professional?.type || 'SPECIALIST';

  return {
    name: service.provider?.name || service.title,
    title: specialty.toUpperCase(),
    image: service.media?.main_photo || service.provider?.avatar || fallbackImages[index % fallbackImages.length],
    rating: service.provider?.rating ? service.provider.rating.toFixed(1) : '4.9',
    availability: service.operations?.hours_label || service.operations?.days_label || 'AVAILABLE',
    slug: service.slug,
  };
}

export default function Page() {
  const heroKicker = useThemeContent('hero.kicker', 'VITALITY PROTOCOL');
  const heroTitle = useThemeContent('hero.title', 'Precision \nMedicine, \nDelivered.');
  const heroDescription = useThemeContent('hero.description', 'Connect with an elite network of specialists and diagnosticians. We engineer personalized physiological protocols for peak human performance.');
  const heroPrimaryCta = useThemeContent('hero.primary_cta_label', 'INITIALIZE CONSULTATION');
  const heroSecondaryCta = useThemeContent('hero.secondary_cta_label', 'VIEW CLINICIANS');

  const hudPractitionersLabel = useThemeContent('hud.practitioners_label', 'PRACTITIONERS');
  const hudPractitionersSub = useThemeContent('hud.practitioners_sub', 'Vetted specialists active across our global clinical network.');
  const hudAccuracyLabel = useThemeContent('hud.accuracy_label', 'ACCURACY');
  const hudAccuracySub = useThemeContent('hud.accuracy_sub', 'High-fidelity data synchronization for real-time monitoring.');
  const hudResponseLabel = useThemeContent('hud.response_label', 'RESPONSE RATE');
  const hudResponseSub = useThemeContent('hud.response_sub', 'Instant consultation availability for critical wellness nodes.');

  const registryKicker = useThemeContent('registry.kicker', 'OFFICIAL REGISTRY');
  const registryTitle = useThemeContent('registry.title', 'Top Rated \nPractitioners.');
  const registryDescription = useThemeContent('registry.description', 'Our unified protocol vetting process ensures that every specialist on the node meets our high-fidelity clinical standards.');

  const protocolsKicker = useThemeContent('protocols.kicker', 'CLINICAL TIERS');
  const protocolsTitle = useThemeContent('protocols.title', 'Optimized \nPhysiology.');
  const protocolsDescription = useThemeContent('protocols.description', 'Move beyond reactive care. Our elite protocols integrate preventive diagnostics, continuous biomarker tracking, and personalized nutritional algorithms.');

  const [services, setServices] = useState<ServiceListing[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [serviceError, setServiceError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadServices() {
      try {
        const response = await api.getServices({ per_page: 6 });
        if (!isMounted) {
          return;
        }

        setServices(Array.isArray(response.data) ? response.data : []);
        setServiceError(null);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load services health listings:', error);
        setServiceError(error instanceof Error ? error.message : 'Services are temporarily unavailable.');
      } finally {
        if (isMounted) {
          setLoadingServices(false);
        }
      }
    }

    loadServices();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="services-health-theme">
      {/* Precision Clinical Hero */}
      <section className="sh-hero" id="sh-hero-section" aria-labelledby="sh-hero-title">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
              <div style={{ padding: '0.5rem 1.5rem', background: 'var(--sh-teal-light)', color: 'var(--sh-teal)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '1px' }}>{heroKicker}</div>
              <div className="sh-mono" style={{ fontSize: '0.65rem', opacity: 0.6 }}>CLINICAL GRADE V2</div>
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
            <button className="sh-btn-primary" onClick={() => document.getElementById('protocols')?.scrollIntoView({ behavior: 'smooth' })}>
              {heroPrimaryCta}
            </button>
            <button
              className="sh-btn-outline-clinicians"
              onClick={() => document.getElementById('registry')?.scrollIntoView({ behavior: 'smooth' })}
            >
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

      {/* Vitality HUD Section */}
      <section className="sh-section sh-hud-section" id="telemetry" aria-label="Telemetry HUD">
          <VitalityHUD label={hudPractitionersLabel} value="1.2k+" sub={hudPractitionersSub} />
          <VitalityHUD label={hudAccuracyLabel} value="99.9%" sub={hudAccuracySub} />
          <VitalityHUD label={hudResponseLabel} value="0.01s" sub={hudResponseSub} />
      </section>

      {/* Specialist Registry Section */}
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
            ) : serviceError ? (
              <div className="sh-listing-state">
                <div className="sh-listing-kicker">Clinical Sync Offline</div>
                <h3>Practitioner registry could not be loaded.</h3>
                <p>{serviceError}</p>
              </div>
            ) : services.length === 0 ? (
              <div className="sh-listing-state">
                <div className="sh-listing-kicker">Empty Clinical Registry</div>
                <h3>No live services are published yet.</h3>
                <p>Add service records in the backend and this practitioner grid will hydrate automatically.</p>
              </div>
            ) : (
              services.slice(0, 6).map((service, index) => {
                const practitioner = mapServiceToPractitioner(service, index);
                return (
                  <a className="sh-practitioner-link" href={`/product/${practitioner.slug}`} key={service.id}>
                    <PractitionerCard {...practitioner} />
                  </a>
                );
              })
            )}
          </div>
      </section>

      {/* Wellness Protocols Section */}
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
                  {['Biomarker Telemetry', 'Genetic Mapping', '24/7 Concierge'].map(item => (
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
                  <button className="sh-plan-btn" onClick={() => alert('Standard plan consultation initialized.')}>SELECT</button>
              </div>
              <div className="sh-plan-card sh-plan-card-pro">
                  <div>
                      <div className="sh-mono" style={{ marginBottom: '0.5rem', color: 'white' }}>VITALITY PRO</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800 }}>$149<span style={{ fontSize: '1rem', opacity: 0.7 }}>/mo</span></div>
                  </div>
                  <button className="sh-plan-btn-pro" onClick={() => alert('Vitality Pro clinical protocol started!')}>INITIALIZE</button>
              </div>
          </div>
      </section>

      {/* Direct inquiry consult trigger section */}
      <section className="sh-section sh-consultation-section" id="contact" style={{ display: 'none' }}></section>

      <div style={{ height: '6rem' }}></div>
    </div>
  );
}
