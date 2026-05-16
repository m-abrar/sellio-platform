
'use client';
import React from 'react';
import { JobCard, StatCard, FeaturedCard } from './components';

export default function Page() {
  const jobs = [
    { title: "Senior UI Architect", company: "Aether Design", type: "Remote", salary: "$140k - $180k", logo: "🎨", progress: 65 },
    { title: "Distributed Systems Lead", company: "Node Flux", type: "Hybrid", salary: "$160k - $220k", logo: "⚡" },
    { title: "Product Growth Node", company: "Hyper Scaler", type: "Full-Time", salary: "$120k - $150k", logo: "📈", progress: 30 },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="jm-hero">
        <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--jm-primary)', padding: '0.75rem 1.5rem', borderRadius: '50px', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '2.5rem' }}>
          GLOBAL_TALENT_PROTOCOL_ACTIVE
        </div>
        <h1>Your Career, <br/><span>Modernized.</span></h1>
        <p style={{ maxWidth: '700px', fontSize: '1.25rem', color: 'var(--jm-text-dim)', lineHeight: 1.8, marginBottom: '4rem' }}>
          The elite distribution layer for professional talent. We connect high-fidelity candidates with high-growth institutional nodes across the globe.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <button className="jm-btn-primary" style={{ padding: '1.5rem 4rem', fontSize: '1.1rem' }}>Find Your Next Node</button>
          <button style={{ padding: '1.5rem 4rem', fontSize: '1.1rem', background: 'white', border: '1px solid var(--jm-border)', borderRadius: '16px', fontWeight: 700, cursor: 'pointer' }}>Explore Companies</button>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="jm-bento-grid">
        {/* Row 1 */}
        <FeaturedCard />
        <StatCard label="ACTIVE_NODES" value="12.4k" icon="🌐" />
        <StatCard label="AVG_SALARY" value="$145k" icon="💰" />

        {/* Row 2 */}
        {jobs.map((job, i) => (
          <JobCard key={i} {...job} />
        ))}
        
        {/* Row 3 - Large Search / CTA */}
        <div className="jm-card" style={{ gridColumn: 'span 12', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4rem' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Search for specific <br/>industry protocols.</h2>
            <div style={{ display: 'flex', gap: '1rem', maxWidth: '600px', background: '#f1f5f9', padding: '0.5rem', borderRadius: '16px', border: '1px solid var(--jm-border)' }}>
              <input 
                type="text" 
                placeholder="Job title, keywords, or company..." 
                style={{ flex: 1, background: 'none', border: 'none', padding: '1rem', outline: 'none', fontWeight: 600 }}
              />
              <button className="jm-btn-primary">SEARCH</button>
            </div>
          </div>
          <div style={{ flex: 0.8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ padding: '2rem', background: 'white', borderRadius: '24px', border: '1px solid var(--jm-border)' }}>
              <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--jm-primary)' }}>98%</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--jm-text-dim)' }}>MATCH_RATE</div>
            </div>
            <div style={{ padding: '2rem', background: 'white', borderRadius: '24px', border: '1px solid var(--jm-border)' }}>
              <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--jm-primary)' }}>2.4hr</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--jm-text-dim)' }}>AVG_RESPONSE</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '10rem 5%', textAlign: 'center', background: 'var(--jm-primary)', color: 'white' }}>
        <h2 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '3rem', letterSpacing: '-2px' }}>Ready to Scale?</h2>
        <p style={{ maxWidth: '600px', margin: '0 auto 5rem', fontSize: '1.25rem', opacity: 0.8 }}>
          Join the network of professionals defining the future of industry. Your next mission starts here.
        </p>
        <button style={{ background: 'white', color: 'var(--jm-primary)', padding: '2rem 6rem', borderRadius: '20px', border: 'none', fontWeight: 800, fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
          Create Your Node Profile
        </button>
      </section>
    </div>
  );
}
