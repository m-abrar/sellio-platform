'use client';

import React, { useState } from 'react';
import type { ClassifiedListing, JobListing, ServiceListing, Vehicle } from '@sellio/types';
import { submitVehicleInquiry } from '@/themes/autos/shared/submit-vehicle-inquiry';
import { submitClassifiedInquiry } from '@/themes/classifieds/shared/submit-inquiry';
import { submitServiceConsultation } from '@/themes/services/shared/submit-service-consultation';
import { useJobApplyFlow } from '@/themes/jobs/shared/useJobApplyFlow';
import {
  redirectToApplicationConfirmation,
  saveApplicationSnapshot,
} from '@/themes/unifieds/shared/application-confirmation';
import {
  redirectToConsultationConfirmation,
  saveConsultationSnapshot,
} from '@/themes/unifieds/shared/consultation-confirmation';
import {
  redirectToInquiryConfirmation,
  saveInquirySnapshot,
} from '@/themes/unifieds/shared/inquiry-confirmation';

type ThemeLink = (path?: string) => string;

const fieldStyle: React.CSSProperties = {
  padding: '0.85rem 1.2rem',
  border: '1px solid var(--usm-border)',
  borderRadius: '8px',
  fontFamily: 'var(--usm-font-body)',
  fontSize: '0.95rem',
  outline: 'none',
  backgroundColor: 'var(--usm-ghost)',
  width: '100%',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  color: '#111',
  display: 'block',
  marginBottom: '0.5rem',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div role="alert" style={{ color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.85rem 1.1rem', fontSize: '0.9rem' }}>
      {message}
    </div>
  );
}

function SubmitButton({ submitting, label, busyLabel }: { submitting: boolean; label: string; busyLabel: string }) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="silent-btn-primary"
      style={{ width: '100%', padding: '1rem', fontSize: '0.85rem', letterSpacing: '2px', fontWeight: 600, marginTop: '0.5rem' }}
    >
      {submitting ? busyLabel : label}
    </button>
  );
}

interface JobApplyFormProps {
  job: JobListing;
  themeLink: ThemeLink;
}

