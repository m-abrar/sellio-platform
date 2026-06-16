'use client';

import React, { useEffect, useState } from 'react';
import { readInquirySnapshot, type InquirySnapshot } from '@/themes/unifieds/shared/inquiry-confirmation';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import './subpages.css';

interface UnifiedInquiryConfirmationPageProps {
  inquiryId: number | string;
  primaryButtonClass?: string;
}

export default function UnifiedInquiryConfirmationPage({
  inquiryId,
  primaryButtonClass = 'uni-btn-primary',
}: UnifiedInquiryConfirmationPageProps) {
  const themeLink = useUnifiedThemeLink();
  const [snapshot, setSnapshot] = useState<InquirySnapshot | null>(null);

  useEffect(() => {
    setSnapshot(readInquirySnapshot(inquiryId));
  }, [inquiryId]);

  return (
    <main className="uni-cart-page">
      <section className="uni-cart-state" role="status">
        <div className="uni-mono" style={{ color: '#16a34a', marginBottom: '1rem' }}>Inquiry sent</div>
        <h1>Your inquiry has been received</h1>
        <p>The seller has your contact details and will follow up soon.</p>
        <p><strong>Reference:</strong> #{snapshot?.id ?? inquiryId}</p>
        {snapshot?.listingTitle && <p><strong>Listing:</strong> {snapshot.listingTitle}</p>}
        {snapshot?.contactName && <p><strong>Your name:</strong> {snapshot.contactName}</p>}
        <a href={themeLink('/explore')} className={primaryButtonClass}>Browse the catalog</a>
      </section>
    </main>
  );
}
