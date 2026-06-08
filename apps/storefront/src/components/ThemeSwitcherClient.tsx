'use client';

import React, { useState } from 'react';
import type { Theme } from "@sellio/types";

interface ThemeSwitcherClientProps {
  themes: Theme[];
  activeThemeKey: string;
}

export const ThemeSwitcherClient: React.FC<ThemeSwitcherClientProps> = ({ themes, activeThemeKey }) => {
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle with Ctrl + Shift + H (Hide)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Group themes by vertical
  const groups = themes.reduce((acc, theme) => {
    const vertical = theme.vertical || 'Unified';
    if (!acc[vertical]) acc[vertical] = [];
    acc[vertical].push(theme);
    return acc;
  }, {} as Record<string, Theme[]>);

  // Prepare the clean path once for all links
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const cleanPath = currentPath.replace(/^\/preview\/[^/]+/, '') || '/';

  return (
    <div style={{
      position: 'fixed',
      top: '25%',
      left: '20px',
      transform: 'translateY(-50%)',
      zIndex: 1000,
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '28px',
          background: '#1e4d4e',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isOpen ? 'scale(0.9)' : 'scale(1)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .gear-icon {
            animation: spin 4s linear infinite;
          }
          .gear-icon-fast {
            animation: spin 2s linear infinite reverse;
          }
        ` }} />
        
        {/* Main Gear */}
        <svg 
          className="gear-icon"
          width="28" 
          height="28" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
        
        {/* Small secondary gear hint */}
        <svg 
          className="gear-icon-fast"
          style={{ position: 'absolute', top: '8px', right: '8px', opacity: 0.8, filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.2))' }}
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>

      {/* Theme List Panel */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '70px',
          left: '0',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          width: '320px',
          maxHeight: '60vh',
          overflowY: 'auto',
          border: '1px solid rgba(0,0,0,0.05)',
          animation: 'slideDown 0.3s ease-out'
        }}>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes slideDown {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          ` }} />
          
          <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#1e4d4e' }}>
            Theme Engine Preview
          </h3>
          
          {Object.entries(groups).map(([vertical, verticalThemes]) => (
            <div key={vertical} style={{ marginBottom: '15px' }}>
              <div style={{ 
                fontSize: '10px', 
                fontWeight: 800, 
                color: '#999', 
                textTransform: 'uppercase', 
                marginBottom: '8px',
                borderBottom: '1px solid #eee',
                paddingBottom: '4px'
              }}>
                {vertical}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {verticalThemes.map(t => {
                  const isActive = t.theme_key === activeThemeKey;
                  const previewUrl = `/preview/${t.theme_key}${cleanPath === '/' ? '' : cleanPath}`;
                  
                  return (
                    <a 
                      key={t.theme_key} 
                      href={previewUrl}
                      title={t.title}
                      style={{
                        fontSize: '10px',
                        textDecoration: 'none',
                        color: isActive ? '#1e4d4e' : '#666',
                        fontWeight: isActive ? 700 : 500,
                        padding: '4px 10px',
                        background: isActive ? '#e1f2f2' : '#f5f5f5',
                        borderRadius: '6px',
                        border: isActive ? '1px solid #1e4d4e' : '1px solid transparent',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                    >
                      {t.title.replace('Properties ', '').replace('Events ', '').replace('Unified ', '').replace('Universal ', '')}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
          
          <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #eee', fontSize: '9px', color: '#999', textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}>
            <span>{themes.length} Themes Available</span>
            <span style={{ opacity: 0.7 }}>Ctrl+Shift+H</span>
          </div>
        </div>
      )}
    </div>
  );
};
