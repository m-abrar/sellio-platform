import React from 'react';

const themes = [
  { key: 'ecommerce_fashion', title: 'Fashion' },
  { key: 'ecommerce_tech', title: 'Tech/Electronics' },
  { key: 'ecommerce_grocery', title: 'Grocery' },
  { key: 'properties_modern', title: 'Real Estate' },
];

export const ThemeSwitcher = () => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'white',
      padding: '10px',
      borderRadius: '10px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      zIndex: 1000,
      display: 'flex',
      gap: '10px',
      border: '1px solid #eee'
    }}>
      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', marginRight: '5px' }}>SWITCH THEME:</span>
      {themes.map(t => (
        <a 
          key={t.key} 
          href={`?theme=${t.key}`}
          style={{
            fontSize: '11px',
            textDecoration: 'none',
            color: '#0070f3',
            fontWeight: 600,
            padding: '2px 8px',
            background: '#f0f7ff',
            borderRadius: '4px'
          }}
        >
          {t.title}
        </a>
      ))}
    </div>
  );
};
