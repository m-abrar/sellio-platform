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
import { getWelcomeData } from '../../api/dashboard';
import { ApiError } from '../../lib/apiError';

const containerClass = 'bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-12';
const labelClass = 'text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block ml-2';
const inputClass = 'w-full bg-slate-50 border-2 border-transparent focus:border-[#6610f2] focus:bg-white rounded-[1.5rem] px-6 py-5 text-slate-900 font-bold transition-all outline-none placeholder:text-slate-300';

const defaultForm = {
  title: '',
  organizer: '',
  organizer_email: '',
  organizer_phone: '',
  description: '',
  category_id: '',
  brand_id: '',
  type_id: '',
  location_id: '',
  is_published: true,
  is_virtual: false,
  virtual_link: '',
  address: '',
  city: '',
  state: '',
  country: '',
  zip_code: '',
  latitude: '',
  longitude: '',
  event_genre: '',
  venue_size: '',
};

interface TicketItem {
  id: string;
  title: string;
  base_price: string;
}

interface OccurrenceItem {
  id: string;
  date: string;
  time: string;
  duration_hours: string;
  max_attendees: string;
  venue_details: string;
  inventory: Record<string, { available_quantity: string; override_price: string }>;
}

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

  // Advanced sub-wizard states
  const [ticketsList, setTicketsList] = useState<TicketItem[]>([
    { id: 'NEW_1', title: 'General Admission', base_price: '' }
  ]);

  const [occurrencesList, setOccurrencesList] = useState<OccurrenceItem[]>([
    {
      id: 'NEW_1',
      date: '',
      time: '',
      duration_hours: '3',
      max_attendees: '',
      venue_details: '',
      inventory: {
        NEW_1: { available_quantity: '', override_price: '0' }
      }
    }
  ]);

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [limits, setLimits] = useState<any>(null);

  const updateForm = useCallback((field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateTicketField = (id: string, field: 'title' | 'base_price', value: string) => {
    setTicketsList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const addTicketType = () => {
    const newId = `NEW_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setTicketsList((prev) => [...prev, { id: newId, title: '', base_price: '' }]);
    setOccurrencesList((prev) =>
      prev.map((occ) => ({
        ...occ,
        inventory: {
          ...occ.inventory,
          [newId]: { available_quantity: '', override_price: '0' }
        }
      }))
    );
  };

  const removeTicketType = (id: string) => {
    setTicketsList((prev) => prev.filter((t) => t.id !== id));
    setOccurrencesList((prev) =>
      prev.map((occ) => {
        const nextInv = { ...occ.inventory };
        delete nextInv[id];
        return { ...occ, inventory: nextInv };
      })
    );
  };

  const addOccurrenceSlot = () => {
    const newId = `NEW_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const defaultInventory: Record<string, { available_quantity: string; override_price: string }> = {};
    ticketsList.forEach((t) => {
      defaultInventory[t.id] = { available_quantity: '', override_price: '0' };
    });
    setOccurrencesList((prev) => [
      ...prev,
      {
        id: newId,
        date: '',
        time: '',
        duration_hours: '3',
        max_attendees: '',
        venue_details: '',
        inventory: defaultInventory
      }
    ]);
  };

  const removeOccurrenceSlot = (id: string) => {
    setOccurrencesList((prev) => prev.filter((occ) => occ.id !== id));
  };

  const updateOccurrenceField = (id: string, field: string, value: string) => {
    setOccurrencesList((prev) =>
      prev.map((occ) => (occ.id === id ? { ...occ, [field]: value } : occ))
    );
  };

  const updateInventoryField = (
    occId: string,
    ticketId: string,
    field: 'available_quantity' | 'override_price',
    value: string
  ) => {
    setOccurrencesList((prev) =>
      prev.map((occ) => {
        if (occ.id !== occId) return occ;
        return {
          ...occ,
          inventory: {
            ...occ.inventory,
            [ticketId]: {
              ...(occ.inventory[ticketId] || { available_quantity: '', override_price: '0' }),
              [field]: value
            }
          }
        };
      })
    );
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && !tags.includes(val)) {
        setTags((prev) => [...prev, val]);
      }
      setTagInput('');
    }
  };

  const progress = useMemo(() => {
    let score = 0;
    if (form.title.length > 5) score += 15;
    if (files.some((f) => f.isMain)) score += 15;
    if (occurrencesList.some((occ) => occ.date !== '')) score += 15;
    if (occurrencesList.some((occ) => occ.venue_details !== '')) score += 15;
    if (ticketsList.some((t) => t.base_price !== '')) score += 15;
    if (form.category_id !== '') score += 15;
    if (form.description.length > 20) score += 10;
    return score;
  }, [form, files, occurrencesList, ticketsList]);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        const [meta, dashboardResponse] = await Promise.all([
          getEventFormMeta(),
          !isEditMode ? getWelcomeData().catch(() => null) : Promise.resolve(null)
        ]);
        setFormMeta(meta);
        if (dashboardResponse) {
          setLimits(dashboardResponse.data.subscriptionLimits);
        }

        if (isEditMode && slug) {
          const { data: event } = await getEventBySlug(slug);

          setEventId(event.id);

          // Populate Ticket Types List
          if (event.ticket_types && event.ticket_types.length > 0) {
            setTicketsList(event.ticket_types.map((ticket: any) => ({
              id: String(ticket.id),
              title: ticket.title || '',
              base_price: ticket.base_price != null ? String(ticket.base_price) : '',
            })));
          } else {
            setTicketsList([{ id: 'NEW_1', title: 'General Admission', base_price: event.base_price != null ? String(event.base_price) : '' }]);
          }

          // Populate Occurrences List
          if (event.occurrences && event.occurrences.length > 0) {
            setOccurrencesList(event.occurrences.map((occ: any) => {
              const startAt = occ.start_date_time;
              let occDate = '';
              let occTime = '';
              if (startAt) {
                const parsed = new Date(startAt);
                if (!Number.isNaN(parsed.getTime())) {
                  occDate = parsed.getFullYear() + '-' + String(parsed.getMonth() + 1).padStart(2, '0') + '-' + String(parsed.getDate()).padStart(2, '0');
                  occTime = String(parsed.getHours()).padStart(2, '0') + ':' + String(parsed.getMinutes()).padStart(2, '0');
                }
              }

              const occInventory: Record<string, { available_quantity: string; override_price: string }> = {};
              if (occ.inventory) {
                Object.entries(occ.inventory).forEach(([tId, inv]: [string, any]) => {
                  occInventory[tId] = {
                    available_quantity: inv.available_quantity != null ? String(inv.available_quantity) : '',
                    override_price: inv.override_price != null ? String(inv.override_price) : '0',
                  };
                });
              }

              return {
                id: String(occ.id),
                date: occDate,
                time: occTime,
                duration_hours: occ.duration_hours != null ? String(occ.duration_hours) : '3',
                max_attendees: occ.max_attendees != null ? String(occ.max_attendees) : '',
                venue_details: occ.venue_details || '',
                inventory: occInventory,
              };
            }));
          } else {
            setOccurrencesList([{
              id: 'NEW_1',
              date: event.date || '',
              time: event.time || '',
              duration_hours: '3',
              max_attendees: event.capacity != null ? String(event.capacity) : '',
              venue_details: event.venue || '',
              inventory: {
                NEW_1: { available_quantity: event.capacity != null ? String(event.capacity) : '', override_price: '0' }
              }
            }]);
          }

          // Populate Tags
          if (event.tags) {
            setTags(event.tags);
          }

          setForm({
            title: event.title || '',
            organizer: event.organizer || '',
            organizer_email: event.organizer_email || '',
            organizer_phone: event.organizer_phone || '',
            description: event.description || '',
            category_id: event.category_id ? String(event.category_id) : '',
            brand_id: event.brand_id ? String(event.brand_id) : '',
            type_id: event.type_id ? String(event.type_id) : '',
            location_id: event.location_id ? String(event.location_id) : '',
            is_published: event.is_published ?? true,
            is_virtual: event.is_virtual ?? false,
            virtual_link: event.virtual_link || '',
            address: event.address || '',
            city: event.city || '',
            state: event.state || '',
            country: event.country || '',
            zip_code: event.zip_code || '',
            latitude: event.latitude != null ? String(event.latitude) : '',
            longitude: event.longitude != null ? String(event.longitude) : '',
            event_genre: event.event_genre || '',
            venue_size: event.venue_size != null ? String(event.venue_size) : '',
          });

          const initialMedia: any[] = [];
          if (event.featured_image) {
            initialMedia.push({
              id: event.gallery?.[0]?.id,
              url: event.featured_image,
              preview: event.featured_image,
              isMain: true,
              existing: true,
            });
          }
          if (event.gallery) {
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
          }
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

    // Core attributes
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('category_id', form.category_id);
    if (form.brand_id) formData.append('brand_id', form.brand_id);
    if (form.type_id) formData.append('type_id', form.type_id);
    if (form.location_id) formData.append('location_id', form.location_id);

    const firstTicket = ticketsList[0];
    const basePrice = parseFloat(firstTicket?.base_price || '') || 0;

    formData.append('base_price', String(basePrice));
    formData.append('is_paid', basePrice > 0 ? '1' : '0');
    formData.append('is_published', form.is_published ? '1' : '0');
    formData.append('is_virtual', form.is_virtual ? '1' : '0');
    formData.append('virtual_link', form.virtual_link || '');

    formData.append('organizer_name', form.organizer || '');
    formData.append('organizer_email', form.organizer_email || '');
    formData.append('organizer_phone', form.organizer_phone || '');
    
    formData.append('event_genre', form.event_genre || '');
    formData.append('venue_size', form.venue_size || '');

    formData.append('address', form.address || '');
    formData.append('city', form.city || '');
    formData.append('state', form.state || '');
    formData.append('country', form.country || '');
    formData.append('zip_code', form.zip_code || '');
    if (form.latitude) formData.append('latitude', form.latitude);
    if (form.longitude) formData.append('longitude', form.longitude);

    // Dynamic Ticket Pricing definitions
    ticketsList.forEach((ticket, idx) => {
      formData.append(`tickets[${idx}][id]`, String(ticket.id));
      formData.append(`tickets[${idx}][title]`, ticket.title);
      formData.append(`tickets[${idx}][base_price]`, String(parseFloat(ticket.base_price) || 0));
    });

    // Scheduled Occurrences and Inventory Allocation Matrix
    occurrencesList.forEach((occ, idx) => {
      formData.append(`occurrences[${idx}][id]`, String(occ.id));
      const startDateTime = occ.date && occ.time ? `${occ.date} ${occ.time}:00` : '';
      formData.append(`occurrences[${idx}][start_date_time]`, startDateTime);
      formData.append(`occurrences[${idx}][duration_hours]`, String(parseFloat(occ.duration_hours) || 3));
      formData.append(`occurrences[${idx}][max_attendees]`, String(parseInt(occ.max_attendees, 10) || 0));
      formData.append(`occurrences[${idx}][venue_details]`, occ.venue_details || '');

      Object.entries(occ.inventory || {}).forEach(([ticketId, inv]: [string, any]) => {
        formData.append(`occurrences[${idx}][inventory][${ticketId}][available_quantity]`, String(parseInt(inv.available_quantity, 10) || 0));
        formData.append(`occurrences[${idx}][inventory][${ticketId}][override_price]`, String(parseFloat(inv.override_price) || 0));
      });
    });

    // Polymorphic tags
    tags.forEach((tag) => formData.append('tags[]', tag));

    // Media studio upload files
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
    if (!form.title || !form.description || !form.category_id) {
      toast.error('Please complete the required event fields.');
      return;
    }

    const hasIncompleteOccurrences = occurrencesList.some(occ => !occ.date || !occ.time);
    if (hasIncompleteOccurrences) {
      toast.error('Please select a date and start time for all scheduled occurrence slots.');
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

  if (!isLoading && !isEditMode && limits?.is_limit_exceeded) {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <PageHeader badge="Limit Guard" title="Create" subtitle="Event" />
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="relative z-10 max-w-md space-y-8">
            <div className="w-20 h-20 rounded-3xl bg-[#6610f2]/20 border border-[#6610f2]/30 flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <span className="text-4xl">🛡️</span>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black italic tracking-tight">Active Limit Reached!</h3>
              <p className="text-sm font-medium text-slate-300 leading-relaxed">
                You have reached your subscription active listing limit ({limits.current_listings_count} / {limits.max_listings} listings). 
                Please upgrade your plan to create more events.
              </p>
            </div>
            <button 
              type="button"
              onClick={() => navigate('/dashboard/memberships')}
              className="bg-[#6610f2] hover:bg-[#7b2dfd] px-10 py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-xl shadow-purple-900/40 inline-flex items-center gap-2 cursor-pointer"
            >
              Upgrade Subscription Plan
            </button>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#6610f2]/20 rounded-full blur-[120px]" />
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-[#6610f2]/10 rounded-full blur-[120px]" />
        </div>
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
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Event Identity.
            </h3>
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Event Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateForm('title', e.target.value)}
                  className={`${inputClass} text-2xl italic tracking-tighter`}
                  placeholder="e.g. Summer Tech Summit 2026"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => updateForm('category_id', e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select category</option>
                    {formMeta.categories?.map((category: any) => (
                      <option key={category.id} value={category.id}>{category.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Event Genre</label>
                  <input
                    type="text"
                    value={form.event_genre}
                    onChange={(e) => updateForm('event_genre', e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Conference, Music Festival"
                  />
                </div>
                {formMeta.types?.length > 0 && (
                  <div>
                    <label className={labelClass}>Type</label>
                    <select
                      value={form.type_id}
                      onChange={(e) => updateForm('type_id', e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select type</option>
                      {formMeta.types.map((t: any) => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                      ))}
                    </select>
                  </div>
                )}
                {formMeta.brands?.length > 0 && (
                  <div>
                    <label className={labelClass}>Brand / Sponsor</label>
                    <select
                      value={form.brand_id}
                      onChange={(e) => updateForm('brand_id', e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select brand</option>
                      {formMeta.brands.map((b: any) => (
                        <option key={b.id} value={b.id}>{b.title}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-blue-500 rounded-full" /> Organizer Info.
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>Organizer Name</label>
                <input
                  type="text"
                  value={form.organizer}
                  onChange={(e) => updateForm('organizer', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Sellio Studio"
                />
              </div>
              <div>
                <label className={labelClass}>Organizer Email</label>
                <input
                  type="email"
                  value={form.organizer_email}
                  onChange={(e) => updateForm('organizer_email', e.target.value)}
                  className={inputClass}
                  placeholder="organizer@example.com"
                />
              </div>
              <div>
                <label className={labelClass}>Organizer Phone</label>
                <input
                  type="tel"
                  value={form.organizer_phone}
                  onChange={(e) => updateForm('organizer_phone', e.target.value)}
                  className={inputClass}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <HiOutlineMapPin className="w-6 h-6 text-slate-300" /> Location.
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={labelClass}>Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => updateForm('address', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 100 Main Street"
                />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => updateForm('city', e.target.value)}
                  className={inputClass}
                  placeholder="City"
                />
              </div>
              <div>
                <label className={labelClass}>State / Region</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => updateForm('state', e.target.value)}
                  className={inputClass}
                  placeholder="State"
                />
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => updateForm('country', e.target.value)}
                  className={inputClass}
                  placeholder="Country"
                />
              </div>
              <div>
                <label className={labelClass}>Zip Code</label>
                <input
                  type="text"
                  value={form.zip_code}
                  onChange={(e) => updateForm('zip_code', e.target.value)}
                  className={inputClass}
                  placeholder="Zip Code"
                />
              </div>
              <div className="md:col-span-2 grid grid-cols-2 gap-6 pt-4 border-t border-slate-100/50">
                <div>
                  <label className={labelClass}>Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(e) => updateForm('latitude', e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 37.7749"
                  />
                </div>
                <div>
                  <label className={labelClass}>Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) => updateForm('longitude', e.target.value)}
                    className={inputClass}
                    placeholder="e.g. -122.4194"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Pricing Tiers setup */}
          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-green-500 rounded-full" /> Ticket Pricing Tiers.
            </h3>
            <div className="space-y-6">
              {ticketsList.map((ticket, index) => (
                <div key={ticket.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end p-6 bg-slate-50 rounded-3xl border border-slate-100/50 relative">
                  <div className="md:col-span-6">
                    <label className={labelClass}>Ticket Name / Tier</label>
                    <input
                      type="text"
                      value={ticket.title}
                      onChange={(e) => updateTicketField(ticket.id, 'title', e.target.value)}
                      className="w-full bg-white border-2 border-transparent focus:border-[#6610f2] rounded-2xl px-6 py-4 text-slate-900 font-bold transition-all outline-none placeholder:text-slate-300 text-sm"
                      placeholder="e.g. VIP Access, General Admission"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className={labelClass}>Base Price (USD)</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                      <input
                        type="number"
                        value={ticket.base_price}
                        onChange={(e) => updateTicketField(ticket.id, 'base_price', e.target.value)}
                        className="w-full bg-white border-2 border-transparent focus:border-[#6610f2] rounded-2xl pl-10 pr-6 py-4 text-slate-900 font-bold transition-all outline-none placeholder:text-slate-300 text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 flex justify-end md:pb-1">
                    <button
                      type="button"
                      disabled={ticketsList.length === 1}
                      onClick={() => removeTicketType(ticket.id)}
                      className="bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-30 px-5 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all w-full text-center"
                      title="Remove ticket tier"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addTicketType}
                className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest px-8 py-4.5 rounded-2xl hover:bg-slate-800 transition-colors"
              >
                + Add Pricing Tier
              </button>
            </div>
          </div>

          {/* Scheduled Occurrences & Inventory allocation block */}
          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-purple-500 rounded-full" /> Scheduled Occurrences.
            </h3>
            <div className="space-y-8">
              {occurrencesList.map((occ, occIdx) => (
                <div key={occ.id} className="p-8 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] space-y-6 relative">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <h4 className="text-xs font-black text-[#6610f2] uppercase tracking-widest italic">
                      // Occurrence Slot #{occIdx + 1}
                    </h4>
                    <button
                      type="button"
                      disabled={occurrencesList.length === 1}
                      onClick={() => removeOccurrenceSlot(occ.id)}
                      className="text-red-500 hover:text-red-700 text-[10px] font-black uppercase tracking-widest disabled:opacity-30"
                    >
                      Remove Slot
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Date</label>
                      <input
                        type="date"
                        value={occ.date}
                        onChange={(e) => updateOccurrenceField(occ.id, 'date', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Start Time</label>
                      <input
                        type="time"
                        value={occ.time}
                        onChange={(e) => updateOccurrenceField(occ.id, 'time', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Duration (Hours)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={occ.duration_hours}
                        onChange={(e) => updateOccurrenceField(occ.id, 'duration_hours', e.target.value)}
                        className={inputClass}
                        placeholder="3"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Slot Total Capacity</label>
                      <input
                        type="number"
                        value={occ.max_attendees}
                        onChange={(e) => updateOccurrenceField(occ.id, 'max_attendees', e.target.value)}
                        className={inputClass}
                        placeholder="e.g. 500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Room / Stage venue details</label>
                      <input
                        type="text"
                        value={occ.venue_details}
                        onChange={(e) => updateOccurrenceField(occ.id, 'venue_details', e.target.value)}
                        className={inputClass}
                        placeholder="e.g. Hall A, Main Auditorium"
                      />
                    </div>
                  </div>

                  {/* Nested Inventory Mapping */}
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100/80 space-y-4">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-2">
                      Ticket Inventory & Availability Allocations
                    </h5>
                    <div className="space-y-4">
                      {ticketsList.map((ticket) => {
                        const inv = occ.inventory[ticket.id] || { available_quantity: '', override_price: '0' };
                        return (
                          <div key={ticket.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-5 bg-slate-50 rounded-2xl border border-slate-100/50">
                            <div className="md:col-span-4">
                              <span className="text-xs font-black text-slate-800 italic block">{ticket.title || 'Untitled Ticket Tier'}</span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Base: ${parseFloat(ticket.base_price) || 0}</span>
                            </div>
                            <div className="md:col-span-4">
                              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Available Qty</label>
                              <input
                                type="number"
                                value={inv.available_quantity}
                                onChange={(e) => updateInventoryField(occ.id, ticket.id, 'available_quantity', e.target.value)}
                                className="w-full bg-white border-2 border-transparent focus:border-[#6610f2] rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
                                placeholder="Quantity"
                              />
                            </div>
                            <div className="md:col-span-4">
                              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Override Price ($)</label>
                              <input
                                type="number"
                                value={inv.override_price}
                                onChange={(e) => updateInventoryField(occ.id, ticket.id, 'override_price', e.target.value)}
                                className="w-full bg-white border-2 border-transparent focus:border-[#6610f2] rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
                                placeholder="0 for default"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addOccurrenceSlot}
                className="bg-[#6610f2] text-white font-black text-[10px] uppercase tracking-widest px-8 py-4.5 rounded-2xl hover:bg-[#520dc2] transition-colors"
              >
                + Add Scheduled Slot
              </button>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Media Studio.
            </h3>
            <MediaStudio files={files} setFiles={setFiles} />
          </div>

          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8">Event Narrative.</h3>
            <textarea
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              rows={6}
              className={`${inputClass} resize-none mb-8`}
              placeholder="What makes this experience unique? Describe the agenda, speakers, or highlights..."
            />

            {/* Discoverability Tags manager */}
            <div className="space-y-4 pt-8 border-t border-slate-100">
              <label className={labelClass}>Discoverability Keywords / Tags</label>
              <div className="flex flex-wrap gap-2.5 p-5 bg-slate-50 border-2 border-slate-100/50 rounded-[2rem] min-h-[72px] items-center">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 bg-[#6610f2]/5 text-[#6610f2] text-xs font-bold pl-4 pr-3 py-2 rounded-xl border border-[#6610f2]/10"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setTags((prev) => prev.filter((_, idx) => idx !== i))}
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black hover:bg-[#6610f2] hover:text-white transition-colors text-[#6610f2]/60"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={tags.length === 0 ? "Type a tag (e.g. Tech, Music) and press Enter..." : "Add tag..."}
                  className="flex-1 bg-transparent border-none outline-none text-xs font-bold px-2 py-1 placeholder:text-slate-300 text-slate-800"
                />
              </div>
            </div>
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
