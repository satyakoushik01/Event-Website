const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vendor = require('../models/Vendor');
const User = require('../models/User');

dotenv.config({ path: './.env' });

const categories = [
  'Decoration', 'Catering', 'Photography', 'Videography', 'DJ & Music',
  'Makeup Artists', 'Venues', 'Entertainment', 'Transportation', 'Invitations'
];

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Udaipur', 'Jaipur', 'Goa'];

const vendorsData = [];

// Helper to generate random elements
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate 30 vendors (3 per category)
categories.forEach(category => {
  for (let i = 1; i <= 3; i++) {
    const basePrice = getRandomInt(20, 200) * 1000;
    
    vendorsData.push({
      businessName: `Luxury ${category} ${i} by Moments`,
      description: `We are a premium ${category.toLowerCase()} service dedicated to crafting unforgettable experiences. Our bespoke services ensure every detail is tailored to perfection. Let us bring your vision to life.`,
      category: category,
      services: [
        {
          name: 'Classic Package',
          description: 'Our foundational service offering all the essentials.',
          price: basePrice,
        },
        {
          name: 'Premium Package',
          description: 'An elevated experience with premium enhancements.',
          price: basePrice * 1.5,
        },
        {
          name: 'Signature Luxury Package',
          description: 'The ultimate bespoke experience with dedicated concierge.',
          price: basePrice * 2.5,
        }
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80', publicId: 'sample1' },
        { url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80', publicId: 'sample2' },
        { url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80', publicId: 'sample3' }
      ],
      coverImage: { url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80', publicId: 'cover' },
      logo: { url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200&q=80', publicId: 'logo' },
      contactInfo: {
        email: `contact@luxury${category.replace(/\s+/g, '').toLowerCase()}${i}.com`,
        phone: '+91 98765 43210',
        website: `www.luxury${category.replace(/\s+/g, '').toLowerCase()}${i}.com`,
        whatsapp: '919876543210'
      },
      location: {
        address: `${getRandomInt(1, 100)}, Luxury Avenue`,
        city: getRandom(cities),
        state: 'State',
        zipCode: '100001',
        country: 'India',
      },
      priceRange: {
        min: basePrice,
        max: basePrice * 2.5
      },
      eventTypes: ['Weddings', 'Corporate Events', 'Anniversaries'],
      rating: (Math.random() * (5 - 4.2) + 4.2).toFixed(1), // 4.2 to 5.0
      totalReviews: getRandomInt(10, 150),
      status: 'approved',
      featured: i === 1, // First vendor of each category is featured
      completedEvents: getRandomInt(20, 300),
      yearsOfExperience: getRandomInt(3, 15),
      availability: true,
    });
  }
});

const seedVendors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Delete existing vendors
    await Vendor.deleteMany();
    console.log('Existing vendors cleared');

    // Optional: assign user ID to vendors if you want them linked to an admin
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      vendorsData.forEach(v => v.user = admin._id);
    }

    await Vendor.insertMany(vendorsData);
    console.log(`Successfully seeded ${vendorsData.length} vendors!`);

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedVendors();
