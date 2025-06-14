// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axiosInstance.js';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setCurrentUser(user ? JSON.parse(user) : null);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;

      const sessionUser = {
        id: user.id || user._id,
        name: user.name,
        email: user.email
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(sessionUser));
      setCurrentUser(sessionUser);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const register = async (name, email, password) => {
    try {
      await api.post('/auth/register', { name, email, password });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const updateUser = async (data) => {
    try {
      const userId = currentUser.id || currentUser._id;
      const updated = await userService.updateUser(userId, data);

      localStorage.setItem('user', JSON.stringify(updated));
      setCurrentUser(updated);
      return updated;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error al actualizar perfil');
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
