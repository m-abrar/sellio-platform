'use client';

import React from 'react';

type CatalogSyncAlertProps = {
  variant: 'demo' | 'production';
  error: string;
  classPrefix?: 'ecc' | 'ecl' | 'evm' | 'evc' | 'eff';
};

export function CatalogSyncAlert({
  variant,
  classPrefix = 'ecc',
}: CatalogSyncAlertProps) {
  if (variant === 'demo') return null;

  const prefix = classPrefix;

  return (
    <div className={`${prefix}-catalog-alert ${prefix}-catalog-alert--prod`} role="status">
      <div className={`${prefix}-catalog-alert__badge`}>
        <span className={`${prefix}-catalog-alert__dot`} aria-hidden="true" />
        <span>Connection error</span>
      </div>
      <h3 className={`${prefix}-catalog-alert__title`}>Events unavailable</h3>
      <p className={`${prefix}-catalog-alert__copy`}>
        Events could not be loaded. Check your API connection and make sure events are published in the admin.
      </p>
    </div>
  );
}
