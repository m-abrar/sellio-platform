'use client';

import React, { useState } from 'react';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useRentalThemeLink } from './hooks/useRentalThemeLink';
import { FaqAccordion } from './components/FaqAccordion';

const TENANT_FAQS = [
  { question: 'What is the minimum lease term?', answer: '30 days, as set by each individual landlord. Some properties allow longer-term stays with discounted rates.' },
  { question: 'How do I apply for a rental?', answer: 'Fill out the inquiry form on any listing page. The landlord will review your application and respond within 48 hours.' },
  { question: 'Is my deposit refundable?', answer: 'Deposit policy varies by landlord and is clearly displayed on each listing before you apply.' },
  { question: 'Can I sub-let the property?', answer: 'Sub-letting is not permitted by default. Check the individual lease terms for each property.' },
  { question: 'What payment methods are accepted?', answer: 'All major credit and debit cards, plus bank transfer via our secure checkout. PayPal is accepted where available.' },
  { question: 'How long does application review take?', answer: 'Most landlords respond within 48 hours. You will receive an email notification as soon as your application is reviewed.' },
  { question: 'Can I tour the property before applying?', answer: 'Yes — contact the landlord directly through the listing inquiry form to arrange a viewing before submitting your application.' },
];

const LANDLORD_FAQS = [
  { question: 'How do I list my property?', answer: 'Log in to your account, go to Admin > Properties > Create, and follow the guided listing wizard.' },
  { question: 'Is there a listing fee?', answer: 'No upfront fee. A commission applies only when a lease is successfully completed through the platform.' },
  { question: 'How are tenants verified?', answer: 'Identity verification is handled at checkout. Tenants must provide valid ID and payment details before a booking is confirmed.' },
  { question: 'Can I set my own lease terms and add-ons?', answer: 'Yes. Lease duration, add-ons (parking, fiber, storage), and house rules are all fully configurable in your admin dashboard.' },
  { question: 'How do I manage bookings?', answer: 'All bookings and inquiries appear in your Admin dashboard under Bookings. You will also receive email notifications for each new inquiry.' },
];

export default function FaqPage() {
  const themeLink = useRentalThemeLink();

  const kicker = useThemeContent('faq.kicker', 'Support');
  const title = useThemeContent('faq.title', 'Frequently asked questions.');
  const lead = useThemeContent('faq.lead', 'Everything you need to know about renting through RentEase.');
  const tenantSectionTitle = useThemeContent('faq.tenant_section_title', 'For tenants');
  const landlordSectionTitle = useThemeContent('faq.landlord_section_title', 'For landlords');
  const ctaText = useThemeContent('faq.cta_text', 'Still have questions? Contact our team.');
  const ctaLabel = useThemeContent('faq.cta_label', 'Contact us');

  const [search, setSearch] = useState('');
  const query = search.toLowerCase().trim();

  const filteredTenant = query
    ? TENANT_FAQS.filter((f) => f.question.toLowerCase().includes(query) || f.answer.toLowerCase().includes(query))
    : TENANT_FAQS;

  const filteredLandlord = query
    ? LANDLORD_FAQS.filter((f) => f.question.toLowerCase().includes(query) || f.answer.toLowerCase().includes(query))
    : LANDLORD_FAQS;

  return (
    <div className="pr-faq-page">
      <section className="pr-faq-hero">
        <span className="pr-kicker">{kicker}</span>
        <h1 className="pr-faq-title">{title}</h1>
        <p className="pr-faq-lead">{lead}</p>
        <div className="pr-faq-search-wrap">
          <input
            className="pr-faq-search"
            type="search"
            placeholder="Search questions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search FAQ"
          />
        </div>
      </section>

      <div className="pr-faq-body">
        {filteredTenant.length > 0 && (
          <section className="pr-faq-section">
            <h2 className="pr-faq-section-title">{tenantSectionTitle}</h2>
            <FaqAccordion items={filteredTenant} />
          </section>
        )}
        {filteredLandlord.length > 0 && (
          <section className="pr-faq-section">
            <h2 className="pr-faq-section-title">{landlordSectionTitle}</h2>
            <FaqAccordion items={filteredLandlord} />
          </section>
        )}
        {filteredTenant.length === 0 && filteredLandlord.length === 0 && (
          <p className="pr-faq-empty">No questions match your search.</p>
        )}
      </div>

      <div className="pr-cta-panel pr-faq-cta">
        <p className="pr-faq-cta__text">{ctaText}</p>
        <a href={themeLink('/contact')} className="pr-btn-primary">{ctaLabel}</a>
      </div>
    </div>
  );
}
