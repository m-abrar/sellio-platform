const trim = (value?: string | null) => value?.trim() ?? '';

/** Build-time env first; production may override via public/config.js (no rebuild). */
export function resolvePusherKey(): string {
  const fromEnv = trim(import.meta.env.VITE_PUSHER_APP_KEY);
  if (fromEnv) return fromEnv;

  if (typeof window !== 'undefined') {
    return trim(window.SELLIO_CONFIG?.pusherKey);
  }

  return '';
}

export function resolvePusherCluster(): string {
  const fromEnv = trim(import.meta.env.VITE_PUSHER_APP_CLUSTER);
  if (fromEnv) return fromEnv;

  if (typeof window !== 'undefined') {
    const fromConfig = trim(window.SELLIO_CONFIG?.pusherCluster);
    if (fromConfig) return fromConfig;
  }

  return 'mt1';
}
