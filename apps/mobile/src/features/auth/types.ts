export interface AuthUser {
  id: number;
  name: string;
  username?: string | null;
  email?: string | null;
  phone?: string | null;
  avatar?: string | null;
  avatar_url?: string | null;
  location_id?: number | null;
  location_title?: string | null;
  settings?: Record<string, unknown>;
  wallet_balance?: number | string;
  roles?: string[];
  is_buyer?: boolean;
  is_partner?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  access_token?: string;
  token?: string;
  user?: AuthUser;
}

export interface BuyerRegistrationInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
  passwordConfirmation: string;
}
