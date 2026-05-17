'use client';
import React from 'react';
import { ModernHeader, ModernCarCard, CompareItem, ModernFooter } from './components';

export default function Page() {
  const cars = [
    { title: "2025 Tesla Model 3", desc: "Available Now | Premium", price: "$39,000", image: "/themes/autos/modern/11.webp" },
    { title: "2025 BMW i4", desc: "Premium Electric Sedan", price: "$55,000", image: "/themes/autos/modern/12.webp" },
    { title: "2025 Toyota Corolla", desc: "Reliable Everyday Car", price: "$22,000", image: "/themes/autos/modern/13.webp" },
    { title: "2025 Audi e-tron GT", desc: "Luxury Performance EV", price: "$88,000", image: "/themes/autos/modern/14.webp" }
  ];

  return (
    <div className="autos-modern-wrapper">
      <ModernHeader />

      {/* Hero Section */}
      <section className="md-hero" id="home">
        <h1 className="md-hero-title">Drive the Future Today</h1>
        <p className="md-hero-subtitle">Explore revolutionary vehicles and redefine your journey.</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#listings" className="md-btn md-btn-cta">Browse Cars</a>
            <a href="#compare" className="md-btn md-btn-outline">Compare Models</a>
        </div>
      </section>

      {/* Filter Section */}
      <section className="md-filter-section">
        <select className="md-select"><option>Brand</option></select>
        <select className="md-select"><option>Model</option></select>
        <select className="md-select"><option>Price Range</option></select>
        <select className="md-select"><option>Year</option></select>
        <div style={{ display: 'flex', flex: 2, minWidth: '250px' }}>
            <input type="text" className="md-search-input" placeholder="Search by Keyword..." style={{ borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0 }} />
            <button className="md-btn md-btn-cta" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, padding: '0 1.5rem' }}>🔍</button>
        </div>
      </section>

      {/* Listings */}
      <section className="md-section" id="listings">
        <h2 className="md-section-title">Featured Electric & Modern Autos</h2>
        <div className="md-grid">
            {cars.map((car, i) => (
                <ModernCarCard key={i} {...car} />
            ))}
        </div>
      </section>

      {/* Compare Head-to-Head */}
      <section className="md-section" id="compare" style={{ backgroundColor: 'white' }}>
        <h2 className="md-section-title">Compare Top Models Head-to-Head</h2>
        <div className="md-compare-grid" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <CompareItem 
                title="Tesla Model 3" 
                stats="Range: 333 mi | 0-60: 4.2s" 
                price="$39k" 
                image="/themes/autos/modern/11.webp" 
            />
            <CompareItem 
                title="BMW i4" 
                stats="Range: 301 mi | 0-60: 5.5s" 
                price="$55k" 
                image="/themes/autos/modern/12.webp" 
                highlight={true}
            />
            <CompareItem 
                title="Hyundai IONIQ 6" 
                stats="Range: 361 mi | 0-60: 5.1s" 
                price="$46k" 
                image="/themes/autos/modern/15.webp" 
            />
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a href="#" className="md-btn md-btn-cta">Start Your Custom Comparison</a>
        </div>
      </section>

      {/* Brands */}
      <section className="md-section" id="brands">
        <h2 className="md-section-title">Driving Innovation with Top Brands</h2>
        <div className="md-brand-grid">
            <div className="md-brand-img">Tesla</div>
            <div className="md-brand-img">BMW</div>
            <div className="md-brand-img">Mercedes</div>
            <div className="md-brand-img">Toyota</div>
            <div className="md-brand-img">Ford</div>
            <div className="md-brand-img">Audi</div>
        </div>
      </section>

      {/* Tech Features */}
      <section className="md-section">
        <h2 className="md-section-title">Experience Next-Generation Technology</h2>
        
        <div className="md-feature-row">
            <div>
                <h3 className="md-text-primary md-fw-bold" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Autonomous AI Driving</h3>
                <p style={{ fontSize: '1.1rem', marginBottom: '1rem', lineHeight: 1.6 }}>Our vehicles are equipped with cutting-edge <strong>Level 3+ Autonomy</strong>, allowing for supervised self-driving on major highways. Experience a safer, more relaxed commute.</p>
                <p style={{ color: '#666', lineHeight: 1.6 }}>Advanced sensor fusion, real-time mapping, and predictive algorithms ensure unparalleled safety and performance in various conditions.</p>
            </div>
            <div>
                <img src="/themes/autos/modern/16.webp" alt="AI Driving" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
            </div>
        </div>

        <div className="md-feature-row">
            <div style={{ order: 2 }}>
                <h3 className="md-text-primary md-fw-bold" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Hybrid & Electric Powertrains</h3>
                <p style={{ fontSize: '1.1rem', marginBottom: '1rem', lineHeight: 1.6 }}>Choose from a selection of the most efficient <strong>Electric and Hybrid engines</strong>. Maximum performance meets minimal environmental impact.</p>
                <p style={{ color: '#666', lineHeight: 1.6 }}>Innovative battery technology provides faster charging, longer range, and a dynamic driving feel, all backed by comprehensive warranties.</p>
            </div>
            <div style={{ order: 1 }}>
                <img src="/themes/autos/modern/17.webp" alt="EV Tech" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
            </div>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
}
