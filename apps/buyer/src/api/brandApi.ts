import { apiRequest, publicUrl } from './apiClient';

export interface BrandSettings {
  site_name: string;
  site_favicon: string;
  site_logo: string;
}

/**
 * Fetch dynamic brand settings from the Laravel backend.
 */
export const getBrandSettings = async (): Promise<BrandSettings> => {
  const payload = await apiRequest<any>(
    publicUrl('/brand-settings'),
    { authenticated: false },
  );

  return {
    site_name: payload?.site_name || 'Sellio',
    site_favicon: payload?.site_favicon || '',
    site_logo: payload?.site_logo || '',
  };
};
