const express = require('express');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const cors = require('cors');

const multer = require('multer');  // Import multer
const path = require('path');      // Import path

const app = express();
const port = 5000;

// Serve static files from the uploads directory
app.use('/images', express.static(path.join(__dirname, '../images')));

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

// MongoDB connection URL and Database
const url = 'mongodb://localhost:27017'; // Your MongoDB URL
const dbName = 'TEST'; // Your database name
let db;

// Optional root route to prevent "Cannot GET /"
app.get('/', (req, res) => {
  res.send('Welcome to the API! Use /api/documents to fetch documents.');
});

// Connect to MongoDB using native driver
MongoClient.connect(url, { useUnifiedTopology: true })
  .then((client) => {
    db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);
  })
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// API Route to get documents from a collection
app.get('/api/documents', async (req, res) => {
  try {
    const collection = db.collection('newtable'); // Your collection name

    // Limit fields and documents
    const documents = await collection.find({})
      .limit(10) // Limit to 10 documents
      .project({
        name: 1,
        email: 1,
        age: 1,
        address: 1,
        interests: 1,
      })
      .toArray();

    res.json(documents);
  } catch (err) {
    res.status(500).send('Error fetching documents');
  }
});

// Fetch all users from 'customers' collection
app.get('/api/getallusers', async (req, res) => {
  try {
    const collection = db.collection('customers');
    const documents = await collection.find({}).toArray();
    console.log(documents);
    res.send(documents);
  } catch (error) {
    res.status(500).send('Error fetching documents.');
  }
});

// Connect to MongoDB with Mongoose for reviews
mongoose.connect('mongodb://localhost:27017/TEST', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Mongoose connected to MongoDB'))
  .catch((err) => console.error('Mongoose connection error:', err));

// Define the Review schema
const reviewSchema = new mongoose.Schema({
  text: { type: String, required: true },
  rating: { type: Number, required: true },
  venueId: { type: String, required: true },
  venueName: { type: String, required: true },
  venueLocation: { type: String, required: true },
}, { timestamps: true });

// Create a model for the Review collection
const Review = mongoose.model('Review', reviewSchema);

// POST endpoint to add a review
app.post('/api/addReview', async (req, res) => {
  try {
    const { text, rating, venueId, venueName, venueLocation } = req.body; // Get all fields from the request body

    // Create a new review document
    const newReview = new Review({
      text,
      rating,
      venueId,
      venueName,
      venueLocation,
    });

    // Save the review to the database
    const savedReview = await newReview.save();
    res.status(201).json({ message: 'Review added successfully', review: savedReview });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Failed to add review', details: error });
  }
});

// In your Express route handler (server.js)
app.get('/reviews/:venueId', async (req, res) => {
  const { venueId } = req.params;
  try {
    // Ensure we use the correct query to find reviews based on venueId
    const reviews = await Review.find({ venueId: venueId }); // Ensure venueId matches exactly
  
    if (reviews.length > 0) {
      res.json(reviews); // Return the reviews if found
    } else {
      res.status(404).json({ message: 'No reviews found for this venue.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching reviews.' });
  }
});


const fs = require('fs');

// Endpoint to list all images
app.get('/images', (req, res) => {
  const imagesDir = path.join(__dirname, '../images'); // Adjust the path as needed
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to scan directory: ' + err });
    }

    // Filter out only image files (optional)
    const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file))
                         .map(file => `http://localhost:${port}/images/${file}`);
    
    res.json(images);
  });
});

// console.log(path.join(__dirname, '../images')); // Add this line
// Configure Multer to store uploaded files in the 'uploads' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname,'../images')); // Store images in 'images' folder
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
  }
});
const upload = multer({ storage: storage });
// Create an endpoint to handle image images
app.post('/upload', upload.single('image'), (req, res) => {
  if (req.file) {
      // Generate the public URL for the uploaded image
      const imageUrl = `http://localhost:${port}/images/${req.file.filename}`;
      res.json({ message: 'Image uploaded successfully', imageUrl });
  } else {
      res.status(400).json({ message: 'Image upload failed' });
  }
});

app.get('/api/venues/:venueId', async (req, res) => {
  const { venueId } = req.params; // Extract venueId from request parameters

  try {
      const collection = db.collection('venues'); // Replace with your collection name
      const venue = await collection.findOne({ venueId: venueId }); // Find document by venueId

      if (venue) {
          res.json(venue); // Return the venue document if found
      } else {
          res.status(404).json({ message: 'Venue not found' }); // Return a 404 if no venue found
      }
  } catch (error) {
      console.error('Error fetching venue:', error);
      res.status(500).json({ error: 'An error occurred while fetching the venue.' });
  }
});

app.get('/api/venues/', async (req, res) => {
  try {
      const collection = db.collection('venues'); // Replace with your collection name
      const venues = await collection.find({}).toArray(); // Fetch all documents

      if (venues.length > 0) {
          res.json(venues); // Return all venues if found
      } else {
          res.status(404).json({ message: 'No venues found' }); // Return a 404 if no venues found
      }
  } catch (error) {
      console.error('Error fetching venues:', error);
      res.status(500).json({ error: 'An error occurred while fetching the venues.' });
  }
});










// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
