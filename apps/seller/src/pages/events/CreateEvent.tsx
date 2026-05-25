import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { triggerCelebration } from '../../utils/animations';
import {
  HiOutlineCalendar,
  HiOutlineMapPin,
  HiOutlineUserGroup,
  HiOutlineTicket,
  HiOutlineChevronLeft,
  HiOutlineClock
} from 'react-icons/hi2';
import MediaStudio from '../../components/studio/MediaStudio';
import PageHeader from '../../components/layout/PageHeader';
import ActionPill from '../../utils/ActionPill';
import { createEvent, getEventBySlug, getEventFormMeta, updateEvent } from '../../api/events';
import { ApiError } from '../../lib/apiError';

const containerClass = 'bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-12';
const labelClass = 'text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block ml-2';
const inputClass = 'w-full bg-slate-50 border-2 border-transparent focus:border-[#6610f2] focus:bg-white rounded-[1.5rem] px-6 py-5 text-slate-900 font-bold transition-all outline-none placeholder:text-slate-300';

const defaultForm = {
  title: '',
  date: '',
  time: '',
  venue: '',
  location: '',
  capacity: '',
  organizer: '',
  price: '',
  description: '',
  category_id: '',
  is_published: true,
};

export default function CreateEvent() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(slug);

  const [formMeta, setFormMeta] = useState<any>({ categories: [], types: [], locations: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [eventId, setEventId] = useState<number | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [form, setForm] = useState(defaultForm);
  const [ticketMeta, setTicketMeta] = useState({ id: 'NEW_1', title: 'General Admission', durationHours: 3 });
  const [occurrenceMeta, setOccurrenceMeta] = useState({ id: 'NEW_1' });

  const updateForm = useCallback((field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const progress = useMemo(() => {
    let score = 0;
    if (form.title.length > 5) score += 15;
    if (files.some((f) => f.isMain)) score += 15;
    if (form.date !== '') score += 15;
    if (form.venue !== '') score += 15;
    if (form.price !== '') score += 15;
    if (form.category_id !== '') score += 15;
    if (form.description.length > 20) score += 10;
    return score;
  }, [form, files]);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        const meta = await getEventFormMeta();
        setFormMeta(meta);

        if (isEditMode && slug) {
          const { data: event } = await getEventBySlug(slug);
          const ticket = event.ticket_types?.[0];
          const occurrence = event.occurrences?.[0];

          setEventId(event.id);
          setTicketMeta({
            id: ticket ? String(ticket.id) : 'NEW_1',
            title: ticket?.title || 'General Admission',
            durationHours: occurrence?.duration_hours || 3,
          });
          setOccurrenceMeta({
            id: occurrence ? String(occurrence.id) : 'NEW_1',
          });
          setForm({
            title: event.title || '',
            date: event.date || '',
            time: event.time || '',
            venue: event.venue || '',
            location: event.location || '',
            capacity: event.capacity != null ? String(event.capacity) : '',
            organizer: event.organizer || '',
            price: event.base_price != null ? String(event.base_price) : '',
            description: event.description || '',
            category_id: event.category_id ? String(event.category_id) : '',
            is_published: event.is_published ?? true,
          });

          const initialMedia: any[] = [];
          if (event.featured_image) {
            initialMedia.push({
              id: event.gallery[0]?.id,
              url: event.featured_image,
              preview: event.featured_image,
              isMain: true,
              existing: true,
            });
          }
          event.gallery.forEach((item: any) => {
            if (item.url !== event.featured_image) {
              initialMedia.push({
                id: item.id,
                url: item.url,
                preview: item.thumbnail || item.url,
                isMain: false,
                existing: true,
              });
            }
          });
          setFiles(initialMedia);
        }
      } catch (error) {
        console.error('Failed to initialize event form', error);
        toast.error('Failed to load event data.');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [isEditMode, slug]);

  const buildFormData = () => {
    const formData = new FormData();
    const basePrice = parseFloat(form.price) || 0;
    const capacity = parseInt(form.capacity, 10) || 0;
    const startDateTime = `${form.date} ${form.time}:00`;

    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('category_id', form.category_id);
    formData.append('base_price', String(basePrice));
    formData.append('is_paid', basePrice > 0 ? '1' : '0');
    formData.append('is_published', form.is_published ? '1' : '0');
    formData.append('is_virtual', '0');

    if (form.location) formData.append('city', form.location);
    if (form.organizer) formData.append('organizer_name', form.organizer);

    formData.append('tickets[0][id]', ticketMeta.id);
    formData.append('tickets[0][title]', ticketMeta.title);
    formData.append('tickets[0][base_price]', String(basePrice));

    formData.append('occurrences[0][id]', occurrenceMeta.id);
    formData.append('occurrences[0][start_date_time]', startDateTime);
    formData.append('occurrences[0][duration_hours]', String(ticketMeta.durationHours));
    formData.append('occurrences[0][max_attendees]', String(capacity));
    formData.append('occurrences[0][venue_details]', form.venue);
    formData.append(`occurrences[0][inventory][${ticketMeta.id}][available_quantity]`, String(capacity));
    formData.append(`occurrences[0][inventory][${ticketMeta.id}][override_price]`, '0');

    files.forEach((fileObj) => {
      if (fileObj.file) {
        if (fileObj.isMain) formData.append('main_image', fileObj.file);
        else formData.append('gallery[]', fileObj.file);
      } else if (fileObj.existing) {
        formData.append('existing_media_ids[]', String(fileObj.id));
      }
    });

    return formData;
  };

  const handleSave = async () => {
    if (!form.title || !form.description || !form.category_id || !form.date || !form.time) {
      toast.error('Please complete the required event fields.');
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading('Publishing event...');

    try {
      const formData = buildFormData();

      if (isEditMode && eventId) {
        await updateEvent(eventId, formData);
      } else {
        await createEvent(formData);
      }

      toast.success(`${form.title || 'Event'} saved successfully.`, { id: toastId });
      await triggerCelebration();
      setTimeout(() => navigate('/dashboard/events'), 1500);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to publish event.';
      toast.error(message, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Loading Event Studio...</span>
      </div>
    );
  }

  return (
    <div className="space-y-10 md:space-y-16 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <PageHeader
        badge="Experience Protocol"
        title={isEditMode ? 'Modify' : 'Create'}
        subtitle="Event"
      >
        <button
          onClick={() => navigate(-1)}
          className="bg-white border border-slate-100 text-slate-900 px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <HiOutlineChevronLeft className="w-4 h-4" /> Back
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Event Identity.
            </h3>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className={labelClass}>Event Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    className={`${inputClass} text-2xl italic tracking-tighter`}
                    placeholder="e.g. Summer Tech Summit 2026"
                  />
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => updateForm('category_id', e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select category</option>
                    {formMeta.categories.map((category: any) => (
                      <option key={category.id} value={category.id}>{category.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Organizer</label>
                  <input
                    type="text"
                    value={form.organizer}
                    onChange={(e) => updateForm('organizer', e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Sellio Studio"
                  />
                </div>
                <div>
                  <label className={labelClass}>Venue Name</label>
                  <input
                    type="text"
                    value={form.venue}
                    onChange={(e) => updateForm('venue', e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Grand Plaza Hotel"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10 flex items-center gap-3">
              <span className="w-2 h-8 bg-purple-500 rounded-full" /> Schedule & Logistics.
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClass}>Date</label>
                <div className="relative">
                  <HiOutlineCalendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => updateForm('date', e.target.value)}
                    className={`${inputClass} pl-14`}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Start Time</label>
                <div className="relative">
                  <HiOutlineClock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => updateForm('time', e.target.value)}
                    className={`${inputClass} pl-14`}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Capacity</label>
                <div className="relative">
                  <HiOutlineUserGroup className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="number"
                    value={form.capacity}
                    onChange={(e) => updateForm('capacity', e.target.value)}
                    className={`${inputClass} pl-14`}
                    placeholder="e.g. 500"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Location (City, State)</label>
                <div className="relative">
                  <HiOutlineMapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => updateForm('location', e.target.value)}
                    className={`${inputClass} pl-14`}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10 flex items-center gap-3">
              <span className="w-2 h-8 bg-green-500 rounded-full" /> Ticketing.
            </h3>
            <div>
              <label className={labelClass}>Base Ticket Price (USD)</label>
              <div className="relative">
                <HiOutlineTicket className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) => updateForm('price', e.target.value)}
                  className={`${inputClass} pl-14 text-3xl`}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Media Studio.
            </h3>
            <MediaStudio files={files} setFiles={setFiles} />
          </div>

          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8">Event Narrative.</h3>
            <textarea
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              rows={6}
              className={`${inputClass} resize-none`}
              placeholder="What makes this experience unique? Describe the agenda, speakers, or highlights..."
            />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Event Readiness</p>
              <span className="text-7xl font-black italic tracking-tighter">{progress}%</span>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-[#6610f2] transition-all duration-1000 shadow-[0_0_15px_#6610f2]" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <HiOutlineCalendar className="w-32 h-32" />
            </div>
          </div>

          <div className="hidden lg:block">
            <ActionPill
              isSaving={isSaving}
              isEditMode={isEditMode}
              onSave={handleSave}
              label="Event"
              variant="docked"
            />
          </div>

          <div className={containerClass}>
            <h4 className={labelClass}>Visibility</h4>
            <label className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors group mt-6">
              <span className="text-sm font-bold text-slate-700 group-hover:text-[#6610f2] transition-colors">Public Listing</span>
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => updateForm('is_published', e.target.checked)}
                className="w-6 h-6 rounded-lg accent-[#6610f2] cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      <ActionPill
        isSaving={isSaving}
        isEditMode={isEditMode}
        onSave={handleSave}
        label="Event"
        variant="floating"
      />
    </div>
  );
}
