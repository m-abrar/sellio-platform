'use client';

import React from 'react';
import type { ListingMode } from '../listing-mode';

interface ProductInquirySectionProps {
  listingMode: ListingMode;
  isSubmitted: boolean;
  form: { name: string; email: string; message: string };
  formErrors: { name?: string; email?: string };
  checkIn: string;
  checkOut: string;
  estimation: { total_nights: number; estimated_lodging_total: string } | null;
  estimatingPrice: boolean;
  onFormChange: (form: { name: string; email: string; message: string }) => void;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const COPY = {
  rental: {
    kicker: 'Reservations',
    title: 'Book your stay',
    description:
      'Choose your dates and send a message to the host. They will confirm availability and reply with next steps.',
    placeholder:
      'Number of guests, arrival time, or any questions about the property.',
    submit: 'Send booking inquiry',
    success:
      'Thank you. Your stay inquiry has been sent. The host will confirm availability and contact you shortly.',
  },
  sale: {
    kicker: 'Contact',
    title: 'Schedule a showing',
    description:
      'Tell the listing agent when you would like to tour this property. They will follow up to confirm a time.',
    placeholder:
      'Preferred showing times, financing questions, or other details about your interest.',
    submit: 'Send inquiry',
    success:
      'Thank you. Your showing request has been sent. The listing agent will contact you using the details you provided.',
  },
} as const;

export function ProductInquirySection({
  listingMode,
  isSubmitted,
  form,
  formErrors,
  checkIn,
  checkOut,
  estimation,
  estimatingPrice,
  onFormChange,
  onCheckInChange,
  onCheckOutChange,
  onSubmit,
}: ProductInquirySectionProps) {
  const copy = COPY[listingMode];

  return (
    <section
      id="pm-inquiry"
      className={`pm-inquiry-section pm-inquiry-section--${listingMode}`}
      aria-labelledby="pm-inquiry-title"
    >
      <div className="pm-inquiry-glass">
        <div className="pm-inquiry-intro">
          <div className="urban-detail-kicker">{copy.kicker}</div>
          <h2 id="pm-inquiry-title" className="pm-inquiry-title">
            {copy.title}
          </h2>
          <p className="pm-inquiry-copy">{copy.description}</p>
          {listingMode === 'rental' && estimation && (
            <div className="pm-stay-estimate" role="status">
              <span className="pm-stay-estimate__label">Stay estimate</span>
              <span className="pm-stay-estimate__value">
                {estimatingPrice
                  ? 'Calculating rates...'
                  : `${estimation.total_nights} nights · $${Number(estimation.estimated_lodging_total).toLocaleString()}`}
              </span>
            </div>
          )}
        </div>

        <div className="pm-inquiry-form-panel">
          {isSubmitted ? (
            <div className="pm-inquiry-success" role="status">
              <span className="pm-inquiry-success__kicker">Request sent</span>
              <p>{copy.success}</p>
            </div>
          ) : (
            <form className="pm-inquiry-form" onSubmit={onSubmit} noValidate>
              {listingMode === 'rental' && (
                <div className="pm-date-row">
                  <label className="pm-field">
                    <span className="pm-field__label">Check-in</span>
                    <input
                      className="pm-field__input"
                      type="date"
                      value={checkIn}
                      onChange={(event) => onCheckInChange(event.target.value)}
                    />
                  </label>
                  <label className="pm-field">
                    <span className="pm-field__label">Check-out</span>
                    <input
                      className="pm-field__input"
                      type="date"
                      value={checkOut}
                      onChange={(event) => onCheckOutChange(event.target.value)}
                    />
                  </label>
                </div>
              )}
              <label className="pm-field">
                <span className="pm-field__label">Full name</span>
                <input
                  className="pm-field__input"
                  required
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => onFormChange({ ...form, name: event.target.value })}
                  aria-invalid={Boolean(formErrors.name)}
                />
                {formErrors.name && <span className="pm-form-error">{formErrors.name}</span>}
              </label>
              <label className="pm-field">
                <span className="pm-field__label">Email</span>
                <input
                  className="pm-field__input"
                  required
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => onFormChange({ ...form, email: event.target.value })}
                  aria-invalid={Boolean(formErrors.email)}
                />
                {formErrors.email && <span className="pm-form-error">{formErrors.email}</span>}
              </label>
              <label className="pm-field">
                <span className="pm-field__label">Message</span>
                <textarea
                  className="pm-field__textarea"
                  rows={4}
                  placeholder={copy.placeholder}
                  value={form.message}
                  onChange={(event) => onFormChange({ ...form, message: event.target.value })}
                />
              </label>
              <button className="urban-btn-primary pm-inquiry-submit" type="submit">
                {copy.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
