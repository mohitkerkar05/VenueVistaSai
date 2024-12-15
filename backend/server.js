const express = require('express');
const { MongoClient , ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();



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


// app.get('/managers', async (req, res) => {
//     try {
//         const managerCollection = client.db("VenueVista").collection("Manager");
//         const managers = await managerCollection.find({}).toArray();
//         res.json(managers);
//     } catch (error) {
//         console.error('Error fetching managers:', error);
//         res.status(500).send('Error fetching managers');
//     }
// });

// app.get('/users', async (req, res) => {
//   try {
//     const user= client.db("VenueVista").collection("User");
//     const users = await user.find({}).toArray(); // Fetch all documents
//     res.json(users); // Return the venues as JSON
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).send('Error fetching users');
//   }
// });


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
// app.post('/api/register-user', async (req, res) => {
//   const { username, password, email, name ,contactnumber} = req.body;

//   try {
//     // Hash the password before storing it
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const database = client.db('VenueVista');
//     // console.log(database);
//     const userCollection = database.collection('User'); // Use your collection name

//     const newUser = {
//       username,
//       password: hashedPassword, // Store the hashed password
//       email,
//       name,
//       contactnumber,
//     };

//     await userCollection.insertOne(newUser);
//     return res.json({ success: true, message: 'User registered successfully!' });
//   } catch (error) {
//     console.error('Error registering User:', error);
//     return res.status(500).json({ success: false, message: 'Server error during registration.' });
//   }
// });


// // API endpoint to register a manager
// app.post('/api/register-manager', async (req, res) => {
//     const { name, email, contactNumber, age, category, venueName } = req.body;

//     try {
//         const trimmedVenueName = venueName.trim();
//         const trimmedCategory = category.trim();

//         const database = client.db('VenueVista');
//         const venueCollection = database.collection('Venues');

//         const venue = await venueCollection.findOne({
//             "Venue Name": trimmedVenueName,
//             "Category": trimmedCategory,
//         });

//         if (!venue) {
//             return res.status(400).json({ success: false, message: 'Venue not found or category mismatch.' });
//         }

//         const newManager = {
//             name,
//             email,
//             contact_number: contactNumber,
//             age,
//             category: trimmedCategory,
//             venueId: venue._id,
//             venue_name: trimmedVenueName,
//         };

//         const managerCollection = database.collection('Manager');
//         await managerCollection.insertOne(newManager);

//         return res.json({ success: true, message: 'Manager registered successfully!' });
//     } catch (error) {
//         console.error('Error registering manager:', error);
//         return res.status(500).json({ success: false, message: 'Server error during registration.' });
//     }
// });


app.get('/venues', async (req, res) => {
  try {
    const venuesCollection = client.db("VenueVista").collection("Venues");
    const venues = await venuesCollection.find({}).toArray(); // Fetch all documents
    res.json(venues); // Return the venues as JSON
  } catch (error) {
    console.error('Error fetching venues:', error);
    res.status(500).send('Error fetching venues');
  }
});


// Route to get all venues from the Venues collection
app.get('/venues1', async (req, res) => {
  try {
    const venues1Collection = client.db("VenueVista").collection("venues1");
    const venues1 = await venues1Collection.find({}).toArray(); // Fetch all documents
    res.json(venues1); // Return the venues as JSON
  } catch (error) {
    console.error('Error fetching venues:', error);
    res.status(500).send('Error fetching venues');
  }
});


// Route to managers
app.get('/managers', async (req, res) => {
  try {
    const manager= client.db("VenueVista").collection("Manager");
    const managers = await manager.find({}).toArray(); // Fetch all documents
    res.json(managers); // Return the venues as JSON
  } catch (error) {
    console.error('Error fetching manager:', error);
    res.status(500).send('Error fetching manager');
  }
});

//Route to Users
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

app.get('/bookings', async (req, res) => {
  try {
    const bookingsCollection = client.db("VenueVista").collection("Bookings");
    const bookings = await bookingsCollection.find({}).toArray(); // Fetch all documents
    res.json(bookings); // Return the venues as JSON
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).send('Error fetching bookings');
  }
});


app.get('/reviews', async (req, res) => {
  try {
    const reviewsCollection = client.db("VenueVista").collection("Reviews");
    const reviews = await reviewsCollection.find({}).toArray(); // Fetch all documents
    res.json(reviews); // Return the venues as JSON
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).send('Error fetching bookings');
  }
});

app.get('/reviews-main', async (req, res) => {
  try {
      const reviewsCollection = client.db("VenueVista").collection("Reviews");
      const reviews = await reviewsCollection.find({ venueName: "Advik Banquets" }).toArray(); // Fetch only documents with venueName "Advik Banquets"
      res.json(reviews); // Return the filtered reviews as JSON
  } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).send('Error fetching reviews');
  }
});


app.get('/reviews-backup', async (req, res) => {
try {
    const reviewsCollection = client.db("VenueVista").collection("Reviews");
    const reviews = await reviewsCollection.find({ venueName: "Mohit Banquets and Plaza" }).toArray(); // Fetch only documents with venueName "Advik Banquets"
    res.json(reviews); // Return the filtered reviews as JSON
} catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).send('Error fetching reviews');
}
});


app.get('/bookings-main', async (req, res) => {
try {
  const bookingsCollection = client.db("VenueVista").collection("Bookings");
  const bookings = await bookingsCollection.find({ venueName: "Advik Banquets" }).toArray(); // Fetch only documents with venueName "Advik Banquets"
  res.json(bookings); // Return the filtered reviews as JSON
} catch (error) {
  console.error('Error fetching reviews:', error);
  res.status(500).send('Error fetching reviews');
}
});






