// Cliente HTTP centralizado.
// Toda llamada a la API pasa por acá, lo que garantiza que:
//   1. La base URL esté en un solo lugar
//   2. El token JWT se adjunte automáticamente cuando existe
//   3. Los errores HTTP se manejen de forma consistente

import type { ApiError } from '../types/api.types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

// Recupera el token del sessionStorage (se guarda al hacer login)
function getToken(): string | null {
  return sessionStorage.getItem('access_token');
}

// Construye los headers base; si hay token lo agrega
function buildHeaders(includeAuth: boolean): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

// Lanza un ApiError con información útil cuando el servidor responde con error
async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    if (response.status === 204) {
      return undefined as T;
    }
    return response.json() as Promise<T>;
  }

  let message = `Error ${response.status}`;
  let detail;

  try {
    const body = await response.json();

    if (body.message) {
      message = body.message;
    } else if (body.detail) {
      detail = body.detail;
      message = typeof detail === 'string' ? detail : message;
    }

  } catch { }

  const error: ApiError = { status: response.status, message, detail };
  throw error;
}

// ----- Métodos públicos -----

export async function get<T>(path: string, auth = true): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: buildHeaders(auth),
  });
  return handleResponse<T>(response);
}

export async function post<TBody, TResponse>(
  path: string,
  body: TBody,
  auth = false,
): Promise<TResponse> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: buildHeaders(auth),
    body: JSON.stringify(body),
  });
  return handleResponse<TResponse>(response);
}

export async function patch<TBody, TResponse>(
  path: string,
  body: TBody,
  auth = true,
): Promise<TResponse> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: buildHeaders(auth),
    body: JSON.stringify(body),
  });
  return handleResponse<TResponse>(response);
}

export async function del<T>(path: string, auth = true, body?: unknown): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: buildHeaders(auth),
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(response);
}