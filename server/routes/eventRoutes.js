const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getEvents,
  getEvent,
  getEventsByCategory,
  createEvent,
  updateEvent,
  deleteEvent,
  getFeaturedEvents,
} = require('../controllers/eventController');

// Public
router.get('/featured', getFeaturedEvents);
router.get('/category/:category', getEventsByCategory);
router.get('/', getEvents);
router.get('/:id', getEvent);

// Protected
router.post('/', protect, adminOnly, createEvent);
router.put('/:id', protect, adminOnly, updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);

module.exports = router;
