import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchUserStats } from '../api/statsApi';

interface Stats {
  favoritesCount: number;
  bookingsCount: number;
  messagesCount: number;
  appsCount: number;
  appointmentsCount: number;
  quotesCount: number;
  inquiriesCount: number;
  classifiedsActivityCount: number;
  reviewsCount: number;
  propertiesCount: number;
  autosCount: number;
  eventsCount: number;
  servicesCount: number;
  jobsCount: number;
  classifiedsCount: number;
  productsCount: number;
  totalItemsCount: number;
}

interface StatsContextType {
  stats: Stats;
  refreshStats: () => Promise<void>;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<Stats>({
    favoritesCount: 0,
    bookingsCount: 0,
    messagesCount: 0,
    appsCount: 0,
    appointmentsCount: 0,
    quotesCount: 0,
    inquiriesCount: 0,
    classifiedsActivityCount: 0,
    reviewsCount: 0,
    propertiesCount: 0,
    autosCount: 0,
    eventsCount: 0,
    servicesCount: 0,
    jobsCount: 0,
    classifiedsCount: 0,
    productsCount: 0,
    totalItemsCount: 0,
  });

  const refreshStats = useCallback(async () => {
    try {
      const data = await fetchUserStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return (
    <StatsContext.Provider value={{ stats, refreshStats }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}
