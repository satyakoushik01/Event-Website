const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    // Try primary MongoDB URI
    const mongoUri = process.env.MONGO_URI;
    if (mongoUri) {
      await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } else {
      throw new Error('MONGO_URI not set');
    }
  } catch (error) {
    console.warn('Primary DB connection failed, starting in-memory MongoDB...', error.message);
    // Start in-memory server
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log(`In‑memory MongoDB started at ${uri}`);
  }

  // Run seed data if DB is empty
  try {
    const User = require('../models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Database empty. Seeding initial data...');
      const seed = require('../seeds/seedData');
      if (typeof seed === 'function') {
        await seed(false);
      }
    }
  } catch (seedErr) {
    console.error('Seeding error:', seedErr);
  }
};

module.exports = connectDB;
