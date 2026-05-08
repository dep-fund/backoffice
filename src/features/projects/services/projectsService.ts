import { apiClient } from '../../../shared/utils/apiClient';
import { ENDPOINTS } from '../../../shared/constants/api';

import type {
  PaginatedResponse,
  ProjectResponse,
} from '../../users/types/users.types';

export const getProjects = async (token: string,page: number,search: string): Promise<PaginatedResponse<ProjectResponse>> => {
  const query = new URLSearchParams({page: String(page),page_size: '20',});

  if (search) {
    query.append('search', search);
  }

  return apiClient<PaginatedResponse<ProjectResponse>>(`${ENDPOINTS.PROJECTS.LIST}?${query.toString()}`,{},token);
};

export const getProjectById = async (token: string,id: string,): Promise<ProjectResponse> => {
  return apiClient<ProjectResponse>(`${ENDPOINTS.PROJECTS.LIST}/${id}`,{},token,);
};