import React from 'react';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="unified-theme">
      <header className="unified-header">
        <div className="unified-logo">Sellio Platform</div>
        <nav style={{ display: 'flex', gap: '2rem' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>Browse</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>Categories</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>Sell</a>
        </nav>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ background: 'none', border: 'none', fontWeight: 600 }}>Login</button>
          <button className="unified-btn">Get Started</button>
        </div>
      </header>
      <main>{children}</main>
      <footer style={{ padding: '4rem 5%', borderTop: '1px solid #eee', background: '#fcfcfc', marginTop: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          <div>
            <div className="unified-logo" style={{ marginBottom: '1rem' }}>Sellio</div>
            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>The future of multi-vertical commerce.</p>
          </div>
          {/* Footer links placeholder */}
        </div>
      </footer>
    </div>
  );
}
