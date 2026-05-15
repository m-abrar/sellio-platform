
import React from 'react';
import { VentureCard } from './components';

export default function Page() {
  const startups = [
    { title: "Founding Frontend Engineer", company: "Flux", equity: "0.5% - 1.5%", location: "Remote / SF", tags: ["React", "Rust", "WebGPU"] },
    { title: "Lead Product Designer", company: "Neon", equity: "1.0% - 2.0%", location: "NYC / Hybrid", tags: ["Figma", "Design Systems", "Web3"] },
    { title: "Fullstack Architect", company: "Tensor", equity: "0.2% - 1.0%", location: "Remote / London", tags: ["Node.js", "Python", "Kubernetes"] },
    { title: "Growth Marketing Lead", company: "Pulse", equity: "0.5% - 1.2%", location: "Remote", tags: ["Analytics", "Strategy", "Paid Media"] },
    { title: "ML Infrastructure Lead", company: "Core", equity: "1.5% - 3.0%", location: "Austin / Remote", tags: ["PyTorch", "Mando", "Distributed Systems"] },
    { title: "Developer Relations", company: "Stack", equity: "0.1% - 0.5%", location: "Global / Remote", tags: ["Community", "Content", "DevEx"] },
  ];

  return (
    <div>
      {/* Growth Hero */}
      <section className="growth-hero">
        <div className="hero-gradient-orb"></div>
        <div style={{ position: 'relative', zIndex: 10 }}>
            <div className="growth-badge">JOIN_THE_0.1%_OF_BUILDERS</div>
            <h1 className="growth-title">Equity-First <br/>Venture Roles.</h1>
            <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto 3.5rem auto', lineHeight: 1.6 }}>
                The world's most ambitious startups are hiring on Sellio. We prioritize roles with significant equity, high impact, and zero bureaucracy.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                <button style={{ padding: '1.25rem 3.5rem', background: 'white', color: '#0f172a', border: 'none', borderRadius: '12px', fontWeight: 900, fontSize: '0.9rem' }}>VIEW_ALL_ROLES</button>
                <button style={{ padding: '1.25rem 3.5rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: 900, fontSize: '0.9rem' }}>JOIN_NETWORK</button>
            </div>
        </div>
      </section>

      {/* Venture Grid */}
      <section className="startup-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
            <div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Featured_Ventures</h2>
                <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Top startups in the Sellio ecosystem currently scaling their core teams.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ color: '#8b5cf6', fontWeight: 800, borderBottom: '2px solid #8b5cf6', paddingBottom: '4px' }}>SERIES_A</span>
                <span style={{ color: '#94a3b8', fontWeight: 800 }}>SERIES_B</span>
                <span style={{ color: '#94a3b8', fontWeight: 800 }}>UNICORN</span>
            </div>
        </div>
        
        <div className="venture-grid">
            {startups.map((s, i) => (
                <VentureCard key={i} {...s} />
            ))}
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '8rem 4rem', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6rem' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem', background: 'linear-gradient(to bottom, #fff, #444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>$240M</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#444', letterSpacing: '2px' }}>TOTAL_EQUITY_LISTED</div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem', background: 'linear-gradient(to bottom, #fff, #444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>1.2k</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#444', letterSpacing: '2px' }}>VENTURE_BACKED_COs</div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem', background: 'linear-gradient(to bottom, #fff, #444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>85%</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#444', letterSpacing: '2px' }}>HIRE_RATE_v2</div>
            </div>
        </div>
      </section>
    </div>
  );
}
