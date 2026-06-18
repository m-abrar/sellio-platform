import { useEffect } from 'react';
import { connectEcho, disconnectEcho } from '../lib/echo';
import { useUser } from '../context/UserContext';
import { getStoredToken } from '../api/apiClient';
import { API_BASE_URL } from '../config/api';

export function useEchoClient(): void {
  const { user, isAuthenticated } = useUser();

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      disconnectEcho();
      return;
    }

    if (!getStoredToken()) return;

    connectEcho(user.id, getStoredToken, API_BASE_URL);

    return () => { disconnectEcho(); };
  }, [isAuthenticated, user?.id]);
}
