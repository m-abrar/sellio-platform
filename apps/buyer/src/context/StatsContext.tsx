import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchUserStats } from '../api/statsApi';
import { getStoredToken } from '../api/apiClient';
import { useUser } from './UserContext';

interface Stats {
  favoritesCount: number;
  bookingsCount: number;
  messagesCount: number;
  notificationCount: number;
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

const INITIAL_STATS: Stats = {
  favoritesCount: 0,
  bookingsCount: 0,
  messagesCount: 0,
  notificationCount: 0,
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
};

interface StatsContextType {
  stats: Stats;
  isLoading: boolean;
  hasLoaded: boolean;
  refreshStats: () => Promise<void>;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useUser();
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const refreshStats = useCallback(async () => {
    if (!getStoredToken()) {
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchUserStats();
      setStats(data);
      setHasLoaded(true);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setHasLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (isAuthenticated) {
      void refreshStats();
    } else {
      setStats(INITIAL_STATS);
      setHasLoaded(false);
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated, refreshStats]);

  return (
    <StatsContext.Provider value={{ stats, isLoading, hasLoaded, refreshStats }}>
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
