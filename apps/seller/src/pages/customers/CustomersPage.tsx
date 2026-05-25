import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { HiOutlineUser, HiOutlineEnvelope, HiOutlinePhone, HiOutlineCalendar, HiOutlineChevronRight } from 'react-icons/hi2';
import { getCustomers } from '../../api/customers';

export default function CustomersPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getCustomers();
        setCustomers(response.data.data);
      } catch (error) {
        console.error("Failed to fetch customers", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader badge="CRM" title="Customer" subtitle="Directory" />
      
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Syncing Directory...</span>
        </div>
      ) : (
        <div className="hidden lg:block">
          <table className="w-full border-separate border-spacing-y-4">
            <thead>
              <tr className="text-left text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                <th className="px-10 pb-2">Customer Identity</th>
                <th className="px-10 pb-2">Engagement</th>
                <th className="px-10 pb-2">Status</th>
                <th className="px-10 pb-2 text-right">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr 
                  key={customer.id} 
                  className="group cursor-pointer"
                  onClick={() => navigate(`/dashboard/customers/${customer.id}`)}
                >
                  <td className="bg-white group-hover:bg-slate-50/50 border-y border-l border-slate-100 group-hover:border-[#6610f2]/20 rounded-l-[2rem] px-10 py-6 transition-all duration-300">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-[#6610f2]/5 flex items-center justify-center text-[#6610f2] font-black text-xl group-hover:bg-[#6610f2] group-hover:text-white transition-all">
                        {customer.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-lg font-black tracking-tighter text-slate-900 italic group-hover:text-[#6610f2] transition-colors">{customer.name}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <HiOutlineEnvelope className="w-3 h-3" /> {customer.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="bg-white group-hover:bg-slate-50/50 border-y border-slate-100 group-hover:border-[#6610f2]/20 px-10 py-6 transition-all duration-300">
                    <p className="text-lg font-black text-slate-900 tracking-tighter">{customer.total_spent}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{customer.total_orders} Orders</p>
                  </td>
                  <td className="bg-white group-hover:bg-slate-50/50 border-y border-slate-100 group-hover:border-[#6610f2]/20 px-10 py-6 transition-all duration-300">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${customer.status === 'Active' ? 'bg-green-50 text-green-500 border border-green-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="bg-white group-hover:bg-slate-50/50 border-y border-r border-slate-100 group-hover:border-[#6610f2]/20 rounded-r-[2rem] px-10 py-6 text-right transition-all duration-300 relative">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:opacity-0 transition-opacity">{customer.joined}</span>
                    <div className="absolute inset-y-0 right-10 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-black text-[#6610f2] uppercase tracking-widest flex items-center gap-2">
                        View Profile <HiOutlineChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
