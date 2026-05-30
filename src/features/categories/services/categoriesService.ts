import { apiClient } from '../../../shared/utils/apiClient';
import { ENDPOINTS } from '../../../shared/constants/api';

import type { Category } from '../types/category';

interface CategoriesResponse {
  results: Category[];
  total: number;
}

interface CreateCategoryPayload {
  name: string;
  description: string;
}

export const getCategories = async (
  token: string,
  page: number,
  search: string,
): Promise<CategoriesResponse> => {
  const query = new URLSearchParams({
    page: String(page),
    page_size: '20',
  });

  if (search) {
    query.append('search', search);
  }

  return apiClient<CategoriesResponse>(
    `${ENDPOINTS.CATEGORIES.LIST}?${query.toString()}`,
    {},
    token,
  );
};

export const createCategory = async (
  token: string,
  payload: CreateCategoryPayload,
) => {
  return apiClient(
    ENDPOINTS.CATEGORIES.LIST,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  );
};

export const updateCategory = async (
  token: string,
  id: string,
  payload: {
    name: string;
    description: string;
  },
) => {
  return apiClient(
    `${ENDPOINTS.CATEGORIES.LIST}/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
    token,
  );
};

export const getCategoryById = async (
  token: string,
  id: string,
) => {
  return apiClient<Category>(
    `${ENDPOINTS.CATEGORIES.LIST}/${id}`,
    {},
    token,
  );
};

export const deleteCategory = async (
  token: string,
  id: string,
) => {
  return apiClient(
    `${ENDPOINTS.CATEGORIES.LIST}/${id}`,
    {
      method: 'DELETE',
    },
    token,
  );
};