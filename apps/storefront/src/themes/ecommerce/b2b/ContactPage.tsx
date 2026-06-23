'use client';

import { useState } from 'react';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';

const offices = [
  {
    city: 'Export Desk',
    role: 'Orthopedic Instruments Enquiries',
    address: '19/16 Club Road Cantt., Sialkot 51310, Pakistan',
    phone: '+92 330 481 9191',
    whatsapp: '923304819191',
  },
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
        <h1>Get in touch with our export desk.</h1>
        <p>For instrument enquiries, sample requests, exhibition appointments, or any pre-order questions — use the form below or send your list directly to our export team.</p>
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
              <p>We will review your message and reply with the next details needed.</p>
              <button type="button" className="b2b-btn b2b-btn-secondary" onClick={() => setSubmitted(false)} style={{ marginTop: '1rem' }}>
                Send another
              </button>
            </div>
          ) : (
            <form className="b2b-contact-form" onSubmit={handleSubmit} noValidate>
              <div className="b2b-contact-row">
                <label>
                  <span>Full name *</span>
                  <input type="text" required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </label>
                <label>
                  <span>Company *</span>
                  <input type="text" required placeholder="Company name" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </label>
              </div>
              <div className="b2b-contact-row">
                <label>
                  <span>Work email *</span>
                  <input type="email" required placeholder="name@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </label>
                <label>
                  <span>Phone / WhatsApp</span>
                  <input type="tel" placeholder="+92 ..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
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
                <textarea required rows={5} placeholder="Describe the instruments, set list, quantity, destination country, packing, marking, and documents you need." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </label>
              <button type="submit" className="b2b-btn b2b-btn-primary" style={{ width: '100%' }}>
                Send message
              </button>
            </form>
          )}
        </div>

        <aside className="b2b-contact-info">
          <div className="b2b-contact-info-block">
            <h3>Office</h3>
            {offices.map((office) => (
              <div key={office.city} className="b2b-contact-office">
                <strong>{office.city}</strong>
                <span className="b2b-kicker" style={{ letterSpacing: '0.8px', marginBottom: '0.4rem', marginTop: '0.2rem', display: 'block' }}>{office.role}</span>
                <p>{office.address}</p>
                {office.phone ? (
                  <a
                    href={`https://wa.me/${office.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="b2b-contact-whatsapp"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.557 4.118 1.529 5.845L0 24l6.335-1.509A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.932 0-3.742-.523-5.287-1.433l-.378-.225-3.762.896.952-3.666-.248-.388A9.94 9.94 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                    </svg>
                    {office.phone}
                  </a>
                ) : null}
              </div>
            ))}
          </div>
          <div className="b2b-contact-info-block">
            <h3>Business hours</h3>
            <p>Monday – Friday, 09:00 – 18:00 PKT</p>
            <p>Enquiries with a complete instrument list receive a faster reply — we can often respond the same business day.</p>
          </div>
          <div className="b2b-contact-info-block">
            <h3>Requesting a quotation?</h3>
            <p>
              Use the dedicated RFQ form to include item details, quantities, destination, and packing requirements.
              The more information you provide, the less back-and-forth before pricing is confirmed.
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
