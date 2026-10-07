const mongoose = require('mongoose');

let isConnected = false;
let memoryServerInstance = null;

const connectDB = async () => {
  if (isConnected) return;

  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai_learning_assistant';

  // 1. Try configured MONGODB_URI first with a short timeout
  try {
    console.log(`[DB] Attempting connection to MongoDB at: ${mongoURI.replace(/:([^@]+)@/, ':****@')}`);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500,
    });
    isConnected = true;
    console.log(`[DB] MongoDB Connected successfully: ${conn.connection.host}`);
    return;
  } catch (error) {
    console.warn(`[DB] Standard MongoDB connection failed (${error.message}).`);
    console.log('[DB] Initializing fallback embedded MongoMemoryServer for offline viva/demo mode...');
  }

  // 2. Fallback to MongoMemoryServer so the app runs without external MongoDB installed
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServerInstance = await MongoMemoryServer.create();
    const uri = memoryServerInstance.getUri();
    console.log(`[DB] MongoMemoryServer started at: ${uri}`);
    await mongoose.connect(uri);
    isConnected = true;
    console.log('[DB] MongoMemoryServer connected successfully! Running in high-reliability demo mode.');

    // Auto-seed initial demo data in memory
    const { seedInitialData } = require('../utils/seedData');
    await seedInitialData();
  } catch (memError) {
    console.error('[DB] MongoMemoryServer also failed to initialize:', memError.message);
    console.warn('[DB] Operating in mock-data memory fallback mode.');
  }
};

const disconnectDB = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    if (memoryServerInstance) {
      await memoryServerInstance.stop();
    }
    isConnected = false;
  }
};

module.exports = { connectDB, disconnectDB };
