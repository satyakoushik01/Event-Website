import api from './axios';

export const submitContact = (data) => api.post('/contact', data);
export const getMessages = (params) => api.get('/contact', { params });
export const updateMessage = (id, data) => api.put(`/contact/${id}`, data);
export const deleteMessage = (id) => api.delete(`/contact/${id}`);
