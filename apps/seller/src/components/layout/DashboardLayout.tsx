import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { useAuth } from '../../context/AuthContext';
import SetupReminderBanner from '../SetupReminderBanner';

export default function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div
      className="min-h-screen text-slate-900 selection:bg-violet-100 selection:text-brand"
      style={{ backgroundColor: 'var(--color-bg-base)' }}
    >
      <SetupReminderBanner />

      <div
        id="wrapper"
        className="flex flex-col lg:flex-row max-w-[1680px] mx-auto w-full"
      >
        {/* Sidebar — floating rounded card on left */}
        <div className="lg:sticky lg:top-0 lg:h-screen lg:py-5 lg:pl-5 z-[1050] shrink-0">
          <Sidebar user={user} />
        </div>

        {/* Main — also a floating rounded card, framed by the bg */}
        <main className="flex-1 min-w-0 px-3 py-4 lg:py-5 lg:pl-3 lg:pr-5">
          <div
            className="bg-white rounded-card-lg min-h-[90dvh] px-5 py-8 md:px-10 md:py-10 pb-32"
            style={{
              boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 4px 32px rgba(0,0,0,0.04)',
            }}
          >
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
              <Outlet context={{ user }} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
