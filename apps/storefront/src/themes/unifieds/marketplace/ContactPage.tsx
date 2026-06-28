'use client';

import React, { useState } from 'react';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

const TOPICS = ['Buyer support', 'Seller onboarding', 'Technical issue', 'Partnership', 'Other'] as const;

const VERTICALS = ['Products', 'Properties', 'Autos', 'Services', 'Jobs', 'Events', 'Classifieds'] as const;

function generateRef(): string {
  return `#CM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export default function ContactPage() {
  const themeLink = useUnifiedThemeLink();
  const siteName = useThemeContent('site_name', 'MarketHub');
  const supportEmail = useThemeContent('contact.support_email', 'support@markethub.com');
  const partnerEmail = useThemeContent('contact.partner_email', 'partnerships@markethub.com');
  const responseTime = useThemeContent('contact.response_time', 'Within 24 business hours');

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
    <div className="um-static-page">

      <section className="um-about-hero" aria-labelledby="um-contact-title">
        <div className="um-section-kicker">Support</div>
        <h1 id="um-contact-title">How can we help?</h1>
        <p>Reach out with buyer questions, seller inquiries, or partnership requests.</p>
      </section>

      <div className="um-contact-grid">
        <div>
          {submitted ? (
            <div className="um-contact-receipt" role="status" aria-live="polite">
              <div className="um-contact-receipt-icon" aria-hidden="true">✓</div>
              <h3>Message received</h3>
              <p>We&apos;ll get back to you within 24 hours. Reference: {ref}</p>
            </div>
          ) : (
            <form className="um-contact-form" onSubmit={handleSubmit} aria-label="Contact form">
              <h2>Send us a message</h2>

              <label htmlFor="um-contact-name">Name</label>
              <input
                id="um-contact-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />

              <label htmlFor="um-contact-email">Email</label>
              <input
                id="um-contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />

              <label htmlFor="um-contact-topic">Topic</label>
              <select
                id="um-contact-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                <option value="">Select a topic</option>
                {TOPICS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <label htmlFor="um-contact-message">Message</label>
              <textarea
                id="um-contact-message"
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us how we can help..."
              />

              <button type="submit" className="um-btn-primary" style={{ marginTop: '1.25rem', width: '100%' }}>
                Send message
              </button>
            </form>
          )}
        </div>

        <div className="um-contact-info">
          <div className="um-contact-info-card">
            <h3>Email support</h3>
            <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
          </div>
          <div className="um-contact-info-card">
            <h3>Response time</h3>
            <p>{responseTime}</p>
          </div>
          <div className="um-contact-info-card">
            <h3>Seller & partner inquiries</h3>
            <a href={`mailto:${partnerEmail}`}>{partnerEmail}</a>
          </div>

          <div className="um-contact-verticals">
            <h3>Browse by category</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--um-muted)', marginBottom: '0.75rem' }}>
              Have a question about a specific vertical?
            </p>
            <div className="um-contact-vertical-links">
              {VERTICALS.map((v) => (
                <a key={v} href={themeLink(`/explore?category=${v.toLowerCase()}`)}>
                  {v}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="um-final-cta" aria-labelledby="um-contact-cta-title">
        <div className="um-cta-glow um-cta-glow-a" aria-hidden="true" />
        <div className="um-cta-glow um-cta-glow-b" aria-hidden="true" />
        <div className="um-section-kicker um-cta-kicker">Explore {siteName}</div>
        <h2 id="um-contact-cta-title">Browse the full marketplace.</h2>
        <div className="um-cta-actions">
          <a className="um-btn-primary" href={themeLink('/explore')}>Browse listings</a>
        </div>
      </section>

    </div>
  );
}
