const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, 'apps/storefront/src/themes');

const themeGroups = {
    'unifieds': ['default', 'standard', 'classic', 'modern', 'mega', 'interactive', 'minimal', 'marketplace'],
    'properties': ['classic', 'modern', 'luxury', 'luxury_2', 'urban', 'rental', 'vacation', 'map', 'unified', 'commercial', 'showcase', 'neighborhood', 'investment'],
    'events': ['classic', 'creative', 'corporate', 'music', 'festival'],
    'autos': ['classic', 'modern', 'used', 'luxury', 'electric'],
    'services': ['corporate', 'marketplace', 'creative', 'local', 'health'],
    'jobs': ['corporate', 'startup', 'tech', 'blue_collar', 'freelance'],
    'classifieds': ['general', 'modern', 'local', 'deals', 'premium'],
    'ecommerce': ['default', 'luxury', 'fashion', 'electronics']
};

const getThemeStyles = (themeKey) => {
    let primary = '#1e4d4e';
    let font = "'Inter', sans-serif";
    
    if (themeKey.includes('modern')) {
        primary = '#1e88e5';
        font = "'Outfit', sans-serif";
    } else if (themeKey.includes('luxury')) {
        primary = '#1a1a1a';
        font = "'Playfair Display', serif";
    } else if (themeKey.includes('autos')) {
        primary = '#d32f2f';
        font = "'Montserrat', sans-serif";
    } else if (themeKey.includes('properties')) {
        primary = '#2e7d32';
        font = "'Inter', sans-serif";
    } else if (themeKey.includes('jobs')) {
        primary = '#4527a0';
        font = "'Inter', sans-serif";
    }
    
    return { primary, font };
};

const pageTemplate = (themeName, themeKey) => {
    const { primary, font } = getThemeStyles(themeKey);
    return `
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
      fontFamily: "${font}"
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
          backgroundColor: '${primary}15', 
          borderRadius: '1rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 2rem auto' 
        }}>
          <svg style={{ width: '2.5rem', height: '2.5rem', color: '${primary}' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          ${themeName} <span style={{ color: '${primary}' }}>Coming Soon</span>
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
          <div style={{ height: '0.25rem', width: '3rem', backgroundColor: '${primary}', borderRadius: '9999px' }}></div>
          <div style={{ height: '0.25rem', width: '3rem', backgroundColor: '${primary}60', borderRadius: '9999px' }}></div>
          <div style={{ height: '0.25rem', width: '3rem', backgroundColor: '${primary}30', borderRadius: '9999px' }}></div>
        </div>
      </div>
    </div>
  );
}
`;
};

const layoutTemplate = (themeName, themeKey) => {
    const { primary, font } = getThemeStyles(themeKey);
    return `
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "${font}", color: '#333' }}>
      <header style={{ 
        padding: '1.25rem 5%', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid #eee',
        backgroundColor: 'white'
      }}>
        <div style={{ fontWeight: 800, fontSize: '1.4rem', color: '${primary}' }}>
          ${themeName.split(' ')[0]} <span style={{ opacity: 0.5 }}>Platform</span>
        </div>
        <nav style={{ display: 'flex', gap: '2rem' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Browse</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Categories</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Support</a>
        </nav>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ background: 'none', border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>Login</button>
          <button style={{ 
            backgroundColor: '${primary}', 
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
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '${primary}', marginBottom: '1rem' }}>Sellio</div>
            <p style={{ opacity: 0.6, fontSize: '0.85rem' }}>The future of multi-vertical commerce.</p>
          </div>
          {/* Footer columns could go here */}
        </div>
      </footer>
    </div>
  );
}
`;
};

Object.entries(themeGroups).forEach(([prefix, keys]) => {
    keys.forEach(key => {
        const themeKey = `${prefix}_${key}`;
        const folderPath = path.join(themesDir, themeKey);
        
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        
        const themeName = themeKey.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        
        // Create Page.tsx
        fs.writeFileSync(path.join(folderPath, 'Page.tsx'), pageTemplate(themeName, themeKey));
        
        // Create Layout.tsx
        fs.writeFileSync(path.join(folderPath, 'Layout.tsx'), layoutTemplate(themeName, themeKey));
        
        // Create index.ts to export both
        fs.writeFileSync(path.join(folderPath, 'index.ts'), `
export { default } from './Page';
export { default as Layout } from './Layout';
`);
    });
});

console.log('Successfully updated 50 theme folders with unique Pages and Layouts.');
