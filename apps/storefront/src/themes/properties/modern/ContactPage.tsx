'use client';

import React, { useState } from 'react';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useModernThemeLink } from './hooks/useModernThemeLink';

export default function ContactPage() {
  useModernThemeLink();
  const kicker = useThemeContent('contact.kicker', 'Get in touch');
  const title = useThemeContent('contact.title', 'Speak with our team');
  const subtitle = useThemeContent('contact.subtitle', 'Whether you have a question about a listing, want to book a viewing, or are ready to list your property — we are here to help.');
  const formTitle = useThemeContent('contact.form_title', 'Send a message');
  const infoTitle = useThemeContent('contact.info_title', 'Contact details');
  const address = useThemeContent('contact.address', '123 Urban Avenue, Suite 400|New York, NY 10001');
  const phone = useThemeContent('contact.phone', '+1 (800) 555-0190');
  const email = useThemeContent('contact.email', 'hello@sellio.com');
  const hoursTitle = useThemeContent('contact.hours_title', 'Office hours');
  const hours = useThemeContent('contact.hours', 'Monday–Friday: 9am–6pm EST|Saturday: 10am–3pm EST');
  const submitLabel = useThemeContent('contact.submit_label', 'Send message');
  const successMessage = useThemeContent('contact.success_message', 'Thank you. We will be in touch within one business day.');

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 800));
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div className="pm-contact-page">
      <section className="pm-contact-hero">
        <span className="urban-section-kicker">{kicker}</span>
        <h1 className="pm-contact-title">{title}</h1>
        <p className="pm-contact-subtitle">{subtitle}</p>
      </section>

      <section className="pm-contact-body">
        <div className="pm-contact-panel">
          <h2 className="pm-contact-panel-title">{formTitle}</h2>
          {isSubmitted ? (
            <div className="pm-inquiry-success" role="status">
              <span className="pm-inquiry-success__kicker">Message sent</span>
              <p>{successMessage}</p>
            </div>
          ) : (
            <form className="pm-inquiry-form" onSubmit={handleSubmit} noValidate>
              <label className="pm-field">
                <span className="pm-field__label">Full name</span>
                <input
                  className="pm-field__input"
                  required
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label className="pm-field">
                <span className="pm-field__label">Email</span>
                <input
                  className="pm-field__input"
                  required
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
              <label className="pm-field">
                <span className="pm-field__label">Phone (optional)</span>
                <input
                  className="pm-field__input"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
              <label className="pm-field">
                <span className="pm-field__label">Message</span>
                <textarea
                  className="pm-field__textarea"
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </label>
              <button
                className="urban-btn-primary pm-inquiry-submit"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending…' : submitLabel}
              </button>
            </form>
          )}
        </div>

        <aside className="pm-contact-panel pm-contact-info-panel">
          <h2 className="pm-contact-panel-title">{infoTitle}</h2>
          <div className="pm-contact-info-item">
            <span className="pm-contact-info-label">Address</span>
            <p className="pm-contact-info-value">
              {address.split('|').map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </p>
          </div>
          <div className="pm-contact-info-item">
            <span className="pm-contact-info-label">Phone</span>
            <a className="pm-contact-info-link" href={`tel:${phone.replace(/[\s()]/g, '')}`}>
              {phone}
            </a>
          </div>
          <div className="pm-contact-info-item">
            <span className="pm-contact-info-label">Email</span>
            <a className="pm-contact-info-link" href={`mailto:${email}`}>
              {email}
            </a>
          </div>
          <div className="pm-contact-info-item">
            <span className="pm-contact-info-label">{hoursTitle}</span>
            <p className="pm-contact-info-value">
              {hours.split('|').map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