// API endpoint to register a manager
app.post('/api/register-manager', async (req, res) => {
const { name, email, contactNumber, age, password, venueName } = req.body;

try {
const hashedPassword = await bcrypt.hash(password, saltRounds);
const trimmedVenueName = venueName.trim();

console.log(`Venue search parameters: Name - ${trimmedVenueName}`);

const database = client.db('VenueVista');
const venueCollection = database.collection('venues1');

const venue = await venueCollection.findOne({
"venueName": trimmedVenueName,
});

console.log('Database venue found:', venue);

if (!venue) {
return res.status(400).json({ success: false, message: 'Venue not found.' });
}

const newManager = {
name,
email,
contact_number: contactNumber,
age,
manager_password: hashedPassword,
venueId: venue._id,
venueName: trimmedVenueName,
};

const managerCollection = database.collection('Manager');
await managerCollection.insertOne(newManager);

return res.json({ success: true, message: 'Manager registered successfully!' });
} catch (error) {
console.error('Error registering manager:', error);
return res.status(500).json({ success: false, message: 'Server error during registration.' });
}
});




//user register
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

//user delete
app.post('/api/delete-user', async (req, res) => {
const { username } = req.body; // Assuming you want to delete by userName, you can change this to userId or email, etc.

if (!username) {
return res.status(400).json({ success: false, message: 'User name is required for deletion.' });
}

try {
const database = client.db('VenueVista');
const userCollection = database.collection('User');

// Delete user based on the userName
const result = await userCollection.deleteOne({ username: username });

if (result.deletedCount === 1) {
return res.json({ success: true, message: 'User deleted successfully!' });
} else {
return res.status(404).json({ success: false, message: 'User not found.' });
}
} catch (error) {
console.error('Error deleting User:', error);
return res.status(500).json({ success: false, message: 'Server error during deletion.' });
}
});


//manager delete
app.post('/api/delete-manager', async (req, res) => {
const { name } = req.body; // Assuming you want to delete by userName, you can change this to userId or email, etc.

if (!name) {
return res.status(400).json({ success: false, message: 'Manager name is required for deletion.' });
}

try {
const database = client.db('VenueVista');
const managerCollection = database.collection('Manager');

// Delete user based on the userName
const result = await managerCollection.deleteOne({ name: name});

if (result.deletedCount === 1) {
return res.json({ success: true, message: 'manager deleted successfully!' });
} else {
return res.status(404).json({ success: false, message: 'Manager not found.' });
}
} catch (error) {
console.error('Error deleting Manager:', error);
return res.status(500).json({ success: false, message: 'Server error during deletion.' });
}
});


// User login
// Login Route
app.post('/api/user-login', async (req, res) => {
const { username, password } = req.body;

const database = client.db('VenueVista');
const userCollection = database.collection('User');

try {
// Find user by username
const user = await userCollection.findOne({ username });
if (!user || !(await bcrypt.compare(password, user.password))) {
return res.status(401).json({ success: false, message: 'Invalid credentials' });
}

// Generate JWT token
const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
return res.json({ success: true, token });
} catch (error) {
console.error("Error during user login:", error);
return res.status(500).json({ success: false, message: 'Internal server error' });
}
});

//authorizaation of jwt token
// Middleware to verify token
const authenticateToken = (req, res, next) => {
const token = req.headers['authorization']?.split(' ')[1];
if (!token) return res.sendStatus(401); // Unauthorized
jwt.verify(token, 'your_secret_key', (err, user) => {
if (err) return res.sendStatus(403); // Forbidden
req.user = user;
next();
});
};

// Protected Route Example
// app.get('/api/protected', authenticateToken, (req, res) => {
//   res.json({ message: 'This is a protected route', userId: req.user.userId });
// });


// Logout Route (Optional)
app.post('/api/logout', (req, res) => {
// No action needed for logout since JWT is stateless
res.json({ success: true, message: 'Logged out successfully' });
});



//manager login
// Manager Login Route


// Manager Login Route
// Manager Login Route
app.post('/api/manager-login', async (req, res) => {
const { username, password } = req.body; // Using username for venue_name and password

const database = client.db('VenueVista');
const managerCollection = database.collection('Manager'); // The collection name is Manager

try {
// Find manager by "venue_name"
const manager = await managerCollection.findOne({ "venueName": username });

// Check if manager exists and verify password
if (!manager || !(await bcrypt.compare(password, manager.manager_password))) {
return res.status(401).json({ success: false, message: 'Invalid credentials' });
}

// Generate JWT token
const token = jwt.sign({ managerId: manager._id, venueName: manager.venueName }, process.env.JWT_SECRET, { expiresIn: '1h' });

console.log('Generated JWT Token:', token); // Log the generated token

return res.json({ success: true, token });
} catch (error) {
console.error('Error during manager login:', error);
return res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
}
});

// Fetch Reviews Route
// app.get('/api/reviews-on-manager', async (req, res) => {
//   const token = req.headers['authorization']?.split(' ')[1]; // Assuming token is sent in the Authorization header

//   console.log('Received JWT Token:', token); // Log the received token

//   if (!token) {
//     return res.status(401).json({ success: false, message: 'No token provided' });
//   }

//   try {
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
//     const venueName = decodedToken.venueName; // Get the venueName from the token

//     const reviewsCollection = client.db("VenueVista").collection("Reviews");
//     const reviews = await reviewsCollection.find({ venueName }).toArray(); // Fetch reviews specific to the venue

//     res.json(reviews); // Return the filtered reviews as JSON
//   } catch (error) {
//     console.error('Error fetching reviews:', error);
//     res.status(500).json({ success: false, message: 'Error fetching reviews' });
//   }
// });


