import { api, SellioAPI } from '@sellio/api-client';
import type { ClassifiedInquiryRecord, ServiceConsultationRecord } from '@sellio/types';
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
  getClassifiedInquiry?: (inquiryId: number) => Promise<ClassifiedInquiryRecord>;
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

if (typeof apiClient.getClassifiedInquiry !== 'function') {
  apiClient.getClassifiedInquiry = async (inquiryId: number) => {
    const response = await fetch(`${resolveApiBaseUrl()}/v1/classifieds/inquiries/${inquiryId}`, {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(readAuthToken() ? { Authorization: `Bearer ${readAuthToken()}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error('Unable to load inquiry details.');
    }

    const payload = (await response.json()) as { data?: ClassifiedInquiryRecord };
    if (!payload.data) {
      throw new Error('Inquiry not found.');
    }

    return payload.data;
  };
}

function dashboardUserUrl(path: string): string {
  return `${resolveApiBaseUrl()}/dashboard/user${path}`;
}

function authHeaders(): Record<string, string> {
  const token = readAuthToken();
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface ChatMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  body: string;
  created_at: string;
  read_at?: string | null;
}

export interface StartChatResult {
  conversation_id: number;
  messages: ChatMessage[];
  partner: { id: number; name: string; avatar: string | null };
}

export async function startOrFindConversation(
  vertical: string,
  listingId: number,
): Promise<StartChatResult> {
  const res = await fetch(dashboardUserUrl('/messages/start'), {
    method: 'POST',
    credentials: 'include',
    headers: authHeaders(),
    body: JSON.stringify({ vertical, listing_id: listingId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(err.message ?? 'Could not open conversation.');
  }

  const payload = await res.json() as { data: StartChatResult };
  return payload.data;
}

export async function sendChatMessage(
  conversationId: number,
  body: string,
): Promise<ChatMessage> {
  const res = await fetch(dashboardUserUrl(`/messages/${conversationId}`), {
    method: 'POST',
    credentials: 'include',
    headers: authHeaders(),
    body: JSON.stringify({ body }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(err.message ?? 'Failed to send message.');
  }

  const payload = await res.json() as { data: { message: ChatMessage } };
  return payload.data.message;
}

export async function fetchChatMessages(conversationId: number): Promise<ChatMessage[]> {
  const res = await fetch(dashboardUserUrl(`/messages/${conversationId}`), {
    credentials: 'include',
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error('Failed to load messages.');

  const payload = await res.json() as { data: { messages: ChatMessage[] } };
  return payload.data.messages ?? [];
}

export { api };
