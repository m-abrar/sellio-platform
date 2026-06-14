const VEHICLE_INQUIRY_SNAPSHOT_KEY = 'sellio_vehicle_inquiry_snapshot';

export interface VehicleInquirySnapshot {
  id: number | string;
  vehicleId: number | string;
  vehicleTitle: string;
  vehicleSlug?: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  message?: string;
  status: string;
}

export function saveVehicleInquirySnapshot(snapshot: VehicleInquirySnapshot): void {
  try {
    sessionStorage.setItem(VEHICLE_INQUIRY_SNAPSHOT_KEY, JSON.stringify(snapshot));
  } catch { /* ignore */ }
}

export function readVehicleInquirySnapshot(inquiryId?: number | string): VehicleInquirySnapshot | null {
  try {
    const raw = sessionStorage.getItem(VEHICLE_INQUIRY_SNAPSHOT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as VehicleInquirySnapshot;
    if (inquiryId != null && String(parsed.id) !== String(inquiryId)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function redirectToVehicleInquiryConfirmation(
  themeLink: (path?: string) => string,
  inquiryId: number | string,
): void {
  window.location.assign(themeLink(`/inquiry/confirmation/${inquiryId}`));
}
