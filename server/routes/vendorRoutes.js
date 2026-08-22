const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getVendors,
  getVendor,
  getFeaturedVendors,
  getVendorsByCategory,
  createVendor,
  updateVendor,
  deleteVendor,
  updateVendorStatus,
  getAllVendorsAdmin,
  getVendorAvailability,
} = require('../controllers/vendorController');

// Public
router.get('/featured', getFeaturedVendors);
router.get('/category/:category', getVendorsByCategory);
router.get('/', getVendors);

// Admin (static paths before /:id)
router.get('/admin/all', protect, adminOnly, getAllVendorsAdmin);
router.get('/:id/availability', getVendorAvailability);
router.get('/:id', getVendor);
router.post('/', protect, adminOnly, createVendor);
router.put('/:id', protect, adminOnly, updateVendor);
router.put('/:id/status', protect, adminOnly, updateVendorStatus);
router.delete('/:id', protect, adminOnly, deleteVendor);

module.exports = router;
