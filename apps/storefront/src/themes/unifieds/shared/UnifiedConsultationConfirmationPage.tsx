'use client';

import React, { useEffect, useState } from 'react';
import { readConsultationSnapshot, type ConsultationSnapshot } from '@/themes/unifieds/shared/consultation-confirmation';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import './subpages.css';

interface UnifiedConsultationConfirmationPageProps {
  consultationId: number | string;
  primaryButtonClass?: string;
}

export default function UnifiedConsultationConfirmationPage({
  consultationId,
  primaryButtonClass = 'uni-btn-primary',
}: UnifiedConsultationConfirmationPageProps) {
  const themeLink = useUnifiedThemeLink();
  const [snapshot, setSnapshot] = useState<ConsultationSnapshot | null>(null);

  useEffect(() => {
    setSnapshot(readConsultationSnapshot(consultationId));
  }, [consultationId]);

  return (
    <main className="uni-cart-page">
      <section className="uni-cart-state" role="status">
        <div className="uni-mono" style={{ color: '#16a34a', marginBottom: '1rem' }}>Consultation requested</div>
        <h1>Your consultation request has been sent</h1>
        <p>The provider has your details and will reach out to confirm a time.</p>
        <p><strong>Reference:</strong> #{snapshot?.id ?? consultationId}</p>
        {snapshot?.serviceTitle && <p><strong>Service:</strong> {snapshot.serviceTitle}</p>}
        <a href={themeLink('/explore')} className={primaryButtonClass}>Browse more services</a>
      </section>
    </main>
  );
}
