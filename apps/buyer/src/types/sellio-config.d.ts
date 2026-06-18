export {};

declare global {
  interface Window {
    SELLIO_CONFIG?: {
      apiUrl?: string;
      storefrontUrl?: string;
      basePath?: string;
      pusherKey?: string;
      pusherCluster?: string;
    };
    SELLIO_PANEL_LABEL?: string;
  }
}
