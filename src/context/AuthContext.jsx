import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Demo users for testing
const DEMO_USERS = [
  {
    id: 1,
    email: 'manager@imtiaz.com',
    password: 'manager123',
    role: 'manager',
    name: 'Manager User',
    branches: ['Branch A', 'Branch B', 'Branch C']
  },
  {
    id: 2,
    email: 'admin@imtiaz.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
    branch: 'Branch A'
  },
  {
    id: 3,
    email: 'client@example.com',
    password: 'client123',
    role: 'client',
    name: 'John Doe',
    accountNumber: 'CLT-001',
    balance: 50000,
    branch: 'Branch A'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    const foundUser = DEMO_USERS.find(
      u => u.email === email && u.password === password
    );
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
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
