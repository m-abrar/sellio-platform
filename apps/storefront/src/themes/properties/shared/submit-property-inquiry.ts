import { api } from '@/lib/storefront-api';

export type PropertyInquiryInput = {
  propertyId: number;
  useFallback: boolean;
  storageKey: string;
  fullName: string;
  email: string;
  phone?: string;
  message?: string;
  checkIn?: string;
  checkOut?: string;
  demoRecord: Record<string, unknown>;
};

export type PropertyInquiryResult =
  | { ok: true; leadId: number | string }
  | { ok: false; error: string };

export async function submitPropertyInquiry(
  input: PropertyInquiryInput,
): Promise<PropertyInquiryResult> {
  if (input.useFallback) {
    try {
      const existing = localStorage.getItem(input.storageKey);
      const list = existing ? JSON.parse(existing) : [];
      list.push(input.demoRecord);
      localStorage.setItem(input.storageKey, JSON.stringify(list));
    } catch (storageError) {
      console.error('LocalStorage write failed:', storageError);
    }

    const leadId =
      (input.demoRecord as { id?: number | string }).id ??
      (input.demoRecord as { orderId?: string }).orderId ??
      Date.now();

    return { ok: true, leadId };
  }

  try {
    const lead = await api.createPropertyInquiry(input.propertyId, {
      full_name: input.fullName.trim(),
      email: input.email.trim(),
      phone: input.phone?.trim() || undefined,
      message: input.message?.trim() || undefined,
      check_in: input.checkIn || undefined,
      check_out: input.checkOut || undefined,
    });

    return { ok: true, leadId: lead.id };
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };

    return {
      ok: false,
      error:
        axiosError.response?.data?.message ?? 'Failed to send inquiry. Please try again.',
    };
  }
}
