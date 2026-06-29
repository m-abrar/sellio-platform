'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Category } from '@/types';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { VERTICALS, type Vertical } from '@/themes/unifieds/shared/multiVertical';

// ─── Types ─────────────────────────────────────────────────────────────────────

type SearchTab = 'smart' | Vertical;

export interface HeroSearchModuleProps {
  categories: Category[];
  themeLink: (path: string) => string;
  inventoryTotal: number | null;
  isLoading?: boolean;
}

interface AiResult {
  module: string;
  summary: string;
  redirect_url: string;
}

// ─── Inline SVGs ───────────────────────────────────────────────────────────────

const SearchSvg = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const StarsSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    {/* 4-pointed diamond star — primary sparkle */}
    <path d="M12 2L13.7 10.3L22 12L13.7 13.7L12 22L10.3 13.7L2 12L10.3 10.3Z"/>
    {/* Small secondary sparkle top-right */}
    <path d="M20 3L20.6 5.4L23 6L20.6 6.6L20 9L19.4 6.6L17 6L19.4 5.4Z"/>
    {/* Tiny accent dot lower-left */}
    <circle cx="4.5" cy="19.5" r="1.3"/>
  </svg>
);
const MicSvg  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>;
const WandSvg     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M17.8 6.2 19 5"/><path d="M3 21l9-9"/><path d="M12.2 6.2 11 5"/></svg>;
const CalendarSvg = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const ChevronLeftSvg  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevronRightSvg = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>;
const ClockSvg    = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const TrendingSvg = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const XSvg = () => <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const ArrowSvg = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const ShieldSvg = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>;
const LockSvg = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const EyeSvg  = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;

const VERTICAL_TAB_ICONS: Record<Vertical, React.ReactNode> = {
  properties: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 22V12h6v10M9 7h1M14 7h1"/></svg>,
  autos:      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14l4 4v4a2 2 0 0 1-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>,
  products:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  services:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  jobs:       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  events:     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  classifieds:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
};

// ─── API helper ────────────────────────────────────────────────────────────────

function getApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname === 'localhost' ? '127.0.0.1' : window.location.hostname;
    return `http://${host}:8000/api`;
  }
  return 'http://127.0.0.1:8000/api';
}

// ─── AI Search examples / thinking messages ────────────────────────────────────

const AI_EXAMPLES = [
  '3-bedroom house near downtown under $500k with a pool',
  'Used Tesla Model 3 under 30k miles, automatic',
  'Remote software engineer jobs paying above $120k',
  'Weekend music festival tickets in the city',
  'Professional photography services with portfolio',
  'Vintage furniture and antiques for sale locally',
  'Electric SUV lease under $600/month',
];

const AI_THINKING_MSGS = [
  'Hold tight — good things take a second…',
  'Searching the marketplace…',
  'Finding the best matches for you…',
  'Parsing your query with AI…',
];

// ─── Smart Search Pane ─────────────────────────────────────────────────────────

