import { api } from '@sellio/api-client';
import { readAuthToken } from '@/lib/auth-storage';

function syncAuthToken(): void {
  api.setAuthToken(readAuthToken());
}

if (typeof window !== 'undefined') {
  syncAuthToken();
  window.addEventListener('authUpdated', syncAuthToken);
}

export { api };
