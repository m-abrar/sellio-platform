'use client';
import React from 'react';
import { LocalHeader, LocalServiceCard, ProviderCard, LocalFooter } from './components';

export default function Page() {
  const services = [
    { title: "Home Cleaning – From $60", description: "Reliable and thorough cleaning services for homes and apartments. Book weekly or one-time visits.", icon: "🏠" },
    { title: "Plumbing Repair – From $75", description: "Fast and professional repairs for leaks, clogged drains, and fixture installation.", icon: "🔧" },
    { title: "Electrical Wiring – Free Quote", description: "Certified electricians for safe installations, repairs, and electrical system upgrades.", icon: "⚡" },
    { title: "Lawn Care & Gardening", description: "Keep your yard pristine with mowing, trimming, and seasonal planting services.", icon: "🌳" },
    { title: "HVAC Maintenance", description: "Ensure your heating and cooling systems run efficiently all year long with expert tune-ups.", icon: "🌡️" },
    { title: "Handyman Services", description: "For all those small jobs: mounting TVs, furniture assembly, patching drywall, and more.", icon: "🔨" }
  ];

  const providers = [
    { name: "John D.", title: "Handyman Expert", rating: "4.8", jobs: "120", image: "/themes/services/local/15.webp" },
    { name: "Sarah K.", title: "Professional Cleaner", rating: "4.9", jobs: "210", image: "/themes/services/local/16.webp" },
    { name: "Mike A.", title: "Certified Plumber", rating: "4.7", jobs: "85", image: "/themes/services/local/17.webp" },
    { name: "Lisa M.", title: "Lawn & Garden Specialist", rating: "5.0", jobs: "55", image: "/themes/services/local/18.webp" },
  ];

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
          {services.map((s, i) => (
            <LocalServiceCard key={i} {...s} />
          ))}
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

      {/* Testimonials */}
      <section id="testimonials" className="local-section" style={{ background: 'white', textAlign: 'center' }} aria-labelledby="local-testimonials-title">
        <h2 id="local-testimonials-title" style={{ fontWeight: 800, marginBottom: '4rem', fontSize: '2.5rem' }}>What Our Community Says</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--local-bg)', padding: '4rem', borderRadius: '16px', border: '1px solid var(--local-border)' }}>
            <div style={{ fontSize: '3rem', color: 'var(--local-yellow)', marginBottom: '1.5rem', lineHeight: 1 }}>"</div>
            <p style={{ fontStyle: 'italic', fontSize: '1.25rem', marginBottom: '2rem', color: 'var(--local-text-muted)', lineHeight: 1.6 }}>
                "The easiest way I've ever found a reliable cleaner! Sarah K. was punctual, professional, and my house sparkled. Highly recommend HomeFix to my neighbors."
            </p>
            <p style={{ fontWeight: 700 }}>- Jessica L. (Home Cleaning Client)</p>
        </div>
      </section>

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
