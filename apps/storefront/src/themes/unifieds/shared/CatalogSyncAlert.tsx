'use client';

import React from 'react';

type CatalogSyncAlertProps = {
  error: string;
};

export function CatalogSyncAlert(_props: CatalogSyncAlertProps) {
  return (
    <div className="ud-catalog-alert ud-catalog-alert--prod" role="status">
      <div className="ud-catalog-alert__badge">
        <span className="ud-catalog-alert__dot" aria-hidden="true" />
        <span className="ud-mono">Connection error</span>
      </div>
      <h3 className="ud-catalog-alert__title">Listings unavailable</h3>
      <p className="ud-catalog-alert__copy">
        Listings could not be loaded. Check your API connection and make sure products are published in the admin.
      </p>
    </div>
  );
}
