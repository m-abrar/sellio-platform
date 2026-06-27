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

        {/* Main — transparent, content cards sit directly on bg */}
        <main className="flex-1 min-w-0 px-4 py-6 lg:py-8 lg:pl-4 lg:pr-8 pb-32">
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
            <Outlet context={{ user }} />
          </div>
        </main>
      </div>
    </div>
  );
}
