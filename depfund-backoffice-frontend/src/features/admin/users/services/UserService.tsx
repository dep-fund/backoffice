import { get, post, patch, del } from '../../../../shared/services/httpClient';
import type {
  StandardUserRegisterRequest,
  StandardUserUpdateRequest,
  StandardUserChangePasswordRequest,
  StandardUserResponse,
  PaginatedResponse,
  AdminUserResponse,
} from '../../../../shared/types/api.types';

// ----- Usuario estándar -----

// Registro → POST /users/register  (sin auth)
export async function registerUser(
  data: StandardUserRegisterRequest,
): Promise<StandardUserResponse> {
  return post<StandardUserRegisterRequest, StandardUserResponse>(
    '/users/register',
    data,
    false,
  );
}

// Perfil propio → GET /users/me
export async function getMe(): Promise<StandardUserResponse> {
  return get<StandardUserResponse>('/users/me');
}

// Actualizar perfil → PATCH /users/me
export async function updateMe(
  data: StandardUserUpdateRequest,
): Promise<StandardUserResponse> {
  return patch<StandardUserUpdateRequest, StandardUserResponse>('/users/me', data);
}

// Cambiar contraseña → POST /users/me/change-password  (con auth)
export async function changePassword(
  data: StandardUserChangePasswordRequest,
): Promise<void> {
  return post<StandardUserChangePasswordRequest, void>(
    '/users/me/change-password',
    data,
    true, // requiere auth
  );
}

// Eliminar cuenta → DELETE /users/me
export async function deleteMe(): Promise<void> {
  return del<void>('/users/me');
}

// ----- Endpoints de administrador sobre usuarios estándar -----

// Listar usuarios → GET /admin/users/users
export async function listUsers(
  page = 1,
  pageSize = 10,
): Promise<PaginatedResponse<StandardUserResponse>> {
  return get<PaginatedResponse<StandardUserResponse>>(
    `/admin/users/users?page=${page}&page_size=${pageSize}`,
  );
}

// Perfil propio del admin → GET /admin/users/me
export async function getAdminMe(): Promise<AdminUserResponse> {
  return get<AdminUserResponse>('/admin/users/me');
}

// Obtener usuario por ID (ADMIN)
// GET /admin/users/{id}
//export async function getUserById(
//  id: string,
//): Promise<StandardUserResponse> {
//  return get<StandardUserResponse>(`/admin/users/${id}`);
//}
