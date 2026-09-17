const Razorpay = require('razorpay');
const Booking = require('../models/Booking');

/**
 * Initialize Razorpay instance using env variables.
 */
function getRazorpayInstance() {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials are not set in environment');
  }
  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
}

/**
 * Create a Razorpay order for a given booking.
 * The booking must already have totalAmount (including tax & convenience fee).
 * Returns the Razorpay order object.
 */
async function createRazorpayOrder(bookingId, userId) {
  // Validate booking ownership
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error('Booking not found');
  }
  if (booking.user.toString() !== userId) {
    throw new Error('Not authorized to create order for this booking');
  }
  if (booking.paymentStatus === 'paid') {
    throw new Error('Booking already paid');
  }

  const amountInPaise = Math.round(booking.totalAmount * 100);
  const receipt = `rcpt_${booking._id.toString().slice(-8)}_${Date.now()}`;

  const razorpay = getRazorpayInstance();
  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt,
    notes: {
      bookingId: booking._id.toString(),
      userId: userId,
    },
  });

  // Store transaction (callers may store separately; keep here for convenience)
  const Transaction = require('../models/Transaction');
  await Transaction.create({
    booking: booking._id,
    user: userId,
    razorpayOrderId: order.id,
    amount: booking.totalAmount,
    currency: 'INR',
    receipt,
    status: 'created',
    notes: { bookingId: booking._id.toString() },
  });

  return order;
}

module.exports = {
  createRazorpayOrder,
};
