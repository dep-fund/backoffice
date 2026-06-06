import { useState, useEffect } from 'react';
import { useAuthContext } from '../../../shared/context/AuthContext';
import { fetchDashboardData } from '../services/dashboardService';
import type {
  DashboardStats,
  PendingProject,
} from '../types/dashboard.types';

export const useDashboard = () => {
  const { token } = useAuthContext();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingProjects, setPendingProjects] = useState<PendingProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const data = await fetchDashboardData(token);
        setStats(data.stats);
        setPendingProjects(data.pendingProjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  return { stats, pendingProjects, loading, error };
};
