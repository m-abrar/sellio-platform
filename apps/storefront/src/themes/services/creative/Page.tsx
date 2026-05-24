'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { ServiceListing } from '@sellio/types';
import { CrtvHeader, CrtvCategoryCard, CrtvCreativeCard, CrtvPortfolioItem, CrtvFooter } from './components';
import { DynamicTestimonials } from '@/components/testimonials/DynamicTestimonials';

const fallbackImages = [
  '/themes/services/creative/15.webp',
  '/themes/services/creative/16.webp',
  '/themes/services/creative/17.webp',
];

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

function getServicePrice(service: ServiceListing) {
  return service.pricing?.formatted || service.pricing?.formatted_short || (
    service.pricing?.base_price ? `$${Number(service.pricing.base_price).toLocaleString()}/hr` : 'Request quote'
  );
}

function mapServiceToCreative(service: ServiceListing, index: number) {
  return {
    name: service.provider?.name || service.title,
    title: service.professional?.category || service.professional?.type || service.short_description || 'Creative Professional',
    rating: service.provider?.rating ? service.provider.rating.toFixed(1) : '5.0',
    rate: getServicePrice(service),
    image: service.media?.main_photo || service.provider?.avatar || fallbackImages[index % fallbackImages.length],
    slug: service.slug,
  };
}

export default function Page() {
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

        console.error('Failed to load services creative listings:', error);
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
    <div className="services-creative-theme">
      <CrtvHeader />

      {/* Hero Section */}
      <section className="crtv-hero" id="crtv-hero-section" aria-labelledby="crtv-hero-title">
        <div className="crtv-hero-overlay"></div>
        <div className="crtv-hero-content">
          <h1 id="crtv-hero-title">Hire Creative Talent Worldwide</h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 0.9 }}>
            Discover exceptional freelancers for your projects, from design to development.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="crtv-btn crtv-btn-gradient"
              style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
              onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Browse Creatives
            </button>
            <button
              className="crtv-btn crtv-btn-outline"
              style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Showcase Your Work
            </button>
          </div>
        </div>
      </section>

      {/* Search Filters */}
      <section className="crtv-search-bar" aria-label="Creative Search Filters">
        <input type="text" className="crtv-search-input" placeholder="Search for skills, creatives, or projects..." style={{ flex: 2 }} />
        <select className="crtv-select" aria-label="Category Selection"><option>Category</option></select>
        <select className="crtv-select" aria-label="Budget Selection"><option>Budget</option></select>
        <select className="crtv-select" aria-label="Rating Selection"><option>Rating</option></select>
        <button className="crtv-btn" style={{ background: '#6c757d', color: 'white' }} onClick={() => alert('Filters applied.')}>Filter</button>
      </section>

      {/* Categories */}
      <section className="crtv-section" id="categories" aria-labelledby="crtv-cat-title">
        <h2 className="crtv-section-title" id="crtv-cat-title"><span className="gradient-text">Featured Creative Categories</span></h2>
        <div className="crtv-category-grid">
          {categories.map((c, i) => (
            <div key={i} onClick={() => alert(`Exploring Category: ${c.title}`)}>
              <CrtvCategoryCard {...c} />
            </div>
          ))}
        </div>
      </section>

      {/* Top Creatives */}
      <section className="crtv-section" style={{ background: 'white' }} id="pricing" aria-labelledby="crtv-creatives-title">
        <h2 className="crtv-section-title" id="crtv-creatives-title">Meet Our <span className="gradient-text">Top Creatives</span></h2>
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
          ) : serviceError ? (
            <div className="crtv-listing-state">
              <div className="crtv-listing-kicker">Creative Sync Offline</div>
              <h3>Top creatives could not be loaded.</h3>
              <p>{serviceError}</p>
            </div>
          ) : services.length === 0 ? (
            <div className="crtv-listing-state">
              <div className="crtv-listing-kicker">Empty Creative Registry</div>
              <h3>No live services are published yet.</h3>
              <p>Add service records in the backend and this creative grid will hydrate automatically.</p>
            </div>
          ) : (
            services.slice(0, 6).map((service, index) => {
              const creative = mapServiceToCreative(service, index);
              return (
                <a className="crtv-creative-link" href={`/product/${creative.slug}`} key={service.id}>
                  <CrtvCreativeCard {...creative} />
                </a>
              );
            })
          )}
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section className="crtv-section" id="portfolios" aria-labelledby="crtv-showcase-title">
        <h2 className="crtv-section-title" id="crtv-showcase-title"><span className="gradient-text">Inspiring Portfolio Showcase</span></h2>
        <div className="crtv-masonry">
          {portfolios.map((p, i) => (
            <CrtvPortfolioItem key={i} {...p} />
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
        headingId="crtv-testimonial-title"
      />

      {/* CTA Banner */}
      <section className="crtv-cta-banner" id="contact" aria-labelledby="crtv-cta-title">
        <h2 id="crtv-cta-title" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>Ready to Hire or Get Hired?</h2>
        <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 0.9 }}>Join the Creative Community Today and turn your vision into reality.</p>
        <button className="crtv-btn" style={{ background: 'white', color: '#121212', padding: '1.2rem 3rem', fontSize: '1.1rem', fontWeight: 700 }} onClick={() => alert('Onboarding sequence started!')}>Sign Up Now</button>
      </section>

      <CrtvFooter />
    </div>
  );
}
