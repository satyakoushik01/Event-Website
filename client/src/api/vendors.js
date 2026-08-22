import api from './axios';

export const getVendors = (params) => api.get('/vendors', { params });
export const getVendor = (id) => api.get(`/vendors/${id}`);
export const getFeaturedVendors = () => api.get('/vendors/featured');
export const getVendorsByCategory = (category, params) =>
  api.get(`/vendors/category/${encodeURIComponent(category)}`, { params });
export const getAllVendorsAdmin = (params) => api.get('/vendors/admin/all', { params });
export const createVendor = (data) => api.post('/vendors', data);
export const updateVendor = (id, data) => api.put(`/vendors/${id}`, data);
export const updateVendorStatus = (id, status) =>
  api.put(`/vendors/${id}/status`, { status });
export const deleteVendor = (id) => api.delete(`/vendors/${id}`);
export const getVendorAvailability = (id) => api.get(`/vendors/${id}/availability`);
