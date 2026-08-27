const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Update profile
// @route   PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address, avatar },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/users/password
const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.matchPassword(req.body.currentPassword);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = req.body.newPassword;
    await user.save();

    const token = user.getSignedJwtToken();
    res.status(200).json({ success: true, token, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle wishlist vendor
// @route   PUT /api/users/wishlist/:vendorId
const toggleWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const vendorId = req.params.vendorId;
    // Find if vendor already in wishlist
    const existingIndex = user.wishlist.findIndex(item =>
      item.itemId && item.itemId.toString() === vendorId && item.itemType === 'Vendor'
    );
    if (existingIndex > -1) {
      // Remove
      user.wishlist.splice(existingIndex, 1);
    } else {
      // Add new entry
      user.wishlist.push({ itemId: vendorId, itemType: 'Vendor' });
    }
    await user.save();
    await user.populate('wishlist.itemId');
    res.status(200).json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Get wishlist
// @route   GET /api/users/wishlist
const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist.itemId');
    const wishlist = user.wishlist.map(item => ({
      itemId: item.itemId,
      itemType: item.itemType,
    }));
    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Get notifications
// @route   GET /api/users/notifications
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort('-createdAt')
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      isRead: false,
    });

    res.status(200).json({ success: true, notifications, unreadCount });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/users/notifications/:id/read
const markNotificationRead = async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/users/notifications/read-all
const markAllNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile,
  updatePassword,
  toggleWishlist,
  getWishlist,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
};
