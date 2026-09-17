const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Event category is required'],
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
    shortDescription: { type: String, maxlength: 300 },
    isMomentsOriginal: { type: Boolean, default: false },
    organizer: { type: String },
    venue: { type: String },
    dates: [{ type: Date }],
    showTimings: [{ type: String }],
    duration: { type: String },
    language: { type: String },
    ageRestriction: { type: String },
    ticketTypes: [{
        category: { type: String, required: true },
        price: { type: Number, required: true },
        capacity: { type: Number, required: true },
        available: { type: Number, required: true },
    }],
    attendees: { expected: { type: Number, default: 0 }, confirmed: { type: Number, default: 0 } },
    bookingStatus: { type: String, enum: ['OPEN','CLOSED'], default: 'OPEN' },
    terms: { type: String },
    cancellationPolicy: { type: String },
    deletedAt: { type: Date, default: null },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    coverImage: {
      url: String,
      publicId: String,
    },
    date: {
      type: Date,
    },
    location: {
      venue: String,
      address: String,
      city: String,
      state: String,
      country: { type: String, default: 'India' },
    },
    budget: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
    },
    services: [
      {
        type: String,
        enum: [
          'Decoration',
          'Catering',
          'Photography',
          'Videography',
          'DJ & Music',
          'Makeup Artists',
          'Venues',
          'Entertainment',
          'Transportation',
          'Invitations',
        ],
      },
    ],
    vendors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'completed', 'cancelled'],
      default: 'published',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

eventSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

eventSchema.index({ title: 'text', description: 'text', category: 'text' });
eventSchema.index({ category: 1, status: 1 });
eventSchema.index({ slug: 1, status: 1, bookingStatus: 1, deletedAt: 1 });

module.exports = mongoose.model('Event', eventSchema);
