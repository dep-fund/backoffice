import { useEffect, useState } from 'react';
import { useAuthContext } from '../../../shared/context/AuthContext';
import { getCategories } from '../services/categoriesService';

import type { Category } from '../types/category';

export const useCategories = () => {
  const { token } = useAuthContext();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setError('');

        const response = await getCategories(
          token,
          page,
          search,
        );

        setCategories(response.results);
        setTotal(response.total);

        setTotalPages(
          Math.ceil(response.total / 20),
        );
      } catch {
        setError('No se pudieron cargar las categorías');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token, page, search]);

  return {
    categories,
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