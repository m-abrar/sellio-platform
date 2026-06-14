'use client';

import React, { useEffect, useState } from 'react';
import { readVehicleInquirySnapshot, type VehicleInquirySnapshot } from './vehicle-inquiry-confirmation';

interface AutosInquiryConfirmationPageProps {
  inquiryId: number | string;
  themeLink: (path?: string) => string;
  classPrefix: string;
}

export default function AutosInquiryConfirmationPage({ inquiryId, themeLink, classPrefix: _ }: AutosInquiryConfirmationPageProps) {
  const [snapshot, setSnapshot] = useState<VehicleInquirySnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = readVehicleInquirySnapshot(inquiryId);
    setSnapshot(cached);
    setLoading(false);
  }, [inquiryId]);

  const vehicleTitle = snapshot?.vehicleTitle ?? 'Vehicle';
  const contactName = snapshot?.contactName ?? 'Guest';
  const referenceId = snapshot?.id ?? inquiryId;
  const status = snapshot?.status ?? 'pending';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '4rem 1.5rem', fontFamily: 'inherit' }}>
      {loading ? (
        <p style={{ color: '#666' }}>Loading...</p>
      ) : (
        <div style={{ maxWidth: '600px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: 'white' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#22c55e', margin: '0 0 0.5rem' }}>INQUIRY SENT</p>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.75rem' }}>Your inquiry was received</h1>
            <p style={{ color: '#666', margin: 0 }}>The dealer has your contact details and will follow up soon.</p>
          </div>
          <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 600 }}>Reference</span>
              <span>#{referenceId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 600 }}>Vehicle</span>
              <span>{vehicleTitle}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 600 }}>Your name</span>
              <span>{contactName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600 }}>Status</span>
              <span style={{ textTransform: 'capitalize' }}>{status}</span>
            </div>
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>What happens next?</h2>
            <p style={{ color: '#555', lineHeight: 1.6 }}>The dealer will typically respond within 24 hours to arrange a viewing or answer your questions.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href={themeLink('/explore')} style={{ padding: '0.75rem 1.5rem', background: '#111', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>Browse More Vehicles</a>
            <a href={themeLink('/')} style={{ padding: '0.75rem 1.5rem', border: '1px solid #ddd', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', color: '#111' }}>Go to Home</a>
          </div>
        </div>
      )}
    </div>
  );
}
