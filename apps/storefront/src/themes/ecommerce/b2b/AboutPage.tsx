'use client';

import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';

const milestones = [
  { year: '1985', event: 'Started as a surgical-instrument workshop focused on orthopedic hand instruments and stainless-steel finishing.' },
  { year: '1996', event: 'Expanded into trauma instruments, bone holding forceps, retractors, elevators, and standard orthopedic procedure sets.' },
  { year: '2004', event: 'Built a dedicated export department for distributors, importers, and hospital tender suppliers across Europe, MENA, and Asia.' },
  { year: '2012', event: 'Added laser marking, passivation controls, set assembly, and private-label packing for OEM and distributor programs.' },
  { year: '2018', event: 'Launched direct RFQ workflows so buyers can share item codes, drawings, quantities, destination ports, and documentation needs online.' },
  { year: '2026', event: 'Serving buyers in 47 export markets with trauma, spine, joint, retractor, and custom orthopedic instrument lines.' },
];

const values = [
  {
    title: 'Surgical consistency',
    body: 'Every instrument is checked for finish, alignment, grip, jaw action, passivation, and packing before it leaves production.',
  },
  {
    title: 'Distributor partnership',
    body: 'We support repeat supply, private label, custom trays, tender documentation, and staged shipments for serious medical distributors.',
  },
  {
    title: 'Export readiness',
    body: 'Our team prepares commercial invoices, packing lists, certificate support, and inspection coordination for international shipments.',
  },
  {
    title: 'Practical OEM support',
    body: 'Share your current item list, catalog codes, or drawings and we will quote realistic MOQs, samples, tooling, and lead times.',
  },
];

export default function AboutPage() {
  const themeLink = useEcommerceThemeLink();

  return (
    <main className="b2b-static-page">
      <section className="b2b-static-hero">
        <span className="b2b-kicker">About us</span>
        <h1>Orthopedic instruments manufactured for global medical supply.</h1>
        <p>
          Aadab International manufactures and exports reusable orthopedic surgical instruments from Sialkot, Pakistan for distributors, importers,
          hospitals, OEM brands, and tender suppliers that need consistent quality with clear documentation.
        </p>
      </section>

      <section className="b2b-about-mission">
        <div className="b2b-about-mission-copy">
          <span className="b2b-kicker">Our mission</span>
          <h2>Make orthopedic sourcing easier for serious buyers.</h2>
          <p>
            Surgical procurement should not depend on vague catalogs or uncertain paperwork. We build instruments with controlled
            stainless-steel finishing, batch traceability, and export packing so buyers can qualify supply with confidence.
          </p>
          <p>
            We are a manufacturer, not a reseller. When you request a quote, you are speaking with the team responsible for production,
            finishing, packing, and export dispatch.
          </p>
        </div>
        <div className="b2b-about-mission-stats">
          <div><strong>40+</strong><span>Years Manufacturing</span></div>
          <div><strong>3</strong><span>Production Units</span></div>
          <div><strong>98%</strong><span>On-Time Export Dispatch</span></div>
          <div><strong>47</strong><span>Export Markets</span></div>
        </div>
      </section>

      <section className="b2b-about-values">
        <div className="b2b-section-heading" style={{ gridColumn: '1 / -1', marginBottom: '0.5rem' }}>
          <span className="b2b-kicker">What we stand for</span>
          <h2>Manufacturing principles for medical buyers.</h2>
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
          <span className="b2b-kicker">Our history</span>
          <h2>From surgical workshop to orthopedic export partner.</h2>
        </div>
        <div className="b2b-timeline">
          {milestones.map((milestone) => (
            <div key={milestone.year} className="b2b-timeline-item">
              <div className="b2b-timeline-year">{milestone.year}</div>
              <div className="b2b-timeline-dot" aria-hidden="true" />
              <p className="b2b-timeline-event">{milestone.event}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="b2b-rfq" id="about-cta" aria-label="Get started">
        <div>
          <span className="b2b-kicker">Work with us</span>
          <h2>Ready to source orthopedic instruments directly from the factory?</h2>
          <p>
            Browse the catalog, shortlist instruments, and request an export quotation with your quantities, destination, and documentation needs.
          </p>
          <div className="b2b-actions">
            <a href={themeLink('/explore')} className="b2b-btn b2b-btn-primary">Browse instruments</a>
            <a href={themeLink('/quote')} className="b2b-btn b2b-btn-secondary">Request export quote</a>
          </div>
        </div>
      </section>
    </main>
  );
}
