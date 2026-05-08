import { useEffect, useState } from 'react';

import { useAuthContext } from '../../../shared/context/AuthContext';

import { getProfile } from '../services/profileService';

import type { StandardUserResponse } from '../../users/types/users.types';

export const useProfile = () => {
  const { token } = useAuthContext();

  const [profile, setProfile] = useState<StandardUserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setError('');

        const response = await getProfile(token);

        setProfile(response);
      } catch {
        setError('No se pudo cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  return {
    profile,
    loading,
    error,
  };
};