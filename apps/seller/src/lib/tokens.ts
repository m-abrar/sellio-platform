/**
 * Design tokens — JS/TS side.
 *
 * Use these for values that live in React code (inline styles, SVG attrs,
 * chart library props, motion configs) rather than Tailwind class strings.
 * Tailwind-class-based tokens live in index.css @theme.
 */

/* ── Brand ──────────────────────────────────────────── */
export const BRAND = {
  DEFAULT: '#6610f2',
  HOVER:   '#7b2dfd',
  LIGHT:   '#8b5cf6',
  DIM:     'rgba(102, 16, 242, 0.08)',
} as const;

/* ── Chart colors ────────────────────────────────────── */
export const CHART_COLORS = {
  views:     '#6610f2',
  leads:     '#10b981',
  secondary: '#f59e0b',
  tertiary:  '#3b82f6',
  danger:    '#ef4444',
} as const;

/* ── Shadows (for inline style= usage) ──────────────── */
export const SHADOWS = {
  card:       '0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.04)',
  cardHover:  '0 4px 16px rgba(0,0,0,0.07), 0 16px 48px rgba(0,0,0,0.05)',
  elite:      '0 20px 50px rgba(0,0,0,0.04)',
  cta:        '0 8px 24px rgba(102,16,242,0.28)',
  sidebar:    '0 0 0 1px rgba(0,0,0,0.04), 0 24px 60px rgba(0,0,0,0.06)',
  dropdown:   '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
  navActive:  '0 1px 4px rgba(0,0,0,0.07)',
  brandGlow:  '0 8px 32px rgba(102,16,242,0.20)',
} as const;

/* ── Border radii (for inline style= usage) ──────────── */
export const RADII = {
  container:   '2.5rem',   /* 40px  – sidebar, shells */
  floating:    '3rem',     /* 48px  – mobile overlays */
  cardLg:      '2rem',     /* 32px  – large cards */
  card:        '1.75rem',  /* 28px  – standard cards */
  cardSm:      '1.5rem',   /* 24px  – nested cards */
  inner:       '1.2rem',   /* 19px  – inner elements */
  interactive: '0.875rem', /* 14px  – buttons, inputs */
  badge:       '0.625rem', /* 10px  – pills, tags */
} as const;

/* ── Motion presets (for motion/framer-motion) ─────── */
export const MOTION = {
  spring: {
    type: 'spring' as const,
    damping: 28,
    stiffness: 260,
  },
  springFast: {
    type: 'spring' as const,
    damping: 32,
    stiffness: 320,
  },
  ease: {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1] as const,
  },
  easeSlow: {
    duration: 0.35,
    ease: [0.16, 1, 0.3, 1] as const,
  },
} as const;

/* ── Typography scale (for inline / dynamic usage) ───── */
export const TYPE = {
  display:  '3rem',
  title:    '1.75rem',
  heroNum:  '2.1rem',
  caption:  '0.6875rem', /* 11px */
  nav:      '0.8125rem', /* 13px */
  label:    '0.625rem',  /* 10px */
  micro:    '0.5625rem', /* 9px  */
  tiny:     '0.5rem',    /* 8px  */
} as const;
