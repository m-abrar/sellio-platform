'use client';

import React, { useEffect, useState } from 'react';
import type { ServiceListing } from '@sellio/types';
import { LocalHeader, LocalServiceCard, ProviderCard, LocalFooter } from './components';
import { DynamicTestimonials } from '@/components/testimonials/DynamicTestimonials';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/services/shared/CatalogSyncAlert';
import { fetchServicesHome, resolveServicesFailure } from '@/themes/services/shared/catalog';
import { mapServiceToLocalCard } from '@/themes/services/shared/service-utils';
import { useDemoFallbackAllowed } from '@/themes/services/shared/useDemoFallbackAllowed';
import { useServicesThemeLink } from '@/themes/services/shared/useServicesThemeLink';

const serviceIcons = ['🏠', '🔧', '⚡', '🌳', '🌡️', '🔨'];

const providers = [
  { name: 'John D.', title: 'Handyman Expert', rating: '4.8', jobs: '120', image: '/themes/services/local/15.webp' },
  { name: 'Sarah K.', title: 'Professional Cleaner', rating: '4.9', jobs: '210', image: '/themes/services/local/16.webp' },
  { name: 'Mike A.', title: 'Certified Plumber', rating: '4.7', jobs: '85', image: '/themes/services/local/17.webp' },
  { name: 'Lisa M.', title: 'Lawn & Garden Specialist', rating: '5.0', jobs: '55', image: '/themes/services/local/18.webp' },
];

