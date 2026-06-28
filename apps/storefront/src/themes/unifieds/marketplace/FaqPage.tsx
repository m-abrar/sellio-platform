'use client';

import React, { useState } from 'react';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';

type FaqItem = { q: string; a: string };

const BUYER_FAQS: FaqItem[] = [
  {
    q: 'What can I buy on MarketHub?',
    a: 'Products, properties, vehicles, services, jobs, events, and classifieds — all from one platform with a single unified checkout.',
  },
  {
    q: 'How do I search across all verticals?',
    a: 'Use the search bar at the top of any page. Select a vertical from the dropdown to narrow your results, or browse the Explore page to filter by category and price.',
  },
  {
    q: 'Is there one checkout for everything?',
    a: 'Yes. Add any listing to your cart and check out once, regardless of the vertical. Your order history covers everything you buy across the marketplace.',
  },
  {
    q: 'How do I know sellers are verified?',
    a: 'All sellers go through ID verification before their listings go live. Look for the Verified badge on listing detail pages.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'All major credit and debit cards. Bank transfer is also available for high-value items and properties.',
  },
  {
    q: 'Can I return a purchased item?',
    a: 'Returns depend on the seller\'s policy, which is shown on each listing page before checkout. Contact the seller directly for return requests.',
  },
  {
    q: 'How do I contact a seller?',
    a: 'Use the inquiry form on the listing detail page. For services, use the booking form to schedule or request a quote.',
  },
  {
    q: 'Are event tickets refundable?',
    a: 'Refund policies are set per event by the organizer. Check the event listing for details before purchasing.',
  },
];

const SELLER_FAQS: FaqItem[] = [
  {
    q: 'How do I list on MarketHub?',
    a: 'Log in to your account, go to Admin → Create Listing, and choose your vertical. Your listing will be reviewed and published within 24 hours.',
  },
  {
    q: 'Which verticals can I list in?',
    a: 'All 7: Products, Properties, Autos, Services, Jobs, Events, and Classifieds. You can have active listings across multiple verticals simultaneously.',
  },
  {
    q: 'Is there a listing fee?',
    a: 'No upfront fee. A platform commission applies on completed transactions. See our pricing page for details.',
  },
  {
    q: 'How do buyers find my listing?',
    a: 'Listings appear in both vertical-specific browse pages and the unified marketplace search. Verified listings receive additional visibility.',
  },
  {
    q: 'How do I manage orders and inquiries?',
    a: 'Through your Admin dashboard under Orders and Inquiries. You\'ll receive email notifications for new activity.',
  },
  {
    q: 'Can I list in multiple verticals?',
    a: 'Yes, you can have active listings across all 7 verticals simultaneously. Manage them all from one Admin dashboard.',
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
    <div className="um-faq-accordion">
      {filtered.map((item) => (
        <details key={item.q} className="um-faq-item">
          <summary className="um-faq-summary">
            {item.q}
            <svg className="um-faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </summary>
          <p className="um-faq-answer">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export default function FaqPage() {
  const themeLink = useUnifiedThemeLink();
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
    <div className="um-static-page">

      <section className="um-faq-hero" aria-labelledby="um-faq-title">
        <div className="um-section-kicker">Help center</div>
        <h1 id="um-faq-title">Frequently asked questions</h1>
        <input
          className="um-faq-search"
          type="search"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search FAQ"
        />
      </section>

      {!hasResults ? (
        <p style={{ color: 'var(--um-muted)', padding: '2rem 0' }}>
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
            <section aria-labelledby="um-faq-buyers">
              <div className="um-faq-section-title" id="um-faq-buyers">For Buyers</div>
              <FaqSection items={BUYER_FAQS} searchQuery={searchQuery} />
            </section>
          )}

          {(!searchQuery ||
            SELLER_FAQS.some(
              (item) =>
                item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.a.toLowerCase().includes(searchQuery.toLowerCase()),
            )) && (
            <section aria-labelledby="um-faq-sellers">
              <div className="um-faq-section-title" id="um-faq-sellers">For Sellers</div>
              <FaqSection items={SELLER_FAQS} searchQuery={searchQuery} />
            </section>
          )}
        </>
      )}

      <div className="um-faq-cta">
        <h2>Still have questions?</h2>
        <p>Our support team typically responds within 24 hours.</p>
        <a className="um-btn-primary" href={themeLink('/contact')}>Contact support</a>
      </div>

    </div>
  );
}
