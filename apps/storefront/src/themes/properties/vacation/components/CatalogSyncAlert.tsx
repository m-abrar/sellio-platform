'use client';

import React from 'react';

type CatalogSyncAlertProps = {
  error: string;
};

export function CatalogSyncAlert({ error }: CatalogSyncAlertProps) {
  return (
    <div className="pv-catalog-alert pv-catalog-alert--prod" role="status">
      <div className="pv-catalog-alert__badge">
        <span className="pv-catalog-alert__dot" aria-hidden="true" />
        <span className="pv-mono">Connection error</span>
      </div>
      <h3 className="pv-catalog-alert__title">Unable to load vacation retreats</h3>
      <p className="pv-catalog-alert__copy">
        Listings are hidden because the storefront could not reach your Sellio API. Check your API
        URL, run migrations and seeders, and publish rental or vacation properties.
      </p>
      <pre className="pv-catalog-alert__diag">Error details: {error}</pre>
    </div>
  );
}
