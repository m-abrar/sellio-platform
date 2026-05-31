'use client';

import React from 'react';

type CatalogRegistryAlertProps = {
  variant: 'demo' | 'production';
  error: string;
};

export function CatalogRegistryAlert({ variant, error }: CatalogRegistryAlertProps) {
  const isDemo = variant === 'demo';

  return (
    <div className={`pm-registry-alert ${isDemo ? 'pm-registry-alert--demo' : 'pm-registry-alert--prod'}`}>
      <div className="pm-registry-alert__badge">
        <span className="pm-registry-alert__dot" aria-hidden="true" />
        <span className="pm-registry-alert__kicker">
          {isDemo ? 'Preview mode' : 'Connection error'}
        </span>
      </div>
      <h3 className="pm-registry-alert__title">
        {isDemo ? 'Showing sample properties' : 'Unable to load properties'}
      </h3>
      <p className="pm-registry-alert__copy">
        {isDemo
          ? 'The live property API is unavailable. Sample listings are shown so you can preview the theme during local setup.'
          : 'Listings are hidden because the storefront could not reach your Sellio API. Check your API URL, run migrations and seeders, and publish properties.'}
      </p>
      <pre className="pm-registry-alert__diag">Error details: {error}</pre>
    </div>
  );
}
