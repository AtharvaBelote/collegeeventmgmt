import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
  };

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.data);
        } catch (error) {
          console.error('Failed to get user data:', error);
          // Clear invalid token
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { token: newToken } = response.data;
      
      setToken(newToken);
      localStorage.setItem('token', newToken);
      
      // Get user data
      const userResponse = await authAPI.getCurrentUser();
      setUser(userResponse.data);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token: newToken } = response.data;
      
      setToken(newToken);
      localStorage.setItem('token', newToken);
      
      // Get user data
      const userDataResponse = await authAPI.getCurrentUser();
      setUser(userDataResponse.data);
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const isAdmin = () => user?.role === 'ADMIN';
  const isFaculty = () => user?.role === 'FACULTY';
  const isStudent = () => user?.role === 'STUDENT';

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAdmin,
    isFaculty,
    isStudent,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};





