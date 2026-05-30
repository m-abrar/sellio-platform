import React, { useState, useEffect } from 'react';
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
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getConversations();
        setMessages(response.data.data);
        setPartnerId(response.data.partnerId ?? 0);
      } catch (error) {
        console.error('Failed to fetch messages', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    if (messages.length > 0 && !id) {
      navigate(`/dashboard/messages/${messages[0].id}`, { replace: true });
    }
  }, [messages, id]);

  useEffect(() => {
    const fetchThread = async () => {
      if (!selectedId) {
        setThreadMessages([]);
        return;
      }

      try {
        const response = await getConversationThread(selectedId);
        setThreadMessages(response.data.messages);
        setPartnerId(response.data.partnerId ?? partnerId);
      } catch (error) {
        console.error('Failed to fetch conversation thread', error);
      }
    };

    fetchThread();
  }, [selectedId]);

  const selectedMessage = messages.find((message) => message.id === selectedId);

  const handleSend = async () => {
    if (!selectedId || !draft.trim()) {
      return;
    }

    setIsSending(true);
    try {
      await sendMessage(selectedId, draft.trim());
      setDraft('');
      const response = await getConversationThread(selectedId);
      setThreadMessages(response.data.messages);
      toast.success('Message sent.');
    } catch (error) {
      console.error('Failed to send message', error);
      toast.error('Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader badge="Communication" title="Studio" subtitle="Inbox" />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Syncing Messages...</span>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-premium overflow-hidden flex">
          <div className={`w-full lg:w-[400px] border-r border-slate-50 flex flex-col ${selectedId ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-6 border-b border-slate-50 bg-slate-50/30">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#6610f2]/10 transition-all"
              />
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => navigate(`/dashboard/messages/${msg.id}`)}
                  className={`p-6 flex items-center gap-4 hover:bg-slate-50 transition-all cursor-pointer border-b border-slate-50 last:border-0 group ${selectedId === msg.id ? 'bg-slate-50 border-l-4 border-l-[#6610f2]' : ''} ${msg.unread ? 'bg-slate-50/30' : ''}`}
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

                  <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {threadMessages.length === 0 ? (
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
                            <p className={`text-[9px] font-black uppercase tracking-widest mt-4 ${message.isMine ? 'text-white/50' : 'text-slate-300'}`}>{message.createdAt}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-6 bg-white border-t border-slate-50">
                    <div className="relative">
                      <textarea
                        placeholder="Type your message here..."
                        rows={1}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 pr-16 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6610f2]/20 transition-all resize-none"
                      />
                      <button
                        onClick={handleSend}
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
                    <div className="hidden xl:flex w-[320px] border-l border-slate-100 bg-white flex-col overflow-y-auto custom-scrollbar p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
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
                            className="w-full h-44 object-cover rounded-2xl border border-slate-100 shadow-sm transition-transform duration-500 hover:scale-[1.02]" 
                            alt={item.title} 
                          />
                        ) : (
                          <div className="w-full h-44 bg-gradient-to-tr from-slate-50 to-slate-100/50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 text-slate-300">
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
                        <div className="bg-slate-950 p-5 rounded-2xl shadow-xl shadow-slate-900/5 flex items-center justify-between relative overflow-hidden group">
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
                          <p className="text-[11px] text-slate-500 font-bold leading-relaxed bg-slate-50/50 p-5 rounded-2xl border border-slate-100/50 max-h-36 overflow-y-auto custom-scrollbar italic">
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
