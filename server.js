// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const nodemailer = require('nodemailer');


require('dotenv').config();
const { connectDB, getFeaturesCollection, getServicesCollection, getPricingCollection, getContactCollection } = require('./db');
const { ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());


// Configure Nodemailer with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'trainingweb0@gmail.com',
    pass: 'Web0Training' // Use an App Password if 2FA is enabled
  }
});


// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // unique file name
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

const port = process.env.PORT || 3000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/rony', express.static(path.join(__dirname, 'rony')));

// Connect to MongoDB
connectDB();

// ✅ GET all features
app.get('/features', async (req, res) => {
  try {
    const featuresCollection = getFeaturesCollection();
    const features = await featuresCollection.find({}).toArray();
    res.json(features);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch features' });
  }
});

// ✅ CREATE a new feature
app.post('/features', async (req, res) => {
  try {
    const featuresCollection = getFeaturesCollection();
    const { icon, title, description } = req.body;

    if (!icon || !title || !description) {
      return res.status(400).json({ error: 'icon, title and description are required' });
    }

    const result = await featuresCollection.insertOne({ icon, title, description });
    res.status(201).json({ message: 'Feature created', featureId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create feature' });
  }
});

// ✅ UPDATE a feature by ID
app.put('/features/:id', async (req, res) => {
  try {
    const featuresCollection = getFeaturesCollection();
    const { id } = req.params;
    const { icon, title, description } = req.body;

    const result = await featuresCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { icon, title, description } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Feature not found' });
    }

    res.json({ message: 'Feature updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update feature' });
  }
});

// ✅ DELETE a feature by ID
app.delete('/features/:id', async (req, res) => {
  try {
    const featuresCollection = getFeaturesCollection();
    const { id } = req.params;

    const result = await featuresCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Feature not found' });
    }

    res.json({ message: 'Feature deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete feature' });
  }
});


// Endpoint to list all images
app.get('/images', (req, res) => {
  const uploadsDir = path.join(__dirname, 'uploads');

  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to scan folder' });
    }

    // Filter only image files (optional)
    const images = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext);
    });

    // Return full URLs
    const imageUrls = images.map(img => `${req.protocol}://${req.get('host')}/uploads/${img}`);
    res.json(imageUrls);
  });
});



app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({
    message: 'File uploaded successfully',
    fileUrl: `https://localhost:3000/uploads/${req.file.filename}`
  });
});



// Endpoint to send email
app.post('/send-email', async (req, res) => {
  const { name, subject, message, to } = req.body;

  if (!name || !subject || !message || !to) {
    return res.status(400).json({ error: 'Name, subject, message, and recipient email are required.' });
  }

  const mailOptions = {
    from: 'trainingweb0@gmail.com',
    to, // recipient email
    subject: subject,
    text: `Name: ${name}\n\nMessage:\n${message}`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.json({ success: true, info });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// // Start server
// app.listen(port, () => {
//   console.log(`Server running at https://localhost:${port}`);
// });

//Get all services
app.get('/services', async (req, res) => {
  try {
    const servicesCollection = getServicesCollection();
    const services = await servicesCollection.find({}).toArray();
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

//Create a service
app.post('/services', async (req, res) => {
  try {
    const servicesCollection = getServicesCollection();
    const { icon, title, description, delay } = req.body;

    if (!icon || !title || !description) {
      return res.status(400).json({ error: 'icon, title, and description are required' });
    }

    const result = await servicesCollection.insertOne({ icon, title, description, delay });
    res.status(201).json({ message: 'Service created', serviceId: result.insertedId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

//Update Service
app.put('/services/:id', async (req, res) => {
  try {
    const servicesCollection = getServicesCollection();
    const { id } = req.params;
    const { icon, title, description, delay } = req.body;

    const result = await servicesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { icon, title, description, delay } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ message: 'Service updated' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

//Delete Service
app.delete('/services/:id', async (req, res) => {
  try {
    const servicesCollection = getServicesCollection();
    const { id } = req.params;

    const result = await servicesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ message: 'Service deleted' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});


// ✅ GET all pricing plans
app.get('/pricing', async (req, res) => {
  try {
    const pricingCollection = getPricingCollection();
    const plans = await pricingCollection.find({}).toArray();
    res.json(plans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch pricing plans' });
  }
});

// ✅ CREATE a pricing plan
app.post('/pricing', async (req, res) => {
  try {
    const pricingCollection = getPricingCollection();
    const { name, description, price, unit, featured, cta_text, cta_link, features } = req.body;

    if (!name || !price || !unit) {
      return res.status(400).json({ error: 'Name, price, and unit are required' });
    }

    const result = await pricingCollection.insertOne({
      name,
      description: description || '',
      price,
      unit,
      featured: featured || false,
      cta_text: cta_text || 'Buy Now',
      cta_link: cta_link || '#',
      features: features || []
    });

    res.status(201).json({ message: 'Pricing plan created', planId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create pricing plan' });
  }
});

// ✅ UPDATE a pricing plan by ID
app.put('/pricing/:id', async (req, res) => {
  try {
    const pricingCollection = getPricingCollection();
    const { id } = req.params;
    const { name, description, price, unit, featured, cta_text, cta_link, features } = req.body;

    const result = await pricingCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, description, price, unit, featured, cta_text, cta_link, features } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Pricing plan not found' });
    }

    res.json({ message: 'Pricing plan updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update pricing plan' });
  }
});

// ✅ DELETE a pricing plan by ID
app.delete('/pricing/:id', async (req, res) => {
  try {
    const pricingCollection = getPricingCollection();
    const { id } = req.params;

    const result = await pricingCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Pricing plan not found' });
    }

    res.json({ message: 'Pricing plan deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete pricing plan' });
  }
});

// GET all contacts
app.get("/contacts", async (req, res) => {
  try {
    const contactCollection = getContactCollection();
    const contacts = await contactCollection.find({}).toArray();
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

// CREATE a new contact
app.post("/contacts", async (req, res) => {
  try {
    const contactCollection = getContactCollection();
    const { location, email, phone } = req.body;

    if (!location || !email || !phone) {
      return res.status(400).json({ error: "location, email, and phone are required" });
    }

    const result = await contactCollection.insertOne({
      location,
      email,
      phone,
      selected: false
    });

    res.status(201).json({ message: "Contact created", id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create contact" });
  }
});

// UPDATE a contact
app.put("/contacts/:id", async (req, res) => {
  try {
    const contactCollection = getContactCollection();
    const { id } = req.params;
    const { location, email, phone } = req.body;

    const result = await contactCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { location, email, phone } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.json({ message: "Contact updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update contact" });
  }
});

// DELETE a contact
app.delete("/contacts/:id", async (req, res) => {
  try {
    const contactCollection = getContactCollection();
    const { id } = req.params;

    const result = await contactCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.json({ message: "Contact deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete contact" });
  }
});

// SELECT a single active contact
app.put("/contacts/select/:id", async (req, res) => {
  try {
    const contactCollection = getContactCollection();
    const { id } = req.params;

    // Unselect all
    await contactCollection.updateMany({}, { $set: { selected: false } });

    // Select only this one
    const result = await contactCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { selected: true } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.json({ message: "Selected contact updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to select contact" });
  }
});