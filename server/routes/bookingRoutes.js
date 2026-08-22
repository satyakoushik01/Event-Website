const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  createBooking,
  getMyBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking,
  getAllBookingsAdmin,
} = require('../controllers/bookingController');

// User
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);

// Admin (static paths before /:id)
router.get('/admin/all', protect, adminOnly, getAllBookingsAdmin);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/status', protect, adminOnly, updateBookingStatus);

module.exports = router;
