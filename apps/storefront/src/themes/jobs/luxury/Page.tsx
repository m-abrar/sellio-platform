import React from 'react';
import { MandateCard } from './components';

export default function ExecutiveSearchPage() {
  const mandates = [
    { title: "Chief Executive Officer", industry: "Renewable Energy", location: "Singapore / Remote", status: "Active Mandate" },
    { title: "Managing Director, AI", industry: "Venture Capital", location: "San Francisco, CA", status: "Confidential Search" },
    { title: "VP of Product Engineering", industry: "SaaS Enterprise", location: "London / NYC", status: "Active Mandate" },
    { title: "Head of Private Equity", industry: "Financial Services", location: "Zurich, CH", status: "Strategic Hire" },
    { title: "Global Design Director", industry: "Luxury Consumer", location: "Paris / Milan", status: "Active Mandate" },
  ];

  return (
    <div>
      <section style={{ padding: '8rem 6rem', maxWidth: '1200px' }}>
        <div style={{ width: '60px', height: '1px', background: 'var(--color-gold)', marginBottom: '3rem' }}></div>
        <p style={{ letterSpacing: '6px', fontSize: '0.8rem', opacity: 0.5, marginBottom: '2rem' }}>THE_LEADERSHIP_ADVISORY</p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '5rem', fontWeight: 400, lineHeight: '1.1', marginBottom: '3rem' }}>
          Defining The<br/>Future Of<br/>Leadership.
        </h1>
        <p style={{ maxWidth: '500px', lineHeight: '2', opacity: 0.6, fontSize: '1.1rem' }}>
          We specialize in high-discretion searches for the world's most significant organizational mandates. Every placement is a strategic bridge to the future.
        </p>
      </section>

      <div className="mandate-grid">
        {mandates.map((m, i) => (
          <MandateCard key={i} {...m} />
        ))}
      </div>

      <section style={{ padding: '10rem 6rem', background: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
          <div>
            <div style={{ width: '40px', height: '1px', background: 'var(--color-gold)', marginBottom: '2rem' }}></div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', fontWeight: 400, marginBottom: '2rem' }}>High-Discretion Advisory.</h2>
            <p style={{ lineHeight: '2', opacity: 0.6, fontSize: '1.1rem' }}>
              For our clients, privacy is the ultimate luxury. Our proprietary discovery engine allows for confidential talent matching without compromising market reach.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
            <div>
              <div style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}>14d</div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '2px', fontWeight: 800, opacity: 0.5 }}>AVG_PLACEMENT_TIME</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', color: 'var(--color-gold)' }}>98%</div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '2px', fontWeight: 800, opacity: 0.5 }}>RETENTION_RATE</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
