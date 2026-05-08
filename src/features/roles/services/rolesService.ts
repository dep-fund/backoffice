import { apiClient } from '../../../shared/utils/apiClient';
import { ENDPOINTS } from '../../../shared/constants/api';
import type { Role } from '../types/role';


interface RolesResponse {
  results: Role[];
  total: number;
}

interface RolePayload {
  type: string;
}

export const getRoles = async (
  token: string,
  page: number,
  search: string,
): Promise<RolesResponse> => {
  const query = new URLSearchParams({
    page: String(page),
    page_size: '20',
  });

  if (search) {
    query.append('search', search);
  }

  return apiClient<RolesResponse>(
    `${ENDPOINTS.ROLES.LIST}?${query.toString()}`,
    {},
    token,
  );
};

export const createRole = async (
  token: string,
  payload: RolePayload,
) => {
  return apiClient(
    ENDPOINTS.ROLES.LIST,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  );
};

export const updateRole = async (
  token: string,
  id: string,
  payload: RolePayload,
) => {
  return apiClient(
    `${ENDPOINTS.ROLES.LIST}/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    token,
  );
};