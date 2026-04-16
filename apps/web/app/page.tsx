import { headers } from 'next/headers';
import { api, setAppKey } from '@sellio/api-client';
import { EcommerceLayout, RealEstateLayout, VacationRentalLayout } from '../components/verticals/Layouts';

export default async function Home() {
  const headerList = await headers();
  const appKey = headerList.get('x-app-key') || 'ecommerce_basic';

  let appConfig = null;
  let dynamicStyles = {};
  
  try {
    setAppKey(appKey);
    const { data: response } = await api.applications.active();
    appConfig = response.data;

    // Map Application variables to CSS Variables
    if (appConfig?.variables) {
      dynamicStyles = {
        '--primary-color': appConfig.variables.primary || '#6610f2',
        '--accent-color': appConfig.variables.accent || '#00f2fe',
        '--background': appConfig.variables.background || '#ffffff',
        '--foreground': appConfig.variables.foreground || '#171717',
      };
    }
  } catch (e) {
    console.error("Failed to load app config", e);
  }

  const vertical = appConfig?.vertical || 'ecommerce';

  return (
    <main 
      className="min-h-screen bg-background transition-colors duration-500"
      style={dynamicStyles as React.CSSProperties}
    >
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
