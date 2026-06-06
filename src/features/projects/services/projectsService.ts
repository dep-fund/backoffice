import { apiClient } from '../../../shared/utils/apiClient';
import { ENDPOINTS } from '../../../shared/constants/api';

import type {
  PaginatedResponse,
  ProjectResponse,
} from '../../users/types/users.types';

export const getProjects = async (
  token: string,
  page: number,
  search: string,
): Promise<PaginatedResponse<ProjectResponse>> => {
  const query = new URLSearchParams({ page: String(page), page_size: '20' });
  if (search) query.append('search', search);
  return apiClient<PaginatedResponse<ProjectResponse>>(
    `${ENDPOINTS.PROJECTS.LIST}?${query.toString()}`,
    {},
    token,
  );
};

export const getProjectById = async (
  token: string,
  id: string,
): Promise<ProjectResponse> => {
  return apiClient<ProjectResponse>(
    `${ENDPOINTS.PROJECTS.LIST}/${id}`,
    {},
    token,
  );
};

export const approveProject = async (
  token: string,
  id: string,
): Promise<ProjectResponse> => {
  return apiClient<ProjectResponse>(
    ENDPOINTS.PROJECTS.APPROVE(id),
    { method: 'PATCH' },
    token,
  );
};

export const rejectProject = async (
  token: string,
  id: string,
  reason: string,
): Promise<ProjectResponse> => {
  return apiClient<ProjectResponse>(
    ENDPOINTS.PROJECTS.REJECT(id),
    { method: 'PATCH', body: JSON.stringify({ reason }) },
    token,
  );
};

// ── Images ──
export type ProjectImage = { number: number; url: string };

export const getProjectImages = async (
  token: string,
  projectId: string,
): Promise<ProjectImage[]> => {
  return apiClient<ProjectImage[]>(
    `${ENDPOINTS.PROJECTS.LIST}/${projectId}/images`,
    {},
    token,
  );
};
// ── Documents ──
export type ProjectDocument = { number: number; url: string };

export const getProjectDocuments = async (
  token: string,
  projectId: string,
): Promise<ProjectDocument[]> => {
  return apiClient<ProjectDocument[]>(
    `${ENDPOINTS.PROJECTS.LIST}/${projectId}/documents`,
    {},
    token,
  );
};

// ── Advances ──
export type ProjectAdvance = { number: number; description: string; url?: string | null };

export const getProjectAdvances = async (
  token: string,
  projectId: string,
): Promise<ProjectAdvance[]> => {
  return apiClient<ProjectAdvance[]>(
    `${ENDPOINTS.PROJECTS.LIST}/${projectId}/advances`,
    {},
    token,
  );
};



export const updateProject = async (
  token: string,
  id: string,
  data: {
    name?: string;
    description?: string;
    ubication?: string;
    annual_expenses?: number | null;
    annual_gross_profit?: number | null;
  },
): Promise<ProjectResponse> => {
  return apiClient<ProjectResponse>(
    ENDPOINTS.PROJECTS.UPDATE(id),
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
    token,
  );
};