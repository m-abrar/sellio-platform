
import React from 'react';

export default function Page() {
  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f9fafb',
      padding: '2rem',
      textAlign: 'center',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ 
        maxWidth: '42rem', 
        width: '100%', 
        backgroundColor: 'white', 
        borderRadius: '1.5rem', 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', 
        padding: '3rem', 
        border: '1px solid #f3f4f6' 
      }}>
        <div style={{ 
          width: '5rem', 
          height: '5rem', 
          backgroundColor: '#1e4d4e15', 
          borderRadius: '1rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 2rem auto' 
        }}>
          <svg style={{ width: '2.5rem', height: '2.5rem', color: '#1e4d4e' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h1 style={{ 
          fontSize: '2.25rem', 
          fontWeight: 800, 
          color: '#111827', 
          marginBottom: '1rem', 
          letterSpacing: '-0.025em',
          lineHeight: 1.2
        }}>
          Unifieds Classic <span style={{ color: '#1e4d4e' }}>Coming Soon</span>
        </h1>
        <p style={{ 
          fontSize: '1.125rem', 
          color: '#4b5563', 
          marginBottom: '2rem', 
          maxWidth: '28rem', 
          margin: '0 auto 2rem auto',
          lineHeight: 1.6
        }}>
          We are currently hand-crafting this elite vertical experience. 
          Stay tuned for a production-grade layout that will blow your users away.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <div style={{ height: '0.25rem', width: '3rem', backgroundColor: '#1e4d4e', borderRadius: '9999px' }}></div>
          <div style={{ height: '0.25rem', width: '3rem', backgroundColor: '#1e4d4e60', borderRadius: '9999px' }}></div>
          <div style={{ height: '0.25rem', width: '3rem', backgroundColor: '#1e4d4e30', borderRadius: '9999px' }}></div>
        </div>
      </div>
    </div>
  );
}
