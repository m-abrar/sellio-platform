import { api } from '@/lib/storefront-api';

export type VehicleInquiryInput = {
  vehicleId: number;
  useFallback: boolean;
  storageKey: string;
  fullName: string;
  email: string;
  phone?: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: 'AM' | 'PM' | 'Anytime';
  demoRecord: Record<string, unknown>;
};

export type VehicleInquiryResult =
  | { ok: true; inquiryId: number | string }
  | { ok: false; error: string };

export async function submitVehicleInquiry(
  input: VehicleInquiryInput,
): Promise<VehicleInquiryResult> {
  if (input.useFallback) {
    try {
      const existing = localStorage.getItem(input.storageKey);
      const list = existing ? JSON.parse(existing) : [];
      list.push(input.demoRecord);
      localStorage.setItem(input.storageKey, JSON.stringify(list));
    } catch (storageError) {
      console.error('LocalStorage write failed:', storageError);
    }

    const inquiryId =
      (input.demoRecord as { id?: number | string }).id ??
      (input.demoRecord as { orderId?: string }).orderId ??
      Date.now();

    return { ok: true, inquiryId };
  }

  try {
    const inquiry = await api.createVehicleInquiry(input.vehicleId, {
      full_name: input.fullName.trim(),
      email: input.email.trim(),
      phone: input.phone?.trim() || undefined,
      message: input.message?.trim() || undefined,
      preferred_date: input.preferredDate || undefined,
      preferred_time: input.preferredTime,
    });

    return { ok: true, inquiryId: inquiry.id };
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };

    return {
      ok: false,
      error:
        axiosError.response?.data?.message ?? 'Failed to send inquiry. Please try again.',
    };
  }
}
