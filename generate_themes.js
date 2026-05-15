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

const comingSoonTemplate = (themeName) => `
import React from 'react';

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
        <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-indigo-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          ${themeName} <span className="text-indigo-600">Coming Soon</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          We are currently hand-crafting this elite vertical experience. 
          Stay tuned for a production-grade layout that will blow your users away.
        </p>
        <div className="flex gap-4 justify-center">
          <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
          <div className="h-1 w-12 bg-indigo-400 rounded-full"></div>
          <div className="h-1 w-12 bg-indigo-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
`;

Object.entries(themeGroups).forEach(([prefix, keys]) => {
    keys.forEach(key => {
        const themeKey = `${prefix}_${key}`;
        const folderPath = path.join(themesDir, themeKey);
        
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        
        const themeName = themeKey.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        fs.writeFileSync(path.join(folderPath, 'ComingSoon.tsx'), comingSoonTemplate(themeName));
        
        // Also create an index.ts to export it
        fs.writeFileSync(path.join(folderPath, 'index.ts'), `export { default } from './ComingSoon';\n`);
    });
});

console.log('Successfully created 50 theme folders with Coming Soon templates.');
