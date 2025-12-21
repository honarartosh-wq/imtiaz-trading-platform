import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          try {
            // Verify token is still valid by fetching current user
            const currentUser = await getCurrentUser();
            setUser(currentUser);
          } catch (error) {
            // Token invalid or expired, clear storage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        // localStorage disabled or full - gracefully handle
        console.warn('Unable to access localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      
      // Store tokens (Note: Use httpOnly cookies in production for better security)
      localStorage.setItem('accessToken', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);
      
      // Transform backend role to frontend format
      const userData = {
        ...response.user,
        role: response.user.role.toLowerCase()
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      return { 
        success: false, 
        error: 'Invalid credentials. Please check your email and password.' 
      };
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
    isManager: user?.role === 'manager',
    isAdmin: user?.role === 'admin',
    isClient: user?.role === 'client'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
