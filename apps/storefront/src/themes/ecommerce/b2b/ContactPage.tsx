'use client';

import { useState } from 'react';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';

const offices = [
  { city: 'Singapore', role: 'Headquarters', address: '1 One-North Crescent, #08-01, Singapore 138538', phone: '+65 6123 4567' },
  { city: 'Dubai', role: 'MENA & Gulf Operations', address: 'DIFC Gate Building, Level 15, Dubai, UAE', phone: '+971 4 234 5678' },
  { city: 'Rotterdam', role: 'European Operations', address: 'Wilhelminapier 85, 3072 AP Rotterdam, Netherlands', phone: '+31 10 234 5678' },
];

export default function ContactPage() {
  const themeLink = useEcommerceThemeLink();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', inquiry: 'procurement', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="b2b-static-page">
      <section className="b2b-static-hero">
        <span className="b2b-kicker">Contact us</span>
        <h1>Let&apos;s talk procurement.</h1>
        <p>Our team is available to help with sourcing requirements, enterprise onboarding, supplier applications, and platform support.</p>
      </section>

      <section className="b2b-contact-layout">
        {/* Form */}
        <div className="b2b-contact-form-wrap">
          <h2>Send us a message</h2>
          {submitted ? (
            <div className="b2b-contact-success" role="status">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
              <h3>Message received</h3>
              <p>Our procurement team will respond within one business day.</p>
              <button type="button" className="b2b-btn b2b-btn-secondary" onClick={() => setSubmitted(false)} style={{ marginTop: '1rem' }}>
                Send another
              </button>
            </div>
          ) : (
            <form className="b2b-contact-form" onSubmit={handleSubmit} noValidate>
              <div className="b2b-contact-row">
                <label>
                  <span>Full name *</span>
                  <input type="text" required placeholder="Jane Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </label>
                <label>
                  <span>Company *</span>
                  <input type="text" required placeholder="Acme Industries" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </label>
              </div>
              <div className="b2b-contact-row">
                <label>
                  <span>Work email *</span>
                  <input type="email" required placeholder="jane@acme.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </label>
                <label>
                  <span>Phone</span>
                  <input type="tel" placeholder="+1 800 555 0192" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </label>
              </div>
              <label>
                <span>Inquiry type</span>
                <select value={form.inquiry} onChange={(e) => setForm({ ...form, inquiry: e.target.value })}>
                  <option value="procurement">Procurement & sourcing</option>
                  <option value="enterprise">Enterprise account</option>
                  <option value="supplier">Supplier onboarding</option>
                  <option value="support">Platform support</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label>
                <span>Message *</span>
                <textarea required rows={5} placeholder="Describe your sourcing requirements or question…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </label>
              <button type="submit" className="b2b-btn b2b-btn-primary" style={{ width: '100%' }}>
                Send message
              </button>
            </form>
          )}
        </div>

        {/* Info */}
        <aside className="b2b-contact-info">
          <div className="b2b-contact-info-block">
            <h3>Global offices</h3>
            {offices.map((o) => (
              <div key={o.city} className="b2b-contact-office">
                <strong>{o.city}</strong>
                <span className="b2b-kicker" style={{ letterSpacing: '0.8px', marginBottom: '0.4rem', marginTop: '0.2rem', display: 'block' }}>{o.role}</span>
                <p>{o.address}</p>
                <p>{o.phone}</p>
              </div>
            ))}
          </div>
          <div className="b2b-contact-info-block">
            <h3>Working hours</h3>
            <p>Monday – Friday: 08:00 – 20:00 SGT</p>
            <p>Urgent procurement support: 24/7 for enterprise accounts.</p>
          </div>
          <div className="b2b-contact-info-block">
            <h3>Supplier enquiries</h3>
            <p>
              Interested in listing your products on SupplyDesk? Contact our supplier relations team or visit our supplier portal.
            </p>
            <a href={themeLink('/explore')} className="b2b-btn b2b-btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
              Supplier portal →
            </a>
          </div>
        </aside>
      </section>
    </main>
  );
}
