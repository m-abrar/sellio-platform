import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { HiOutlineCheck, HiOutlineSparkles } from 'react-icons/hi2';
import { confirmSubscriptionCheckout, getMembershipPlans, subscribeToPlan } from '../../api/plans';
import { getDashboardData } from '../../api/dashboard';
import { ApiError } from '../../lib/apiError';
import { toast } from 'sonner';

export default function MembershipsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [memberships, setMemberships] = useState<any[]>([]);
  const [limits, setLimits] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [upgradingPlanId, setUpgradingPlanId] = useState<number | null>(null);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const [plansRes, dashboardRes] = await Promise.all([
        getMembershipPlans(),
        getDashboardData()
      ]);
      setMemberships(plansRes.data.data);
      setLimits(dashboardRes.data.subscriptionLimits);
    } catch (error) {
      console.error('Failed to fetch memberships', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchPlans();
  }, []);

  useEffect(() => {
    const subscriptionStatus = searchParams.get('subscription');
    const sessionId = searchParams.get('session_id');

    if (!subscriptionStatus) {
      return;
    }

    const clearReturnParams = () => {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('subscription');
      nextParams.delete('session_id');
      setSearchParams(nextParams, { replace: true });
    };

    const handleReturn = async () => {
      if (subscriptionStatus === 'success' && sessionId) {
        try {
          const response = await confirmSubscriptionCheckout(sessionId);
          toast.success(response.message || 'Subscription updated successfully.');
          await fetchPlans();
        } catch (error) {
          console.error('Failed to confirm subscription checkout', error);
          const message = error instanceof ApiError
            ? error.message
            : 'Payment succeeded, but membership confirmation is still pending.';
          toast.message(message);
          await fetchPlans();
        } finally {
          clearReturnParams();
        }
        return;
      }

      if (subscriptionStatus === 'success') {
        toast.success('Stripe checkout completed. Your membership will update after webhook confirmation.');
        void fetchPlans();
      } else if (subscriptionStatus === 'cancelled') {
        toast.message('Checkout cancelled. No subscription changes were made.');
      }

      clearReturnParams();
    };

    void handleReturn();
  }, [searchParams, setSearchParams]);

  const handleSubscribe = async (planId: number) => {
    setUpgradingPlanId(planId);
    try {
      const response = await subscribeToPlan(planId);

      if (response.checkoutUrl) {
        window.location.assign(response.checkoutUrl);
        return;
      }

      toast.success(response.message || 'Subscription updated successfully.');
      await fetchPlans();
    } catch (error) {
      console.error('Failed to subscribe', error);
      const message = error instanceof ApiError
        ? error.message
        : 'Unable to update subscription.';
      toast.error(message);
    } finally {
      setUpgradingPlanId(null);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader badge="Plans" title="Your" subtitle="Plan" />

      {/* Dynamic Active Quota Alert Card */}
      {!isLoading && limits && (
        <div className="bg-white border border-slate-100 rounded-container p-8 md:p-10 shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
          
          {/* Left Side: Plan Info and Progress */}
          <div className="w-full md:flex-1 space-y-6">
            <div>
              <p className="text-label font-black uppercase tracking-caps-wide text-purple-500 mb-2">Active Subscription Status</p>
              <h3 className="text-2xl md:text-3xl font-black italic tracking-tight text-slate-900 flex items-center gap-3">
                {limits.plan_title}
                <span className={`px-4 py-1.5 rounded-full text-micro font-black uppercase tracking-widest ${limits.is_limit_exceeded ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                  {limits.is_limit_exceeded ? 'Limit Reached ⚠️' : 'Active ✅'}
                </span>
              </h3>
            </div>

            {/* Quota Progress */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline text-xs">
                <span className="font-bold text-slate-400">Total Listings Usage</span>
                <span className="font-black text-slate-900">
                  {limits.current_listings_count} <span className="text-slate-400 font-medium">/ {limits.max_listings === 999 ? 'Unlimited' : `${limits.max_listings} listings`}</span>
                </span>
              </div>

              {/* Progress Bar */}
              {limits.max_listings > 0 && limits.max_listings !== 999 ? (
                <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${Math.min(100, (limits.current_listings_count / limits.max_listings) * 100)}%` }}
                    className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${limits.is_limit_exceeded ? 'from-red-500 to-brand' : 'from-brand to-purple-500'}`}
                  />
                </div>
              ) : (
                <div className="w-full h-3.5 bg-purple-50 rounded-full flex items-center px-1">
                  <div className="w-full h-1.5 bg-brand rounded-full" />
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Visual Metrics Indicator */}
          <div className="w-full md:w-auto shrink-0 bg-slate-50/50 border border-slate-100 rounded-3xl p-6 text-center md:text-left min-w-[200px]">
            <div className="text-3xl font-black italic tracking-tighter text-slate-900 mb-1">
              {limits.max_listings === 999 ? '0%' : `${Math.round(Math.min(100, (limits.current_listings_count / limits.max_listings) * 100))}%`}
            </div>
            <p className="text-micro font-black uppercase tracking-widest text-slate-400">Quota Consumed</p>
          </div>

          {/* Background subtle glow */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-brand/5 rounded-full blur-[80px] pointer-events-none" />
        </div>
      )}

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <span className="text-label font-black uppercase tracking-caps-xl text-slate-300 animate-pulse">Syncing Plans...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {memberships.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 sm:p-10 lg:p-12 rounded-floating border-2 transition-all duration-500 relative overflow-hidden flex flex-col justify-between ${plan.status === 'Current' ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-white border-slate-100 text-slate-900 shadow-premium hover:border-brand/20'}`}
            >
              <div>
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="text-3xl font-black italic tracking-tight mb-2">{plan.name}</h3>
                    <p className={`text-label font-black uppercase tracking-caps-wide ${plan.status === 'Current' ? 'text-slate-500' : 'text-slate-400'}`}>Tier Level</p>
                  </div>
                  {plan.status === 'Current' && (
                    <span className="bg-brand text-white px-4 py-2 rounded-full text-label font-black uppercase tracking-widest flex items-center gap-2">
                      <HiOutlineSparkles className="w-4 h-4" /> Current Plan
                    </span>
                  )}
                </div>

                <div className="mb-12">
                  <h4 className="text-6xl font-black italic tracking-tighter mb-8">{plan.price}</h4>
                  <div className="space-y-4">
                    {plan.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${plan.status === 'Current' ? 'bg-brand text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <HiOutlineCheck className="w-4 h-4" />
                        </div>
                        <span className={`text-sm font-bold ${plan.status === 'Current' ? 'text-slate-300' : 'text-slate-600'}`}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                disabled={plan.status === 'Current' || upgradingPlanId === plan.planId}
                onClick={() => handleSubscribe(plan.planId)}
                className={`w-full py-6 rounded-card font-black text-xs uppercase tracking-caps transition-all ${plan.status === 'Current' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-brand text-white hover:bg-brand-hover shadow-lg shadow-purple-200'}`}
              >
                {plan.status === 'Current'
                  ? 'Active Subscription'
                  : upgradingPlanId === plan.planId
                    ? 'Processing...'
                    : `Upgrade to ${plan.name}`}
              </button>

              {plan.status === 'Current' && (
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand/10 rounded-full blur-[100px]" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
