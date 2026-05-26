import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { HeartOff } from 'lucide-react';
import { fetchFavorites, toggleFavorite } from '../api/itemApi';
import { useStats } from '../context/StatsContext';
import { ListingCard } from '../components/ListingCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PageHeader } from '../components/PageHeader';
import { storefrontExploreUrl, storefrontListingUrl } from '../config/api';

export default function FavoritesView() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { refreshStats } = useStats();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await fetchFavorites();
      setFavorites(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      await toggleFavorite(itemId);
      setFavorites(favorites.filter(f => f.id !== itemId));
      refreshStats();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <PageHeader 
        breadcrumb="Favorites"
        title="My Saved Listings"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-3">
        <AnimatePresence mode="popLayout">
          {favorites.map((fav, i) => (
            <ListingCard 
              key={fav.id}
              item={fav}
              module={fav.module}
              index={i}
              onToggleFavorite={handleRemove}
              onAction={(item) => window.location.assign(storefrontListingUrl(item.id))}
            />
          ))}
        </AnimatePresence>

        {favorites.length === 0 && (
          <div className="col-span-full">
            <EmptyState 
              icon={HeartOff}
              title="Your wish list is empty"
              description="Click the heart icon on any listing to save it for quick access later."
              actionLabel="Browse Listings"
              onAction={() => window.location.assign(storefrontExploreUrl())}
            />
          </div>
        )}
      </div>
    </div>
  );
}
