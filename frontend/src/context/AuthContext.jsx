import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '@/services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dealership_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('dealership_token') || null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const profile = await authService.getMe();
          setUser(profile);
          localStorage.setItem('dealership_user', JSON.stringify(profile));
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = (userData) => {
    const { token: userToken, ...profileData } = userData;
    setUser(profileData);
    setToken(userToken);
    localStorage.setItem('dealership_user', JSON.stringify(profileData));
    localStorage.setItem('dealership_token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('dealership_user');
    localStorage.removeItem('dealership_token');
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedData };
      localStorage.setItem('dealership_user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
