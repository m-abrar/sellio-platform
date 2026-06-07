export {};

declare global {
  interface Window {
    SELLIO_CONFIG?: {
      apiUrl?: string;
    };
  }
}
