import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, Circle } from 'lucide-react';
import { cn } from '../lib/utils';
import { fetchMessages, sendMessage, fetchConversations } from '../api/messageApi';
import { useUser } from '../context/UserContext';
import { API_BASE_URL } from '../config/api';

const apiOrigin = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return '';
  }
})();

const fallbackAvatar = `${apiOrigin}/images/fallbacks/default-avatar.png`;

export default function MessagesView() {
  const { user } = useUser();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvo, setActiveConvo] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!activeConvo) return;

    loadMessages(activeConvo.id);
    const interval = window.setInterval(() => loadMessages(activeConvo.id), 5000);

    return () => window.clearInterval(interval);
  }, [activeConvo?.id]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const convos = await fetchConversations();
      setConversations(convos);
      if (convos.length > 0) {
        setActiveConvo(convos[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessages = async (conversationId = activeConvo?.id) => {
    if (!conversationId) return;

    try {
      const data = await fetchMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const content = newMessage;
    setNewMessage('');

    try {
      const sent = await sendMessage(content, activeConvo.id);
      setMessages((current) => [...current, sent]);
    } catch (error) {
      console.error(error);
    }
  };

  const currentMessages = activeConvo ? messages : [];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 px-3">
      {/* Conversation List */}
      <div className="w-full lg:w-80 flex-shrink-0 flex flex-col glass-surface overflow-hidden">
        <div className="p-4 border-b border-white/50 font-bold text-[var(--primary-color)]">
          Conversations
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((convo) => (
            <button
              key={convo.id}
              onClick={() => setActiveConvo(convo)}
              className={cn(
                "w-full p-4 flex items-center gap-3 transition-all border-l-4",
                activeConvo?.id === convo.id 
                  ? "bg-[var(--primary-light)] border-[var(--primary-color)]" 
                  : "border-transparent hover:bg-white/50"
              )}
            >
              <img src={convo.avatar || fallbackAvatar} alt={convo.name} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
              <div className="flex-1 text-left min-w-0">
                <h6 className="font-bold text-sm text-zinc-900 truncate">{convo.name}</h6>
                <p className="text-xs text-zinc-500 truncate">{convo.lastMessage}</p>
              </div>
              {convo.unread > 0 && (
                <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {convo.unread}
                </span>
              )}
            </button>
          ))}
          {conversations.length === 0 && !loading && (
            <div className="p-8 text-center text-zinc-400 text-xs">
              No conversations found.
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col glass-surface overflow-hidden">
        {/* Header */}
        {activeConvo ? (
          <>
            <div className="p-4 border-b border-white/50 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-zinc-900">{activeConvo.name}</h5>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold uppercase">
                  <Circle size={8} fill="currentColor" />
                  Active Now
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {currentMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className={cn(
                    "flex flex-col max-w-[70%]",
                    msg.sender_id === user?.id ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "px-4 py-2 rounded-2xl text-sm",
                    msg.sender_id === user?.id
                      ? "bg-[var(--primary-color)] text-white rounded-br-none" 
                      : "bg-[var(--primary-light)] text-zinc-900 rounded-bl-none"
                  )}>
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1 font-medium">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {currentMessages.length === 0 && !loading && (
                <div className="text-center py-20 text-zinc-400 text-sm italic">
                  No messages yet. Start the conversation!
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white/50 border-t border-white/50">
              <form onSubmit={handleSend} className="flex gap-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-white border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
                />
                <button 
                  type="submit"
                  className="p-2 bg-[var(--primary-color)] text-white rounded-xl hover:bg-[var(--primary-dark)] transition-colors"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-400">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
