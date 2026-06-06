import { BASE_URL } from '../constants/api';

export const apiClient = async <T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) return {} as T;

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const msg = Array.isArray(error.detail)
      ? error.detail[0]?.msg
      : error.detail;
    throw new Error(msg || `Error ${response.status}`);
  }

  return response.json();
};
