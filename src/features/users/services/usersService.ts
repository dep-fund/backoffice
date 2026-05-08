import { apiClient } from '../../../shared/utils/apiClient';
import { ENDPOINTS } from '../../../shared/constants/api';
import type {
  PaginatedResponse,
  StandardUserResponse,
} from '../types/users.types';

export const listUsers = (
  token: string,
  page = 1,
  pageSize = 10
): Promise<PaginatedResponse<StandardUserResponse>> =>
  apiClient<PaginatedResponse<StandardUserResponse>>(
    `${ENDPOINTS.USERS.LIST}?page=${page}&page_size=${pageSize}`,
    {},
    token
  );

export const toggleUserBlock = (
  token: string,
  userId: string
): Promise<StandardUserResponse> =>
  apiClient<StandardUserResponse>(
    ENDPOINTS.USERS.BLOCK(userId),
    { method: 'PATCH' },
    token
  );
