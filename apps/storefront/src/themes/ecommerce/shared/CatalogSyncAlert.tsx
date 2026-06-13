'use client';

import React from 'react';

type CatalogSyncAlertProps = {
  variant: 'demo' | 'production';
  error: string;
  classPrefix?: 'ed' | 'ecl' | 'ef' | 'el';
};

export function CatalogSyncAlert({
  variant,
  error,
  classPrefix = 'ed',
}: CatalogSyncAlertProps) {
  if (variant === 'demo') return null;

  const prefix = classPrefix;

  return (
    <div className={`${prefix}-catalog-alert ${prefix}-catalog-alert--prod`} role="status">
      <div className={`${prefix}-catalog-alert__badge`}>
        <span className={`${prefix}-catalog-alert__dot`} aria-hidden="true" />
        <span className={prefix === 'ed' ? 'ed-mono' : prefix === 'ef' ? 'ef-mono' : prefix === 'el' ? 'el-tech-font' : 'ecl-product-kicker'}>
          Connection error
        </span>
      </div>
      <h3 className={`${prefix}-catalog-alert__title`}>Products unavailable</h3>
      <p className={`${prefix}-catalog-alert__copy`}>
        Products could not be loaded. Check your API connection and make sure products are published in the admin.
      </p>
    </div>
  );
}
