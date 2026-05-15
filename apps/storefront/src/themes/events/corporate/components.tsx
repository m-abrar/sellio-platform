import React from 'react';

export const ConfHeader = () => (
  <header className="conf-header">
    <div className="conf-logo">CORP_FORUM_2026</div>
    <nav className="conf-nav">
      <span>Speakers</span>
      <span>Agenda</span>
      <span>Venue</span>
    </nav>
    <button className="register-btn-header">REGISTER_NOW</button>
  </header>
);

export const SpeakerCard = ({ name, role, image, company }: { name: string, role: string, image: string, company: string }) => (
  <div className="speaker-card">
    <div className="speaker-image-wrapper">
      <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <h3 className="speaker-name">{name}</h3>
    <div className="speaker-role">{role} @ {company}</div>
  </div>
);

export const AgendaItem = ({ time, title, speaker, track }: { time: string, title: string, speaker: string, track: string }) => (
  <div className="agenda-row">
    <div className="agenda-time">{time}</div>
    <div className="agenda-content">
      <div className="agenda-track">{track}</div>
      <h4>{title}</h4>
      <div style={{ fontSize: '0.9rem', opacity: 0.6 }}>SPEAKER: {speaker}</div>
    </div>
  </div>
);

export const CorporateFooter = () => (
  <footer className="corporate-footer">
    <div className="conf-logo">CORP_FORUM_2026</div>
    <div style={{ display: 'flex', gap: '3rem', fontSize: '0.8rem', opacity: 0.6 }}>
      <span>PRIVACY_POLICY</span>
      <span>CODE_OF_CONDUCT</span>
      <span>CONTACT_US</span>
    </div>
    <div>(C) 2026 SELLIO_CONFERENCES</div>
  </footer>
);
