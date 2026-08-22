const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @desc    Upload single image
// @route   POST /api/upload
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  res.status(200).json({
    success: true,
    url: req.file.path,
    publicId: req.file.filename,
  });
});

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
router.post('/multiple', protect, upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }
  const files = req.files.map((file) => ({
    url: file.path,
    publicId: file.filename,
  }));
  res.status(200).json({ success: true, files });
});

module.exports = router;
