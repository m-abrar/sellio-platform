import { api } from '@/lib/storefront-api';

export type ClassifiedInquiryInput = {
  slug: string;
  fullName: string;
  email: string;
  phone?: string;
  message?: string;
  offerPrice?: string;
  useFallback?: boolean;
  storageKey?: string;
  demoOrderData?: Record<string, unknown>;
};

export type ClassifiedInquiryResult =
  | { ok: true; inquiryId: number | string; summary: Record<string, string> }
  | { ok: false; error: string };

export async function submitClassifiedInquiry(
  input: ClassifiedInquiryInput,
): Promise<ClassifiedInquiryResult> {
  if (input.useFallback && input.storageKey && input.demoOrderData) {
    try {
      const existing = localStorage.getItem(input.storageKey);
      const list = existing ? JSON.parse(existing) : [];
      list.push(input.demoOrderData);
      localStorage.setItem(input.storageKey, JSON.stringify(list));
    } catch (storageError) {
      console.error('LocalStorage write failed:', storageError);
    }

    const orderId = String(
      (input.demoOrderData as { orderId?: string }).orderId ?? Date.now(),
    );

    return {
      ok: true,
      inquiryId: orderId,
      summary: {
        orderId,
        buyerName: input.fullName,
        offerPrice: input.offerPrice ?? '',
      },
    };
  }

  try {
    const inquiry = await api.createClassifiedInquiry(input.slug, {
      full_name: input.fullName.trim(),
      email: input.email.trim(),
      phone: input.phone?.trim() || undefined,
      message: input.message?.trim() || undefined,
      offer_price: input.offerPrice?.trim() || undefined,
    });

    return {
      ok: true,
      inquiryId: inquiry.id,
      summary: {
        orderId: String(inquiry.id),
        buyerName: input.fullName,
        offerPrice: input.offerPrice ?? '',
      },
    };
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };

    return {
      ok: false,
      error:
        axiosError.response?.data?.message ?? 'Failed to send inquiry. Please try again.',
    };
  }
}
