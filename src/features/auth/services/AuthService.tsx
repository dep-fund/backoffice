import { post } from '../../../shared/services/httpClient';
import type {
  LoginRequest,
  TokenResponse,
  ResetPasswordRequest,
  ForgotPasswordRequest,
} from '../../../shared/types/api.types';

// Login de usuario estándar → POST /auth/login
export async function loginUser(credentials: LoginRequest): Promise<TokenResponse> {
  return post<LoginRequest, TokenResponse>('/auth/login', credentials, false);
}

// Login de administrador → POST /admin/auth/login
export async function loginAdmin(credentials: LoginRequest): Promise<TokenResponse> {
  return post<LoginRequest, TokenResponse>('/admin/auth/login', credentials, false);
}

// Restablecer contraseña → POST /auth/reset-password
export async function resetPassword(data: ResetPasswordRequest): Promise<void> {
  return post<ResetPasswordRequest, void>('/auth/reset-password', data, false);
}

// Olvidó contraseña (enviar mail) → POST /auth/forgot-password
export async function forgotPassword(data: ForgotPasswordRequest): Promise<void> {
  return post<ForgotPasswordRequest, void>('/auth/forgot-password', data, false);
}

// Guarda el token en sessionStorage después de un login exitoso
export function saveToken(token: string): void {
  sessionStorage.setItem('access_token', token);
}

// Elimina el token (logout)
export function logout(): void {
  sessionStorage.removeItem('access_token');
}

// Devuelve true si hay un token guardado
export function isAuthenticated(): boolean {
  return sessionStorage.getItem('access_token') !== null;
}