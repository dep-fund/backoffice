import { del, get, patch, post } from "../../../shared/services/httpClient";
import type { PaginatedResponse } from "../../../shared/types/api.types";

export interface PermissionResponse {
  id: string;
  type: string;
}

export interface RolePermissionResponse {
  role_id: string;
  permission_id: string;
  role: string;
  permission: string;
}

/**
 * Listar permisos paginados
 * GET /admin/permission?page=1&page_size=10
 */
export async function listPermissions(page = 1, pageSize = 10): Promise<PaginatedResponse<PermissionResponse>> {
  return get<PaginatedResponse<PermissionResponse>>(`/admin/permission?page=${page}&page_size=${pageSize}`);
}

/**
 * Crear un permiso
 * POST /admin/permission
 */
export async function createPermission(action: string): Promise<PermissionResponse> {
  return post<{ type: string }, PermissionResponse>(
    '/admin/permission', 
    { type: action.toUpperCase() }, 
    true
  );
}

/**
 * Eliminar un permiso
 * DELETE /admin/permission?type=...
 */
export async function deletePermission(action: string): Promise<void> {
  return del<void>(`/admin/permission?type=${action}`);
}

// GET /admin/permission/role-permissions
export async function listRolePermissions(page = 1, pageSize = 10): Promise<PaginatedResponse<RolePermissionResponse>> {
  return get<PaginatedResponse<RolePermissionResponse>>(`/admin/permission/role-permissions?page=${page}&page_size=${pageSize}`);
}

export async function assignPermissionToRole(data: { role_id: string, permission_id: string }): Promise<void> {
  return post<{ role_id: string, permission_id: string }, void>('/admin/permission/assign-to-role', data, true);
}

export async function removePermissionFromRole(data: {role_id: string;permission_id: string;
}): Promise<void> {
  return del<void>('/admin/permission/assigned-permission', true, data);
}


export async function updatePermission(
  permissionId: string,
  data: { type: string }
): Promise<PermissionResponse> {
  return patch<{ type: string }, PermissionResponse>(
    `/admin/permission/${permissionId}`,
    data,
    true
  );
}