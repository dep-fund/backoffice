import { useEffect, useState } from 'react';

import { useAuthContext } from '../../../shared/context/AuthContext';


import type { Permission } from '../types/permission';
import { getPermissions } from '../services/permissionServices';

export const usePermissions = () => {
  const { token } = useAuthContext();

  const [permissions, setPermissions] =
    useState<Permission[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!token) return;

      try {
        setLoading(true);

        const response =
          await getPermissions(token);

        setPermissions(response.results);
      } catch {
        setError(
          'No se pudieron cargar los permisos',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [token]);

  return {
    permissions,
    loading,
    error,
  };
};