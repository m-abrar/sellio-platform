'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Testimonial } from '@sellio/types';
import { useMenuContext } from '@/components/menu/MenuProvider';

type TestimonialVariant = 'default' | 'luxury' | 'editorial' | 'centered';

interface FallbackTestimonial {
  id: string | number;
  quote: string;
  author_name: string;
  author_title?: string;
  company?: string;
}

interface DynamicTestimonialsProps {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  limit?: number;
  variant?: TestimonialVariant;
  quoteDecor?: 'none' | 'local' | 'creative';
  sectionId?: string;
  sectionClassName?: string;
  sectionStyle?: React.CSSProperties;
  titleWrapClassName?: string;
  titleClassName?: string;
  titleStyle?: React.CSSProperties;
  layoutClassName?: string;
  cardClassName?: string;
  headingId?: string;
  fallbackTestimonials?: FallbackTestimonial[];
}

function formatAuthorMeta(testimonial: Testimonial): string {
  return [testimonial.author_title, testimonial.company].filter(Boolean).join(', ');
}

function AuthorAvatar({ testimonial, className }: { testimonial: Testimonial; className?: string }) {
  if (testimonial.avatar_url) {
    return (
      <img
        src={testimonial.avatar_url}
        alt={testimonial.author_name}
        className={className}
        style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={className}
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
  );
}

function DefaultCard({ testimonial, cardClassName }: { testimonial: Testimonial; cardClassName?: string }) {
  return (
    <article className={cardClassName}>
      <p style={{ fontStyle: 'italic', fontSize: '1.1rem', color: '#555', marginBottom: '1.5rem', lineHeight: 1.8 }}>
        &quot;{testimonial.quote}&quot;
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <AuthorAvatar testimonial={testimonial} />
        <div>
          <p style={{ fontWeight: 600, color: 'var(--sc-dark, #111827)', margin: 0 }}>{testimonial.author_name}</p>
          <p style={{ fontSize: '0.9rem', color: '#777', margin: 0 }}>{formatAuthorMeta(testimonial)}</p>
        </div>
      </div>
    </article>
  );
}

function LuxuryCard({ testimonial, cardClassName }: { testimonial: Testimonial; cardClassName?: string }) {
  return (
    <article className={cardClassName}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
        <AuthorAvatar
          testimonial={testimonial}
          className="lx-testimonial-avatar"
        />
        <div>
          <h5 style={{ fontWeight: 700, margin: 0 }}>{testimonial.author_name}</h5>
          <small style={{ color: 'var(--lx-text-muted)' }}>{testimonial.author_title}</small>
        </div>
      </div>
      <p style={{ fontStyle: 'italic', lineHeight: 1.6 }}>&quot;{testimonial.quote}&quot;</p>
    </article>
  );
}

function EditorialCard({ testimonial, cardClassName }: { testimonial: Testimonial; cardClassName?: string }) {
  return (
    <article
      className={cardClassName}
      style={{ padding: '2.5rem', background: 'var(--pc-white)', border: '1px solid var(--pc-border)', position: 'relative' }}
    >
      <p style={{ fontStyle: 'italic', fontSize: '1.2rem', marginBottom: '3rem', lineHeight: 1.7, color: 'var(--pc-teal)' }}>
        &quot;{testimonial.quote}&quot;
      </p>
      <div>
        <div style={{ fontWeight: 800, fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--pc-teal)' }}>
          {testimonial.author_name.toUpperCase()}
        </div>
        <div style={{ fontSize: '0.65rem', color: 'var(--pc-text-muted)', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {formatAuthorMeta(testimonial)}
        </div>
      </div>
    </article>
  );
}

function CenteredCard({
  testimonial,
  cardClassName,
  quoteDecor = 'none',
}: {
  testimonial: Testimonial;
  cardClassName?: string;
  quoteDecor?: 'none' | 'local' | 'creative';
}) {
  return (
    <article className={cardClassName}>
      {quoteDecor === 'local' && (
        <div style={{ fontSize: '3rem', color: 'var(--local-yellow)', marginBottom: '1.5rem', lineHeight: 1 }}>&quot;</div>
      )}
      {quoteDecor === 'creative' && (
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }} className="gradient-text">&quot;</div>
      )}
      <p
        style={{
          fontSize: '1.25rem',
          fontStyle: 'italic',
          marginBottom: '2rem',
          lineHeight: quoteDecor === 'local' ? 1.6 : 1.7,
          color: quoteDecor === 'local' ? 'var(--local-text-muted)' : quoteDecor === 'none' ? 'var(--sm-text-muted)' : 'inherit',
        }}
      >
        &quot;{testimonial.quote}&quot;
      </p>
      <p style={{ fontWeight: 700, fontSize: quoteDecor === 'none' ? '1rem' : undefined, color: quoteDecor === 'none' ? 'var(--sm-text, #0f172a)' : undefined }}>
        {quoteDecor === 'none' ? (
          <>
            {testimonial.author_name}
            {formatAuthorMeta(testimonial) && (
              <span style={{ color: 'var(--sm-text-muted, #64748b)', fontWeight: 400 }}> · {formatAuthorMeta(testimonial)}</span>
            )}
          </>
        ) : quoteDecor === 'creative' ? (
          <>
            {testimonial.author_name}
            {formatAuthorMeta(testimonial) && (
              <span style={{ color: 'var(--crtv-text)', fontWeight: 400, opacity: 0.7 }}> - {formatAuthorMeta(testimonial)}</span>
            )}
          </>
        ) : (
          <>- {testimonial.author_name}{formatAuthorMeta(testimonial) ? ` (${formatAuthorMeta(testimonial)})` : ''}</>
        )}
      </p>
    </article>
  );
}

function TestimonialCard({
  testimonial,
  variant,
  cardClassName,
  quoteDecor,
}: {
  testimonial: Testimonial;
  variant: TestimonialVariant;
  cardClassName?: string;
  quoteDecor?: 'none' | 'local' | 'creative';
}) {
  switch (variant) {
    case 'luxury':
      return <LuxuryCard testimonial={testimonial} cardClassName={cardClassName} />;
    case 'editorial':
      return <EditorialCard testimonial={testimonial} cardClassName={cardClassName} />;
    case 'centered':
      return <CenteredCard testimonial={testimonial} cardClassName={cardClassName} quoteDecor={quoteDecor} />;
    default:
      return <DefaultCard testimonial={testimonial} cardClassName={cardClassName} />;
  }
}

export function DynamicTestimonials({
  title = 'What Our Clients Say',
  subtitle,
  eyebrow,
  limit = 6,
  variant = 'default',
  quoteDecor = 'none',
  sectionId = 'testimonials',
  sectionClassName,
  sectionStyle,
  titleWrapClassName,
  titleClassName,
  titleStyle,
  layoutClassName,
  cardClassName,
  headingId = 'testimonials-title',
  fallbackTestimonials,
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

  const activeTestimonials: Testimonial[] =
    !loading && testimonials.length === 0 && fallbackTestimonials
      ? fallbackTestimonials.map((f, i) => ({
          id: Number(f.id) || -(i + 1),
          quote: f.quote,
          author_name: f.author_name,
          author_title: f.author_title ?? null,
          company: f.company ?? null,
          avatar_url: null,
          rating: null,
          status: 'published' as const,
          sort_order: i,
        }))
      : testimonials;

  if (loading || activeTestimonials.length === 0) {
    return null;
  }

  const TitleTag = variant === 'editorial' ? 'h3' : 'h2';
  const titleBlock = (
    <div className={titleWrapClassName} style={variant === 'editorial' ? { textAlign: 'center', marginBottom: '8rem' } : undefined}>
      {eyebrow && (
        <div className="pc-caps" style={{ color: 'var(--pc-teal)', marginBottom: '1.5rem', opacity: 0.4 }}>
          {eyebrow}
        </div>
      )}
      <TitleTag id={headingId} className={titleClassName} style={titleStyle}>
        {title}
      </TitleTag>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );

  return (
    <section id={sectionId} className={sectionClassName} style={sectionStyle} aria-labelledby={headingId}>
      {variant === 'editorial' ? (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {titleBlock}
          <div className={layoutClassName}>
            {activeTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                variant={variant}
                cardClassName={cardClassName}
                quoteDecor={quoteDecor}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {titleBlock}
          <div className={layoutClassName}>
            {activeTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                variant={variant}
                cardClassName={cardClassName}
                quoteDecor={quoteDecor}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
