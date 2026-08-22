const Review = require('../models/Review');
const Booking = require('../models/Booking');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Create review
// @route   POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const review = await Review.create(req.body);
    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a vendor
// @route   GET /api/reviews/vendor/:vendorId
const getVendorReviews = async (req, res, next) => {
  try {
    const features = new APIFeatures(
      Review.find({ vendor: req.params.vendorId, status: 'approved' }),
      req.query
    )
      .sort()
      .paginate();

    const reviews = await features.query.populate('user', 'name avatar');
    const total = await Review.countDocuments({
      vendor: req.params.vendorId,
      status: 'approved',
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
const updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Sanitize user inputs to prevent moderation bypass
    if (req.user.role !== 'admin') {
      const allowedUpdates = ['rating', 'title', 'comment', 'images'];
      const updates = {};
      allowedUpdates.forEach((field) => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });
      review = await Review.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      });
    } else {
      review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Moderate review (admin)
// @route   PUT /api/reviews/:id/moderate
const moderateReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('user', 'name');

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.status(200).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews (admin)
// @route   GET /api/reviews/admin/all
const getAllReviewsAdmin = async (req, res, next) => {
  try {
    const features = new APIFeatures(Review.find(), req.query)
      .sort()
      .paginate();

    const reviews = await features.query
      .populate('user', 'name email')
      .populate('vendor', 'businessName');

    const total = await Review.countDocuments();

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getVendorReviews,
  updateReview,
  deleteReview,
  moderateReview,
  getAllReviewsAdmin,
};
