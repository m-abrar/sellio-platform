
import React from 'react';
import { JobRoleCard } from './components';

export default function Page() {
  const jobs = [
    { title: "Senior VP of Infrastructure", department: "Operations", location: "London / Global", type: "Full-Time" },
    { title: "Director of Global Strategy", department: "Growth", location: "NYC Hub", type: "Full-Time" },
    { title: "Head of Financial Compliance", department: "Legal & Finance", location: "Singapore", type: "Full-Time" },
    { title: "Principal Systems Architect", department: "Engineering", location: "Remote", type: "Contract" },
    { title: "Chief Marketing Officer", department: "Executive", location: "NYC / London", type: "Full-Time" },
    { title: "Senior Talent Acquisition Lead", department: "Human Resources", location: "Global / Remote", type: "Full-Time" },
    { title: "Lead Product Manager", department: "Product Core", location: "Austin Node", type: "Full-Time" },
    { title: "Institutional Sales Director", department: "Sales", location: "Dubai / Remote", type: "Full-Time" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="career-hero">
          <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--corp-blue)', letterSpacing: '4px', marginBottom: '2rem', display: 'block' }}>ESTABLISHED_LEADERSHIP</span>
          <h1>Defining the <br/>Institutional Core.</h1>
          <p className="career-tagline">
              Join the foundational team building the world's most scalable commercial distribution engine. We are looking for architects, leaders, and visionaries ready to scale global infrastructure.
          </p>
          
          <div style={{ marginTop: '5rem', display: 'flex', gap: '4rem' }}>
              <div>
                  <div style={{ fontSize: '2rem', fontWeight: 900 }}>142</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8' }}>GLOBAL_NODES</div>
              </div>
              <div>
                  <div style={{ fontSize: '2rem', fontWeight: 900 }}>$12B</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8' }}>TOTAL_EQUITY_LOCKED</div>
              </div>
              <div>
                  <div style={{ fontSize: '2rem', fontWeight: 900 }}>0.1%</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8' }}>ACCEPTANCE_RATE</div>
              </div>
          </div>
      </section>

      {/* Filter / Search Bar */}
      <section style={{ padding: '4rem 6rem', borderBottom: '1px solid var(--corp-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfcfc' }}>
          <div style={{ display: 'flex', gap: '3rem' }}>
              <span style={{ fontWeight: 800, color: 'var(--corp-blue)', borderBottom: '2px solid var(--corp-blue)', paddingBottom: '4px' }}>ALL_ROLES</span>
              <span style={{ fontWeight: 800, color: '#94a3b8' }}>EXECUTIVE</span>
              <span style={{ fontWeight: 800, color: '#94a3b8' }}>ENGINEERING</span>
              <span style={{ fontWeight: 800, color: '#94a3b8' }}>OPERATIONS</span>
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>
              Showing {jobs.length} open positions
          </div>
      </section>

      {/* Role Grid */}
      <section className="role-grid">
          {jobs.map((job, i) => (
              <JobRoleCard key={i} {...job} />
          ))}
      </section>

      {/* Value Prop Section */}
      <section style={{ padding: '12rem 6rem', background: '#f8fafc', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem', alignItems: 'center' }}>
          <div>
              <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '3rem', lineHeight: 1.1 }}>A Protocol for <br/>Human Capital.</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--corp-slate)', lineHeight: 2, marginBottom: '4rem' }}>
                  At Sellio, we treat talent acquisition as an engineering challenge. Every role is designed for maximum leverage, high autonomy, and direct impact on the global trade protocol.
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                  {['Performance Equity Units', 'Global Node Relocation', 'Advanced Research Stipends', 'Health Protocol Elite'].map(benefit => (
                      <li key={benefit} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 700, fontSize: '0.95rem' }}>
                          <span style={{ color: 'var(--corp-blue)' }}>✔</span> {benefit}
                      </li>
                  ))}
              </ul>
          </div>
          <div style={{ background: 'white', border: '1px solid var(--corp-border)', padding: '5rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-2rem', left: '-2rem', width: '80px', height: '80px', background: 'var(--corp-blue)' }}></div>
              <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>Ready to build?</h3>
              <p style={{ color: '#94a3b8', lineHeight: 2, marginBottom: '3rem' }}>
                  Our recruitment nodes are active 24/7. Submit your credentials to the talent portal for a preliminary protocol evaluation.
              </p>
              <button style={{ width: '100%', padding: '1.5rem', background: 'black', color: 'white', border: 'none', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '1px' }}>
                  ACCESS_TALENT_PORTAL
              </button>
          </div>
      </section>
    </div>
  );
}
