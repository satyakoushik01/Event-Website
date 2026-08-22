const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      enum: [
        'Weddings',
        'Birthday Parties',
        'Engagements',
        'Anniversaries',
        'Corporate Events',
        'Baby Showers',
        'Housewarming Ceremonies',
        'College Events',
        'Cultural Events',
        'Concerts',
      ],
    },
    services: [
      {
        name: String,
        price: Number,
        description: String,
      },
    ],
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    eventLocation: {
      venue: String,
      address: String,
      city: String,
      state: String,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    guestCount: {
      type: Number,
      default: 0,
    },
    specialRequirements: {
      type: String,
      maxlength: [500, 'Special requirements cannot exceed 500 characters'],
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partial', 'paid'],
      default: 'unpaid',
    },
    cancellationReason: String,
    confirmedAt: Date,
    completedAt: Date,
    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ vendor: 1, status: 1 });
bookingSchema.index({ eventDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
