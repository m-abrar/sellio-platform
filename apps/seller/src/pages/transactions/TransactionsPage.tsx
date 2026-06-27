import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { 
  HiOutlineArrowDownLeft, 
  HiOutlineArrowUpRight, 
  HiOutlineArrowPath, 
  HiOutlineCheckCircle, 
  HiOutlineClock, 
  HiOutlineXCircle,
  HiOutlineMagnifyingGlass
} from 'react-icons/hi2';
import { getTransactions } from '../../api/transactions';

export default function TransactionsPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'earning' | 'payout' | 'refund'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await getTransactions();
      setTransactions(response.data.data);
      setFilteredTransactions(response.data.data);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    let result = transactions;

    // Apply Type Filter
    if (activeFilter !== 'all') {
      result = result.filter(tx => tx.type === activeFilter);
    }

    // Apply Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        tx => 
          tx.title.toLowerCase().includes(query) || 
          tx.status.toLowerCase().includes(query) ||
          tx.amount.toLowerCase().includes(query)
      );
    }

    setFilteredTransactions(result);
  }, [activeFilter, searchQuery, transactions]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader badge="Payments" title="Transactions" subtitle="History" />

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between bg-white p-6 rounded-container border border-slate-100 shadow-premium">
        {/* Pills */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'earning', 'payout', 'refund'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-3 rounded-full text-label font-black uppercase tracking-wider transition-all border ${
                activeFilter === filter
                  ? 'bg-brand text-white border-brand shadow-lg shadow-purple-900/10'
                  : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100 hover:text-slate-600'
              }`}
            >
              {filter === 'all' ? 'All Transactions' : `${filter}s`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative md:w-80">
          <HiOutlineMagnifyingGlass className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions..."
            className="w-full bg-slate-50 border-none rounded-full py-4 pl-12 pr-6 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-brand transition-all"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center bg-white rounded-floating border border-slate-100 shadow-premium">
          <span className="text-label font-black uppercase tracking-caps-xl text-slate-300 animate-pulse">Syncing Ledger...</span>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="h-64 flex flex-col gap-4 items-center justify-center bg-white rounded-floating border border-slate-100 shadow-premium p-12 text-center">
          <span className="text-label font-black uppercase tracking-caps-xl text-slate-400">Zero Ledger Entries Found</span>
          <p className="text-xs font-medium text-slate-400 max-w-sm">No transaction records match your filters or query criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-floating border border-slate-100 shadow-premium overflow-hidden">
          {/* Mobile rows */}
          <div className="sm:hidden divide-y divide-slate-50">
            {filteredTransactions.map((tx) => {
              const iconColor = tx.type === 'earning' ? 'bg-emerald-50 text-emerald-600' : tx.type === 'payout' ? 'bg-indigo-50 text-indigo-600' : tx.type === 'refund' ? 'bg-purple-50 text-purple-600' : 'bg-slate-50 text-slate-600';
              const amountColor = tx.status === 'Rejected' ? 'text-slate-400 line-through' : tx.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-900';
              const statusColor = tx.status === 'Completed' || tx.status === 'Approved' ? 'text-emerald-500' : tx.status === 'Rejected' ? 'text-rose-500' : 'text-amber-500';
              return (
                <div
                  key={tx.id}
                  onClick={() => tx.url && navigate(tx.url)}
                  className={`flex items-center gap-4 px-5 py-4 transition-colors ${tx.url ? 'cursor-pointer hover:bg-slate-50/40' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}>
                    {tx.type === 'earning' || tx.type === 'refund' ? <HiOutlineArrowDownLeft className="w-5 h-5" /> : <HiOutlineArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-slate-900 truncate">{tx.title}</p>
                    <span className="text-label font-bold text-slate-400 uppercase tracking-widest">{tx.date}</span>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`text-sm font-black ${amountColor}`}>{tx.amount}</p>
                    <span className={`text-tiny font-black uppercase tracking-widest ${statusColor}`}>{tx.status}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-10 py-6 text-label font-black text-slate-400 uppercase tracking-widest">Transaction</th>
                  <th className="px-10 py-6 text-label font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-10 py-6 text-label font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-10 py-6 text-label font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => tx.url && navigate(tx.url)}
                    className={`group transition-all ${tx.url ? 'cursor-pointer hover:bg-slate-50/50' : 'cursor-default'}`}
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          tx.type === 'earning' ? 'bg-emerald-50 text-emerald-600' :
                          tx.type === 'payout' ? 'bg-indigo-50 text-indigo-600' :
                          tx.type === 'refund' ? 'bg-purple-50 text-purple-600' :
                          'bg-slate-50 text-slate-600'
                        }`}>
                          {tx.type === 'earning' || tx.type === 'refund' ? <HiOutlineArrowDownLeft className="w-6 h-6" /> : <HiOutlineArrowUpRight className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{tx.title}</p>
                          <p className="text-label font-bold text-slate-400 uppercase tracking-widest">{tx.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-xs font-bold text-slate-500 uppercase tracking-widest">{tx.date}</td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2">
                        {tx.status === 'Completed' || tx.status === 'Approved' ? <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500" /> : tx.status === 'Rejected' ? <HiOutlineXCircle className="w-5 h-5 text-rose-500" /> : <HiOutlineClock className="w-5 h-5 text-amber-500" />}
                        <span className={`text-micro font-black uppercase tracking-widest ${
                          tx.status === 'Completed' || tx.status === 'Approved' ? 'text-emerald-600' :
                          tx.status === 'Rejected' ? 'text-rose-600' : 'text-amber-600'
                        }`}>{tx.status}</span>
                      </div>
                    </td>
                    <td className={`px-10 py-8 text-right font-black tracking-tight ${
                      tx.status === 'Rejected' ? 'text-slate-400 line-through' :
                      tx.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-900'
                    }`}>{tx.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
