const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Create booking
// @route   POST /api/bookings
const createBooking = async (req, res, next) => {
  try {
    const { eventId, ticketCategory, quantity, date, showTiming } = req.body;

    // Validate required fields
    if (!eventId || !ticketCategory || !quantity || !date || !showTiming) {
      return res.status(400).json({ success: false, message: 'Missing required booking fields' });
    }

    // Fetch event and ticket type
    const event = await require('../models/Event').findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const ticketType = event.ticketTypes.find(t => t.category === ticketCategory);
    if (!ticketType) {
      return res.status(400).json({ success: false, message: 'Invalid ticket category for this event' });
    }

    // Ensure sufficient capacity (atomic check and decrement)
    const updatedEvent = await require('../models/Event').findOneAndUpdate(
      {
        _id: eventId,
        'ticketTypes.category': ticketCategory,
        'ticketTypes.available': { $gte: quantity },
      },
      { $inc: { 'ticketTypes.$.available': -quantity } },
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(400).json({ success: false, message: 'Not enough tickets available' });
    }

    // Calculate pricing
    const subtotal = ticketType.price * quantity;
    const taxRate = parseFloat(process.env.TAX_RATE) || 0.18;
    const feeRate = parseFloat(process.env.CONVENIENCE_FEE_PERCENT) || 0.02;
    const tax = parseFloat((subtotal * taxRate).toFixed(2));
    const fee = parseFloat((subtotal * feeRate).toFixed(2));
    const totalAmount = parseFloat((subtotal + tax + fee).toFixed(2));

    // Build booking object
    const bookingData = {
      user: req.user.id,
      event: eventId,
      eventType: event.category,
      ticketCategory,
      quantity,
      date,
      showTiming,
      totalAmount,
      paymentStatus: 'unpaid',
      bookingStatus: 'OPEN',
      status: 'pending', // booking workflow status
    };

    const booking = await Booking.create(bookingData);

    // Notification of creation (same as before)
    await Notification.create({
      user: req.user.id,
      title: 'Booking Created',
      message: `Your booking for ${booking.eventType} has been created and is pending payment.`,
      type: 'booking',
      link: `/dashboard/bookings/${booking._id}`,
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my
const getMyBookings = async (req, res, next) => {
  try {
    const features = new APIFeatures(
      Booking.find({ user: req.user.id }),
      req.query
    )
      .filter()
      .sort()
      .paginate();

    const bookings = await features.query
      .populate('vendor', 'businessName logo category contactInfo')
      .populate('event', 'title');

    const total = await Booking.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('vendor', 'businessName logo category contactInfo location')
      .populate('user', 'name email phone')
      .populate('event', 'title');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Ensure user owns booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const updateData = { status };

    if (status === 'confirmed') updateData.confirmedAt = Date.now();
    if (status === 'completed') updateData.completedAt = Date.now();
    if (status === 'cancelled') {
      updateData.cancelledAt = Date.now();
      updateData.cancellationReason = req.body.reason;
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('vendor', 'businessName');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Notify user
    await Notification.create({
      user: booking.user,
      title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your booking with ${booking.vendor.businessName} has been ${status}.`,
      type: 'booking',
    });

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking (user)
// @route   PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Cannot cancel this booking' });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = Date.now();
    booking.cancellationReason = req.body.reason || 'Cancelled by user';
    await booking.save();

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings/admin/all
const getAllBookingsAdmin = async (req, res, next) => {
  try {
    const features = new APIFeatures(Booking.find(), req.query)
      .filter()
      .sort()
      .paginate();

    const bookings = await features.query
      .populate('user', 'name email')
      .populate('vendor', 'businessName category');

    const total = await Booking.countDocuments();

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page: features.page,
      pages: Math.ceil(total / features.limit),
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking,
  getAllBookingsAdmin,
};
