'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { ServiceListing } from '@sellio/types';
import { CorporateHeader, CaseStudyCard, TestimonialCard, CorporateFooter } from './components';

const serviceIcons = ['01', '02', '03', '04', '05', '06'];

export default function Page() {
  const [services, setServices] = useState<ServiceListing[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [serviceError, setServiceError] = useState<string | null>(null);

  const caseStudies = [
    { title: "GlobalTech Solutions", description: "Implemented a new operational strategy, boosting efficiency by 40% and reducing costs by 15%.", image: "/themes/services/corporate/12.webp" },
    { title: "Innovate Pharmaceuticals", description: "Facilitated a successful market entry for a new drug, capturing 10% market share in the first year.", image: "/themes/services/corporate/13.webp" },
    { title: "Future Retail Group", description: "Developed a digital transformation roadmap, leading to a 25% increase in online sales.", image: "/themes/services/corporate/14.webp" },
  ];

  const testimonials = [
    { name: "Jane Doe", title: "CEO, Global Solutions Inc.", quote: "Partnering with Corporate Services was a game-changer for our business. Their strategic insights and dedicated team helped us navigate complex market shifts and achieve unprecedented growth.", avatar: "/themes/services/corporate/15.webp" },
    { name: "John Smith", title: "CFO, Tech Innovations", quote: "The team at Corporate Services provided invaluable support in optimizing our financial strategies. Their expertise directly led to significant cost savings and improved our overall financial health.", avatar: "/themes/services/corporate/16.webp" },
    { name: "Emily White", title: "COO, Apex Ventures", quote: "We were thoroughly impressed by their commitment to understanding our unique challenges and delivering tailored solutions. The results speak for themselves - a stronger team and a clearer path forward.", avatar: "/themes/services/corporate/17.webp" }
  ];

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

        console.error('Failed to load services corporate listings:', error);
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

  const getServiceDescription = (service: ServiceListing) => (
    service.short_description || service.description || 'A live service record synchronized from the Sellio service catalog.'
  );

  const getServicePrice = (service: ServiceListing) => (
    service.pricing?.formatted || service.pricing?.formatted_short || (
      service.pricing?.base_price ? `$${Number(service.pricing.base_price).toLocaleString()}` : 'Request quote'
    )
  );

  return (
    <div className="services-corporate-theme">
      <CorporateHeader />

      {/* Hero Section */}
      <section className="sc-hero" id="sc-hero-section" aria-labelledby="sc-hero-title">
        <div className="sc-hero-content">
          <h1 className="sc-heading-xl" id="sc-hero-title" style={{ marginBottom: '1.5rem', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>Empowering Businesses <br/>for Growth</h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '3rem', fontWeight: 400, opacity: 0.9, textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
            Strategic insights and innovative solutions to drive your success forward.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="sc-btn sc-btn-primary"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Services
            </button>
            <button
              className="sc-btn sc-btn-outline"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get in Touch
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="sc-section sc-bg-light" aria-labelledby="sc-services-title">
        <div className="sc-section-title">
          <h2 id="sc-services-title">Our Core Services</h2>
          <p>Solutions designed to meet your unique business challenges.</p>
        </div>
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
          ) : serviceError ? (
            <div className="sc-service-state">
              <div className="sc-service-kicker">Service Sync Offline</div>
              <h3>Core services could not be loaded.</h3>
              <p>{serviceError}</p>
            </div>
          ) : services.length === 0 ? (
            <div className="sc-service-state">
              <div className="sc-service-kicker">Empty Service Registry</div>
              <h3>No live services are published yet.</h3>
              <p>Add service records in the backend and this corporate grid will hydrate automatically.</p>
            </div>
          ) : (
            services.slice(0, 6).map((service, index) => (
              <a className="sc-service-card sc-service-link-card" href={`/product/${service.slug}`} key={service.id}>
                <div className="icon">{serviceIcons[index % serviceIcons.length]}</div>
                <h4 style={{ fontFamily: 'var(--sc-font-heading)', fontWeight: 600, color: 'var(--sc-dark)', marginBottom: '1rem', fontSize: '1.25rem' }}>{service.title}</h4>
                <p style={{ color: 'var(--sc-text-dim)', lineHeight: 1.6, fontSize: '0.95rem' }}>{getServiceDescription(service)}</p>
                <div className="sc-service-price">{getServicePrice(service)}</div>
              </a>
            ))
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="about" className="sc-section" aria-labelledby="sc-about-title">
        <div className="sc-why-us-grid">
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                <img src="/themes/services/corporate/11.webp" alt="Why Choose Us" style={{ width: '100%', height: '100%', minHeight: '400px', objectFit: 'cover', display: 'block', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }} />
            </div>
            <div>
                <h2 className="sc-heading" id="sc-about-title" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Why Partner with Us?</h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--sc-text-dim)', marginBottom: '2rem', lineHeight: 1.6 }}>
                    We are committed to delivering exceptional value through our deep expertise and client-centric approach.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.1rem', fontWeight: 500, color: 'var(--sc-dark)' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><span style={{ color: 'var(--sc-accent)', fontWeight: 'bold' }}>✓</span> Proven Track Record of Success</div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><span style={{ color: 'var(--sc-accent)', fontWeight: 'bold' }}>✓</span> Expert Team with Diverse Industry Experience</div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><span style={{ color: 'var(--sc-accent)', fontWeight: 'bold' }}>✓</span> Tailored Solutions for Unique Challenges</div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><span style={{ color: 'var(--sc-accent)', fontWeight: 'bold' }}>✓</span> Data-Driven Insights and Strategies</div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><span style={{ color: 'var(--sc-accent)', fontWeight: 'bold' }}>✓</span> Unwavering Commitment to Client Satisfaction</div>
                </div>
            </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className="sc-section sc-bg-light" aria-labelledby="sc-case-title">
        <div className="sc-section-title">
          <h2 id="sc-case-title">Our Success Stories</h2>
          <p>Real-world impact of our strategic partnerships.</p>
        </div>
        <div className="sc-case-grid">
          {caseStudies.map((c, i) => (
            <div key={i} onClick={() => alert(`Reviewing case study: ${c.title}`)}>
              <CaseStudyCard {...c} />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="sc-section" aria-labelledby="sc-testimonials-title">
        <div className="sc-section-title">
          <h2 id="sc-testimonials-title">What Our Clients Say</h2>
          <p>Hear from those who have experienced our impact firsthand.</p>
        </div>
        <div className="sc-testimonials-layout">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>
      </section>

      {/* CTA Banner Section */}
      <section id="contact" className="sc-cta-banner" aria-labelledby="sc-cta-title">
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="sc-heading" id="sc-cta-title" style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1.5rem' }}>Ready to Transform Your Business?</h2>
            <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 0.9 }}>
                Connect with our experts today to discuss your specific needs and goals.
            </p>
            <button className="sc-btn" style={{ background: 'white', color: 'var(--sc-navy)', fontWeight: 700, padding: '1rem 3rem' }} onClick={() => alert('Consultation request protocol initialized.')}>Request a Consultation</button>
        </div>
      </section>

      <CorporateFooter />
    </div>
  );
}
