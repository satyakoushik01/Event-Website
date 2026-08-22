const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const ContactMessage = require('../models/ContactMessage');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalVendors,
      pendingVendors,
      totalEvents,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      totalReviews,
      pendingReviews,
      unreadMessages,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Vendor.countDocuments({ status: 'approved' }),
      Vendor.countDocuments({ status: 'pending' }),
      Event.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'completed' }),
      Review.countDocuments(),
      Review.countDocuments({ status: 'pending' }),
      ContactMessage.countDocuments({ status: 'unread' }),
    ]);

    // Revenue calculation
    const revenueData = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);

    // Monthly bookings for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyBookings = await Booking.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Popular categories
    const popularCategories = await Booking.aggregate([
      { $group: { _id: '$eventType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Recent bookings
    const recentBookings = await Booking.find()
      .sort('-createdAt')
      .limit(5)
      .populate('user', 'name email')
      .populate('vendor', 'businessName');

    // Monthly user signups
    const monthlyUsers = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalVendors,
        pendingVendors,
        totalEvents,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        totalReviews,
        pendingReviews,
        unreadMessages,
        totalRevenue: revenueData[0]?.totalRevenue || 0,
        monthlyBookings,
        popularCategories,
        recentBookings,
        monthlyUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);
    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics data
// @route   GET /api/admin/analytics
const getAnalytics = async (req, res, next) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    // Monthly revenue
    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
          status: { $in: ['confirmed', 'completed'] },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);

    // Service popularity
    const servicePopularity = await Vendor.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Top rated vendors
    const topVendors = await Vendor.find({ status: 'approved' })
      .sort('-rating')
      .limit(10)
      .select('businessName category rating totalReviews completedEvents');

    res.status(200).json({
      success: true,
      analytics: {
        monthlyRevenue,
        servicePopularity,
        topVendors,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getUsers, deleteUser, getAnalytics };
