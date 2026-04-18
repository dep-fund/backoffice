import { post } from '../../../shared/services/httpClient';
import type {
  LoginRequest,
  TokenResponse,
} from '../../../shared/types/api.types';

// Login de usuario estándar → POST /auth/login
export async function loginUser(credentials: LoginRequest): Promise<TokenResponse> {
  return post<LoginRequest, TokenResponse>('/auth/login', credentials, false);
}

// Login de administrador → POST /admin/auth/login
export async function loginAdmin(credentials: LoginRequest): Promise<TokenResponse> {
  return post<LoginRequest, TokenResponse>('/admin/auth/login', credentials, false);
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