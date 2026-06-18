import { useEffect } from 'react';
import { connectEcho, disconnectEcho } from '../lib/echo';
import { useAuth } from '../context/AuthContext';
import { getToken } from '../lib/authStorage';
import { API_BASE_URL } from '../config/api';

export function useEchoClient(): void {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      disconnectEcho();
      return;
    }

    if (!getToken()) return;

    connectEcho(user.id, getToken, API_BASE_URL);

    return () => { disconnectEcho(); };
  }, [isAuthenticated, user?.id]);
}
