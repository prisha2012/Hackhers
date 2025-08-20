const mongoose = require('mongoose');

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DB || undefined,
  });
  isConnected = true;
}

module.exports = { connectToDatabase };


