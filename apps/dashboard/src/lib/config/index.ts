export const SHARED_CONFIG = {
  api: {
    timeout: 10000,
    retryCount: 3,
  },
  ui: {
    defaultTheme: 'light',
    supportedLocales: ['en', 'fr', 'es'],
  },
  verticals: {
    REAL_ESTATE: 'real_estate',
    AUTOMOTIVE: 'automotive',
    ECOMMERCE: 'ecommerce',
    SERVICES: 'services',
    JOBS: 'jobs',
    EVENTS: 'events',
    CLASSIFIEDS: 'classifieds',
  }
} as const;

export type SharedConfig = typeof SHARED_CONFIG;
