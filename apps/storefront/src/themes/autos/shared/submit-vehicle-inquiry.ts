import { api } from '@/lib/storefront-api';

export type VehicleInquiryInput = {
  vehicleId: number;
  /** When true, save to localStorage only if the API request fails (e.g. preview/offline). */
  useFallback: boolean;
  /** Resolve a live database id when the UI is showing demo catalogue data. */
  vehicleSlug?: string;
  storageKey: string;
  fullName: string;
  email: string;
  phone?: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: 'AM' | 'PM' | 'Anytime';
  /** Required when useFallback is true — stored in localStorage if the API is unreachable. */
  demoRecord?: Record<string, unknown>;
};

export type VehicleInquiryResult =
  | { ok: true; inquiryId: number | string; savedOffline?: boolean }
  | { ok: false; error: string };

async function resolveLiveVehicleId(
  vehicleId: number,
  vehicleSlug?: string,
): Promise<number> {
  if (!vehicleSlug) {
    return vehicleId;
  }

  try {
    const response = await api.getVehicleDetails(vehicleSlug);
    if (response?.data?.id) {
      return response.data.id;
    }
  } catch {
    // Demo catalogue ids may not exist — keep the provided id as fallback.
  }

  return vehicleId;
}

function saveOfflineInquiry(
  storageKey: string,
  demoRecord: Record<string, unknown>,
): number | string {
  try {
    const existing = localStorage.getItem(storageKey);
    const list = existing ? JSON.parse(existing) : [];
    list.push(demoRecord);
    localStorage.setItem(storageKey, JSON.stringify(list));
  } catch (storageError) {
    console.error('LocalStorage write failed:', storageError);
  }

  return (
    (demoRecord as { id?: number | string }).id ??
    (demoRecord as { orderId?: string }).orderId ??
    Date.now()
  );
}

export async function submitVehicleInquiry(
  input: VehicleInquiryInput,
): Promise<VehicleInquiryResult> {
  const vehicleId = await resolveLiveVehicleId(input.vehicleId, input.vehicleSlug);

  try {
    const inquiry = await api.createVehicleInquiry(vehicleId, {
      full_name: input.fullName.trim(),
      email: input.email.trim(),
      phone: input.phone?.trim() || undefined,
      message: input.message?.trim() || undefined,
      preferred_date: input.preferredDate || undefined,
      preferred_time: input.preferredTime,
    });

    return { ok: true, inquiryId: inquiry.id, savedOffline: false };
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    const apiMessage =
      axiosError.response?.data?.message ?? 'Failed to send inquiry. Please try again.';

    if (input.useFallback && input.demoRecord) {
      const inquiryId = saveOfflineInquiry(input.storageKey, input.demoRecord);
      return { ok: true, inquiryId, savedOffline: true };
    }

    return { ok: false, error: apiMessage };
  }
}
