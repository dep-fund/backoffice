import { apiClient } from '../../../shared/utils/apiClient';
import { ENDPOINTS } from '../../../shared/constants/api';
import type { PaginatedResponse } from '../../users/types/users.types';
import type { ProjectResponse } from '../../users/types/users.types';

interface SimpleTotal {
  total: number;
}

export const fetchDashboardData = async (token: string) => {
  const [users, projects, categories, roles, permissions] = await Promise.all([
    apiClient<SimpleTotal>(`${ENDPOINTS.USERS.LIST}?page=1&page_size=1`, {}, token),
    apiClient<PaginatedResponse<ProjectResponse>>(`${ENDPOINTS.PROJECTS.LIST}?page=1&page_size=100`, {}, token),
    apiClient<SimpleTotal>(`${ENDPOINTS.CATEGORIES.LIST}?page=1&page_size=1`, {}, token),
    apiClient<SimpleTotal>(`${ENDPOINTS.ROLES.LIST}?page=1&page_size=1`, {}, token),
    apiClient<SimpleTotal>(`${ENDPOINTS.PERMISSIONS.LIST}?page=1&page_size=1`, {}, token),
  ]);

  const allProjects = projects.results;
  const pending = allProjects.filter((p) => p.state === 'PENDING');

  return {
    stats: {
      totalUsers: users.total,
      totalProjects: projects.total,
      pendingProjects: pending.length,
      approvedProjects: allProjects.filter((p) => p.state === 'APPROVED').length,
      rejectedProjects: allProjects.filter((p) => p.state === 'REJECTED').length,
      totalCategories: categories.total,
      totalRoles: roles.total,
      totalPermissions: permissions.total,
    },
    pendingProjects: pending.map((p) => ({
      id: p.id,
      name: p.name,
      ubication: p.ubication,
    })),
  };
};
