export type ClassifiedInquirySnapshot = {
  id: number | string;
  listingId: number;
  listingTitle: string;
  listingSlug: string;
  contactName: string;
  contactEmail?: string;
  offerPrice?: string;
  message?: string;
  status?: string;
};

const storageKey = (id: number | string) => `sellio_classified_inquiry_${id}`;

export function saveClassifiedInquirySnapshot(snapshot: ClassifiedInquirySnapshot): void {
  try {
    sessionStorage.setItem(storageKey(snapshot.id), JSON.stringify(snapshot));
  } catch (error) {
    console.error('Failed to persist inquiry snapshot:', error);
  }
}

export function readClassifiedInquirySnapshot(
  id: number | string,
): ClassifiedInquirySnapshot | null {
  try {
    const raw = sessionStorage.getItem(storageKey(id));
    return raw ? (JSON.parse(raw) as ClassifiedInquirySnapshot) : null;
  } catch {
    return null;
  }
}

export function redirectToClassifiedInquiryConfirmation(
  themeLink: (path?: string) => string,
  inquiryId: number | string,
): void {
  window.location.assign(themeLink(`/inquiry/confirmation/${inquiryId}`));
}
