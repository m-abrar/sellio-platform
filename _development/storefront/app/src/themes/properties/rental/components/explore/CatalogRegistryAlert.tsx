'use client';

import React from 'react';

type CatalogRegistryAlertProps = {
  variant: 'demo' | 'production';
  error: string;
};

export function CatalogRegistryAlert({ variant, error }: CatalogRegistryAlertProps) {
  const isDemo = variant === 'demo';

  return (
    <div className={`pr-registry-alert ${isDemo ? 'pr-registry-alert--demo' : 'pr-registry-alert--prod'}`}>
      <div className="pr-registry-alert__badge">
        <span className="pr-registry-alert__dot" aria-hidden="true" />
        <span className="pr-mono pr-registry-alert__kicker">
          {isDemo ? 'Preview mode' : 'Connection error'}
        </span>
      </div>
      <h3 className="pr-registry-alert__title">
        {isDemo ? 'Showing sample rentals' : 'Unable to load rentals'}
      </h3>
      <p className="pr-registry-alert__copy">
        {isDemo
          ? 'The live property API is unavailable. Sample listings are shown so you can preview the rental theme during local setup.'
          : 'Listings are hidden because the storefront could not reach your Sellio API. Check your API URL, run migrations and seeders, and publish rental properties.'}
      </p>
      <pre className="pr-registry-alert__diag">Error details: {error}</pre>
    </div>
  );
}
