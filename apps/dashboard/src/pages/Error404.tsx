import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowLongLeft, HiOutlineHomeModern, HiOutlineMagnifyingGlass } from 'react-icons/hi2';

export default function Error404() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 selection:bg-[#6610f2] selection:text-white">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#6610f2]/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Large Ghost Number */}
        <div className="relative inline-block mb-12">
          <h1 className="text-[12rem] md:text-[18rem] font-black leading-none tracking-tighter text-slate-900/5 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100 animate-in zoom-in duration-700">
                <HiOutlineHomeModern className="w-16 h-16 text-[#6610f2]" />
             </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight italic">
            Protocol <span className="text-[#6610f2]">Breach.</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg max-w-md mx-auto leading-relaxed">
            The asset or coordinate you are looking for does not exist within the current registry. It may have been decommissioned or moved.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-slate-900 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3 group"
          >
            <HiOutlineArrowLongLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Previous Node
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#6610f2] shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:shadow-[#6610f2]/20 transition-all flex items-center justify-center gap-3"
          >
            Central Command
          </button>
        </div>

        {/* Search Suggestion */}
        <div className="mt-16 pt-16 border-t border-slate-200/60 max-w-sm mx-auto">
          <div className="relative group">
            <HiOutlineMagnifyingGlass className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-[#6610f2] transition-colors" />
            <input 
              type="text"
              placeholder="Search registry..."
              className="w-full bg-slate-100/50 border-2 border-transparent focus:border-[#6610f2] focus:bg-white rounded-[1.5rem] pl-14 pr-6 py-4 text-sm font-bold transition-all outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}