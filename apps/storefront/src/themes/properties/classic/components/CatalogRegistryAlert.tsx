'use client';

import React from 'react';

type CatalogRegistryAlertProps = {
  variant: 'demo' | 'production';
  error: string;
};

export function CatalogRegistryAlert({ variant, error }: CatalogRegistryAlertProps) {
  const isDemo = variant === 'demo';

  return (
    <div
      className="pc-alert-panel"
      style={{
        background: 'var(--pc-white)',
        border: '1px solid var(--pc-border)',
        borderLeft: `4px solid ${isDemo ? 'var(--pc-accent)' : 'var(--pc-teal)'}`,
        boxShadow: '0 20px 40px rgba(var(--pc-teal-rgb), 0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isDemo ? 'var(--pc-accent)' : 'var(--pc-teal)',
            display: 'inline-block',
          }}
        />
        <span className="pc-caps" style={{ color: isDemo ? 'var(--pc-accent)' : 'var(--pc-teal)', fontSize: '0.7rem' }}>
          {isDemo ? 'Demo Catalogue // Preview Mode' : 'Registry Unavailable // Production'}
        </span>
      </div>
      <div>
        <h3 className="pc-serif" style={{ fontSize: '1.5rem', color: 'var(--pc-teal)', margin: '0 0 0.5rem 0', fontWeight: 700 }}>
          {isDemo ? 'Showing Sample Heritage Listings' : 'Unable to Load Listings from Registry'}
        </h3>
        <p style={{ color: 'var(--pc-text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.7 }}>
          {isDemo
            ? 'The live property API is unavailable. Sample estates from the theme demo pack are shown so preview and local setup still work.'
            : 'Listings are not shown because the storefront could not reach your Sellio database. Run migrations and seeders, confirm the API URL, and publish properties in the admin.'}
        </p>
      </div>
      <div
        style={{
          background: 'var(--pc-beige)',
          padding: '1rem',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          color: 'var(--pc-teal)',
          borderLeft: '2px solid var(--pc-teal)',
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
        }}
      >
        System Diagnostic: {error}
      </div>
    </div>
  );
}
