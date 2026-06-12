'use client';

import React from 'react';

type CatalogSyncAlertProps = {
  error: string;
};

export function CatalogSyncAlert({ error }: CatalogSyncAlertProps) {
  return (
    <div className="ud-catalog-alert ud-catalog-alert--prod" role="status">
      <div className="ud-catalog-alert__badge">
        <span className="ud-catalog-alert__dot" aria-hidden="true" />
        <span className="ud-mono">Connection error</span>
      </div>
      <h3 className="ud-catalog-alert__title">Unable to load catalog records</h3>
      <p className="ud-catalog-alert__copy">
        Listings are hidden because the storefront could not reach your Sellio API. Check your API
        URL, run migrations and seeders, and publish products.
      </p>
      <pre className="ud-catalog-alert__diag">Error details: {error}</pre>
    </div>
  );
}
