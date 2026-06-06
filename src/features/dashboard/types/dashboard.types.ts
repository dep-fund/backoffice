export interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  pendingProjects: number;
  approvedProjects: number;
  rejectedProjects: number;
  totalCategories: number;
  totalRoles: number;
  totalPermissions: number;
}

export interface PendingProject {
  id: string;
  name: string;
  ubication: string;
}
