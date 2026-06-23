'use client';

import { useState } from 'react';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';

const offices = [
  { city: 'Sialkot', role: 'Manufacturing and Export Office', address: 'Surgical Instruments Zone, Sialkot 51310, Pakistan', phone: '+92 52 355 0192' },
  { city: 'Dubai', role: 'MENA Distributor Support', address: 'Business Bay, Dubai, UAE', phone: '+971 4 234 5678' },
  { city: 'Rotterdam', role: 'European Logistics Desk', address: 'Wilhelminapier 85, 3072 AP Rotterdam, Netherlands', phone: '+31 10 234 5678' },
];

export default function ContactPage() {
  const themeLink = useEcommerceThemeLink();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', inquiry: 'export-rfq', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="b2b-static-page">
      <section className="b2b-static-hero">
        <span className="b2b-kicker">Contact us</span>
        <h1>Talk to our orthopedic export team.</h1>
        <p>We help distributors, importers, hospitals, OEM buyers, and tender suppliers source reusable orthopedic surgical instruments directly from production.</p>
      </section>

      <section className="b2b-contact-layout">
        <div className="b2b-contact-form-wrap">
          <h2>Send us a message</h2>
          {submitted ? (
            <div className="b2b-contact-success" role="status">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
              <h3>Message received</h3>
              <p>Our export team will respond within one business day.</p>
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
                  <input type="text" required placeholder="MedGate Imports" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </label>
              </div>
              <div className="b2b-contact-row">
                <label>
                  <span>Work email *</span>
                  <input type="email" required placeholder="jane@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </label>
                <label>
                  <span>Phone / WhatsApp</span>
                  <input type="tel" placeholder="+1 800 555 0192" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </label>
              </div>
              <label>
                <span>Inquiry type</span>
                <select value={form.inquiry} onChange={(e) => setForm({ ...form, inquiry: e.target.value })}>
                  <option value="export-rfq">Export quotation</option>
                  <option value="distributor">Distributor supply</option>
                  <option value="oem">OEM / private label</option>
                  <option value="quality">Quality documents</option>
                  <option value="sample">Samples and catalog</option>
                  <option value="other">Other enquiry</option>
                </select>
              </label>
              <label>
                <span>Message *</span>
                <textarea required rows={5} placeholder="Describe the instruments, set list, destination market, and documents you need." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </label>
              <button type="submit" className="b2b-btn b2b-btn-primary" style={{ width: '100%' }}>
                Send message
              </button>
            </form>
          )}
        </div>

        <aside className="b2b-contact-info">
          <div className="b2b-contact-info-block">
            <h3>Export offices</h3>
            {offices.map((office) => (
              <div key={office.city} className="b2b-contact-office">
                <strong>{office.city}</strong>
                <span className="b2b-kicker" style={{ letterSpacing: '0.8px', marginBottom: '0.4rem', marginTop: '0.2rem', display: 'block' }}>{office.role}</span>
                <p>{office.address}</p>
                <p>{office.phone}</p>
              </div>
            ))}
          </div>
          <div className="b2b-contact-info-block">
            <h3>Working hours</h3>
            <p>Monday - Friday: 09:00 - 18:00 PKT</p>
            <p>Urgent shipment support is available for approved distributor accounts.</p>
          </div>
          <div className="b2b-contact-info-block">
            <h3>Need pricing fast?</h3>
            <p>
              Send your item list, quantities, destination port, and required documents through the RFQ form.
              It gives our team the details needed for a cleaner quotation.
            </p>
            <a href={themeLink('/quote')} className="b2b-btn b2b-btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
              Request export quote
            </a>
          </div>
        </aside>
      </section>
    </main>
  );
}
