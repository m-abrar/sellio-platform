// API Configuration
// To switch backends, update VITE_API_URL in your .env file
// - For Node.js (server.ts): Use "/api" (relative) or "http://localhost:3000/api"
// - For Laravel: Use your Laravel URL, e.g., "http://localhost:8000/api"

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  // If VITE_API_URL is defined, use it. 
  // Otherwise, default to the local Node.js server path
  if (envUrl) return envUrl;
  
  return "/api";
};

export const API_BASE_URL = getApiBaseUrl();

// Helper to check which backend is active (useful for debugging)
export const IS_EXTERNAL_BACKEND = API_BASE_URL.startsWith('http');
