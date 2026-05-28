import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { 
  HiOutlineWallet, 
  HiOutlineArrowUpRight, 
  HiOutlineArrowDownLeft, 
  HiOutlineCreditCard, 
  HiOutlineBanknotes,
  HiOutlineArrowPath,
  HiOutlineChevronRight,
  HiOutlineXMark
} from 'react-icons/hi2';
import { getTransactions } from '../../api/transactions';
import { getWallet, withdrawFunds } from '../../api/wallet';
import { toast } from 'sonner';

export default function WalletPage() {
  const navigate = useNavigate();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [txResponse, walletResponse] = await Promise.all([
        getTransactions(),
        getWallet()
      ]);
      setTransactions(txResponse.data.data);
      setWallet(walletResponse.data);
    } catch (error) {
      console.error("Failed to fetch wallet data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (wallet && amount > wallet.balance) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      await withdrawFunds(amount);
      toast.success(`Withdrawal of $${amount.toFixed(2)} initiated!`);
      setIsWithdrawModalOpen(false);
      setWithdrawAmount('');
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Withdrawal failed. Please try again.');
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader badge="Financials" title="Studio" subtitle="Wallet" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* BALANCE CARD */}
        <div className="lg:col-span-7 bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[400px]">
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-4">Total Balance</p>
                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black italic tracking-tighter shrink-0">
                  ${wallet?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </h2>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/10">
                <HiOutlineWallet className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="relative z-10 flex gap-4">
            <button 
              onClick={() => setIsWithdrawModalOpen(true)}
              className="flex-1 bg-[#6610f2] hover:bg-[#7b2dfd] py-6 rounded-[1.8rem] font-black text-[12px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-purple-900/40"
            >
              <HiOutlineArrowUpRight className="w-5 h-5" /> Withdraw
            </button>
            <button className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-xl py-6 rounded-[1.8rem] font-black text-[12px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border border-white/10">
              <HiOutlineArrowDownLeft className="w-5 h-5" /> Add Funds
            </button>
          </div>

          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#6610f2]/20 rounded-full blur-[120px]" />
        </div>

        {/* LINKED ACCOUNTS & STATS */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-premium">
            <h3 className="text-xl font-black text-slate-900 italic tracking-tight mb-8">Linked Accounts.</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-100">
                  <HiOutlineCreditCard className="w-6 h-6 text-[#6610f2]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-900">Chase Bank **** 4290</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Payout Method</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-8 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-[#6610f2] hover:text-[#6610f2] transition-all">
              + Add New Account
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-emerald-50 p-6 sm:p-8 rounded-[2rem] border border-emerald-100 flex flex-col justify-between">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Lifetime Revenue</p>
              <h4 className="text-lg sm:text-2xl font-black text-emerald-900 tracking-tight">
                +${wallet?.lifetimeEarnings?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </h4>
            </div>
            <div className="bg-indigo-50 p-6 sm:p-8 rounded-[2rem] border border-indigo-100 flex flex-col justify-between">
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Completed Payouts</p>
              <h4 className="text-lg sm:text-2xl font-black text-indigo-900 tracking-tight">
                -${wallet?.approvedPayouts?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </h4>
            </div>
            <div className="bg-amber-50 p-6 sm:p-8 rounded-[2rem] border border-amber-100 flex flex-col justify-between">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Pending Withdrawals</p>
              <h4 className="text-lg sm:text-2xl font-black text-amber-900 tracking-tight">
                ${wallet?.pendingPayouts?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </h4>
            </div>
            <div className="bg-rose-50 p-6 sm:p-8 rounded-[2rem] border border-rose-100 flex flex-col justify-between">
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2">Rejected Attempts</p>
              <h4 className="text-lg sm:text-2xl font-black text-rose-900 tracking-tight">
                ${wallet?.rejectedPayouts?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* TRANSACTION HISTORY */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-premium overflow-hidden">
        <div className="p-10 md:p-12 flex justify-between items-center border-b border-slate-50">
          <div>
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">Transaction History.</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Recent financial activity</p>
          </div>
          <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-[#6610f2] transition-all">
            <HiOutlineArrowPath className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-10 py-24 text-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Syncing Transactions...</span>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          tx.type === 'earning' ? 'bg-emerald-50 text-emerald-600' : 
                          tx.type === 'payout' ? 'bg-indigo-50 text-indigo-600' : 
                          'bg-red-50 text-red-600'
                        }`}>
                          {tx.type === 'earning' ? <HiOutlineArrowDownLeft className="w-6 h-6" /> : <HiOutlineArrowUpRight className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{tx.title}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tx.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-xs font-bold text-slate-500 uppercase tracking-widest">{tx.date}</td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        tx.status === 'Completed' || tx.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        tx.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                        'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className={`px-10 py-8 text-right font-black tracking-tight ${
                      tx.status === 'Rejected' ? 'text-slate-400 line-through' :
                      tx.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-900'
                    }`}>
                      {tx.amount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-10 text-center border-t border-slate-50">
          <button 
            onClick={() => navigate('/dashboard/payouts')}
            className="text-[11px] font-black text-[#6610f2] uppercase tracking-[0.3em] hover:underline"
          >
            View All Payouts
          </button>
        </div>
      </div>

      {/* WITHDRAWAL MODAL */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsWithdrawModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">Withdraw Funds.</h3>
              <button onClick={() => setIsWithdrawModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-all">
                <HiOutlineXMark className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            
            <form onSubmit={handleWithdraw} className="p-10 space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Select Payout Method</label>
                <div className="p-6 border-2 border-[#6610f2] rounded-2xl bg-purple-50 flex items-center gap-4">
                  <HiOutlineCreditCard className="w-8 h-8 text-[#6610f2]" />
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-900">Chase Bank **** 4290</p>
                    <p className="text-[10px] font-bold text-[#6610f2] uppercase tracking-widest">Primary Account</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Amount to Withdraw</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300">$</span>
                  <input 
                    type="number" 
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 border-none rounded-2xl py-6 pl-12 pr-6 text-2xl font-black text-slate-900 focus:ring-2 focus:ring-[#6610f2] transition-all"
                    required
                  />
                </div>
                <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Available: ${wallet?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </p>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#6610f2] text-white py-6 rounded-[1.8rem] font-black text-[12px] uppercase tracking-[0.2em] hover:bg-[#7b2dfd] shadow-xl shadow-purple-900/20 transition-all"
              >
                Confirm Withdrawal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
