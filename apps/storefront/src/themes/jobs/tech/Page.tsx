'use client';
import React from 'react';
import { TechHeader, TechJobCard, TechFooter } from './components';

export default function Page() {
  const jobs = [
    { title: "Senior React Engineer", company: "Vercel", location: "Remote - Worldwide", type: "Full-Time", salary: "$140k - $180k", time: "2h ago", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Vercel_logo_black.svg/512px-Vercel_logo_black.svg.png", skills: ["React", "Next.js", "TypeScript"] },
    { title: "Backend Systems Developer", company: "Stripe", location: "Remote - US/Canada", type: "Full-Time", salary: "$160k - $210k", time: "5h ago", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/512px-Stripe_Logo%2C_revised_2016.svg.png", skills: ["Go", "Ruby", "PostgreSQL", "AWS"] },
    { title: "Frontend Architect", company: "Linear", location: "San Francisco, CA", type: "Full-Time", salary: "$180k - $220k", time: "1d ago", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Linear_Logo_1.svg/512px-Linear_Logo_1.svg.png", skills: ["React", "GraphQL", "MobX"] },
    { title: "DevOps Engineer", company: "Discord", location: "Remote - US", type: "Full-Time", salary: "$150k - $190k", time: "1d ago", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Discord_logo.svg/512px-Discord_logo.svg.png", skills: ["Kubernetes", "Rust", "GCP"] },
    { title: "Full Stack Developer", company: "Supabase", location: "Remote - EMEA", type: "Full-Time", salary: "$120k - $150k", time: "2d ago", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Supabase_logo.svg/512px-Supabase_logo.svg.png", skills: ["TypeScript", "PostgreSQL", "Elixir"] },
  ];

  return (
    <div className="jobs-tech-wrapper">
      <TechHeader />

      {/* Hero */}
      <section className="jt-hero">
        <div className="jt-hero-content">
            <h1 className="jt-hero-title">Find the <span className="jt-text-purple">best tech jobs</span><br/>for your stack.</h1>
            <p className="jt-hero-subtitle">Connecting world-class developers with top-tier tech companies. Skip the recruiters and apply directly to the engineering team.</p>
            
            <div className="jt-search-box">
                <div style={{ padding: '1rem', color: 'var(--jt-text-muted)' }}>$</div>
                <input type="text" className="jt-search-input" placeholder="grep -i 'React OR Go OR Rust'" />
                <button className="jt-btn jt-btn-primary" style={{ margin: '0.25rem' }}>Search</button>
            </div>
        </div>
      </section>

      {/* Main Layout */}
      <div className="jt-layout">
          {/* Sidebar */}
          <aside className="jt-sidebar">
              <div style={{ marginBottom: '2rem' }}>
                  <h4 className="jt-sidebar-title">Tech Stack</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      <span className="jt-tag">React</span>
                      <span className="jt-tag">Vue.js</span>
                      <span className="jt-tag">Node.js</span>
                      <span className="jt-tag">Python</span>
                      <span className="jt-tag">Go</span>
                      <span className="jt-tag">Rust</span>
                      <span className="jt-tag">TypeScript</span>
                      <span className="jt-tag">GraphQL</span>
                  </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                  <h4 className="jt-sidebar-title">Job Type</h4>
                  <label style={{ display: 'block', color: 'var(--jt-text-muted)', marginBottom: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}><input type="checkbox" defaultChecked /> Full-Time</label>
                  <label style={{ display: 'block', color: 'var(--jt-text-muted)', marginBottom: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}><input type="checkbox" /> Contract</label>
                  <label style={{ display: 'block', color: 'var(--jt-text-muted)', marginBottom: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}><input type="checkbox" /> Freelance</label>
              </div>

              <div>
                  <h4 className="jt-sidebar-title">Location</h4>
                  <label style={{ display: 'block', color: 'var(--jt-text-muted)', marginBottom: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}><input type="checkbox" defaultChecked /> Remote Worldwide</label>
                  <label style={{ display: 'block', color: 'var(--jt-text-muted)', marginBottom: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}><input type="checkbox" /> Remote US/CA</label>
                  <label style={{ display: 'block', color: 'var(--jt-text-muted)', marginBottom: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}><input type="checkbox" /> Remote EMEA</label>
              </div>
          </aside>

          {/* Job Listings */}
          <main>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--jt-border)', paddingBottom: '1rem' }}>
                  <div style={{ fontFamily: 'var(--jt-font-mono)', color: 'var(--jt-text-muted)' }}>Found <span className="jt-text-main">342</span> jobs</div>
                  <select style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--jt-text-main)', fontFamily: 'var(--jt-font-mono)', outline: 'none', cursor: 'pointer' }}>
                      <option>Latest</option>
                      <option>Highest Paid</option>
                      <option>Most Relevant</option>
                  </select>
              </div>

              <div className="jt-job-list">
                  {jobs.map((job, i) => (
                      <TechJobCard key={i} {...job} />
                  ))}
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                  <button className="jt-btn jt-btn-outline">./load_more.sh</button>
              </div>
          </main>
      </div>

      <TechFooter />
    </div>
  );
}
