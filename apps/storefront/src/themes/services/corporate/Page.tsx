'use client';

import React, { useEffect, useState } from 'react';
import type { ServiceListing } from '@sellio/types';
import { CorporateHeader, CaseStudyCard, CorporateFooter } from './components';
import { DynamicTestimonials } from '@/components/testimonials/DynamicTestimonials';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/services/shared/CatalogSyncAlert';
import { fetchServicesHome, resolveServicesFailure } from '@/themes/services/shared/catalog';
import {
  getServiceCategoryLabel,
  getServicePriceLabel,
} from '@/themes/services/shared/service-utils';
import { useDemoFallbackAllowed } from '@/themes/services/shared/useDemoFallbackAllowed';
import { useServicesThemeLink } from '@/themes/services/shared/useServicesThemeLink';

const serviceIcons = ['01', '02', '03', '04', '05', '06'];

export default function Page() {
  const themeLink = useServicesThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const heroTitle = useThemeContent('hero.title', 'Empowering Businesses \nfor Growth');
  const heroDescription = useThemeContent('hero.description', 'Strategic insights and innovative solutions to drive your success forward.');
  const heroPrimaryCta = useThemeContent('hero.primary_cta_label', 'Explore Services');
  const heroSecondaryCta = useThemeContent('hero.secondary_cta_label', 'Get in Touch');
  const servicesTitle = useThemeContent('services.title', 'Our Core Services');
  const servicesDescription = useThemeContent('services.description', 'Solutions designed to meet your unique business challenges.');
  const aboutTitle = useThemeContent('about.title', 'Why Partner with Us?');
  const aboutDescription = useThemeContent('about.description', 'We are committed to delivering exceptional value through our deep expertise and client-centric approach.');
  const aboutImage = useThemeMedia('about.image', '/themes/services/corporate/11.webp');
  const caseTitle = useThemeContent('case_studies.title', 'Our Success Stories');
  const caseDescription = useThemeContent('case_studies.description', 'Real-world impact of our strategic partnerships.');
  const ctaTitle = useThemeContent('cta.title', 'Ready to Transform Your Business?');
  const ctaDescription = useThemeContent('cta.description', 'Connect with our experts today to discuss your specific needs and goals.');
  const ctaPrimaryCta = useThemeContent('cta.primary_cta_label', 'Request a Consultation');

  const [services, setServices] = useState<ServiceListing[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const caseStudies = [
    { title: 'GlobalTech Solutions', description: 'Implemented a new operational strategy, boosting efficiency by 40% and reducing costs by 15%.', image: '/themes/services/corporate/12.webp' },
    { title: 'Innovate Pharmaceuticals', description: 'Facilitated a successful market entry for a new drug, capturing 10% market share in the first year.', image: '/themes/services/corporate/13.webp' },
    { title: 'Future Retail Group', description: 'Developed a digital transformation roadmap, leading to a 25% increase in online sales.', image: '/themes/services/corporate/14.webp' },
  ];

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
        const resolution = resolveServicesFailure(allowDemo, 'corporate');

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

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="services-corporate-theme">
      <CorporateHeader />

      <section className="sc-hero" id="sc-hero-section" aria-labelledby="sc-hero-title">
        <div className="sc-hero-content">
          <h1 className="sc-heading-xl" id="sc-hero-title" style={{ marginBottom: '1.5rem', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
            {heroTitle.split('\n').map((line, index) => (
              <React.Fragment key={`${line}-${index}`}>
                {index > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '3rem', fontWeight: 400, opacity: 0.9, textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
            {heroDescription}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="sc-btn sc-btn-primary" onClick={scrollToServices}>
              {heroPrimaryCta}
            </button>
            <button type="button" className="sc-btn sc-btn-outline" onClick={scrollToContact}>
              {heroSecondaryCta}
            </button>
          </div>
        </div>
      </section>

      <section id="services" className="sc-section sc-bg-light" aria-labelledby="sc-services-title">
        <div className="sc-section-title">
          <h2 id="sc-services-title">{servicesTitle}</h2>
          <p>{servicesDescription}</p>
        </div>

        {apiError && useFallback && (
          <div className="sc-alert-slot">
            <CatalogSyncAlert variant="demo" error={apiError} classPrefix="sc" />
          </div>
        )}
        {apiError && !useFallback && (
          <div className="sc-alert-slot">
            <CatalogSyncAlert variant="production" error={apiError} classPrefix="sc" />
          </div>
        )}

        <div className="sc-services-grid">
          {loadingServices ? (
            [1, 2, 3, 4, 5, 6].map((item) => (
              <div className="sc-service-card sc-service-skeleton" key={item}>
                <div className="icon" />
                <div className="sc-service-line sc-service-line-title" />
                <div className="sc-service-line" />
                <div className="sc-service-line sc-service-line-short" />
              </div>
            ))
          ) : services.length === 0 ? (
            <div className="sc-service-state">
              <div className="sc-service-kicker">Empty Service Registry</div>
              <h3>No live services are published yet.</h3>
              <p>Add service records in the backend and this corporate grid will hydrate automatically.</p>
            </div>
          ) : (
            services.slice(0, 6).map((service, index) => (
              <a className="sc-service-card sc-service-link-card" href={themeLink(`/product/${service.slug}`)} key={service.id}>
                <div className="icon">{serviceIcons[index % serviceIcons.length]}</div>
                <h4 style={{ fontFamily: 'var(--sc-font-heading)', fontWeight: 600, color: 'var(--sc-dark)', marginBottom: '1rem', fontSize: '1.25rem' }}>{service.title}</h4>
                <p style={{ color: 'var(--sc-text-dim)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  {service.short_description || service.description || 'A live service record synchronized from the Sellio service catalog.'}
                </p>
                <div className="sc-service-price">{getServicePriceLabel(service)}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--sc-text-dim)', marginTop: '0.75rem' }}>
                  {getServiceCategoryLabel(service.professional?.category)}
                </div>
              </a>
            ))
          )}
        </div>
      </section>

      <section id="about" className="sc-section" aria-labelledby="sc-about-title">
        <div className="sc-why-us-grid">
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                <img src={aboutImage} alt="Why Choose Us" style={{ width: '100%', height: '100%', minHeight: '400px', objectFit: 'cover', display: 'block', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }} />
            </div>
            <div>
                <h2 className="sc-heading" id="sc-about-title" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{aboutTitle}</h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--sc-text-dim)', marginBottom: '2rem', lineHeight: 1.6 }}>
                    {aboutDescription}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.1rem', fontWeight: 500, color: 'var(--sc-dark)' }}>
                    {[
                      'Proven Track Record of Success',
                      'Expert Team with Diverse Industry Experience',
                      'Tailored Solutions for Unique Challenges',
                      'Data-Driven Insights and Strategies',
                      'Unwavering Commitment to Client Satisfaction',
                    ].map((item) => (
                      <div key={item} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ color: 'var(--sc-accent)', fontWeight: 'bold' }}>✓</span> {item}
                      </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      <section id="case-studies" className="sc-section sc-bg-light" aria-labelledby="sc-case-title">
        <div className="sc-section-title">
          <h2 id="sc-case-title">{caseTitle}</h2>
          <p>{caseDescription}</p>
        </div>
        <div className="sc-case-grid">
          {caseStudies.map((study) => (
            <a href="#services" key={study.title} style={{ textDecoration: 'none', color: 'inherit' }}>
              <CaseStudyCard {...study} href="#services" />
            </a>
          ))}
        </div>
      </section>

      <DynamicTestimonials
        title="What Our Clients Say"
        subtitle="Hear from those who have experienced our impact firsthand."
        limit={3}
        sectionId="testimonials"
        sectionClassName="sc-section"
        titleWrapClassName="sc-section-title"
        layoutClassName="sc-testimonials-layout"
        cardClassName="sc-testimonial-card"
        headingId="sc-testimonials-title"
      />

      <section id="contact" className="sc-cta-banner" aria-labelledby="sc-cta-title">
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="sc-heading" id="sc-cta-title" style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1.5rem' }}>{ctaTitle}</h2>
            <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 0.9 }}>
                {ctaDescription}
            </p>
            <button type="button" className="sc-btn" style={{ background: 'white', color: 'var(--sc-navy)', fontWeight: 700, padding: '1rem 3rem' }} onClick={scrollToServices}>{ctaPrimaryCta}</button>
        </div>
      </section>

      <CorporateFooter />
    </div>
  );
}
