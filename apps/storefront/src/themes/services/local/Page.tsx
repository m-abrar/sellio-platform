'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { ServiceListing } from '@sellio/types';
import { LocalHeader, LocalServiceCard, ProviderCard, LocalFooter } from './components';
import { DynamicTestimonials } from '@/components/testimonials/DynamicTestimonials';

const serviceIcons = ['🏠', '🔧', '⚡', '🌳', '🌡️', '🔨'];

const providers = [
  { name: 'John D.', title: 'Handyman Expert', rating: '4.8', jobs: '120', image: '/themes/services/local/15.webp' },
  { name: 'Sarah K.', title: 'Professional Cleaner', rating: '4.9', jobs: '210', image: '/themes/services/local/16.webp' },
  { name: 'Mike A.', title: 'Certified Plumber', rating: '4.7', jobs: '85', image: '/themes/services/local/17.webp' },
  { name: 'Lisa M.', title: 'Lawn & Garden Specialist', rating: '5.0', jobs: '55', image: '/themes/services/local/18.webp' },
];

function getServicePrice(service: ServiceListing) {
  return service.pricing?.formatted || service.pricing?.formatted_short || (
    service.pricing?.base_price ? `From $${Number(service.pricing.base_price).toLocaleString()}` : 'Free Quote'
  );
}

function mapServiceToCard(service: ServiceListing, index: number) {
  const price = getServicePrice(service);

  return {
    title: `${service.title} – ${price}`,
    description: service.short_description || service.description || 'A trusted local service available through the HomeFix network.',
    icon: serviceIcons[index % serviceIcons.length],
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

        console.error('Failed to load services local listings:', error);
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
    <div className="services-local-wrapper">
      <LocalHeader />

      {/* Hero Section */}
      <section className="local-hero" id="local-hero-section" aria-labelledby="local-hero-title">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 id="local-hero-title">Trusted Services for <br/>Your Home & Family</h1>
          <p>Find background-checked professionals for cleaning, repair, maintenance, and more—all in one place.</p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="local-btn local-btn-primary"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Services
            </button>
            <button
              className="local-btn local-btn-outline"
              onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Read Testimonials
            </button>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="local-filter-bar" aria-label="Search Filter Bar">
        <div style={{ fontWeight: 600, color: 'var(--local-text-muted)', marginRight: '1rem' }}>Quick Filter:</div>
        <select className="local-select" aria-label="Service Type Select"><option>Service Type</option></select>
        <select className="local-select" aria-label="Location Select"><option>Location (Zip)</option></select>
        <select className="local-select" aria-label="Availability Select"><option>Availability</option></select>
        <select className="local-select" aria-label="Price Select"><option>Price Range</option></select>
        <button className="local-btn" style={{ background: 'var(--local-green)', color: 'white', border: 'none', flex: 1, minWidth: '150px' }} onClick={() => alert('Search initiated.')}>Search</button>
      </section>

      {/* Popular Services */}
      <section id="services" className="local-section" aria-labelledby="local-services-title">
        <h2 id="local-services-title" style={{ textAlign: 'center', fontWeight: 800, marginBottom: '4rem', fontSize: '2.5rem' }}>Our Popular Services</h2>
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
          ) : serviceError ? (
            <div className="local-listing-state">
              <div className="local-listing-kicker">Service Sync Offline</div>
              <h3>Popular services could not be loaded.</h3>
              <p>{serviceError}</p>
            </div>
          ) : services.length === 0 ? (
            <div className="local-listing-state">
              <div className="local-listing-kicker">Empty Service Registry</div>
              <h3>No live services are published yet.</h3>
              <p>Add service records in the backend and this local services grid will hydrate automatically.</p>
            </div>
          ) : (
            services.slice(0, 6).map((service, index) => {
              const card = mapServiceToCard(service, index);
              return (
                <a className="local-service-link" href={`/product/${card.slug}`} key={service.id}>
                  <LocalServiceCard title={card.title} description={card.description} icon={card.icon} />
                </a>
              );
            })
          )}
        </div>
      </section>

      {/* Top Providers */}
      <section id="providers" className="local-section" style={{ background: 'white' }} aria-labelledby="local-providers-title">
        <h2 id="local-providers-title" style={{ textAlign: 'center', fontWeight: 800, marginBottom: '4rem', fontSize: '2.5rem' }}>Meet Our Top-Rated Providers</h2>
        <div className="local-grid">
          {providers.map((p, i) => (
            <ProviderCard key={i} {...p} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="local-section text-center" aria-labelledby="local-how-title">
        <h2 id="local-how-title" style={{ textAlign: 'center', fontWeight: 800, marginBottom: '4rem', fontSize: '2.5rem' }}>How HomeFix Works in 3 Simple Steps</h2>
        <div className="local-steps-grid">
            <div>
                <div className="local-step-icon">🔍</div>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>1. Search & Filter</h4>
                <p style={{ color: 'var(--local-text-muted)', lineHeight: 1.6 }}>Easily find the service you need by location, type, and availability using our smart filters.</p>
            </div>
            <div>
                <div className="local-step-icon">📅</div>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>2. Book & Confirm</h4>
                <p style={{ color: 'var(--local-text-muted)', lineHeight: 1.6 }}>Select a top-rated professional and instantly book a time slot that works for your schedule.</p>
            </div>
            <div>
                <div className="local-step-icon">❤️</div>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>3. Relax & Enjoy</h4>
                <p style={{ color: 'var(--local-text-muted)', lineHeight: 1.6 }}>A trusted pro arrives, gets the job done right, and you rate your experience. Simple as that!</p>
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
        headingId="local-testimonials-title"
      />

      {/* Trust/Safety */}
      <section className="local-section text-center" aria-labelledby="local-safety-title">
        <h2 id="local-safety-title" style={{ fontWeight: 800, marginBottom: '4rem', fontSize: '2.5rem' }}>Your Safety is Our Priority</h2>
        <div className="local-safety-grid">
            <div className="local-safety-card">
                <div style={{ fontSize: '3rem', color: 'var(--local-green)', marginBottom: '1rem' }}>🛡️</div>
                <h5 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.2rem' }}>Background-Checked</h5>
                <p style={{ color: 'var(--local-text-muted)' }}>Every professional is vetted for your peace of mind.</p>
            </div>
            <div className="local-safety-card">
                <div style={{ fontSize: '3rem', color: 'var(--local-green)', marginBottom: '1rem' }}>✅</div>
                <h5 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.2rem' }}>Insured & Guaranteed</h5>
                <p style={{ color: 'var(--local-text-muted)' }}>Workmanship is covered by our service guarantee.</p>
            </div>
            <div className="local-safety-card">
                <div style={{ fontSize: '3rem', color: 'var(--local-green)', marginBottom: '1rem' }}>📞</div>
                <h5 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.2rem' }}>24/7 Support</h5>
                <p style={{ color: 'var(--local-text-muted)' }}>Help is always just a call or click away, day or night.</p>
            </div>
        </div>
      </section>

      <LocalFooter />
    </div>
  );
}
