'use client';

import React from 'react';

type CatalogSyncAlertProps = {
  variant: 'demo' | 'production';
  error: string;
  classPrefix?: 'cl' | 'cg';
};

export function CatalogSyncAlert({
  variant,
  error,
  classPrefix = 'cl',
}: CatalogSyncAlertProps) {
  const isDemo = variant === 'demo';
  const prefix = classPrefix;
  const noun = classPrefix === 'cg' ? 'listings' : 'classifieds';

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
        {isDemo ? `Showing sample ${noun}` : `Unable to load ${noun}`}
      </h3>
      <p className={`${prefix}-catalog-alert__copy`}>
        {isDemo
          ? `The live classifieds API is unavailable. Sample ${noun} are shown so you can preview the theme during local setup.`
          : `${noun.charAt(0).toUpperCase()}${noun.slice(1)} are hidden because the storefront could not reach your Sellio API. Check your API URL, run migrations and seeders, and publish classified ads.`}
      </p>
      <pre className={`${prefix}-catalog-alert__diag`}>Error details: {error}</pre>
    </div>
  );
}
