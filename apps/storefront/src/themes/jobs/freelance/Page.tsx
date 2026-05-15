
import React from 'react';
import { GigCard } from './components';

export default function Page() {
  const gigs = [
    { title: "Elite UI/UX Architecture", rate: "$120/hr", duration: "3 Months", tags: ["Figma", "Design Systems", "Prototyping"] },
    { title: "Backend Scaling Protocol", rate: "$150/hr", duration: "6 Months", tags: ["Go", "Kubernetes", "gRPC"] },
    { title: "Smart Contract Audit", rate: "$200/hr", duration: "1 Month", tags: ["Solidity", "Security", "EVM"] },
    { title: "AI Model Fine-Tuning", rate: "$180/hr", duration: "2 Months", tags: ["PyTorch", "LLMs", "Python"] },
    { title: "Conversion Copywriting", rate: "$90/hr", duration: "Ongoing", tags: ["Strategy", "SEO", "Sales"] },
    { title: "Fullstack App Node", rate: "$130/hr", duration: "4 Months", tags: ["Next.js", "TypeScript", "PostgreSQL"] },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="flex-hero">
          <div className="flex-badge">v.4.0_DECENTRALIZED_PROTOCOL</div>
          <h1>The New <br/>Independence.</h1>
          <p style={{ maxWidth: '700px', fontSize: '1.25rem', color: '#718096', lineHeight: 1.8, marginBottom: '4rem' }}>
              High-leverage projects for independent builders. Direct peer-to-peer distribution with zero platform overhead. Verified by the Sellio Flex protocol.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
              <button style={{ padding: '1.25rem 3.5rem', background: 'var(--flex-graphite)', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 900 }}>BROWSE_PROJECTS</button>
              <button style={{ padding: '1.25rem 3.5rem', background: 'none', color: 'var(--flex-graphite)', border: '2px solid var(--flex-graphite)', borderRadius: '4px', fontWeight: 900 }}>DEPLOY_TALENT</button>
          </div>
      </section>

      {/* Trust Bar */}
      <section style={{ padding: '3rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f7fafc', color: '#a0aec0', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
          <span>NODE_SYNC: 100%</span>
          <span>ESCROW_READY: YES</span>
          <span>GAS_OPTIMIZED: ACTIVE</span>
          <span>TOTAL_NETWORK_VALUE: $42.5M</span>
      </section>

      {/* Gig Grid */}
      <section className="gig-grid">
          {gigs.map((gig, i) => (
              <GigCard key={i} {...gig} />
          ))}
      </section>

      {/* Philosophy Section */}
      <section style={{ padding: '12rem 5%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem', alignItems: 'center' }}>
          <div>
              <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '3rem' }}>The Protocol <br/>of Autonomy.</h2>
              <p style={{ fontSize: '1.1rem', color: '#718096', lineHeight: 2, marginBottom: '4rem' }}>
                  We believe in a world where talent is distributed directly to demand. No middlemen, no centralized fees, just pure execution and high-fidelity project outcomes.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                  <div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--flex-mint)' }}>0%</div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#a0aec0', letterSpacing: '2px' }}>PLATFORM_FEES</div>
                  </div>
                  <div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--flex-mint)' }}>Instant</div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#a0aec0', letterSpacing: '2px' }}>NODE_SETTLEMENT</div>
                  </div>
              </div>
          </div>
          <div style={{ background: '#fcfcfc', border: '1px solid #eee', padding: '5rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-1rem', left: '-1rem', width: '60px', height: '60px', background: 'var(--flex-yellow)' }}></div>
              <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>Join the Network.</h3>
              <p style={{ color: '#a0aec0', lineHeight: 2, marginBottom: '3rem' }}>
                  Our talent nodes are currently accepting new high-fidelity contributors. Submit your proof-of-work to join the elite decentralized workforce.
              </p>
              <button style={{ width: '100%', padding: '1.5rem', background: 'var(--flex-graphite)', color: 'white', border: 'none', fontWeight: 900, letterSpacing: '1px' }}>
                  GENERATE_TALENT_NODE
              </button>
          </div>
      </section>
    </div>
  );
}
