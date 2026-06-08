'use client';

import React from 'react';

type CatalogSyncAlertProps = {
  variant: 'demo' | 'production';
  error: string;
  classPrefix?: 'ecc' | 'ecl' | 'evm' | 'evc' | 'eff';
};

export function CatalogSyncAlert({
  variant,
  error,
  classPrefix = 'ecc',
}: CatalogSyncAlertProps) {
  const isDemo = variant === 'demo';
  const prefix = classPrefix;

  return (
    <div
      className={`${prefix}-catalog-alert ${isDemo ? `${prefix}-catalog-alert--demo` : `${prefix}-catalog-alert--prod`}`}
      role="status"
    >
      <div className={`${prefix}-catalog-alert__badge`}>
        <span className={`${prefix}-catalog-alert__dot`} aria-hidden="true" />
        <span>{isDemo ? 'Preview mode' : 'Connection error'}</span>
      </div>
      <h3 className={`${prefix}-catalog-alert__title`}>
        {isDemo ? 'Showing sample events' : 'Unable to load events'}
      </h3>
      <p className={`${prefix}-catalog-alert__copy`}>
        {isDemo
          ? 'The live events API is unavailable. Sample listings are shown so you can preview the theme during local setup.'
          : 'Listings are hidden because the storefront could not reach your Sellio API. Check your API URL, run migrations and seeders, and publish events.'}
      </p>
      <pre className={`${prefix}-catalog-alert__diag`}>Error details: {error}</pre>
    </div>
  );
}
