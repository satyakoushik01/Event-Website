const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  createBooking,
  getMyBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking,
  getAllBookingsAdmin,
} = require('../controllers/bookingController');

// User
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);

// Admin (static paths before /:id)
router.get('/admin/all', protect, adminOnly, getAllBookingsAdmin);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/status', protect, adminOnly, updateBookingStatus);

router.get('/:id/ticket-pdf', protect, async (req, res, next) => {
  try {
    const booking = await require('../models/Booking').findById(req.params.id).populate('event');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const { generatePDFTicket } = require('../services/ticketService');
    const pdfDoc = generatePDFTicket({ booking, event: booking.event, ticketId: booking.ticketId, qrDataUrl: booking.qrDataUrl }); // use stored QR data URL
    res.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
