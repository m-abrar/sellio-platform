import { api } from '@/lib/storefront-api';

export type JobApplicationInput = {
  slug: string;
  useFallback: boolean;
  storageKey: string;
  coverLetter: string;
  portfolioUrl?: string;
  demoRecord: Record<string, unknown>;
};

export type JobApplicationResult =
  | { ok: true; applicationId: number | string }
  | { ok: false; error: string; requiresAuth?: boolean };

export async function submitJobApplication(
  input: JobApplicationInput,
  isAuthenticated: boolean,
): Promise<JobApplicationResult> {
  if (input.useFallback) {
    try {
      const existing = localStorage.getItem(input.storageKey);
      const list = existing ? JSON.parse(existing) : [];
      list.push(input.demoRecord);
      localStorage.setItem(input.storageKey, JSON.stringify(list));
    } catch (storageError) {
      console.error('LocalStorage write failed:', storageError);
    }

    const applicationId =
      (input.demoRecord as { id?: number | string }).id ?? Date.now();

    return { ok: true, applicationId };
  }

  if (!isAuthenticated) {
    return { ok: false, error: 'Sign in to submit your application.', requiresAuth: true };
  }

  try {
    const application = await api.createJobApplication(input.slug, {
      cover_letter: input.coverLetter,
      portfolio_url: input.portfolioUrl,
    });

    return { ok: true, applicationId: application.id };
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };

    return {
      ok: false,
      error:
        axiosError.response?.data?.message ??
        'Failed to submit application. Please try again.',
    };
  }
}
