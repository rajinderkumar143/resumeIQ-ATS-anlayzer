import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('resumeiq_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('resumeiq_token');
      if (savedToken) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch {
          localStorage.removeItem('resumeiq_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    localStorage.setItem('resumeiq_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const register = async (name, email, password, targetJobTitle, preferredIndustry) => {
    const res = await authService.register({ name, email, password, targetJobTitle, preferredIndustry });
    localStorage.setItem('resumeiq_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const loginAsGuestDemo = async () => {
    const res = await authService.demoLogin();
    localStorage.setItem('resumeiq_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('resumeiq_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updated) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        loading,
        login,
        register,
        loginAsGuestDemo,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
