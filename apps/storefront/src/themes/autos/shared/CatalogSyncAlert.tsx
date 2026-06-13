'use client';

import React from 'react';

type CatalogSyncAlertProps = {
  variant: 'demo' | 'production' | 'preview-sample' | 'not-found';
  error?: string;
  classPrefix?: 'md' | 'lx' | 'ac' | 'us' | 'ev';
};

export function CatalogSyncAlert({
  variant,
  classPrefix = 'md',
}: CatalogSyncAlertProps) {
  if (variant === 'demo') return null;

  const prefix = classPrefix;

  const copy = {
    'preview-sample': {
      badge: 'Theme sample',
      title: 'Preview listing',
      message:
        'This is a demo vehicle. Browse live inventory from Explore or pick a vehicle from the homepage.',
    },
    'not-found': {
      badge: 'Not found',
      title: 'Vehicle not found',
      message:
        'This vehicle is not available in the current inventory. Use Explore to browse live listings.',
    },
    production: {
      badge: 'Connection error',
      title: 'Inventory unavailable',
      message:
        'Vehicles could not be loaded. Check your API connection and make sure listings are published in the admin.',
    },
  }[variant as 'preview-sample' | 'not-found' | 'production'];

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
    </div>
  );
}
