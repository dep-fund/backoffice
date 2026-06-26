import { useState, useEffect } from 'react';
import { useAuthContext } from '../../../shared/context/AuthContext';
import { fetchFundraisingReport } from '../services/reportService';
import type { FundraisingReport } from '../types/report.types';

export const useFundraisingReport = () => {
  const { token } = useAuthContext();
  const [data, setData] = useState<FundraisingReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const report = await fetchFundraisingReport(token);
        setData(report);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el reporte');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  return { data, loading, error };
};
