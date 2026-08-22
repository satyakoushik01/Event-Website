import api from './axios';

export const getDashboardStats = () => api.get('/admin/dashboard');
export const getUsers = (params) => api.get('/admin/users', { params });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const getAnalytics = (params) => api.get('/admin/analytics', { params });
