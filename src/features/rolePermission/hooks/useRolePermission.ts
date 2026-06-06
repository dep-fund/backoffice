import { useCallback, useEffect, useState } from 'react';

import { useAuthContext } from '../../../shared/context/AuthContext';


import type { RolePermission } from '../types/rolePermission';
import { getRolePermissions } from '../services/rolePermissionService';

export const useRolePermissions = () => {
  const { token } = useAuthContext();

  const [items, setItems] =
    useState<RolePermission[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const fetchRolePermissions =
    useCallback(async () => {
      if (!token) return;

      try {
        setLoading(true);

        const response =
          await getRolePermissions(token);

        setItems(response.results);
      } catch {
        setError(
          'No se pudieron cargar las asignaciones',
        );
      } finally {
        setLoading(false);
      }
    }, [token]);

  useEffect(() => {
    fetchRolePermissions();
  }, [fetchRolePermissions]);

  return {
    items,
    loading,
    error,
    refetch: fetchRolePermissions,
  };
};