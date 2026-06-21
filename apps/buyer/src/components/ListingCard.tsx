import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Star, Heart, ArrowRight, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from './Badge';
import { Button } from './Button';

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
  actionLabel = 'View Details'
}: ListingCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "bg-white border border-zinc-200 overflow-hidden group hover:border-zinc-900 transition-all duration-300",
        viewMode === 'grid' ? "rounded-3xl flex flex-col" : "rounded-2xl flex flex-col md:flex-row"
      )}
    >
      <div className={cn(
        "relative overflow-hidden",
        viewMode === 'grid' ? "aspect-[4/3]" : "w-full md:w-64 aspect-video md:aspect-square"
      )}>
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="default" className="bg-white/90 backdrop-blur-md text-zinc-900">
            {item.category}
          </Badge>
        </div>
        <button 
          onClick={() => onToggleFavorite?.(item.favoriteId || item.id)}
          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full text-zinc-400 hover:text-rose-500 transition-colors shadow-sm"
        >
          <Heart size={16} />
        </button>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-zinc-900 group-hover:text-zinc-700 transition-colors">
            {item.title}
          </h3>
          <div className="flex items-center gap-1 text-zinc-900 font-bold">
            <span className="text-sm">$</span>
            <span className="text-xl">{item.price.toLocaleString()}</span>
            {module === 'properties' && <span className="text-xs text-zinc-400 font-medium">/mo</span>}
            {module === 'autos' && <span className="text-xs text-zinc-400 font-medium">/day</span>}
          </div>
        </div>

        <p className="text-sm text-zinc-500 line-clamp-2 mb-4 flex-1">
          {item.description}
        </p>

        <div className="flex flex-wrap gap-4 mb-6">
          {item.metadata?.location && (
            <div className="flex items-center gap-1.5 text-zinc-500">
              <MapPin size={14} />
              <span className="text-xs font-medium">{item.metadata.location}</span>
            </div>
          )}
          {item.metadata?.date && (
            <div className="flex items-center gap-1.5 text-zinc-500">
              <Calendar size={14} />
              <span className="text-xs font-medium">{item.metadata.date}</span>
            </div>
          )}
          {item.metadata?.rating && (
            <div className="flex items-center gap-1.5 text-amber-500">
              <Star size={14} fill="currentColor" />
              <span className="text-xs font-bold">{item.metadata.rating}</span>
            </div>
          )}
          {item.metadata?.beds && (
            <div className="flex items-center gap-3 text-zinc-400">
              <span className="text-xs font-medium"><span className="text-zinc-900 font-bold">{item.metadata.beds}</span> Beds</span>
              <span className="w-1 h-1 rounded-full bg-zinc-200" />
              <span className="text-xs font-medium"><span className="text-zinc-900 font-bold">{item.metadata.baths}</span> Baths</span>
            </div>
          )}
        </div>

        <Button 
          variant="outline" 
          className="w-full hover:bg-zinc-900 hover:text-white"
          rightIcon={<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          onClick={() => onAction?.(item)}
        >
          {actionLabel}
        </Button>
      </div>
    </motion.div>
  );
};
