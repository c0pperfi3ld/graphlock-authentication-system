import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { setToken, removeToken, getToken } from '../utils/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDecoyMode, setIsDecoyMode] = useState(false);
  const [passwordExpired, setPasswordExpired] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(null);

  const fetchUser = useCallback(async () => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      setPasswordExpired(data.passwordExpired);
      setDaysRemaining(data.daysRemaining);
    } catch {
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    setToken(data.token);
    setUser(data.user);
    setIsDecoyMode(false);
    return data;
  };

  const login = async (formData) => {
    const { data } = await api.post('/auth/login', formData);
    setToken(data.token);
    setUser(data.user);
    setIsDecoyMode(data.isDecoy || false);
    return data;
  };

  const loginWithText = async (formData) => {
    const { data } = await api.post('/auth/login-text', formData);
    setToken(data.token);
    setUser(data.user);
    setIsDecoyMode(false);
    return data;
  };

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    setIsDecoyMode(false);
    setPasswordExpired(false);
  }, []);

  const refreshUser = fetchUser;

  return (
    <AuthContext.Provider value={{
      user, loading, isAuthenticated: !!user, isDecoyMode, passwordExpired, daysRemaining,
      register, login, loginWithText, logout, refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
