import { getActiveTheme } from "@/lib/theme";
import React from 'react';

export default async function CartPage() {
  const { layout } = await getActiveTheme();

  try {
    const themeModule = await import(`@/themes/${layout}`);
    
    // Check if the theme exports a dynamic CartPage subpage template
    const ThemeCartPage = themeModule.CartPage;
    
    if (!ThemeCartPage) {
      throw new Error(`CartPage not exported in theme: ${layout}`);
    }

    return <ThemeCartPage />;
  } catch (error) {
    console.warn(`Cart not implemented for theme "${layout}". Falling back to default warning.`, error);
    
    return (
      <div 
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at top left, #1e1b4b, #0f172a)',
          color: '#f8fafc',
          fontFamily: "'Outfit', 'Inter', sans-serif",
          padding: '2rem'
        }}
      >
        <div 
          style={{
            maxWidth: '500px',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '3rem 2.5rem',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div 
            style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 8px 20px rgba(236, 72, 153, 0.3)'
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '0.75rem', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Shopping Cart
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '2rem' }}>
            The shopping cart is currently being loaded dynamically from the theme: <strong style={{ color: '#e2e8f0' }}>{layout}</strong>.
          </p>
          <a 
            href={`/preview/${layout.replace('/', '_')}`} 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.75rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              gap: '0.5rem'
            }}
          >
            &larr; Back to Catalog Homepage
          </a>
        </div>
      </div>
    );
  }
}
