import React from 'react';
import { IndustryOrb, StatBlock } from './components';

export default function InteractivePage() {
  const industries = [
    { label: "Real Estate", icon: "🏠", count: "14,200" },
    { label: "Automotive", icon: "🏎️", count: "8,540" },
    { label: "Engineering", icon: "⚙️", count: "3,120" },
    { label: "Music/Arts", icon: "🎸", count: "1,890" },
    { label: "Classifieds", icon: "🏷️", count: "42,000" },
    { label: "E-Commerce", icon: "🛍️", count: "12,400" },
    { label: "Services", icon: "🛠️", count: "5,600" },
    { label: "Medical", icon: "🏥", count: "950" },
  ];

  return (
    <div>
      <section className="interactive-hero">
        <h1 className="hero-main-title">
          Explore<br/>
          The<br/>
          Nexus
        </h1>
        <p style={{ letterSpacing: '8px', textTransform: 'uppercase', fontSize: '0.9rem', opacity: 0.6 }}>
          Multi-Platform Industry Engine
        </p>
      </section>

      <section className="stat-pulse-section">
        <StatBlock value="50+" label="INDUSTRIES" />
        <StatBlock value="1.2M" label="LISTINGS" />
        <StatBlock value="24/7" label="UPTIME" />
      </section>

      <section style={{ padding: '6rem 4rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 900, textAlign: 'center', marginBottom: '4rem' }}>
          CHOOSE_YOUR_VERTICAL
        </h2>
        <div className="orb-grid">
          {industries.map((industry, i) => (
            <IndustryOrb key={i} {...industry} />
          ))}
        </div>
      </section>

      <section style={{ padding: '8rem 4rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--color-purple)', padding: '4rem', borderRadius: '40px', boxShadow: '0 0 60px rgba(69, 39, 160, 0.4)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>
            Ready to scale?
          </h2>
          <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
            Join the thousand of sellers who have already migrated to the Sellio platform.
          </p>
          <button style={{ 
            backgroundColor: 'var(--color-neon)', 
            color: 'black', 
            padding: '1.5rem 4rem', 
            border: 'none', 
            borderRadius: '100px', 
            fontFamily: 'var(--font-display)', 
            fontWeight: 900,
            cursor: 'pointer'
          }}>
            GET_STARTED_NOW
          </button>
        </div>
      </section>
    </div>
  );
}
