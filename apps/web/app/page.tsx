import { headers } from 'next/headers';
import { api, setAppKey } from '@sellio/api-client';
import { EcommerceLayout, RealEstateLayout, VacationRentalLayout } from '../components/verticals/Layouts';

export default async function Home() {
  const headerList = await headers();
  const appKey = headerList.get('x-app-key') || 'ecommerce_basic';

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
      {/* Dynamic Vertical Switcher */}
      {vertical === 'ecommerce' && <EcommerceLayout appConfig={appConfig} />}
      {vertical === 'real_estate' && <RealEstateLayout appConfig={appConfig} />}
      {vertical === 'vacation_rental' && <VacationRentalLayout appConfig={appConfig} />}

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-4 mt-auto">
        <div className="container mx-auto text-center text-xs">
          © {new Date().getFullYear()} {appConfig?.title || 'Sellio'} · Built with modular engine.
        </div>
      </footer>
    </main>
  );
}
