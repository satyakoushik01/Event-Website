// Utility functions for mock authentication using localStorage
import { getRegisteredUsers, addRegisteredUser, findUserByEmail } from '../utils/localAuth';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const ADMIN_EMAIL = 'admin@momentshub.com';
const ADMIN_PASSWORD = 'AdminPassword123!';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  const persistAuth = useCallback((token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  // Mock login handling admin hard‑coded credentials and local users
  const login = async (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = { id: 'admin', name: 'Admin', email, role: 'admin', createdAt: new Date().toISOString() };
      const adminToken = `admin-token-${Date.now()}`;
      persistAuth(adminToken, adminUser);
      return { token: adminToken, user: adminUser };
    }
    const existing = findUserByEmail(email);
    if (!existing || existing.password !== password) {
      throw new Error('Invalid email or password');
    }
    const token = `mock-token-${existing.email}`;
    const userData = { id: existing.email, name: existing.name, email: existing.email, role: existing.role, phone: existing.phone, createdAt: existing.createdAt };
    persistAuth(token, userData);
    return { token, user: userData };
  };

  // Mock registration – stores user in localStorage and logs in immediately
  const register = async (formData) => {
    const { name, email, password, phone, role = 'client' } = formData;
    if (findUserByEmail(email)) {
      throw new Error('Email already registered');
    }
    const newUser = { name, email, password, phone, role, createdAt: new Date().toISOString() };
    addRegisteredUser(newUser);
    const token = `mock-token-${email}`;
    const userData = { id: email, name, email, role, phone, createdAt: newUser.createdAt };
    persistAuth(token, userData);
    return { token, user: userData };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Refresh user on app start – reads token & user from localStorage
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    if (token && token.startsWith('admin-token')) {
      const adminUser = { id: 'admin', name: 'Admin', email: ADMIN_EMAIL, role: 'admin', createdAt: new Date().toISOString() };
      setUser(adminUser);
      setLoading(false);
      return;
    }
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
