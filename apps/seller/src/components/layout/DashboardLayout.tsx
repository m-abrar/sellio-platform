import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar'; // Assuming Sidebar is in the parent/sibling folder

export default function DashboardLayout({ user }: { user?: any }) {
  return (
    <div className="min-h-screen bg-[#fbfcfd] text-slate-900 selection:bg-purple-100 selection:text-[#6610f2]">
      <div id="wrapper" className="flex flex-col lg:flex-row max-w-[1640px] mx-auto min-h-screen relative">
        
        {/* SIDEBAR CONTAINER */}
        <div className="lg:sticky lg:top-0 lg:h-screen lg:py-8 lg:pl-8 z-[1050] shrink-0">
          <Sidebar user={user} />
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 px-4 py-8 md:p-10 lg:p-14 pb-32">
          <div className="animate-in fade-in zoom-in-95 duration-700">
            <Outlet context={{ user }} />
          </div>
        </main>
      </div>
    </div>
  );
}
