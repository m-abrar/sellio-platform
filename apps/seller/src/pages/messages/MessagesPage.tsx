import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import {
  HiOutlineEnvelope,
  HiOutlineEnvelopeOpen,
  HiOutlinePaperAirplane,
  HiOutlineArrowLeft,
  HiOutlineUser,
} from 'react-icons/hi2';
import { getConversations, getConversationThread, sendMessage } from '../../api/messages';
import { toast } from 'sonner';
import { getApiErrorMessage } from '../../lib/apiErrorMessage';
import { subscribeToConversation } from '../../lib/echo';
import { normalizeThreadMessage } from '../../lib/messageAdapter';

const POLL_INTERVAL_MS = 15000;

const mergeSellerThread = (prev: any[], serverMessages: any[]): any[] => {
  const temps = prev.filter((m) => String(m.id).startsWith('temp-'));
  const real = prev.filter((m) => !String(m.id).startsWith('temp-'));
  const serverIds = new Set(serverMessages.map((m) => String(m.id)));
  const localOnly = real.filter((m) => !serverIds.has(String(m.id)));

  if (
    localOnly.length === 0 &&
    real.length === serverMessages.length &&
    real.every((m, i) => String(m.id) === String(serverMessages[i]?.id))
  ) {
    return prev;
  }

  const serverBodies = new Set(serverMessages.map((m) => m.body));
  const pendingTemps = temps.filter((t) => !serverBodies.has(t.body));
  return [...serverMessages, ...localOnly, ...pendingTemps];
};

const getCategoryStyles = (type: string) => {
  switch (type) {
    case 'Property':
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: '🏠' };
    case 'Auto':
      return { bg: 'bg-blue-50 text-blue-700 border-blue-100', icon: '🚗' };
    case 'Event':
      return { bg: 'bg-purple-50 text-purple-700 border-purple-100', icon: '🎟️' };
    case 'Service':
      return { bg: 'bg-amber-50 text-amber-700 border-amber-100', icon: '🛠️' };
    case 'JobListing':
      return { bg: 'bg-rose-50 text-rose-700 border-rose-100', icon: '💼' };
    case 'Classified':
      return { bg: 'bg-indigo-50 text-indigo-700 border-indigo-100', icon: '🏷️' };
    default:
      return { bg: 'bg-slate-50 text-slate-700 border-slate-100', icon: '📦' };
  }
};

