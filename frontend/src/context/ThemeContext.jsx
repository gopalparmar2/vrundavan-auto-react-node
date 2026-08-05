import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user, updateUser } = useAuth();

  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('dealership_theme') || user?.theme || 'dark';
  });

  // Sync with user profile theme if loaded or updated
  useEffect(() => {
    if (user?.theme && user.theme !== theme) {
      setThemeState(user.theme);
    }
  }, [user?.theme]);

  // Apply dark class to <html> root element whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('dealership_theme', theme);
  }, [theme]);

  const toggleTheme = async () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setThemeState(nextTheme);

    if (user) {
      updateUser({ theme: nextTheme });
      try {
        await axios.patch('/api/auth/theme', { theme: nextTheme });
      } catch (err) {
        console.error('Failed to sync theme with backend:', err);
      }
    }
  };

  const setTheme = async (newTheme) => {
    if (newTheme !== 'dark' && newTheme !== 'light') return;
    setThemeState(newTheme);

    if (user) {
      updateUser({ theme: newTheme });
      try {
        await axios.patch('/api/auth/theme', { theme: newTheme });
      } catch (err) {
        console.error('Failed to sync theme with backend:', err);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
