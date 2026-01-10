import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token and user data exists
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token) {
        setUser(storedUser ? JSON.parse(storedUser) : { token }); 
    }
    setLoading(false);
  }, []);

  const login = async (loginId, password) => {
    const res = await api.post('/auth/login', { login: loginId, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (username, email, password) => {
    await api.post('/auth/register', { username, email, password });
    // Don't set user state yet, need to verify first
  };

  const verify = async (email, code) => {
    const res = await api.post('/auth/verify', { email, code });
    const { token, user: userData } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, verify, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
