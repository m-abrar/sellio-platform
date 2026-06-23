'use client';

import { useState } from 'react';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';

const CERTIFICATIONS = ['ISO 13485 support', 'CE documentation support', 'Material certificate', 'Inspection report', 'Private label packing', 'None required'];
const TIMELINES = ['1-2 weeks', '2-4 weeks', '1-2 months', '3-6 months', 'Flexible'];

export default function QuotePage() {
  const themeLink = useEcommerceThemeLink();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    instrumentList: '',
    itemCodes: '',
    steelGrade: '',
    quantity: '',
    finish: '',
    certification: '',
    timeline: '',
    destination: '',
    notes: '',
  });

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="b2b-static-page">
      <section className="b2b-static-hero">
        <span className="b2b-kicker">Request a quotation</span>
        <h1>Send your orthopedic instrument RFQ.</h1>
        <p>
          Share your item codes, quantities, finish, branding, destination, and required documents.
          Our export team will respond within 48 business hours.
        </p>
      </section>

      <section className="b2b-contact-layout">
        <div className="b2b-contact-form-wrap">
          <h2>Instrument and export details</h2>

          {submitted ? (
            <div className="b2b-contact-success" role="status">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
              <h3>Quote request received</h3>
              <p>Our export team will review your instrument list and reply within 48 business hours.</p>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                <button type="button" className="b2b-btn b2b-btn-secondary" onClick={() => setSubmitted(false)}>
                  Submit another
                </button>
                <a href={themeLink('/explore')} className="b2b-btn b2b-btn-primary">
                  Browse instruments
                </a>
              </div>
            </div>
          ) : (
            <form className="b2b-contact-form" onSubmit={handleSubmit} noValidate>
              <p className="b2b-form-section-label">Your contact details</p>
              <div className="b2b-contact-row">
                <label>
                  <span>Full name *</span>
                  <input type="text" required placeholder="Jane Smith" value={form.name} onChange={set('name')} />
                </label>
                <label>
                  <span>Company *</span>
                  <input type="text" required placeholder="MedGate Imports" value={form.company} onChange={set('company')} />
                </label>
              </div>
              <div className="b2b-contact-row">
                <label>
                  <span>Work email *</span>
                  <input type="email" required placeholder="jane@company.com" value={form.email} onChange={set('email')} />
                </label>
                <label>
                  <span>Phone / WhatsApp</span>
                  <input type="tel" placeholder="+1 800 555 0192" value={form.phone} onChange={set('phone')} />
                </label>
              </div>

              <p className="b2b-form-section-label" style={{ marginTop: '1.5rem' }}>Instrument requirements</p>
              <label>
                <span>Instrument list / set description *</span>
                <textarea rows={4} required placeholder="Example: small fragment set, Hohmann retractors, bone levers, periosteal elevators..." value={form.instrumentList} onChange={set('instrumentList')} />
              </label>
              <div className="b2b-contact-row">
                <label>
                  <span>Item codes or drawing references</span>
                  <input type="text" placeholder="Example: OF-TF-024, customer drawing DRW-42" value={form.itemCodes} onChange={set('itemCodes')} />
                </label>
                <label>
                  <span>Quantity required *</span>
                  <input type="text" required placeholder="Example: 250 pcs / 40 complete sets" value={form.quantity} onChange={set('quantity')} />
                </label>
              </div>
              <div className="b2b-contact-row">
                <label>
                  <span>Steel grade</span>
                  <input type="text" placeholder="Example: 316L, 420, 410, buyer specified" value={form.steelGrade} onChange={set('steelGrade')} />
                </label>
                <label>
                  <span>Finish / marking</span>
                  <input type="text" placeholder="Satin, mirror, sandblast, laser logo, UDI" value={form.finish} onChange={set('finish')} />
                </label>
              </div>

              <p className="b2b-form-section-label" style={{ marginTop: '1.5rem' }}>Export details</p>
              <div className="b2b-contact-row">
                <label>
                  <span>Documents required</span>
                  <select value={form.certification} onChange={set('certification')}>
                    <option value="">Select if applicable</option>
                    {CERTIFICATIONS.map((cert) => <option key={cert} value={cert}>{cert}</option>)}
                  </select>
                </label>
                <label>
                  <span>Required delivery timeline</span>
                  <select value={form.timeline} onChange={set('timeline')}>
                    <option value="">Select timeline</option>
                    {TIMELINES.map((timeline) => <option key={timeline} value={timeline}>{timeline}</option>)}
                  </select>
                </label>
              </div>
              <label>
                <span>Destination country / port</span>
                <input type="text" placeholder="Example: Jebel Ali, Dubai / Hamburg, Germany" value={form.destination} onChange={set('destination')} />
              </label>
              <label>
                <span>Additional notes</span>
                <textarea rows={5} placeholder="Include packing, tray, tender, sample, payment, or inspection requirements." value={form.notes} onChange={set('notes')} />
              </label>

              <button type="submit" className="b2b-btn b2b-btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Submit export RFQ
              </button>
            </form>
          )}
        </div>

        <aside className="b2b-contact-info">
          <div className="b2b-contact-info-block">
            <h3>What happens next</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.75rem' }}>
              {[
                ['01', 'We review the set list', 'A product specialist checks item codes, steel grade, finish, packing, and documentation requirements.'],
                ['02', 'You receive an export quote', 'Within 48 business hours you get pricing, MOQ, lead time, sample options, and available documents.'],
                ['03', 'Approve and dispatch', 'Approve the quote and we prepare production, inspection, packing, and shipment under agreed trade terms.'],
              ].map(([n, title, body]) => (
                <div key={n} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.25)', borderRadius: '8px', color: 'var(--b2b-accent)', fontSize: '0.72rem', fontWeight: 900, minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{n}</span>
                  <div>
                    <strong style={{ color: 'var(--b2b-text)', fontSize: '0.9rem', display: 'block', marginBottom: '0.25rem' }}>{title}</strong>
                    <p style={{ color: 'var(--b2b-muted)', fontSize: '0.83rem', lineHeight: 1.6, margin: 0 }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="b2b-contact-info-block">
            <h3>Common documents</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
              {['Material certificate', 'Packing list', 'Inspection report', 'Private label files', 'Certificate support'].map((cert) => (
                <span key={cert} className="b2b-trust-badge">{cert}</span>
              ))}
            </div>
          </div>

          <div className="b2b-contact-info-block">
            <h3>Response guarantee</h3>
            <p>All qualified export quotation requests receive a response within <strong style={{ color: 'var(--b2b-text)' }}>48 business hours</strong>.</p>
            <p style={{ marginTop: '0.5rem' }}>+92 52 355 0192</p>
            <a href={themeLink('/contact')} className="b2b-btn b2b-btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
              Contact export desk
            </a>
          </div>
        </aside>
      </section>
    </main>
  );
}
