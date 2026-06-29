'use client';

import React, { useState } from 'react';
import type { ClassifiedListing, EventListing, JobListing, Property, ServiceListing, Vehicle } from '@/types';
import { redirectToPropertyBookingReserve } from '@/themes/properties/shared/property-booking-utils';
import { redirectToEventBookingReserve } from '@/themes/events/shared/event-booking-utils';
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

interface PropertyBookingFormProps {
  property: Property;
  themeLink: ThemeLink;
}

export function PropertyBookingForm({ property, themeLink }: PropertyBookingFormProps) {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [form, setForm] = useState({ name: '', email: '', checkIn: today, checkOut: tomorrow, guests: '2' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.checkIn || !form.checkOut) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.checkOut <= form.checkIn) {
      setError('Check-out must be after check-in.');
      return;
    }
    setError(null);
    redirectToPropertyBookingReserve(themeLink, {
      propertyId: property.id,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      guests: Number(form.guests) || 2,
      fullName: form.name,
      email: form.email,
    });
  };

  return (
    <form className="ud-inquiry-form" onSubmit={handleSubmit}>
      {error && <div className="ud-inquiry-form-error" role="alert">{error}</div>}
      <label>Full name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Check-in<input required type="date" min={today} value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} /></label>
      <label>Check-out<input required type="date" min={form.checkIn || today} value={form.checkOut} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} /></label>
      <label>Guests<input required type="number" min="1" max="20" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} /></label>
      <button type="submit" className="core-btn-primary ud-detail-action">
        Reserve now
      </button>
    </form>
  );
}

interface EventBookingFormProps {
  event: EventListing;
  themeLink: ThemeLink;
}

export function EventBookingForm({ event, themeLink }: EventBookingFormProps) {
  const ticketData = event.ticket_data;
  const firstEntry = ticketData ? Object.entries(ticketData)[0] : null;
  const firstOccurrenceId = firstEntry ? Number(firstEntry[0]) : null;
  const firstOccurrence = firstEntry ? firstEntry[1] : null;
  const firstTicketType = firstOccurrence?.inventory?.[0] ?? null;

  const [form, setForm] = useState({ name: '', email: '', quantity: '1' });
  const [error, setError] = useState<string | null>(null);

  if (!firstOccurrenceId || !firstTicketType) {
    return (
      <a href={themeLink('/explore?vertical=events')} className="core-btn-primary ud-detail-action">
        Browse events
      </a>
    );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError('Please fill in your name and email.');
      return;
    }
    setError(null);
    redirectToEventBookingReserve(themeLink, {
      eventId: event.id,
      occurrenceId: firstOccurrenceId,
      ticketTypeId: firstTicketType.id,
      quantity: Number(form.quantity) || 1,
      fullName: form.name,
      email: form.email,
    });
  };

  return (
    <form className="ud-inquiry-form" onSubmit={handleSubmit}>
      {error && <div className="ud-inquiry-form-error" role="alert">{error}</div>}
      {firstOccurrence?.start_date_formatted && (
        <p className="ud-inquiry-form-hint">{firstOccurrence.start_date_formatted}</p>
      )}
      <label>Full name<input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Tickets
        <input required type="number" min="1" max={firstTicketType.available ?? 10} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
      </label>
      <button type="submit" className="core-btn-primary ud-detail-action">
        Reserve tickets
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
