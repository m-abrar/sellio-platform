'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Theme } from "@/types";

interface ThemeSwitcherClientProps {
  themes: Theme[];
  activeThemeKey: string;
}

const DEFAULT_SWITCHER_POSITION = { x: 20, y: 200 };

const ANIMATIONS = `
  @keyframes ts-enter-nudge {
    0%   { opacity: 0; transform: translateX(-28px); }
    38%  { opacity: 1; transform: translateX(2px); }
    50%  { opacity: 1; transform: translateX(0); }
    62%  { opacity: 1; transform: translateX(11px); }
    74%  { opacity: 1; transform: translateX(-7px); }
    84%  { opacity: 1; transform: translateX(5px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .gear-icon { animation: spin 4s linear infinite; }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

export const ThemeSwitcherClient: React.FC<ThemeSwitcherClientProps> = ({ themes, activeThemeKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState(DEFAULT_SWITCHER_POSITION);
  const [visible, setVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const didDrag = useRef(false);

  useEffect(() => {
    setPos({
      x: DEFAULT_SWITCHER_POSITION.x,
      y: Math.round(window.innerHeight * 0.25),
    });
  }, []);

  // Appear after 6 s so it doesn't crowd the initial page view
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Drag starts only from the drag-handle zone
  const onHandleMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    didDrag.current = false;
    setIsDragging(true);
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.preventDefault();
    e.stopPropagation(); // don't bubble to button's onClick
  }, [pos]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      didDrag.current = true;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - 160, e.clientX - dragOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 38, e.clientY - dragOffset.current.y)),
      });
    };
    const onMouseUp = () => {
      dragging.current = false;
      setIsDragging(false);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const handleButtonClick = () => {
    if (didDrag.current) return;
    setIsOpen(prev => !prev);
  };

  // Group themes by vertical
  const groups = themes.reduce((acc, theme) => {
    const vertical = theme.vertical || 'Unified';
    if (!acc[vertical]) acc[vertical] = [];
    acc[vertical].push(theme);
    return acc;
  }, {} as Record<string, Theme[]>);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: pos.y,
      left: pos.x,
      zIndex: 1000,
      fontFamily: 'Inter, sans-serif',
      userSelect: 'none',
      animation: 'ts-enter-nudge 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
    }}>
      <style dangerouslySetInnerHTML={{ __html: ANIMATIONS }} />

      {/* Toggle Button — cursor: pointer for the click action */}
      <button
        onClick={handleButtonClick}
        style={{
          height: '38px',
          padding: '0 12px 0 8px',
          borderRadius: '19px',
          background: '#1e4d4e',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '7px',
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isOpen ? 'scale(0.9)' : 'scale(1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Drag handle — cursor: grab/grabbing, starts drag on mousedown */}
        <span
          onMouseDown={onHandleMouseDown}
          title="Drag to reposition"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5px',
            opacity: 0.6,
            flexShrink: 0,
            padding: '4px 2px',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          {[0, 1, 2].map(row => (
            <span key={row} style={{ display: 'flex', gap: '2.5px' }}>
              {[0, 1].map(col => (
                <span key={col} style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'currentColor', display: 'block' }} />
              ))}
            </span>
          ))}
        </span>

        {/* Spinning gear — click area */}
        <svg
          className="gear-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>

        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.03em', whiteSpace: 'nowrap', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '5px' }}>
          Demos
          <span style={{ fontSize: '10px', fontWeight: 900, background: '#f97316', color: '#fff', borderRadius: '6px', padding: '2px 6px', lineHeight: 1.4, letterSpacing: '0.02em' }}>
            50+
          </span>
        </span>
      </button>

      {/* Theme List Panel */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '48px',
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
          animation: 'slideDown 0.3s ease-out',
        }}>
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
                paddingBottom: '4px',
              }}>
                {vertical}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {verticalThemes.map(t => {
                  const isActive = t.theme_key === activeThemeKey;
                  const previewUrl = `/preview/${t.theme_key}`;

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
                        cursor: 'pointer',
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
