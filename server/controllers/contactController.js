const ContactMessage = require('../models/ContactMessage');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Submit contact message
// @route   POST /api/contact
const submitMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all messages (admin)
// @route   GET /api/contact
const getMessages = async (req, res, next) => {
  try {
    const features = new APIFeatures(ContactMessage.find(), req.query)
      .filter()
      .sort()
      .paginate();

    const messages = await features.query;
    const total = await ContactMessage.countDocuments();
    const unread = await ContactMessage.countDocuments({ status: 'unread' });

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      unread,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update message status (admin)
// @route   PUT /api/contact/:id
const updateMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.status(200).json({ success: true, message });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message (admin)
// @route   DELETE /api/contact/:id
const deleteMessage = async (req, res, next) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitMessage, getMessages, updateMessage, deleteMessage };
