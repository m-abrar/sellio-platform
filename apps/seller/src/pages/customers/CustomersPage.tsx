import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { HiOutlineUser, HiOutlineEnvelope, HiOutlineChevronRight } from 'react-icons/hi2';
import { toast } from 'sonner';
import { getCustomers } from '../../api/customers';
import { getApiErrorMessage } from '../../lib/apiErrorMessage';

export default function CustomersPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoadError(null);
        const response = await getCustomers();
        setCustomers(response.data.data);
      } catch (error) {
        const message = getApiErrorMessage(error, 'Failed to load customer directory.');
        setLoadError(message);
        toast.error(message);
        console.error('Failed to fetch customers', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const renderMobileRow = (customer: any) => {
    const avatar = customer.avatar_url ? (
      <img src={customer.avatar_url} className="w-11 h-11 rounded-2xl object-cover border border-slate-100 shadow-xs shrink-0" alt="avatar" />
    ) : (
      <div className="w-11 h-11 rounded-2xl bg-brand/5 flex items-center justify-center text-brand font-black text-base group-hover:bg-brand group-hover:text-white transition-all shrink-0">
        {customer.name.charAt(0)}
      </div>
    );
    return (
      <button
        key={customer.id}
        type="button"
        onClick={() => navigate(`/dashboard/customers/${customer.id}`)}
        className="group w-full text-left flex items-center gap-4 px-5 py-4 hover:bg-slate-50/40 transition-colors"
      >
        {avatar}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold tracking-tight text-slate-900 group-hover:text-brand transition-colors truncate">{customer.name}</p>
          <p className="text-label font-bold text-slate-400 uppercase tracking-widest truncate">{customer.email}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-black text-slate-900">{customer.total_spent}</p>
          <span className={`text-tiny font-black uppercase tracking-widest ${customer.status === 'Active' ? 'text-green-500' : 'text-slate-400'}`}>{customer.total_orders} orders</span>
        </div>
        <HiOutlineChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand shrink-0" />
      </button>
    );
  };

  const renderTableRow = (customer: any) => {
    const avatar = customer.avatar_url ? (
      <img src={customer.avatar_url} className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-xs shrink-0" alt="avatar" />
    ) : (
      <div className="w-14 h-14 rounded-2xl text-xl bg-brand/5 flex items-center justify-center text-brand font-black group-hover:bg-brand group-hover:text-white transition-all shrink-0">
        {customer.name.charAt(0)}
      </div>
    );
    return (
      <tr key={customer.id} className="group cursor-pointer hover:bg-slate-50/40 transition-colors duration-150" onClick={() => navigate(`/dashboard/customers/${customer.id}`)}>
        <td className="px-8 py-5">
          <div className="flex items-center gap-6">
            {avatar}
            <div className="min-w-0">
              <p className="text-lg font-black tracking-tighter text-slate-900 italic group-hover:text-brand transition-colors">{customer.name}</p>
              <span className="flex items-center gap-1 text-label font-bold text-slate-400 uppercase tracking-widest mt-1">
                <HiOutlineEnvelope className="w-3 h-3" /> {customer.email}
              </span>
            </div>
          </div>
        </td>
        <td className="px-8 py-5">
          <p className="text-lg font-black text-slate-900 tracking-tighter">{customer.total_spent}</p>
          <p className="text-micro font-black text-slate-400 uppercase tracking-widest mt-1">{customer.total_orders} Orders</p>
        </td>
        <td className="px-8 py-5">
          <span className={`text-label font-black uppercase tracking-widest px-3 py-1 rounded-full ${customer.status === 'Active' ? 'bg-green-50 text-green-500 border border-green-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
            {customer.status}
          </span>
        </td>
        <td className="px-8 py-5 text-right relative">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:opacity-0 transition-opacity">{customer.joined}</span>
          <div className="absolute inset-y-0 right-8 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-label font-black text-brand uppercase tracking-widest flex items-center gap-2">
              View Profile <HiOutlineChevronRight className="w-4 h-4" />
            </span>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader badge="Customers" title="Your" subtitle="Customers" />

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <span className="text-label font-black uppercase tracking-caps-xl text-slate-300 animate-pulse">Syncing Directory...</span>
        </div>
      ) : loadError ? (
        <div className="rounded-card-lg border border-red-100 bg-red-50 px-8 py-10 text-center">
          <p className="text-sm font-bold text-red-600">{loadError}</p>
          <p className="text-xs text-red-500 mt-2">Check Partner Panel API URL in public/config.js and your Laravel CORS settings.</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="rounded-container border border-dashed border-slate-200 bg-white px-8 py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
            <HiOutlineUser className="h-7 w-7" />
          </div>
          <p className="text-lg font-black text-slate-900 tracking-tight">No customers yet</p>
          <p className="mt-2 text-sm text-slate-400 font-medium max-w-md mx-auto">
            Customers appear here after bookings, inquiries, quotes, or product orders on your listings.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile — all rows grouped inside one card */}
          <div className="lg:hidden bg-white rounded-card border border-slate-100 overflow-hidden shadow-card divide-y divide-slate-50">
            {customers.map((customer) => renderMobileRow(customer))}
          </div>

          {/* Desktop — all rows grouped inside one card */}
          <div className="hidden lg:block bg-white rounded-card border border-slate-100 overflow-hidden shadow-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-8 py-4 text-left text-caption font-black uppercase tracking-caps-wide text-slate-400">Customer Identity</th>
                  <th className="px-8 py-4 text-left text-caption font-black uppercase tracking-caps-wide text-slate-400">Engagement</th>
                  <th className="px-8 py-4 text-left text-caption font-black uppercase tracking-caps-wide text-slate-400">Status</th>
                  <th className="px-8 py-4 text-right text-caption font-black uppercase tracking-caps-wide text-slate-400">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {customers.map((customer) => renderTableRow(customer))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
