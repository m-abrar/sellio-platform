'use client';

import React, { useEffect, useState } from 'react';
import type { ServiceListing } from '@/types';
import { CrtvHeader, CrtvCategoryCard, CrtvCreativeCard, CrtvPortfolioItem, CrtvFooter } from './components';
import { DynamicTestimonials } from '@/components/testimonials/DynamicTestimonials';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/services/shared/CatalogSyncAlert';
import { fetchServicesHome, resolveServicesFailure } from '@/themes/services/shared/catalog';
import { mapServiceToCreativeCard } from '@/themes/services/shared/service-utils';
import { useDemoFallbackAllowed } from '@/themes/services/shared/useDemoFallbackAllowed';
import { useServicesThemeLink } from '@/themes/services/shared/useServicesThemeLink';

const categories = [
  { title: 'Graphic Design', rate: 'From $100', icon: '🎨' },
  { title: 'Writing & Content', rate: 'Copywriting, SEO', icon: '✍️' },
  { title: 'Photography', rate: 'Events, Products', icon: '📸' },
  { title: 'Web Development', rate: 'Full Stack, CMS', icon: '💻' },
  { title: 'Music & Audio', rate: 'Sound Design', icon: '🎵' },
  { title: 'Marketing', rate: 'Social Media', icon: '📈' },
];

const portfolios = [
  { title: 'Modern UI Kit', category: 'Graphic Design', image: '/themes/services/creative/11.webp' },
  { title: 'Brand Identity', category: 'Branding', image: '/themes/services/creative/12.webp' },
  { title: 'Urban Photography', category: 'Photography', image: '/themes/services/creative/13.webp' },
  { title: 'SaaS Website', category: 'UX/UI Design', image: '/themes/services/creative/14.webp' },
  { title: 'Product Ad Copy', category: 'Writing', image: '/themes/services/creative/2.webp' },
  { title: 'Mobile App Concept', category: 'Development', image: '/themes/services/creative/3.webp' },
];

