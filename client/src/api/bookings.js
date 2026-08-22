import api from './axios';

export const createBooking = (data) => api.post('/bookings', data);
export const getMyBookings = (params) => api.get('/bookings/my', { params });
export const getBooking = (id) => api.get(`/bookings/${id}`);
export const cancelBooking = (id, reason) =>
  api.put(`/bookings/${id}/cancel`, { reason });
export const getAllBookingsAdmin = (params) =>
  api.get('/bookings/admin/all', { params });
export const updateBookingStatus = (id, status, reason) =>
  api.put(`/bookings/${id}/status`, { status, reason });
