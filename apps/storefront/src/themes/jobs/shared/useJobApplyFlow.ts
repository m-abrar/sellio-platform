'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { submitJobApplication } from '@/themes/jobs/shared/submit-job-application';

type ApplyForm = {
  name: string;
  email: string;
  portfolio?: string;
  note?: string;
};

export function useJobApplyFlow(slug: string, hookOptions?: { onSuccess?: (applicationId: number | string) => void }) {
  const { user, login, register } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authPassword, setAuthPassword] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<number | string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleAuthSubmit = async (form: ApplyForm) => {
    if (!form.name || !form.email || !authPassword) {
      setFormError('Enter your name, email, and password to continue.');
      return;
    }

    setAuthBusy(true);
    setFormError(null);

    try {
      if (authMode === 'login') {
        await login(form.email, authPassword);
      } else {
        await register(form.name, form.email, authPassword);
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      setFormError(axiosError.response?.data?.message ?? 'Authentication failed.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleApplySubmit = async (
    form: ApplyForm,
    options: {
      useFallback: boolean;
      storageKey: string;
      jobId: number;
      jobTitle?: string;
      companyName?: string;
    },
  ) => {
    if (!form.name || !form.email) {
      setFormError('Please enter your name and email to apply.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    const coverLetter = form.note?.trim() || 'Application submitted via Sellio storefront.';
    const result = await submitJobApplication(
      {
        slug,
        useFallback: options.useFallback,
        storageKey: options.storageKey,
        coverLetter,
        portfolioUrl: form.portfolio?.trim() || undefined,
        demoRecord: {
          id: Date.now(),
          job_id: options.jobId,
          job_title: options.jobTitle,
          company: options.companyName,
          candidate_name: form.name,
          candidate_email: form.email,
          portfolio: form.portfolio,
          cover_note: form.note,
          submitted_at: new Date().toISOString(),
        },
      },
      Boolean(user),
    );

    setIsSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
      return result;
    }

    setApplicationId(result.applicationId);
    setIsSubmitted(true);
    hookOptions?.onSuccess?.(result.applicationId);
    return result;
  };

  return {
    user,
    authMode,
    setAuthMode,
    authPassword,
    setAuthPassword,
    authBusy,
    isSubmitting,
    applicationId,
    isSubmitted,
    setIsSubmitted,
    setApplicationId,
    formError,
    setFormError,
    handleAuthSubmit,
    handleApplySubmit,
  };
}
