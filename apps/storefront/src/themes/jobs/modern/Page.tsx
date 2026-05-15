import React from 'react';
import { BentoJobCard } from './components';

export default function ModernJobsPage() {
  const jobs = [
    { title: "Staff Product Designer", company: "Neon Design", location: "San Francisco, CA", salary: "$180k - $240k", tags: ["Figma", "Design Systems", "Product"], initial: "ND" },
    { title: "Senior Growth Lead", company: "Stack Pulse", location: "New York, NY", salary: "$160k - $210k", tags: ["Growth", "Analytics", "SaaS"], initial: "SP" },
    { title: "Platform Engineer", company: "Flux Systems", location: "Remote", salary: "$150k - $220k", tags: ["Go", "Kubernetes", "AWS"], initial: "FS" },
    { title: "Fullstack Developer", company: "Design Core", location: "Austin, TX", salary: "$140k - $190k", tags: ["React", "Node.js", "TypeScript"], initial: "DC" },
    { title: "AI Research Lead", company: "Tensor Mind", location: "London, UK", salary: "£140k - £180k", tags: ["Python", "PyTorch", "LLMs"], initial: "TM" },
    { title: "Lead Content Strategist", company: "Vibe Lab", location: "Los Angeles, CA", salary: "$120k - $160k", tags: ["Content", "Marketing", "Brand"], initial: "VL" },
  ];

  return (
    <div>
      <section className="modern-job-hero">
        <span style={{ color: 'var(--color-indigo)', fontWeight: 800, letterSpacing: '4px', marginBottom: '1.5rem', display: 'block' }}>FOR_GLOBAL_TALENT</span>
        <h1>The Next Level<br/>Of Your Career.</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.6, maxWidth: '650px', margin: '0 auto', lineHeight: '1.8', marginBottom: '3rem' }}>
          Connect with high-growth companies that are shaping the future. Our platform curates the most impactful roles for the world's most talented individuals.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button style={{ 
            backgroundColor: 'var(--color-indigo)', 
            color: 'white', 
            padding: '1.2rem 3rem', 
            borderRadius: '100px', 
            border: 'none', 
            fontFamily: 'var(--font-outfit)', 
            fontWeight: 800,
            cursor: 'pointer'
          }}>
            Browse All Jobs
          </button>
          <button style={{ 
            backgroundColor: 'white', 
            color: 'var(--color-indigo)', 
            padding: '1.2rem 3rem', 
            borderRadius: '100px', 
            border: '2px solid var(--color-indigo)', 
            fontFamily: 'var(--font-outfit)', 
            fontWeight: 800,
            cursor: 'pointer'
          }}>
            Post a Job
          </button>
        </div>
      </section>

      <section style={{ padding: '2rem 4rem', maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '2rem', fontWeight: 800 }}>Latest Openings</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ padding: '0.6rem 1.2rem', background: 'white', borderRadius: '12px', border: '1px solid #eee', fontSize: '0.85rem', fontWeight: 700 }}>Filter by Skill</div>
          <div style={{ padding: '0.6rem 1.2rem', background: 'white', borderRadius: '12px', border: '1px solid #eee', fontSize: '0.85rem', fontWeight: 700 }}>Location</div>
        </div>
      </section>

      <div className="job-bento-grid">
        {jobs.map((job, i) => (
          <BentoJobCard key={i} {...job} />
        ))}
      </div>

      <section style={{ padding: '8rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ background: 'var(--color-indigo)', padding: '6rem', borderRadius: '48px', color: 'white', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '3rem', fontWeight: 800, marginBottom: '2rem' }}>Hire the best, faster.</h2>
            <p style={{ opacity: 0.8, fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '3rem' }}>
              Our proprietary matching algorithm connects your company with pre-vetted talent that fits your technical stack and cultural values perfectly.
            </p>
            <button style={{ 
              backgroundColor: 'white', 
              color: 'var(--color-indigo)', 
              padding: '1.2rem 4rem', 
              borderRadius: '100px', 
              border: 'none', 
              fontFamily: 'var(--font-outfit)', 
              fontWeight: 800,
              cursor: 'pointer'
            }}>
              Start Hiring
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.1)', height: '150px', borderRadius: '24px' }}></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
