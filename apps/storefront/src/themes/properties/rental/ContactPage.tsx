'use client';

import React, { useState } from 'react';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

export default function ContactPage() {
  const kicker = useThemeContent('contact.kicker', 'Get in touch');
  const title = useThemeContent('contact.title', 'Questions? We are here to help.');
  const lead = useThemeContent('contact.lead', 'Whether you are a tenant with a question about a listing or a landlord exploring partnership options, our team typically responds within one business day.');
  const submitLabel = useThemeContent('contact.submit_label', 'Send message');
  const successMessage = useThemeContent('contact.success_message', 'Thanks — we will be in touch within 24 hours.');
  const emailValue = useThemeContent('contact.email', 'support@rentease.com');
  const hoursValue = useThemeContent('contact.hours', 'Mon–Fri, 9am–6pm EST');
  const responseTime = useThemeContent('contact.response_time', 'Within 24 business hours');

  const [form, setForm] = useState({ name: '', email: '', subject: 'tenant', message: '' });
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
    <div className="pr-contact-page">
      <section className="pr-contact-hero">
        <span className="pr-kicker">{kicker}</span>
        <h1 className="pr-contact-title">{title}</h1>
        <p className="pr-contact-lead">{lead}</p>
      </section>

      <div className="pr-contact-body">
        <div className="pr-contact-form-panel">
          {isSubmitted ? (
            <div className="pr-receipt-panel" role="status">
              <p className="pr-receipt-panel__success">{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="pr-booking-field">
                <label className="pr-booking-label" htmlFor="pr-contact-name">Full name</label>
                <input
                  id="pr-contact-name"
                  className="pr-booking-input"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="pr-booking-field">
                <label className="pr-booking-label" htmlFor="pr-contact-email">Email address</label>
                <input
                  id="pr-contact-email"
                  className="pr-booking-input"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="pr-booking-field">
                <label className="pr-booking-label" htmlFor="pr-contact-subject">Subject</label>
                <select
                  id="pr-contact-subject"
                  className="pr-booking-input"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                >
                  <option value="tenant">Tenant inquiry</option>
                  <option value="landlord">Landlord partnership</option>
                  <option value="technical">Technical issue</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="pr-booking-field">
                <label className="pr-booking-label" htmlFor="pr-contact-message">Message</label>
                <textarea
                  id="pr-contact-message"
                  className="pr-booking-input pr-contact-textarea"
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="pr-btn-primary pr-btn-block"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending…' : submitLabel}
              </button>
            </form>
          )}
        </div>

        <aside className="pr-contact-info">
          <div className="pr-detail-block pr-contact-info-card">
            <span className="pr-contact-info-label">Email</span>
            <a className="pr-contact-info-value" href={`mailto:${emailValue}`}>{emailValue}</a>
          </div>
          <div className="pr-detail-block pr-contact-info-card">
            <span className="pr-contact-info-label">Office hours</span>
            <span className="pr-contact-info-value">{hoursValue}</span>
          </div>
          <div className="pr-detail-block pr-contact-info-card">
            <span className="pr-contact-info-label">Response time</span>
            <span className="pr-contact-info-value">{responseTime}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
