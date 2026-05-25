import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import { HiOutlineCheck, HiOutlineSparkles } from 'react-icons/hi2';
import { mockMemberships } from '../../api/mockData';

export default function MembershipsPage() {
  const [memberships, setMemberships] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setMemberships(mockMemberships);
      setIsLoading(false);
    }, 800);
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader badge="Subscription" title="Partner" subtitle="Memberships" />
      
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Syncing Plans...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {memberships.map((plan) => (
            <div 
              key={plan.id} 
              className={`p-12 rounded-[3rem] border-2 transition-all duration-500 relative overflow-hidden flex flex-col justify-between ${plan.status === 'Current' ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-white border-slate-100 text-slate-900 shadow-premium hover:border-[#6610f2]/20'}`}
            >
              <div>
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="text-3xl font-black italic tracking-tight mb-2">{plan.name}</h3>
                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${plan.status === 'Current' ? 'text-slate-500' : 'text-slate-400'}`}>Tier Level</p>
                  </div>
                  {plan.status === 'Current' && (
                    <span className="bg-[#6610f2] text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <HiOutlineSparkles className="w-4 h-4" /> Current Plan
                    </span>
                  )}
                </div>

                <div className="mb-12">
                  <h4 className="text-6xl font-black italic tracking-tighter mb-8">{plan.price}<span className="text-xl opacity-40">/mo</span></h4>
                  <div className="space-y-4">
                    {plan.features.map((feature: string, i: number) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${plan.status === 'Current' ? 'bg-[#6610f2] text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <HiOutlineCheck className="w-4 h-4" />
                        </div>
                        <span className={`text-sm font-bold ${plan.status === 'Current' ? 'text-slate-300' : 'text-slate-600'}`}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                disabled={plan.status === 'Current'}
                className={`w-full py-6 rounded-[1.8rem] font-black text-[12px] uppercase tracking-[0.2em] transition-all ${plan.status === 'Current' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-[#6610f2] text-white hover:bg-[#7b2dfd] shadow-lg shadow-purple-200'}`}
              >
                {plan.status === 'Current' ? 'Active Subscription' : 'Upgrade to ' + plan.name}
              </button>

              {plan.status === 'Current' && (
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#6610f2]/10 rounded-full blur-[100px]" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