export default function Page() {
  const themeLink = useServicesThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const heroTitle = useThemeContent('hero.title', 'Hire Creative Talent Worldwide');
  const heroDescription = useThemeContent('hero.description', 'Discover exceptional freelancers for your projects, from design to development.');
  const heroPrimaryCta = useThemeContent('hero.primary_cta_label', 'Browse Creatives');
  const heroSecondaryCta = useThemeContent('hero.secondary_cta_label', 'Showcase Your Work');
  const categoriesTitle = useThemeContent('categories.title', 'Featured Creative Categories');
  const creativesTitle = useThemeContent('creatives.title', 'Meet Our Top Creatives');
  const showcaseTitle = useThemeContent('showcase.title', 'Inspiring Portfolio Showcase');
  const ctaTitle = useThemeContent('cta.title', 'Ready to Hire or Get Hired?');
  const ctaDescription = useThemeContent('cta.description', 'Join the Creative Community Today and turn your vision into reality.');
  const ctaPrimaryCta = useThemeContent('cta.primary_cta_label', 'Sign Up Now');

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
        const resolution = resolveServicesFailure(allowDemo, 'creative');

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

  const scrollToCreatives = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="services-creative-theme">
      <CrtvHeader />

      <section className="crtv-hero" id="crtv-hero-section" aria-labelledby="crtv-hero-title">
        <div className="crtv-hero-overlay"></div>
        <div className="crtv-hero-content">
          <h1 id="crtv-hero-title">{heroTitle}</h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 0.9 }}>
            {heroDescription}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="crtv-btn crtv-btn-gradient" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }} onClick={scrollToCreatives}>
              {heroPrimaryCta}
            </button>
            <button type="button" className="crtv-btn crtv-btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }} onClick={scrollToContact}>
              {heroSecondaryCta}
            </button>
          </div>
        </div>
      </section>

      <section className="crtv-search-bar" aria-label="Creative Search Filters">
        <input type="text" className="crtv-search-input" placeholder="Search for skills, creatives, or projects..." style={{ flex: 2 }} readOnly onFocus={scrollToCreatives} />
        <select className="crtv-select" aria-label="Category Selection" defaultValue="" onChange={scrollToCreatives}><option value="">Category</option></select>
        <select className="crtv-select" aria-label="Budget Selection" defaultValue="" onChange={scrollToCreatives}><option value="">Budget</option></select>
        <select className="crtv-select" aria-label="Rating Selection" defaultValue="" onChange={scrollToCreatives}><option value="">Rating</option></select>
        <button type="button" className="crtv-btn" style={{ background: '#6c757d', color: 'white' }} onClick={scrollToCreatives}>Filter</button>
      </section>

      <section className="crtv-section" id="categories" aria-labelledby="crtv-cat-title">
        <h2 className="crtv-section-title" id="crtv-cat-title"><span className="gradient-text">{categoriesTitle}</span></h2>
        <div className="crtv-category-grid">
          {categories.map((category) => (
            <button type="button" key={category.title} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'inherit' }} onClick={scrollToCreatives}>
              <CrtvCategoryCard {...category} />
            </button>
          ))}
        </div>
      </section>

      <section className="crtv-section" style={{ background: 'white' }} id="pricing" aria-labelledby="crtv-creatives-title">
        <h2 className="crtv-section-title" id="crtv-creatives-title">
          {creativesTitle.includes('Top Creatives') ? (
            <>
              {creativesTitle.replace('Top Creatives', '')}
              <span className="gradient-text">Top Creatives</span>
            </>
          ) : creativesTitle}
        </h2>

        {apiError && useFallback && (
          <div className="crtv-alert-slot">
            <CatalogSyncAlert variant="demo" error={apiError} classPrefix="crtv" />
          </div>
        )}
        {apiError && !useFallback && (
          <div className="crtv-alert-slot">
            <CatalogSyncAlert variant="production" error={apiError} classPrefix="crtv" />
          </div>
        )}

        <div className="crtv-creative-grid">
          {loadingServices ? (
            [1, 2, 3].map((item) => (
              <div className="crtv-creative-card crtv-listing-skeleton" key={item}>
                <div className="crtv-skeleton-avatar" />
                <div className="crtv-skeleton-line crtv-skeleton-line-title" />
                <div className="crtv-skeleton-line" />
                <div className="crtv-skeleton-line crtv-skeleton-line-short" />
              </div>
            ))
          ) : services.length === 0 ? (
            <div className="crtv-listing-state">
              <div className="crtv-listing-kicker">No Creatives Yet</div>
              <h3>No live services are published yet.</h3>
              <p>Add service records in the admin panel to populate this grid.</p>
            </div>
          ) : (
            services.slice(0, 6).map((service, index) => {
              const creative = mapServiceToCreativeCard(service, index);
              return (
                <a className="crtv-creative-link" href={themeLink(`/product/${creative.slug}`)} key={service.id}>
                  <CrtvCreativeCard {...creative} />
                </a>
              );
            })
          )}
        </div>
      </section>

      <section className="crtv-section" id="portfolios" aria-labelledby="crtv-showcase-title">
        <h2 className="crtv-section-title" id="crtv-showcase-title"><span className="gradient-text">{showcaseTitle}</span></h2>
        <div className="crtv-masonry">
          {portfolios.map((portfolio) => (
            <CrtvPortfolioItem key={portfolio.title} {...portfolio} />
          ))}
        </div>
      </section>

      <DynamicTestimonials
        title="Trusted by Clients & Creatives"
        limit={3}
        variant="centered"
        quoteDecor="creative"
        sectionClassName="crtv-section"
        sectionStyle={{ background: 'white' }}
        titleClassName="crtv-section-title"
        layoutClassName="crtv-testimonials-layout"
        cardClassName="crtv-testimonial-container"
        headingId="sc-testimonials-title"
      />

      <section className="crtv-cta-banner" id="contact" aria-labelledby="crtv-cta-title">
        <h2 id="crtv-cta-title" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>{ctaTitle}</h2>
        <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 0.9 }}>{ctaDescription}</p>
        <button type="button" className="crtv-btn" style={{ background: 'white', color: '#121212', padding: '1.2rem 3rem', fontSize: '1.1rem', fontWeight: 700 }} onClick={scrollToCreatives}>{ctaPrimaryCta}</button>
      </section>

      <CrtvFooter />
    </div>
  );
}
