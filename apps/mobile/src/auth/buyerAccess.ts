import { AuthUser } from '../features/auth/types';

export const SELLER_ONLY_MOBILE_MESSAGE =
  'This mobile app currently supports buyer accounts only. Please use the seller portal for seller tools.';

export function supportsBuyerMobile(user: AuthUser) {
  const roles = (user.roles || []).map((role) => role.trim().toLowerCase());

  if (user.is_buyer === true || roles.includes('user') || roles.includes('buyer')) {
    return true;
  }

  if (user.is_buyer === false || user.is_partner === true || roles.includes('partner') || roles.includes('seller')) {
    return false;
  }

  // Preserve access for legacy sessions until the API returns an explicit role or identity flag.
  return true;
}
