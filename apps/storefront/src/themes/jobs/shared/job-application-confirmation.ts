const JOB_APPLICATION_SNAPSHOT_KEY = 'sellio_job_application_snapshot';

export interface JobApplicationSnapshot {
  id: number | string;
  jobId: number | string;
  jobTitle: string;
  jobSlug?: string;
  applicantName: string;
  applicantEmail?: string;
  coverLetter?: string;
  status: string;
}

export function saveJobApplicationSnapshot(snapshot: JobApplicationSnapshot): void {
  try {
    sessionStorage.setItem(JOB_APPLICATION_SNAPSHOT_KEY, JSON.stringify(snapshot));
  } catch { /* ignore */ }
}

export function readJobApplicationSnapshot(applicationId?: number | string): JobApplicationSnapshot | null {
  try {
    const raw = sessionStorage.getItem(JOB_APPLICATION_SNAPSHOT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as JobApplicationSnapshot;
    if (applicationId != null && String(parsed.id) !== String(applicationId)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function redirectToJobApplicationConfirmation(
  themeLink: (path?: string) => string,
  applicationId: number | string,
): void {
  window.location.assign(themeLink(`/application/confirmation/${applicationId}`));
}
