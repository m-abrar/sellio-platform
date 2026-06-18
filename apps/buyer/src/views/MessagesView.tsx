import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Send, 
  Circle, 
  Search, 
  Info, 
  Smile, 
  Paperclip, 
  ChevronLeft, 
  MessageSquare, 
  Sparkles,
  ExternalLink,
  Shield,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { fetchMessages, sendMessage, fetchConversations } from '../api/messageApi';
import { useUser } from '../context/UserContext';
import { API_BASE_URL } from '../config/api';
import { Button } from '../components/Button';
import { subscribeToConversation } from '../lib/echo';

const POLL_INTERVAL_MS = 2000;

/** Drop duplicate real messages and temps that already have a matching server copy. */
const finalizeBuyerMessages = (messages: any[]): any[] => {
  const reals = messages.filter((m) => !String(m.id).startsWith('temp-'));
  const uniqueReals = [...new Map(reals.map((m) => [String(m.id), m])).values()];
  const realContents = new Set(uniqueReals.map((m) => m.content));
  const pendingTemps = messages.filter(
    (m) => String(m.id).startsWith('temp-') && !realContents.has(m.content),
  );
  return [...uniqueReals, ...pendingTemps].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
};

const mergeBuyerThread = (prev: any[], serverMessages: any[]): any[] => {
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

  const serverContents = new Set(serverMessages.map((m) => m.content));
  const pendingTemps = temps.filter((t) => !serverContents.has(t.content));
  return finalizeBuyerMessages([...serverMessages, ...localOnly, ...pendingTemps]);
};

const apiOrigin = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return '';
  }
})();

const fallbackAvatar = `${apiOrigin}/images/fallbacks/default-avatar.png`;

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

