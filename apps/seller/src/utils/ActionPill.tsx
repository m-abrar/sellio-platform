import React from 'react';
import { HiOutlineArrowPath, HiOutlineCheck } from 'react-icons/hi2';

interface ActionPillProps {
  isSaving: boolean;
  isEditMode: boolean;
  onSave: () => void;
  label: string;
  variant?: 'floating' | 'docked';
}

export default function ActionPill({ isSaving, isEditMode, onSave, label, variant = 'floating' }: ActionPillProps) {
  if (variant === 'docked') {
    return (
      <button
        onClick={onSave}
        disabled={isSaving}
        className="w-full bg-[#6610f2] text-white p-8 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-[#6610f2]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
      >
        {isSaving ? (
          <HiOutlineArrowPath className="w-6 h-6 animate-spin" />
        ) : (
          <HiOutlineCheck className="w-6 h-6" />
        )}
        {isSaving ? 'Processing...' : `${isEditMode ? 'Update' : 'Publish'} ${label}`}
      </button>
    );
  }

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 lg:hidden">
      <button
        onClick={onSave}
        disabled={isSaving}
        className="bg-[#6610f2] text-white px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-[#6610f2]/40 flex items-center gap-4 active:scale-90 transition-all disabled:opacity-50"
      >
        {isSaving ? (
          <HiOutlineArrowPath className="w-5 h-5 animate-spin" />
        ) : (
          <HiOutlineCheck className="w-5 h-5" />
        )}
        {isSaving ? 'Saving...' : `${isEditMode ? 'Update' : 'Publish'} ${label}`}
      </button>
    </div>
  );
}
