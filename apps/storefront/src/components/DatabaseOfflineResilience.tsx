'use client';

import React, { useState, useEffect } from 'react';

interface DatabaseOfflineResilienceProps {
  errorDetails?: {
    success: boolean;
    message: string;
    code: string;
    status: number;
  };
}

export default function DatabaseOfflineResilience({ errorDetails }: DatabaseOfflineResilienceProps) {
  const [isDismissed, setIsDismissed] = useState(true); // Default true to avoid SSR mismatch, check in useEffect
  const [isReconnecting, setIsReconnecting] = useState(false);

  const fallbackDetails = {
    success: false,
    message: "Database service is currently unavailable. Please try again later.",
    code: "DB_CONNECTION_REFUSED",
    status: 503
  };

  const details = errorDetails || fallbackDetails;

  useEffect(() => {
    // Read session storage to see if user has already dismissed it in this session
    const dismissed = sessionStorage.getItem('sellio_db_offline_dismissed') === 'true';
    setIsDismissed(dismissed);
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('sellio_db_offline_dismissed', 'true');
    setIsDismissed(true);
  };

  const handleReconnect = () => {
    setIsReconnecting(true);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const handleResetResilience = () => {
    sessionStorage.removeItem('sellio_db_offline_dismissed');
    setIsDismissed(false);
  };

  if (isDismissed) {
    // Return a floating premium micro-pill indicating Offline simulation catalog mode is active
    return (
      <div 
        onClick={handleResetResilience}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 99999,
          backgroundColor: 'rgba(10, 10, 15, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          borderRadius: '50px',
          padding: '8px 16px',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.25), 0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          fontFamily: "'Outfit', 'Inter', sans-serif",
          animation: 'pulseGlow 2s infinite alternate',
        }}
        className="offline-indicator-pill"
      >
        <span 
          style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            boxShadow: '0 0 10px #ef4444',
          }} 
        />
        <span style={{ color: '#f3f4f6', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.5px' }}>
          OFFLINE BACKUP MODE
        </span>
        
        <style jsx global>{`
          @keyframes pulseGlow {
            0% { transform: scale(1); box-shadow: 0 0 15px rgba(239, 68, 68, 0.2); }
            100% { transform: scale(1.03); box-shadow: 0 0 25px rgba(239, 68, 68, 0.4); }
          }
          .offline-indicator-pill:hover {
            border-color: #ef4444 !important;
            transform: translateY(-2px) scale(1.05) !important;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(5, 5, 8, 0.85)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '640px',
          backgroundColor: 'rgba(15, 15, 25, 0.75)',
          borderRadius: '24px',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          padding: '40px',
          boxShadow: '0 0 50px rgba(239, 68, 68, 0.15), inset 0 0 20px rgba(255, 255, 255, 0.02)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.5s ease',
        }}
      >
        {/* Glow Effects */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '100px',
          background: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.15), transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Pulsing Alert Icon */}
        <div 
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '2px solid rgba(239, 68, 68, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '1.75rem',
            animation: 'heartbeat 1.5s infinite ease-in-out',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)',
          }}
        >
          ⚠️
        </div>

        {/* Headline */}
        <h2 
          style={{
            color: '#f9fafb',
            fontSize: '1.75rem',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            marginBottom: '12px',
            lineHeight: 1.3
          }}
        >
          Database Connection Unavailable
        </h2>
        
        {/* Subtitle */}
        <p 
          style={{
            color: '#9ca3af',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            marginBottom: '28px',
            maxWidth: '460px',
            marginRight: 'auto',
            marginLeft: 'auto'
          }}
        >
          The platform detected an unresponsive database backend. The system has automatically booted into high-fidelity local catalog resilience fallback.
        </p>

        {/* Structured Diagnostics Code Frame */}
        <div style={{ textAlign: 'left', marginBottom: '32px' }}>
          <div 
            style={{
              fontSize: '0.75rem',
              color: '#ef4444',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '8px',
              paddingLeft: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444', animation: 'blink 1s infinite' }}></span>
            DIAGNOSTIC_TRACE_LOG
          </div>
          <pre 
            style={{
              backgroundColor: 'rgba(5, 5, 10, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: '0.85rem',
              color: '#ef4444',
              lineHeight: 1.5,
              overflowX: 'auto',
              boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.5)'
            }}
          >
{JSON.stringify(details, null, 2)}
          </pre>
        </div>

        {/* Buttons Control Panel */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '360px',
            margin: '0 auto'
          }}
        >
          <button 
            onClick={handleReconnect}
            disabled={isReconnecting}
            style={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 24px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            className="md-reconnect-btn"
          >
            {isReconnecting ? (
              <>
                <span className="spinner"></span>
                Reconnecting...
              </>
            ) : (
              <>
                🔄 Attempt Reconnection
              </>
            )}
          </button>

          <button 
            onClick={handleDismiss}
            style={{
              backgroundColor: 'transparent',
              color: '#d1d5db',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '14px 24px',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            className="md-dismiss-btn"
          >
            📂 Browse Offline Catalog Backups
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
          75% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .md-reconnect-btn:hover {
          background-color: #f87171 !important;
          transform: translateY(-1px) !important;
        }
        .md-reconnect-btn:active {
          transform: translateY(1px) !important;
        }
        .md-dismiss-btn:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
          color: #ffffff !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
        }
        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #ffffff;
          animation: spin 0.8s infinite linear;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
