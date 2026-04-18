import { del, get, post } from "../../../shared/services/httpClient";
import type { PaginatedResponse } from "../../../shared/types/api.types";

// Definimos la interfaz localmente o importala de api.types si ya existe
export interface RoleResponse {
  id: string;
  type: string;
}

/**
 * Lista los roles de forma paginada
 * GET /admin/role?page=1&page_size=10
 */
export async function listRoles(
  page = 1,
  pageSize = 10
): Promise<PaginatedResponse<RoleResponse>> {
  return get<PaginatedResponse<RoleResponse>>(
    `/admin/role?page=${page}&page_size=${pageSize}`
  );
}

/**
 * Crea un nuevo rol
 * POST /admin/role
 */
export async function createRole(roleType: string): Promise<RoleResponse> {
  return post<{ type: string }, RoleResponse>(
    '/admin/role',
    { type: roleType.toUpperCase() },
    true // requiere auth
  );
}

/**
 * Elimina un rol
 * DELETE /admin/role?role_type=...
 */
export async function deleteRole(roleType: string): Promise<void> {
  // Según el formato común de FastAPI, se pasa como query param
  return del<void>(`/admin/role?role_type=${roleType}`);
}