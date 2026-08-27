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
        'DJ & Music',
        'Makeup Artists',
        'Venues',
        'Entertainment',
        'Transportation',
        'Invitations',
      ],
    },
    specialty: {
      type: String,
      default: '',
    },
    shortDescription: {
      type: String,
      default: '',
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    quickStats: {
      yearsExperience: { type: Number, default: 5 },
      eventsCompleted: { type: Number, default: 120 },
      venuesServed: { type: Number, default: 25 },
      citiesCovered: { type: Number, default: 8 },
      photosDelivered: { type: String, default: '250K+' },
      awardsCount: { type: Number, default: 8 },
      menusCount: { type: Number, default: 50 },
    },
    verification: {
      businessVerified: { type: Boolean, default: true },
      portfolioReviewed: { type: Boolean, default: true },
      contactVerified: { type: Boolean, default: true },
      informationVerified: { type: Boolean, default: true },
      reviewsReviewed: { type: Boolean, default: true },
      policiesAccepted: { type: Boolean, default: true },
    },
    packages: [
      {
        id: String,
        name: String,
        price: Number,
        priceLabel: String,
        isPopular: Boolean,
        description: String,
        features: [String],
        inclusions: [String],
      },
    ],
    featuredEvents: [
      {
        title: String,
        clientNames: String,
        location: String,
        guestCount: Number,
        eventType: String,
        image: String,
        description: String,
      },
    ],
    portfolio: [
      {
        title: String,
        category: String,
        url: String,
      },
    ],
    whyChooseUs: [String],
    videoUrl: String,
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
    policies: [String],
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
