interface ActionPillProps {
  isSaving: boolean;
  isEditMode: boolean;
  onSave: () => Promise<any>;
  variant?: 'floating' | 'docked';
  label?: string; // e.g., "Product" or "Property"
}

export default function ActionPill({ 
  isSaving, 
  isEditMode, 
  onSave, 
  variant = 'floating',
  label = 'Asset' 
}: ActionPillProps) {

  const handleAction = async () => {
    if (isSaving) return;
    try {
      await onSave();
    } catch (e) {
      console.log("ActionPill: Protocol aborted due to validation errors.");
    }
  };

  // --- Variant: Side Docked (Desktop) ---
  if (variant === 'docked') {
    return (
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group border border-white/5 transition-all hover:shadow-[#6610f2]/10">
        <div className="relative z-10 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${isSaving ? 'bg-amber-500 animate-ping' : 'bg-[#6610f2] shadow-[0_0_20px_#6610f2]'}`} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">System Engine</p>
                <p className="text-sm font-black italic tracking-tight">Protocol Online.</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleAction}
            disabled={isSaving}
            className="w-full bg-[#6610f2] text-white py-6 rounded-[2rem] font-black text-[13px] uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all duration-500 active:scale-95 disabled:opacity-50 shadow-[0_20px_40px_rgba(102,16,242,0.3)] relative overflow-hidden"
          >
            <span className="relative z-10">
              {isSaving ? 'Processing...' : (isEditMode ? `Update ${label}` : `Deploy ${label}`)}
            </span>
          </button>
        </div>
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
          <div className="absolute inset-[-100%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 animate-shimmer" />
        </div>
      </div>
    );
  }

  // --- Variant: Bottom Floating (Mobile) ---
  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[94%] pointer-events-none">
      <div className="bg-slate-900/80 backdrop-blur-2xl p-4 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 flex items-center justify-between pointer-events-auto ring-1 ring-white/5">
        
        <div className="pl-6 flex items-center gap-3">
           <div className={`w-2 h-2 rounded-full ${isSaving ? 'bg-amber-500 animate-pulse' : 'bg-[#6610f2]'}`} />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
             {isSaving ? 'Syncing' : 'Protocol Live'}
           </span>
        </div>

        <button 
          onClick={handleAction}
          disabled={isSaving}
          className="bg-[#6610f2] text-white px-10 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] active:scale-90 transition-all shadow-lg"
        >
          {isSaving ? '...' : (isEditMode ? 'Save' : 'Deploy')}
        </button>
      </div>
    </div>
  );
}