
'use client';
import React from 'react';
import { JobNexusEntry } from './components';

export default function Page() {
  const jobs = [
    { role: "Principal Engineer", company: "CyberNexus", salary: "$240k - $310k", tags: ["Rust", "Distributed Systems"], description: "Lead the architecture of our next-gen decentralized cloud infrastructure. Focus on high-throughput node synchronization and protocol integrity." },
    { role: "Senior UX Architect", company: "Aura Design", salary: "$180k - $220k", tags: ["Figma", "Spatial UI"], description: "Define the visual language for our spatial computing platform. Create seamless, immersive interfaces for the future of work." },
    { role: "Data Integrity Lead", company: "BlockSecure", salary: "$200k - $250k", tags: ["Cryptography", "ZKP"], description: "Optimize zero-knowledge proof protocols for institutional-grade transaction security. Ensure absolute data privacy across the global mesh." },
    { role: "Cloud Infra Expert", company: "VectorMesh", salary: "$190k - $240k", tags: ["Go", "Kubernetes"], description: "Manage large-scale multi-cloud deployments. Focus on auto-scaling latency-sensitive compute clusters." },
  ];

  return (
    <div className="jt-nexus-wrapper">
      <header className="jt-terminal-nav">
          <div className="jt-nexus-logo">
              CYBER<span style={{ color: 'var(--jt-purple)' }}>NEXUS</span> // JOBS
          </div>
          <div style={{ display: 'flex', gap: '4rem', color: 'var(--jt-text-dim)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <style dangerouslySetInnerHTML={{ __html: `
                @media (max-width: 1024px) {
                  .jt-nav-links { display: none !important; }
                }
              ` }} />
              <div className="jt-nav-links" style={{ display: 'flex', gap: '4rem' }}>
                  <span style={{ color: 'var(--jt-text)' }}>Registry</span>
                  <span>Experts</span>
                  <span>Deployments</span>
                  <span>Manifesto</span>
              </div>
          </div>
          <div style={{ padding: '0.5rem 1.5rem', background: 'rgba(178, 123, 255, 0.1)', border: '1px solid var(--jt-border)', color: 'var(--jt-purple)', fontWeight: 800, fontSize: '0.65rem' }}>
              SIGNAL_STABLE: 100%
          </div>
      </header>

      <section className="jt-section jt-hero">
        <div style={{ marginBottom: '4rem', color: 'var(--jt-text-dim)', fontSize: '0.85rem' }}>
          <span className="jt-comment">// THE NEXT GENERATION OF TECH RECRUITMENT</span>
        </div>
        <h1 className="jt-heading-xl">
          Deploy Your <br/>
          Next <span style={{ color: 'var(--jt-purple)' }}>Evolution.</span>
        </h1>
        <p style={{ marginTop: '5rem', fontSize: '1.25rem', color: 'var(--jt-text-dim)', lineHeight: 1.8, maxWidth: '600px', fontFamily: 'var(--jt-font-main)' }}>
          Access the most critical engineering roles in the decentralized ecosystem. Directly integrated with high-fidelity community nodes.
        </p>
        
        <div style={{ marginTop: '8rem', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <button className="jt-btn-primary">Browse Registry</button>
            <button style={{ background: 'transparent', border: '1px solid var(--jt-border)', color: 'var(--jt-text)', padding: '1rem 3rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--jt-font-mono)', fontSize: '0.85rem' }}>Access Manifest</button>
        </div>
      </section>

      <section className="jt-section" style={{ paddingTop: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6rem', flexWrap: 'wrap', gap: '3rem' }}>
            <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--jt-purple)', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '2px' }}>[ JOB_REGISTRY_V4 ]</div>
                <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 800, letterSpacing: '-2px' }}>Open <span style={{ color: 'var(--jt-purple)' }}>Protocols.</span></h2>
            </div>
            <div style={{ display: 'flex', gap: '3rem' }}>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>1,240</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--jt-text-dim)', fontWeight: 800 }}>ACTIVE_SLOTS</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--jt-purple)' }}>0.01ms</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--jt-text-dim)', fontWeight: 800 }}>MATCH_LATENCY</div>
                </div>
            </div>
        </div>

        <div className="jt-job-list">
          {jobs.map((job, i) => (
            <JobNexusEntry key={i} {...job} index={i + 1} />
          ))}
        </div>

        <div style={{ marginTop: '10rem', textAlign: 'center' }}>
            <button style={{ background: 'none', border: '1px solid var(--jt-border)', color: 'var(--jt-text-dim)', padding: '1.5rem 6rem', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}>
                INITIALIZE_LOAD_MORE
            </button>
        </div>
      </section>

      <footer style={{ padding: '8rem 6% 4rem', borderTop: '1px solid var(--jt-border)', background: '#000' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '6rem' }}>
              <div>
                  <div className="jt-nexus-logo" style={{ fontSize: '2rem', marginBottom: '3rem' }}>CYBERNEXUS</div>
                  <p style={{ color: 'var(--jt-text-dim)', lineHeight: 2, fontSize: '0.95rem' }}>
                      The world's first decentralized talent distribution protocol. Verified engineering nodes, 100% data integrity.
                  </p>
              </div>
              {['INFRASTRUCTURE', 'RESOURCES', 'LEGAL'].map(col => (
                  <div key={col}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, marginBottom: '3rem', color: 'var(--jt-purple)', letterSpacing: '2px' }}>{col}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                          {['Core Registry', 'Node Status', 'Whitepaper', 'API Documentation'].map(link => (
                              <span key={link} style={{ color: 'var(--jt-text-dim)', fontSize: '0.85rem', cursor: 'pointer' }}>{link}</span>
                          ))}
                      </div>
                  </div>
              ))}
          </div>
          <div style={{ marginTop: '10rem', paddingTop: '4rem', borderTop: '1px solid var(--jt-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '3rem' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--jt-text-dim)', fontWeight: 800 }}>© 2026 CYBERNEXUS // CORE_PROTOCOL_STABLE</div>
              <div style={{ display: 'flex', gap: '4rem' }}>
                  {['GITHUB', 'DISCORD', 'X_NEXUS'].map(s => (
                      <span key={s} style={{ fontSize: '0.65rem', color: 'var(--jt-text-dim)', fontWeight: 800 }}>{s}</span>
                  ))}
              </div>
          </div>
      </footer>
    </div>
  );
}
