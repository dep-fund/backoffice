import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../../shared/context/AuthContext';
import { getProjectById } from '../services/projectsService';

import type { ProjectResponse } from '../../users/types/users.types';

export const useProjectDetail = () => {
  const { id } = useParams();
  const { token } = useAuthContext();

  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      if (!id || !token) return;

      try {
        setLoading(true);
        setError('');

        const response = await getProjectById(token, id);

        setProject(response);
      } catch {
        setError('No se pudo cargar el proyecto');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, token]);

  return {
    project,
    loading,
    error,
  };
};