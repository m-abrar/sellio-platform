'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Testimonial } from '@sellio/types';
import { useMenuContext } from '@/components/menu/MenuProvider';

interface DynamicTestimonialsProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  sectionId?: string;
  sectionClassName?: string;
  titleWrapClassName?: string;
  layoutClassName?: string;
  cardClassName?: string;
  headingId?: string;
}

export function DynamicTestimonials({
  title = 'What Our Clients Say',
  subtitle,
  limit = 6,
  sectionId = 'testimonials',
  sectionClassName,
  titleWrapClassName,
  layoutClassName,
  cardClassName,
  headingId = 'testimonials-title',
}: DynamicTestimonialsProps) {
  const { themeKey } = useMenuContext();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadTestimonials() {
      try {
        const records = await api.getTestimonials(themeKey, limit);
        if (isMounted) {
          setTestimonials(records);
        }
      } catch (error) {
        console.error('Failed to load testimonials:', error);
        if (isMounted) {
          setTestimonials([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTestimonials();

    return () => {
      isMounted = false;
    };
  }, [themeKey, limit]);

  if (loading || testimonials.length === 0) {
    return null;
  }

  return (
    <section id={sectionId} className={sectionClassName} aria-labelledby={headingId}>
      <div className={titleWrapClassName}>
        <h2 id={headingId}>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className={layoutClassName}>
        {testimonials.map((testimonial) => (
          <article key={testimonial.id} className={cardClassName}>
            <p style={{ fontStyle: 'italic', fontSize: '1.1rem', color: '#555', marginBottom: '1.5rem', lineHeight: 1.8 }}>
              &quot;{testimonial.quote}&quot;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {testimonial.avatar_url ? (
                <img
                  src={testimonial.avatar_url}
                  alt={testimonial.author_name}
                  style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  aria-hidden="true"
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#eef2ff',
                    color: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  {testimonial.author_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p style={{ fontWeight: 600, color: 'var(--sc-dark, #111827)', margin: 0 }}>{testimonial.author_name}</p>
                <p style={{ fontSize: '0.9rem', color: '#777', margin: 0 }}>
                  {[testimonial.author_title, testimonial.company].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
