import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  BarChart3, 
  Users, 
  Globe, 
  ShieldCheck, 
  ArrowRight,
  Plus,
  X,
  Building,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Button } from '../components/Button';

export default function PartnerView() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [businessDesc, setBusinessDesc] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeStage, setUpgradeStage] = useState<'form' | 'provisioning' | 'success'>('form');

  const handleUpgradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpgrading(true);
    setUpgradeStage('provisioning');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUpgradeStage('success');
      
      setTimeout(() => {
        setShowUpgradeModal(false);
        window.location.assign('http://localhost:3000/dashboard');
      }, 1500);
    } catch {
      alert('Failed to upgrade account.');
      setUpgradeStage('form');
      setIsUpgrading(false);
    }
  };

  const features = [
    { icon: BarChart3, title: 'Advanced Analytics', desc: 'Track your performance with detailed insights and real-time data.' },
    { icon: Users, title: 'Customer Management', desc: 'Easily manage your inquiries, bookings, and customer relationships.' },
    { icon: Globe, title: 'Global Reach', desc: 'Expand your business to a wider audience with our multi-module platform.' },
    { icon: ShieldCheck, title: 'Secure Payments', desc: 'Integrated secure payment gateways for all your transactions.' },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[40px] bg-zinc-900 text-white p-8 lg:p-16">
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Rocket size={14} className="text-[var(--primary-color)]" />
            Partner Program
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            Grow Your Business with <span className="text-[var(--primary-color)]">Sellio</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400 mb-8"
          >
            Join thousands of partners who are scaling their services, properties, and products through our unified ecosystem.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Button size="lg" rightIcon={<ArrowRight size={20} />} onClick={() => setShowUpgradeModal(true)}>
              Get Started Now
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-md text-white border-none hover:bg-white/20">
              Learn More
            </Button>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--primary-color)] rounded-full blur-[120px]" />
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-surface p-8"
          >
            <div className="w-12 h-12 bg-[var(--primary-light)] text-[var(--primary-color)] rounded-2xl flex items-center justify-center mb-6">
              <f.icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">{f.title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="px-3">
        <div className="glass-surface p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">Ready to list your first item?</h2>
            <p className="text-zinc-500">Whether it's a property, a car, or a professional service, we provide the tools to help you succeed.</p>
          </div>
          <Button size="lg" leftIcon={<Plus size={24} />} onClick={() => setShowUpgradeModal(true)} className="px-10 py-8 rounded-[24px] shadow-xl shadow-zinc-200">
            Create Partner Account
          </Button>
        </div>
      </div>
      {/* Partner Onboarding Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl relative border border-zinc-100 text-left"
            >
              <button 
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer border-none bg-transparent"
                disabled={isUpgrading && upgradeStage === 'provisioning'}
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center">
                  <Rocket size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 leading-tight">Upgrade to Partner Account</h3>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Sellio Partner Studio Onboarding</p>
                </div>
              </div>

              {upgradeStage === 'form' && (
                <form onSubmit={handleUpgradeSubmit} className="space-y-4">
                  <p className="text-xs text-zinc-500 leading-relaxed mb-2">
                    Enter your business details below to unlock your Seller Studio and start listing properties, cars, events, or services in one click.
                  </p>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Business / Store Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Autos & Lodging"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-zinc-50 border-none rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-zinc-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Contact Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +1 (555) 019-2834"
                      value={businessPhone}
                      onChange={(e) => setBusinessPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-zinc-50 border-none rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-zinc-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Business Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Briefly explain what items or services you plan to offer on Sellio..."
                      value={businessDesc}
                      onChange={(e) => setBusinessDesc(e.target.value)}
                      className="w-full bg-zinc-50 border-none rounded-xl p-3 text-xs focus:ring-2 focus:ring-zinc-950 transition-all placeholder-zinc-400 leading-relaxed"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowUpgradeModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                    >
                      Upgrade & Launch Studio
                    </Button>
                  </div>
                </form>
              )}

              {upgradeStage === 'provisioning' && (
                <div className="py-12 text-center space-y-4">
                  <Loader2 className="w-10 h-10 text-[var(--primary-color)] animate-spin mx-auto" />
                  <div>
                    <h4 className="font-extrabold text-sm text-zinc-900 mb-0.5">Provisioning Seller Studio...</h4>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Building databases & merchant credentials</p>
                  </div>
                  <p className="text-xs text-zinc-550 max-w-xs mx-auto leading-relaxed">
                    Setting up your multi-vertical analytics docks, inventory managers, and Spatie asset libraries.
                  </p>
                </div>
              )}

              {upgradeStage === 'success' && (
                <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xs border border-emerald-100">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-zinc-900 mb-0.5">Account Successfully Upgraded!</h4>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Welcome to Sellio Partners</p>
                  </div>
                  <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                    Redirecting you to your new **Seller Studio Cockpit** now. Start listing your items!
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
