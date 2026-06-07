import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SetupReminderBanner from '../SetupReminderBanner';

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SetupReminderBanner />
      <div className="flex flex-1 items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#6610f2]/20 border-t-[#6610f2] rounded-full animate-spin mx-auto" />
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Loading session...</p>
      </div>
      </div>
    </div>
  );
}

function AccessDeniedScreen() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-6">
      <SetupReminderBanner />
      <div className="flex flex-1 items-center justify-center">
      <div className="max-w-md w-full bg-white border border-slate-100 rounded-[2rem] p-10 text-center shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Access Denied</h1>
        <p className="text-sm text-slate-500 mt-3">
          This portal is limited to partner, admin, and super-admin accounts.
        </p>
        <a
          href="/login"
          className="inline-flex mt-8 px-6 py-3 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-[#6610f2] transition-colors"
        >
          Back to Login
        </a>
      </div>
      </div>
    </div>
  );
}

export function ProtectedRoute() {
  const { isLoading, isAuthenticated, hasSellerAccess } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasSellerAccess) {
    return <AccessDeniedScreen />;
  }

  return <Outlet />;
}
