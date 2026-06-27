import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { 
  HiOutlineUser, 
  HiOutlineEnvelope, 
  HiOutlinePhone, 
  HiOutlineCalendar,
  HiOutlineShoppingBag,
  HiOutlineArrowLeft,
  HiOutlineChatBubbleLeftRight,
  HiOutlineMapPin
} from 'react-icons/hi2';
import { getCustomerById } from '../../api/customers';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await getCustomerById(id);
        setCustomer(response?.data ?? null);
      } catch (error) {
        console.error('Failed to fetch customer', error);
        setCustomer(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-label font-black uppercase tracking-caps-xl text-slate-300 animate-pulse">Loading Profile...</span>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-6">
        <p className="text-label font-black uppercase tracking-caps-xl text-slate-300">Customer not found</p>
        <button onClick={() => navigate(-1)} className="text-brand font-black uppercase text-xs tracking-widest flex items-center gap-2">
          <HiOutlineArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate(-1)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-brand hover:border-brand/20 transition-all">
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-label font-black text-slate-400 uppercase tracking-caps-wide">Back to Directory</span>
      </div>

      <PageHeader 
        badge="Customer Profile" 
        title={customer.name} 
        subtitle={`Member since ${customer.joined}`}
      >
        <button className="bg-brand text-white px-8 py-4.5 rounded-card font-black text-caption uppercase tracking-caps shadow-xl hover:bg-brand-hover transition-all active:scale-95 flex items-center gap-2">
          <HiOutlineChatBubbleLeftRight className="w-4 h-4" /> Send Message
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT COLUMN: IDENTITY */}
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-white p-10 rounded-container border border-slate-100 shadow-premium flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-container bg-brand/5 flex items-center justify-center text-brand font-black text-5xl mb-6 border-4 border-white shadow-lg">
              {customer.name.charAt(0)}
            </div>
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">{customer.name}</h3>
            <span className={`mt-3 px-4 py-1.5 rounded-full text-label font-black uppercase tracking-widest ${customer.status === 'Active' ? 'bg-green-50 text-green-500 border border-green-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
              {customer.status} Status
            </span>

            <div className="w-full mt-10 space-y-4 pt-10 border-t border-slate-50">
              <div className="flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                  <HiOutlineEnvelope className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-micro font-black text-slate-300 uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-slate-600 truncate">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                  <HiOutlinePhone className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-micro font-black text-slate-300 uppercase tracking-widest">Phone Number</p>
                  <p className="text-sm font-bold text-slate-600 truncate">{customer.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                  <HiOutlineMapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-micro font-black text-slate-300 uppercase tracking-widest">Location</p>
                  <p className="text-sm font-bold text-slate-600 truncate">New York, USA</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STATS & HISTORY */}
        <div className="lg:col-span-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 p-10 rounded-container text-white shadow-2xl relative overflow-hidden">
              <p className="text-label font-black uppercase tracking-caps-wide text-slate-500 mb-2">Lifetime Value</p>
              <h4 className="text-4xl font-black italic tracking-tighter">{customer.total_spent}</h4>
              <div className="mt-8 flex items-center gap-2 text-label font-black text-green-400 uppercase tracking-widest">
                <HiOutlineShoppingBag className="w-4 h-4" /> {customer.total_orders} Total Orders
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand/20 rounded-full blur-[60px]" />
            </div>
            <div className="bg-white p-10 rounded-container border border-slate-100 shadow-premium">
              <p className="text-label font-black uppercase tracking-caps-wide text-slate-400 mb-2">Last Interaction</p>
              <h4 className="text-xl font-black text-slate-900 italic tracking-tight">Modern Mediterranean Villa</h4>
              <p className="text-label font-black text-brand uppercase tracking-widest mt-2 flex items-center gap-2">
                <HiOutlineCalendar className="w-4 h-4" /> 2 Days Ago
              </p>
            </div>
          </div>

          <div className="bg-white p-12 rounded-floating border border-slate-100 shadow-premium">
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tight mb-10">Order History.</h3>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                      <HiOutlineShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">Order #ORD-992{i}</p>
                      <p className="text-label font-bold text-slate-400 uppercase tracking-widest">Feb {10 + i}, 2026</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">$1,250.00</p>
                    <span className="text-micro font-black text-green-500 uppercase tracking-widest">Completed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
