import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import authService from '../services/authService';

const ThemeContext = createContext();

// Hook personalizado con nombre explícito
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

function ThemeProvider({ children }) {
  const { currentUser, updateUser } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  // Initialize theme from user preference or system preference
  useEffect(() => {
    if (currentUser?.themePreference) {
      setDarkMode(currentUser.themePreference === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, [currentUser]);

  // Apply theme to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Toggle theme
  const toggleTheme = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    // Update user preference if logged in
    if (currentUser) {
      try {
        await updateUser({ themePreference: newMode ? 'dark' : 'light' });
        console.log('Theme preference updated successfully');
      } catch (error) {
        console.error('Failed to update theme preference:', error);
      }
    }
  };

  const value = {
    darkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export { useTheme, ThemeProvider };