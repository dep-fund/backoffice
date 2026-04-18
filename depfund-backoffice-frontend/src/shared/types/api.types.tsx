// ============================================================
// Tipos derivados del contrato OpenAPI de DepFund API v0.1.0
// ============================================================

// ----- Auth -----

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string; // "Bearer"
}

// ----- Standard User -----

export interface StandardUserRegisterRequest {
  username: string;
  name: string;
  last_name: string;
  birthdate?: string | null; // formato: "YYYY-MM-DD"
  email: string;
  password: string;
  image?: string | null;
}

export interface StandardUserUpdateRequest {
  username?: string | null;
  name?: string | null;
  last_name?: string | null;
  birthdate?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface StandardUserChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface StandardUserResponse {
  id: string;            // UUID
  username: string;
  name: string;
  last_name: string;
  birthdate: string | null;
  email: string;
  image: string | null;
  activated: boolean;
  blocked: boolean;
  created_at: string;   // ISO datetime
  updated_at: string;
}

// ----- Admin User -----

export interface AdminUserCreateRequest {
  admin_secret_key: string;
  username: string;
  name: string;
  last_name: string;
  email: string;
  password: string;
  image?: string | null;
}

export interface AdminUserUpdateRequest {
  username?: string | null;
  name?: string | null;
  last_name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface AdminUserChangePasswordRequest {
  old_password: string;
  new_password: string;
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

// ----- Paginación -----

export interface PaginatedResponse<T> {
  total: number;
  total_pages: number | null;
  page: number;
  page_size: number;
  results: T[];
}

// ----- Errores -----

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: unknown;
  ctx?: Record<string, unknown>;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

// ----- Error de API genérico (para manejo en servicios) -----

export interface ApiError {
  status: number;
  message: string;
  detail?: ValidationError[];
}