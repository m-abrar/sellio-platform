import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { HeartOff, Grid3X3, List, LayoutGrid } from 'lucide-react';
import { fetchFavorites, toggleFavorite } from '../api/itemApi';
import { useStats } from '../context/StatsContext';
import { ListingCard } from '../components/ListingCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PageHeader } from '../components/PageHeader';
import { storefrontExploreUrl, storefrontListingUrl } from '../config/api';
import { cn } from '../lib/utils';
import { Heart } from 'lucide-react';

type ViewMode = 'grid' | 'list';

function FavoriteSkeleton({ viewMode }: { viewMode: ViewMode }) {
  return (
    <div className={cn('grid gap-5', viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1')}>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-3xl border border-slate-200/70 overflow-hidden animate-pulse">
          <div className={cn('bg-slate-100', viewMode === 'grid' ? 'aspect-[16/10]' : 'h-36')} />
          <div className="p-5 space-y-3">
            <div className="h-4 w-3/4 bg-slate-100 rounded-full" />
            <div className="h-3 w-full bg-slate-100 rounded-full" />
            <div className="h-3 w-2/3 bg-slate-100 rounded-full" />
            <div className="h-9 w-full bg-slate-100 rounded-xl mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FavoritesView() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const { refreshStats } = useStats();

  useEffect(() => { loadFavorites(); }, []);

  const loadFavorites = async () => {
    try {
      const data = await fetchFavorites();
      setFavorites(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId: string) => {
    const favItem = favorites.find((f) => f.id === itemId);
    const recordId = favItem?.favoriteId || itemId;
    try {
      await toggleFavorite(String(recordId));
      setFavorites(favorites.filter((f) => f.id !== itemId));
      refreshStats();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb="Favorites"
        title="My Saved Listings"
        description="Listings you've bookmarked for quick access."
        icon={Heart}
        iconColor="text-rose-500"
        iconBg="bg-rose-50"
        action={
          !loading && favorites.length > 0 ? (
            <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={cn('p-2 rounded-lg transition-all', viewMode === 'grid' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:text-slate-700')}
                title="Grid view"
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn('p-2 rounded-lg transition-all', viewMode === 'list' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:text-slate-700')}
                title="List view"
              >
                <List size={16} />
              </button>
            </div>
          ) : undefined
        }
      />

      {loading ? (
        <FavoriteSkeleton viewMode={viewMode} />
      ) : favorites.length === 0 ? (
        <EmptyState
          icon={HeartOff}
          title="Your wishlist is empty"
          description="Click the heart icon on any listing to save it here for quick access."
          actionLabel="Browse Listings"
          onAction={() => window.location.assign(storefrontExploreUrl())}
          iconBg="bg-rose-50"
          iconColor="text-rose-400"
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 font-medium">
              <span className="font-black text-slate-900">{favorites.length}</span>{' '}
              {favorites.length === 1 ? 'listing' : 'listings'} saved
            </p>
          </div>

          <div className={cn('grid gap-5', viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1')}>
            <AnimatePresence mode="popLayout">
              {favorites.map((fav, i) => (
                <ListingCard
                  key={fav.id}
                  item={fav}
                  module={fav.module}
                  viewMode={viewMode}
                  index={i}
                  onToggleFavorite={handleRemove}
                  onAction={(item) => window.location.assign(storefrontListingUrl(item.id, item.module))}
                />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
