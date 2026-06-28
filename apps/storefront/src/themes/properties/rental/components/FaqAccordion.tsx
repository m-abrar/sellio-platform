'use client';

import React from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div className="pr-faq-accordion">
      {items.map(({ question, answer }, index) => (
        <details key={index} className="pr-faq-item">
          <summary className="pr-faq-summary">
            <span>{question}</span>
            <span className="pr-faq-chevron" aria-hidden="true">▾</span>
          </summary>
          <p className="pr-faq-answer">{answer}</p>
        </details>
      ))}
    </div>
  );
}
