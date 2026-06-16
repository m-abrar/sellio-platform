'use client';

import { useState } from 'react';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';

const CERTIFICATIONS = ['ISO 9001', 'IATF 16949', 'AS9100D', 'PED 2014/68/EU', 'ITAR', 'ATEX', 'ISO 3834', 'None required'];
const TIMELINES = ['1–2 weeks', '2–4 weeks', '1–2 months', '3–6 months', 'Flexible'];

export default function QuotePage() {
  const themeLink = useEcommerceThemeLink();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    partName: '',
    drawingRef: '',
    material: '',
    quantity: '',
    tolerance: '',
    certification: '',
    timeline: '',
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
        <h1>Tell us what you need.</h1>
        <p>
          Submit your part requirements and our sales engineering team will respond within
          48 business hours with pricing, lead time, and available certifications.
        </p>
      </section>

      <section className="b2b-contact-layout">

        {/* Quote form */}
        <div className="b2b-contact-form-wrap">
          <h2>Part &amp; project details</h2>

          {submitted ? (
            <div className="b2b-contact-success" role="status">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
              <h3>Quote request received</h3>
              <p>Our sales engineering team will review your requirements and reply within 48 business hours.</p>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                <button type="button" className="b2b-btn b2b-btn-secondary" onClick={() => setSubmitted(false)}>
                  Submit another
                </button>
                <a href={themeLink('/explore')} className="b2b-btn b2b-btn-primary">
                  Browse catalog
                </a>
              </div>
            </div>
          ) : (
            <form className="b2b-contact-form" onSubmit={handleSubmit} noValidate>

              {/* Contact */}
              <p className="b2b-form-section-label">Your contact details</p>
              <div className="b2b-contact-row">
                <label>
                  <span>Full name *</span>
                  <input type="text" required placeholder="Jane Smith" value={form.name} onChange={set('name')} />
                </label>
                <label>
                  <span>Company *</span>
                  <input type="text" required placeholder="Acme Industries" value={form.company} onChange={set('company')} />
                </label>
              </div>
              <div className="b2b-contact-row">
                <label>
                  <span>Work email *</span>
                  <input type="email" required placeholder="jane@acme.com" value={form.email} onChange={set('email')} />
                </label>
                <label>
                  <span>Phone</span>
                  <input type="tel" placeholder="+1 800 555 0192" value={form.phone} onChange={set('phone')} />
                </label>
              </div>

              {/* Part requirements */}
              <p className="b2b-form-section-label" style={{ marginTop: '1.5rem' }}>Part requirements</p>
              <div className="b2b-contact-row">
                <label>
                  <span>Part name / description *</span>
                  <input type="text" required placeholder="e.g. Flanged shaft coupling" value={form.partName} onChange={set('partName')} />
                </label>
                <label>
                  <span>Drawing / part reference</span>
                  <input type="text" placeholder="e.g. DRW-2024-0042" value={form.drawingRef} onChange={set('drawingRef')} />
                </label>
              </div>
              <div className="b2b-contact-row">
                <label>
                  <span>Material specification</span>
                  <input type="text" placeholder="e.g. 316L stainless steel, 6061-T6 aluminium" value={form.material} onChange={set('material')} />
                </label>
                <label>
                  <span>Quantity required *</span>
                  <input type="text" required placeholder="e.g. 500 units / prototype run of 5" value={form.quantity} onChange={set('quantity')} />
                </label>
              </div>
              <div className="b2b-contact-row">
                <label>
                  <span>Required tolerance</span>
                  <input type="text" placeholder="e.g. ±0.05 mm, ±0.001 in" value={form.tolerance} onChange={set('tolerance')} />
                </label>
                <label>
                  <span>Certification required</span>
                  <select value={form.certification} onChange={set('certification')}>
                    <option value="">Select if applicable</option>
                    {CERTIFICATIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
              </div>

              {/* Project details */}
              <p className="b2b-form-section-label" style={{ marginTop: '1.5rem' }}>Project details</p>
              <label>
                <span>Required delivery timeline</span>
                <select value={form.timeline} onChange={set('timeline')}>
                  <option value="">Select timeline</option>
                  {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label>
                <span>Additional notes / technical requirements</span>
                <textarea
                  rows={5}
                  placeholder="Include surface finish, heat treatment, inspection requirements, packing instructions, or any other project-specific details…"
                  value={form.notes}
                  onChange={set('notes')}
                />
              </label>

              <button type="submit" className="b2b-btn b2b-btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Submit quote request
              </button>
            </form>
          )}
        </div>

        {/* Info sidebar */}
        <aside className="b2b-contact-info">
          <div className="b2b-contact-info-block">
            <h3>What happens next</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.75rem' }}>
              {[
                ['01', 'We review your requirements', 'A sales engineer examines your part details and selects the optimal manufacturing process.'],
                ['02', 'You receive a quotation', 'Within 48 business hours you get a detailed quote with pricing, lead time, and certification options.'],
                ['03', 'Confirm and we manufacture', 'Approve the quote and we commence production. Every shipment includes dimensional inspection reports.'],
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
            <h3>Certifications we hold</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
              {['ISO 9001', 'IATF 16949', 'AS9100D', 'ISO 14001', 'ITAR Registered'].map((cert) => (
                <span key={cert} className="b2b-trust-badge">✓ {cert}</span>
              ))}
            </div>
          </div>

          <div className="b2b-contact-info-block">
            <h3>Response guarantee</h3>
            <p>All quotation requests receive a response within <strong style={{ color: 'var(--b2b-text)' }}>48 business hours</strong>. Urgent requirements? Call our sales team directly.</p>
            <p style={{ marginTop: '0.5rem' }}>+1 (800) 555-0192</p>
            <a href={themeLink('/contact')} className="b2b-btn b2b-btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
              Contact us →
            </a>
          </div>
        </aside>

      </section>
    </main>
  );
}
