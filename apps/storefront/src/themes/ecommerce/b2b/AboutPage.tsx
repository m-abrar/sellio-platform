'use client';

import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';

const milestones = [
  { year: '1985', event: 'Founded as a precision machining workshop in the industrial district of Düsseldorf, Germany. Initial focus: close-tolerance components for automotive OEMs.' },
  { year: '1993', event: 'Expanded to a 12,000 m² production facility. Achieved ISO 9001 certification and entered the aerospace sector with our first commercial aviation supply contract.' },
  { year: '2001', event: 'Established our second facility for large-format composite manufacturing. Began exporting to 18 countries across Europe and the Middle East.' },
  { year: '2010', event: 'Opened our Asia-Pacific operations hub. Achieved IATF 16949 and AS9100D certification, enabling supply to automotive and aerospace tier-1 clients globally.' },
  { year: '2018', event: 'Launched our direct B2B catalog and online quotation platform — enabling engineering buyers to request pricing without intermediaries.' },
  { year: '2024', event: 'Operating three production facilities across two continents. Serving 47 countries. Over 5,000 active part numbers across aerospace, automotive, energy, and defense.' },
];

const values = [
  {
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
    title: 'Zero-defect manufacturing',
    body: 'Every component we produce is inspected against dimensional tolerances, material certifications, and functional specifications before leaving our facility. No exceptions.',
  },
  {
    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    title: 'Engineering partnership',
    body: 'We work directly with your engineering team at the design stage. Our applications engineers review drawings, propose material alternatives, and flag tolerance risks before production begins.',
  },
  {
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    title: 'Delivery reliability',
    body: '98% of our orders ship on the confirmed date. Where delays are unavoidable, our production team proactively communicates lead time changes and offers stocked alternatives.',
  },
  {
    icon: 'M3 15a4 4 0 0 0 4 4h9a5 5 0 0 0 1.8-9.7 6 6 0 0 0-11.8-1A4 4 0 0 0 3 15z',
    title: 'Sustainable production',
    body: 'ISO 14001 certified operations. We have reduced energy consumption per unit by 34% since 2018 and source raw materials exclusively from verified, responsible suppliers.',
  },
];

export default function AboutPage() {
  const themeLink = useEcommerceThemeLink();

  return (
    <main className="b2b-static-page">
      {/* Hero */}
      <section className="b2b-static-hero">
        <span className="b2b-kicker">About us</span>
        <h1>Four decades of precision,<br />shipped to 47 countries.</h1>
        <p>
          We are a precision components manufacturer founded in 1985. From a single machining workshop to three global facilities,
          our growth has been driven by one principle: build components that engineers can rely on, and deliver them when promised.
        </p>
      </section>

      {/* Mission & Stats */}
      <section className="b2b-about-mission">
        <div className="b2b-about-mission-copy">
          <span className="b2b-kicker">Our mission</span>
          <h2>Manufacture components that perform in the most demanding environments on earth.</h2>
          <p>
            Industrial components fail at critical moments — in aircraft systems, power generation equipment, and automotive assemblies.
            Our job is to make sure they never do.
            Every part we produce is engineered to the tightest tolerances, tested against specification, and documented for full traceability.
          </p>
          <p>
            We are a manufacturer, not a marketplace. When you order from us, you order from the factory that makes the part.
          </p>
        </div>
        <div className="b2b-about-mission-stats">
          <div><strong>40+</strong><span>Years Manufacturing</span></div>
          <div><strong>3</strong><span>Global Facilities</span></div>
          <div><strong>98%</strong><span>On-Time Delivery</span></div>
          <div><strong>47</strong><span>Countries Served</span></div>
        </div>
      </section>

      {/* Values */}
      <section className="b2b-about-values">
        <div className="b2b-section-heading" style={{ gridColumn: '1 / -1', marginBottom: '0.5rem' }}>
          <span className="b2b-kicker">What we stand for</span>
          <h2>Our manufacturing principles</h2>
        </div>
        {values.map((v) => (
          <article key={v.title} className="b2b-about-value-card">
            <span className="b2b-capability-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={v.icon} />
              </svg>
            </span>
            <h3>{v.title}</h3>
            <p>{v.body}</p>
          </article>
        ))}
      </section>

      {/* Timeline */}
      <section className="b2b-about-history">
        <div className="b2b-section-heading" style={{ marginBottom: '2rem' }}>
          <span className="b2b-kicker">Our history</span>
          <h2>From a single workshop to a global manufacturing operation.</h2>
        </div>
        <div className="b2b-timeline">
          {milestones.map((m) => (
            <div key={m.year} className="b2b-timeline-item">
              <div className="b2b-timeline-year">{m.year}</div>
              <div className="b2b-timeline-dot" aria-hidden="true" />
              <p className="b2b-timeline-event">{m.event}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="b2b-rfq" id="about-cta" aria-label="Get started">
        <div>
          <span className="b2b-kicker">Work with us</span>
          <h2>Ready to source directly from the manufacturer?</h2>
          <p>
            Browse our product catalog, download datasheets, and request a quotation directly from our sales engineering team.
            No intermediaries. No mark-ups.
          </p>
          <div className="b2b-actions">
            <a href={themeLink('/explore')} className="b2b-btn b2b-btn-primary">Browse catalog</a>
            <a href={themeLink('/contact')} className="b2b-btn b2b-btn-secondary">Talk to our team</a>
          </div>
        </div>
      </section>
    </main>
  );
}
