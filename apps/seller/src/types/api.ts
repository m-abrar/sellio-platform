export interface LaravelResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
  errors?: Record<string, string[]> | null;
}

export interface AuthUser {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  username?: string;
  roles?: string[];
  avatar_url?: string | null;
}

export interface LoginResponseData {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export interface RefreshTokenResponseData {
  access_token: string;
  token_type: string;
}
