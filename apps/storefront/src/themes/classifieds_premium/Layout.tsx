
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#333' }}>
      <header style={{ 
        padding: '1.25rem 5%', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid #eee',
        backgroundColor: 'white'
      }}>
        <div style={{ fontWeight: 800, fontSize: '1.4rem', color: '#1e4d4e' }}>
          Classifieds <span style={{ opacity: 0.5 }}>Platform</span>
        </div>
        <nav style={{ display: 'flex', gap: '2rem' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Browse</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Categories</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Support</a>
        </nav>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ background: 'none', border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>Login</button>
          <button style={{ 
            backgroundColor: '#1e4d4e', 
            color: 'white', 
            padding: '0.6rem 1.5rem', 
            border: 'none', 
            borderRadius: '9999px', 
            fontWeight: 600, 
            fontSize: '0.9rem', 
            cursor: 'pointer' 
          }}>Join Now</button>
        </div>
      </header>
      <main>{children}</main>
      <footer style={{ padding: '4rem 5%', borderTop: '1px solid #eee', backgroundColor: '#fafafa', marginTop: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1e4d4e', marginBottom: '1rem' }}>Sellio</div>
            <p style={{ opacity: 0.6, fontSize: '0.85rem' }}>The future of multi-vertical commerce.</p>
          </div>
          {/* Footer columns could go here */}
        </div>
      </footer>
    </div>
  );
}
