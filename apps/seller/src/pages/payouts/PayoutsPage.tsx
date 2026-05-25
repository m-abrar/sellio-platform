import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import { HiOutlineArrowUpRight, HiOutlineClock, HiOutlineCheckCircle } from 'react-icons/hi2';
import { mockPayouts } from '../../api/mockData';

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPayouts(mockPayouts);
      setIsLoading(false);
    }, 800);
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader badge="Financials" title="Payout" subtitle="History" />
      
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Syncing Transactions...</span>
        </div>
      ) : (
        <div className="hidden lg:block">
          <table className="w-full border-separate border-spacing-y-4">
            <thead>
              <tr className="text-left text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                <th className="px-10 pb-2">Transaction</th>
                <th className="px-10 pb-2">Method</th>
                <th className="px-10 pb-2">Status</th>
                <th className="px-10 pb-2 text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout) => (
                <tr key={payout.id} className="group">
                  <td className="bg-white group-hover:bg-slate-50/50 border-y border-l border-slate-100 group-hover:border-[#6610f2]/20 rounded-l-[2rem] px-10 py-6 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
                        <HiOutlineArrowUpRight className="w-5 h-5" />
                      </div>
                      <span className="text-xl font-black text-slate-900 tracking-tighter">{payout.amount}</span>
                    </div>
                  </td>
                  <td className="bg-white group-hover:bg-slate-50/50 border-y border-slate-100 group-hover:border-[#6610f2]/20 px-10 py-6 transition-all duration-300">
                    <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{payout.method}</span>
                  </td>
                  <td className="bg-white group-hover:bg-slate-50/50 border-y border-slate-100 group-hover:border-[#6610f2]/20 px-10 py-6 transition-all duration-300">
                    <div className="flex items-center gap-2">
                      {payout.status === 'Completed' ? (
                        <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <HiOutlineClock className="w-5 h-5 text-amber-500" />
                      )}
                      <span className={`text-[10px] font-black uppercase tracking-widest ${payout.status === 'Completed' ? 'text-green-500' : 'text-amber-500'}`}>
                        {payout.status}
                      </span>
                    </div>
                  </td>
                  <td className="bg-white group-hover:bg-slate-50/50 border-y border-r border-slate-100 group-hover:border-[#6610f2]/20 rounded-r-[2rem] px-10 py-6 text-right transition-all duration-300">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{payout.date}</span>
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
