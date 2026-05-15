
import React from 'react';
import { TradeCard } from './components';

export default function Page() {
  const jobs = [
    { title: "Heavy Equipment Operator", company: "Metro Earthworks", pay: "$35 - $45 / hr", location: "Chicago, IL", type: "Full-Time" },
    { title: "Structural Welder (Flux-Core)", company: "Skyline Steel", pay: "$40 - $55 / hr", location: "Dallas, TX", type: "Contract" },
    { title: "Industrial Electrician", company: "PowerGrid Solutions", pay: "$38 - $48 / hr", location: "Detroit, MI", type: "Full-Time" },
    { title: "Logistics Fleet Manager", company: "SwiftMove Logistics", pay: "$75k - $95k / yr", location: "Atlanta, GA", type: "Full-Time" },
    { title: "CNC Precision Machinist", company: "Alpha Parts Inc.", pay: "$32 - $42 / hr", location: "Phoenix, AZ", type: "Full-Time" },
    { title: "Hvac System Specialist", company: "CoolAir Controls", pay: "$35 - $50 / hr", location: "Miami, FL", type: "Full-Time" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="trade-hero">
          <div className="trade-hero-content">
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--trade-orange)', letterSpacing: '2px', display: 'block', marginBottom: '1.5rem' }}>SKILLED_LABOR_PROTOCOL</span>
              <h1>Build the <br/>Infrastructure.</h1>
              <p style={{ fontSize: '1.2rem', opacity: 0.6, lineHeight: 1.6, marginBottom: '3.5rem', maxWidth: '600px' }}>
                  The direct pipeline for skilled trades. No middlemen, no complicated resumes. Just verified experience and industrial-grade opportunities.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <button style={{ padding: '1.5rem 4rem', background: 'var(--trade-orange)', color: 'white', border: 'none', fontWeight: 900, fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>BROWSE_TRADES</button>
                  <button style={{ padding: '1.5rem 4rem', background: 'none', color: 'white', border: '2px solid white', fontWeight: 900, fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>GET_CERTIFIED</button>
              </div>
          </div>
          <div style={{ flex: 1 }}>
              <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070" alt="Construction Worker" style={{ width: '100%', border: '10px solid #111827', boxShadow: '20px 20px 0 var(--trade-orange)' }} />
          </div>
      </section>

      {/* Trust bar */}
      <section style={{ padding: '2rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#e5e7eb', color: '#374151', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '1px' }}>
          <span>OSHA_VERIFIED_ROLES</span>
          <span>GUARANTEED_PAY_CYCLES</span>
          <span>UNION_FRIENDLY_NODES</span>
          <span>SKILL_CERTIFICATION_SYNCED</span>
      </section>

      {/* Trade Grid */}
      <section className="trade-grid">
          {jobs.map((job, i) => (
              <TradeCard key={i} {...job} />
          ))}
      </section>

      {/* Industrial CTA */}
      <section style={{ padding: '10rem 5%', background: '#111827', color: 'white', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8rem', alignItems: 'center' }}>
          <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '4rem', fontWeight: 700, marginBottom: '2.5rem', textTransform: 'uppercase' }}>Ready to <br/>Move Steel?</h2>
              <p style={{ color: '#9ca3af', lineHeight: 2, fontSize: '1.1rem', marginBottom: '4rem' }}>
                  Our industrial nodes are looking for verified talent in construction, manufacturing, and logistics. Join the backbone of the global economy.
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                  {['Weekly Direct Deposits', 'Safety Protocol Insurance', 'Nodal Relocation Support', 'Career Growth Blueprint'].map(item => (
                      <li key={item} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 700, color: 'var(--trade-orange)' }}>
                          <span>[✔]</span> <span style={{ color: 'white' }}>{item.toUpperCase()}</span>
                      </li>
                  ))}
              </ul>
          </div>
          <div style={{ padding: '5rem', background: 'white', color: 'black', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-1rem', left: '-1rem', width: '60px', height: '60px', background: 'var(--trade-orange)' }}></div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem', textTransform: 'uppercase' }}>Join the Union.</h3>
              <p style={{ color: '#6b7280', lineHeight: 2, marginBottom: '3rem' }}>
                  Submit your trade experience to the Sellio Industrial network for immediate role matching.
              </p>
              <button style={{ width: '100%', padding: '1.5rem', background: '#111827', color: 'white', border: 'none', fontWeight: 900, fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
                  ACTIVATE_WORKER_NODE
              </button>
          </div>
      </section>
    </div>
  );
}
