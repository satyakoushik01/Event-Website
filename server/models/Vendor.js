const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: [100, 'Business name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
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
    services: [
      {
        name: { type: String, required: true },
        description: String,
        price: { type: Number, required: true },
        unit: { type: String, default: 'per event' },
      },
    ],
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
    logo: {
      url: String,
      publicId: String,
    },
    contactInfo: {
      email: String,
      phone: String,
      website: String,
      whatsapp: String,
    },
    location: {
      address: String,
      city: { type: String, required: true },
      state: String,
      zipCode: String,
      country: { type: String, default: 'India' },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    priceRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
    },
    eventTypes: [
      {
        type: String,
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
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    completedEvents: {
      type: Number,
      default: 0,
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
    },
    socialMedia: {
      facebook: String,
      instagram: String,
      youtube: String,
      twitter: String,
    },
    availability: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for reviews
vendorSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'vendor',
  justOne: false,
});

// Create slug from business name before save
vendorSchema.pre('save', function (next) {
  if (this.isModified('businessName')) {
    this.slug = this.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for search
vendorSchema.index({ businessName: 'text', description: 'text', category: 'text' });
vendorSchema.index({ category: 1, status: 1 });
vendorSchema.index({ 'location.city': 1 });

module.exports = mongoose.model('Vendor', vendorSchema);
