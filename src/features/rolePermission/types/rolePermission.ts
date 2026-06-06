export interface RolePermission {
  role_id: string;
  permission_id: string;

  role: string;
  permission: string;
}

export interface RolePermissionsResponse {
  results: RolePermission[];
  total: number;
  page: number;
  page_size: number;
}

export interface AssignPermissionPayload {
  role_id: string;
  permission_id: string;
}

export interface DeleteAssignedPermissionPayload {
  role_id: string;
  permission_id: string;
}