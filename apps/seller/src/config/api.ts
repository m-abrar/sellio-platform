import { resolveApiBaseUrl } from './resolveApiBaseUrl';

// Production buyers edit public/config.js — no rebuild required.
export const API_BASE_URL = resolveApiBaseUrl();

export const AUTH_BASE = `${API_BASE_URL}/v1/auth`;
export const PARTNER_BASE = `${API_BASE_URL}/dashboard/partner`;

export const ALLOWED_SELLER_ROLES = ['partner', 'admin', 'super-admin'] as const;
export type SellerRole = (typeof ALLOWED_SELLER_ROLES)[number];
