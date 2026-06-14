'use client';
import ServiceConsultationConfirmationPage from '@/themes/services/shared/ServiceConsultationConfirmationPage';
import { useServicesThemeLink } from '@/themes/services/shared/useServicesThemeLink';

interface ConsultationConfirmationPageProps {
  consultationId: number | string;
}

export default function ConsultationConfirmationPage({
  consultationId,
}: ConsultationConfirmationPageProps) {
  const themeLink = useServicesThemeLink();

  return (
    <ServiceConsultationConfirmationPage
      consultationId={consultationId}
      classPrefix="crtv"
      themeLink={themeLink}
    />
  );
}