export default function Page() {
  const themeLink = useServicesThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const heroTitle = useThemeContent('hero.title', 'Trusted Services for \nYour Home & Family');
  const heroDescription = useThemeContent('hero.description', 'Find background-checked professionals for cleaning, repair, maintenance, and more—all in one place.');
  const heroPrimaryCta = useThemeContent('hero.primary_cta_label', 'Explore Services');
  const heroSecondaryCta = useThemeContent('hero.secondary_cta_label', 'Read Testimonials');

  const servicesTitle = useThemeContent('services.title', 'Our Popular Services');
  const providersTitle = useThemeContent('providers.title', 'Meet Our Top-Rated Providers');

  const howWorksTitle = useThemeContent('how_it_works.title', 'How HomeFix Works in 3 Simple Steps');
  const howWorksStep1Title = useThemeContent('how_it_works.step_1_title', '1. Search & Filter');
  const howWorksStep1Desc = useThemeContent('how_it_works.step_1_description', 'Easily find the service you need by location, type, and availability using our smart filters.');
  const howWorksStep2Title = useThemeContent('how_it_works.step_2_title', '2. Book & Confirm');
  const howWorksStep2Desc = useThemeContent('how_it_works.step_2_description', 'Select a top-rated professional and instantly book a time slot that works for your schedule.');
  const howWorksStep3Title = useThemeContent('how_it_works.step_3_title', '3. Relax & Enjoy');
  const howWorksStep3Desc = useThemeContent('how_it_works.step_3_description', 'A trusted pro arrives, gets the job done right, and you rate your experience. Simple as that!');

  const safetyTitle = useThemeContent('safety.title', 'Your Safety is Our Priority');
  const safetyStep1Title = useThemeContent('safety.step_1_title', 'Background-Checked');
  const safetyStep1Desc = useThemeContent('safety.step_1_description', 'Every professional is vetted for your peace of mind.');
  const safetyStep2Title = useThemeContent('safety.step_2_title', 'Insured & Guaranteed');
  const safetyStep2Desc = useThemeContent('safety.step_2_description', 'Workmanship is covered by our service guarantee.');
  const safetyStep3Title = useThemeContent('safety.step_3_title', '24/7 Support');
  const safetyStep3Desc = useThemeContent('safety.step_3_description', 'Help is always just a call or click away, day or night.');

  const emptyKicker = useThemeContent('empty.kicker', 'Empty Service Registry');
  const emptyTitle = useThemeContent('empty.title', 'No live services are published yet.');
  const emptyDescription = useThemeContent(
    'empty.description',
    'Add service records in the backend and this local services grid will hydrate automatically.',
  );

  const [services, setServices] = useState<ServiceListing[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadServices() {
      setLoadingServices(true);
      const result = await fetchServicesHome({ per_page: 6 });

      if (!isMounted) return;

      if (result.ok && result.response.data) {
        setServices(Array.isArray(result.response.data) ? result.response.data : []);
        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'No services returned from API.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveServicesFailure(allowDemo, 'local');

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

    return () => {
      isMounted = false;
    };
  }, [allowDemo]);

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="services-local-wrapper">
      <LocalHeader onBookService={scrollToServices} />

      <section className="local-hero" id="local-hero-section" aria-labelledby="local-hero-title">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 id="local-hero-title">
            {heroTitle.split('\n').map((line, index) => (
              <React.Fragment key={`${line}-${index}`}>
                {index > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </h1>
          <p>{heroDescription}</p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="local-btn local-btn-primary" onClick={scrollToServices}>
              {heroPrimaryCta}
            </button>
            <button
              type="button"
              className="local-btn local-btn-outline"
              onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {heroSecondaryCta}
            </button>
          </div>
        </div>
      </section>

      <section className="local-filter-bar" aria-label="Search Filter Bar">
        <div style={{ fontWeight: 600, color: 'var(--local-text-muted)', marginRight: '1rem' }}>Quick Filter:</div>
        <select className="local-select" aria-label="Service Type Select"><option>Service Type</option></select>
        <select className="local-select" aria-label="Location Select"><option>Location (Zip)</option></select>
        <select className="local-select" aria-label="Availability Select"><option>Availability</option></select>
        <select className="local-select" aria-label="Price Select"><option>Price Range</option></select>
        <button type="button" className="local-btn" style={{ background: 'var(--local-green)', color: 'white', border: 'none', flex: 1, minWidth: '150px' }} onClick={scrollToServices}>Search</button>
      </section>

      <section id="services" className="local-section" aria-labelledby="local-services-title">
        <h2 id="local-services-title" style={{ textAlign: 'center', fontWeight: 800, marginBottom: '4rem', fontSize: '2.5rem' }}>{servicesTitle}</h2>

        {apiError && useFallback && (
          <div className="local-alert-slot">
            <CatalogSyncAlert variant="demo" error={apiError} classPrefix="local" />
          </div>
        )}
        {apiError && !useFallback && (
          <div className="local-alert-slot">
            <CatalogSyncAlert variant="production" error={apiError} classPrefix="local" />
          </div>
        )}

        <div className="local-grid">
          {loadingServices ? (
            [1, 2, 3, 4, 5, 6].map((item) => (
              <div className="local-service-card local-listing-skeleton" key={item}>
                <div className="local-skeleton-icon" />
                <div className="local-skeleton-line local-skeleton-line-title" />
                <div className="local-skeleton-line" />
                <div className="local-skeleton-line local-skeleton-line-short" />
              </div>
            ))
          ) : services.length === 0 ? (
            <div className="local-empty-state" role="status">
              <div className="local-listing-kicker">{emptyKicker}</div>
              <h3>{emptyTitle}</h3>
              <p>{emptyDescription}</p>
            </div>
          ) : (
            services.slice(0, 6).map((service, index) => {
              const card = mapServiceToLocalCard(service, index, serviceIcons);
              return (
                <a className="local-service-link" href={themeLink(`/product/${card.slug}`)} key={service.id}>
                  <LocalServiceCard title={card.title} description={card.description} icon={card.icon} />
                </a>
              );
            })
          )}
        </div>
      </section>

      <section id="providers" className="local-section" style={{ background: 'white' }} aria-labelledby="local-providers-title">
        <h2 id="local-providers-title" style={{ textAlign: 'center', fontWeight: 800, marginBottom: '4rem', fontSize: '2.5rem' }}>{providersTitle}</h2>
        <div className="local-grid">
          {providers.map((p) => (
            <ProviderCard key={p.name} {...p} onBook={scrollToServices} />
          ))}
        </div>
      </section>

      <section className="local-section text-center" aria-labelledby="local-how-title">
        <h2 id="local-how-title" style={{ textAlign: 'center', fontWeight: 800, marginBottom: '4rem', fontSize: '2.5rem' }}>{howWorksTitle}</h2>
        <div className="local-steps-grid">
            <div>
                <div className="local-step-icon">🔍</div>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>{howWorksStep1Title}</h4>
                <p style={{ color: 'var(--local-text-muted)', lineHeight: 1.6 }}>{howWorksStep1Desc}</p>
            </div>
            <div>
                <div className="local-step-icon">📅</div>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>{howWorksStep2Title}</h4>
                <p style={{ color: 'var(--local-text-muted)', lineHeight: 1.6 }}>{howWorksStep2Desc}</p>
            </div>
            <div>
                <div className="local-step-icon">❤️</div>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>{howWorksStep3Title}</h4>
                <p style={{ color: 'var(--local-text-muted)', lineHeight: 1.6 }}>{howWorksStep3Desc}</p>
            </div>
        </div>
      </section>

      <DynamicTestimonials
        title="What Our Community Says"
        limit={3}
        variant="centered"
        quoteDecor="local"
        sectionId="testimonials"
        sectionClassName="local-section"
        sectionStyle={{ background: 'white', textAlign: 'center' }}
        titleStyle={{ fontWeight: 800, marginBottom: '4rem', fontSize: '2.5rem' }}
        layoutClassName="local-testimonials-layout"
        cardClassName="local-testimonial-card"
        headingId="sc-testimonials-title"
      />

      <section className="local-section text-center" aria-labelledby="local-safety-title">
        <h2 id="local-safety-title" style={{ fontWeight: 800, marginBottom: '4rem', fontSize: '2.5rem' }}>{safetyTitle}</h2>
        <div className="local-safety-grid">
            <div className="local-safety-card">
                <div style={{ fontSize: '3rem', color: 'var(--local-green)', marginBottom: '1rem' }}>🛡️</div>
                <h5 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.2rem' }}>{safetyStep1Title}</h5>
                <p style={{ color: 'var(--local-text-muted)' }}>{safetyStep1Desc}</p>
            </div>
            <div className="local-safety-card">
                <div style={{ fontSize: '3rem', color: 'var(--local-green)', marginBottom: '1rem' }}>✅</div>
                <h5 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.2rem' }}>{safetyStep2Title}</h5>
                <p style={{ color: 'var(--local-text-muted)' }}>{safetyStep2Desc}</p>
            </div>
            <div className="local-safety-card">
                <div style={{ fontSize: '3rem', color: 'var(--local-green)', marginBottom: '1rem' }}>📞</div>
                <h5 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.2rem' }}>{safetyStep3Title}</h5>
                <p style={{ color: 'var(--local-text-muted)' }}>{safetyStep3Desc}</p>
            </div>
        </div>
      </section>

      <LocalFooter />
    </div>
  );
}
