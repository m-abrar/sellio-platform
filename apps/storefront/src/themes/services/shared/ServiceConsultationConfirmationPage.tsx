'use client';

import React, { useEffect, useState } from 'react';
import type { ServiceConsultationRecord } from '@/types';
import { fetchServiceConsultation } from '@/themes/services/shared/catalog';
import {
  formatConsultationDate,
  readServiceConsultationSnapshot,
  type ServiceConsultationSnapshot,
} from '@/themes/services/shared/service-consultation-confirmation';

export type ServiceConsultationPrefix = 'sm' | 'sc' | 'crtv' | 'sh' | 'local';

interface ServiceConsultationConfirmationPageProps {
  consultationId: number | string;
  classPrefix: ServiceConsultationPrefix;
  themeLink: (path?: string) => string;
}

function cls(prefix: string, suffix: string) {
  return `${prefix}-${suffix}`;
}

function ConfirmationSkeleton({ prefix }: { prefix: string }) {
  return (
    <div className={cls(prefix, 'consultation-confirm')}>
      <div className={`${cls(prefix, 'consultation-confirm-hero')} ${cls(prefix, 'consultation-confirm-hero--loading')}`}>
        <div className="sm-skeleton" style={{ width: '4.5rem', height: '4.5rem', borderRadius: '999px', margin: '0 auto 1.25rem' }} />
        <div className="sm-skeleton" style={{ width: '180px', height: '14px', margin: '0 auto' }} />
        <div className="sm-skeleton" style={{ width: 'min(420px, 90%)', height: '42px', margin: '1rem auto 0.75rem' }} />
      </div>
    </div>
  );
}

export default function ServiceConsultationConfirmationPage({
  consultationId,
  classPrefix: prefix,
  themeLink,
}: ServiceConsultationConfirmationPageProps) {
  const [snapshot, setSnapshot] = useState<ServiceConsultationSnapshot | null>(null);
  const [consultation, setConsultation] = useState<ServiceConsultationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = readServiceConsultationSnapshot(consultationId);
    if (cached) {
      setSnapshot(cached);
    }

    const numericId = Number(consultationId);
    if (!Number.isNaN(numericId) && numericId > 0) {
      fetchServiceConsultation(numericId)
        .then((result) => {
          if (result.ok) {
            setConsultation(result.consultation);
            setError(null);
          } else if (!cached) {
            setError(result.error);
          }
        })
        .finally(() => setLoading(false));
      return;
    }

    setLoading(false);
    if (!cached) {
      setError('Booking details are unavailable.');
    }
  }, [consultationId]);

  if (loading) {
    return (
      <main className={cls(prefix, 'consultation-page')}>
        <ConfirmationSkeleton prefix={prefix} />
      </main>
    );
  }

  const serviceTitle = consultation?.service?.title ?? snapshot?.serviceTitle ?? 'Service provider';
  const serviceSlug = consultation?.service?.slug ?? snapshot?.serviceSlug;
  const contactName = consultation?.name ?? snapshot?.contactName ?? 'Guest';
  const contactEmail = consultation?.email ?? snapshot?.contactInfo;
  const preferredDate = consultation?.scheduled_at ?? snapshot?.preferredDate ?? null;
  const requirements = consultation?.notes ?? snapshot?.requirements;
  const topic = consultation?.topic ?? snapshot?.topic;
  const status = consultation?.status ?? snapshot?.status ?? 'pending';
  const referenceId = consultation?.id ?? snapshot?.id ?? consultationId;
  const isDemo = snapshot?.demo === true;

  return (
    <main className={cls(prefix, 'consultation-page')}>
      <div className={cls(prefix, 'consultation-confirm')} role="status">
        <header className={cls(prefix, 'consultation-confirm-hero')}>
          <div className={`${cls(prefix, 'consultation-confirm-icon')} ${cls(prefix, 'consultation-confirm-icon--success')}`} aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <span className={cls(prefix, 'consultation-kicker')}>REQUEST RECEIVED</span>
          <h1>Your booking request was sent</h1>
          <p className={cls(prefix, 'consultation-confirm-lead')}>
            {isDemo
              ? 'Demo mode saved your request locally. On a live storefront, the provider receives this instantly.'
              : 'The provider has your details and will follow up to confirm availability and next steps.'}
          </p>

          <div className={cls(prefix, 'consultation-confirm-ref')}>
            <span>Reference</span>
            <strong>#{referenceId}</strong>
          </div>
        </header>

        <div className={cls(prefix, 'consultation-confirm-layout')}>
          <section className={cls(prefix, 'consultation-confirm-summary')} aria-label="Request summary">
            <div className={cls(prefix, 'consultation-confirm-summary-head')}>
              <h2>Request summary</h2>
              <span className={cls(prefix, 'consultation-confirm-status')}>{status}</span>
            </div>

            <div className={cls(prefix, 'consultation-confirm-service')}>
              <div>
                <span className={cls(prefix, 'consultation-kicker')}>Provider</span>
                <strong>{serviceTitle}</strong>
              </div>
            </div>

            <dl className={cls(prefix, 'consultation-confirm-receipt')}>
              <div>
                <dt>Contact name</dt>
                <dd>{contactName}</dd>
              </div>
              {contactEmail && (
                <div>
                  <dt>Contact</dt>
                  <dd>{contactEmail}</dd>
                </div>
              )}
              <div>
                <dt>Preferred date</dt>
                <dd>{formatConsultationDate(preferredDate)}</dd>
              </div>
              {topic && (
                <div>
                  <dt>Request type</dt>
                  <dd>{topic}</dd>
                </div>
              )}
              {requirements && (
                <div>
                  <dt>Requirements</dt>
                  <dd>{requirements}</dd>
                </div>
              )}
            </dl>

            {error && <p className={cls(prefix, 'consultation-error')}>{error}</p>}
          </section>

          <aside className={cls(prefix, 'consultation-confirm-actions')} aria-label="Next steps">
            <h2>What&apos;s next</h2>
            <p>
              Keep your reference number handy. The provider may reach out by email or phone to finalize scheduling.
            </p>

            <a href={themeLink('/explore')} className={`sm-btn sm-btn-primary ${cls(prefix, 'consultation-confirm-cta')}`}>
              Browse more providers
            </a>

            {serviceSlug && (
              <a href={themeLink(`/product/${serviceSlug}`)} className={`sm-btn sm-btn-outline ${cls(prefix, 'consultation-confirm-cta')}`}>
                Back to provider profile
              </a>
            )}

            <a href={themeLink('/')} className={`sm-btn sm-btn-outline ${cls(prefix, 'consultation-confirm-cta')}`}>
              Return to marketplace
            </a>
          </aside>
        </div>
      </div>
    </main>
  );
}
