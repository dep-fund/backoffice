import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../../../shared/context/AuthContext';
import { listUsers, toggleUserBlock } from '../services/usersService';
import type { StandardUserResponse } from '../types/users.types';

export const useUsers = () => {
  const { token } = useAuthContext();
  const [users, setUsers] = useState<StandardUserResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchUsers = useCallback(
    async (p = page) => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const data = await listUsers(token, p, pageSize);
        setUsers(data.results);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    },
    [token, page, pageSize]
  );

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleToggleBlock = async (userId: string) => {
    if (!token) return;
    try {
      const updated = await toggleUserBlock(token, userId);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar usuario');
    }
  };

  const filteredUsers = search
    ? users.filter(
        (u) =>
          u.username.toLowerCase().includes(search.toLowerCase()) ||
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.last_name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  const totalPages = Math.ceil(total / pageSize);

  return {
    users: filteredUsers,
    total,
    page,
    totalPages,
    loading,
    error,
    search,
    setSearch,
    setPage,
    handleToggleBlock,
    refetch: fetchUsers,
  };
};
