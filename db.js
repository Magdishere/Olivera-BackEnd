// db.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

const client = new MongoClient(uri);

let db;
let featuresCollection;
let servicesCollection;
let pricingCollection;

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    featuresCollection = db.collection('features'); // Your collection name
    servicesCollection = db.collection('services');
    pricingCollection = db.collection('pricing');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

function getFeaturesCollection() {
  if (!featuresCollection) {
    throw new Error('Database not connected yet!');
  }
  return featuresCollection;
}
function getServicesCollection() {
  if (!servicesCollection) {
    throw new Error('Database not connected yet!');
  }
  return servicesCollection;
}

function getPricingCollection() {
  if (!pricingCollection) {
    throw new Error('Database not connected yet!');
  }
  return pricingCollection;
}

module.exports = { connectDB, getFeaturesCollection, getServicesCollection, getPricingCollection };
