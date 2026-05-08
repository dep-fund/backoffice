import { apiClient } from '../../../shared/utils/apiClient';

import { ENDPOINTS } from '../../../shared/constants/api';

import type { RolePermission } from '../types/rolePermission';

interface RolePermissionsResponse {
  results: RolePermission[];
  total: number;
}

export const getRolePermissions = async (
  token: string,
): Promise<RolePermissionsResponse> => {
  return apiClient<RolePermissionsResponse>(
    `${ENDPOINTS.PERMISSIONS.LIST}/role-permissions?page=1&page_size=100`,
    {},
    token,
  );
};

export const assignPermissionToRole = async (
  token: string,
  payload: {
    role_id: string;
    permission_id: string;
  },
) => {
  return apiClient(
    `${ENDPOINTS.PERMISSIONS.LIST}/assign-to-role`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  );
};

export const deleteAssignedPermission = async (
  token: string,
  payload: {
    role_id: string;
    permission_id: string;
  },
) => {
  return apiClient(
    `${ENDPOINTS.PERMISSIONS.LIST}/assigned-permission`,
    {
      method: 'DELETE',
      body: JSON.stringify(payload),
    },
    token,
  );
};