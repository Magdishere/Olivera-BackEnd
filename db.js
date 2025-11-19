const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URL);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log(`Connected to MongoDB: ${process.env.DB_NAME}`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

function getFeaturesCollection() {
  return db.collection(process.env.FEATURES_COLLECTION_NAME);
}

function getServicesCollection() {
  return db.collection(process.env.SERVICES_COLLECTION_NAME);
}

function getPricingCollection() {
  return db.collection(process.env.PRICING_COLLECTION_NAME);
}

function getContactCollection() {
  return db.collection(process.env.CONTACT_COLLECTION_NAME);
}

module.exports = {
  connectDB,
  getFeaturesCollection,
  getServicesCollection,
  getPricingCollection,
  getContactCollection,
};
