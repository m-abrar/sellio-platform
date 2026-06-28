'use client';

import React, { useState } from 'react';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';

type FaqItem = { q: string; a: string };

const BUYER_FAQS: FaqItem[] = [
  {
    q: 'What types of assets are listed on the platform?',
    a: 'Fine art and collectibles, luxury timepieces, rare vintages (wine and spirits), and exotic motors. All listings are authenticated and approved before entering the catalog.',
  },
  {
    q: 'How do I know an asset is genuine?',
    a: 'Every asset in the catalog comes with custodian verification, appraisal documentation, and provenance records. Look for the authentication details on the listing detail page.',
  },
  {
    q: 'How do I submit an acquisition inquiry?',
    a: 'Open the listing you are interested in and complete the Prospectus Memorandum form. Provide your contact details and a proposed offer. The custodian will respond within one to two business days.',
  },
  {
    q: 'Is my inquiry confidential?',
    a: 'Yes. All prospectus requests are handled discreetly. Your information is shared only with the vault custodian of that specific listing.',
  },
  {
    q: 'Can I arrange a private viewing?',
    a: 'Many custodians offer private viewings or inspection arrangements upon request. Mention this in your advisory notes when submitting the prospectus.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'Wire transfer and escrow arrangements are standard for high-value acquisitions. Specific terms are agreed between buyer and custodian.',
  },
];

const SELLER_FAQS: FaqItem[] = [
  {
    q: 'How do I list an asset?',
    a: 'Contact our onboarding team via the concierge line. You will be guided through the custodian verification process and documentation requirements.',
  },
  {
    q: 'What documentation is required?',
    a: 'Appraisal certificate from an accredited appraiser, provenance records, and identity verification. Specific requirements vary by asset category.',
  },
  {
    q: 'Is there a listing fee?',
    a: 'Listing is by invitation or application. A platform commission applies on completed transactions. Contact the concierge team for the current fee schedule.',
  },
  {
    q: 'How are inquiries delivered to me?',
    a: 'Prospectus requests are forwarded directly to your registered contact email. You decide whether to proceed with each inquiry.',
  },
];

function FaqSection({ items, searchQuery }: { items: FaqItem[]; searchQuery: string }) {
  const filtered = searchQuery
    ? items.filter(
        (item) =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : items;

  if (filtered.length === 0) return null;

  return (
    <div>
      {filtered.map((item) => (
        <details key={item.q} className="ce-faq-item">
          <summary className="ce-faq-summary">
            {item.q}
            <svg className="ce-faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </summary>
          <p className="ce-faq-answer">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export default function FaqPage() {
  const themeLink = useClassifiedsThemeLink();
  const [searchQuery, setSearchQuery] = useState('');

  const hasResults =
    BUYER_FAQS.some(
      (item) =>
        !searchQuery ||
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase()),
    ) ||
    SELLER_FAQS.some(
      (item) =>
        !searchQuery ||
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  return (
    <div className="ce-static-page">

      <div className="ce-static-hero">
        <div className="ce-static-kicker">Help & Advisory</div>
        <h1>Frequently asked questions</h1>
        <p>Answers to common acquisition and custodian questions.</p>
        <input
          className="ce-faq-search"
          type="search"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search FAQ"
        />
      </div>

      {!hasResults ? (
        <p style={{ color: 'var(--prem-muted)', padding: '2rem 0' }}>
          No questions match &quot;{searchQuery}&quot;.
        </p>
      ) : (
        <>
          {(!searchQuery ||
            BUYER_FAQS.some(
              (item) =>
                item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.a.toLowerCase().includes(searchQuery.toLowerCase()),
            )) && (
            <section aria-labelledby="ce-faq-buyers">
              <div className="ce-faq-section-title" id="ce-faq-buyers">For Buyers & Investors</div>
              <FaqSection items={BUYER_FAQS} searchQuery={searchQuery} />
            </section>
          )}

          {(!searchQuery ||
            SELLER_FAQS.some(
              (item) =>
                item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.a.toLowerCase().includes(searchQuery.toLowerCase()),
            )) && (
            <section aria-labelledby="ce-faq-sellers">
              <div className="ce-faq-section-title" id="ce-faq-sellers">For Custodians & Sellers</div>
              <FaqSection items={SELLER_FAQS} searchQuery={searchQuery} />
            </section>
          )}
        </>
      )}

      <div className="ce-static-cta">
        <h2>Still have questions?</h2>
        <p>Our concierge team typically responds within one business day.</p>
        <a href={themeLink('/contact')} className="elite-modal-cta" style={{ textDecoration: 'none' }}>Contact the concierge</a>
      </div>

    </div>
  );
}
