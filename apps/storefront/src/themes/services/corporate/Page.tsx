
'use client';
import React from 'react';
import { CorporateHeader, ServiceCard, CaseStudyCard, TestimonialCard, CorporateFooter } from './components';

export default function Page() {
  const services = [
    { title: "Business Strategy Consulting", description: "Unlock growth opportunities and build resilient business models for the future.", icon: "📈" },
    { title: "Corporate Finance", description: "Optimize capital structure, manage risks, and maximize shareholder value.", icon: "💰" },
    { title: "Organizational Development", description: "Enhance team performance, streamline operations, and foster a culture of innovation.", icon: "👥" },
    { title: "Innovation & Transformation", description: "Leverage cutting-edge technology to stay ahead in a rapidly evolving market.", icon: "💡" },
    { title: "Mergers & Acquisitions", description: "Navigate complex transactions with expert advice from due diligence to integration.", icon: "🤝" },
    { title: "Market Entry Strategies", description: "Successfully expand into new markets with comprehensive research and planning.", icon: "🌍" },
  ];

  const caseStudies = [
    { title: "GlobalTech Solutions", description: "Implemented a new operational strategy, boosting efficiency by 40% and reducing costs by 15%.", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070" },
    { title: "Innovate Pharmaceuticals", description: "Facilitated a successful market entry for a new drug, capturing 10% market share in the first year.", image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1974" },
    { title: "Future Retail Group", description: "Developed a digital transformation roadmap, leading to a 25% increase in online sales.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015" },
  ];

  const testimonials = [
    { name: "Jane Doe", title: "CEO, Global Solutions Inc.", quote: "Partnering with Corporate Services was a game-changer for our business. Their strategic insights and dedicated team helped us navigate complex market shifts and achieve unprecedented growth.", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100" },
    { name: "John Smith", title: "CFO, Tech Innovations", quote: "The team at Corporate Services provided invaluable support in optimizing our financial strategies. Their expertise directly led to significant cost savings and improved our overall financial health.", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100" },
    { name: "Emily White", title: "COO, Apex Ventures", quote: "We were thoroughly impressed by their commitment to understanding our unique challenges and delivering tailored solutions. The results speak for themselves – a stronger team and a clearer path forward.", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100" }
  ];

  return (
    <div className="services-corporate-theme">
      <CorporateHeader />

      {/* Hero Section */}
      <section className="sc-hero">
        <div className="sc-hero-content">
          <h1 className="sc-heading-xl" style={{ marginBottom: '1.5rem', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>Empowering Businesses <br/>for Growth</h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '3rem', fontWeight: 400, opacity: 0.9, textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
            Strategic insights and innovative solutions to drive your success forward.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="#services" className="sc-btn sc-btn-primary">Explore Services</a>
            <a href="#contact" className="sc-btn sc-btn-outline">Get in Touch</a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="sc-section sc-bg-light">
        <div className="sc-section-title">
          <h2>Our Core Services</h2>
          <p>Solutions designed to meet your unique business challenges.</p>
        </div>
        <div className="sc-services-grid">
          {services.map((s, i) => (
            <ServiceCard key={i} {...s} />
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="about" className="sc-section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
                <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070" alt="Why Choose Us" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }} />
            </div>
            <div>
                <h2 className="sc-heading" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Why Partner with Us?</h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--sc-text-dim)', marginBottom: '2rem', lineHeight: 1.6 }}>
                    We are committed to delivering exceptional value through our deep expertise and client-centric approach.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.1rem', fontWeight: 500, color: 'var(--sc-dark)' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><span style={{ color: 'var(--sc-accent)' }}>✔</span> Proven Track Record of Success</div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><span style={{ color: 'var(--sc-accent)' }}>✔</span> Expert Team with Diverse Industry Experience</div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><span style={{ color: 'var(--sc-accent)' }}>✔</span> Tailored Solutions for Unique Challenges</div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><span style={{ color: 'var(--sc-accent)' }}>✔</span> Data-Driven Insights and Strategies</div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><span style={{ color: 'var(--sc-accent)' }}>✔</span> Unwavering Commitment to Client Satisfaction</div>
                </div>
            </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className="sc-section sc-bg-light">
        <div className="sc-section-title">
          <h2>Our Success Stories</h2>
          <p>Real-world impact of our strategic partnerships.</p>
        </div>
        <div className="sc-case-grid">
          {caseStudies.map((c, i) => (
            <CaseStudyCard key={i} {...c} />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="sc-section">
        <div className="sc-section-title">
          <h2>What Our Clients Say</h2>
          <p>Hear from those who have experienced our impact firsthand.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>
      </section>

      {/* CTA Banner Section */}
      <section id="contact" className="sc-cta-banner">
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="sc-heading" style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1.5rem' }}>Ready to Transform Your Business?</h2>
            <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 0.9 }}>
                Connect with our experts today to discuss your specific needs and goals.
            </p>
            <button className="sc-btn" style={{ background: 'white', color: 'var(--sc-accent)' }}>Request a Consultation</button>
        </div>
      </section>

      <CorporateFooter />
    </div>
  );
}
