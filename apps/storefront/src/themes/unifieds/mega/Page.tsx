
import React from 'react';
import { CategoryBentoCard } from './components';

export default function Page() {
  const categories = [
    { title: "Residential Real Estate", count: "12,402", icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>, color: '#0ea5e9' },
    { title: "High-Performance Autos", count: "4,115", icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>, color: '#f43f5e' },
    { title: "Executive Careers", count: "2,840", icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>, color: '#10b981' },
    { title: "Premium Electronics", count: "8,922", icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>, color: '#8b5cf6' },
    { title: "Professional Services", count: "1,520", icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>, color: '#f59e0b' },
    { title: "Luxury Goods", count: "3,110", icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>, color: '#d946ef' },
    { title: "Industrial Assets", count: "540", icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>, color: '#6366f1' },
    { title: "Home & Lifestyle", count: "15,620", icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>, color: '#f43f5e' },
  ];

  return (
    <div>
      {/* Mega Hero */}
      <section className="mega-hero">
        <div className="mega-hero-grid">
            <div className="mega-hero-main">
                <div style={{ maxWidth: '500px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.8rem', letterSpacing: '2px', color: '#60a5fa', marginBottom: '1rem', display: 'block' }}>MARKETPLACE_ORCHESTRATOR</span>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-2px' }}>Everything. <br/>Everywhere. <br/>Siloed.</h1>
                    <p style={{ fontSize: '1.125rem', opacity: 0.7, lineHeight: 1.6, marginBottom: '3rem' }}>
                        Experience the power of the Sellio Engine. A unified gateway to millions of vertical-specific listings, powered by advanced neural search.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button style={{ padding: '1rem 2.5rem', background: 'white', color: '#1e3a8a', border: 'none', borderRadius: '50px', fontWeight: 800 }}>START_BROWSING</button>
                        <button style={{ padding: '1rem 2.5rem', background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '50px', fontWeight: 800 }}>LIST_YOUR_ASSET</button>
                    </div>
                </div>
            </div>
            <div className="mega-hero-side">
                <div className="mega-side-card" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)', color: 'white' }}>
                    <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Premium Properties</h4>
                    <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '1.5rem' }}>Discover high-fidelity residential and commercial architectures.</p>
                    <span style={{ fontWeight: 900, fontSize: '0.75rem', letterSpacing: '1px' }}>EXPLORE_UNITS →</span>
                </div>
                <div className="mega-side-card">
                    <h4 style={{ fontWeight: 800, marginBottom: '0.5rem', color: '#1e3a8a' }}>Automotive Showroom</h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>From classic dealers to electric futurism. Every drive matters.</p>
                    <span style={{ fontWeight: 900, fontSize: '0.75rem', letterSpacing: '1px', color: '#3b82f6' }}>VIEW_INVENTORY →</span>
                </div>
            </div>
        </div>
      </section>

      {/* Discovery Bento Grid */}
      <section className="mega-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
            <div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e3a8a', letterSpacing: '-1px' }}>Global Discovery</h2>
                <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>Browse curated categories across the Sellio ecosystem.</p>
            </div>
            <button style={{ color: '#3b82f6', fontWeight: 800, fontSize: '0.85rem', paddingBottom: '4px', borderBottom: '2px solid #3b82f6' }}>VIEW_ALL_CATEGORIES</button>
        </div>
        
        <div className="mega-bento-grid">
            {categories.map((cat, i) => (
                <CategoryBentoCard key={i} {...cat} />
            ))}
        </div>
      </section>

      {/* Stats / Trust Banner */}
      <section style={{ backgroundColor: 'white', padding: '6rem 2rem', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem', textAlign: 'center' }}>
            <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e3a8a', marginBottom: '0.5rem' }}>2.4M</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '2px' }}>ACTIVE_LISTINGS</div>
            </div>
            <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e3a8a', marginBottom: '0.5rem' }}>180+</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '2px' }}>COUNTRIES</div>
            </div>
            <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e3a8a', marginBottom: '0.5rem' }}>$12B+</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '2px' }}>GMV_PROCESSED</div>
            </div>
            <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e3a8a', marginBottom: '0.5rem' }}>0.01s</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '2px' }}>SEARCH_LATENCY</div>
            </div>
        </div>
      </section>
    </div>
  );
}
