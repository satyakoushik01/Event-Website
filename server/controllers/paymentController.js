const crypto = require('crypto');
const Razorpay = require('razorpay');
const Transaction = require('../models/Transaction');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a Razorpay order for a booking
// @route   POST /api/payments/create-order
const createOrder = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Booking ID is required' });
    }

    const booking = await Booking.findById(bookingId).populate('vendor', 'businessName');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Only the booking owner can pay
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to pay for this booking' });
    }

    // Prevent double payment
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'This booking has already been paid' });
    }

    // Only confirmed or pending bookings can be paid
    if (['cancelled', 'completed'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: 'Cannot pay for a cancelled or completed booking' });
    }

    const amountInPaise = Math.round(booking.totalAmount * 100);
    const receipt = `rcpt_${booking._id.toString().slice(-8)}_${Date.now()}`;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        bookingId: booking._id.toString(),
        userId: req.user.id,
        vendorName: booking.vendor?.businessName || '',
      },
    });

    // Store transaction record
    await Transaction.create({
      booking: booking._id,
      user: req.user.id,
      razorpayOrderId: order.id,
      amount: booking.totalAmount,
      currency: 'INR',
      receipt,
      status: 'created',
      notes: { bookingId: booking._id.toString() },
    });

    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      booking: {
        id: booking._id,
        vendor: booking.vendor?.businessName,
        totalAmount: booking.totalAmount,
      },
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/payments/verify
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    // Find the transaction
    const transaction = await Transaction.findOne({ razorpayOrderId: razorpay_order_id });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (isValid) {
      // Update transaction
      transaction.razorpayPaymentId = razorpay_payment_id;
      transaction.razorpaySignature = razorpay_signature;
      transaction.status = 'captured';
      await transaction.save();

      // Update booking payment status and attach ticket info
      const ticketId = require('../services/ticketService').generateTicketId();
      const { qrDataUrl, payload } = await require('../services/ticketService').generateQRCode(ticketId);

      // Update booking with ticket details
      const updatedBooking = await Booking.findByIdAndUpdate(
        transaction.booking,
        {
          paymentStatus: 'paid',
          status: 'confirmed',
          confirmedAt: Date.now(),
          ticketId,
          qrReference: payload,
          qrDataUrl,
        },
        { new: true }
      ).populate('vendor', 'businessName').populate('user', 'name email phone');

      // Generate PDF ticket
      const event = await require('../models/Event').findById(updatedBooking.event);
      const pdfDoc = require('../services/ticketService').generatePDFTicket({
        booking: updatedBooking,
        event,
        ticketId,
        qrDataUrl,
      });

      // Prepare PDF buffer
      const chunks = [];
      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      pdfDoc.on('end', async () => {
        const pdfBuffer = Buffer.concat(chunks);

        // Send email with PDF attachment
        const emailHtml = `<p>Dear ${updatedBooking.user.name},</p>
          <p>Your booking for <strong>${event.title}</strong> is confirmed.</p>
          <p>Ticket ID: ${ticketId}</p>`;
        await require('../services/notificationService').sendEmail(
          updatedBooking.user.email,
          'Your MomentsHub Ticket Confirmation',
          emailHtml,
          [{ filename: `${ticketId}.pdf`, content: pdfBuffer }]
        );

        // Send SMS
        const smsBody = `MomentsHub: Booking confirmed for ${event.title} on ${new Date(updatedBooking.date).toLocaleDateString()}. Ticket ID: ${ticketId}`;
        await require('../services/notificationService').sendSMS(updatedBooking.user.phone, smsBody);
      });

      // Create notification for the user (existing)
      await Notification.create({
        user: transaction.user,
        title: 'Payment Successful',
        message: `Your payment of ₹${transaction.amount.toLocaleString()} for ${booking?.vendor?.businessName || 'your booking'} was successful. Ticket ID: ${ticketId}`,
        type: 'payment',
        link: `/dashboard/bookings/${transaction.booking}`,
      });

      // Respond to client (do not wait for email/SMS streams to finish)
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        ticketId,
        qrDataUrl,
      });

    } else {
      // Mark transaction as failed
      transaction.status = 'failed';
      transaction.failureReason = 'Signature verification failed';
      await transaction.save();

      res.status(400).json({
        success: false,
        message: 'Payment verification failed. Signature mismatch.',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment history for a booking
// @route   GET /api/payments/booking/:bookingId
const getBookingPayments = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({
      booking: req.params.bookingId,
    }).sort('-createdAt');

    res.status(200).json({ success: true, transactions });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, verifyPayment, getBookingPayments };
