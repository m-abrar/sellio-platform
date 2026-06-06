import React from 'react';
import type { ListingCounts } from '../../utils/listingCounts';

type ListingCountCardsProps = {
  entityLabel: string;
  counts: ListingCounts;
  isLoading?: boolean;
};

const cardTones = [
  'bg-slate-100 border-slate-200',
  'bg-slate-100 border-slate-200',
  'bg-slate-100 border-slate-200',
  'bg-slate-100 border-slate-200',
];

export default function ListingCountCards({ entityLabel, counts, isLoading = false }: ListingCountCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6" aria-busy="true" aria-label={`Loading ${entityLabel} counts`}>
        {cardTones.map((tone, index) => (
          <div
            key={index}
            className={`rounded-[1.75rem] border px-6 py-5 shadow-[0_14px_30px_rgba(15,23,42,0.04)] animate-pulse ${tone}`}
          >
            <div className="h-3 w-24 rounded-full bg-slate-200" />
            <div className="mt-5 h-9 w-14 rounded-xl bg-slate-200" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    { label: `Total ${entityLabel}`, value: counts.total, tone: 'bg-slate-900 text-white border-slate-900' },
    { label: 'Live', value: counts.live, tone: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    { label: 'Pending', value: counts.pending, tone: 'bg-amber-50 text-amber-700 border-amber-100' },
    { label: 'Drafts', value: counts.draft, tone: 'bg-slate-50 text-slate-600 border-slate-100' },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
      {cards.map((item) => (
        <div
          key={item.label}
          className={`rounded-[1.75rem] border px-6 py-5 shadow-[0_14px_30px_rgba(15,23,42,0.04)] ${item.tone}`}
        >
          <p className="text-[9px] font-black uppercase tracking-[0.22em] opacity-60">{item.label}</p>
          <p className="mt-3 text-3xl font-black tracking-tighter">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
