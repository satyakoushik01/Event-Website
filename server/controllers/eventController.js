const Event = require('../models/Event');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Get all events
// @route   GET /api/events
const getEvents = async (req, res, next) => {
  try {
    const features = new APIFeatures(Event.find({ status: 'published' }), req.query)
      .search()
      .filter()
      .sort()
      .paginate();

    const events = await features.query.populate('vendors', 'businessName logo category');
    const total = await Event.countDocuments({ status: 'published' });

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      page: features.page,
      pages: Math.ceil(total / features.limit),
      events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('vendors', 'businessName logo category rating')
      .populate('createdBy', 'name');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

// @desc    Get events by category
// @route   GET /api/events/category/:category
const getEventsByCategory = async (req, res, next) => {
  try {
    const features = new APIFeatures(
      Event.find({ status: 'published', category: req.params.category }),
      req.query
    )
      .sort()
      .paginate();

    const events = await features.query;
    const total = await Event.countDocuments({
      status: 'published',
      category: req.params.category,
    });

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      page: features.page,
      pages: Math.ceil(total / features.limit),
      events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create event
// @route   POST /api/events
const createEvent = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, message: 'Event deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured events
// @route   GET /api/events/featured
const getFeaturedEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ status: 'published', featured: true })
      .sort('-createdAt')
      .limit(6);
    res.status(200).json({ success: true, events });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvents,
  getEvent,
  getEventsByCategory,
  createEvent,
  updateEvent,
  deleteEvent,
  getFeaturedEvents,
};
