const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  createReview,
  getVendorReviews,
  updateReview,
  deleteReview,
  moderateReview,
  getAllReviewsAdmin,
} = require('../controllers/reviewController');

// Public
router.get('/vendor/:vendorId', getVendorReviews);

// Protected
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

// Admin
router.get('/admin/all', protect, adminOnly, getAllReviewsAdmin);
router.put('/:id/moderate', protect, adminOnly, moderateReview);

module.exports = router;
