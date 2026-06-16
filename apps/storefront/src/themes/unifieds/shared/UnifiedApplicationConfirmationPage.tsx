'use client';

import React, { useEffect, useState } from 'react';
import { readApplicationSnapshot, type ApplicationSnapshot } from '@/themes/unifieds/shared/application-confirmation';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import './subpages.css';

interface UnifiedApplicationConfirmationPageProps {
  applicationId: number | string;
  primaryButtonClass?: string;
}

export default function UnifiedApplicationConfirmationPage({
  applicationId,
  primaryButtonClass = 'uni-btn-primary',
}: UnifiedApplicationConfirmationPageProps) {
  const themeLink = useUnifiedThemeLink();
  const [snapshot, setSnapshot] = useState<ApplicationSnapshot | null>(null);

  useEffect(() => {
    setSnapshot(readApplicationSnapshot(applicationId));
  }, [applicationId]);

  return (
    <main className="uni-cart-page">
      <section className="uni-cart-state" role="status">
        <div className="uni-mono" style={{ color: '#16a34a', marginBottom: '1rem' }}>Application submitted</div>
        <h1>Your application has been sent</h1>
        <p>The hiring team has your application and will follow up if you're a fit.</p>
        <p><strong>Reference:</strong> #{snapshot?.id ?? applicationId}</p>
        {snapshot?.jobTitle && <p><strong>Role:</strong> {snapshot.jobTitle}</p>}
        {snapshot?.companyName && <p><strong>Company:</strong> {snapshot.companyName}</p>}
        <a href={themeLink('/explore')} className={primaryButtonClass}>Browse more jobs</a>
      </section>
    </main>
  );
}
