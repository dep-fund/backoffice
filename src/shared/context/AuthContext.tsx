import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

import type { AdminUserResponse } from '../../features/auth/types/auth.types';
import { getMe } from '../../features/auth/services/authService';

interface AuthContextType {
  token: string | null;
  user: AdminUserResponse | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  setUser: (user: AdminUserResponse) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('admin_token')
  );
  const [user, setUser] = useState<AdminUserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          const data = await getMe(token);
          setUser(data);
        } catch {
          localStorage.removeItem('admin_token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    init();
  }, [token]);

  const login = async (newToken: string) => {
    localStorage.setItem('admin_token', newToken);
    setToken(newToken);
    const data = await getMe(newToken);
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be inside AuthProvider');
  return ctx;
};
