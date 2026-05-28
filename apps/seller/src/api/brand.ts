import { apiClient, unwrapData } from '../lib/apiClient';

export interface BrandSettings {
  site_name: string;
  site_favicon: string;
  site_logo: string;
}

/**
 * Fetch dynamic brand settings from the Laravel backend.
 */
export const getBrandSettings = async (): Promise<BrandSettings> => {
  const response = await apiClient.get('/v1/brand-settings');
  return unwrapData<BrandSettings>(response);
};
