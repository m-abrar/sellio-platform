import React from 'react';

export const ExecutiveHeader = () => (
  <header className="executive-header">
    <div className="executive-logo">LEAD_EXECUTIVE</div>
    <div style={{ display: 'flex', gap: '3rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
      <span>Mandates</span>
      <span>Discretion</span>
      <span>Advisory</span>
    </div>
    <div style={{ letterSpacing: '2px', fontSize: '0.7rem', fontWeight: 800 }}>PRIVATE_LOGIN_</div>
  </header>
);

export const MandateCard = ({ title, industry, location, status }: { title: string, industry: string, location: string, status: string }) => (
  <div className="mandate-block">
    <div style={{ flex: 1 }}>
      <div className="mandate-status">{status}</div>
      <h3 className="mandate-title">{title}</h3>
      <div className="mandate-meta">{industry} // {location}</div>
      <div className="mandate-apply-btn">REQUEST_BRIEF</div>
    </div>
  </div>
);

export const DiscreetFooter = () => (
  <footer className="discreet-footer">
    <div className="executive-logo" style={{ color: 'var(--color-gold)', marginBottom: '3rem' }}>LEAD_EXECUTIVE</div>
    <p style={{ maxWidth: '600px', margin: '0 auto 4rem', opacity: 0.5, lineHeight: '2', letterSpacing: '1px', fontSize: '0.9rem' }}>
      "A global advisory for the world's most significant leadership mandates. We operate at the intersection of high-fidelity talent and absolute discretion."
    </p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', fontSize: '0.6rem', letterSpacing: '3px', opacity: 0.4 }}>
      <span>CONFIDENTIALITY</span>
      <span>COMPLIANCE</span>
      <span>GLOBAL_HUBS</span>
    </div>
  </footer>
);
