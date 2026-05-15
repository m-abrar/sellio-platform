import React from 'react';
import { MapJobCard, OfficeMarker } from './components';

export default function JobsMapPage() {
  const jobs = [
    { title: "Staff Platform Engineer", company: "Flux Systems", salary: "$180k - $240k", initial: "FS" },
    { title: "Senior Product Designer", company: "Neon Design", salary: "$160k - $210k", initial: "ND" },
    { title: "Growth Marketing Lead", company: "Stack Pulse", salary: "$140k - $190k", initial: "SP" },
    { title: "AI Research Scientist", company: "Tensor Mind", salary: "$190k - $250k", initial: "TM" },
    { title: "Fullstack Developer", company: "Code Core", salary: "$130k - $170k", initial: "CC" },
  ];

  return (
    <>
      <div className="hub-job-feed">
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800 }}>{jobs.length} JOBS_NEAR_YOU</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6366f1' }}>REFINE_</span>
        </div>
        {jobs.map((job, i) => (
          <MapJobCard key={i} {...job} />
        ))}
        <div style={{ padding: '2rem 0', textAlign: 'center', opacity: 0.4, fontSize: '0.75rem' }}>
          Enable notifications for new local roles
        </div>
      </div>

      <div className="career-map-canvas">
        <div style={{ width: '100%', height: '100%', backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          {/* Simulated Career Hub Map */}
          <OfficeMarker initial="FS" top="20%" left="30%" />
          <OfficeMarker initial="ND" top="45%" left="60%" />
          <OfficeMarker initial="SP" top="70%" left="40%" />
          <OfficeMarker initial="TM" top="30%" left="80%" />
          <OfficeMarker initial="CC" top="65%" left="15%" />
          
          <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Neighborhood Insights</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Tech Cluster: North Austin</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', marginTop: '0.5rem' }}>142 COMPANIES ACTIVE</div>
          </div>
        </div>
      </div>
    </>
  );
}
