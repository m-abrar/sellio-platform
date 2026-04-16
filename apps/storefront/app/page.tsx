import { headers } from 'next/headers';
import { api, setAppKey } from '@sellio/api-client';
import { Card, Button } from '@sellio/ui';

export default async function Home() {
  const headerList = await headers();
  const appKey = headerList.get('x-app-key') || 'default_ecommerce';

  let appConfig = null;
  try {
    setAppKey(appKey);
    const { data: app } = await api.applications.active();
    appConfig = app;
  } catch (e) {
    console.error("Failed to load app config", e);
  }

  const vertical = appConfig?.vertical || 'ecommerce';

  return (
    <main className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative h-[500px] flex items-center justify-center text-center px-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 hover:scale-100"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d)' }}
        />
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl font-bold text-white mb-6">
            {appConfig?.title || "Welcome to Sellio"}
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Experience the future of {vertical.replace('_', ' ')} marketplaces.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Get Started</Button>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
              Browse Listings
            </Button>
          </div>
        </div>
      </section>

      {/* DYNAMIC FEATURES BASED ON VERTICAL */}
      <section className="py-20 px-4 container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
          <p className="text-muted-foreground">Tailored solutions for the {vertical.replace('_', ' ')} industry.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: vertical === 'real_estate' ? 'Verified Properties' : 'Premium Listings',
              text: 'Every listing is vetted for quality and authenticity.'
            },
            {
              title: 'Secure Transactions',
              text: 'Integrated escrow and payment systems for your peace of mind.'
            },
            {
              title: 'Dynamic Discovery',
              text: 'Smart filtering and AI-powered recommendations.'
            }
          ].map((feature, i) => (
            <Card key={i} title={feature.title}>
              <p className="text-muted-foreground">{feature.text}</p>
              <Button variant="ghost" className="px-0 mt-4 h-auto text-accent hover:bg-transparent">
                Learn more →
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-4">
        <div className="container mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-sm">Sellio</h3>
            <p className="text-xs leading-relaxed">
              The world's first modular SaaS platform for high-performance marketplaces.
            </p>
          </div>
          {/* Add more footer columns as needed */}
        </div>
        <div className="mt-12 pt-8 border-t border-slate-900 text-center text-xs">
          © {new Date().getFullYear()} Sellio Platform · All rights reserved.
        </div>
      </footer>
    </main>
  );
}
