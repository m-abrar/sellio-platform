'use client';

import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';

const processSteps = [
  { n: '01', title: 'Send your list', body: 'Share item names, drawing references, sample photos, quantities, destination country, and any marking or packing requirements.' },
  { n: '02', title: 'We review and clarify', body: 'Our team checks pattern, size, steel grade, finish, and document needs. If anything needs confirming we will ask before quoting.' },
  { n: '03', title: 'You receive a quotation', body: 'Pricing, minimum quantity, lead time, sample options, and applicable export documents — presented clearly, not buried in conditions.' },
  { n: '04', title: 'Production and dispatch', body: 'Once the order is confirmed, instruments move through production, in-process inspection, export packing, and dispatch to your port.' },
];

const values = [
  {
    title: 'Pattern accuracy first',
    body: 'Orthopedic instruments are not interchangeable. Before any price is set, we confirm the exact pattern, jaw action, size range, steel grade, and finish expected.',
  },
  {
    title: 'Clear export communication',
    body: 'Every quotation includes realistic pricing, honest lead times, minimum quantities, and the documents we can support. No hidden conditions after the order is placed.',
  },
  {
    title: 'Private label from day one',
    body: 'Logo engraving, catalog numbering, tray layouts, carton design, and artwork approval are handled before production — not as an afterthought.',
  },
  {
    title: 'Direct from the manufacturer',
    body: 'Aadab International is the factory. Buyers deal with the people who manage production, not a trading desk that relays messages to a separate facility.',
  },
];

export default function AboutPage() {
  const themeLink = useEcommerceThemeLink();

  return (
    <main className="b2b-static-page">
      <section className="b2b-static-hero">
        <span className="b2b-kicker">About Aadab International</span>
        <h1>Eight decades of surgical instrument manufacturing.</h1>
        <p>
          Founded in 1942 and now in its third generation of family ownership, Aadab International manufactures reusable orthopedic and surgical
          instruments for global export — from a manufacturing heritage that spans three generations of the same family.
          We export directly to importers, distributors, hospital purchasing groups, and OEM buyers across more than forty countries.
        </p>
      </section>

      <section className="b2b-about-mission">
        <div className="b2b-about-mission-copy">
          <span className="b2b-kicker">How we work</span>
          <h2>Factory-direct. No trading companies in between.</h2>
          <p>
            Every enquiry is handled by the people who manage production. That means faster answers, accurate lead times,
            and a quotation based on what the factory can actually produce — not what a sales agent thinks it can.
          </p>
          <p>
            We confirm instrument pattern, material, finish, marking, tray layout, packing, and export documents at the
            quotation stage. Buyers should not discover these details after placing an order.
          </p>
        </div>
        <div className="b2b-about-mission-stats">
          <div><strong>1942</strong><span>Year Founded</span></div>
          <div><strong>3rd Gen</strong><span>Family Ownership</span></div>
          <div><strong>40+</strong><span>Export Countries</span></div>
          <div><strong>OEM</strong><span>Private Label</span></div>
        </div>
      </section>

      <section className="b2b-about-values">
        <div className="b2b-section-heading" style={{ gridColumn: '1 / -1', marginBottom: '0.5rem' }}>
          <span className="b2b-kicker">Our principles</span>
          <h2>What we stand for.</h2>
        </div>
        {values.map((value) => (
          <article key={value.title} className="b2b-about-value-card">
            <span className="b2b-capability-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4" />
                <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
            </span>
            <h3>{value.title}</h3>
            <p>{value.body}</p>
          </article>
        ))}
      </section>

      <section className="b2b-about-history">
        <div className="b2b-section-heading" style={{ marginBottom: '2rem' }}>
          <span className="b2b-kicker">The order process</span>
          <h2>From first enquiry to delivery.</h2>
        </div>
        <div className="b2b-timeline">
          {processSteps.map((step) => (
            <div key={step.n} className="b2b-timeline-item">
              <div className="b2b-timeline-year">{step.n}</div>
              <div className="b2b-timeline-dot" aria-hidden="true" />
              <div>
                <strong style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--b2b-text)' }}>{step.title}</strong>
                <p className="b2b-timeline-event">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="b2b-rfq" id="about-cta" aria-label="Get started">
        <div>
          <span className="b2b-kicker">Work with us</span>
          <h2>Let's discuss your instrument requirement.</h2>
          <p>
            Browse the catalog or send your own list. Include quantities, destination, marking preferences, and any documentation requirements
            — the more detail you provide, the faster we can respond with a complete quotation.
          </p>
          <div className="b2b-actions">
            <a href={themeLink('/explore')} className="b2b-btn b2b-btn-primary">Browse instruments</a>
            <a href={themeLink('/quote')} className="b2b-btn b2b-btn-secondary">Request a quote</a>
          </div>
        </div>
      </section>
    </main>
  );
}
