const APPLICATION_SNAPSHOT_KEY = 'sellio_unified_application_snapshot';

export interface ApplicationSnapshot {
  id: number | string;
  jobTitle: string;
  companyName?: string;
  applicantName: string;
  applicantEmail?: string;
  status: string;
}

export function saveApplicationSnapshot(snapshot: ApplicationSnapshot): void {
  try {
    sessionStorage.setItem(APPLICATION_SNAPSHOT_KEY, JSON.stringify(snapshot));
  } catch {
    // ignore storage failures
  }
}

export function readApplicationSnapshot(applicationId?: number | string): ApplicationSnapshot | null {
  try {
    const raw = sessionStorage.getItem(APPLICATION_SNAPSHOT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ApplicationSnapshot;
    if (applicationId != null && String(parsed.id) !== String(applicationId)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function redirectToApplicationConfirmation(
  themeLink: (path?: string) => string,
  applicationId: number | string,
): void {
  window.location.assign(themeLink(`/application/confirmation/${applicationId}`));
}
