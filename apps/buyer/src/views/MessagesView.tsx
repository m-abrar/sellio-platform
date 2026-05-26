import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Search, Send, Circle } from 'lucide-react';
import { cn } from '../lib/utils';
import { fetchMessages, sendMessage, fetchConversations } from '../api/messageApi';

export default function MessagesView() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvo, setActiveConvo] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadInitialData();
    const interval = setInterval(loadMessages, 5000); // Poll for new messages
    return () => clearInterval(interval);
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const convos = await fetchConversations();
      setConversations(convos);
      if (convos.length > 0) {
        setActiveConvo(convos[0]);
      }
      await loadMessages();
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

  const loadMessages = async () => {
    try {
      const data = await fetchMessages();
      setMessages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const content = newMessage;
    setNewMessage('');

    try {
      const sent = await sendMessage(content, activeConvo.id);
      setMessages([...messages, sent]);
    } catch (error) {
      console.error(error);
    }
  };

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
              <img src={convo.avatar || `https://picsum.photos/seed/${convo.name}/100/100`} alt={convo.name} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
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
              {messages.filter(m => (m.sender_id === 1 && m.receiver_id === activeConvo.id) || (m.sender_id === activeConvo.id && m.receiver_id === 1)).map((msg) => (
                <div 
                  key={msg.id}
                  className={cn(
                    "flex flex-col max-w-[70%]",
                    msg.sender_id === 1 ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "px-4 py-2 rounded-2xl text-sm",
                    msg.sender_id === 1 
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
              {messages.filter(m => (m.sender_id === 1 && m.receiver_id === activeConvo.id) || (m.sender_id === activeConvo.id && m.receiver_id === 1)).length === 0 && !loading && (
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
