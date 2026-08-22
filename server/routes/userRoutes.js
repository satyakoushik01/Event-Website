const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  updateProfile,
  updatePassword,
  toggleWishlist,
  getWishlist,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} = require('../controllers/userController');

router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.put('/wishlist/:vendorId', protect, toggleWishlist);
router.get('/wishlist', protect, getWishlist);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/read-all', protect, markAllNotificationsRead);
router.put('/notifications/:id/read', protect, markNotificationRead);

module.exports = router;
