'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  fetchChatMessages,
  sendChatMessage,
  startOrFindConversation,
  type ChatMessage,
  type StartChatResult,
} from '@/lib/storefront-api';

export interface LiveChatWidgetProps {
  vertical: string;
  listingId: number;
  listingTitle: string;
}

type ChatPhase =
  | { phase: 'idle' }
  | { phase: 'auth' }
  | { phase: 'loading' }
  | { phase: 'open'; conversationId: number; partnerName: string }
  | { phase: 'error'; message: string };

const POLL_MS = 5000;

export function LiveChatWidget({ vertical, listingId, listingTitle }: LiveChatWidgetProps) {
  const { user, login, register } = useAuth();
  const [phase, setPhase] = useState<ChatPhase>({ phase: 'idle' });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const convoIdRef = useRef<number | null>(null);

  const openConversation = useCallback(async () => {
    setPhase({ phase: 'loading' });
    try {
      const data: StartChatResult = await startOrFindConversation(vertical, listingId);
      convoIdRef.current = data.conversation_id;
      setMessages(data.messages);
      setPhase({ phase: 'open', conversationId: data.conversation_id, partnerName: data.partner.name });
    } catch (err) {
      setPhase({ phase: 'error', message: err instanceof Error ? err.message : 'Could not open chat.' });
    }
  }, [vertical, listingId]);

  const handleOpenClick = () => {
    if (!user) { setPhase({ phase: 'auth' }); return; }
    void openConversation();
  };

  // Poll for new messages while chat is open
  useEffect(() => {
    if (phase.phase !== 'open') return;
    const id = setInterval(async () => {
      if (!convoIdRef.current) return;
      try {
        const latest = await fetchChatMessages(convoIdRef.current);
        setMessages(latest);
      } catch { /* silent */ }
    }, POLL_MS);
    return () => clearInterval(id);
  }, [phase.phase]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authForm.email || !authForm.password) { setAuthError('Fill in all fields.'); return; }
    if (authMode === 'register' && !authForm.name) { setAuthError('Enter your name.'); return; }
    setAuthBusy(true);
    setAuthError(null);
    try {
      if (authMode === 'login') await login(authForm.email, authForm.password);
      else await register(authForm.name, authForm.email, authForm.password);
      await openConversation();
    } catch {
      setAuthError('Authentication failed. Check your credentials and try again.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = input.trim();
    if (!body || !convoIdRef.current) return;
    setSending(true);
    setInput('');
    try {
      const msg = await sendChatMessage(convoIdRef.current, body);
      setMessages((prev) => [...prev, msg]);
    } catch {
      setInput(body);
    } finally {
      setSending(false);
    }
  };

  if (phase.phase === 'idle') {
    return (
      <div className="ud-chat-trigger">
        <button type="button" className="ud-chat-open-btn" onClick={handleOpenClick}>
          <span aria-hidden="true">💬</span> Chat with seller
        </button>
      </div>
    );
  }

  if (phase.phase === 'auth') {
    return (
      <form className="ud-inquiry-form" onSubmit={(e) => { void handleAuthSubmit(e); }}>
        <p className="ud-inquiry-form-hint">
          Sign in to chat about <strong>{listingTitle}</strong>.
        </p>
        {authError && <div className="ud-inquiry-form-error" role="alert">{authError}</div>}
        {authMode === 'register' && (
          <label>Full name
            <input required type="text" autoComplete="name" value={authForm.name}
              onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} />
          </label>
        )}
        <label>Email
          <input required type="email" autoComplete="email" value={authForm.email}
            onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} />
        </label>
        <label>Password
          <input required type="password" autoComplete="current-password" value={authForm.password}
            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} />
        </label>
        <div className="ud-inquiry-form-toggle">
          <button type="button" className={authMode === 'login' ? 'is-active' : ''} onClick={() => setAuthMode('login')}>Log in</button>
          <button type="button" className={authMode === 'register' ? 'is-active' : ''} onClick={() => setAuthMode('register')}>Register</button>
        </div>
        <button type="submit" className="core-btn-primary ud-detail-action" disabled={authBusy}>
          {authBusy ? 'Please wait…' : authMode === 'login' ? 'Sign in & chat' : 'Create account & chat'}
        </button>
        <button type="button" className="ud-chat-cancel-btn" onClick={() => setPhase({ phase: 'idle' })}>
          Cancel
        </button>
      </form>
    );
  }

  if (phase.phase === 'loading') {
    return <div className="ud-chat-loading" role="status">Opening conversation…</div>;
  }

  if (phase.phase === 'error') {
    return (
      <div className="ud-chat-trigger">
        <p className="ud-inquiry-form-error" role="alert">{phase.message}</p>
        <button type="button" className="ud-chat-open-btn" onClick={() => setPhase({ phase: 'idle' })}>Dismiss</button>
      </div>
    );
  }

  const myId = user?.id;

  return (
    <div className="ud-chat-panel">
      <div className="ud-chat-header">
        <span className="ud-chat-header-name">{phase.partnerName}</span>
        <button type="button" className="ud-chat-close" aria-label="Close chat"
          onClick={() => setPhase({ phase: 'idle' })}>✕</button>
      </div>

      <div className="ud-chat-thread" role="log" aria-live="polite">
        {messages.length === 0 && (
          <p className="ud-chat-empty">No messages yet. Say hello!</p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`ud-chat-bubble${msg.sender_id === myId ? ' ud-chat-bubble--mine' : ''}`}
          >
            <span className="ud-chat-bubble-body">{msg.body}</span>
            <time className="ud-chat-time" dateTime={msg.created_at}>
              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </time>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form className="ud-chat-composer" onSubmit={(e) => { void handleSend(e); }}>
        <input
          type="text"
          className="ud-chat-input"
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
          autoComplete="off"
        />
        <button
          type="submit"
          className="ud-chat-send-btn"
          disabled={sending || !input.trim()}
          aria-label="Send message"
        >
          ➤
        </button>
      </form>
    </div>
  );
}
