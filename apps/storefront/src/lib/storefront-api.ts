import { api, SellioAPI } from '@sellio/api-client';
import type { ServiceConsultationRecord } from '@sellio/types';
import { readAuthToken } from '@/lib/auth-storage';

function syncAuthToken(): void {
  api.setAuthToken(readAuthToken());
}

if (typeof window !== 'undefined') {
  syncAuthToken();
  window.addEventListener('authUpdated', syncAuthToken);
}

type ApiClientWithConsultation = SellioAPI & {
  getServiceConsultation?: (consultationId: number) => Promise<ServiceConsultationRecord>;
};

function resolveApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    let host = window.location.hostname;
    if (host === 'localhost') {
      host = '127.0.0.1';
    }
    return `http://${host}:8000/api`;
  }

  return 'http://127.0.0.1:8000/api';
}

const apiClient = api as ApiClientWithConsultation;

if (typeof apiClient.getServiceConsultation !== 'function') {
  apiClient.getServiceConsultation = async (consultationId: number) => {
    const response = await fetch(`${resolveApiBaseUrl()}/v1/services/consultations/${consultationId}`, {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(readAuthToken() ? { Authorization: `Bearer ${readAuthToken()}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error('Unable to load consultation details.');
    }

    const payload = (await response.json()) as { data?: ServiceConsultationRecord };
    if (!payload.data) {
      throw new Error('Consultation not found.');
    }

    return payload.data;
  };
}

export { api };
