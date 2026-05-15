'use client';
import React from 'react';

export const Header = () => (
  <header style={{ 
    position: 'fixed', 
    top: '2rem', 
    left: '50%', 
    transform: 'translateX(-50%)', 
    width: '90%', 
    maxWidth: '1400px', 
    zIndex: 1000 
  }}>
    <div style={{ 
      background: 'var(--am-glass)', 
      backdropFilter: 'blur(20px)', 
      border: '1px solid var(--am-border)', 
      borderRadius: '100px', 
      padding: '1rem 3rem', 
      display: 'flex', 
      justify-content: 'space-between', 
      align-items: 'center',
      boxShadow: 'var(--am-glow)'
    }}>
      <div style={{ fontFamily: 'var(--am-font-heading)', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-1px' }}>
        AUTO<span style={{ color: 'var(--am-blue)' }}>MODERN</span>
      </div>
      
      <nav style={{ display: 'flex', gap: '3rem' }}>
        {['VEHICLES', 'TECHNOLOGY', 'SHOWROOM', 'CONFIGURATOR'].map(item => (
          <span key={item} className="am-mono" style={{ cursor: 'pointer', transition: 'var(--am-transition)' }}>
            {item}
          </span>
        ))}
      </nav>

      <button className="am-btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '0.8rem' }}>
        ACCESS_NODE
      </button>
    </div>
  </header>
);

export const Footer = () => (
  <footer className="am-section" style={{ borderTop: '1px solid var(--am-border)', marginTop: '8rem' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4rem' }}>
      <div>
        <div style={{ fontFamily: 'var(--am-font-heading)', fontWeight: 900, fontSize: '2rem', marginBottom: '1.5rem' }}>
          AUTO<span style={{ color: 'var(--am-blue)' }}>MODERN</span>
        </div>
        <p style={{ color: 'var(--am-text-muted)', lineHeight: 1.8, maxWidth: '300px' }}>
          High-fidelity automotive distribution node for the global digital economy. Precision engineering since 2024.
        </p>
      </div>
      
      {[
        { title: 'ENGINEERING', links: ['Dynamics', 'Thermal', 'Neural', 'Range'] },
        { title: 'NETWORK', links: ['Global Nodes', 'Service Sync', 'Charging', 'Fleet'] },
        { title: 'LEGAL', links: ['Protocol', 'Privacy', 'Security', 'Auth'] }
      ].map(col => (
        <div key={col.title}>
          <div className="am-mono" style={{ marginBottom: '2rem', color: 'white' }}>{col.title}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {col.links.map(link => (
              <span key={link} style={{ color: 'var(--am-text-muted)', fontSize: '0.9rem', cursor: 'pointer' }}>{link}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div style={{ marginTop: '6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="am-mono" style={{ fontSize: '0.6rem', opacity: 0.5 }}>© 2026 SELLIO_AUTOMOTIVE_GROUP // ALL_RIGHTS_RESERVED</div>
        <div style={{ display: 'flex', gap: '2rem' }}>
            {['INSTAGRAM', 'LINKEDIN', 'X_PLATFORM'].map(social => (
                <span key={social} className="am-mono" style={{ fontSize: '0.6rem' }}>{social}</span>
            ))}
        </div>
    </div>
  </footer>
);

export const CarCard = ({ name, price, year, fuel, hp, transmission, image, span = 4 }: any) => (
  <div className={`am-card am-card-span-${span}`}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
            <div className="am-mono">{year} // SERIES</div>
            <h3 style={{ fontSize: '2rem', fontWeight: 900, marginTop: '0.5rem' }}>{name}</h3>
        </div>
        <div className="am-mono" style={{ color: 'white', background: 'var(--am-blue)', padding: '0.4rem 1rem', borderRadius: '4px' }}>
            AVAILABLE
        </div>
    </div>

    <div style={{ height: '240px', position: 'relative', margin: '2rem 0' }}>
        <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {[
            { label: 'ENERGY', value: fuel },
            { label: 'OUTPUT', value: `${hp} HP` },
            { label: 'DRIVE', value: transmission },
            { label: 'STATUS', value: 'SYNCED' }
        ].map(spec => (
            <div key={spec.label}>
                <div className="am-mono" style={{ fontSize: '0.6rem', opacity: 0.5 }}>{spec.label}</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: '0.2rem' }}>{spec.value}</div>
            </div>
        ))}
    </div>

    <div style={{ borderTop: '1px solid var(--am-border)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{price}</div>
        <button className="am-btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '0.7rem' }}>INITIALIZE_PURCHASE</button>
    </div>
  </div>
);

export const Gauge = ({ label, value, percentage }: { label: string, value: string, percentage: number }) => (
    <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="am-mono" style={{ fontSize: '0.65rem' }}>{label}</span>
            <span className="am-mono" style={{ fontSize: '0.65rem', color: 'white' }}>{value}</span>
        </div>
        <div className="am-gauge-container">
            <div className="am-gauge-fill" style={{ width: `${percentage}%` }}></div>
        </div>
    </div>
);
