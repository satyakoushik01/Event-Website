import api from './axios';

export const getVendorReviews = (vendorId, params) =>
  api.get(`/reviews/vendor/${vendorId}`, { params });
export const createReview = (data) => api.post('/reviews', data);
export const updateReview = (id, data) => api.put(`/reviews/${id}`, data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);
export const getAllReviewsAdmin = (params) => api.get('/reviews/admin/all', { params });
export const moderateReview = (id, status) =>
  api.put(`/reviews/${id}/moderate`, { status });
