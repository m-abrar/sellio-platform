'use client';

import React from 'react';

type CatalogRegistryAlertProps = {
  variant: 'demo' | 'production';
  error: string;
};

export function CatalogRegistryAlert({ variant }: CatalogRegistryAlertProps) {
  if (variant === 'demo') return null;

  return (
    <div className="pr-registry-alert pr-registry-alert--prod">
      <div className="pr-registry-alert__badge">
        <span className="pr-registry-alert__dot" aria-hidden="true" />
        <span className="pr-mono pr-registry-alert__kicker">Connection error</span>
      </div>
      <h3 className="pr-registry-alert__title">Unable to load rentals</h3>
      <p className="pr-registry-alert__copy">
        Rental listings could not be loaded. Check your API connection and make sure properties are published in the admin.
      </p>
    </div>
  );
}
