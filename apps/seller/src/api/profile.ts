import { apiClient, unwrapData } from '../lib/apiClient';

export interface PartnerProfile {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  company_name?: string | null;
  website_url?: string | null;
  bio?: string | null;
  username?: string | null;
  roles?: string[];
  avatar_url?: string | null;
}

export const getProfile = async () => {
  const response = await apiClient.get('/dashboard/partner/profile/');
  return {
    data: unwrapData<PartnerProfile>(response),
  };
};

export const updateProfile = async (payload: {
  name: string;
  email: string;
  phone_number?: string;
  company_name?: string;
  website_url?: string;
  bio?: string;
}) => {
  const response = await apiClient.patch('/dashboard/partner/profile/', payload);

  return {
    message: response.data.message,
  };
};
