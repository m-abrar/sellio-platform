import React from 'react';
import { HiOutlineArrowPath, HiOutlineCheck } from 'react-icons/hi2';

interface ActionPillProps {
  isSaving: boolean;
  isEditMode: boolean;
  onSave: () => void;
  label: string;
  variant?: 'floating' | 'docked';
  showOnDesktop?: boolean;
}

export default function ActionPill({ isSaving, isEditMode, onSave, label, variant = 'floating', showOnDesktop = false }: ActionPillProps) {
  if (variant === 'docked') {
    return (
      <button
        onClick={onSave}
        disabled={isSaving}
        className="w-full bg-brand text-white p-8 rounded-container font-black text-sm uppercase tracking-caps-wide shadow-2xl shadow-brand/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
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
    <div className={`fixed bottom-[calc(105px+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-[3050] ${showOnDesktop ? 'lg:left-auto lg:right-10 lg:bottom-10 lg:translate-x-0' : 'lg:hidden'}`}>
      <button
        onClick={onSave}
        disabled={isSaving}
        className="bg-brand text-white px-10 py-5 md:px-12 md:py-6 rounded-full font-black text-xs uppercase tracking-caps-wide shadow-2xl shadow-brand/40 flex items-center gap-4 active:scale-90 transition-all disabled:opacity-50 hover:scale-[1.02]"
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
