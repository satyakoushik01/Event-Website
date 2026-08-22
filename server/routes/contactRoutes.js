const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  submitMessage,
  getMessages,
  updateMessage,
  deleteMessage,
} = require('../controllers/contactController');

router.post('/', submitMessage);
router.get('/', protect, adminOnly, getMessages);
router.put('/:id', protect, adminOnly, updateMessage);
router.delete('/:id', protect, adminOnly, deleteMessage);

module.exports = router;
