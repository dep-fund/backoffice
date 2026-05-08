import { useEffect, useState } from 'react';

import { useAuthContext } from '../../../shared/context/AuthContext';

import { getRoles } from '../services/rolesService';
import type { Role } from '../types/role';


export const useRoles = () => {
  const { token } = useAuthContext();

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] =
    useState(1);

  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setError('');

        const response = await getRoles(
          token,
          page,
          search,
        );

        setRoles(response.results);

        setTotal(response.total);

        setTotalPages(
          Math.ceil(response.total / 20),
        );
      } catch {
        setError('No se pudieron cargar los roles');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [token, page, search]);

  return {
    roles,
    loading,
    error,
    page,
    setPage,
    totalPages,
    total,
    search,
    setSearch,
  };
};