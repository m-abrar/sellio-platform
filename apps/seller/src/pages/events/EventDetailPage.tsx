import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  HiOutlineChevronLeft, 
  HiOutlinePencilSquare, 
  HiOutlineMapPin,
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineTicket,
  HiOutlineUserGroup,
  HiOutlineStar
} from 'react-icons/hi2';
import PageHeader from '../../components/layout/PageHeader';

export default function EventDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setEvent({
        id: 1,
        title: 'Global Tech Summit 2024',
        slug: 'global-tech-summit-2024',
        price: '$499.00',
        location: 'Convention Center, San Francisco',
        description: 'Join the world\'s leading innovators, developers, and tech enthusiasts for three days of groundbreaking keynotes, hands-on workshops, and unparalleled networking opportunities. The Global Tech Summit 2024 explores the future of AI, sustainable technology, and the next generation of digital transformation.',
        is_active: true,
        date: 'Oct 15 - 17, 2024',
        time: '09:00 AM - 06:00 PM',
        category: 'Technology',
        capacity: '5,000 Attendees',
        organizer: 'TechVision Global',
        speakers: ['Dr. Sarah Chen (AI Ethics)', 'Marcus Vane (Future of Web)', 'Elena Rodriguez (Green Tech)'],
        features: ['VIP Networking Lounge', 'Interactive Demo Zone', 'Gala Dinner', 'Hackathon Access', 'Digital Certificate'],
        media: [
          { original_url: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=1200' },
          { original_url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800' },
          { original_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800' }
        ]
      });
      setIsLoading(false);
    }, 800);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#6610f2] animate-progress-loading" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Syncing Event Schedule...</span>
        </div>
      </div>
    );
  }

  const containerClass = "bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-12";

  return (
    <div className="space-y-10 md:space-y-16 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <PageHeader
        badge="Event Briefing"
        title={event.title}
        subtitle="Event Detail"
      >
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-white border border-slate-100 text-slate-900 px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <HiOutlineChevronLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={() => navigate(`/dashboard/events/edit/${event.slug}`)}
            className="bg-[#6610f2] text-white px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#7b2dfd] transition-all flex items-center gap-2"
          >
            <HiOutlinePencilSquare className="w-4 h-4" /> Edit Event
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT COLUMN: MEDIA & DESCRIPTION */}
        <div className="lg:col-span-8 space-y-10">
          {/* MAIN IMAGE */}
          <div className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src={event.media[0].original_url} 
              className="w-full aspect-video object-cover" 
              alt={event.title} 
            />
          </div>

          {/* GALLERY GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {event.media.slice(1).map((img: any, i: number) => (
              <div key={i} className="rounded-[2rem] overflow-hidden border-2 border-white shadow-md">
                <img src={img.original_url} className="w-full aspect-square object-cover" alt="" />
              </div>
            ))}
          </div>

          {/* DESCRIPTION */}
          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Event Narrative.
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg font-medium">
              {event.description}
            </p>
          </div>

          {/* SPEAKERS */}
          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-pink-500 rounded-full" /> Keynote Speakers.
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {event.speakers.map((speaker: string, i: number) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <HiOutlineStar className="w-5 h-5 text-pink-500" />
                  <span className="text-sm font-bold text-slate-700">{speaker}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STATS & TICKETS */}
        <div className="lg:col-span-4 space-y-10">
          {/* PRICE CARD */}
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Standard Admission</p>
              <h4 className="text-5xl font-black italic tracking-tighter mb-8">{event.price}</h4>
              <div className="flex items-center gap-3 text-pink-400 font-bold text-sm">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                TICKETS AVAILABLE
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <HiOutlineTicket className="w-32 h-32" />
            </div>
          </div>

          {/* QUICK STATS */}
          <div className={containerClass}>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Event Logistics</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineCalendarDays className="w-5 h-5" />
                  <span className="text-sm font-bold">Date</span>
                </div>
                <span className="text-sm font-black text-slate-900">{event.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineClock className="w-5 h-5" />
                  <span className="text-sm font-bold">Time</span>
                </div>
                <span className="text-sm font-black text-slate-900">{event.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineMapPin className="w-5 h-5" />
                  <span className="text-sm font-bold">Venue</span>
                </div>
                <span className="text-sm font-black text-slate-900 text-right max-w-[150px]">{event.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineUserGroup className="w-5 h-5" />
                  <span className="text-sm font-bold">Capacity</span>
                </div>
                <span className="text-sm font-black text-slate-900">{event.capacity}</span>
              </div>
            </div>
          </div>

          {/* ORGANIZER INFO */}
          <div className={containerClass}>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Event Organizer</h4>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] flex items-center justify-center text-pink-600 border-2 border-white shadow-sm">
                <HiOutlineTicket className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-black text-slate-900 leading-none mb-1">{event.organizer}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Host</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-600">
                events@techvision.com
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-600">
                +1 (415) 555-0122
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
