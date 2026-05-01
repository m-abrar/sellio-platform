import React from 'react';
import { api } from "@sellio/api-client";
import { Theme } from "@sellio/types";

export const ThemeSwitcher = async () => {
  let themes: Theme[] = [];
  
  try {
    themes = await api.getThemes();
  } catch (error) {
    console.error("ThemeSwitcher failed to fetch themes", error);
    return null;
  }

  // Group themes by vertical
  const groups = themes.reduce((acc, theme) => {
    const vertical = theme.vertical || 'Unified';
    if (!acc[vertical]) acc[vertical] = [];
    acc[vertical].push(theme);
    return acc;
  }, {} as Record<string, Theme[]>);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      padding: '15px',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      zIndex: 1000,
      width: '280px',
      maxHeight: '80vh',
      overflowY: 'auto',
      border: '1px solid rgba(0,0,0,0.05)',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {verticalThemes.map(t => (
              <a 
                key={t.theme_key} 
                href={`?theme=${t.theme_key}`}
                title={t.title}
                style={{
                  fontSize: '10px',
                  textDecoration: 'none',
                  color: t.is_active ? '#1e4d4e' : '#666',
                  fontWeight: t.is_active ? 700 : 500,
                  padding: '3px 8px',
                  background: t.is_active ? '#e1f2f2' : '#f5f5f5',
                  borderRadius: '4px',
                  border: t.is_active ? '1px solid #1e4d4e' : '1px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                {t.title.replace('Properties ', '').replace('Events ', '').replace('Unified ', '')}
              </a>
            ))}
          </div>
        </div>
      ))}
      
      <div style={{ marginTop: '10px', fontSize: '9px', color: '#999', textAlign: 'center' }}>
        Total Themes: {themes.length}
      </div>
    </div>
  );
};
