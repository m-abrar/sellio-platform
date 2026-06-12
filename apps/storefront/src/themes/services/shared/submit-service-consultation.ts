import { api } from '@/lib/storefront-api';
import { parseServiceContactInfo } from '@/themes/services/shared/service-utils';

export type ServiceConsultationInput = {
  serviceId: number;
  useFallback: boolean;
  storageKey: string;
  contactName: string;
  contactInfo: string;
  preferredDate?: string;
  requirements?: string;
  topic?: string;
  demoRecord: Record<string, unknown>;
};

export type ServiceConsultationResult =
  | { ok: true; consultationId: number | string }
  | { ok: false; error: string };

export async function submitServiceConsultation(
  input: ServiceConsultationInput,
): Promise<ServiceConsultationResult> {
  if (input.useFallback) {
    try {
      const existing = localStorage.getItem(input.storageKey);
      const list = existing ? JSON.parse(existing) : [];
      list.push(input.demoRecord);
      localStorage.setItem(input.storageKey, JSON.stringify(list));
    } catch (storageError) {
      console.error('LocalStorage write failed:', storageError);
    }

    const consultationId =
      (input.demoRecord as { id?: number | string }).id ?? Date.now();

    return { ok: true, consultationId };
  }

  try {
    const contact = parseServiceContactInfo(input.contactName, input.contactInfo);
    const consultation = await api.createServiceConsultation(input.serviceId, {
      ...contact,
      preferred_date: input.preferredDate || undefined,
      requirements: input.requirements || undefined,
      topic: input.topic,
    });

    return { ok: true, consultationId: consultation.id };
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };

    return {
      ok: false,
      error:
        axiosError.response?.data?.message ??
        'Failed to send booking request. Please try again.',
    };
  }
}
