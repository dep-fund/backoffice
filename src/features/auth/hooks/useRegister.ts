import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerAdmin } from '../services/authService';
import type { RegisterRequest } from '../types/auth.types';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      await registerAdmin(data);
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading, error };
};
