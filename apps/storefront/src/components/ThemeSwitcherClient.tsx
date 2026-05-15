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

  const handleThemeSwitch = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    
    // Construct the preview URL while preserving the current path
    // Strip any existing /preview/[themeKey] prefix to prevent nesting
    const currentPath = window.location.pathname;
    const cleanPath = currentPath.replace(/^\/preview\/[^/]+/, '') || '/';
    
    // Build the final preview URL
    const previewUrl = `/preview/${key}${cleanPath === '/' ? '' : cleanPath}`;
    
    // Jump to the dedicated preview URL
    window.location.href = previewUrl;
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
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
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2a2 2 0 0 1-2 2a2 2 0 0 0-2 2a2 2 0 0 1-2 2a2 2 0 0 0-2 2v.44a2 2 0 0 0 2 2a2 2 0 0 1 2 2a2 2 0 0 0 2 2a2 2 0 0 1 2 2a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2a2 2 0 0 1 2-2a2 2 0 0 0 2-2a2 2 0 0 1 2-2a2 2 0 0 0 2-2v-.44a2 2 0 0 0-2-2a2 2 0 0 1-2-2a2 2 0 0 0-2-2a2 2 0 0 1-2-2a2 2 0 0 0-2-2z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        
        {/* Small secondary gear hint */}
        <svg 
          className="gear-icon-fast"
          style={{ position: 'absolute', top: '12px', right: '12px', opacity: 0.4 }}
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2a2 2 0 0 1-2 2a2 2 0 0 0-2 2a2 2 0 0 1-2 2a2 2 0 0 0-2 2v.44a2 2 0 0 0 2 2a2 2 0 0 1 2 2a2 2 0 0 0 2 2a2 2 0 0 1 2 2a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2a2 2 0 0 1 2-2a2 2 0 0 0 2-2a2 2 0 0 1 2-2a2 2 0 0 0 2-2v-.44a2 2 0 0 0-2-2a2 2 0 0 1-2-2a2 2 0 0 0-2-2a2 2 0 0 1-2-2a2 2 0 0 0-2-2z"></path>
        </svg>
      </button>

      {/* Theme List Panel */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '60px',
          right: '0',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          width: '320px',
          maxHeight: '70vh',
          overflowY: 'auto',
          border: '1px solid rgba(0,0,0,0.05)',
          animation: 'slideUp 0.3s ease-out'
        }}>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(10px); }
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
                  return (
                    <a 
                      key={t.theme_key} 
                      href="#"
                      onClick={(e) => handleThemeSwitch(e, t.theme_key)}
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
