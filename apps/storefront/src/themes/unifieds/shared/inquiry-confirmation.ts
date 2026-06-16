const INQUIRY_SNAPSHOT_KEY = 'sellio_unified_inquiry_snapshot';

export interface InquirySnapshot {
  id: number | string;
  listingTitle: string;
  contactName: string;
  contactEmail?: string;
  status: string;
}

export function saveInquirySnapshot(snapshot: InquirySnapshot): void {
  try {
    sessionStorage.setItem(INQUIRY_SNAPSHOT_KEY, JSON.stringify(snapshot));
  } catch {
    // ignore storage failures
  }
}

export function readInquirySnapshot(inquiryId?: number | string): InquirySnapshot | null {
  try {
    const raw = sessionStorage.getItem(INQUIRY_SNAPSHOT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as InquirySnapshot;
    if (inquiryId != null && String(parsed.id) !== String(inquiryId)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function redirectToInquiryConfirmation(
  themeLink: (path?: string) => string,
  inquiryId: number | string,
): void {
  window.location.assign(themeLink(`/inquiry/confirmation/${inquiryId}`));
}
