'use client';
import React from 'react';

export const Header = () => (
  <header style={{ 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100%', 
    zIndex: 1000, 
    background: 'var(--ec-glass)', 
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--ec-border)'
  }}>
    <div style={{ 
      maxWidth: '1400px', 
      margin: '0 auto', 
      padding: '1.5rem 8%', 
      display: 'flex', 
      justify-content: 'space-between', 
      align-items: 'center' 
    }}>
      <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
        FORUM<span style={{ color: 'var(--ec-blue)' }}>26</span>
      </div>
      
      <nav style={{ display: 'flex', gap: '3rem' }}>
        {['SPEAKERS', 'SCHEDULE', 'VENUE', 'PARTNERS'].map(item => (
          <span key={item} style={{ 
            fontSize: '0.85rem', 
            fontWeight: 600, 
            color: 'var(--ec-text-muted)', 
            cursor: 'pointer',
            transition: 'var(--ec-transition)'
          }}>
            {item}
          </span>
        ))}
      </nav>

      <button className="ec-btn-primary" style={{ padding: '0.7rem 2rem', fontSize: '0.85rem' }}>
        REGISTER_NOW
      </button>
    </div>
  </header>
);

export const Footer = () => (
  <footer style={{ background: var(--ec-bone), padding: '8rem 8% 4rem', borderTop: '1px solid var(--ec-border)' }}>
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8rem' }}>
      <div>
        <div style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '2rem' }}>FORUM26</div>
        <p style={{ color: 'var(--ec-text-muted)', lineHeight: 1.8, maxWidth: '400px' }}>
          The premier global assembly for architectural engineering and distributed systems. Shaping the future of technical infrastructure.
        </p>
      </div>
      
      <div>
          <div className="ec-mono" style={{ marginBottom: '2rem', color: 'var(--ec-text-main)' }}>EXPLORE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {['Speakers', 'Agenda', 'Workshops', 'Certification'].map(item => (
                  <span key={item} style={{ color: 'var(--ec-text-muted)', fontSize: '0.95rem', cursor: 'pointer' }}>{item}</span>
              ))}
          </div>
      </div>

      <div>
          <div className="ec-mono" style={{ marginBottom: '2rem', color: 'var(--ec-text-main)' }}>CONTACT</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span style={{ color: 'var(--ec-text-muted)', fontSize: '0.95rem' }}>support@forum26.com</span>
              <span style={{ color: 'var(--ec-text-muted)', fontSize: '0.95rem' }}>San Francisco, CA</span>
          </div>
      </div>
    </div>
    
    <div style={{ maxWidth: '1400px', margin: '6rem auto 0', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--ec-border)', paddingTop: '3rem' }}>
        <div style={{ color: 'var(--ec-text-muted)', fontSize: '0.85rem' }}>© 2026 SELLIO_EVENTS_GRP</div>
        <div style={{ display: 'flex', gap: '3rem' }}>
            {['PRIVACY', 'TERMS', 'CODE_OF_CONDUCT'].map(item => (
                <span key={item} className="ec-mono" style={{ fontSize: '0.65rem' }}>{item}</span>
            ))}
        </div>
    </div>
  </footer>
);

export const SpeakerCard = ({ name, role, company, image }: any) => (
  <div className="ec-speaker-card">
    <img src={image} alt={name} className="ec-speaker-image" />
    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>{name}</h3>
    <div style={{ color: 'var(--ec-blue)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.2rem' }}>{company}</div>
    <div style={{ color: 'var(--ec-text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>{role}</div>
  </div>
);

export const AgendaItem = ({ time, title, speaker, track }: any) => (
  <div className="ec-agenda-item">
    <div className="ec-mono">{time}</div>
    <div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ 
                background: 'var(--ec-bone)', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '4px', 
                fontSize: '0.65rem', 
                fontWeight: 800, 
                color: 'var(--ec-text-muted)',
                letterSpacing: '1px'
            }}>{track}</span>
        </div>
        <h4 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>{title}</h4>
        <div style={{ color: 'var(--ec-text-muted)', fontWeight: 500 }}>Presented by <span style={{ color: 'var(--ec-text-main)', fontWeight: 700 }}>{speaker}</span></div>
    </div>
  </div>
);