export default function MessagesView() {
  const { user } = useUser();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvo, setActiveConvo] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeConvoIdRef = useRef<number | null>(null);
  const currentUserIdRef = useRef<number | null>(null);
  currentUserIdRef.current = user?.id ?? null;

  // Hidden File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Emoji picker states
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const curatedEmojis = ['👍', '❤️', '😮', '😂', '👏', '🔥', '🚀', '💡', '💬', '🏠', '🚗', '🛠️'];

  // Report modal states
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleAttachClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setNewMessage(prev => `${prev}[Attached: ${files[0].name}] `);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleReportPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConvo || !reportReason.trim()) return;

    setIsReporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setReportSuccess(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportReason('');
        setReportSuccess(false);
      }, 1500);
    } catch {
      alert('Failed to submit report');
    } finally {
      setIsReporting(false);
    }
  };

  useEffect(() => {
    loadInitialData();

    const interval = setInterval(async () => {
      try {
        const convos = await fetchConversations();
        setConversations(convos);
      } catch { /* polling fallback */ }
    }, POLL_INTERVAL_MS * 2);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (id && conversations.length > 0) {
      const convo = conversations.find((c) => String(c.id) === id);
      if (convo) {
        setActiveConvo(convo);
      }
    } else if (!id) {
      setActiveConvo(null);
    }
  }, [id, conversations]);

  useEffect(() => {
    if (!activeConvo) return;

    activeConvoIdRef.current = activeConvo.id;
    loadMessages(activeConvo.id);

    const unsub = subscribeToConversation(activeConvo.id);

    const onNewMessage = (e: Event) => {
      const msg = (e as CustomEvent<any>).detail;
      if (Number(msg?.conversation_id) !== Number(activeConvoIdRef.current)) return;
      // Own sends are handled by handleSend — ignore echo to avoid temp+real flash.
      if (
        currentUserIdRef.current != null &&
        Number(msg.sender_id) === Number(currentUserIdRef.current)
      ) {
        return;
      }

      setMessages((prev) => {
        if (prev.some((m) => String(m.id) === String(msg.id))) return prev;
        return finalizeBuyerMessages([
          ...prev,
          { ...msg, content: msg.content ?? msg.body },
        ]);
      });
    };

    const onEchoConnected = () => {
      if (activeConvoIdRef.current != null) {
        subscribeToConversation(activeConvoIdRef.current);
      }
    };

    window.addEventListener('sellio:new-message', onNewMessage);
    window.addEventListener('sellio:echo-connected', onEchoConnected);

    return () => {
      activeConvoIdRef.current = null;
      unsub();
      window.removeEventListener('sellio:new-message', onNewMessage);
      window.removeEventListener('sellio:echo-connected', onEchoConnected);
    };
  }, [activeConvo?.id]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const convos = await fetchConversations();
      setConversations(convos);
      
      if (id) {
        const convo = convos.find((c) => String(c.id) === id);
        if (convo) {
          setActiveConvo(convo);
          return;
        }
      }
      
      if (convos.length > 0) {
        setActiveConvo(convos[0]);
        navigate(`/messages/${convos[0].id}`, { replace: true });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
  }, [messages]);

  // Polling fallback — keeps thread in sync when WebSocket is unavailable
  useEffect(() => {
    if (!activeConvo?.id) return;
    const convoId = activeConvo.id;
    let cancelled = false;

    const pollThread = async () => {
      try {
        const fresh = await fetchMessages(convoId, { bustCache: true });
        if (cancelled) return;
        setMessages((prev) => mergeBuyerThread(prev, fresh));
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
  }, [activeConvo?.id]);

  const loadMessages = async (conversationId = activeConvo?.id) => {
    if (!conversationId) return;

    setMessagesLoading(true);
    try {
      const data = await fetchMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const content = newMessage;
    setNewMessage('');

    const tempId = `temp-${Date.now()}`;
    setMessages((cur) => [...cur, { id: tempId, sender_id: user?.id, content, created_at: new Date().toISOString() }]);

    try {
      const sent = await sendMessage(content, activeConvo.id);
      setMessages((cur) =>
        finalizeBuyerMessages(cur.map((m) => (m.id === tempId ? sent : m))),
      );
    } catch (error) {
      console.error(error);
      setNewMessage(content);
      setMessages((cur) => cur.filter((m) => m.id !== tempId));
    }
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '';
    try {
      const date = new Date(timeStr);
      const now = new Date();
      
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      }
      
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const getMessageDateString = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      if (date.toDateString() === now.toDateString()) {
        return 'Today';
      }
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      }
      return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return '';
    }
  };

  const filteredConversations = conversations.filter((convo) => 
    convo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (convo.lastMessage || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages = activeConvo ? messages : [];
  let lastDateStr = '';

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 px-1 md:px-3 overflow-hidden">
      {/* Conversation List */}
      <div className={cn(
        "w-full md:w-80 lg:w-96 flex-shrink-0 flex flex-col bg-white/90 backdrop-blur-md rounded-2xl border border-zinc-200/40 overflow-hidden shadow-xs transition-all duration-300",
        activeConvo ? "hidden md:flex" : "flex"
      )}>
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-white/50">
          <h2 className="font-extrabold text-base bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-dark)] bg-clip-text text-transparent">
            Inbox
          </h2>
          {loading ? (
            <div className="w-14 h-4 rounded-full bg-zinc-100 animate-pulse" />
          ) : (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-[var(--primary-light)] text-[var(--primary-color)] rounded-full">
              {conversations.length} Active
            </span>
          )}
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/40">
          <div className="relative flex items-center">
            <Search size={15} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20 focus:border-[var(--primary-color)] transition-all placeholder-zinc-400 shadow-xs"
            />
          </div>
        </div>

        {/* Conversations Scrollbox */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-100/50">
          {loading && Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-zinc-100 animate-pulse shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-24 rounded-full bg-zinc-100 animate-pulse" />
                  <div className="h-2.5 w-8 rounded-full bg-zinc-100 animate-pulse" />
                </div>
                <div className="h-2.5 w-40 rounded-full bg-zinc-100 animate-pulse" />
              </div>
            </div>
          ))}
          {!loading && filteredConversations.map((convo) => (
            <motion.button
              key={convo.id}
              whileHover={{ scale: 1.005, x: 2 }}
              whileTap={{ scale: 0.995 }}
              onClick={() => navigate(`/messages/${convo.id}`)}
              className={cn(
                "w-full px-5 py-4 flex items-center gap-3.5 transition-all border-l-4 text-left relative cursor-pointer",
                activeConvo?.id === convo.id 
                  ? "bg-[var(--primary-light)]/60 border-[var(--primary-color)] shadow-xs" 
                  : "border-transparent hover:bg-zinc-50/60"
              )}
            >
              <div className="relative flex-shrink-0">
                <img 
                  src={convo.avatar || fallbackAvatar} 
                  alt={convo.name} 
                  className={cn(
                    "w-11 h-11 rounded-full object-cover shadow-xs border-2 transition-all",
                    activeConvo?.id === convo.id ? "border-[var(--primary-color)]" : "border-white"
                  )}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackAvatar;
                  }}
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-xs" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className={cn(
                    "font-bold text-xs truncate transition-colors",
                    activeConvo?.id === convo.id ? "text-[var(--primary-dark)]" : "text-zinc-800"
                  )}>
                    {convo.name}
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-medium ml-2 shrink-0">
                    {formatTime(convo.time)}
                  </span>
                </div>
                <p className={cn(
                  "text-xs truncate leading-snug",
                  convo.unread > 0 ? "font-bold text-zinc-900" : "text-zinc-500"
                )}>
                  {convo.lastMessage || "No messages yet"}
                </p>
              </div>

              {convo.unread > 0 && (
                <motion.span 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center rounded-full shadow-xs shrink-0 ml-1"
                >
                  {convo.unread}
                </motion.span>
              )}
            </motion.button>
          ))}

          {filteredConversations.length === 0 && !loading && (
            <div className="p-8 text-center text-zinc-400 text-xs">
              No conversations found.
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col bg-white/90 backdrop-blur-md rounded-2xl border border-zinc-200/40 overflow-hidden shadow-xs transition-all duration-300",
        activeConvo ? "flex" : "hidden md:flex"
      )}>
        {activeConvo ? (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-zinc-100 bg-gradient-to-b from-white to-zinc-50/20 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate('/messages')} 
                  className="md:hidden p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 transition-colors mr-1 cursor-pointer"
                  title="Back to inbox"
                >
                  <ChevronLeft size={18} />
                </button>
                
                <div className="relative">
                  <img 
                    src={activeConvo.avatar || fallbackAvatar} 
                    alt={activeConvo.name} 
                    className="w-10 h-10 rounded-full object-cover border border-zinc-150"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackAvatar;
                    }}
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                
                <div>
                  <h3 className="font-extrabold text-sm text-zinc-800 leading-tight">{activeConvo.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Active Now</span>
                  </div>
                </div>
              </div>

              {/* Decorative actions in header */}
              <div className="flex items-center gap-1 text-zinc-400">
                {activeConvo.inquiriable && (
                  <a 
                    href={activeConvo.inquiriable.viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`View ${activeConvo.inquiriable.title} on Storefront`}
                    className="p-2 hover:bg-zinc-100 hover:text-[var(--primary-color)] rounded-xl transition-all cursor-pointer"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
                <button 
                  type="button" 
                  onClick={() => setShowReportModal(true)}
                  title="Report / Block Partner"
                  className="p-2 hover:bg-zinc-100 hover:text-red-500 rounded-xl transition-all cursor-pointer animate-pulse"
                >
                  <Shield size={16} />
                </button>
                <button 
                  type="button" 
                  title="Chat Information"
                  className="p-2 hover:bg-zinc-100 hover:text-zinc-650 rounded-xl transition-all cursor-pointer"
                >
                  <Info size={16} />
                </button>
              </div>
            </div>

            {/* Split View Wrapper: Messages Stream + Listing Detail Sidebar */}
            <div className="flex-1 flex flex-row min-w-0 h-full overflow-hidden">
              {/* Message Thread Panel */}
              <div className="flex-1 flex flex-col min-w-0 h-full bg-zinc-50/10">
                {/* Messages Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messagesLoading && (
                    <div className="space-y-4 pt-2">
                      {[{ w: 'w-48', mine: false }, { w: 'w-36', mine: true }, { w: 'w-56', mine: false }, { w: 'w-32', mine: true }, { w: 'w-44', mine: false }].map((s, i) => (
                        <div key={i} className={`flex ${s.mine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`h-9 ${s.w} rounded-2xl bg-zinc-100 animate-pulse`} />
                        </div>
                      ))}
                    </div>
                  )}
                  {!messagesLoading && currentMessages.map((msg) => {
                    const msgDateStr = getMessageDateString(msg.created_at);
                    const showDateDivider = msgDateStr !== lastDateStr;
                    lastDateStr = msgDateStr;

                    return (
                      <React.Fragment key={msg.id}>
                        {showDateDivider && (
                          <div className="flex items-center justify-center my-6">
                            <div className="h-[1px] bg-zinc-200/50 flex-grow max-w-[80px] md:max-w-[150px]" />
                            <span className="px-3 py-1 text-[10px] font-bold text-zinc-500 bg-white rounded-full border border-zinc-200/50 shadow-2xs mx-3 uppercase tracking-wider">
                              {msgDateStr}
                            </span>
                            <div className="h-[1px] bg-zinc-200/50 flex-grow max-w-[80px] md:max-w-[150px]" />
                          </div>
                        )}

                        <div className={cn(
                          "flex flex-col max-w-[75%] group",
                          msg.sender_id === user?.id ? "ml-auto items-end" : "items-start"
                        )}>
                          <div className={cn(
                            "px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed break-words shadow-2xs",
                            msg.sender_id === user?.id
                              ? "bg-gradient-to-br from-[var(--primary-color)] to-[var(--primary-dark)] text-white rounded-tr-[4px]" 
                              : "bg-white border border-zinc-200/60 text-zinc-800 rounded-tl-[4px]"
                          )}>
                            {msg.content}
                          </div>
                          
                          <div className="flex items-center gap-1 mt-1 text-[9px] text-zinc-400 font-semibold opacity-70 group-hover:opacity-100 transition-opacity">
                            <span>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {msg.sender_id === user?.id && (
                              <span className="text-[var(--primary-color)] font-extrabold ml-0.5">✓✓</span>
                            )}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}

                  {currentMessages.length === 0 && !loading && !messagesLoading && (
                    <div className="flex-grow flex flex-col items-center justify-center p-8 text-center max-w-xs mx-auto py-16">
                      <div className="w-14 h-14 bg-[var(--primary-light)] text-[var(--primary-color)] rounded-2xl flex items-center justify-center mb-4 shadow-2xs animate-pulse">
                        <Sparkles size={24} />
                      </div>
                      <h4 className="font-extrabold text-zinc-800 text-sm mb-1">No messages yet</h4>
                      <p className="text-zinc-500 text-xs leading-relaxed">
                        Say hello! Send a message to start negotiating or asking about listings.
                      </p>
                    </div>
                  )}
                </div>

                {/* Input Bar */}
                <div className="p-4 bg-zinc-50/50 border-t border-zinc-150/70">
                  <form onSubmit={handleSend} className="flex gap-2.5 items-center">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                    <button 
                      type="button" 
                      onClick={handleAttachClick}
                      title="Attach file"
                      className="p-2.5 bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-650 rounded-xl hover:shadow-2xs transition-all cursor-pointer shrink-0"
                    >
                      <Paperclip size={16} />
                    </button>
                    
                    <div className="relative shrink-0 hidden sm:block">
                      <button 
                        type="button" 
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        title="Add emoji"
                        className={cn(
                          "p-2.5 bg-white border border-zinc-200 rounded-xl hover:shadow-2xs transition-all cursor-pointer",
                          showEmojiPicker ? "text-[var(--primary-color)] border-[var(--primary-color)]" : "text-zinc-400 hover:text-zinc-650"
                        )}
                      >
                        <Smile size={16} />
                      </button>
                      <AnimatePresence>
                        {showEmojiPicker && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-full mb-2 left-0 bg-white border border-zinc-200 rounded-2xl p-3 shadow-xl grid grid-cols-4 gap-2 z-50 w-44 text-center"
                          >
                            {curatedEmojis.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => handleEmojiSelect(emoji)}
                                className="w-8 h-8 rounded-lg hover:bg-zinc-50 flex items-center justify-center text-lg hover:scale-110 transition-transform cursor-pointer border-none bg-transparent"
                              >
                                {emoji}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void handleSend(e); } }}
                      placeholder="Type a message…"
                      className="flex-1 bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20 focus:border-[var(--primary-color)] transition-all shadow-2xs placeholder-zinc-400"
                    />
                    
                    <motion.button 
                      type="submit"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="p-2.5 bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-dark)] text-white rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center shrink-0 cursor-pointer"
                      title="Send message"
                    >
                      <Send size={16} className="translate-x-[0.5px]" />
                    </motion.button>
                  </form>
                </div>
              </div>

              {/* Dynamic Context Sidebar */}
              {activeConvo.inquiriable && (() => {
                const item = activeConvo.inquiriable;
                const catStyle = getCategoryStyles(item.type);
                return (
                  <div className="hidden xl:flex w-72 lg:w-80 border-l border-zinc-150/70 bg-white flex-col overflow-y-auto p-6 space-y-6 shrink-0 transition-all duration-300">
                    {/* Sidebar Header */}
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-400">Contextual Reference</p>
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Listing Details</h4>
                        <span className={cn(
                          "text-[9px] font-bold border px-2.5 py-0.5 rounded-full uppercase tracking-wider border-zinc-150 shadow-2xs",
                          catStyle.bg
                        )}>
                          {catStyle.icon} {item.type === 'JobListing' ? 'Job Listing' : item.type}
                        </span>
                      </div>
                    </div>

                    {/* Image Showcase */}
                    <div className="relative overflow-hidden rounded-xl group border border-zinc-150 shadow-2xs">
                      {item.image ? (
                        <motion.img 
                          src={item.image} 
                          className="w-full h-36 object-cover transition-transform duration-500"
                          whileHover={{ scale: 1.03 }}
                          alt={item.title} 
                        />
                      ) : (
                        <div className="w-full h-36 bg-gradient-to-tr from-zinc-50 to-zinc-100/50 flex flex-col items-center justify-center text-zinc-300">
                          <span className="text-3xl mb-1">{catStyle.icon}</span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Premium Asset</span>
                        </div>
                      )}
                    </div>

                    {/* Core Specs */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-zinc-800 tracking-tight leading-snug hover:text-[var(--primary-color)] transition-colors duration-300">
                        {item.title}
                      </h3>

                      {/* Pricing HUD */}
                      <div className="bg-zinc-900 p-4 rounded-xl shadow-xs flex items-center justify-between relative overflow-hidden group">
                        <div className="relative z-10 min-w-0">
                          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-0.5">Valuation</p>
                          <p className="text-base font-extrabold text-white tracking-tight truncate">
                            {item.price}
                          </p>
                        </div>
                        <span className="text-xl relative z-10">{catStyle.icon}</span>
                      </div>
                    </div>

                    {/* Details Specs */}
                    {item.details && (
                      <div className="space-y-1.5">
                        <h5 className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Registry Overview</h5>
                        <p className="text-[11px] text-zinc-500 font-semibold leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-200/50 max-h-28 overflow-y-auto italic">
                          "{item.details}"
                        </p>
                      </div>
                    )}

                    {/* Redirect CTA */}
                    <div className="pt-4 border-t border-zinc-100 mt-auto">
                      <a 
                        href={item.viewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-zinc-900 hover:bg-[var(--primary-color)] text-white py-3 rounded-xl font-bold text-[9px] uppercase tracking-[0.2em] shadow-xs flex items-center justify-center transition-all duration-300 group cursor-pointer"
                      >
                        View Listing <ExternalLink size={12} className="ml-2 transition-transform group-hover:translate-x-0.5" />
                      </a>
                    </div>
                  </div>
                );
              })()}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white/50 backdrop-blur-xs rounded-2xl">
            <motion.div 
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 3, -3, 0]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut"
              }}
              className="w-16 h-16 bg-[var(--primary-light)] text-[var(--primary-color)] rounded-2xl flex items-center justify-center mb-5 shadow-2xs border border-[var(--primary-color)]/5"
            >
              <MessageSquare size={32} className="drop-shadow-2xs" />
            </motion.div>
            <h3 className="font-extrabold text-zinc-800 text-base mb-1.5">Your Inbox</h3>
            <p className="text-zinc-500 text-xs max-w-xs leading-relaxed">
              Select an active conversation from the sidebar list on the left to start viewing your negotiations and inquiries.
            </p>
          </div>
        )}
      </div>

      {/* Report Partner Modal */}
      <AnimatePresence>
        {showReportModal && activeConvo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative border border-zinc-100 text-left"
            >
              <button 
                type="button"
                onClick={() => setShowReportModal(false)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer border-none bg-transparent"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 leading-tight">Report Partner</h3>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Trust & Safety Center</p>
                </div>
              </div>

              {reportSuccess ? (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-6 text-center">
                  <span className="text-3xl mb-2 inline-block">✓</span>
                  <p className="text-sm font-bold text-emerald-800">Report Submitted Successfully</p>
                  <p className="text-xs text-emerald-600 mt-1">Our safety team will review this conversation within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleReportPartner} className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Please describe the issue with <strong>{activeConvo.name}</strong>. Your feedback is fully confidential.
                    </p>
                    <textarea
                      required
                      rows={4}
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      placeholder="Identify offensive behavior, fraud, listing misrepresentation, or other concerns..."
                      className="w-full bg-zinc-50 border-none rounded-2xl p-4 text-xs focus:ring-2 focus:ring-zinc-955 transition-all placeholder-zinc-400 leading-relaxed"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowReportModal(false)}
                      disabled={isReporting}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-red-550 hover:bg-red-600 border-none text-white"
                      isLoading={isReporting}
                    >
                      Submit Report
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

