'use client';

import React, { useEffect, useState } from 'react';
import type { ClassifiedInquiryRecord } from '@sellio/types';
import { LocalFooter, LocalHeader } from '@/themes/classifieds/local/components';
import { fetchClassifiedInquiry } from '@/themes/classifieds/shared/catalog';
import {
  readClassifiedInquirySnapshot,
  type ClassifiedInquirySnapshot,
} from '@/themes/classifieds/shared/classified-inquiry-confirmation';
import { getAdminBaseUrl } from '@/lib/admin-urls';

const adminCreateClassifiedUrl = `${getAdminBaseUrl()}/admin/classifieds/create`;

interface ClassifiedInquiryConfirmationPageProps {
  inquiryId: number | string;
  themeLink: (path?: string) => string;
}

function ConfirmationSkeleton() {
  return (
    <div className="cl-inquiry-confirm">
      <div className="cl-inquiry-confirm-hero cl-inquiry-confirm-hero--loading">
        <div className="cl-shimmer-title" style={{ width: '4.5rem', height: '4.5rem', borderRadius: '999px', margin: '0 auto 1.25rem' }} />
        <div className="cl-shimmer-title" style={{ width: '180px', height: '14px', margin: '0 auto' }} />
      </div>
    </div>
  );
}

export default function ClassifiedInquiryConfirmationPage({
  inquiryId,
  themeLink,
}: ClassifiedInquiryConfirmationPageProps) {
  const [snapshot, setSnapshot] = useState<ClassifiedInquirySnapshot | null>(null);
  const [inquiry, setInquiry] = useState<ClassifiedInquiryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = readClassifiedInquirySnapshot(inquiryId);
    if (cached) {
      setSnapshot(cached);
    }

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
    if (!cached) {
      setError('Inquiry details are unavailable.');
    }
  }, [inquiryId]);

  const listingTitle =
    inquiry?.classified?.title ?? snapshot?.listingTitle ?? 'Neighborhood listing';
  const listingSlug = inquiry?.classified?.slug ?? snapshot?.listingSlug;
  const contactName = snapshot?.contactName ?? 'Guest';
  const contactEmail = snapshot?.contactEmail;
  const offerPrice = snapshot?.offerPrice;
  const message = inquiry?.message ?? snapshot?.message;
  const status = inquiry?.status ?? snapshot?.status ?? 'pending';
  const referenceId = inquiry?.id ?? snapshot?.id ?? inquiryId;

  return (
    <div className="classifieds-local-wrapper">
      <LocalHeader
        locationName="Inquiry sent"
        onLocationClick={() => undefined}
        onPostClick={() => window.open(adminCreateClassifiedUrl, '_blank', 'noopener,noreferrer')}
        homeHref={themeLink('')}
      />

      <main className="cl-inquiry-page">
        {loading ? (
          <ConfirmationSkeleton />
        ) : (
          <div className="cl-inquiry-confirm" role="status">
            <header className="cl-inquiry-confirm-hero">
              <div className="cl-inquiry-confirm-icon cl-inquiry-confirm-icon--success" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6 9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <span className="cl-inquiry-kicker">MESSAGE SENT</span>
              <h1>Your inquiry was delivered to the seller</h1>
              <p className="cl-inquiry-confirm-lead">
                The neighbor has your contact details and can reply to arrange pickup or a local meetup.
              </p>

              <div className="cl-inquiry-confirm-ref">
                <span>Reference</span>
                <strong>#{referenceId}</strong>
              </div>
            </header>

            {error && !snapshot && (
              <div className="cl-alert-slot">
                <p className="cl-form-error" role="alert">{error}</p>
              </div>
            )}

            <div className="cl-inquiry-confirm-layout">
              <section className="cl-inquiry-confirm-summary" aria-label="Inquiry summary">
                <div className="cl-inquiry-confirm-summary-head">
                  <h2>Inquiry summary</h2>
                  <span className="cl-inquiry-confirm-status">{status}</span>
                </div>

                <div className="cl-inquiry-confirm-listing">
                  <span>Listing</span>
                  <strong>{listingTitle}</strong>
                </div>

                <dl className="cl-inquiry-confirm-receipt">
                  <div>
                    <dt>Your name</dt>
                    <dd>{contactName}</dd>
                  </div>
                  {contactEmail && (
                    <div>
                      <dt>Email</dt>
                      <dd>{contactEmail}</dd>
                    </div>
                  )}
                  {offerPrice && (
                    <div>
                      <dt>Offer</dt>
                      <dd>{offerPrice}</dd>
                    </div>
                  )}
                  {message && (
                    <div>
                      <dt>Message</dt>
                      <dd>{message}</dd>
                    </div>
                  )}
                </dl>
              </section>

              <section className="cl-inquiry-confirm-actions">
                <h2>What happens next?</h2>
                <p>
                  Sellers typically respond within a day. Keep an eye on your inbox for replies about
                  pickup times and meeting locations.
                </p>
                <div className="cl-inquiry-confirm-cta-row">
                  {listingSlug && (
                    <a href={themeLink(`/product/${listingSlug}`)} className="cl-btn-post">
                      Back to listing
                    </a>
                  )}
                  <a href={themeLink('')} className="cl-product-back-link">
                    Browse neighborhood map
                  </a>
                  <a href={themeLink('/explore')} className="cl-product-back-link">
                    Explore all listings
                  </a>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      <LocalFooter />
    </div>
  );
}
