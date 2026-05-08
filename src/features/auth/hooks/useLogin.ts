import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../services/authService';
import { useAuthContext } from '../../../shared/context/AuthContext';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = async (identifier: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { access_token } = await loginAdmin({ identifier, password });
      await login(access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
};
