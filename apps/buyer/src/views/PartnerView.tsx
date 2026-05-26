import React from 'react';
import { motion } from 'motion/react';
import { 
  Rocket, 
  BarChart3, 
  Users, 
  Globe, 
  ShieldCheck, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { Button } from '../components/Button';

export default function PartnerView() {
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
            <Button size="lg" rightIcon={<ArrowRight size={20} />}>
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
          <Button size="lg" leftIcon={<Plus size={24} />} className="px-10 py-8 rounded-[24px] shadow-xl shadow-zinc-200">
            Create Partner Account
          </Button>
        </div>
      </div>
    </div>
  );
}
