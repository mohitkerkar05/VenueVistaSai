const express = require('express');
const { MongoClient , ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const multer = require('multer');  // Import multer
const path = require('path');      // Import path

const app = express();
const moment = require('moment');

// const port = 5000;
const PORT = process.env.PORT || 5000;

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
// const reviewSchema = new mongoose.Schema({
//   text: { type: String, required: true },
//   rating: { type: Number, required: true },
//   venueId: { type: String, required: true },
//   venueName: { type: String, required: true },
//   venueLocation: { type: String, required: true },
// }, { timestamps: true });

// // Create a model for the Review collection
// const Review = mongoose.model('Review', reviewSchema);

// // POST endpoint to add a review
// app.post('/addReview-to-cluster', async (req, res) => {
//   try {
//     const { text, rating, venueId, venueName, venueLocation } = req.body; // Get all fields from the request body

//     // Create a new review document
//     const newReview = new Review({
//       text,
//       rating,
//       venueId,
//       venueName,
//       venueLocation,
//     });

//     // Save the review to the database
//     const savedReview = await newReview.save();
//     res.status(201).json({ message: 'Review added successfully', review: savedReview });
//   } catch (error) {
//     console.error('Error adding review:', error);
//     res.status(500).json({ error: 'Failed to add review', details: error });
//   }
// });

// // In your Express route handler (server.js)
// app.get('/reviews/:venueId', async (req, res) => {
//   const { venueId } = req.params;
//   try {
//     // Ensure we use the correct query to find reviews based on venueId
//     const reviews = await Review.find({ venueId: venueId }); // Ensure venueId matches exactly
  
//     if (reviews.length > 0) {
//       res.json(reviews); // Return the reviews if found
//     } else {
//       res.status(404).json({ message: 'No reviews found for this venue.' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred while fetching reviews.' });
//   }
// });


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
                         .map(file => `http://localhost:${PORT}/images/${file}`);
    
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
      const imageUrl = `http://localhost:${PORT}/images/${req.file.filename}`;
      res.json({ message: 'Image uploaded successfully', imageUrl });
  } else {
      res.status(400).json({ message: 'Image upload failed' });
  }
});

// app.get('/api/venues/:venueId', async (req, res) => {
//   const { venueId } = req.params; // Extract venueId from request parameters

//   try {
//       const collection = db.collection('venues'); // Replace with your collection name
//       const venue = await collection.findOne({ venueId: venueId }); // Find document by venueId

//       if (venue) {
//           res.json(venue); // Return the venue document if found
//       } else {
//           res.status(404).json({ message: 'Venue not found' }); // Return a 404 if no venue found
//       }
//   } catch (error) {
//       console.error('Error fetching venue:', error);
//       res.status(500).json({ error: 'An error occurred while fetching the venue.' });
//   }
// });

// app.get('/api/venues/', async (req, res) => {
//   try {
//       const collection = db.collection('venues'); // Replace with your collection name
//       const venues = await collection.find({}).toArray(); // Fetch all documents

//       if (venues.length > 0) {
//           res.json(venues); // Return all venues if found
//       } else {
//           res.status(404).json({ message: 'No venues found' }); // Return a 404 if no venues found
//       }
//   } catch (error) {
//       console.error('Error fetching venues:', error);
//       res.status(500).json({ error: 'An error occurred while fetching the venues.' });
//   }
// });

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
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


































































































require('dotenv').config();

// Middleware to parse JSON
app.use(express.json());
// Enable CORS for all routes
app.use(cors());

const uri = process.env.MONGODB_URI; // Get the connection string from .env

const client = new MongoClient(uri, {
  tls: true, // Enable TLS
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  tlsInsecure:true,
});

