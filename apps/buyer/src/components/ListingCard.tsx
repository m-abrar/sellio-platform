import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Star, Heart, ArrowRight, Calendar, Tag } from 'lucide-react';
import { cn } from '../lib/utils';

interface ListingCardProps {
  item: any;
  module: string;
  viewMode?: 'grid' | 'list';
  onToggleFavorite?: (id: string) => void;
  onAction?: (item: any) => void;
  index?: number;
  actionLabel?: string;
}

export const ListingCard = ({
  item,
  module,
  viewMode = 'grid',
  onToggleFavorite,
  onAction,
  index = 0,
  actionLabel = 'View Details',
}: ListingCardProps) => {
  const isList = viewMode === 'list';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      className={cn(
        'group bg-white border border-slate-200/80 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5',
        isList ? 'rounded-2xl flex flex-col sm:flex-row' : 'rounded-3xl flex flex-col',
      )}
    >
      {/* Image */}
      <div
        className={cn(
          'relative overflow-hidden bg-slate-100 shrink-0',
          isList ? 'sm:w-56 aspect-video sm:aspect-[4/3]' : 'aspect-[16/10]',
        )}
      >
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category pill */}
        <div className="absolute top-3.5 left-3.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black text-slate-700 shadow-sm capitalize">
            <Tag size={9} />
            {item.category || module}
          </span>
        </div>

        {/* Remove favorite */}
        {onToggleFavorite && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.favoriteId || item.id); }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-white transition-all shadow-sm hover:scale-110 active:scale-95"
          >
            <Heart size={14} fill="currentColor" />
          </button>
        )}

        {/* Price overlay on image bottom */}
        {item.price != null && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 pt-8 pb-3">
            <p className="text-white font-black text-lg leading-none">
              ${typeof item.price === 'number' ? item.price.toLocaleString() : item.price}
              {module === 'properties' && <span className="text-white/70 text-xs font-semibold ml-1">/mo</span>}
              {module === 'autos' && <span className="text-white/70 text-xs font-semibold ml-1">/day</span>}
            </p>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col p-5">
        <h3 className="font-bold text-slate-900 text-sm leading-snug mb-2 group-hover:text-[var(--primary-color)] transition-colors line-clamp-2">
          {item.title}
        </h3>

        {item.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed flex-1">{item.description}</p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 mb-4">
          {item.metadata?.location && (
            <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <MapPin size={11} className="text-slate-400" />
              {item.metadata.location}
            </span>
          )}
          {item.metadata?.date && (
            <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <Calendar size={11} className="text-slate-400" />
              {item.metadata.date}
            </span>
          )}
          {item.metadata?.rating && (
            <span className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
              <Star size={11} fill="currentColor" />
              {item.metadata.rating}
            </span>
          )}
          {item.metadata?.beds && (
            <span className="text-[11px] text-slate-500 font-medium">
              <strong className="text-slate-800">{item.metadata.beds}</strong> bd ·{' '}
              <strong className="text-slate-800">{item.metadata.baths}</strong> ba
            </span>
          )}
        </div>

        <button
          onClick={() => onAction?.(item)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all group/btn"
        >
          {actionLabel}
          <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};
