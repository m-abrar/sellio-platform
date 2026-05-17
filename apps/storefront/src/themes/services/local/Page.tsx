
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
    { name: "John D.", title: "Handyman Expert", rating: "4.8", jobs: "120", image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=400" },
    { name: "Sarah K.", title: "Professional Cleaner", rating: "4.9", jobs: "210", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400" },
    { name: "Mike A.", title: "Certified Plumber", rating: "4.7", jobs: "85", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400" },
    { name: "Lisa M.", title: "Lawn & Garden Specialist", rating: "5.0", jobs: "55", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400" },
  ];

  return (
    <div className="services-local-wrapper">
      <LocalHeader />

      {/* Hero Section */}
      <section className="local-hero">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1>Trusted Services for <br/>Your Home & Family</h1>
          <p>Find background-checked professionals for cleaning, repair, maintenance, and more—all in one place.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="local-btn local-btn-primary">Explore Services</button>
            <button className="local-btn local-btn-outline">Read Testimonials</button>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="local-filter-bar">
        <div style={{ fontWeight: 600, color: 'var(--local-text-muted)', marginRight: '1rem' }}>Quick Filter:</div>
        <select className="local-select"><option>Service Type</option></select>
        <select className="local-select"><option>Location (e.g., Zip)</option></select>
        <select className="local-select"><option>Availability</option></select>
        <select className="local-select"><option>Price Range</option></select>
        <button className="local-btn" style={{ background: 'var(--local-green)', color: 'white', border: 'none', flex: 1, minWidth: '150px' }}>Search</button>
      </section>

      {/* Popular Services */}
      <section id="services" className="local-section">
        <h2 style={{ textAlign: 'center', fontWeight: 800, marginBottom: '4rem', fontSize: '2.5rem' }}>Our Popular Services</h2>
        <div className="local-grid">
          {services.map((s, i) => (
            <LocalServiceCard key={i} {...s} />
          ))}
        </div>
      </section>

      {/* Top Providers */}
      <section id="providers" className="local-section" style={{ background: 'white' }}>
        <h2 style={{ textAlign: 'center', fontWeight: 800, marginBottom: '4rem', fontSize: '2.5rem' }}>Meet Our Top-Rated Providers</h2>
        <div className="local-grid">
          {providers.map((p, i) => (
            <ProviderCard key={i} {...p} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="local-section text-center">
        <h2 style={{ textAlign: 'center', fontWeight: 800, marginBottom: '4rem', fontSize: '2.5rem' }}>How HomeFix Works in 3 Simple Steps</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
            <div>
                <div className="local-step-icon">🔍</div>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>1. Search & Filter</h4>
                <p style={{ color: 'var(--local-text-muted)' }}>Easily find the service you need by location, type, and availability using our smart filters.</p>
            </div>
            <div>
                <div className="local-step-icon">📅</div>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>2. Book & Confirm</h4>
                <p style={{ color: 'var(--local-text-muted)' }}>Select a top-rated professional and instantly book a time slot that works for your schedule.</p>
            </div>
            <div>
                <div className="local-step-icon">❤️</div>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>3. Relax & Enjoy</h4>
                <p style={{ color: 'var(--local-text-muted)' }}>A trusted pro arrives, gets the job done right, and you rate your experience. Simple as that!</p>
            </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="local-section" style={{ background: 'white', textAlign: 'center' }}>
        <h2 style={{ fontWeight: 800, marginBottom: '4rem', fontSize: '2.5rem' }}>What Our Community Says</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--local-bg)', padding: '4rem', borderRadius: '16px' }}>
            <div style={{ fontSize: '3rem', color: 'var(--local-yellow)', marginBottom: '1.5rem', lineHeight: 1 }}>"</div>
            <p style={{ fontStyle: 'italic', fontSize: '1.25rem', marginBottom: '2rem', color: 'var(--local-text-muted)' }}>
                "The easiest way I've ever found a reliable cleaner! Sarah K. was punctual, professional, and my house sparkled. Highly recommend HomeFix to my neighbors."
            </p>
            <p style={{ fontWeight: 700 }}>- Jessica L. (Home Cleaning Client)</p>
        </div>
      </section>

      {/* Trust/Safety */}
      <section className="local-section text-center">
        <h2 style={{ fontWeight: 800, marginBottom: '4rem', fontSize: '2.5rem' }}>Your Safety is Our Priority</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div style={{ background: 'white', padding: '3rem 2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '3rem', color: 'var(--local-green)', marginBottom: '1rem' }}>🛡️</div>
                <h5 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Background-Checked</h5>
                <p style={{ color: 'var(--local-text-muted)' }}>Every professional is vetted for your peace of mind.</p>
            </div>
            <div style={{ background: 'white', padding: '3rem 2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '3rem', color: 'var(--local-green)', marginBottom: '1rem' }}>✅</div>
                <h5 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Insured & Guaranteed</h5>
                <p style={{ color: 'var(--local-text-muted)' }}>Workmanship is covered by our service guarantee.</p>
            </div>
            <div style={{ background: 'white', padding: '3rem 2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '3rem', color: 'var(--local-green)', marginBottom: '1rem' }}>📞</div>
                <h5 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>24/7 Support</h5>
                <p style={{ color: 'var(--local-text-muted)' }}>Help is always just a call or click away, day or night.</p>
            </div>
        </div>
      </section>

      <LocalFooter />
    </div>
  );
}
