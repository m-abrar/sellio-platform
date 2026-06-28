'use client';

import React, { useState } from 'react';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

const TOPICS = ['Acquisition inquiry', 'Authentication question', 'Seller onboarding', 'Concierge services', 'Other'] as const;

function generateRef(): string {
  return `#ELT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export default function ContactPage() {
  const themeLink = useClassifiedsThemeLink();
  const siteName = useThemeContent('site_name', 'Sellio Elite');
  const supportEmail = useThemeContent('contact.support_email', 'concierge@sellio-elite.com');
  const responseTime = useThemeContent('contact.response_time', 'Within one business day');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ref] = useState(generateRef);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="ce-static-page">

      <div className="ce-static-hero">
        <div className="ce-static-kicker">Concierge Line</div>
        <h1>How can we assist you?</h1>
        <p>Reach our team for acquisition guidance, custodian onboarding, or expert advisory requests.</p>
      </div>

      <div className="ce-contact-grid">
        <div>
          {submitted ? (
            <div className="ce-contact-receipt" role="status" aria-live="polite">
              <div className="ce-contact-receipt-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Message received</h3>
              <p>We will respond within one business day. Reference: {ref}</p>
            </div>
          ) : (
            <form className="ce-contact-form" onSubmit={handleSubmit} aria-label="Contact form">
              <h2>Send a message</h2>

              <div>
                <label htmlFor="ce-contact-name">Full name</label>
                <input
                  id="ce-contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sterling H. Croft"
                />
              </div>

              <div>
                <label htmlFor="ce-contact-email">Email address</label>
                <input
                  id="ce-contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="ce-contact-topic">Topic</label>
                <select
                  id="ce-contact-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  <option value="">Select a topic</option>
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ce-contact-message">Message</label>
                <textarea
                  id="ce-contact-message"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry in detail..."
                />
              </div>

              <button type="submit" className="elite-modal-cta" style={{ width: '100%', marginTop: '0.5rem' }}>
                Send inquiry
              </button>
            </form>
          )}
        </div>

        <div>
          <div className="ce-contact-info-card">
            <h3>Concierge email</h3>
            <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
          </div>
          <div className="ce-contact-info-card">
            <h3>Response time</h3>
            <p>{responseTime}</p>
          </div>
          <div className="ce-contact-info-card">
            <h3>Discretion assured</h3>
            <p>All inquiries are handled in strict confidence. Your information is never shared with third parties.</p>
          </div>
        </div>
      </div>

      <div className="ce-static-cta">
        <h2>Explore the private catalog.</h2>
        <p>Authenticated acquisitions from verified custodians of {siteName}.</p>
        <a href={themeLink('/')} className="elite-modal-cta" style={{ textDecoration: 'none' }}>View catalog</a>
      </div>

    </div>
  );
}
