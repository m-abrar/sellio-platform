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
      storageKey: 'sellio_unified_default_applications',
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.company?.name,
    });
  };

  if (!user) {
    return (
      <form className="ud-inquiry-form" onSubmit={(event) => { event.preventDefault(); void handleAuthSubmit(form); }}>
        <p className="ud-inquiry-form-hint">Sign in to apply for this role.</p>
        {formError && <div className="ud-inquiry-form-error" role="alert">{formError}</div>}
        <label>Full name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <div className="ud-inquiry-form-toggle">
          <button type="button" className={authMode === 'login' ? 'is-active' : ''} onClick={() => setAuthMode('login')}>Login</button>
          <button type="button" className={authMode === 'register' ? 'is-active' : ''} onClick={() => setAuthMode('register')}>Register</button>
        </div>
        <label>Password<input required type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} /></label>
        <button type="submit" className="core-btn-primary ud-detail-action" disabled={authBusy}>
          {authBusy ? 'Please wait...' : authMode === 'login' ? 'Sign in to apply' : 'Create account & apply'}
        </button>
      </form>
    );
  }

  return (
    <form className="ud-inquiry-form" onSubmit={handleSubmit}>
      {formError && <div className="ud-inquiry-form-error" role="alert">{formError}</div>}
      <label>Full name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Portfolio (optional)<input type="url" value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} /></label>
      <label>Cover note (optional)<textarea rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label>
      <button type="submit" className="core-btn-primary ud-detail-action" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit application'}
      </button>
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
      storageKey: 'sellio_unified_default_vehicle_inquiries',
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
    <form className="ud-inquiry-form" onSubmit={handleSubmit}>
      {error && <div className="ud-inquiry-form-error" role="alert">{error}</div>}
      <label>Full name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Phone (optional)<input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
      <label>Message (optional)<textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
      <button type="submit" className="core-btn-primary ud-detail-action" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send inquiry'}
      </button>
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
      storageKey: 'sellio_unified_default_consultations',
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
    <form className="ud-inquiry-form" onSubmit={handleSubmit}>
      {error && <div className="ud-inquiry-form-error" role="alert">{error}</div>}
      <label>Full name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>What do you need? (optional)<textarea rows={3} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} /></label>
      <button type="submit" className="core-btn-primary ud-detail-action" disabled={submitting}>
        {submitting ? 'Sending...' : 'Request consultation'}
      </button>
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
    <form className="ud-inquiry-form" onSubmit={handleSubmit}>
      {error && <div className="ud-inquiry-form-error" role="alert">{error}</div>}
      <label>Full name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Phone (optional)<input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
      <label>Message (optional)<textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
      <button type="submit" className="core-btn-primary ud-detail-action" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send inquiry'}
      </button>
    </form>
  );
}
