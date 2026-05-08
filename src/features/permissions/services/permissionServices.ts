import { apiClient } from '../../../shared/utils/apiClient';

import { ENDPOINTS } from '../../../shared/constants/api';

import type { Permission } from '../types/permission';

interface PermissionsResponse {
  results: Permission[];
  total: number;
}

interface PermissionPayload {
  type: string;
}

export const getPermissions = async (
  token: string,
): Promise<PermissionsResponse> => {
  return apiClient<PermissionsResponse>(
    `${ENDPOINTS.PERMISSIONS.LIST}?page=1&page_size=100`,
    {},
    token,
  );
};

export const createPermission = async (
  token: string,
  payload: PermissionPayload,
) => {
  return apiClient(
    ENDPOINTS.PERMISSIONS.LIST,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  );
};

export const updatePermission = async (
  token: string,
  id: string,
  payload: PermissionPayload,
) => {
  return apiClient(
    `${ENDPOINTS.PERMISSIONS.LIST}/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    token,
  );
};