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

  const renderCustomerRow = (customer: any, variant: 'card' | 'table') => {
    const avatar = customer.avatar_url ? (
      <img
        src={customer.avatar_url}
        className={`${variant === 'card' ? 'w-12 h-12' : 'w-14 h-14'} rounded-2xl object-cover border border-slate-100 shadow-xs shrink-0`}
        alt="avatar"
      />
    ) : (
      <div className={`${variant === 'card' ? 'w-12 h-12 text-lg' : 'w-14 h-14 text-xl'} rounded-2xl bg-brand/5 flex items-center justify-center text-brand font-black group-hover:bg-brand group-hover:text-white transition-all shrink-0`}>
        {customer.name.charAt(0)}
      </div>
    );

    if (variant === 'card') {
      return (
        <button
          key={customer.id}
          type="button"
          onClick={() => navigate(`/dashboard/customers/${customer.id}`)}
          className="group w-full text-left bg-white border border-slate-100 rounded-card-lg p-6 hover:border-brand/20 hover:shadow-premium transition-all"
        >
          <div className="flex items-center gap-4">
            {avatar}
            <div className="flex-1 min-w-0">
              <p className="text-base font-black tracking-tight text-slate-900 group-hover:text-brand transition-colors truncate">{customer.name}</p>
              <p className="text-label font-bold text-slate-400 uppercase tracking-widest truncate mt-1">{customer.email}</p>
            </div>
            <HiOutlineChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand" />
          </div>
          <div className="mt-4 flex items-center justify-between text-label font-black uppercase tracking-widest">
            <span className="text-slate-500">{customer.total_orders} orders · {customer.total_spent}</span>
            <span className={`px-3 py-1 rounded-full ${customer.status === 'Active' ? 'bg-green-50 text-green-500 border border-green-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
              {customer.status}
            </span>
          </div>
        </button>
      );
    }

    return (
      <tr
        key={customer.id}
        className="group cursor-pointer"
        onClick={() => navigate(`/dashboard/customers/${customer.id}`)}
      >
        <td className="bg-white group-hover:bg-slate-50/50 border-y border-l border-slate-100 group-hover:border-brand/20 rounded-l-[2rem] px-10 py-6 transition-all duration-300">
          <div className="flex items-center gap-6">
            {avatar}
            <div className="min-w-0">
              <p className="text-lg font-black tracking-tighter text-slate-900 italic group-hover:text-brand transition-colors">{customer.name}</p>
              <div className="flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1 text-label font-bold text-slate-400 uppercase tracking-widest">
                  <HiOutlineEnvelope className="w-3 h-3" /> {customer.email}
                </span>
              </div>
            </div>
          </div>
        </td>
        <td className="bg-white group-hover:bg-slate-50/50 border-y border-slate-100 group-hover:border-brand/20 px-10 py-6 transition-all duration-300">
          <p className="text-lg font-black text-slate-900 tracking-tighter">{customer.total_spent}</p>
          <p className="text-micro font-black text-slate-400 uppercase tracking-widest mt-1">{customer.total_orders} Orders</p>
        </td>
        <td className="bg-white group-hover:bg-slate-50/50 border-y border-slate-100 group-hover:border-brand/20 px-10 py-6 transition-all duration-300">
          <span className={`text-label font-black uppercase tracking-widest px-3 py-1 rounded-full ${customer.status === 'Active' ? 'bg-green-50 text-green-500 border border-green-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
            {customer.status}
          </span>
        </td>
        <td className="bg-white group-hover:bg-slate-50/50 border-y border-r border-slate-100 group-hover:border-brand/20 rounded-r-[2rem] px-10 py-6 text-right transition-all duration-300 relative">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:opacity-0 transition-opacity">{customer.joined}</span>
          <div className="absolute inset-y-0 right-10 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
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
          <div className="grid gap-4 lg:hidden">
            {customers.map((customer) => renderCustomerRow(customer, 'card'))}
          </div>

          <div className="hidden lg:block">
            <table className="w-full border-separate border-spacing-y-4">
              <thead>
                <tr className="text-left text-caption font-black uppercase tracking-caps-wide text-slate-400">
                  <th className="px-10 pb-2">Customer Identity</th>
                  <th className="px-10 pb-2">Engagement</th>
                  <th className="px-10 pb-2">Status</th>
                  <th className="px-10 pb-2 text-right">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => renderCustomerRow(customer, 'table'))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