export default function MessagesPage() {
  const { user: currentUser } = useOutletContext<any>() || {};
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const selectedId = id ? parseInt(id, 10) : null;
  const [messages, setMessages] = useState<any[]>([]);
  const [threadMessages, setThreadMessages] = useState<any[]>([]);
  const [partnerId, setPartnerId] = useState<number>(0);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isThreadLoading, setIsThreadLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const selectedIdRef = useRef<number | null>(null);
  const threadScrollRef = useRef<HTMLDivElement>(null);
  // Refs so the subscription effect never needs to re-run just because user/partner data loaded.
  const currentUserIdRef = useRef<number>(0);
  const partnerIdRef = useRef<number>(0);
  // Keep refs in sync on every render.
  currentUserIdRef.current = Number(currentUser?.id ?? 0);
  partnerIdRef.current = partnerId;
  const conversationIdsKey = messages.map((message) => String(message.id)).join('|');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getConversations();
        setMessages(response.data.data);
        setPartnerId(response.data.partnerId ?? 0);
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Failed to load conversations.'));
        console.error('Failed to fetch messages', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();

    const interval = setInterval(async () => {
      try {
        const response = await getConversations({ bustCache: true });
        setMessages(response.data.data);
      } catch { /* polling fallback */ }
    }, POLL_INTERVAL_MS * 2);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messages.length > 0 && !id) {
      navigate(`/dashboard/messages/${messages[0].id}`, { replace: true });
    }
  }, [messages, id]);

  useEffect(() => {
    if (!selectedId) {
      setThreadMessages([]);
      return;
    }

    let activeRequestId = selectedId;
    setThreadMessages([]);
    setIsThreadLoading(true);

    const fetchThread = async () => {
      try {
        const response = await getConversationThread(selectedId);
        if (activeRequestId !== selectedId) return;
        setThreadMessages(response.data.messages);
        setPartnerId(response.data.partnerId ?? partnerId);
      } catch (error) {
        console.error('Failed to fetch conversation thread', error);
      } finally {
        if (activeRequestId === selectedId) setIsThreadLoading(false);
      }
    };

    fetchThread();

    return () => {
      activeRequestId = -1;
    };
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;

    selectedIdRef.current = selectedId;
    const unsub = subscribeToConversation(selectedId);

    const onNewMessage = (e: Event) => {
      const msg = (e as CustomEvent<any>).detail;
      if (Number(msg?.conversation_id) !== Number(selectedIdRef.current)) return;

      setThreadMessages((prev) => {
        if (prev.some((m: any) => String(m.id) === String(msg.id))) return prev;
        return [...prev, normalizeThreadMessage(
          { ...msg, body: msg.body ?? msg.content },
          currentUserIdRef.current || partnerIdRef.current,
        )];
      });
    };

    window.addEventListener('sellio:new-message', onNewMessage);

    return () => {
      selectedIdRef.current = null;
      unsub();
      window.removeEventListener('sellio:new-message', onNewMessage);
    };
  }, [selectedId]); // Only re-subscribe when the conversation changes, not when user/partner data loads.

  useEffect(() => {
    const unsubscribers = conversationIdsKey
      .split('|')
      .filter(Boolean)
      .map((conversationId) => subscribeToConversation(Number(conversationId)));

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [conversationIdsKey]);

  useEffect(() => {
    const onNewMessage = (e: Event) => {
      const msg = (e as CustomEvent<any>).detail;
      const conversationId = Number(msg?.conversation_id);
      if (!conversationId) return;

      setMessages((prev) => {
        let matched = false;
        const next = prev.map((conversation) => {
          if (Number(conversation.id) !== conversationId) return conversation;

          matched = true;
          const isFromOther =
            !currentUserIdRef.current ||
            Number(msg.sender_id) !== Number(currentUserIdRef.current);
          const isOpen = Number(selectedIdRef.current) === conversationId;
          const createdAt = msg.created_at ? new Date(String(msg.created_at)) : new Date();

          return {
            ...conversation,
            preview: msg.body ?? msg.content ?? conversation.preview,
            date: Number.isNaN(createdAt.getTime())
              ? conversation.date
              : createdAt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
            unread: isFromOther && !isOpen ? true : conversation.unread,
          };
        });

        if (!matched) return prev;

        return next.sort((a, b) => (Number(b.id) === conversationId ? 1 : 0) - (Number(a.id) === conversationId ? 1 : 0));
      });
    };

    window.addEventListener('sellio:new-message', onNewMessage);

    return () => {
      window.removeEventListener('sellio:new-message', onNewMessage);
    };
  }, []);

  useEffect(() => {
    if (!threadScrollRef.current) return;
    const el = threadScrollRef.current;
    requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
  }, [threadMessages]);

  // Polling fallback — keeps thread in sync when WebSocket is unavailable
  useEffect(() => {
    if (!selectedId) return;
    const conversationId = selectedId;
    let cancelled = false;

    const pollThread = async () => {
      try {
        const response = await getConversationThread(conversationId, { bustCache: true, skipRead: true });
        if (cancelled) return;
        setThreadMessages((prev) => mergeSellerThread(prev, response.data.messages));
      } catch { /* polling fallback */ }
    };

    const onEchoError = () => { void pollThread(); };
    const onVisible = () => {
      if (document.visibilityState === 'visible') void pollThread();
    };

    void pollThread();
    const interval = setInterval(pollThread, POLL_INTERVAL_MS);
    window.addEventListener('sellio:echo-channel-error', onEchoError);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener('sellio:echo-channel-error', onEchoError);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [selectedId]);

  const selectedMessage = messages.find((message) => message.id === selectedId);

  const handleSend = async () => {
    if (!selectedId || !draft.trim()) return;

    const content = draft.trim();
    setDraft('');

    const tempId = `temp-${Date.now()}`;
    const tempTime = new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    setThreadMessages((prev) => [...prev, { id: tempId, isMine: true, body: content, createdAt: tempTime }]);

    setIsSending(true);
    try {
      const response = await sendMessage(selectedId, content);
      const sent = normalizeThreadMessage(
        response.data as Record<string, unknown>,
        currentUserIdRef.current || partnerIdRef.current,
      );
      setThreadMessages((prev) => {
        const withoutTemp = prev.filter((m: any) => m.id !== tempId);
        if (withoutTemp.some((m: any) => String(m.id) === String(sent.id))) return withoutTemp;
        return [...withoutTemp, sent];
      });
      setMessages((prev) =>
        prev.map((conversation) =>
          Number(conversation.id) === Number(selectedId)
            ? {
                ...conversation,
                preview: sent.body || content,
                date: sent.createdAt || new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
              }
            : conversation,
        ),
      );
    } catch (error) {
      console.error('Failed to send message', error);
      toast.error('Failed to send message.');
      setDraft(content);
      setThreadMessages((prev) => prev.filter((m: any) => m.id !== tempId));
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader badge="Communication" title="Messages" subtitle="Inbox" />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Syncing Messages...</span>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-premium overflow-hidden flex">
          <div className={`w-full lg:w-80 border-r border-slate-50 flex flex-col ${selectedId ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-6 border-b border-slate-50 bg-slate-50/30">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#6610f2]/10 transition-all"
              />
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-8 py-16 text-center">
                  <HiOutlineEnvelope className="w-10 h-10 text-slate-200 mb-4" />
                  <p className="text-sm font-black text-slate-700">No conversations yet</p>
                  <p className="text-xs text-slate-400 font-medium mt-2">
                    Buyer inquiries appear here when customers message you about a listing.
                  </p>
                </div>
              ) : messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => navigate(`/dashboard/messages/${msg.id}`)}
                  className={`p-4 flex items-center gap-3 hover:bg-slate-50 transition-all cursor-pointer border-b border-slate-50 last:border-0 group ${selectedId === msg.id ? 'bg-slate-50 border-l-4 border-l-[#6610f2]' : ''} ${msg.unread ? 'bg-slate-50/30' : ''}`}
                >
                  {msg.avatarUrl ? (
                    <img 
                      src={msg.avatarUrl} 
                      className="shrink-0 w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-sm" 
                      alt={msg.sender} 
                    />
                  ) : (
                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${msg.unread ? 'bg-[#6610f2] border-[#6610f2] text-white' : 'bg-white border-slate-100 text-slate-300'}`}>
                      {msg.unread ? <HiOutlineEnvelope className="w-5 h-5" /> : <HiOutlineEnvelopeOpen className="w-5 h-5" />}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className={`text-sm tracking-tight truncate ${msg.unread ? 'font-black text-slate-900' : 'font-bold text-slate-600'}`}>{msg.sender}</h4>
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{msg.date}</span>
                    </div>
                    <p className={`text-[11px] truncate ${msg.unread ? 'font-bold text-slate-800' : 'font-medium text-slate-400'}`}>{msg.preview}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`flex-1 flex flex-col bg-slate-50/10 ${!selectedId ? 'hidden lg:flex' : 'flex'}`}>
            {selectedMessage ? (
              <div className="flex-1 flex flex-row min-w-0 h-full overflow-hidden">
                {/* 1. Message Thread Panel */}
                <div className="flex-1 flex flex-col min-w-0 h-full bg-slate-50/5">
                  <div className="p-6 bg-white border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button onClick={() => navigate('/dashboard/messages')} className="lg:hidden p-2 text-slate-400">
                        <HiOutlineArrowLeft className="w-5 h-5" />
                      </button>
                      {selectedMessage.avatarUrl ? (
                        <img 
                          src={selectedMessage.avatarUrl} 
                          className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-sm" 
                          alt={selectedMessage.sender} 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-[#6610f2]/5 flex items-center justify-center text-[#6610f2] font-black">
                          {selectedMessage.sender.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-black text-slate-900 tracking-tight">{selectedMessage.sender}</h4>
                        <p className="text-[10px] font-black text-[#6610f2] uppercase tracking-widest">{selectedMessage.subject}</p>
                      </div>
                    </div>
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-red-500 transition-colors">
                      <HiOutlineUser className="w-5 h-5" />
                    </button>
                  </div>

                  <div ref={threadScrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {isThreadLoading ? (
                      <div className="space-y-6 pt-2">
                        {[{ w: 'w-48', mine: false }, { w: 'w-36', mine: true }, { w: 'w-56', mine: false }, { w: 'w-32', mine: true }, { w: 'w-44', mine: false }].map((s, i) => (
                          <div key={i} className={`flex gap-4 ${s.mine ? 'flex-row-reverse' : ''}`}>
                            <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse shrink-0" />
                            <div className={`h-12 ${s.w} rounded-2xl bg-slate-100 animate-pulse`} />
                          </div>
                        ))}
                      </div>
                    ) : threadMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm font-bold">
                        No messages in this thread yet.
                      </div>
                    ) : (
                      threadMessages.map((message) => (
                        <div key={message.id} className={`flex gap-4 ${message.isMine ? 'flex-row-reverse' : ''}`}>
                          {message.isMine ? (
                            currentUser?.avatar_url ? (
                              <img 
                                src={currentUser.avatar_url} 
                                className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-sm shrink-0" 
                                alt="avatar" 
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-[#6610f2]/5 flex items-center justify-center text-[#6610f2] font-black shrink-0">
                                {currentUser?.name?.charAt(0) || 'Me'}
                              </div>
                            )
                          ) : (
                            selectedMessage.avatarUrl ? (
                              <img 
                                src={selectedMessage.avatarUrl} 
                                className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-sm shrink-0" 
                                alt="avatar" 
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold shrink-0">
                                {selectedMessage.sender.charAt(0)}
                              </div>
                            )
                          )}
                          <div
                            className={`p-6 rounded-2xl max-w-[80%] shadow-sm ${
                              message.isMine
                                ? 'bg-[#6610f2] text-white rounded-tr-none shadow-lg shadow-purple-200'
                                : 'bg-white border border-slate-100 rounded-tl-none'
                            }`}
                          >
                            <p className={`text-sm font-medium leading-relaxed ${message.isMine ? 'text-white' : 'text-slate-600'}`}>{message.body}</p>
                            {String(message.id).startsWith('temp-') ? (
                              <p className="text-[9px] font-black uppercase tracking-widest mt-4 text-white/30 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse inline-block" />
                                Sending…
                              </p>
                            ) : (
                              <p className={`text-[9px] font-black uppercase tracking-widest mt-4 ${message.isMine ? 'text-white/50' : 'text-slate-300'}`}>{message.createdAt}</p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-6 bg-white border-t border-slate-50">
                    <div className="relative">
                      <textarea
                        placeholder="Type your message here… (Enter to send, Shift+Enter for new line)"
                        rows={1}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 pr-16 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6610f2]/20 transition-all resize-none"
                      />
                      <button
                        onClick={() => void handleSend()}
                        disabled={isSending || !draft.trim()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#6610f2] text-white rounded-xl flex items-center justify-center shadow-lg shadow-purple-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                      >
                        <HiOutlinePaperAirplane className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Dynamic Context Sidebar */}
                {selectedMessage.inquiriable && (() => {
                  const item = selectedMessage.inquiriable;
                  const catStyle = getCategoryStyles(item.type);
                  return (
                    <div className="hidden xl:flex w-64 border-l border-slate-100 bg-white flex-col overflow-y-auto custom-scrollbar p-5 space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                      {/* Sidebar Header */}
                      <div className="space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Contextual Asset</p>
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Reference</h4>
                          <span className={`text-[9px] font-black border px-3 py-1 rounded-full uppercase tracking-wider ${catStyle.bg}`}>
                            {catStyle.icon} {item.type === 'JobListing' ? 'Job Listing' : item.type}
                          </span>
                        </div>
                      </div>

                      {/* Showcase Image or Placeholder */}
                      <div className="relative">
                        {item.image ? (
                          <img
                            src={item.image}
                            className="w-full h-32 object-cover rounded-2xl border border-slate-100 shadow-sm transition-transform duration-500 hover:scale-[1.02]"
                            alt={item.title}
                          />
                        ) : (
                          <div className="w-full h-32 bg-gradient-to-tr from-slate-50 to-slate-100/50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 text-slate-300">
                            <span className="text-4xl mb-2">{catStyle.icon}</span>
                            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Premium Registry Asset</span>
                          </div>
                        )}
                      </div>

                      {/* Core Specs */}
                      <div className="space-y-4">
                        <h3 className="text-md font-black text-slate-900 tracking-tight leading-snug hover:text-[#6610f2] transition-colors duration-300">
                          {item.title}
                        </h3>

                        {/* Prominent Pricing HUD */}
                        <div className="bg-slate-950 p-4 rounded-2xl shadow-xl shadow-slate-900/5 flex items-center justify-between relative overflow-hidden group">
                          <div className="relative z-10 min-w-0">
                            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Pricing Valuation</p>
                            <p className="text-lg font-black italic text-[#6610f2] tracking-tighter truncate" title={item.price}>
                              {item.price}
                            </p>
                          </div>
                          <span className="text-2xl relative z-10">{catStyle.icon}</span>
                          <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#6610f2]/10 rounded-full blur-2xl group-hover:bg-[#6610f2]/20 transition-all duration-700" />
                        </div>
                      </div>

                      {/* Specs Detail Pane */}
                      {item.details && (
                        <div className="space-y-2">
                          <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Registry Overview</h5>
                          <p className="text-[11px] text-slate-500 font-bold leading-relaxed bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50 max-h-28 overflow-y-auto custom-scrollbar italic">
                            "{item.details}"
                          </p>
                        </div>
                      )}

                      {/* Management CTA */}
                      <div className="pt-4 border-t border-slate-50">
                        <a 
                          href={item.viewUrl}
                          className="w-full bg-slate-900 text-white hover:bg-[#6610f2] hover:shadow-lg hover:shadow-purple-100 py-4.5 rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] shadow-sm flex items-center justify-center transition-all duration-300 group"
                        >
                          Manage Asset <HiOutlineArrowLeft className="w-3.5 h-3.5 ml-2.5 rotate-180 transition-transform group-hover:translate-x-1" />
                        </a>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-6">
                  <HiOutlineEnvelope className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-black text-slate-900 italic tracking-tight">Select a Conversation.</h4>
                <p className="text-xs text-slate-400 font-bold mt-2 uppercase tracking-widest">Choose a message from the list to view the thread</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