export function JobApplyForm({ job, themeLink }: JobApplyFormProps) {
  const [form, setForm] = useState({ name: '', email: '', portfolio: '', note: '' });
  const {
    user,
    authMode,
    setAuthMode,
    authPassword,
    setAuthPassword,
    authBusy,
    isSubmitting,
    formError,
    handleAuthSubmit,
    handleApplySubmit,
  } = useJobApplyFlow(job.slug, {
    onSuccess: (applicationId) => {
      saveApplicationSnapshot({
        id: applicationId,
        jobTitle: job.title,
        companyName: job.company?.name,
        applicantName: form.name,
        applicantEmail: form.email,
        status: 'pending',
      });
      redirectToApplicationConfirmation(themeLink, applicationId);
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleApplySubmit(form, {
      useFallback: false,
      storageKey: 'sellio_unified_minimal_applications',
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.company?.name,
    });
  };

  if (!user) {
    return (
      <form onSubmit={(event) => { event.preventDefault(); void handleAuthSubmit(form); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <p style={{ color: '#666', fontWeight: 300, margin: 0 }}>Sign in to apply for this role.</p>
        <FormError message={formError} />
        <Field label="Full name"><input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={fieldStyle} /></Field>
        <Field label="Email"><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={fieldStyle} /></Field>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={() => setAuthMode('login')} className="usm-btn-primary" style={{ flex: 1, background: authMode === 'login' ? undefined : 'transparent', color: authMode === 'login' ? undefined : 'var(--usm-ink)', border: authMode === 'login' ? 'none' : '1px solid var(--usm-border)' }}>Login</button>
          <button type="button" onClick={() => setAuthMode('register')} className="usm-btn-primary" style={{ flex: 1, background: authMode === 'register' ? undefined : 'transparent', color: authMode === 'register' ? undefined : 'var(--usm-ink)', border: authMode === 'register' ? 'none' : '1px solid var(--usm-border)' }}>Register</button>
        </div>
        <Field label="Password"><input required type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} style={fieldStyle} /></Field>
        <SubmitButton submitting={authBusy} label={authMode === 'login' ? 'Sign in to apply' : 'Create account & apply'} busyLabel="Please wait..." />
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <FormError message={formError} />
      <Field label="Full name"><input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={fieldStyle} /></Field>
      <Field label="Email"><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={fieldStyle} /></Field>
      <Field label="Portfolio (optional)"><input type="url" value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} style={fieldStyle} /></Field>
      <Field label="Cover note (optional)"><textarea rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} style={{ ...fieldStyle, resize: 'none' }} /></Field>
      <SubmitButton submitting={isSubmitting} label="Submit application" busyLabel="Submitting..." />
    </form>
  );
}

interface VehicleInquiryFormProps {
  vehicle: Vehicle;
  themeLink: ThemeLink;
}

export function VehicleInquiryForm({ vehicle, themeLink }: VehicleInquiryFormProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await submitVehicleInquiry({
      vehicleId: vehicle.id,
      vehicleSlug: vehicle.slug,
      useFallback: false,
      storageKey: 'sellio_unified_minimal_vehicle_inquiries',
      fullName: form.name,
      email: form.email,
      phone: form.phone || undefined,
      message: form.message || undefined,
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    saveInquirySnapshot({
      id: result.inquiryId,
      listingTitle: vehicle.title,
      contactName: form.name,
      contactEmail: form.email,
      status: 'pending',
    });
    redirectToInquiryConfirmation(themeLink, result.inquiryId);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <FormError message={error} />
      <Field label="Full name"><input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={fieldStyle} /></Field>
      <Field label="Email"><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={fieldStyle} /></Field>
      <Field label="Phone (optional)"><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={fieldStyle} /></Field>
      <Field label="Message (optional)"><textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ ...fieldStyle, resize: 'none' }} /></Field>
      <SubmitButton submitting={submitting} label="Send inquiry" busyLabel="Sending..." />
    </form>
  );
}

interface ServiceConsultationFormProps {
  service: ServiceListing;
  themeLink: ThemeLink;
}

export function ServiceConsultationForm({ service, themeLink }: ServiceConsultationFormProps) {
  const [form, setForm] = useState({ name: '', email: '', requirements: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await submitServiceConsultation({
      serviceId: service.id,
      useFallback: false,
      storageKey: 'sellio_unified_minimal_consultations',
      contactName: form.name,
      contactInfo: form.email,
      requirements: form.requirements || undefined,
      demoRecord: {},
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    saveConsultationSnapshot({
      id: result.consultationId,
      serviceTitle: service.title,
      contactName: form.name,
      contactEmail: form.email,
      status: 'pending',
    });
    redirectToConsultationConfirmation(themeLink, result.consultationId);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <FormError message={error} />
      <Field label="Full name"><input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={fieldStyle} /></Field>
      <Field label="Email"><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={fieldStyle} /></Field>
      <Field label="What do you need? (optional)"><textarea rows={3} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} style={{ ...fieldStyle, resize: 'none' }} /></Field>
      <SubmitButton submitting={submitting} label="Request consultation" busyLabel="Sending..." />
    </form>
  );
}

interface ClassifiedInquiryFormProps {
  classified: ClassifiedListing;
  themeLink: ThemeLink;
}

export function ClassifiedInquiryForm({ classified, themeLink }: ClassifiedInquiryFormProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await submitClassifiedInquiry({
      slug: classified.slug,
      fullName: form.name,
      email: form.email,
      phone: form.phone || undefined,
      message: form.message || undefined,
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    saveInquirySnapshot({
      id: result.inquiryId,
      listingTitle: classified.title,
      contactName: form.name,
      contactEmail: form.email,
      status: 'pending',
    });
    redirectToInquiryConfirmation(themeLink, result.inquiryId);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <FormError message={error} />
      <Field label="Full name"><input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={fieldStyle} /></Field>
      <Field label="Email"><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={fieldStyle} /></Field>
      <Field label="Phone (optional)"><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={fieldStyle} /></Field>
      <Field label="Message (optional)"><textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ ...fieldStyle, resize: 'none' }} /></Field>
      <SubmitButton submitting={submitting} label="Send inquiry" busyLabel="Sending..." />
    </form>
  );
}
