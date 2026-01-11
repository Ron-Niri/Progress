import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error('Auth check failed:', err.response?.data?.msg || err.message);
        // If it fails, we don't have a valid session
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (loginId, password) => {
    const res = await api.post('/auth/login', { login: loginId, password });
    const { user: userData } = res.data;
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (username, email, password) => {
    await api.post('/auth/register', { username, email, password });
    // Don't set user state yet, need to verify first
  };

  const verify = async (email, code) => {
    const res = await api.post('/auth/verify', { email, code });
    const { user: userData } = res.data;
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout failed:', err);
    }
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, verify, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
