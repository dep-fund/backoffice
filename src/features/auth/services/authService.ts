import { apiClient } from '../../../shared/utils/apiClient';
import { ENDPOINTS } from '../../../shared/constants/api';
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  AdminUserResponse,
} from '../types/auth.types';

export const loginAdmin = (data: LoginRequest): Promise<TokenResponse> =>
  apiClient<TokenResponse>(ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const registerAdmin = (data: RegisterRequest): Promise<AdminUserResponse> =>
  apiClient<AdminUserResponse>(ENDPOINTS.ADMIN.CREATE, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const getMe = (token: string): Promise<AdminUserResponse> =>
  apiClient<AdminUserResponse>(ENDPOINTS.ADMIN.ME, {}, token);
