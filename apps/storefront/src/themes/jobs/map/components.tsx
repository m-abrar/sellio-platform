import React from 'react';

export const HubMapHeader = () => (
  <header className="hub-map-header">
    <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#6366f1' }}>CAREER_MAP</div>
    <div className="hub-search-box-map">
      <span>Search engineering roles in Austin, TX</span>
    </div>
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <div style={{ padding: '0.5rem 1.2rem', border: '1px solid #e2e8f0', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700 }}>Full-Time</div>
      <div style={{ padding: '0.5rem 1.2rem', border: '1px solid #e2e8f0', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700 }}>Remote-Only</div>
      <div style={{ padding: '0.5rem 1.2rem', background: '#6366f1', color: 'white', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700 }}>Post Job</div>
    </div>
  </header>
);

export const MapJobCard = ({ title, company, salary, initial }: { title: string, company: string, salary: string, initial: string }) => (
  <div className="map-job-card-compact">
    <div className="map-job-initial">{initial}</div>
    <div className="map-job-info">
      <div className="map-job-title">{title}</div>
      <div className="map-job-meta">{company} • Austin, TX</div>
      <div className="map-job-salary">{salary}</div>
    </div>
  </div>
);

export const OfficeMarker = ({ initial, top, left }: { initial: string, top: string, left: string }) => (
  <div className="office-location-marker" style={{ top, left }}>
    {initial}
  </div>
);
