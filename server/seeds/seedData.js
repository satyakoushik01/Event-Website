const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const ContactMessage = require('../models/ContactMessage');
const Notification = require('../models/Notification');

dotenv.config();

const createMany = async (Model, docs) => {
  const created = [];
  for (const doc of docs) {
    created.push(await Model.create(doc));
  }
  return created;
};

const seed = async (shouldExit = (require.main === module)) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany(),
      Vendor.deleteMany(),
      Event.deleteMany(),
      Booking.deleteMany(),
      Review.deleteMany(),
      ContactMessage.deleteMany(),
      Notification.deleteMany(),
    ]);

    console.log('Creating users...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@momentsevents.com',
      password: 'admin123',
      phone: '+91 9876543210',
      role: 'admin',
      isEmailVerified: true,
    });

    const user = await User.create({
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: 'user123',
      phone: '+91 9123456789',
      role: 'user',
      isEmailVerified: true,
      address: {
        street: '12 MG Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India',
      },
    });

    console.log('Creating vendors...');
    const vendors = await createMany(Vendor, [
      // ─── DECORATION ───────────────────────────────────────────────────────
      {
        businessName: 'Royal Decor Studio',
        description: 'Premium wedding and event decoration specialists with 10+ years of experience. We create breathtaking floral arrangements, grand stage designs, and immersive environments that leave lasting impressions.',
        category: 'Decoration',
        services: [
          { name: 'Classic Floral Decor', description: 'Elegant stage and entrance with seasonal florals', price: 45000, unit: 'per event' },
          { name: 'Grand Stage Setup', description: 'Full stage with backdrop, lighting, and floral canopy', price: 120000, unit: 'per event' },
          { name: 'Signature Luxury Package', description: 'Complete venue transformation with bespoke installations', price: 250000, unit: 'per event' },
        ],
        coverImage: { url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80' },
        images: [
          { url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800' },
          { url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800' },
          { url: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800' },
        ],
        contactInfo: { email: 'royal@decor.com', phone: '+91 9988776655', whatsapp: '919988776655', website: 'www.royaldecor.com' },
        location: { city: 'Mumbai', state: 'Maharashtra', address: '14, Bandra West', country: 'India' },
        priceRange: { min: 45000, max: 250000 },
        eventTypes: ['Weddings', 'Engagements', 'Anniversaries', 'Corporate Events'],
        rating: 4.8, totalReviews: 142, status: 'approved', featured: true,
        completedEvents: 450, yearsOfExperience: 12, availability: true,
      },
      {
        businessName: 'Petal & Dream Decor',
        description: 'Bespoke floral design studio crafting immersive event environments. From intimate engagements to grand weddings, every petal is placed with intention and artistry.',
        category: 'Decoration',
        services: [
          { name: 'Garden Theme Setup', description: 'Botanical paradise with fresh blooms and greenery', price: 60000, unit: 'per event' },
          { name: 'Royal Mandap Design', description: 'Ornate mandap with marigold and rose canopy', price: 95000, unit: 'per event' },
          { name: 'Full Venue Styling', description: 'End-to-end venue transformation for 300+ guests', price: 200000, unit: 'per event' },
        ],
        coverImage: { url: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&q=80' },
        images: [
          { url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800' },
          { url: 'https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=800' },
        ],
        contactInfo: { email: 'hello@petaldream.in', phone: '+91 9876001122', whatsapp: '919876001122' },
        location: { city: 'Jaipur', state: 'Rajasthan', address: 'Pink City Lane, C-scheme', country: 'India' },
        priceRange: { min: 60000, max: 200000 },
        eventTypes: ['Weddings', 'Engagements', 'Anniversaries'],
        rating: 4.7, totalReviews: 89, status: 'approved', featured: false,
        completedEvents: 210, yearsOfExperience: 8, availability: true,
      },
      {
        businessName: 'Aura Event Designers',
        description: 'Contemporary event designers blending modern aesthetics with traditional elegance. Specialists in corporate galas, destination weddings, and curated luxury experiences.',
        category: 'Decoration',
        services: [
          { name: 'Corporate Gala Decor', description: 'Sleek, minimalist setup for corporate events', price: 80000, unit: 'per event' },
          { name: 'Destination Wedding Package', description: 'Full décor logistics for destination events', price: 300000, unit: 'per event' },
        ],
        coverImage: { url: 'https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=1200&q=80' },
        images: [{ url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800' }],
        contactInfo: { email: 'info@auradesigners.com', phone: '+91 9812345678', whatsapp: '919812345678' },
        location: { city: 'Delhi', state: 'Delhi', address: 'Hauz Khas Village', country: 'India' },
        priceRange: { min: 80000, max: 300000 },
        eventTypes: ['Weddings', 'Corporate Events', 'Concerts'],
        rating: 4.6, totalReviews: 64, status: 'approved', featured: true,
        completedEvents: 175, yearsOfExperience: 9, availability: true,
      },

      // ─── CATERING ─────────────────────────────────────────────────────────
      {
        businessName: 'Spice Route Catering',
        description: 'Authentic Indian and international cuisine crafted for weddings, corporate events, and private celebrations. Custom menus tailored to every palate and occasion.',
        category: 'Catering',
        services: [
          { name: 'Classic Wedding Feast', description: 'Multi-cuisine buffet for up to 200 guests', price: 120000, unit: 'per event' },
          { name: 'Grand Banquet (500 guests)', description: 'Full service buffet with live counters', price: 250000, unit: 'per event' },
          { name: 'Intimate Gathering', description: 'Fine dining plated service for up to 50 guests', price: 40000, unit: 'per event' },
        ],
        coverImage: { url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&q=80' },
        images: [
          { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800' },
          { url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800' },
        ],
        contactInfo: { email: 'hello@spiceroute.com', phone: '+91 9876501234', whatsapp: '919876501234', website: 'www.spiceroute.in' },
        location: { city: 'Delhi', state: 'Delhi', address: 'Connaught Place', country: 'India' },
        priceRange: { min: 40000, max: 250000 },
        eventTypes: ['Weddings', 'Corporate Events', 'Birthday Parties', 'Anniversaries'],
        rating: 4.6, totalReviews: 138, status: 'approved', featured: true,
        completedEvents: 520, yearsOfExperience: 15, availability: true,
      },
      {
        businessName: 'The Gourmet Table',
        description: 'Michelin-inspired catering for the most discerning hosts. Specializing in European, Mediterranean, and fusion cuisine with impeccable table presentation.',
        category: 'Catering',
        services: [
          { name: 'European Fine Dining', description: '5-course plated dinner with sommelier service', price: 80000, unit: 'per event' },
          { name: 'Fusion Buffet', description: 'Interactive stations with global cuisines', price: 150000, unit: 'per event' },
        ],
        coverImage: { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80' },
        images: [{ url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800' }],
        contactInfo: { email: 'reserve@gourmettable.in', phone: '+91 9900112233', whatsapp: '919900112233' },
        location: { city: 'Bangalore', state: 'Karnataka', address: 'UB City, Vittal Mallya Road', country: 'India' },
        priceRange: { min: 80000, max: 300000 },
        eventTypes: ['Weddings', 'Corporate Events', 'Anniversaries'],
        rating: 4.9, totalReviews: 77, status: 'approved', featured: true,
        completedEvents: 310, yearsOfExperience: 10, availability: true,
      },

      // ─── PHOTOGRAPHY ──────────────────────────────────────────────────────
      {
        businessName: 'LensCraft Photography',
        description: 'Award-winning photography studio capturing your most precious moments with cinematic flair. International portfolio spanning 300+ weddings across India, Bali, and Santorini.',
        category: 'Photography',
        services: [
          { name: 'Essential Coverage', description: '8-hour event photography, 200 edited images', price: 55000, unit: 'per event' },
          { name: 'Premium Wedding Package', description: 'Full day + pre-wedding shoot, cinematic album', price: 120000, unit: 'per event' },
          { name: 'Signature Cinematic', description: '2-day coverage, drone shots, coffee-table album', price: 220000, unit: 'per event' },
        ],
        coverImage: { url: 'https://images.unsplash.com/photo-1492681290082-e932832141be?w=1200&q=80' },
        images: [
          { url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800' },
          { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800' },
        ],
        contactInfo: { email: 'book@lenscraft.com', phone: '+91 9765432109', whatsapp: '919765432109', website: 'www.lenscraftphotos.com' },
        location: { city: 'Bangalore', state: 'Karnataka', address: 'Indiranagar, 100ft Road', country: 'India' },
        priceRange: { min: 55000, max: 220000 },
        eventTypes: ['Weddings', 'Engagements', 'Corporate Events', 'Anniversaries'],
        rating: 4.9, totalReviews: 256, status: 'approved', featured: true,
        completedEvents: 620, yearsOfExperience: 11, availability: true,
      },
      {
        businessName: 'Golden Hour Studios',
        description: 'Documentary-style photographers who believe the best stories are told in quiet moments. Our candid approach captures raw emotion and authentic connections.',
        category: 'Photography',
        services: [
          { name: 'Candid Photography', description: 'Full day candid + 150 edited prints', price: 45000, unit: 'per event' },
          { name: 'Pre-Wedding Outdoor Shoot', description: '6-hour outdoor session at a scenic location', price: 35000, unit: 'per session' },
        ],
        coverImage: { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80' },
        images: [{ url: 'https://images.unsplash.com/photo-1492681290082-e932832141be?w=800' }],
        contactInfo: { email: 'hello@goldenhour.studio', phone: '+91 9654311222', whatsapp: '919654311222' },
        location: { city: 'Udaipur', state: 'Rajasthan', address: 'Lake Palace Road', country: 'India' },
        priceRange: { min: 35000, max: 120000 },
        eventTypes: ['Weddings', 'Engagements', 'Anniversaries'],
        rating: 4.7, totalReviews: 112, status: 'approved', featured: false,
        completedEvents: 280, yearsOfExperience: 7, availability: true,
      },

      // ─── PHOTOGRAPHY & CINEMATOGRAPHY CONTINUED ──────────────────────────
      {
        businessName: 'FrameForge Cinematic',
        description: 'Cinematic wedding films and photography that look and feel like feature movies. Our narrative-driven filmmaking approach creates films your family will watch for generations.',
        category: 'Photography',
        specialty: 'Wedding Photography & Cinematography',
        services: [
          { name: 'Wedding Highlight Film (4K)', description: '5–8 min cinematic highlight reel', price: 75000, unit: 'per event' },
          { name: 'Full Ceremony Film', description: 'Complete ceremony + reception recording', price: 50000, unit: 'per event' },
          { name: 'Drone Aerial Package', description: 'Aerial coverage + highlight film', price: 120000, unit: 'per event' },
        ],
        coverImage: { url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=80' },
        images: [{ url: 'https://images.unsplash.com/photo-1492681290082-e932832141be?w=800' }],
        contactInfo: { email: 'film@frameforge.in', phone: '+91 9700111222', whatsapp: '919700111222', website: 'www.frameforge.in' },
        location: { city: 'Mumbai', state: 'Maharashtra', address: 'Andheri West, Film City Road', country: 'India' },
        priceRange: { min: 50000, max: 200000 },
        eventTypes: ['Weddings', 'Corporate Events', 'Engagements'],
        rating: 4.8, totalReviews: 93, status: 'approved', featured: true,
        completedEvents: 340, yearsOfExperience: 9, availability: true,
      },
      {
        businessName: 'Reelhouse Films',
        description: 'Boutique photography & videography studio with a passion for storytelling. From intimate elopements to grand destination weddings, we capture the essence of every celebration.',
        category: 'Photography',
        specialty: 'Wedding Photography & Cinematography',
        services: [
          { name: 'Classic Wedding Film', description: 'Same-day edit + 4K full day coverage', price: 60000, unit: 'per event' },
          { name: 'Short Film Package', description: 'Artistic 3-min short film for social media', price: 35000, unit: 'per event' },
        ],
        coverImage: { url: 'https://images.unsplash.com/photo-1536240478700-b869ad10e8fe?w=1200&q=80' },
        images: [{ url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800' }],
        contactInfo: { email: 'book@reelhouse.in', phone: '+91 9811223344', whatsapp: '919811223344' },
        location: { city: 'Goa', state: 'Goa', address: 'Panjim, Near Miramar Beach', country: 'India' },
        priceRange: { min: 35000, max: 120000 },
        eventTypes: ['Weddings', 'Anniversaries', 'Engagements'],
        rating: 4.6, totalReviews: 57, status: 'approved', featured: false,
        completedEvents: 180, yearsOfExperience: 6, availability: true,
      },

      // ─── DJ & MUSIC ───────────────────────────────────────────────────────
      {
        businessName: 'Groove Masters DJ',
        description: 'India\'s premier DJ collective for weddings and gala events. Professional sound engineering, international music libraries, and a guarantee to keep every dance floor packed.',
        category: 'DJ & Music',
        services: [
          { name: 'Reception DJ (5 hrs)', description: 'DJ + sound system for reception', price: 35000, unit: 'per event' },
          { name: 'Full Wedding DJ (8 hrs)', description: 'From sangeet to reception — premium sound', price: 65000, unit: 'per event' },
          { name: 'DJ + Live Drummer Combo', description: 'Electrifying DJ set with a live percussionist', price: 95000, unit: 'per event' },
        ],
        coverImage: { url: 'https://images.unsplash.com/photo-1571266028247-a1100f4d83d9?w=1200&q=80' },
        images: [{ url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800' }],
        contactInfo: { email: 'dj@groovemasters.com', phone: '+91 9654321098', whatsapp: '919654321098', website: 'www.groovemasters.in' },
        location: { city: 'Pune', state: 'Maharashtra', address: 'Koregaon Park', country: 'India' },
        priceRange: { min: 35000, max: 95000 },
        eventTypes: ['Weddings', 'Birthday Parties', 'College Events', 'Corporate Events'],
        rating: 4.7, totalReviews: 129, status: 'approved', featured: true,
        completedEvents: 380, yearsOfExperience: 10, availability: true,
      },
      {
        businessName: 'Beats & Strings Orchestra',
        description: 'A luxury live music ensemble blending classical Indian ragas with contemporary jazz and Western influences. Perfect for sophisticated soirées and intimate wedding receptions.',
        category: 'DJ & Music',
        services: [
          { name: 'String Quartet', description: '4-piece classical ensemble for cocktail hour', price: 45000, unit: 'per event' },
          { name: 'Full Jazz Band', description: '7-piece jazz band for evening reception', price: 80000, unit: 'per event' },
        ],
        coverImage: { url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=1200&q=80' },
        images: [{ url: 'https://images.unsplash.com/photo-1571266028247-a1100f4d83d9?w=800' }],
        contactInfo: { email: 'music@beatsstrings.com', phone: '+91 9900223311', whatsapp: '919900223311' },
        location: { city: 'Delhi', state: 'Delhi', address: 'Lodi Colony, Near CGO Complex', country: 'India' },
        priceRange: { min: 45000, max: 150000 },
        eventTypes: ['Weddings', 'Corporate Events', 'Anniversaries', 'Concerts'],
        rating: 4.9, totalReviews: 68, status: 'approved', featured: false,
        completedEvents: 215, yearsOfExperience: 13, availability: true,
      },

      // ─── MAKEUP ARTISTS ───────────────────────────────────────────────────
      {
        businessName: 'Glamour Touch by Priya',
        description: 'Celebrity-endorsed bridal makeup studio specializing in HD, airbrush, and South Indian bridal looks. Over 500 brides transformed with flawless, long-lasting looks.',
        category: 'Makeup Artists',
        services: [
          { name: 'Classic Bridal Makeup', description: 'Full look with trial session included', price: 28000, unit: 'per event' },
          { name: 'Airbrush Bridal Luxury', description: 'HD airbrush + hair styling + draping', price: 55000, unit: 'per event' },
          { name: 'Full Bridal Party Package', description: 'Bride + 4 bridesmaids hair & makeup', price: 90000, unit: 'per event' },
        ],
        coverImage: { url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80' },
        images: [
          { url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800' },
          { url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800' },
        ],
        contactInfo: { email: 'glamour@priyamakeup.com', phone: '+91 9543210987', whatsapp: '919543210987', website: 'www.glamourtouchbypriya.com' },
        location: { city: 'Hyderabad', state: 'Telangana', address: 'Banjara Hills, Road No. 12', country: 'India' },
        priceRange: { min: 28000, max: 90000 },
        eventTypes: ['Weddings', 'Engagements', 'Birthday Parties', 'Anniversaries'],
        rating: 4.9, totalReviews: 233, status: 'approved', featured: true,
        completedEvents: 580, yearsOfExperience: 10, availability: true,
      },
      {
        businessName: 'Artistry by Meera',
        description: 'Editorial and avant-garde makeup artist trained in Mumbai and London. Brings international runway trends to bridal and fashion shoots across India.',
        category: 'Makeup Artists',
        services: [
          { name: 'Editorial Bridal Look', description: 'High-fashion inspired bridal makeup', price: 35000, unit: 'per event' },
          { name: 'Engagement Glam', description: 'Polished, photograph-ready look', price: 15000, unit: 'per event' },
        ],
        coverImage: { url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80' },
        images: [{ url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800' }],
        contactInfo: { email: 'hello@artistrybymeera.com', phone: '+91 9889001122', whatsapp: '919889001122' },
        location: { city: 'Mumbai', state: 'Maharashtra', address: 'Juhu, Near Prithvi Theatre', country: 'India' },
        priceRange: { min: 15000, max: 70000 },
        eventTypes: ['Weddings', 'Engagements', 'Corporate Events'],
        rating: 4.8, totalReviews: 97, status: 'approved', featured: false,
        completedEvents: 290, yearsOfExperience: 8, availability: true,
      },

      // ─── VENUES ───────────────────────────────────────────────────────────
      {
        businessName: 'The Oberoi Grand Terrace',
        description: 'An iconic luxury venue offering opulent banquet halls and terraces with panoramic city views. The gold standard for weddings in India with unmatched hospitality.',
        category: 'Venues',
        services: [
          { name: 'Grand Ballroom (300 guests)', description: 'Chandeliered hall with catering package', price: 500000, unit: 'per day' },
          { name: 'Rooftop Terrace (100 guests)', description: 'Exclusive rooftop for intimate celebrations', price: 250000, unit: 'per day' },
          { name: 'Full Property Buyout', description: 'Exclusive use of entire property for 2 days', price: 1500000, unit: '2 days' },
        ],
        coverImage: { url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80' },
        images: [
          { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800' },
          { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800' },
        ],
        contactInfo: { email: 'events@oberoigrand.com', phone: '+91 9432109876', whatsapp: '919432109876', website: 'www.oberoigrand.com' },
        location: { city: 'Kolkata', state: 'West Bengal', address: '15, Jawaharlal Nehru Road', country: 'India' },
        priceRange: { min: 250000, max: 1500000 },
        eventTypes: ['Weddings', 'Corporate Events', 'Concerts', 'Anniversaries'],
        rating: 4.9, totalReviews: 84, status: 'approved', featured: true,
        completedEvents: 420, yearsOfExperience: 20, availability: true,
      },
      {
        businessName: 'Lakeside Palace Venue',
        description: 'A stunning heritage palace on the banks of Lake Pichola, Udaipur — the ultimate destination wedding venue offering royal splendor and breathtaking lake views.',
        category: 'Venues',
        services: [
          { name: 'Courtyard Ceremony (50 guests)', description: 'Intimate palace courtyard with decor', price: 200000, unit: 'per event' },
          { name: 'Full Palace Wedding (200 guests)', description: 'Complete palace buyout with all amenities', price: 1200000, unit: '2 days' },
        ],
        coverImage: { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80' },
        images: [{ url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800' }],
        contactInfo: { email: 'reservations@lakesidepalace.com', phone: '+91 9876001001', whatsapp: '919876001001' },
        location: { city: 'Udaipur', state: 'Rajasthan', address: 'Pichola Lake Road', country: 'India' },
        priceRange: { min: 200000, max: 1200000 },
        eventTypes: ['Weddings', 'Engagements', 'Anniversaries'],
        rating: 4.9, totalReviews: 61, status: 'approved', featured: true,
        completedEvents: 190, yearsOfExperience: 18, availability: true,
      },

      // ─── ENTERTAINMENT ────────────────────────────────────────────────────
      {
        businessName: 'Stagecraft Entertainment',
        description: 'Full-spectrum event entertainment company featuring Bollywood performers, acrobats, LED dancers, and magic shows. We create moments your guests will talk about forever.',
        category: 'Entertainment',
        services: [
          { name: 'Bollywood Dance Show (30 min)', description: '5-dancer Bollywood performance with costumes', price: 50000, unit: 'per event' },
          { name: 'LED Acrobatics Show', description: 'Stunning LED acrobatics performance (45 min)', price: 80000, unit: 'per event' },
          { name: 'Grand Entertainment Package', description: 'Multiple acts including dance, magic, and comedy', price: 200000, unit: 'per event' },
        ],
        coverImage: { url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80' },
        images: [{ url: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=800' }],
        contactInfo: { email: 'book@stagecraft.in', phone: '+91 9900001234', whatsapp: '919900001234', website: 'www.stagecraft.in' },
        location: { city: 'Mumbai', state: 'Maharashtra', address: 'Andheri East, Marol', country: 'India' },
        priceRange: { min: 50000, max: 200000 },
        eventTypes: ['Weddings', 'Corporate Events', 'Birthday Parties', 'Concerts'],
        rating: 4.7, totalReviews: 115, status: 'approved', featured: true,
        completedEvents: 320, yearsOfExperience: 11, availability: true,
      },
      {
        businessName: 'Magic Moments by Aryan',
        description: 'Award-winning illusionist and close-up magician. Perfect for cocktail hours, gala dinners, and as a surprise act at weddings to absolutely astonish your guests.',
        category: 'Entertainment',
        services: [
          { name: 'Close-Up Magic (1 hr)', description: 'Table-to-table close-up magic for 50 guests', price: 25000, unit: 'per event' },
          { name: 'Stage Illusion Show (45 min)', description: 'Grand stage illusions with audience participation', price: 60000, unit: 'per event' },
        ],
        coverImage: { url: 'https://images.unsplash.com/photo-1462965326201-d02e4f455804?w=1200&q=80' },
        images: [{ url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800' }],
        contactInfo: { email: 'aryan@magicmoments.in', phone: '+91 9988001234', whatsapp: '919988001234' },
        location: { city: 'Delhi', state: 'Delhi', address: 'South Extension, Part II', country: 'India' },
        priceRange: { min: 25000, max: 80000 },
        eventTypes: ['Weddings', 'Birthday Parties', 'Corporate Events', 'Baby Showers'],
        rating: 4.8, totalReviews: 72, status: 'approved', featured: false,
        completedEvents: 260, yearsOfExperience: 8, availability: true,
      },

      // ─── TRANSPORTATION ───────────────────────────────────────────────────
      {
        businessName: 'Royale Rides Luxury Transport',
        description: 'India\'s most prestigious wedding car service. Our immaculately maintained fleet of vintage Rolls-Royces, Bentleys, and classic Jaguars ensures a regal arrival.',
        category: 'Transportation',
        services: [
          { name: 'Vintage Rolls-Royce (4 hrs)', description: 'Classic Silver Shadow with uniformed chauffeur', price: 35000, unit: 'per event' },
          { name: 'Luxury Fleet Package (8 vehicles)', description: 'Complete wedding logistics fleet for the bridal party', price: 180000, unit: 'per event' },
          { name: 'Helicopter Transfer', description: 'Luxury helicopter arrival for the wedding couple', price: 250000, unit: 'per event' },
        ],
        coverImage: { url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80' },
        images: [{ url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800' }],
        contactInfo: { email: 'reserve@royalerides.in', phone: '+91 9111222333', whatsapp: '919111222333', website: 'www.royalerides.in' },
        location: { city: 'Mumbai', state: 'Maharashtra', address: 'Worli, BKC Adjacent', country: 'India' },
        priceRange: { min: 35000, max: 250000 },
        eventTypes: ['Weddings', 'Engagements', 'Corporate Events', 'Anniversaries'],
        rating: 4.8, totalReviews: 98, status: 'approved', featured: true,
        completedEvents: 310, yearsOfExperience: 14, availability: true,
      },
      {
        businessName: 'Heritage Chariots',
        description: 'Traditional bridal procession specialists offering decorated horse-drawn carriages, elephant arrivals (eco-friendly simulation), and classic wedding baraat bands.',
        category: 'Transportation',
        services: [
          { name: 'Decorated Horse Carriage', description: 'Royal carriage for bridal entry', price: 25000, unit: 'per event' },
          { name: 'Baraat Band + Carriage', description: 'Full baraat procession with music and carriage', price: 60000, unit: 'per event' },
        ],
        coverImage: { url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80' },
        images: [{ url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800' }],
        contactInfo: { email: 'hello@heritagechariots.in', phone: '+91 9222333444', whatsapp: '919222333444' },
        location: { city: 'Jaipur', state: 'Rajasthan', address: 'Amer Road, Near Jal Mahal', country: 'India' },
        priceRange: { min: 25000, max: 80000 },
        eventTypes: ['Weddings', 'Engagements'],
        rating: 4.6, totalReviews: 53, status: 'approved', featured: false,
        completedEvents: 190, yearsOfExperience: 9, availability: true,
      },

      // ─── INVITATIONS ──────────────────────────────────────────────────────
      {
        businessName: 'Script & Seal Invitations',
        description: 'Luxury stationery studio crafting bespoke wedding invitations, letterpress cards, and custom packaging. Every piece is a keepsake in its own right.',
        category: 'Invitations',
        services: [
          { name: 'Classic Suite (100 cards)', description: 'Handcrafted invites with matching envelopes', price: 18000, unit: 'per order' },
          { name: 'Letterpress Luxury (100 cards)', description: 'Deep-pressed foil invitations on cotton paper', price: 45000, unit: 'per order' },
          { name: 'Box Invitation Set (50 boxes)', description: 'Premium box invitation with mementos inside', price: 80000, unit: 'per order' },
        ],
        coverImage: { url: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=1200&q=80' },
        images: [
          { url: 'https://images.unsplash.com/photo-1568781818417-52c34ce49ae8?w=800' },
          { url: 'https://images.unsplash.com/photo-1575368139399-0b48cf5d3a5d?w=800' },
        ],
        contactInfo: { email: 'hello@scriptseal.com', phone: '+91 9333444555', whatsapp: '919333444555', website: 'www.scriptandseal.in' },
        location: { city: 'Bangalore', state: 'Karnataka', address: 'Lavelle Road, Richmond Town', country: 'India' },
        priceRange: { min: 18000, max: 80000 },
        eventTypes: ['Weddings', 'Engagements', 'Anniversaries', 'Corporate Events'],
        rating: 4.9, totalReviews: 167, status: 'approved', featured: true,
        completedEvents: 490, yearsOfExperience: 10, availability: true,
      },
      {
        businessName: 'Digital Bloom E-Invites',
        description: 'Stunning animated digital wedding invitations and websites. Perfect for modern couples who want to blend technology with elegance — eco-friendly and beautifully crafted.',
        category: 'Invitations',
        services: [
          { name: 'Custom Digital Invite (Animated)', description: 'WhatsApp & email-ready animated invitation', price: 5000, unit: 'per order' },
          { name: 'Wedding Website + RSVP', description: 'Full wedding website with RSVP management', price: 12000, unit: 'per order' },
          { name: 'Premium Bundle (Invite + Website + Video)', description: 'All-in-one digital wedding suite', price: 20000, unit: 'per order' },
        ],
        coverImage: { url: 'https://images.unsplash.com/photo-1568781818417-52c34ce49ae8?w=1200&q=80' },
        images: [{ url: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800' }],
        contactInfo: { email: 'create@digitalbloom.in', phone: '+91 9444555666', whatsapp: '919444555666' },
        location: { city: 'Chennai', state: 'Tamil Nadu', address: 'Nungambakkam, T Nagar', country: 'India' },
        priceRange: { min: 5000, max: 20000 },
        eventTypes: ['Weddings', 'Engagements', 'Birthday Parties', 'Corporate Events'],
        rating: 4.7, totalReviews: 203, status: 'approved', featured: false,
        completedEvents: 820, yearsOfExperience: 5, availability: true,
      },
    ]);

    console.log('Creating events...');
    const events = await createMany(Event, [
      {
        title: 'Dream Wedding Celebration',
        description:
          'A complete wedding package featuring premium decoration, catering, photography, and entertainment for your special day.',
        category: 'Weddings',
        coverImage: { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800' },
        date: new Date('2026-12-15'),
        location: { venue: 'Grand Vista Banquet', city: 'Jaipur', state: 'Rajasthan', country: 'India' },
        budget: { min: 500000, max: 1500000 },
        services: ['Decoration', 'Catering', 'Photography', 'DJ & Music', 'Makeup Artists'],
        vendors: [vendors[0]._id, vendors[1]._id, vendors[2]._id],
        createdBy: admin._id,
        status: 'published',
        featured: true,
        attendees: { expected: 300 },
        tags: ['wedding', 'luxury', 'destination'],
      },
      {
        title: 'Corporate Annual Gala',
        description:
          'Professional corporate event planning with catering, venue, and entertainment for your annual company celebration.',
        category: 'Corporate Events',
        coverImage: { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800' },
        date: new Date('2026-09-20'),
        location: { venue: 'Tech Park Convention Center', city: 'Bangalore', state: 'Karnataka', country: 'India' },
        budget: { min: 200000, max: 800000 },
        services: ['Catering', 'Venues', 'DJ & Music', 'Photography'],
        vendors: [vendors[1]._id, vendors[5]._id],
        createdBy: admin._id,
        status: 'published',
        featured: true,
        attendees: { expected: 200 },
        tags: ['corporate', 'gala', 'networking'],
      },
      {
        title: 'Birthday Bash Extravaganza',
        description: 'Fun-filled birthday party packages with decoration, catering, and DJ services for all ages.',
        category: 'Birthday Parties',
        coverImage: { url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800' },
        date: new Date('2026-08-10'),
        location: { venue: 'Private Residence', city: 'Mumbai', state: 'Maharashtra', country: 'India' },
        budget: { min: 50000, max: 200000 },
        services: ['Decoration', 'Catering', 'DJ & Music'],
        vendors: [vendors[0]._id, vendors[3]._id],
        createdBy: admin._id,
        status: 'published',
        featured: false,
        attendees: { expected: 50 },
        tags: ['birthday', 'party', 'celebration'],
      },
      {
        title: 'Engagement Ceremony Elegance',
        description: 'Beautiful engagement setups with floral decor, photography, and makeup services.',
        category: 'Engagements',
        coverImage: { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800' },
        date: new Date('2026-11-05'),
        location: { venue: 'Garden Terrace', city: 'Delhi', state: 'Delhi', country: 'India' },
        budget: { min: 100000, max: 400000 },
        services: ['Decoration', 'Photography', 'Makeup Artists'],
        vendors: [vendors[0]._id, vendors[2]._id, vendors[4]._id],
        createdBy: admin._id,
        status: 'published',
        featured: true,
        attendees: { expected: 100 },
        tags: ['engagement', 'romantic', 'elegant'],
      },
    ]);

    user.wishlist = [
      { itemId: vendors[0]._id, itemType: 'Vendor' },
      { itemId: vendors[2]._id, itemType: 'Vendor' },
    ];
    user.savedEvents = [events[0]._id];
    await user.save();

    console.log('Creating bookings...');
    const bookings = await createMany(Booking, [
      {
        user: user._id,
        vendor: vendors[0]._id,
        event: events[0]._id,
        eventType: 'Weddings',
        services: [{ name: 'Stage Decoration', price: 75000, description: 'Full stage setup' }],
        eventDate: new Date('2026-12-15'),
        eventLocation: { venue: 'Grand Vista Banquet', city: 'Jaipur', state: 'Rajasthan' },
        totalAmount: 75000,
        status: 'confirmed',
        guestCount: 300,
        paymentStatus: 'partial',
        confirmedAt: new Date(),
      },
      {
        user: user._id,
        vendor: vendors[2]._id,
        eventType: 'Engagements',
        services: [{ name: 'Pre-Wedding Shoot', price: 35000 }],
        eventDate: new Date('2026-11-01'),
        eventLocation: { city: 'Mumbai', state: 'Maharashtra' },
        totalAmount: 35000,
        status: 'pending',
        guestCount: 50,
        paymentStatus: 'unpaid',
      },
    ]);

    console.log('Creating reviews...');
    await createMany(Review, [
      {
        user: user._id,
        vendor: vendors[0]._id,
        booking: bookings[0]._id,
        rating: 5,
        title: 'Absolutely stunning decor!',
        comment:
          'Royal Decor Studio transformed our venue into a fairy tale. Every detail was perfect and the team was incredibly professional.',
        status: 'approved',
      },
      {
        user: user._id,
        vendor: vendors[2]._id,
        rating: 5,
        title: 'Best photographers ever',
        comment: 'LensCraft captured every moment beautifully. Highly recommend for weddings!',
        status: 'approved',
      },
    ]);

    await ContactMessage.create({
      name: 'Rahul Mehta',
      email: 'rahul@example.com',
      phone: '+91 9012345678',
      subject: 'Wedding Planning Inquiry',
      message: 'I am planning a wedding for December 2026 in Mumbai. Can you help with a complete package?',
      status: 'unread',
    });

    await Notification.create({
      user: user._id,
      title: 'Booking Confirmed',
      message: 'Your booking with Royal Decor Studio has been confirmed.',
      type: 'booking',
      link: `/dashboard/bookings/${bookings[0]._id}`,
    });

    console.log('\n✅ Seed data created successfully!\n');
    console.log('Login credentials:');
    console.log('  Admin: admin@momentsevents.com / admin123');
    console.log('  User:  priya@example.com / user123');
    console.log(`\n  ${vendors.length} vendors, ${events.length} events, ${bookings.length} bookings\n`);

    if (shouldExit) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Seed error:', error);
    if (shouldExit) {
      process.exit(1);
    }
  }
};

module.exports = seed;

if (require.main === module) {
  seed(true);
}
