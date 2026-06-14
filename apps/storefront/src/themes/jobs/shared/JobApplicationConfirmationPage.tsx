'use client';

import React, { useEffect, useState } from 'react';
import {
  readJobApplicationSnapshot,
  type JobApplicationSnapshot,
} from '@/themes/jobs/shared/job-application-confirmation';

interface JobApplicationConfirmationPageProps {
  applicationId: number | string;
  themeLink: (path?: string) => string;
  classPrefix: string;
}

export default function JobApplicationConfirmationPage({
  applicationId,
  themeLink,
}: JobApplicationConfirmationPageProps) {
  const [snapshot, setSnapshot] = useState<JobApplicationSnapshot | null>(null);

  useEffect(() => {
    const cached = readJobApplicationSnapshot(applicationId);
    setSnapshot(cached);
  }, [applicationId]);

  const jobTitle = snapshot?.jobTitle ?? 'Job Application';
  const applicantName = snapshot?.applicantName ?? 'Applicant';
  const applicantEmail = snapshot?.applicantEmail;
  const status = snapshot?.status ?? 'pending';
  const referenceId = snapshot?.id ?? applicationId;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        background: '#f9fafb',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          padding: '3rem 2.5rem',
          maxWidth: '560px',
          width: '100%',
          textAlign: 'center',
        }}
        role="status"
        aria-live="polite"
      >
        {/* Checkmark icon */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: '#d1fae5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
          aria-hidden="true"
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6 9 17l-5-5"
              stroke="#059669"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#059669',
            marginBottom: '0.5rem',
          }}
        >
          Application Submitted
        </p>
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#111827',
            margin: '0 0 0.75rem',
          }}
        >
          You&apos;re in the pipeline!
        </h1>
        <p
          style={{
            color: '#6b7280',
            fontSize: '1rem',
            lineHeight: 1.6,
            marginBottom: '2rem',
          }}
        >
          Your application has been received. The hiring team will review your details and follow up
          by email.
        </p>

        {/* Summary card */}
        <div
          style={{
            background: '#f3f4f6',
            borderRadius: '10px',
            padding: '1.5rem',
            textAlign: 'left',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>
              Reference
            </span>
            <strong style={{ fontSize: '0.9rem', color: '#111827' }}>#{referenceId}</strong>
          </div>

          <dl style={{ margin: 0 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
              }}
            >
              <dt style={{ fontSize: '0.85rem', color: '#6b7280' }}>Position</dt>
              <dd style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                {jobTitle}
              </dd>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: applicantEmail ? '0.75rem' : 0,
              }}
            >
              <dt style={{ fontSize: '0.85rem', color: '#6b7280' }}>Applicant</dt>
              <dd style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                {applicantName}
              </dd>
            </div>
            {applicantEmail && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <dt style={{ fontSize: '0.85rem', color: '#6b7280' }}>Email</dt>
                <dd style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                  {applicantEmail}
                </dd>
              </div>
            )}
          </dl>

          <div
            style={{
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Status</span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: '#d1fae5',
                color: '#065f46',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
              }}
            >
              {status}
            </span>
          </div>
        </div>

        {/* What happens next */}
        <div
          style={{
            textAlign: 'left',
            marginBottom: '2rem',
          }}
        >
          <h2
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#111827',
              marginBottom: '0.5rem',
            }}
          >
            What happens next?
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
            The hiring team typically reviews applications within a few business days. Keep an eye
            on your inbox — they&apos;ll reach out to arrange next steps if your profile is a good
            fit.
          </p>
        </div>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <a
            href={themeLink('/explore')}
            style={{
              display: 'block',
              padding: '0.85rem 1.5rem',
              background: '#111827',
              color: '#ffffff',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            Browse More Jobs
          </a>
          <a
            href={themeLink('/')}
            style={{
              display: 'block',
              padding: '0.85rem 1.5rem',
              background: 'transparent',
              color: '#374151',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
              textAlign: 'center',
              border: '1px solid #d1d5db',
            }}
          >
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
}
