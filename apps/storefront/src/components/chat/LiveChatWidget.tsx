'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  fetchChatMessages,
  sendChatMessage,
  startOrFindConversation,
  type ChatMessage,
  type StartChatResult,
} from '@/lib/storefront-api';
import {
  connectEcho,
  disconnectEcho,
  getSocketId,
  subscribeToConversation,
} from '@/lib/echo';
import './chat.css';

export interface LiveChatWidgetProps {
  vertical: string;
  listingId: number;
  listingTitle: string;
}

type ChatPhase =
  | { phase: 'idle' }
  | { phase: 'auth' }
  | { phase: 'loading' }
  | { phase: 'open'; conversationId: number; partnerName: string; partnerAvatar: string | null }
  | { phase: 'error'; message: string };

const POLL_MS = 15000;

function resolveApiBase(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api').replace(/\/$/, '');
}

export function LiveChatWidget({ vertical, listingId, listingTitle }: LiveChatWidgetProps) {
  const { user, login, register } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Connect Echo when user is authenticated
  useEffect(() => {
    if (!user) {
      disconnectEcho();
      return;
    }
    connectEcho(resolveApiBase());
    return () => disconnectEcho();
  }, [user?.id]);

  // Subscribe to the active conversation channel
  const conversationId = phase.phase === 'open' ? phase.conversationId : null;
  useEffect(() => {
    if (!conversationId) return;
    return subscribeToConversation(conversationId);
  }, [conversationId]);

  // Receive real-time messages; deduplicate against existing
  useEffect(() => {
    const handler = (e: Event) => {
      const msg = (e as CustomEvent<ChatMessage>).detail;
      if (!convoIdRef.current || msg.conversation_id !== convoIdRef.current) return;
      setMessages((prev) => prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]);
    };
    window.addEventListener('sellio:new-message', handler);
    return () => window.removeEventListener('sellio:new-message', handler);
  }, []);

  const openConversation = useCallback(async () => {
    setPhase({ phase: 'loading' });
    try {
      const data: StartChatResult = await startOrFindConversation(vertical, listingId);
      convoIdRef.current = data.conversation_id;
      setMessages(data.messages);
      setPhase({ phase: 'open', conversationId: data.conversation_id, partnerName: data.partner.name, partnerAvatar: data.partner.avatar });
    } catch (err) {
      setPhase({ phase: 'error', message: err instanceof Error ? err.message : 'Could not open chat.' });
    }
  }, [vertical, listingId]);

  const handleOpenChat = () => {
    setIsOpen(true);
    if (phase.phase === 'idle') {
      if (!user) setPhase({ phase: 'auth' });
      else void openConversation();
    }
  };

  // Polling fallback — fires every 15 s in case Echo drops a message
  useEffect(() => {
    if (phase.phase !== 'open') return;
    const id = setInterval(async () => {
      if (!convoIdRef.current) return;
      try {
        const latest = await fetchChatMessages(convoIdRef.current);
        setMessages((prev) => {
          const ids = new Set(prev.map((m) => m.id));
          const incoming = latest.filter((m) => !ids.has(m.id));
          return incoming.length ? [...prev, ...incoming] : prev;
        });
      } catch { /* silent */ }
    }, POLL_MS);
    return () => clearInterval(id);
  }, [phase.phase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && phase.phase === 'open') {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, phase.phase]);

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
      const msg = await sendChatMessage(convoIdRef.current, body, getSocketId());
      setMessages((prev) => [...prev, msg]);
    } catch {
      setInput(body);
    } finally {
      setSending(false);
    }
  };

  const myId = user?.id;

  const panel = (
    <div
      className={`sl-chat-float-panel${isOpen ? ' is-open' : ''}`}
      role="dialog"
      aria-label="Live chat"
      aria-hidden={!isOpen}
    >
      <div className="sl-chat-header">
        <div className="sl-chat-header-left">
          {phase.phase === 'open' && (
            phase.partnerAvatar
              ? <img src={phase.partnerAvatar} alt={phase.partnerName} className="sl-chat-avatar" />
              : <div className="sl-chat-avatar sl-chat-avatar--initials" aria-hidden="true">
                  {phase.partnerName.charAt(0).toUpperCase()}
                </div>
          )}
          <span className="sl-chat-header-name">
            {phase.phase === 'open' ? phase.partnerName : 'Chat with seller'}
          </span>
        </div>
        <button type="button" className="sl-chat-close" aria-label="Close chat" onClick={() => setIsOpen(false)}>
          ✕
        </button>
      </div>

      <div className="sl-chat-float-body">
        {phase.phase === 'idle' && (
          <div className="sl-chat-float-idle">
            <p>Have a question about <strong>{listingTitle}</strong>?</p>
            <button
              type="button"
              className="sl-chat-submit-btn"
              onClick={() => { if (!user) setPhase({ phase: 'auth' }); else void openConversation(); }}
            >
              Start conversation
            </button>
          </div>
        )}

        {phase.phase === 'auth' && (
          <form className="sl-chat-auth-form sl-chat-auth-form--float" onSubmit={(e) => { void handleAuthSubmit(e); }}>
            <p className="sl-chat-auth-hint">Sign in to chat about <strong>{listingTitle}</strong>.</p>
            {authError && <div className="sl-chat-auth-error" role="alert">{authError}</div>}
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
            <div className="sl-chat-auth-toggle">
              <button type="button" className={authMode === 'login' ? 'is-active' : ''} onClick={() => setAuthMode('login')}>Log in</button>
              <button type="button" className={authMode === 'register' ? 'is-active' : ''} onClick={() => setAuthMode('register')}>Register</button>
            </div>
            <button type="submit" className="sl-chat-submit-btn" disabled={authBusy}>
              {authBusy ? 'Please wait…' : authMode === 'login' ? 'Sign in & chat' : 'Create account & chat'}
            </button>
          </form>
        )}

        {phase.phase === 'loading' && (
          <div className="sl-chat-loading" role="status">Opening conversation…</div>
        )}

        {phase.phase === 'error' && (
          <div className="sl-chat-float-idle">
            <div className="sl-chat-auth-error" role="alert">{phase.message}</div>
            <button type="button" className="sl-chat-submit-btn" onClick={() => setPhase({ phase: 'idle' })}>
              Try again
            </button>
          </div>
        )}

        {phase.phase === 'open' && (
          <>
            <div className="sl-chat-thread" role="log" aria-live="polite">
              {messages.length === 0 && (
                <p className="sl-chat-empty">No messages yet. Say hello!</p>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`sl-chat-bubble${msg.sender_id === myId ? ' sl-chat-bubble--mine' : ''}`}
                >
                  <span className="sl-chat-bubble-body">{msg.body}</span>
                  <time className="sl-chat-time" dateTime={msg.created_at}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </time>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <form className="sl-chat-composer" onSubmit={(e) => { void handleSend(e); }}>
              <input
                ref={inputRef}
                type="text"
                className="sl-chat-input"
                placeholder="Type a message…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={sending}
                autoComplete="off"
              />
              <button
                type="submit"
                className="sl-chat-send-btn"
                disabled={sending || !input.trim()}
                aria-label="Send message"
              >
                ➤
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Inline trigger — stays in the page sidebar */}
      <div className="sl-chat-trigger">
        <button type="button" className="sl-chat-open-btn" onClick={handleOpenChat}>
          💬 Chat with seller
        </button>
      </div>

      {/* Floating panel — portaled to document.body */}
      {mounted && createPortal(panel, document.body)}
    </>
  );
}
