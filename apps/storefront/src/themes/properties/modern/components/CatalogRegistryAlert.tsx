'use client';

import React from 'react';

type CatalogRegistryAlertProps = {
  variant: 'demo' | 'production';
  error: string;
};

export function CatalogRegistryAlert({ variant }: CatalogRegistryAlertProps) {
  if (variant === 'demo') return null;

  return (
    <div className="pm-registry-alert pm-registry-alert--prod">
      <div className="pm-registry-alert__badge">
        <span className="pm-registry-alert__dot" aria-hidden="true" />
        <span className="pm-registry-alert__kicker">Connection error</span>
      </div>
      <h3 className="pm-registry-alert__title">Unable to load properties</h3>
      <p className="pm-registry-alert__copy">
        Listings could not be loaded. Check your API connection and make sure properties are published in the admin.
      </p>
    </div>
  );
}
