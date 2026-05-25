import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import { 
  HiOutlineEnvelope, 
  HiOutlineEnvelopeOpen, 
  HiOutlineChevronRight,
  HiOutlinePaperAirplane,
  HiOutlineArrowLeft,
  HiOutlineUser
} from 'react-icons/hi2';
import { getMessages } from '../../api/messages';

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getMessages();
        setMessages(response.data.data);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const selectedMessage = messages.find(m => m.id === selectedId);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader badge="Communication" title="Studio" subtitle="Inbox" />
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Syncing Messages...</span>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-premium overflow-hidden flex">
          {/* LIST SIDE */}
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
                  onClick={() => setSelectedId(msg.id)}
                  className={`p-6 flex items-center gap-4 hover:bg-slate-50 transition-all cursor-pointer border-b border-slate-50 last:border-0 group ${selectedId === msg.id ? 'bg-slate-50 border-l-4 border-l-[#6610f2]' : ''} ${msg.unread ? 'bg-slate-50/30' : ''}`}
                >
                  <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${msg.unread ? 'bg-[#6610f2] border-[#6610f2] text-white' : 'bg-white border-slate-100 text-slate-300'}`}>
                    {msg.unread ? <HiOutlineEnvelope className="w-5 h-5" /> : <HiOutlineEnvelopeOpen className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className={`text-sm tracking-tight truncate ${msg.unread ? 'font-black text-slate-900' : 'font-bold text-slate-600'}`}>{msg.sender}</h4>
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{msg.date}</span>
                    </div>
                    <p className={`text-[11px] truncate ${msg.unread ? 'font-bold text-slate-800' : 'font-medium text-slate-400'}`}>
                      {msg.subject}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CONTENT SIDE */}
          <div className={`flex-1 flex flex-col bg-slate-50/10 ${!selectedId ? 'hidden lg:flex' : 'flex'}`}>
            {selectedMessage ? (
              <>
                {/* THREAD HEADER */}
                <div className="p-6 bg-white border-b border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedId(null)} className="lg:hidden p-2 text-slate-400">
                      <HiOutlineArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 rounded-xl bg-[#6610f2]/5 flex items-center justify-center text-[#6610f2] font-black">
                      {selectedMessage.sender.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 tracking-tight">{selectedMessage.sender}</h4>
                      <p className="text-[10px] font-black text-[#6610f2] uppercase tracking-widest">{selectedMessage.subject}</p>
                    </div>
                  </div>
                  <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-red-500 transition-colors">
                    <HiOutlineUser className="w-5 h-5" />
                  </button>
                </div>

                {/* THREAD CONTENT */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                  <div className="flex flex-col items-center mb-10">
                    <span className="px-4 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">Conversation Started • {selectedMessage.date}</span>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
                    <div className="bg-white p-6 rounded-2xl rounded-tl-none border border-slate-100 max-w-[80%] shadow-sm">
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">{selectedMessage.preview}</p>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-4">{selectedMessage.date}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 flex-row-reverse">
                    <div className="w-10 h-10 rounded-xl bg-[#6610f2] shrink-0" />
                    <div className="bg-[#6610f2] p-6 rounded-2xl rounded-tr-none text-white max-w-[80%] shadow-lg shadow-purple-200">
                      <p className="text-sm font-medium leading-relaxed">Thank you for your inquiry. We have received your message and will get back to you shortly with more details.</p>
                      <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mt-4">Just Now</p>
                    </div>
                  </div>
                </div>

                {/* THREAD INPUT */}
                <div className="p-6 bg-white border-t border-slate-50">
                  <div className="relative">
                    <textarea 
                      placeholder="Type your message here..." 
                      rows={1}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 pr-16 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6610f2]/20 transition-all resize-none"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#6610f2] text-white rounded-xl flex items-center justify-center shadow-lg shadow-purple-200 hover:scale-105 active:scale-95 transition-all">
                      <HiOutlinePaperAirplane className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
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
