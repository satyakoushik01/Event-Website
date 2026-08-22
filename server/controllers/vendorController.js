const Vendor = require('../models/Vendor');
const Booking = require('../models/Booking');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Get all approved vendors
// @route   GET /api/vendors
const getVendors = async (req, res, next) => {
  try {
    const baseQuery = Vendor.find({ status: 'approved' });
    const features = new APIFeatures(baseQuery, req.query)
      .search()
      .filter()
      .sort()
      .paginate();

    const vendors = await features.query;
    const total = await Vendor.countDocuments({ status: 'approved', ...req.query.category ? { category: req.query.category } : {} });

    res.status(200).json({
      success: true,
      count: vendors.length,
      total,
      page: features.page,
      pages: Math.ceil(total / features.limit),
      vendors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single vendor
// @route   GET /api/vendors/:id
const getVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate('reviews');
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    res.status(200).json({ success: true, vendor });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured vendors
// @route   GET /api/vendors/featured
const getFeaturedVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.find({ status: 'approved', featured: true })
      .sort('-rating')
      .limit(8);
    res.status(200).json({ success: true, vendors });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendors by category
// @route   GET /api/vendors/category/:category
const getVendorsByCategory = async (req, res, next) => {
  try {
    const features = new APIFeatures(
      Vendor.find({ status: 'approved', category: req.params.category }),
      req.query
    )
      .sort()
      .paginate();

    const vendors = await features.query;
    const total = await Vendor.countDocuments({
      status: 'approved',
      category: req.params.category,
    });

    res.status(200).json({
      success: true,
      count: vendors.length,
      total,
      page: features.page,
      pages: Math.ceil(total / features.limit),
      vendors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create vendor (admin)
// @route   POST /api/vendors
const createVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.status(201).json({ success: true, vendor });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vendor (admin)
// @route   PUT /api/vendors/:id
const updateVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    res.status(200).json({ success: true, vendor });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete vendor (admin)
// @route   DELETE /api/vendors/:id
const deleteVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    res.status(200).json({ success: true, message: 'Vendor deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vendor status (admin approve/reject/suspend)
// @route   PUT /api/vendors/:id/status
const updateVendorStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    res.status(200).json({ success: true, vendor });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all vendors (admin, all statuses)
// @route   GET /api/vendors/admin/all
const getAllVendorsAdmin = async (req, res, next) => {
  try {
    const features = new APIFeatures(Vendor.find(), req.query)
      .search()
      .filter()
      .sort()
      .paginate();

    const vendors = await features.query;
    const total = await Vendor.countDocuments();

    res.status(200).json({
      success: true,
      count: vendors.length,
      total,
      page: features.page,
      pages: Math.ceil(total / features.limit),
      vendors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor availability (booked dates)
// @route   GET /api/vendors/:id/availability
const getVendorAvailability = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      vendor: req.params.id,
      status: { $in: ['confirmed', 'in-progress'] },
      eventDate: { $gte: new Date() }
    }).select('eventDate');

    const bookedDates = bookings.map(b => b.eventDate);
    res.status(200).json({ success: true, bookedDates });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
