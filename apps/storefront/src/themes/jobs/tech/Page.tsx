'use client';
import React from 'react';
import { JobIDEEntry, TerminalBlock } from './components';

export default function Page() {
  const jobs = [
    { title: "Senior Rust Engineer", company: "Flux Systems", salary: "$180k - $240k", tags: ["Rust", "Wasm", "Backend"], index: 1 },
    { title: "Lead Frontend Architect", company: "Neon Design", salary: "$160k - $210k", tags: ["Next.js", "TypeScript", "Tailwind"], index: 2 },
    { title: "ML Infrastructure Lead", company: "Tensor Core", salary: "$200k - $280k", tags: ["Python", "Kubernetes", "PyTorch"], index: 3 },
    { title: "Fullstack Developer", company: "Stack Pulse", salary: "$140k - $190k", tags: ["Node.js", "React", "PostgreSQL"], index: 4 },
  ];

  return (
    <div className="jt-section">
      {/* Hero Section */}
      <section className="jt-hero">
        <div className="jt-comment" style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
            /**<br/>
            &nbsp;* @name Sellio_OS_Job_Registry<br/>
            &nbsp;* @version 8.4.2<br/>
            &nbsp;* @status PRODUCTION_STABLE<br/>
            &nbsp;*/
        </div>
        
        <h1 className="jt-heading-xl">
            Execute Your <br/>
            Next <span style={{ color: 'var(--jt-green)' }}>Strategic</span> Move.
            <span className="jt-cursor"></span>
        </h1>
        
        <div style={{ marginTop: '4rem', display: 'flex', gap: '3rem' }}>
            <button className="jt-btn-primary">./browse_all_nodes.sh</button>
            <button style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'var(--jt-text-dim)', 
                fontFamily: 'var(--jt-font-mono)',
                fontWeight: 700,
                cursor: 'pointer'
            }}>
                --help
            </button>
        </div>
      </section>

      {/* Main Job Feed (The IDE) */}
      <section className="jt-job-list">
        <div style={{ padding: '1rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--jt-border)', borderBottom: 'none', display: 'flex', gap: '2rem' }}>
            <span className="jt-comment">{'// FILTER: status == "OPEN" & salary >= 150000'}</span>
        </div>
        
        {jobs.map((j, i) => (
          <JobIDEEntry key={i} {...j} />
        ))}
        
        <div style={{ padding: '1.5rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--jt-border)', borderTop: 'none', textAlign: 'center' }}>
            <span className="jt-comment">-- END OF REGISTRY --</span>
        </div>
      </section>

      {/* Perks / Grep Section */}
      <TerminalBlock 
        title="grep --recursive 'perks' ./" 
        lines={[
            "Global Remote Mobility Protocol (100% Remote)",
            "Hardware Stipend: $4,000 (MacBook Pro M3 Max Standard)",
            "Neural Learning Budget: $5,000/year",
            "Unlimited Protocol Suspension (Unlimited PTO)",
            "Family Node Support (Premium Medical + Dental)"
        ]}
      />

      {/* Final Call to Action */}
      <section style={{ marginTop: '10rem', textAlign: 'center', padding: '10rem 0' }}>
          <div className="jt-keyword" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>export default function NextStep() {'{'}</div>
          <h2 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '3rem' }}>
              Authorize Your <br/>
              <span style={{ color: 'var(--jt-blue)' }}>Future_Branch.</span>
          </h2>
          <button className="jt-btn-primary" style={{ padding: '2rem 6rem', fontSize: '1.5rem' }}>
              git checkout -b new-career
          </button>
          <div className="jt-keyword" style={{ fontSize: '1.5rem', marginTop: '3rem' }}>{'}'}</div>
      </section>
    </div>
  );
}
