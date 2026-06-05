export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/admin/auth/login',
  },
  ADMIN: {
    CREATE: '/admin/users',
    ME: '/admin/users/me',
  },
  USERS: {
    LIST: '/admin/users/users',
    BLOCK: (id: string) => `/admin/users/users/${id}/block`,
  },
  PROJECTS: {
    LIST: '/admin/projects',
    APPROVE: (id: string) => `/admin/projects/${id}/approve`,
    REJECT: (id: string) => `/admin/projects/${id}/reject`,
  },
  CATEGORIES: {
    LIST: '/admin/categories',
  },
  ROLES: {
    LIST: '/admin/role',
  },
  PERMISSIONS: {
    LIST: '/admin/permission',
  },
};
