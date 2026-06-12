export type ServiceConsultationSnapshot = {
  id: number | string;
  serviceId: number;
  serviceTitle: string;
  serviceSlug: string;
  contactName: string;
  contactInfo?: string;
  preferredDate?: string;
  requirements?: string;
  topic?: string;
  status?: string;
  demo?: boolean;
};

const storageKey = (id: number | string) => `sellio_service_consultation_${id}`;

export function saveServiceConsultationSnapshot(snapshot: ServiceConsultationSnapshot): void {
  try {
    sessionStorage.setItem(storageKey(snapshot.id), JSON.stringify(snapshot));
  } catch (error) {
    console.error('Failed to persist consultation snapshot:', error);
  }
}

export function readServiceConsultationSnapshot(
  id: number | string,
): ServiceConsultationSnapshot | null {
  try {
    const raw = sessionStorage.getItem(storageKey(id));
    return raw ? (JSON.parse(raw) as ServiceConsultationSnapshot) : null;
  } catch {
    return null;
  }
}

export function redirectToServiceConsultationConfirmation(
  themeLink: (path?: string) => string,
  consultationId: number | string,
): void {
  window.location.assign(themeLink(`/consultation/confirmation/${consultationId}`));
}

export function formatConsultationDate(value?: string | null): string {
  if (!value) {
    return 'Flexible / to be confirmed';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
