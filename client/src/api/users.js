import api from './axios';

export const updateProfile = (data) => api.put('/users/profile', data);
export const updatePassword = (data) => api.put('/users/password', data);
export const toggleWishlist = (vendorId) => api.put(`/users/wishlist/${vendorId}`);
export const getWishlist = () => api.get('/users/wishlist');
export const getNotifications = () => api.get('/users/notifications');
export const markNotificationRead = (id) => api.put(`/users/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.put('/users/notifications/read-all');
