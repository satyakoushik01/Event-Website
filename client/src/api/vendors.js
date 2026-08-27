import api from './axios';
import { MOCK_VENDORS } from '../data/mockVendors';

// Helper function to filter and paginate mock vendors
const filterMockVendors = (params = {}) => {
  let list = [...MOCK_VENDORS];
  const { category, keyword, 'location.city': locationCity, 'rating[gte]': minRating, 'priceRange.min[gte]': minPrice, 'priceRange.min[lte]': maxPrice, sort, page = 1, limit = 12 } = params;

  if (category) {
    list = list.filter((v) => v.category?.toLowerCase() === category.toLowerCase());
  }

  if (keyword) {
    const q = keyword.toLowerCase();
    list = list.filter((v) =>
      v.businessName?.toLowerCase().includes(q) ||
      v.specialty?.toLowerCase().includes(q) ||
      v.category?.toLowerCase().includes(q) ||
      v.description?.toLowerCase().includes(q) ||
      v.location?.city?.toLowerCase().includes(q) ||
      v.services?.some((s) => s.name?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q))
    );
  }

  if (locationCity) {
    const city = locationCity.toLowerCase();
    list = list.filter((v) => v.location?.city?.toLowerCase().includes(city));
  }

  if (minRating) {
    const r = parseFloat(minRating);
    list = list.filter((v) => (v.rating || 0) >= r);
  }

  if (minPrice) {
    const minP = parseFloat(minPrice);
    list = list.filter((v) => (v.startingPrice || v.priceRange?.min || 0) >= minP);
  }

  if (maxPrice) {
    const maxP = parseFloat(maxPrice);
    list = list.filter((v) => (v.startingPrice || v.priceRange?.min || 0) <= maxP);
  }

  // Sorting
  if (sort === 'rating') {
    list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sort === 'reviews') {
    list.sort((a, b) => (b.totalReviews || b.reviewCount || 0) - (a.totalReviews || a.reviewCount || 0));
  } else if (sort === 'price-asc') {
    list.sort((a, b) => (a.startingPrice || a.priceRange?.min || 0) - (b.startingPrice || b.priceRange?.min || 0));
  } else if (sort === 'price-desc') {
    list.sort((a, b) => (b.startingPrice || b.priceRange?.min || 0) - (a.startingPrice || a.priceRange?.min || 0));
  } else if (sort === 'newest') {
    list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }

  const total = list.length;
  const p = parseInt(page, 10);
  const l = parseInt(limit, 10);
  const startIndex = (p - 1) * l;
  const paginatedVendors = list.slice(startIndex, startIndex + l);

  return {
    data: {
      success: true,
      count: paginatedVendors.length,
      total,
      page: p,
      pages: Math.ceil(total / l) || 1,
      vendors: paginatedVendors,
    },
  };
};

export const getVendors = async (params = {}) => {
  try {
    const res = await api.get('/vendors', { params });
    if (res.data?.vendors && res.data.vendors.length > 0) {
      return res;
    }
  } catch (error) {
    // API server offline or empty response, use mock fallback
  }
  return filterMockVendors(params);
};

export const getVendor = async (idOrSlug) => {
  try {
    const res = await api.get(`/vendors/${idOrSlug}`);
    if (res.data?.vendor) {
      return res;
    }
  } catch (error) {
    // Fallback to mock
  }

  const found = MOCK_VENDORS.find(
    (v) =>
      String(v._id) === String(idOrSlug) ||
      String(v.id) === String(idOrSlug) ||
      v.slug === idOrSlug
  );

  if (found) {
    return { data: { success: true, vendor: found } };
  }

  throw new Error('Vendor not found');
};

export const getFeaturedVendors = async () => {
  try {
    const res = await api.get('/vendors/featured');
    if (res.data?.vendors && res.data.vendors.length > 0) return res;
  } catch (err) {}
  const featured = MOCK_VENDORS.filter((v) => v.featured || v.isVerified).slice(0, 8);
  return { data: { success: true, vendors: featured } };
};

export const getVendorsByCategory = async (category, params = {}) => {
  return getVendors({ ...params, category });
};

export const getAllVendorsAdmin = (params) => api.get('/vendors/admin/all', { params });
export const createVendor = (data) => api.post('/vendors', data);
export const updateVendor = (id, data) => api.put(`/vendors/${id}`, data);
export const updateVendorStatus = (id, status) => api.put(`/vendors/${id}/status`, { status });
export const deleteVendor = (id) => api.delete(`/vendors/${id}`);
export const getVendorAvailability = (id) => api.get(`/vendors/${id}/availability`);

