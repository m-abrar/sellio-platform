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
import { 
  getWallet, 
  withdrawFunds, 
  getPayoutMethods, 
  createPayoutMethod, 
  deletePayoutMethod, 
  setPrimaryPayoutMethod, 
  depositFunds 
} from '../../api/wallet';
import { toast } from 'sonner';

export default function WalletPage() {
  const navigate = useNavigate();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic Payout Methods & deposits states
  const [payoutMethods, setPayoutMethods] = useState<any[]>([]);
  const [selectedPayoutMethodId, setSelectedPayoutMethodId] = useState<any>('');
  
  // Add Account Modal states
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [newAccountType, setNewAccountType] = useState('bank_transfer');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Add Funds Modal states
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [addFundsAmount, setAddFundsAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);

  const fetchData = async () => {
    try {
      const [txResponse, walletResponse, payoutResponse] = await Promise.all([
        getTransactions(),
        getWallet(),
        getPayoutMethods()
      ]);
      setTransactions(txResponse.data.data);
      setWallet(walletResponse.data);
      setPayoutMethods(payoutResponse.data);
      
      // Auto-select primary payout method for withdrawals
      const primaryMethod = payoutResponse.data.find((m: any) => m.is_primary);
      if (primaryMethod) {
        setSelectedPayoutMethodId(primaryMethod.id);
      } else if (payoutResponse.data.length > 0) {
        setSelectedPayoutMethodId(payoutResponse.data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch wallet data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const startTime = Date.now();
    try {
      await fetchData();
    } finally {
      const elapsed = Date.now() - startTime;
      const minSpinDuration = 600;
      if (elapsed < minSpinDuration) {
        await new Promise((resolve) => setTimeout(resolve, minSpinDuration - elapsed));
      }
      setIsRefreshing(false);
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

    if (amount < 10) {
      toast.error('Minimum withdrawal amount is $10.00');
      return;
    }

    if (!selectedPayoutMethodId) {
      toast.error('Please link and select a payout method');
      return;
    }

    if (wallet && amount > wallet.balance) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      await withdrawFunds(amount, selectedPayoutMethodId);
      toast.success(`Withdrawal of $${amount.toFixed(2)} initiated!`);
      setIsWithdrawModalOpen(false);
      setWithdrawAmount('');
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Withdrawal failed. Please try again.');
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAccount(true);

    try {
      let details: Record<string, any> = {};

      if (newAccountType === 'bank_transfer') {
        if (!bankName || !accountNumber || !routingNumber) {
          toast.error('Please fill in all bank details');
          setIsSavingAccount(false);
          return;
        }
        details = {
          bank_name: bankName,
          account_number: `**** ${accountNumber.slice(-4)}`,
          routing_number: routingNumber,
        };
      } else if (newAccountType === 'paypal') {
        if (!paypalEmail) {
          toast.error('Please enter your PayPal email');
          setIsSavingAccount(false);
          return;
        }
        details = {
          email: paypalEmail,
        };
      }

      await createPayoutMethod(newAccountType, details);
      toast.success('Payout method added successfully!');
      
      // Clear forms
      setBankName('');
      setAccountNumber('');
      setRoutingNumber('');
      setPaypalEmail('');
      setIsAddAccountModalOpen(false);
      
      fetchData();
    } catch (error) {
      toast.error('Failed to add payout method.');
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(addFundsAmount);

    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid deposit amount');
      return;
    }

    setIsDepositing(true);

    try {
      await depositFunds(amount);
      toast.success(`Successfully deposited $${amount.toFixed(2)} to your wallet!`);
      setAddFundsAmount('');
      setIsAddFundsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Deposit failed. Please try again.');
    } finally {
      setIsDepositing(false);
    }
  };

  // PREMIUM SKELETON LOADING STATE
  if (isLoading) {
    return (
      <div className="space-y-10 animate-in fade-in duration-700">
        <PageHeader badge="Financials" title="Studio" subtitle="Wallet" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* BALANCE CARD SKELETON */}
          <div className="lg:col-span-7 bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[400px]">
            <div className="space-y-6">
              <div className="h-4 bg-slate-800 rounded-full w-24 animate-pulse" />
              <div className="h-14 bg-slate-800 rounded-2xl w-48 animate-pulse delay-75" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1 h-16 bg-slate-800 rounded-[1.8rem] animate-pulse" />
              <div className="flex-1 h-16 bg-slate-800/50 rounded-[1.8rem] animate-pulse" />
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#6610f2]/10 rounded-full blur-[120px]" />
          </div>

          {/* LINKED ACCOUNTS & STATS SKELETON */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-premium">
              <div className="h-6 bg-slate-100 rounded-full w-36 mb-8 animate-pulse" />
              <div className="space-y-4">
                <div className="h-20 bg-slate-50 rounded-2xl border border-slate-100 animate-pulse delay-100" />
                <div className="h-20 bg-slate-50 rounded-2xl border border-slate-100 animate-pulse delay-200" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-50 p-6 sm:p-8 rounded-[2rem] border border-slate-100 h-28 flex flex-col justify-between animate-pulse">
                  <div className="h-3 bg-slate-200 rounded-full w-20" />
                  <div className="h-6 bg-slate-200 rounded-full w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TRANSACTION HISTORY SKELETON */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-premium overflow-hidden">
          <div className="p-10 md:p-12 flex justify-between items-center border-b border-slate-50">
            <div className="space-y-3">
              <div className="h-6 bg-slate-100 rounded-full w-48 animate-pulse" />
              <div className="h-3 bg-slate-100 rounded-full w-32 animate-pulse" />
            </div>
          </div>
          <div className="p-10 space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center py-4 border-b border-slate-50 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-100 rounded-full w-36" />
                    <div className="h-3 bg-slate-100 rounded-full w-20" />
                  </div>
                </div>
                <div className="h-4 bg-slate-100 rounded-full w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
      <PageHeader badge="Financials" title="Studio" subtitle="Wallet" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* BALANCE CARD */}
        <div className="lg:col-span-7 bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[400px] transition-all duration-500 hover:scale-[1.01] hover:shadow-purple-900/10">
          <div className="relative z-10 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-4">Total Balance</p>
                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black italic tracking-tighter shrink-0">
                  ${wallet?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </h2>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/10 shadow-lg">
                <HiOutlineWallet className="w-8 h-8 text-white animate-in zoom-in duration-700 delay-200" />
              </div>
            </div>
          </div>

          <div className="relative z-10 flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
            <button 
              onClick={() => setIsWithdrawModalOpen(true)}
              className="flex-1 bg-[#6610f2] hover:bg-[#7b2dfd] py-6 rounded-[1.8rem] font-black text-[12px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-purple-900/40 hover:translate-y-[-2px] active:translate-y-[0px]"
            >
              <HiOutlineArrowUpRight className="w-5 h-5" /> Withdraw
            </button>
            <button 
              onClick={() => setIsAddFundsModalOpen(true)}
              className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-xl py-6 rounded-[1.8rem] font-black text-[12px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 border border-white/10 hover:translate-y-[-2px] active:translate-y-[0px]"
            >
              <HiOutlineArrowDownLeft className="w-5 h-5" /> Add Funds
            </button>
          </div>

          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#6610f2]/20 rounded-full blur-[120px]" />
        </div>

        {/* LINKED ACCOUNTS & STATS */}
        <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-right-6 duration-1000 delay-100">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-premium transition-all duration-500 hover:shadow-premium-hover">
            <h3 className="text-xl font-black text-slate-900 italic tracking-tight mb-8">Linked Accounts.</h3>
            
            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
              {payoutMethods.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No linked accounts</p>
                </div>
              ) : (
                payoutMethods.map((method, index) => (
                  <div 
                    key={method.id} 
                    className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group relative transition-all duration-300 hover:bg-slate-100/50 hover:translate-x-1 animate-in fade-in slide-in-from-left-4 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-100">
                        {method.type === 'bank_transfer' ? (
                          <HiOutlineBanknotes className="w-6 h-6 text-[#6610f2]" />
                        ) : (
                          <HiOutlineCreditCard className="w-6 h-6 text-[#6610f2]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-black text-slate-900 truncate max-w-[180px]">
                          {method.type === 'bank_transfer' 
                            ? `${method.details?.bank_name || 'Bank Account'} ${method.details?.account_number || ''}`
                            : `PayPal (${method.details?.email || ''})`}
                        </p>
                        <div className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                          {method.is_primary ? (
                            <span className="text-[#6610f2] font-black">Primary Payout</span>
                          ) : (
                            <button 
                              onClick={async () => {
                                try {
                                  await setPrimaryPayoutMethod(method.id);
                                  toast.success('Primary payout method set!');
                                  fetchData();
                                } catch (err) {
                                  toast.error('Failed to set primary method.');
                                }
                              }}
                              className="text-slate-400 hover:text-[#6610f2] font-black transition-all cursor-pointer"
                            >
                              Make Primary
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {!method.is_primary && (
                      <button 
                        onClick={async () => {
                          if (confirm('Are you sure you want to remove this account?')) {
                            try {
                              await deletePayoutMethod(method.id);
                              toast.success('Payout method removed!');
                              fetchData();
                            } catch (err) {
                              toast.error('Failed to remove payout method.');
                            }
                          }
                        }}
                        className="p-2 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg border border-slate-100 transition-all opacity-0 group-hover:opacity-100 shadow-sm cursor-pointer"
                      >
                        <HiOutlineXMark className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
            
            <button 
              onClick={() => setIsAddAccountModalOpen(true)}
              className="w-full mt-8 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-[#6610f2] hover:text-[#6610f2] transition-all duration-300 hover:bg-[#6610f2]/5 cursor-pointer"
            >
              + Add New Account
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            <div className="bg-emerald-50 p-6 sm:p-8 rounded-[2rem] border border-emerald-100 flex flex-col justify-between transition-all duration-500 hover:shadow-md hover:scale-[1.02]">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Lifetime Revenue</p>
              <h4 className="text-lg sm:text-2xl font-black text-emerald-900 tracking-tight">
                +${wallet?.lifetimeEarnings?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </h4>
            </div>
            <div className="bg-indigo-50 p-6 sm:p-8 rounded-[2rem] border border-indigo-100 flex flex-col justify-between transition-all duration-500 hover:shadow-md hover:scale-[1.02]">
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Completed Payouts</p>
              <h4 className="text-lg sm:text-2xl font-black text-indigo-900 tracking-tight">
                -${wallet?.approvedPayouts?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </h4>
            </div>
            <div className="bg-amber-50 p-6 sm:p-8 rounded-[2rem] border border-amber-100 flex flex-col justify-between transition-all duration-500 hover:shadow-md hover:scale-[1.02]">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Pending Withdrawals</p>
              <h4 className="text-lg sm:text-2xl font-black text-amber-900 tracking-tight">
                ${wallet?.pendingPayouts?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </h4>
            </div>
            <div className="bg-rose-50 p-6 sm:p-8 rounded-[2rem] border border-rose-100 flex flex-col justify-between transition-all duration-500 hover:shadow-md hover:scale-[1.02]">
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2">Rejected Attempts</p>
              <h4 className="text-lg sm:text-2xl font-black text-rose-900 tracking-tight">
                ${wallet?.rejectedPayouts?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* TRANSACTION HISTORY */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-premium overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 transition-all duration-500 hover:shadow-premium-hover">
        <div className="p-10 md:p-12 flex justify-between items-center border-b border-slate-50">
          <div>
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">Transaction History.</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Recent financial activity</p>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-[#6610f2] transition-all hover:bg-slate-100 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <HiOutlineArrowPath className={`w-6 h-6 ${isRefreshing ? 'animate-spin text-[#6610f2]' : 'transition-transform duration-500 hover:rotate-180'}`} />
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
              {transactions.map((tx, index) => (
                <tr 
                  key={tx.id} 
                  className="group hover:bg-slate-50/50 transition-all duration-300 cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
                        tx.type === 'earning' ? 'bg-emerald-50 text-emerald-600' : 
                        tx.type === 'payout' ? 'bg-indigo-50 text-indigo-600' : 
                        'bg-red-50 text-red-600'
                      }`}>
                        {tx.type === 'earning' ? <HiOutlineArrowDownLeft className="w-6 h-6 animate-pulse" /> : <HiOutlineArrowUpRight className="w-6 h-6" />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{tx.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tx.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-xs font-bold text-slate-500 uppercase tracking-widest">{tx.date}</td>
                  <td className="px-10 py-8">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-300 ${
                      tx.status === 'Completed' || tx.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-100 group-hover:text-emerald-700' : 
                      tx.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-100 group-hover:text-rose-700' : 
                      'bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-100 group-hover:text-amber-700'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className={`px-10 py-8 text-right font-black tracking-tight transition-all duration-300 group-hover:translate-x-[-4px] ${
                    tx.status === 'Rejected' ? 'text-slate-400 line-through' :
                    tx.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-900'
                  }`}>
                    {tx.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-10 text-center border-t border-slate-50">
          <button 
            onClick={() => navigate('/dashboard/transactions')}
            className="text-[11px] font-black text-[#6610f2] uppercase tracking-[0.3em] hover:underline cursor-pointer"
          >
            View All Transactions
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
              <button onClick={() => setIsWithdrawModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-all cursor-pointer">
                <HiOutlineXMark className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            
            <form onSubmit={handleWithdraw} className="p-10 space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Select Payout Method</label>
                {payoutMethods.length === 0 ? (
                  <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                    <p className="text-xs font-bold text-slate-400 mb-2">No payout methods available</p>
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsWithdrawModalOpen(false);
                        setIsAddAccountModalOpen(true);
                      }}
                      className="text-xs font-black text-[#6610f2] uppercase tracking-wider underline cursor-pointer"
                    >
                      Link Account Now
                    </button>
                  </div>
                ) : (
                  <select
                    value={selectedPayoutMethodId}
                    onChange={(e) => setSelectedPayoutMethodId(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#6610f2] transition-all cursor-pointer"
                    required
                  >
                    {payoutMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.type === 'bank_transfer' 
                          ? `${method.details?.bank_name || 'Bank Account'} (${method.details?.account_number})`
                          : `PayPal (${method.details?.email})`}
                        {method.is_primary ? ' (Primary)' : ''}
                      </option>
                    ))}
                  </select>
                )}
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
                    step="0.01"
                    min="10.00"
                    className="w-full bg-slate-50 border-none rounded-2xl py-6 pl-12 pr-6 text-2xl font-black text-slate-900 focus:ring-2 focus:ring-[#6610f2] transition-all"
                    required
                  />
                </div>
                <div className="flex justify-between items-center mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Available: ${wallet?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</span>
                  <span>Min: $10.00</span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={payoutMethods.length === 0}
                className="w-full bg-[#6610f2] text-white py-6 rounded-[1.8rem] font-black text-[12px] uppercase tracking-[0.2em] hover:bg-[#7b2dfd] shadow-xl shadow-purple-900/20 transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
              >
                Confirm Withdrawal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD ACCOUNT MODAL */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddAccountModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">Add Payout Method.</h3>
              <button onClick={() => setIsAddAccountModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-all cursor-pointer">
                <HiOutlineXMark className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            
            <form onSubmit={handleAddAccount} className="p-10 space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Payout Method Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setNewAccountType('bank_transfer')}
                    className={`py-4 rounded-2xl text-xs font-black uppercase tracking-wider border-2 transition-all cursor-pointer ${
                      newAccountType === 'bank_transfer' 
                        ? 'border-[#6610f2] bg-purple-50 text-[#6610f2]' 
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    Bank Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAccountType('paypal')}
                    className={`py-4 rounded-2xl text-xs font-black uppercase tracking-wider border-2 transition-all cursor-pointer ${
                      newAccountType === 'paypal' 
                        ? 'border-[#6610f2] bg-purple-50 text-[#6610f2]' 
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    PayPal
                  </button>
                </div>
              </div>

              {newAccountType === 'bank_transfer' ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. Chase Bank"
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#6610f2] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Account Number</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Account number"
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#6610f2] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Routing Number</label>
                    <input
                      type="text"
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value)}
                      placeholder="9-digit routing number"
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#6610f2] transition-all"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">PayPal Email Address</label>
                  <input
                    type="email"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    placeholder="paypal@yourdomain.com"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#6610f2] transition-all"
                    required
                  />
                </div>
              )}

              <button 
                type="submit"
                disabled={isSavingAccount}
                className="w-full bg-[#6610f2] text-white py-6 rounded-[1.8rem] font-black text-[12px] uppercase tracking-[0.2em] hover:bg-[#7b2dfd] shadow-xl shadow-purple-900/20 transition-all disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer"
              >
                {isSavingAccount ? 'Saving Account...' : 'Link Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD FUNDS MODAL */}
      {isAddFundsModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddFundsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">Add Funds.</h3>
              <button onClick={() => setIsAddFundsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-all cursor-pointer">
                <HiOutlineXMark className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            
            <form onSubmit={handleAddFunds} className="p-10 space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Quick Deposit Options</label>
                <div className="grid grid-cols-3 gap-4">
                  {[25, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAddFundsAmount(amt.toFixed(2))}
                      className="py-4 bg-slate-50 border border-slate-100 hover:border-[#6610f2] rounded-2xl text-sm font-black text-slate-700 transition-all hover:bg-purple-50 hover:text-[#6610f2] cursor-pointer"
                    >
                      +${amt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Amount to Deposit</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300">$</span>
                  <input 
                    type="number" 
                    value={addFundsAmount}
                    onChange={(e) => setAddFundsAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="1.00"
                    className="w-full bg-slate-50 border-none rounded-2xl py-6 pl-12 pr-6 text-2xl font-black text-slate-900 focus:ring-2 focus:ring-[#6610f2] transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Card Billing Info (Mocked)</label>
                <div className="p-5 border border-slate-100 bg-slate-50 rounded-2xl flex items-center gap-4">
                  <HiOutlineCreditCard className="w-8 h-8 text-[#6610f2]" />
                  <div className="flex-1">
                    <p className="text-xs font-black text-slate-800">Visa ending in 4242</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Instant Top-up Processor</p>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isDepositing}
                className="w-full bg-[#6610f2] text-white py-6 rounded-[1.8rem] font-black text-[12px] uppercase tracking-[0.2em] hover:bg-[#7b2dfd] shadow-xl shadow-purple-900/20 transition-all disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer"
              >
                {isDepositing ? 'Processing Deposit...' : 'Confirm Deposit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
