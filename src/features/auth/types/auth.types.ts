export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  admin_secret_key: string;
  username: string;
  name: string;
  last_name: string;
  email: string;
  password: string;
  image?: string | null;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface AdminUserResponse {
  id: string;
  username: string;
  name: string;
  last_name: string;
  email: string;
  image: string | null;
  activated: boolean;
  blocked: boolean;
  created_at: string;
  updated_at: string;
}