async function connectWithMongoClient() {
    try {
        await client.connect();
        console.log('Connected to MongoDB using MongoClient');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

// Call the connect function
connectWithMongoClient().catch(console.dir);


// Define the schema for the 'bookings' collection
// const newbookingSchema = new mongoose.Schema({
//   occasion: { type: String, required: true },        // Required field for occasion
//     date: { type: Date, required: true },              // Required field for date
//     time: { type: String, required: true },             // Required field for time
//     duration: { type: Number, required: true },         // Required field for duration
//     guestCount: { type: Number, required: true },       // Required field for guest count
//     budget: { type: Number, required: false },          // Optional field for budget
//     catering: { type: String, required: false },       // Optional field for catering (boolean)
//     drinks: { type: String, required: false },          // Optional field for drinks
//     name: { type: String, required: true },             // Required field for name
//     phone: { type: String, required: true },            // Required field for phone
//     email: { type: String, required: true },            // Required field for email
//     additionalRequests: { type: String, required: false } // Optional field for additional requests
// });

// Create a model for 'bookings'
// const Bookings = mongoose.model('bookings-new', newbookingSchema);

// const Bookings = mongoose.model('Bookings', bookingSchema);

// app.get('/get-bookings-news-from-cluster', async (req, res) => { 
//   try {
//     // Access the bookings collection in your MongoDB Atlas cluster
//     const collection = client.db("VenueVista").collection("Bookings"); // Replace with your actual database and collection names

//     // Query to find reviews based on venueId
//     const Bookings = await collection.find({}).toArray(); // Convert cursor to array

//     if (Bookings.length > 0) {
//       res.json(Bookings); // Return the reviews if found
//     } else {
//       res.status(404).json({ message: 'No Bookings found!' });
//     }
//   } catch (error) {
//     console.error('Error fetching Bookings:', error);
//     res.status(500).json({ error: 'An error occurred while fetching Bookings.' });
//   }
// });

// POST request to add booking details to the 'bookings' collection
// app.post('/bookings-new-to-cluster', async (req, res) => {
//   try {
//     const {
//       occasion,
//       date,
//       time,
//       duration,
//       guestCount,
//       budget,
//       catering,
//       drinks,
//       name,
//       phone,
//       email,
//       additionalRequests
//     } = req.body;

//     // Parse date and time using moment
//     const bookingStart = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
//     const bookingEnd = bookingStart.clone().add(duration, 'hours');

//     // Validate the booking start and end times
//     if (!bookingStart.isValid() || !bookingEnd.isValid()) {
//       return res.status(400).json({ message: 'Invalid date or time' });
//     }

//     // Convert times to strings in 'HH:mm' format for comparison
//     const bookingStartTimeString = bookingStart.format('HH:mm');
//     const bookingEndTimeString = bookingEnd.format('HH:mm');

//     // Query to find overlapping bookings
//     const conflictingBooking = await Bookings.findOne({
//       date: bookingStart.toDate(), // Check for the same date
//       $or: [
//         {
//           // Compare time as strings in 'HH:mm' format
//           time: {
//             $gte: bookingStartTimeString,
//             $lt: bookingEndTimeString
//           }
//         },
//         {
//           // Check if the current booking time overlaps with any existing bookings
//           $expr: {
//             $and: [
//               { $gt: [moment(bookingEnd).toDate(), '$date'] }, // bookingEnd must be after existing booking's date
//               { $lt: [moment(bookingStart).toDate(), { $add: ['$date', { $multiply: ['$duration', 3600000] }] }] } // bookingStart must be before the existing booking's end time
//             ]
//           }
//         }
//       ]
//     });

//     // If a conflicting booking is found, respond with an error
//     if (conflictingBooking) {
//       return res.status(400).json({ message: 'The selected date and time are unavailable for booking.' });
//     }

//     // Create booking data
//     const bookingData = new Bookings({
//       occasion,
//       date: bookingStart.toDate(), // Save as Date object
//       time: bookingStartTimeString, // Save time in correct format
//       duration,
//       guestCount,
//       budget,
//       catering,
//       drinks,
//       name,
//       phone,
//       email,
//       additionalRequests
//     });

//     // Save the booking data to the database
//     const savedBooking = await bookingData.save();
//     res.status(201).json({ message: 'Booking saved successfully', booking: savedBooking });
    
//   } catch (error) {
//     console.error('Error saving booking:', error);
//     res.status(500).json({ message: 'Failed to save booking', error: error.message }); // Return a specific error message
//   }
// });

app.post('/bookings-new-to-cluster', async (req, res) => {
  try {
    const {
      occasion,
      date,
      time,
      duration,
      guestCount,
      budget,
      catering,
      drinks,
      name,
      phone,
      email,
      additionalRequests,
      venueName
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

    await client.connect();
    const collection = client.db("VenueVista").collection("Bookings");

    // Query to find overlapping bookings
    const conflictingBooking = await collection.findOne({
      date: bookingStart.toDate(),
      $or: [
        {
          time: {
            $gte: bookingStartTimeString,
            $lt: bookingEndTimeString
          }
        },
        {
          $expr: {
            $and: [
              { $gt: [moment(bookingEnd).toDate(), '$date'] },
              { $lt: [moment(bookingStart).toDate(), { $add: ['$date', { $multiply: [{ $toDouble: '$duration' }, 3600000] }] }] }
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
    const bookingData = {
      occasion,
      date: bookingStart.toDate(),
      time: bookingStartTimeString,
      duration,
      guestCount,
      budget,
      catering,
      drinks,
      name,
      phone,
      email,
      additionalRequests,
      venueName
    };

    // Save the booking data to the database
    const result = await collection.insertOne(bookingData);
    res.status(201).json({ message: 'Booking saved successfully', booking: { _id: result.insertedId, ...bookingData } });
    
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ message: 'Failed to save booking', error: error.message });
  } finally {
    await client.close(); // Ensure the MongoDB connection is closed after the request
  }
});

// POST endpoint to add a review
app.post('/addReview-to-cluster', async (req, res) => {
  try {
    const { text, rating, venueId, venueName, venueLocation } = req.body;

    console.log(text,rating,venueId,venueName,venueLocation);

    // Validate required fields
    if (!text || !rating || !venueId || !venueName || !venueLocation) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create a new review document
    const newReview = {
      text,
      rating,
      venueId,
      venueName,
      venueLocation,
      createdAt: new Date(), // Adds the current date and time
    };

    // Access the reviews collection in your MongoDB Atlas cluster
    const collection = client.db("VenueVista").collection("Reviews");

    // Save the review to the database
    const savedReview = await collection.insertOne(newReview);
    res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Failed to add review', details: error });
  }
});


// In your Express route handler (server.js)
app.get('/reviews-from-cluster/:venueId', async (req, res) => { 
  const { venueId } = req.params;

  try {
    // console.log('Searching for reviews with venueId:', venueId); // Log the venueId being searched
    // Access the reviews collection in your MongoDB Atlas cluster
    const collection = client.db("VenueVista").collection("Reviews"); // Replace with your actual database and collection names

    // Query to find reviews based on venueId
    const reviews = await collection.find({ venueId: venueId }).toArray(); // Convert cursor to array

    if (reviews.length > 0) {
      res.json(reviews); // Return the reviews if found
    } else {
      res.status(404).json({ message: 'No reviews found for this venue.' });
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'An error occurred while fetching reviews.' });
  }
});


// Set up routes
app.get('/', (req, res) => {
    res.send('Hello World');
});


app.get('/managers', async (req, res) => {
    try {
        const managerCollection = client.db("VenueVista").collection("Manager");
        const managers = await managerCollection.find({}).toArray();
        res.json(managers);
    } catch (error) {
        console.error('Error fetching managers:', error);
        res.status(500).send('Error fetching managers');
    }
});

app.get('/users', async (req, res) => {
  try {
    const user= client.db("VenueVista").collection("User");
    const users = await user.find({}).toArray(); // Fetch all documents
    res.json(users); // Return the venues as JSON
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Error fetching users');
  }
});


app.get('/venues-from-cluster', async (req, res) => {
  try {
    const user= client.db("VenueVista").collection("venues1");
    const users = await user.find({}).toArray(); // Fetch all documents
    res.json(users); // Return the venues as JSON
  } catch (error) {
    console.error('Error fetching Venues:', error);
    res.status(500).send('Error fetching Venues');
  }
});

app.get('/venues-from-cluster/:venueId', async (req, res) => {
  const { venueId } = req.params; // Extract venueId from request parameters

  try {
      const collection = client.db("VenueVista").collection("venues1");
      const venue = await collection.findOne({ venueId: venueId });

      if (venue) {
          console.log(venue); // Log the found venue
          return res.json(venue); // Return the venue document if found
      } else {
          return res.status(404).json({ message: 'Venue not found' }); // Return a 404 if no venue found
      }

  } catch (error) {
      console.error('Error fetching venue:', error);
      return res.status(500).json({ error: 'An error occurred while fetching the venue.' });
  }
});



const saltRounds = 10; // Define saltRounds before using it in bcrypt.hash
//Register User
app.post('/api/register-user', async (req, res) => {
  const { username, password, email, name ,contactnumber} = req.body;

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const database = client.db('VenueVista');
    // console.log(database);
    const userCollection = database.collection('User'); // Use your collection name

    const newUser = {
      username,
      password: hashedPassword, // Store the hashed password
      email,
      name,
      contactnumber,
    };

    await userCollection.insertOne(newUser);
    return res.json({ success: true, message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error registering User:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});


// API endpoint to register a manager
app.post('/api/register-manager', async (req, res) => {
    const { name, email, contactNumber, age, category, venueName } = req.body;

    try {
        const trimmedVenueName = venueName.trim();
        const trimmedCategory = category.trim();

        const database = client.db('VenueVista');
        const venueCollection = database.collection('Venues');

        const venue = await venueCollection.findOne({
            "Venue Name": trimmedVenueName,
            "Category": trimmedCategory,
        });

        if (!venue) {
            return res.status(400).json({ success: false, message: 'Venue not found or category mismatch.' });
        }

        const newManager = {
            name,
            email,
            contact_number: contactNumber,
            age,
            category: trimmedCategory,
            venueId: venue._id,
            venue_name: trimmedVenueName,
        };

        const managerCollection = database.collection('Manager');
        await managerCollection.insertOne(newManager);

        return res.json({ success: true, message: 'Manager registered successfully!' });
    } catch (error) {
        console.error('Error registering manager:', error);
        return res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
});

// Start the server
// app.listen(PORT, async () => {
//     await connectWithMongoClient(); // Ensures MongoDB is connected before starting the server
//     console.log(`Server is running on port ${PORT}`);
// });

//shreyash

// const customerSchema = new mongoose.Schema({
//   username: String,
//   name: String,
//   email: String,
//   phone: String,
// });

// const Customer = mongoose.model('Customer', customerSchema);
// app.get('/api/User', async (req, res) => {
//   try {
//       const User = await Customer.find();
//       res.json(customers);
//   } catch (error) {
//       console.error("Error fetching customers:", error);
//       res.status(500).json({ message: 'Error fetching customers' });
//   }
// });

// // Delete a customer by username
// app.delete('/api/User/username/:username', async (req, res) => {
//   const { username } = req.params;
//   console.log("Received delete request for username:", username); // Log the username

//   try {
//       const deletedCustomer = await Customer.findOneAndDelete({ username });
//       if (!deletedCustomer) {
//           return res.status(404).json({ message: 'Customer not found' });
//       }
//       res.status(200).json({ message: 'Customer deleted successfully' });
//   } catch (err) {
//       console.error("Error deleting customer:", err);
//       res.status(500).json({ message: 'Error deleting customer' });
//   }
// });
// const ManagerSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   name: { type: String, required: true },
//   phone: { type: String, required: true },
//   email: { type: String, required: true },
//   password: { type: String, required: true },
//   venueName: { type: String, required: true } // Assuming a manager has a venue name
// });

// const VenueSchema = new mongoose.Schema({
//   venueName: { type: String, required: true, unique: true },
//   venueAddress: { type: String, required: true },
//   price: { type: Number, required: true },
//   additionalServices: { type: [String], default: [] }
// });

// const Manager = mongoose.model('Manager', ManagerSchema);
// const Venue = mongoose.model('Venue', VenueSchema);

// // Routes

// // Get all managers
// app.get('/api/managers', async (req, res) => {
//   try {
//       const managers = await Manager.find();
//       res.json(managers);
//   } catch (error) {
//       res.status(500).json({ message: 'Failed to fetch managers' });
//   }
// });

// // Get venue details by manager username
// app.get('/api/venue/manager/:venueName', async (req, res) => {
//   try {
//       const manager = await Manager.findOne({ username: req.params.username });
//       if (!manager) {
//           return res.status(404).json({ message: 'Manager not found' });
//       }
//       const venue = await Venue.findOne({ venueName: manager.venueName });
//       res.json(venue);
//   } catch (error) {
//       res.status(500).json({ message: 'Failed to fetch venue details' });
//   }
// });

// // Get venue details by venue name
// app.get('/api/venue/venueName/:venueName', async (req, res) => {
//   try {
//       const venue = await Venue.findOne({ venueName: req.params.venueName });
//       if (!venue) {
//           return res.status(404).json({ message: 'Venue not found' });
//       }
//       res.json(venue);
//   } catch (error) {
//       res.status(500).json({ message: 'Failed to fetch venue details' });
//   }
// });

// // Delete a manager by username
// app.delete('/api/managers/username/:username', async (req, res) => {
//   try {
//       const result = await Manager.findOneAndDelete({ username: req.params.username });
//       if (!result) {
//           return res.status(404).json({ message: 'Manager not found' });
//       }
//       res.json({ message: 'Manager deleted successfully!' });
//   } catch (error) {
//       res.status(500).json({ message: 'Failed to delete manager' });
//   }
// });