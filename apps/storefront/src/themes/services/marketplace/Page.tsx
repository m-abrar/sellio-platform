
import React from 'react';
import { ExpertCard } from './components';

export default function Page() {
  const experts = [
    { name: "Marcus Thorne", category: "LEGAL_ADVISORY", rating: "4.9", jobs: "124", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2000" },
    { name: "Elena Rodriguez", category: "DIGITAL_STRATEGY", rating: "5.0", jobs: "89", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2000" },
    { name: "David Chen", category: "FINANCIAL_CONSULTING", rating: "4.8", jobs: "210", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2000" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="srv-hero">
        <div>
            <h1 className="srv-hero-title">Expert Solutions <br/>On Demand.</h1>
            <p className="srv-hero-subtitle">
                Connect with world-class professionals across specialized verticals. From legal advisory to digital transformation, we have the right talent for your project.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <input 
                    type="text" 
                    placeholder="Search for a service..." 
                    style={{ flex: 1, padding: '1.25rem', borderRadius: '14px', border: '1px solid #cbd5e1' }}
                />
                <button style={{ 
                    padding: '1.25rem 2.5rem', 
                    borderRadius: '14px', 
                    border: 'none', 
                    background: '#1e4d4e', 
                    color: 'white', 
                    fontWeight: 800 
                }}>SEARCH</button>
            </div>
        </div>
        <div style={{ borderRadius: '40px', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.1)' }}>
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000" alt="Team" style={{ width: '100%', display: 'block' }} />
        </div>
      </section>

      {/* Category Grid */}
      <section className="srv-section" style={{ backgroundColor: 'white' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '3rem' }}>Browse by Category</h2>
        <div className="srv-cat-grid">
            {[
                { icon: '⚖️', label: 'Legal' },
                { icon: '📈', label: 'Finance' },
                { icon: '💻', label: 'Tech' },
                { icon: '🎨', label: 'Design' },
                { icon: '🏥', label: 'Health' },
                { icon: '🛠️', label: 'Home' },
                { icon: '📷', label: 'Media' },
                { icon: '✍️', label: 'Writing' }
            ].map((c, i) => (
                <div key={i} className="srv-cat-card">
                    <span className="srv-cat-icon">{c.icon}</span>
                    <span style={{ fontWeight: 800 }}>{c.label}</span>
                </div>
            ))}
        </div>
      </section>

      {/* Featured Experts */}
      <section className="srv-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>Top Rated Experts</h2>
            <a href="#" style={{ fontWeight: 800, color: '#1e4d4e' }}>VIEW_ALL_TALENT →</a>
        </div>
        <div className="srv-expert-grid">
            {experts.map((e, i) => (
                <ExpertCard key={i} {...e} />
            ))}
        </div>
      </section>

      {/* Trust Quote */}
      <section style={{ backgroundColor: '#f1f5f9', padding: '8rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ fontSize: '4rem', color: '#1e4d4e', opacity: 0.2, marginBottom: '2rem' }}>“</div>
            <p style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.5, marginBottom: '3rem' }}>
                The quality of professionals on StyleTime is unmatched. We were able to find a strategy consultant and a legal team in under 24 hours.
            </p>
            <div style={{ fontWeight: 800 }}>SARAH_JENKINS</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.5, marginTop: '0.25rem' }}>CEO_OF_MODERN_FLOW</div>
        </div>
      </section>
    </div>
  );
}