function SmartSearchPane({ themeLink }: { themeLink: (p: string) => string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const redirectBarRef = useRef<HTMLDivElement>(null);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<AiResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [thinkingMsg, setThinkingMsg] = useState('');
  const [recents, setRecents] = useState<string[]>([]);
  const [trending, setTrending] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [hasSpeech, setHasSpeech] = useState(false);

  // Check for Speech API
  useEffect(() => {
    setHasSpeech(typeof window !== 'undefined' && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
  }, []);

  // Load recents + trending on mount
  useEffect(() => {
    const base = getApiBase();
    fetch(`${base}/v1/smart-search/recents`, { credentials: 'include', headers: { Accept: 'application/json' } })
      .then(r => r.ok ? r.json() : [])
      .then((d: unknown) => setRecents(Array.isArray(d) ? (d as string[]).slice(0, 5) : []))
      .catch(() => {});
    fetch(`${base}/v1/smart-search/trending`, { credentials: 'include', headers: { Accept: 'application/json' } })
      .then(r => r.ok ? r.json() : [])
      .then((d: unknown) => setTrending(Array.isArray(d) ? (d as string[]).slice(0, 5) : []))
      .catch(() => {});
  }, []);

  // Cycling placeholder typewriter
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const el = input;
    let cancelled = false;
    let exIdx = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    function stopTimer() { if (timer) clearTimeout(timer); }

    function typeIn(text: string, i = 0) {
      if (cancelled || document.activeElement === el || el.value) return;
      el.placeholder = text.slice(0, i);
      if (i < text.length) {
        timer = setTimeout(() => typeIn(text, i + 1), 38);
      } else {
        timer = setTimeout(() => eraseOut(text, text.length), 2600);
      }
    }

    function eraseOut(text: string, len: number) {
      if (cancelled || document.activeElement === el || el.value) return;
      el.placeholder = text.slice(0, len);
      if (len > 0) {
        timer = setTimeout(() => eraseOut(text, len - 1), 18);
      } else {
        exIdx = (exIdx + 1) % AI_EXAMPLES.length;
        timer = setTimeout(() => typeIn(AI_EXAMPLES[exIdx], 0), 350);
      }
    }

    const onFocus = () => { stopTimer(); el.placeholder = ''; };
    const onBlur  = () => { if (!el.value.trim()) timer = setTimeout(() => typeIn(AI_EXAMPLES[exIdx], 0), 500); };

    el.addEventListener('focus', onFocus);
    el.addEventListener('blur', onBlur);
    timer = setTimeout(() => typeIn(AI_EXAMPLES[0], 0), 900);

    return () => {
      cancelled = true;
      stopTimer();
      el.removeEventListener('focus', onFocus);
      el.removeEventListener('blur', onBlur);
    };
  }, []);

  const startRedirect = useCallback((url: string) => {
    if (!url) return;
    const DELAY = 2200;
    const bar = redirectBarRef.current;
    if (bar) {
      bar.style.transition = 'none';
      bar.style.width = '0%';
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (bar) { bar.style.transition = `width ${DELAY}ms linear`; bar.style.width = '100%'; }
        }),
      );
    }
    redirectTimerRef.current = setTimeout(() => { window.location.href = url; }, DELAY);
  }, []);

  const cancelRedirect = useCallback(() => {
    if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    const bar = redirectBarRef.current;
    if (bar) { bar.style.transition = 'none'; bar.style.width = '0%'; }
  }, []);

  async function run(overrideQuery?: string) {
    const q = (overrideQuery ?? inputRef.current?.value ?? '').trim();
    if (!q) { inputRef.current?.focus(); return; }
    cancelRedirect();
    setBusy(true);
    setResult(null);
    setAiError(null);
    setThinkingMsg(AI_THINKING_MSGS[Math.floor(Math.random() * AI_THINKING_MSGS.length)]);
    try {
      const res = await fetch(`${getApiBase()}/v1/smart-search/parse`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ q }),
      });
      const data = await res.json() as AiResult & { error?: string };
      if (data.error) throw new Error(data.error);
      setResult(data);
      startRedirect(data.redirect_url);
      // Refresh recents silently
      fetch(`${getApiBase()}/v1/smart-search/recents`, { credentials: 'include', headers: { Accept: 'application/json' } })
        .then(r => r.ok ? r.json() : [])
        .then((d: unknown) => setRecents(Array.isArray(d) ? (d as string[]).slice(0, 5) : []))
        .catch(() => {});
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  function clearRecent(q: string) {
    fetch(`${getApiBase()}/v1/smart-search/recents/clear`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ q }),
    }).then(() => setRecents(prev => prev.filter(r => r !== q))).catch(() => {});
  }

  function clearAllRecents() {
    fetch(`${getApiBase()}/v1/smart-search/recents/clear`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({}),
    }).then(() => setRecents([])).catch(() => {});
  }

  function startVoice() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = document.documentElement.lang || 'en-US';
    recognition.onstart = () => {
      setIsListening(true);
      if (inputRef.current) { inputRef.current.value = ''; inputRef.current.placeholder = 'Listening…'; }
    };
    recognition.onresult = (e: any) => {
      let t = '';
      for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript;
      if (inputRef.current) inputRef.current.value = t;
    };
    recognition.onend = () => {
      setIsListening(false);
      const val = inputRef.current?.value?.trim();
      if (val) run(val);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  }

  const showPanel = !busy && (result || aiError);

  return (
    <div className="ud-ai-pane">
      {/* Input row */}
      <div className="ud-hsf-main-row">
        <div className={`ud-hsf-input-wrap ud-hsf-input-wrap--ai${isListening ? ' is-listening' : ''}`}>
          <span className="ud-hsf-icon ud-hsf-icon--ai"><WandSvg /></span>
          <input
            ref={inputRef}
            type="text"
            className="ud-hsf-input ud-hsf-input--ai"
            autoComplete="off"
            aria-label="AI search query"
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); run(); } }}
          />
          {hasSpeech && (
            <button
              type="button"
              className={`ud-ai-mic-btn${isListening ? ' ud-ai-mic-btn--listening' : ''}`}
              aria-label={isListening ? 'Listening… click to stop' : 'Search by voice'}
              onClick={startVoice}
            >
              <MicSvg />
            </button>
          )}
        </div>
        <button
          type="button"
          className="ud-hsf-submit-btn ud-hsf-submit-btn--ai"
          disabled={busy}
          onClick={() => run()}
        >
          {busy
            ? <><span className="ud-ai-spinner" aria-hidden="true" /> Searching…</>
            : <><ArrowSvg /> Search</>}
        </button>
      </div>

      {/* Thinking */}
      {busy && (
        <div className="ud-ai-thinking-panel" role="status" aria-live="polite">
          <span className="ud-ai-dot" /><span className="ud-ai-dot" /><span className="ud-ai-dot" />
          <span className="ud-ai-thinking-label">{thinkingMsg}</span>
        </div>
      )}

      {/* Summary / Error */}
      {showPanel && (
        <div className="ud-ai-summary-panel">
          <div className="ud-ai-summary-body">
            <span className={`ud-ai-summary-badge${result ? ` ud-ai-badge--${result.module}` : ' ud-ai-badge--error'}`}>
              {result ? result.module.charAt(0).toUpperCase() + result.module.slice(1) : 'Error'}
            </span>
            <p className="ud-ai-summary-text" aria-live="polite">
              {result?.summary ?? aiError}
            </p>
            {result?.redirect_url && (
              <button
                type="button"
                className="ud-ai-go-btn"
                aria-label="Go to results now"
                onClick={() => { cancelRedirect(); window.location.href = result.redirect_url; }}
              >
                <ArrowSvg />
              </button>
            )}
          </div>
          {result?.redirect_url && (
            <>
              <div className="ud-ai-redirect-track">
                <div ref={redirectBarRef} className="ud-ai-redirect-bar" />
              </div>
              <p className="ud-ai-redirect-label">Taking you to results…</p>
            </>
          )}
        </div>
      )}

      {/* Recents */}
      {recents.length > 0 && (
        <div className="ud-ai-chips-row">
          <span className="ud-ai-chips-label"><ClockSvg /> Recent</span>
          <div className="ud-ai-chips">
            {recents.map(q => (
              <span key={q} className="ud-ai-chip">
                <button
                  type="button"
                  className="ud-ai-chip-text"
                  onClick={() => { if (inputRef.current) inputRef.current.value = q; run(q); }}
                >
                  {q.length > 34 ? q.slice(0, 32) + '…' : q}
                </button>
                <button type="button" className="ud-ai-chip-remove" aria-label="Remove" onClick={() => clearRecent(q)}>
                  <XSvg />
                </button>
              </span>
            ))}
            <button type="button" className="ud-ai-clear-all" onClick={clearAllRecents}>Clear all</button>
          </div>
        </div>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <div className="ud-ai-chips-row">
          <span className="ud-ai-chips-label"><TrendingSvg /> Trending</span>
          <div className="ud-ai-chips">
            {trending.map(q => (
              <span key={q} className="ud-ai-chip ud-ai-chip--trending">
                <button
                  type="button"
                  className="ud-ai-chip-text"
                  onClick={() => { if (inputRef.current) inputRef.current.value = q; run(q); }}
                >
                  {q.length > 34 ? q.slice(0, 32) + '…' : q}
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Hint when empty */}
      {!showPanel && !busy && recents.length === 0 && trending.length === 0 && (
        <p className="ud-ai-hint">Your next great find is one sentence away.</p>
      )}
    </div>
  );
}

// ─── Per-Vertical Search Pane ──────────────────────────────────────────────────

type VerticalFilter =
  | { type: 'select'; name: string; placeholder: string; options: { value: string; label: string }[] }
  | { type: 'categories'; name: string; placeholder: string }
  | { type: 'price-range'; nameMin: string; nameMax: string }
  | { type: 'date'; name: string };

interface VerticalPaneConfig {
  placeholder: string;
  qParam: string;
  submitLabel: string;
  filters: VerticalFilter[];
}

const PANE_CONFIG: Record<Vertical, VerticalPaneConfig> = {
  properties: {
    placeholder: 'Address, city, or ZIP code…', qParam: 'q', submitLabel: 'Search',
    filters: [
      { type: 'select', name: 'property_type', placeholder: 'Buy or Rent', options: [{ value: 'sale', label: 'For Sale' }, { value: 'rental', label: 'For Rent' }] },
      { type: 'categories', name: 'category', placeholder: 'Any Type' },
      { type: 'price-range', nameMin: 'min_price', nameMax: 'max_price' },
    ],
  },
  autos: {
    placeholder: 'Make, brand, or model…', qParam: 'q', submitLabel: 'Find Cars',
    filters: [
      { type: 'select', name: 'type', placeholder: 'Sale or Lease', options: [{ value: 'selling', label: 'For Sale' }, { value: 'lease', label: 'Lease' }] },
      { type: 'select', name: 'transmission', placeholder: 'Any Transmission', options: [{ value: 'Automatic', label: 'Automatic' }, { value: 'Manual', label: 'Manual' }] },
      { type: 'categories', name: 'category', placeholder: 'Any Category' },
    ],
  },
  products: {
    placeholder: 'Products, brands, or categories…', qParam: 'q', submitLabel: 'Shop',
    filters: [
      { type: 'categories', name: 'category', placeholder: 'All Categories' },
      { type: 'price-range', nameMin: 'min_price', nameMax: 'max_price' },
    ],
  },
  services: {
    placeholder: 'What service do you need?', qParam: 'search', submitLabel: 'Find Pros',
    filters: [
      { type: 'categories', name: 'category', placeholder: 'All Service Types' },
      { type: 'price-range', nameMin: 'min_price', nameMax: 'max_price' },
    ],
  },
  jobs: {
    placeholder: 'Job title or company…', qParam: 'search', submitLabel: 'Find Jobs',
    filters: [
      { type: 'select', name: 'workplace_type', placeholder: 'Work Type', options: [{ value: 'remote', label: 'Remote' }, { value: 'hybrid', label: 'Hybrid' }, { value: 'on-site', label: 'On-site' }] },
      { type: 'categories', name: 'category', placeholder: 'All Categories' },
    ],
  },
  events: {
    placeholder: 'Events, workshops, or venues…', qParam: 'search', submitLabel: 'Find Events',
    filters: [
      { type: 'categories', name: 'category', placeholder: 'All Types' },
      { type: 'date', name: 'date' },
    ],
  },
  classifieds: {
    placeholder: 'Electronics, furniture, cameras…', qParam: 'search', submitLabel: 'Browse',
    filters: [
      { type: 'categories', name: 'category', placeholder: 'All Categories' },
      { type: 'price-range', nameMin: 'min_price', nameMax: 'max_price' },
    ],
  },
};

// ─── Date Picker ─────────────────────────────────────────────────────────────

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LABELS  = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function dayToIso(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
function isoToLabel(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTH_NAMES[m - 1].slice(0, 3)} ${d}, ${y}`;
}

function DatePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const now   = new Date();
  const todayY = now.getFullYear();
  const todayM = now.getMonth();
  const todayD = now.getDate();

  const [open, setOpen] = useState(false);
  const [panelPos, setPanelPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [viewY, setViewY] = useState(() => value ? Number(value.split('-')[0]) : todayY);
  const [viewM, setViewM] = useState(() => value ? Number(value.split('-')[1]) - 1 : todayM);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  function toggleOpen() {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPanelPos({ top: rect.bottom + 8, left: rect.left });
    }
    setOpen(o => !o);
  }

  const firstWeekday = new Date(viewY, viewM, 1).getDay();
  const daysInMonth  = new Date(viewY, viewM + 1, 0).getDate();

  function prevM() {
    if (viewM === 0) { setViewM(11); setViewY(y => y - 1); } else setViewM(m => m - 1);
  }
  function nextM() {
    if (viewM === 11) { setViewM(0); setViewY(y => y + 1); } else setViewM(m => m + 1);
  }
  function pick(day: number) {
    const isPast = viewY < todayY ||
      (viewY === todayY && viewM < todayM) ||
      (viewY === todayY && viewM === todayM && day < todayD);
    if (isPast) return;
    onChange(dayToIso(viewY, viewM, day));
    setOpen(false);
  }

  const [selY, selMRaw, selD] = value ? value.split('-').map(Number) : [0, 0, 0];
  const selM = selMRaw - 1;

  return (
    <div ref={wrapRef} className="ud-datepicker">
      <button
        ref={triggerRef}
        type="button"
        className={`ud-datepicker-trigger${open ? ' is-open' : ''}`}
        onClick={toggleOpen}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <CalendarSvg />
        <span className="ud-datepicker-label">{value ? isoToLabel(value) : 'Any date'}</span>
        {value && (
          <span
            className="ud-datepicker-clear"
            role="button"
            tabIndex={0}
            aria-label="Clear date"
            onClick={e => { e.stopPropagation(); onChange(''); }}
            onKeyDown={e => { if (e.key === 'Enter') { e.stopPropagation(); onChange(''); } }}
          >×</span>
        )}
      </button>

      {open && (
        <div
          className="ud-datepicker-panel"
          role="dialog"
          aria-label="Choose a date"
          style={{ position: 'fixed', top: panelPos.top, left: panelPos.left }}
        >
          <div className="ud-datepicker-nav">
            <button type="button" className="ud-datepicker-nav-btn" onClick={prevM} aria-label="Previous month">
              <ChevronLeftSvg />
            </button>
            <span className="ud-datepicker-month-label">{MONTH_NAMES[viewM]} {viewY}</span>
            <button type="button" className="ud-datepicker-nav-btn" onClick={nextM} aria-label="Next month">
              <ChevronRightSvg />
            </button>
          </div>
          <div className="ud-datepicker-grid">
            {DAY_LABELS.map(d => <span key={d} className="ud-datepicker-weekday">{d}</span>)}
            {Array.from({ length: firstWeekday }).map((_, i) => <span key={`pad-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isPast = viewY < todayY ||
                (viewY === todayY && viewM < todayM) ||
                (viewY === todayY && viewM === todayM && day < todayD);
              const isToday    = viewY === todayY && viewM === todayM && day === todayD;
              const isSelected = value ? (selY === viewY && selM === viewM && selD === day) : false;
              return (
                <button
                  key={day}
                  type="button"
                  disabled={isPast}
                  className={['ud-datepicker-day', isSelected ? 'is-selected' : '', isToday ? 'is-today' : '', isPast ? 'is-past' : ''].filter(Boolean).join(' ')}
                  onClick={() => pick(day)}
                >{day}</button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function VerticalSearchPane({
  vertical,
  categories,
  themeLink,
}: {
  vertical: Vertical;
  categories: Category[];
  themeLink: (p: string) => string;
}) {
  const cfg = PANE_CONFIG[vertical];
  const vertCatKey = `is_${vertical === 'autos' ? 'auto' : vertical === 'classifieds' ? 'classified' : vertical.replace(/s$/, '')}`;
  const vertCats = categories.filter(c => !!(c as unknown as Record<string, unknown>)[vertCatKey]);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  function setFilter(name: string, value: string) {
    setFilters(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({ vertical });
    if (query.trim()) params.set(cfg.qParam, query.trim());
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    window.location.href = themeLink(`/explore?${params.toString()}`);
  }

  return (
    <form className="ud-hsf-form" onSubmit={handleSubmit}>
      <div className="ud-hsf-main-row">
        <div className="ud-hsf-input-wrap">
          <span className="ud-hsf-icon"><SearchSvg /></span>
          <input
            type="text"
            className="ud-hsf-input"
            placeholder={cfg.placeholder}
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
        <button type="submit" className="ud-hsf-submit-btn">{cfg.submitLabel}</button>
      </div>

      {cfg.filters.length > 0 && (
        <div className="ud-hsf-filters-row">
          {cfg.filters.map((f, i) => {
            if (f.type === 'select') {
              return (
                <select key={i} className="ud-hsf-filter-select" value={filters[f.name] ?? ''} onChange={e => setFilter(f.name, e.target.value)}>
                  <option value="">{f.placeholder}</option>
                  {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              );
            }
            if (f.type === 'categories') {
              if (vertCats.length === 0) return null;
              return (
                <select key={i} className="ud-hsf-filter-select" value={filters[f.name] ?? ''} onChange={e => setFilter(f.name, e.target.value)}>
                  <option value="">{f.placeholder}</option>
                  {vertCats.map(c => <option key={c.id} value={c.slug}>{c.title}</option>)}
                </select>
              );
            }
            if (f.type === 'price-range') {
              return (
                <div key={i} className="ud-hsf-price-pair">
                  <input type="number" className="ud-hsf-filter-select ud-hsf-price-input" placeholder="Min $" min="0" value={filters[f.nameMin] ?? ''} onChange={e => setFilter(f.nameMin, e.target.value)} />
                  <input type="number" className="ud-hsf-filter-select ud-hsf-price-input" placeholder="Max $" min="0" value={filters[f.nameMax] ?? ''} onChange={e => setFilter(f.nameMax, e.target.value)} />
                </div>
              );
            }
            if (f.type === 'date') {
              return <DatePicker key={i} value={filters[f.name] ?? ''} onChange={v => setFilter(f.name, v)} />;
            }
            return null;
          })}
        </div>
      )}
    </form>
  );
}

// ─── Hero Trust Strip ──────────────────────────────────────────────────────────

function HeroTrustStrip({
  inventoryTotal,
  verticalsCount,
}: {
  inventoryTotal: number | null;
  verticalsCount: number;
}) {
  const t1 = useThemeContent('hero_trust.verified', 'Verified Sellers');
  const t2 = useThemeContent('hero_trust.secure', 'Secure Checkout');
  const t3 = useThemeContent('hero_trust.free', 'Free to Browse');

  return (
    <div className="ud-hero-trust-strip">
      {inventoryTotal != null && inventoryTotal > 0 && (
        <>
          <div className="ud-hero-trust-stat">
            <span className="ud-hero-trust-stat__value">{inventoryTotal.toLocaleString()}+</span>
            <span className="ud-hero-trust-stat__label">Active Listings</span>
          </div>
          <div className="ud-hero-trust-sep" aria-hidden="true" />
        </>
      )}
      <div className="ud-hero-trust-stat">
        <span className="ud-hero-trust-stat__value">{verticalsCount}</span>
        <span className="ud-hero-trust-stat__label">Verticals</span>
      </div>
      <div className="ud-hero-trust-sep" aria-hidden="true" />
      <div className="ud-hero-trust-badges">
        <span className="ud-hero-trust-badge"><ShieldSvg />{t1}</span>
        <span className="ud-hero-trust-badge"><LockSvg />{t2}</span>
        <span className="ud-hero-trust-badge"><EyeSvg />{t3}</span>
      </div>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export function HeroSearchModule({ categories, themeLink, inventoryTotal, isLoading }: HeroSearchModuleProps) {
  const [activeTab, setActiveTab] = useState<SearchTab>('smart');
  const [showLeft,  setShowLeft]  = useState(false);
  const [showRight, setShowRight] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);

  const smartLabel = useThemeContent('hero_search.smart_label', 'Smart Search');

  function updateArrows() {
    const s = stripRef.current;
    if (!s) return;
    const overflow = s.scrollWidth > s.clientWidth + 2;
    setShowLeft(overflow && s.scrollLeft > 4);
    setShowRight(overflow && s.scrollLeft + s.clientWidth < s.scrollWidth - 4);
  }

  useEffect(() => {
    const s = stripRef.current;
    if (!s) return;
    updateArrows();
    s.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      s.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, []);

  return (
    <div className="ud-hero-search-module">
      {/* Tab strip */}
      <div className="ud-hero-tabs-wrap">
        {showLeft && (
          <button type="button" className="ud-hero-tabs-arrow ud-hero-tabs-arrow--left" aria-label="Scroll left"
            onClick={() => stripRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}>
            <ChevronLeftSvg />
          </button>
        )}
        <div ref={stripRef} className="ud-hero-tabs-strip" role="tablist" aria-label="Search verticals">
          {/* Smart Search tab */}
          <button
            type="button" role="tab"
            className={`ud-hero-tab ud-hero-tab--ai${activeTab === 'smart' ? ' is-active' : ''}`}
            aria-selected={activeTab === 'smart'}
            onClick={() => setActiveTab('smart')}
          >
            <StarsSvg /><span>{smartLabel}</span>
          </button>
          {/* One tab per vertical */}
          {VERTICALS.map(v => (
            <button
              key={v.key} type="button" role="tab"
              className={`ud-hero-tab${activeTab === v.key ? ' is-active' : ''}`}
              aria-selected={activeTab === v.key}
              onClick={() => setActiveTab(v.key)}
            >
              {VERTICAL_TAB_ICONS[v.key]}<span>{v.label}</span>
            </button>
          ))}
        </div>
        {showRight && (
          <button type="button" className="ud-hero-tabs-arrow ud-hero-tabs-arrow--right" aria-label="Scroll right"
            onClick={() => stripRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}>
            <ChevronRightSvg />
          </button>
        )}
      </div>

      {/* Search card */}
      <div className="ud-hero-search-card" role="tabpanel">
        {activeTab === 'smart' ? (
          <SmartSearchPane themeLink={themeLink} />
        ) : (
          <VerticalSearchPane key={activeTab} vertical={activeTab as Vertical} categories={categories} themeLink={themeLink} />
        )}
      </div>

      {/* Trust strip */}
      {!isLoading && (
        <HeroTrustStrip inventoryTotal={inventoryTotal} verticalsCount={VERTICALS.length} />
      )}
    </div>
  );
}
