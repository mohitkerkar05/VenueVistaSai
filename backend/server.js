const express = require('express');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const multer = require('multer');  // Import multer
const path = require('path');      // Import path

const app = express();
const port = 5000;

// Serve static images from the correct folder
app.use('/images', express.static(path.join(__dirname, '../src/images')));
// console.log(path.join(__dirname, '../src/images'));

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
MongoClient.connect(url)
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
mongoose.connect('mongodb://localhost:27017/TEST')
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

// app.post('/api/insertOrUpdateUser', async (req, res) => {
//   const { username, name, email, phone, DOB, password, address, Country } = req.body;

//   try {
//     const existingUser = await User.findOne({ username });

//     if (existingUser) {
//       // Update existing user
//       await User.updateOne({ username }, { name, email, phone, DOB, password, address, Country });
//       return res.json({ success: true, message: 'User details updated successfully' });
//     } else {
//       // Insert new user
//       const newUser = new User({ username, name, email, phone, DOB, password, address, Country });
//       await newUser.save();
//       return res.json({ success: true, message: 'User details inserted successfully' });
//     }
//   } catch (error) {
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// });


























// Define the schema for the 'bookings' collection
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: Number, required: true },
  guestCount: { type: Number, required: true },
  budget: { type: Number, required: false },
  catering: { type: Boolean, required: false },
  additionalRequests: { type: String, required: false }
});

// Create a model for 'bookings'
const Bookings = mongoose.model('bookings', bookingSchema);

// // POST request to add booking details to the 'bookings' collection


// app.post('/api/bookings', async (req, res) => {
//   try {
//     const bookingData = new Bookings({
//       name: req.body.name,
//       phone: req.body.phone,
//       email: req.body.email,
//       date: req.body.date,
//       time: req.body.time,
//       duration: req.body.duration,
//       guestCount: req.body.guestCount,
//       budget: req.body.budget,
//       catering: req.body.catering,
//       additionalRequests: req.body.additionalRequests
//     });

//     // Save the booking data to the database
//     const savedBooking = await bookingData.save();
//     res.status(201).json({ message: 'Booking saved successfully', booking: savedBooking });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to save booking', error });
//   }
// });

// POST request to add booking details to the 'bookings' collection
// app.post('/api/bookings', async (req, res) => {
//   try {
//     const { date, time, duration } = req.body;

//     // Parse date and time
//     const bookingStart = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
//     const bookingEnd = bookingStart.clone().add(duration, 'hours');

//     // Query to find overlapping bookings
//     const conflictingBooking = await Bookings.findOne({
//       date: bookingStart.toDate(), // Check for the same date
//       $or: [
//         {
//           time: {
//             $gte: time, 
//             $lt: bookingEnd.format('HH:mm') // Booking starts before current booking ends
//           }
//         },
//         {
//           $where: function() {
//             // Custom query to check for overlap
//             const existingStart = moment(this.date + ' ' + this.time);
//             const existingEnd = existingStart.clone().add(this.duration, 'hours');
//             return existingEnd.isAfter(bookingStart) && existingStart.isBefore(bookingEnd);
//           }
//         }
//       ]
//     });

//     if (conflictingBooking) {
//       // return res.status(400).json({
//       //   message: 'The selected date and time are unavailable for booking.'
//       // });
//       alert('The selected date and time are unavailable for booking.')
//     }

//     // No conflict, proceed with booking
//     const bookingData = new Bookings({
//       name: req.body.name,
//       phone: req.body.phone,
//       email: req.body.email,
//       date: req.body.date,
//       time: req.body.time,
//       duration: req.body.duration,
//       guestCount: req.body.guestCount,
//       budget: req.body.budget,
//       catering: req.body.catering,
//       additionalRequests: req.body.additionalRequests
//     });

//     console.log(bookingData);

//     // Save the booking data to the database
//     const savedBooking = await bookingData.save();
//     res.status(201).json({ message: 'Booking saved successfully', booking: savedBooking });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to save booking', error });
//   }
// });

// POST request to add booking details to the 'bookings' collection



const moment = require('moment');

app.post('/api/bookings', async (req, res) => {
  try {
    const { 
      name, 
      phone, 
      email, 
      date, 
      time, 
      duration, 
      guestCount, 
      budget, 
      catering, 
      additionalRequests 
    } = req.body;

    // Parse date and time using moment
    const bookingStart = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
    const bookingEnd = bookingStart.clone().add(duration, 'hours');

    // Validate the booking start and end times
    if (!bookingStart.isValid() || !bookingEnd.isValid()) {
      return res.status(400).json({ message: 'Invalid date or time' });
    }

    // Convert times to strings in 'HH:mm' format for comparison
    const bookingStartTimeString = bookingStart.format('HH:mm');
    const bookingEndTimeString = bookingEnd.format('HH:mm');

    // Query to find overlapping bookings
    const conflictingBooking = await Bookings.findOne({
      date: bookingStart.toDate(), // Check for the same date
      $or: [
        {
          // Compare time as strings in 'HH:mm' format
          time: { 
            $gte: bookingStartTimeString, 
            $lt: bookingEndTimeString 
          }
        },
        {
          // Ensure time is being handled correctly in duration comparisons
          $expr: {
            $and: [
              { 
                $lt: [
                  {
                    $add: [
                      { $dateFromString: { dateString: `${bookingStart.format('YYYY-MM-DD')} ${time}` } }, // Combine date and time for valid date
                    ],
                  },
                  bookingEnd.toDate() 
                ] 
              },
              { 
                $gt: [
                  { $dateFromString: { dateString: `${bookingStart.format('YYYY-MM-DD')} ${time}` } }, // Combine date and time for valid date
                  bookingStart.toDate() 
                ] 
              }
            ]
          }
        }
      ]
    });

    // If a conflicting booking is found, respond with an error
    if (conflictingBooking) {
      return res.status(400).json({ message: 'The selected date and time are unavailable for booking.' });
    }

    // Create booking data
    const bookingData = new Bookings({
      name,
      phone,
      email,
      date: bookingStart.toDate(), // Save as Date object
      time: bookingStartTimeString, // Save time in correct format
      duration,
      guestCount,
      budget,
      catering,
      additionalRequests
    });

    // Save the booking data to the database
    const savedBooking = await bookingData.save();
    res.status(201).json({ message: 'Booking saved successfully', booking: savedBooking });
    
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ message: 'Failed to save booking', error: error.message }); // Return a specific error message
  }
});
















//Registering User on website
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body; // Extract username and password from request body

  // Simple validation check
  if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
      const usersCollection = db.collection('User'); // Assuming you have a users collection
      const existingUser = await usersCollection.findOne({ username }); // Check if user already exists

      if (existingUser) {
          return res.status(409).json({ message: 'User already exists.' });
      }

      // Insert the new user into the database
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with 10 salt rounds
      await usersCollection.insertOne({ username, password: hashedPassword }); // Store hashed password
      res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Error registering user: ' + error.message });
  }
});

//for user login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Validate that both fields are provided
  if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
      const usersCollection = db.collection('User'); // Access User collection
      const user = await usersCollection.findOne({ username });

      // If user does not exist
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      // Compare the entered password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid credentials.' });
      }

      // If credentials are correct, respond with a success message
      res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Error during login: ' + error.message });
  }
});




























app.post('/generate-receipt', async (req, res) => {
  const bookingInfo = req.body;  // Get the booking info sent from frontend
  // You can add any necessary logic here to format or save the booking data
  
  // Generate a response with the receipt details
  res.json({ success: true, receiptData: bookingInfo });
});



// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
