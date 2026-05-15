import React from 'react';
import { JobIDEEntry } from './components';

export default function TechPage() {
  const jobs = [
    { title: "Senior Rust Engineer", company: "Flux Systems", salary: "$180k - $240k", tags: ["Rust", "Wasm", "Backend"], index: 1 },
    { title: "Lead Frontend Architect", company: "Neon Design", salary: "$160k - $210k", tags: ["Next.js", "TypeScript", "Tailwind"], index: 2 },
    { title: "ML Infrastructure Lead", company: "Tensor Core", salary: "$200k - $280k", tags: ["Python", "Kubernetes", "PyTorch"], index: 3 },
    { title: "Fullstack Developer", company: "Stack Pulse", salary: "$140k - $190k", tags: ["Node.js", "React", "PostgreSQL"], index: 4 },
  ];

  return (
    <div>
      <section className="tech-hero">
        <div className="hero-code-block">
          <span className="code-keyword">const</span> <span className="code-function">DreamJob</span> = <span className="code-keyword">await</span> <span className="code-function">find</span>({'{'}<br/>
          &nbsp;&nbsp;vertical: <span className="code-string">"TECH"</span>,<br/>
          &nbsp;&nbsp;salary: <span className="code-string">"&gt; $150k"</span>,<br/>
          &nbsp;&nbsp;remote: <span className="code-string">true</span><br/>
          {'}'});
        </div>
        <p style={{ opacity: 0.6, maxWidth: '600px' }}>
          Stop browsing, start executing. The most high-impact engineering roles in the Sellio network, filtered for performance.
        </p>
      </section>

      <div className="job-list-ide">
        {jobs.map((j, i) => (
          <JobIDEEntry key={i} {...j} />
        ))}
      </div>

      <section style={{ padding: '4rem 2rem', backgroundColor: 'rgba(0,0,0,0.2)', marginBottom: '4rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--color-green)' }}>$ grep --recursive "perks" .</span>
          <ul style={{ listSet: 'none', paddingLeft: '1rem', marginTop: '1rem', opacity: 0.7 }}>
            <li>&gt; Full Remote (Global)</li>
            <li>&gt; Private Medical + Vision</li>
            <li>&gt; Learning Budget ($5k/yr)</li>
            <li>&gt; 30 Days Paid Vacation</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
