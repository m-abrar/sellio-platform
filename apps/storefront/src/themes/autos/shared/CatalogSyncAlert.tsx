'use client';

import React from 'react';

type CatalogSyncAlertProps = {
  variant: 'demo' | 'production' | 'preview-sample' | 'not-found';
  error?: string;
  classPrefix?: 'md' | 'lx' | 'ac' | 'us' | 'ev';
};

export function CatalogSyncAlert({
  variant,
  error,
  classPrefix = 'md',
}: CatalogSyncAlertProps) {
  const prefix = classPrefix;

  const copy = {
    demo: {
      badge: 'Preview mode',
      title: 'Showing sample vehicles',
      message:
        'The live vehicle API is unavailable. Sample listings are shown so you can preview the theme during local setup.',
    },
    'preview-sample': {
      badge: 'Theme sample',
      title: 'Preview listing (not in your database)',
      message:
        'This URL uses a theme demo slug. Browse live inventory from Explore or pick a vehicle from the homepage to test the full API flow.',
    },
    'not-found': {
      badge: 'Not found',
      title: 'Vehicle not in inventory',
      message:
        'That slug is not published in your Sellio database. Use Explore to open a live listing, or publish vehicles in admin.',
    },
    production: {
      badge: 'Connection error',
      title: 'Unable to load inventory',
      message:
        'Listings are hidden because the storefront could not reach your Sellio API. Check your API URL, run migrations and seeders, and publish vehicles.',
    },
  }[variant];

  return (
    <div
      className={`${prefix}-catalog-alert ${variant === 'production' ? `${prefix}-catalog-alert--prod` : `${prefix}-catalog-alert--demo`}`}
      role="status"
    >
      <div className={`${prefix}-catalog-alert__badge`}>
        <span className={`${prefix}-catalog-alert__dot`} aria-hidden="true" />
        <span>{copy.badge}</span>
      </div>
      <h3 className={`${prefix}-catalog-alert__title`}>{copy.title}</h3>
      <p className={`${prefix}-catalog-alert__copy`}>{copy.message}</p>
      {error ? <pre className={`${prefix}-catalog-alert__diag`}>Error details: {error}</pre> : null}
    </div>
  );
}
