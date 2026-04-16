import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  HiOutlineEye, 
  HiOutlineEyeSlash, 
  HiOutlineLockClosed, 
  HiOutlineShieldExclamation,
  HiOutlineArrowRight
} from 'react-icons/hi2';

// Import the abstracted service
import { login } from '../api/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    
    // Create the logic as a promise for Sonner's toast.promise
    const loginAction = async () => {
      const { data } = await login({ email, password });
      const token = data.token || data.access_token;
      
      if (!token) throw new Error("Authentication failed: No token received.");

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Small delay so the user sees the success state before redirecting
      await new Promise(resolve => setTimeout(resolve, 800));
      navigate('/dashboard');
      return data;
    };

    toast.promise(loginAction(), {
      loading: (
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-700">Verifying Identity...</span>
        </div>
      ),
      success: (data) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <HiOutlineLockClosed className="w-5 h-5" />
          </div>
          <div>
            <p className="font-black text-slate-900 text-xs uppercase tracking-tight">Access Granted</p>
            <p className="text-[10px] text-slate-500 font-medium">Welcome back, {data.user?.name || 'Partner'}</p>
          </div>
        </div>
      ),
      error: (err) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <HiOutlineShieldExclamation className="w-5 h-5" />
          </div>
          <div>
            <p className="font-black text-slate-900 text-xs uppercase tracking-tight">Login Failed</p>
            <p className="text-[10px] text-slate-500 font-medium max-w-[180px]">
              {err.response?.data?.message || err.message || "Invalid credentials provided."}
            </p>
          </div>
        </div>
      ),
      finally: () => setIsLoading(false)
    });
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        {/* Brand Section */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#6610f2] rounded-2xl sm:rounded-3xl flex items-center justify-center text-white font-black text-2xl sm:text-3xl mx-auto mb-5 shadow-2xl shadow-purple-200 rotate-3 hover:rotate-0 transition-transform duration-300">
            S
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter">Partner Portal</h1>
          <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Sellio Studio Access</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-[#6610f2]/10 focus:ring-4 focus:ring-[#6610f2]/5 transition-all outline-none"
                placeholder="name@company.com"
                onChange={e => setEmail(e.target.value)} 
              />
            </div>

            {/* Password Input with Eye Icon */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Security Key</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-[#6610f2]/10 focus:ring-4 focus:ring-[#6610f2]/5 transition-all outline-none pr-14"
                  placeholder="••••••••"
                  onChange={e => setPassword(e.target.value)} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-[#6610f2] transition-colors rounded-xl"
                >
                  {showPassword ? <HiOutlineEyeSlash className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Action Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-4 sm:py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#6610f2] transition-all active:scale-[0.97] shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              {isLoading ? 'Authenticating...' : (
                <>
                  Enter Studio <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center flex flex-col items-center gap-2">
          <div className="h-px w-12 bg-slate-200" />
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.25em]">© 2026 Sellio Global</span>
        </div>
      </div>
    </div>
  );
}