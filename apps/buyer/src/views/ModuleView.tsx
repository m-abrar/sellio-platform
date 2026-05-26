import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus,
} from 'lucide-react';
import { ModuleType } from '../types';
import { cn } from '../lib/utils';
import { fetchItems, toggleFavorite } from '../api/itemApi';
import { useStats } from '../context/StatsContext';
import { Button } from '../components/Button';
import { ListingCard } from '../components/ListingCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PageHeader } from '../components/PageHeader';

interface ModuleViewProps {
  module: ModuleType;
}

const MODULE_CONFIG = {
  properties: { title: 'Properties', action: 'Rent / Buy' },
  events: { title: 'Events', action: 'Book Tickets' },
  autos: { title: 'Autos', action: 'Rent Car' },
  services: { title: 'Services', action: 'Book Service' },
  jobs: { title: 'Jobs', action: 'Apply Now' },
  classifieds: { title: 'Classifieds', action: 'Contact Seller' },
  products: { title: 'Products', action: 'Buy Now' },
};

export default function ModuleView({ module }: ModuleViewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { refreshStats } = useStats();
  
  const config = MODULE_CONFIG[module];

  useEffect(() => {
    setLoading(true);
    fetchItems(module)
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [module]);
  
  const filteredData = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleFavorite = async (itemId: string) => {
    try {
      await toggleFavorite(itemId);
      refreshStats();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <PageHeader 
        breadcrumb={config.title}
        title={config.title}
        description={`Explore and manage ${config.title.toLowerCase()} listings.`}
        action={
          <Button leftIcon={<Plus size={20} />}>
            Add New Listing
          </Button>
        }
      />

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-zinc-200 flex flex-col lg:flex-row items-center gap-4 mx-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          <input 
            type="text" 
            placeholder={`Search ${config.title.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-zinc-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-zinc-900 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <Button variant="outline" leftIcon={<Filter size={18} />}>
            Filters
          </Button>
          <div className="h-10 w-px bg-zinc-200 hidden lg:block mx-2" />
          <div className="flex bg-zinc-100 p-1 rounded-2xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-xl transition-all",
                viewMode === 'grid' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-xl transition-all",
                viewMode === 'list' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className={cn(
        "grid gap-6 px-3",
        viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
      )}>
        <AnimatePresence mode="popLayout">
          {filteredData.map((item, i) => (
            <ListingCard 
              key={item.id}
              item={item}
              module={module}
              viewMode={viewMode}
              index={i}
              onToggleFavorite={handleToggleFavorite}
              actionLabel={config.action}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredData.length === 0 && (
        <div className="px-3">
          <EmptyState 
            icon={Search}
            title="No results found"
            description="Try adjusting your search or filters to find what you're looking for."
          />
        </div>
      )}
    </div>
  );
}
