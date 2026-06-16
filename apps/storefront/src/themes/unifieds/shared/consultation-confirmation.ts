const CONSULTATION_SNAPSHOT_KEY = 'sellio_unified_consultation_snapshot';

export interface ConsultationSnapshot {
  id: number | string;
  serviceTitle: string;
  contactName: string;
  contactEmail?: string;
  status: string;
}

export function saveConsultationSnapshot(snapshot: ConsultationSnapshot): void {
  try {
    sessionStorage.setItem(CONSULTATION_SNAPSHOT_KEY, JSON.stringify(snapshot));
  } catch {
    // ignore storage failures
  }
}

export function readConsultationSnapshot(consultationId?: number | string): ConsultationSnapshot | null {
  try {
    const raw = sessionStorage.getItem(CONSULTATION_SNAPSHOT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsultationSnapshot;
    if (consultationId != null && String(parsed.id) !== String(consultationId)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function redirectToConsultationConfirmation(
  themeLink: (path?: string) => string,
  consultationId: number | string,
): void {
  window.location.assign(themeLink(`/consultation/confirmation/${consultationId}`));
}
