'use client';

import React from 'react';

type CatalogSyncAlertProps = {
  error: string;
};

export function CatalogSyncAlert(_props: CatalogSyncAlertProps) {
  return (
    <div className="pv-catalog-alert pv-catalog-alert--prod" role="status">
      <div className="pv-catalog-alert__badge">
        <span className="pv-catalog-alert__dot" aria-hidden="true" />
        <span className="pv-mono">Connection error</span>
      </div>
      <h3 className="pv-catalog-alert__title">Properties unavailable</h3>
      <p className="pv-catalog-alert__copy">
        Properties could not be loaded. Check your API connection and make sure listings are published in the admin.
      </p>
    </div>
  );
}
