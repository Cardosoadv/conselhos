import { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      const storedToken = localStorage.getItem('@Conselhos:token');
      const storedUser = localStorage.getItem('@Conselhos:user');

      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
        // Opcional: Validar token chamando /auth/me
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    loadStorageData();
  }, []);

  const login = (token: string, loggedUser: User) => {
    localStorage.setItem('@Conselhos:token', token);
    localStorage.setItem('@Conselhos:user', JSON.stringify(loggedUser));
    setUser(loggedUser);
  };

  const logout = () => {
    localStorage.removeItem('@Conselhos:token');
    localStorage.removeItem('@Conselhos:user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
