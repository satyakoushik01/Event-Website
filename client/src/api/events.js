import api from './axios';

export const getEvents = (params) => api.get('/events', { params });
export const getEvent = (id) => api.get(`/events/${id}`);
export const getFeaturedEvents = () => api.get('/events/featured');
export const getEventsByCategory = (category, params) =>
  api.get(`/events/category/${encodeURIComponent(category)}`, { params });
export const createEvent = (data) => api.post('/events', data);
