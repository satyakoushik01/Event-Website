import api from './axios';

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const verifyEmail = (token) => api.get(`/auth/verify-email/${token}`);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) =>
  api.put(`/auth/reset-password/${token}`, { password });
export const resendVerification = (email) =>
  api.post('/auth/resend-verification', { email });
