import { useEffect, useState } from 'react';
import { useAuthContext } from '../../../shared/context/AuthContext';
import { getProjects } from '../services/projectsService';
import type { ProjectResponse } from '../../users/types/users.types';

export const useProjects = () => {
  const { token } = useAuthContext();

  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setError('');

        const response = await getProjects(token, page, search);

        setProjects(response.results);
        setTotal(response.total);
        setTotalPages(Math.ceil(response.total / 20));
      } catch {
        setError('No se pudieron cargar los proyectos');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token, page, search]);

  return {
    projects,
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