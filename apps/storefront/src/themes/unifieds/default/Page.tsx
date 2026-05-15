
import React from 'react';
import { ServiceCard } from './components';

export default function Page() {
  const services = [
    { 
        title: "Dynamic Commerce", 
        description: "Scale your retail operations with our high-performance ecommerce engine optimized for speed and conversion.",
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
    },
    { 
        title: "Real Estate Nexus", 
        description: "Transform property management with interactive listings, map integrations, and seamless lead generation.",
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
    },
    { 
        title: "Auto Intelligence", 
        description: "The premier solution for automotive marketplaces, featuring technical specs, VIN decoding, and sleek galleries.",
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
    }
  ];

  return (
    <div>
      {/* Hero */}
      <section className="uni-hero">
        <div className="uni-hero-content">
            <h1 className="uni-hero-title">One Platform. <br/>Infinite Possibilities.</h1>
            <p className="uni-hero-subtitle">
                StyleTime is the world's most flexible multi-vertical marketplace engine, designed to power everything from global retail to local property listings.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                <button style={{ 
                    padding: '1.25rem 3rem', 
                    borderRadius: '16px', 
                    border: 'none', 
                    background: '#1e4d4e', 
                    color: 'white', 
                    fontWeight: 800,
                    fontSize: '1rem',
                    boxShadow: '0 10px 20px rgba(30, 77, 78, 0.2)'
                }}>EXPLORE_ECOSYSTEM</button>
                <button style={{ 
                    padding: '1.25rem 3rem', 
                    borderRadius: '16px', 
                    border: '1px solid #e2e8f0', 
                    background: 'white', 
                    color: '#1e293b', 
                    fontWeight: 800,
                    fontSize: '1rem'
                }}>VIEW_DOCUMENTATION</button>
            </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="uni-section">
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <p style={{ color: '#1e4d4e', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '3px', marginBottom: '1rem' }}>VERTICAL_SOLUTIONS</p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Powering Every Industry.</h2>
        </div>
        
        <div className="uni-grid">
            {services.map((s, i) => (
                <ServiceCard key={i} {...s} />
            ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ backgroundColor: '#0f172a', padding: '10rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, background: 'url(https://www.transparenttextures.com/patterns/cubes.png)' }}></div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: 'white', fontSize: '3.5rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-2px' }}>Ready to transform your marketplace?</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.25rem', marginBottom: '4rem', lineHeight: 1.6 }}>
                Join thousands of businesses already scaling with the StyleTime architecture. Deployment is seamless, performance is unmatched.
            </p>
            <button style={{ 
                padding: '1.5rem 4rem', 
                borderRadius: '20px', 
                border: 'none', 
                background: 'white', 
                color: '#0f172a', 
                fontWeight: 900,
                fontSize: '1.1rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}>START_YOUR_JOURNEY</button>
        </div>
      </section>
    </div>
  );
}
