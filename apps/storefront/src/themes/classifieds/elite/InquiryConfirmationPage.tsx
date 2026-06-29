'use client';

import React, { useEffect, useState } from 'react';
import type { ClassifiedInquiryRecord } from '@/types';
import { fetchClassifiedInquiry } from '@/themes/classifieds/shared/catalog';
import {
  readClassifiedInquirySnapshot,
  type ClassifiedInquirySnapshot,
} from '@/themes/classifieds/shared/classified-inquiry-confirmation';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';

interface InquiryConfirmationPageProps {
  inquiryId: number | string;
}

export default function InquiryConfirmationPage({ inquiryId }: InquiryConfirmationPageProps) {
  const themeLink = useClassifiedsThemeLink();
  const [snapshot, setSnapshot] = useState<ClassifiedInquirySnapshot | null>(null);
  const [inquiry, setInquiry] = useState<ClassifiedInquiryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = readClassifiedInquirySnapshot(inquiryId);
    if (cached) setSnapshot(cached);

    const numericId = Number(inquiryId);
    if (!Number.isNaN(numericId) && numericId > 0) {
      fetchClassifiedInquiry(numericId)
        .then((result) => {
          if (result.ok) {
            setInquiry(result.inquiry);
            setError(null);
          } else if (!cached) {
            setError(result.error);
          }
        })
        .finally(() => setLoading(false));
      return;
    }

    setLoading(false);
    if (!cached) setError('Inquiry details are unavailable.');
  }, [inquiryId]);

  const listingTitle = inquiry?.classified?.title ?? snapshot?.listingTitle ?? 'Private Vault Listing';
  const listingSlug = inquiry?.classified?.slug ?? snapshot?.listingSlug;
  const contactName = snapshot?.contactName ?? 'Distinguished Member';
  const contactEmail = snapshot?.contactEmail;
  const offerPrice = snapshot?.offerPrice;
  const message = inquiry?.message ?? snapshot?.message;
  const status = inquiry?.status ?? snapshot?.status ?? 'pending';
  const referenceId = inquiry?.id ?? snapshot?.id ?? inquiryId;

  if (loading) {
    return (
      <div className="ce-static-page" style={{ maxWidth: '720px' }}>
        <div className="elite-shimmer" style={{ height: '80px', borderRadius: '8px', marginBottom: '1.5rem' }} />
        <div className="elite-shimmer" style={{ height: '300px', borderRadius: '12px' }} />
      </div>
    );
  }

  return (
    <div className="ce-static-page" style={{ maxWidth: '720px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'rgba(212,175,55,0.1)',
          border: '2px solid var(--prem-accent)',
          color: 'var(--prem-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="ce-static-kicker">Prospectus Delivered</div>
        <h1 style={{ fontFamily: 'var(--prem-serif)', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--prem-text)', margin: '0.5rem 0 1rem' }}>
          Your inquiry has been dispatched
        </h1>
        <p style={{ color: 'var(--prem-muted)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
          The vault custodian has received your prospectus request. Expect a response within one to two business days.
        </p>
      </div>

      {error && !snapshot && (
        <div className="ce-form-error" style={{ marginBottom: '1.5rem' }} role="alert">{error}</div>
      )}

      <div style={{ background: 'var(--prem-card)', border: '1px solid var(--prem-border)', borderRadius: '16px', overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ background: 'rgba(212,175,55,0.05)', borderBottom: '1px solid var(--prem-border)', padding: '1.25rem 1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'var(--prem-serif)', fontSize: '1rem', fontWeight: 700, color: 'var(--prem-text)', margin: 0 }}>Inquiry Summary</h2>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--prem-accent)', letterSpacing: '2px', textTransform: 'uppercase', background: 'rgba(212,175,55,0.1)', padding: '0.3rem 0.75rem', borderRadius: '4px' }}>{status}</span>
        </div>

        <dl style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.1rem', margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <dt style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--prem-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Reference</dt>
            <dd style={{ fontFamily: 'monospace', color: 'var(--prem-accent)', fontWeight: 700, margin: 0 }}>#{referenceId}</dd>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <dt style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--prem-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Vault Asset</dt>
            <dd style={{ color: 'var(--prem-text)', fontWeight: 600, margin: 0, textAlign: 'right' }}>{listingTitle}</dd>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <dt style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--prem-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Investor</dt>
            <dd style={{ color: 'var(--prem-text)', fontWeight: 600, margin: 0 }}>{contactName}</dd>
          </div>
          {contactEmail && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <dt style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--prem-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</dt>
              <dd style={{ color: 'var(--prem-text)', fontWeight: 600, margin: 0 }}>{contactEmail}</dd>
            </div>
          )}
          {offerPrice && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <dt style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--prem-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Proposed Offer</dt>
              <dd style={{ color: 'var(--prem-accent)', fontFamily: 'var(--prem-serif)', fontWeight: 700, margin: 0 }}>{offerPrice}</dd>
            </div>
          )}
          {message && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <dt style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--prem-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Advisory Notes</dt>
              <dd style={{ color: 'var(--prem-muted)', fontSize: '0.87rem', lineHeight: 1.6, margin: 0 }}>{message}</dd>
            </div>
          )}
        </dl>
      </div>

      <div style={{ background: 'var(--prem-card)', border: '1px solid var(--prem-border)', borderRadius: '12px', padding: '1.75rem' }}>
        <h3 style={{ fontFamily: 'var(--prem-serif)', fontSize: '1rem', fontWeight: 700, color: 'var(--prem-text)', marginBottom: '0.6rem' }}>What happens next?</h3>
        <p style={{ color: 'var(--prem-muted)', fontSize: '0.87rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          The vault custodian will review your credentials and contact you via the email provided. If your offer aligns with the reserve, they will arrange a private viewing or transfer protocol.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          {listingSlug && (
            <a href={themeLink(`/product/${listingSlug}`)} className="elite-modal-cta" style={{ textDecoration: 'none', fontSize: '0.82rem' }}>
              Return to listing
            </a>
          )}
          <a href={themeLink('/')} style={{ textDecoration: 'none', fontSize: '0.82rem', color: 'var(--prem-accent)', fontWeight: 700 }}>
            Browse catalog
          </a>
        </div>
      </div>
    </div>
  );
}
