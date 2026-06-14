'use client';

import JobApplicationConfirmationPage from '@/themes/jobs/shared/JobApplicationConfirmationPage';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';

interface ApplicationConfirmationPageProps {
  applicationId: number | string;
}

export default function ApplicationConfirmationPage({ applicationId }: ApplicationConfirmationPageProps) {
  const themeLink = useJobsThemeLink();
  return <JobApplicationConfirmationPage applicationId={applicationId} classPrefix="gr" themeLink={themeLink} />;
}
