import { NavLink } from 'react-router-dom';
import './User_Home_Page.css';
import Sidebar from '../User Sidebar/Sidebar';
import React,{ useState, useEffect ,useCallback} from 'react';
import profileimage from '../User Personal Details/user.png';

// Import FontAwesomeIcon component and icons you need
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils,faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

import person1 from './person1.jpeg';
import person2 from './person2.jpeg';
import person3 from './person3.jpeg';

import locationicon from './location.png';
import phone from './phone.png';
import group from './group.png';
import workinghours from './workhours.png';
import veg from './veg.png';
import nonveg from './nonveg.png';
import whatsapp from '../User Contact Admin/whatsapp.png';
import gmail from '../User Contact Admin/gmail.png';
import contactadmin from './customer.png';
import spaghetti from './spaghetti.png';
import mortarpestle from './mortar-pestle.png';
import parking from './parking.png';
import wifi from './wifi.png';


import BookingForm from '../User Book Venue/User_Book_Venue';


function User_Home_Page() {
  const [data, setData] = useState([]); // Venue data
  const [selectedVenue, setSelectedVenue] = useState(null); // Selected venue for modal

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [isReviewMode, setIsReviewMode] = useState(false); // State to track review mode

  const [venueData, setVenueData] = useState(null); // Venue data
  const [text, setText] = useState('');
  const [rating, setRating] = useState(null);
  const [selectedVenueId, setSelectedVenueId] = useState(null); // Selected venue ID

  const [isBookingMode, setIsBookingMode] = useState(false); // State to track booking mode

  const [bookingDetails, setBookingDetails] = useState(null); // State to store booking details

  const [favorites, setFavorites] = useState([]);

  const [showFavorites, setShowFavorites] = useState(false);
// Hook to store selected filter and sorted data
const [selectedFilter, setSelectedFilter] = useState(''); // For storing the selected filter
const [sortedData, setSortedData] = useState([]); // For storing the sorted data

// Function to handle filter selection changes
const handleFilterChange = (e) => {
  setSelectedFilter(e.target.value);
};

// Function to extract the minimum capacity from the capacity string
const getMinCapacity = (capacityRange) => {
  const [minCapacity] = capacityRange.split('-').map(Number); // Split by "-" and convert to number
  return minCapacity;
};

// Sorting function for capacity
const sortByCapacity = (venues, sortOrder) => {
  return [...venues].sort((a, b) => {
    const capacityA = getMinCapacity(a.capacity);
    const capacityB = getMinCapacity(b.capacity);

    if (sortOrder === 'highToLow') {
      return capacityB - capacityA; // High to low
    } else {
      return capacityA - capacityB; // Low to high (if needed)
    }
  });
};

const sortByCostPerHour = (venues, sortOrder) => {
  return [...venues].sort((a, b) => {
    // Split the costperhour string and take the second half
    const costPerHourA = a.costperhour?.split(' ')[1]; // Taking the second part
    const costPerHourB = b.costperhour?.split(' ')[1]; // Taking the second part

    // Convert to number
    const numericCostPerHourA = Number(costPerHourA);
    const numericCostPerHourB = Number(costPerHourB);

    // Log the processed costs
    console.log(numericCostPerHourA, numericCostPerHourB);

    // Handle NaN values (if any)
    if (isNaN(numericCostPerHourA)) return 1; // Treat NaN as lower
    if (isNaN(numericCostPerHourB)) return -1; // Treat NaN as lower

    // Sorting based on order
    if (sortOrder === 'hightoLow') {
      return numericCostPerHourB - numericCostPerHourA; // High to low
    } else {
      return numericCostPerHourA - numericCostPerHourB; // Low to high
    }
  });
};

// Main sort function based on filter
const sortVenues = () => {
  let venuesToSort = [...data]; // Copy the original data

  if (selectedFilter === 'rating') {
    // Sort by rating
    venuesToSort.sort((a, b) => b.rating - a.rating);
  } else if (selectedFilter === 'capacityHigh') {
    // Sort by capacity high to low
    venuesToSort = sortByCapacity(venuesToSort, 'highToLow');
  } else if (selectedFilter === 'capacityLow') {
    // Sort by capacity low to high
    venuesToSort = sortByCapacity(venuesToSort, 'lowToHigh');
  } else if (selectedFilter === 'budgetLow') {
    venuesToSort = sortByCostPerHour(venuesToSort, 'lowtoHigh');
  } else if (selectedFilter === 'budgetHigh') {
    venuesToSort = sortByCostPerHour(venuesToSort, 'hightoLow');
  }

  setSortedData(venuesToSort); // Update the state with sorted data
};
  
  const handleViewFavorites = () => {
    setShowFavorites(prev => !prev);

  };

  const handleWhatsAppClick = () => {
    const phoneNumber = '8657659090'; // Replace with the actual phone number
    const message = 'Hello, I need assistance.'; // Replace with the default message
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    window.open(url, '_blank'); // Opens WhatsApp in a new tab
  };

  const handleEmailClick = () => {
    const email = '2022.sai.rane@ves.ac.in'; // Replace with the admin email
    const subject = 'Help Request'; // Default subject
    const body = 'Hello, I need assistance with...'; // Default message

    // Gmail-specific URL
    const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(gmailURL, '_blank'); // Opens Gmail in a new tab
  };





  //ALL FUNCTIONS FROM USER REVIEW COPY PASTED HERE
  // Fetch venue details based on the selected venue ID
  const fetchVenueDetails = async (id) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
  
    try {
      const response = await fetch(`http://localhost:5001/venues-from-cluster/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
  
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          setVenueData(data);
          setSuccess(true);
        } else {
          setError('Venue data is empty');
        }
      } else {
        throw new Error("Received non-JSON response from server");
      }
    } catch (error) {
      console.error('Fetch error:', error.message);
      setError(`Fetch error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle review submission
  const handleReviewSubmit = async () => {
    if (text.trim() && rating && venueData) {
      try {
        const response = await fetch("http://localhost:5001/addReview-to-cluster", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,     // Review text
            rating,   // Rating
            venueId: venueData.venueId,  // Dynamic venue ID
            venueName: venueData.venueName,  // Venue Name
            venueLocation: venueData.venueLocation  // Venue Location
          }),
        });

        if (response.ok) {
          const result = await response.json();
          alert(result.message); // Display success message
          setText(''); // Clear textarea after submission
          setRating(null); // Clear rating after submission
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error adding review:', error);
        alert('Failed to add review');
      }
    } else {
      alert('Please enter a review, select a rating, and ensure venue details are loaded.');
    }
  };

  // Memoize text input change handler
  const handleTextChange = useCallback((e) => {
    if (e.target.value !== text) {
      setText(e.target.value);
    }
  }, [text]);

  // Component to render venue details
  const VenueDetails = ({ venueData }) => {
    return (
      <div className="venue-information">
        <img src={venueData.imageUrl} alt={venueData.venueName} />
        <p>{venueData.venueId}</p>
        <p>{venueData.venueName}</p>
        <p>{venueData.venueLocation}</p>
      </div>
    );
  };

  const VenueReviews = React.memo(({ venueId }) => {
    const [reviews, setReviews] = useState([]);
    const [sortedReviews, setSortedReviews] = useState([]);
  
    useEffect(() => {
      const fetchReviews = async () => {
        try {
          const response = await fetch(`http://localhost:5001/reviews-from-cluster/${venueId}`);
          const data = await response.json();
          setReviews(data); // Set fetched reviews to state
          setSortedReviews(data); // Set default reviews (before sorting)
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      };
  
      fetchReviews();
    }, [venueId]);
  
    // Sorting Functions
    const handleSortByDateOldToNew = () => {
      const sorted = sortByDateOldToNew(reviews);
      setSortedReviews(sorted);
    };
  
    const handleSortByDateNewToOld = () => {
      const sorted = sortByDateNewToOld(reviews);
      setSortedReviews(sorted);
    };
  
    const handleSortByRating = () => {
      const sorted = sortByRating(reviews);
      setSortedReviews(sorted);
    };
  
    // // Sorting logic
    // const sortByDateOldToNew = (reviews) => {
    //   return [...reviews].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    // };
  
    // const sortByDateNewToOld = (reviews) => {
    //   return [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    // };
  
    // const sortByRating = (reviews) => {
    //   return [...reviews].sort((a, b) => b.rating - a.rating);
    // };

    // Helper function to parse dates safely
const parseDate = (date) => {
  const parsedDate = new Date(date);
  return isNaN(parsedDate) ? null : parsedDate;
};

// Sorting logic
const sortByDateOldToNew = (reviews) => {
  return [...reviews].sort((a, b) => {
    const dateA = parseDate(a.createdAt);
    const dateB = parseDate(b.createdAt);

    // If one or both dates are invalid, place invalid ones at the end
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    return dateA - dateB;
  });
};

const sortByDateNewToOld = (reviews) => {
  return [...reviews].sort((a, b) => {
    const dateA = parseDate(a.createdAt);
    const dateB = parseDate(b.createdAt);

    // If one or both dates are invalid, place invalid ones at the end
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    return dateB - dateA;
  });
};

const sortByRating = (reviews) => {
  return [...reviews].sort((a, b) => b.rating - a.rating);
};

  
    return (
      <div>
        <h3>Reviews for Venue {venueId}</h3>
  
        {/* Sorting Buttons */}
        <div className="sort-buttons-container">
          <button className='new-to-old' onClick={handleSortByDateNewToOld}>Sort by Date: New to Old</button>
          <button className='old-to-new' onClick={handleSortByDateOldToNew}>Sort by Date: Old to New</button>
          <button className='rating' onClick={handleSortByRating}>Sort by Rating</button>
        </div>
  
        {/* Render sorted reviews */}
        {sortedReviews.length > 0 ? (
          <div className="reviews-container">
            {sortedReviews.map((review) => (
              <div key={review._id} className="review-card">
                <div className="profile-image-container">
                  <img className="profile-image" src={profileimage} alt="" />
                </div>
                <div className="review-content-footer-container">
                  <div className="review-content">
                    <p className="review-text">{review.text}</p>
                    <div className="review-rating">
                      {[...Array(5)].map((_, index) => (
                        <span key={index} className={index < review.rating ? 'star filled' : 'star'}>
                          &#9733;
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="review-footer">
                    <p>Venue: {review.venueName}</p>
                    <p>Location: {review.venueLocation}</p>
                    <p>Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='no-review-display'>No reviews found for this venue.</p>
        )}
      </div>
    );
  });
  


  const fetchAllVenues = async () => {
    try {
      const response = await fetch('http://localhost:5001/venues-from-cluster'); // Fetch all venues
      if (!response.ok) {
        throw new Error(`Error fetching venues (Error ${response.status})`);
      }
      const data = await response.json();
      setData(data); // Update state with fetched venue data
    } catch (error) {
      console.error('Error fetching venues:', error);
      alert('Error fetching venues or server issue');
    }
  };

  // Use useEffect to fetch venues when component mounts
  useEffect(() => {
    fetchAllVenues();
  }, []); // Empty dependency array to ensure this runs once on component mount

  // Open modal with selected venue
  const openModal = (venue) => {
    setSelectedVenue(venue);
    setSelectedVenueId(venue.venueId);

    setIsModalOpen(true);
    setIsReviewMode(false); // Reset to venue details
    setIsBookingMode(false); // Reset to venue details
  };

  // useEffect to fetch details when selectedVenueId changes
useEffect(() => {
  if (selectedVenueId) {
    fetchVenueDetails(selectedVenueId);
  }
}, [selectedVenueId]);

// Alert the user only if there's an error, and loading is complete
useEffect(() => {
  if (error && !loading && !success) {
    alert(error);
  }
}, [error, loading, success]);

  // Close modal when clicking outside of the modal content
  const closeModal = (e) => {
    if (e.target.className === 'modal') {
      setIsModalOpen(false);
      setIsReviewMode(false); // Reset to venue details when closed
      setIsBookingMode(false); // Reset to venue details when closed
    }
  };

  // Handle review button click
  const handleLeaveReviewClick = () => {
    setIsModalOpen(true);
    setIsReviewMode(true); // Switch to review mode
    // console.log(venueData);
  };

  // const openBookingDiv = () => {
  //   setIsBookingDivOpen(true);
  // };

  // const closeBookingDiv = (e) => {
  //   if (e.target.className === 'booking-div') {
  //     setIsBookingDivOpen(false);
  //   }
  // };

  const handleBookVenueClick = () => {
    setIsBookingMode(true); // Switch to booking mode

    // Scroll to the section with ID 'scroll-target'
      const targetSection = document.getElementById('scroll-target');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
  };
  // useEffect to scroll into view when booking mode is enabled
  useEffect(() => {
    if (isBookingMode) {
      const targetSection = document.getElementById('scroll-target');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [isBookingMode]); // Triggered when isBookingMode changes

  

  const handleSubmit = async () => {
    const bookingDetails = {
      name: document.getElementById('name').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      date: document.getElementById('date').value,
      time: document.getElementById('time').value,
      duration: document.getElementById('duration').value,
      guestCount: document.querySelector('input[placeholder="Enter your text here"]').value, // Adjust this query for guest count
      budget: document.querySelector('input[placeholder="Enter your text here"]').value, // Adjust this query for budget
      catering: document.getElementById('catering').checked,
      additionalRequests: document.querySelector('.additional-requests input').value,
    };
    setBookingDetails(bookingDetails);
    try {
      const response = await fetch('http://localhost:5001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingDetails),
      });
  
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit booking');
    }

    
  };

  const renderReceipt = () => {
    if (!bookingDetails) return null; // Don't render if booking details are not set
    console.log(bookingDetails);
    return (
      <div className="booking-receipt">
        <h2>Booking Confirmation Details</h2>
        <p><strong>Name:</strong> {bookingDetails.name}</p>
        <p><strong>Phone:</strong> {bookingDetails.phone}</p>
        <p><strong>Email:</strong> {bookingDetails.email}</p>
        <p><strong>Date:</strong> {bookingDetails.date}</p>
        <p><strong>Time:</strong> {bookingDetails.time}</p>
        <p><strong>Duration:</strong> {bookingDetails.duration} hours</p>
        <p><strong>Guest Count:</strong> {bookingDetails.guestCount}</p>
        <p><strong>Budget:</strong> {bookingDetails.budget}</p>
        <p><strong>Catering:</strong> {bookingDetails.catering ? 'Yes' : 'No'}</p>
        <p><strong>Additional Requests:</strong> {bookingDetails.additionalRequests}</p>
      </div>
    );
  };

// Function to handle the toggle of favorites
const handleToggleFavorite = (venue) => {
  setFavorites((prevFavorites) => {
    let updatedFavorites;

    if (prevFavorites.some(fav => fav.venueId === venue.venueId)) {
      // If the venue is already in favorites, remove it
      console.log(`Removed from favorites:`, venue);
      updatedFavorites = prevFavorites.filter(fav => fav.venueId !== venue.venueId);
    } else {
      // Add the venue to favorites
      console.log(`Added to favorites:`, venue);
      updatedFavorites = [...prevFavorites, venue];
    }

    // Log the entire favorites list after adding/removing
    console.log('Updated favorites list:', updatedFavorites);

    return updatedFavorites;
  });
};




  return (
    <>
      <Sidebar />

      <div className="page-contents-div">
        <div className="filter-container-and-side-functionality-container">
          <div className="filter-container">
              <h2>FILTER YOUR SEARCH</h2>

              <div class="filter-category">
                <label for="filter-select">Filter by:</label>
                <select id="filter-select" name="filter-category" onChange={handleFilterChange}>
                  <option value="rating">Rating</option>
                  <option value="capacityHigh">Capacity :  High to Low</option>
                  <option value="capacityLow">Capacity :  Low to High</option>
                  <option value="budgetHigh">Budget : High to Low</option>
                  <option value="budgetLow">Budget : Low to High</option>
                </select>
              </div>


              {/* <div class="filter-box">
                  <p class="filter-title">Filter By</p>
                  <div class="filter-options">
                      <label class="filter-option">
                          <input type="radio" name="filter" value="Pure Veg"/>
                          Pure Veg
                      </label>
                      <label class="filter-option">
                          <input type="radio" name="filter" value="Veg & NonVeg Both"/>
                          Veg & NonVeg Both
                      </label>
                      <label class="filter-option">
                          <input type="radio" name="filter" value="Space on Rent"/>
                          Space on Rent
                      </label>
                      <label class="filter-option">
                          <input type="radio" name="filter" value="Space in Mall"/>
                          Space in Mall
                      </label>
                  </div>
              </div> */}
              <div className="apply-filte-button-container">
                <button className='apply-filter-button' onClick={sortVenues}>Apply Filter</button>
              </div>
          </div>

          <button className="view-favourites-button" onClick={handleViewFavorites}>
              {showFavorites ? "View All Venues" : "View Favourites"}
          </button>

          <div className="contact-admin-functionality-container">
            <div className="contact-admin-image-container">
              <img className="admin-icon" src={contactadmin} alt="" />
              <h4>Contact Admin</h4>
            </div>

            <hr /><hr /><hr /><hr />

            <p>Need Help? Feel free to ask.</p>

            <div className="whatsapp-gmail-links-container">
              <img className='whatsapp-icon' onClick={handleWhatsAppClick} src={whatsapp} alt="" />
              <div className="whatsapp-gmail-text">
                <p>Whatsapp</p>
                <p>Gmail</p>
              </div>
              <img className='gmail-icon' onClick={handleEmailClick} src={gmail} alt="" />
            </div>
          </div>
        </div>

        <div className="complete-venues-container-div">

          <div className="venues-container">
            {showFavorites ? (
              favorites.length > 0 ? (
                favorites.map((venue) => (
                  <div
                    className="venue-card"
                    key={venue.venueId}
                    onClick={() => openModal(venue)} // Open modal on click
                  >
                    <img src={venue.imageUrl} alt={venue.name} className="venue-image" />
                    <div className="venue-details-container">
                      <h3 className="venue-name">{venue.venueName}</h3>

                      <div className="location-details-container">
                        <img className="location-icon" src={locationicon} alt="" />
                        <p className="venue-address">{venue.venueLocation}</p>
                      </div>

                      <div className="venue-additional-information">
                        <div className="contact-details-container">
                          <img className="contact-icon" src={phone} alt="" />
                          <p>Contact Us: {venue.contact}</p>
                        </div>

                        <div className="capacity-details-container">
                          <img className="group-icon" src={group} alt="" />
                          <p>Our Capacity: {venue.capacity}</p>
                        </div>

                        <div className="working-hours-details-container">
                          <img className='working-hours-icon' src={workinghours} alt="" />
                          <p>Our Hours: {venue.operatinghours}</p>
                        </div>
                      </div>
                    </div>

                    <div className="per-plate-price-details-container">
                      <div className="veg-plate-details-container">
                        <img className='veg-icon' src={veg} alt="" />
                        <p>Rs 1500</p>
                      </div>

                      <div className="non-veg-plate-details-container">
                        <img className='non-veg-icon' src={nonveg} alt="" />
                        <p>Rs 2000</p>
                      </div>
                    </div>

                    <div className="rating-and-reviews-container">
                      <div className="rating-container">
                        Average Rating
                      </div>  

                      <div className="reviews-details-container">
                        <p onClick={handleLeaveReviewClick}>Reviews</p> 
                      </div>
                    </div>

                    <div className="star-container">
                      <p>
                        {favorites.some(fav => fav.venueId === venue.venueId) ? 'Remove from Favourites' : 'Add to Favourites'}
                      </p>
                      <input
                        type="checkbox"
                        id={`star-checkbox-${venue.venueId}`} // Use unique ID for each checkbox
                        className="star-checkbox"
                        checked={favorites.some(fav => fav.venueId === venue.venueId)}
                        onChange={() => handleToggleFavorite(venue)} // Toggle favorite
                      />
                      <label htmlFor={`star-checkbox-${venue.venueId}`} className="star-label">
                        <span className="star"></span>
                      </label>
                    </div>
                  </div>
                ))
              ) : (
                <p>No favorites available</p>
              )
            ) : (
              (sortedData.length > 0 ? sortedData : data).length > 0 ? (
                (sortedData.length > 0 ? sortedData : data).map((venue) => (
                  <div
                    className="venue-card"
                    key={venue.venueId}
                    onClick={() => openModal(venue)} // Open modal on click
                  >
                    <img src={venue.imageUrl} alt={venue.name} className="venue-image" />
                    <div className="venue-details-container">
                      <h3 className="venue-name">{venue.venueName}</h3>

                      <div className="location-details-container">
                        <img className="location-icon" src={locationicon} alt="" />
                        <p className="venue-address">{venue.venueLocation}</p>
                      </div>

                      <div className="venue-additional-information">
                        <div className="contact-details-container">
                          <img className="contact-icon" src={phone} alt="" />
                          <p>Contact Us: {venue.contact}</p>
                        </div>

                        <div className="capacity-details-container">
                          <img className="group-icon" src={group} alt="" />
                          <p>Our Capacity: {venue.capacity}</p>
                        </div>

                        <div className="working-hours-details-container">
                          <img className='working-hours-icon' src={workinghours} alt="" />
                          <p>Our Hours: {venue.operatinghours}</p>
                        </div>
                      </div>
                    </div>

                    <div className="per-plate-price-details-container">
                      <div className="veg-plate-details-container">
                        <img className='veg-icon' src={veg} alt="" />
                        <p>Rs 1500</p>
                      </div>

                      <div className="non-veg-plate-details-container">
                        <img className='non-veg-icon' src={nonveg} alt="" />
                        <p>Rs 2000</p>
                      </div>
                    </div>

                    <div className="rating-and-reviews-container">
                      <div className="rating-container">
                        4.2 stars
                      </div>  

                      {/* <div className="reviews-details-container">
                        <p>Reviews</p> 
                      </div> */}
                    </div>

                    <div className="star-container">
                      <p className='star-container-p-element'>
                        {favorites.some(fav => fav.venueId === venue.venueId) ? 'Remove from Favourites' : 'Add to Favourites'}
                      </p>
                      <input
                        type="checkbox"
                        id={`star-checkbox-${venue.venueId}`} // Use unique ID for each checkbox
                        className="star-checkbox"
                        checked={favorites.some(fav => fav.venueId === venue.venueId)}
                        onChange={() => handleToggleFavorite(venue)} // Toggle favorite
                      />
                      <label htmlFor={`star-checkbox-${venue.venueId}`} className="star-label">
                        <span className="star"></span>
                      </label>
                    </div>
                  </div>
                ))
              ) : (
                <p>No venues available</p>
              )
            )}
          </div>
        </div>

      </div>


      {/* Modal for displaying venue details */}
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content-for-venues" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>

            {/* Render review section directly if isReviewMode is true */}
            {isReviewMode ? (
              <div>
                <VenueDetails venueData={venueData} />

                <div className="review-writing-div">
                  <textarea
                    id="review"
                    value={text}
                    onChange={handleTextChange}
                    placeholder="Leave your review about the place here..."
                  />
                  <div className="star-rating-container">
                    <h2>How would you rate your experience here?</h2>
                    <div className="star-rating">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <React.Fragment key={star}>
                          <input
                            type="radio"
                            id={`star${star}`}
                            name="rating"
                            value={star}
                            onChange={() => setRating(star)}
                          />
                          <label htmlFor={`star${star}`} title={`${star} stars`}>
                            &#9733;
                          </label>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <button id="submit" onClick={handleReviewSubmit}>
                    Submit Review
                  </button>
                </div>

                {selectedVenueId && <VenueReviews venueId={selectedVenueId} />}
              </div>
            ) : isBookingMode ? (
              <BookingForm handleSubmit={handleSubmit} renderReceipt={renderReceipt} />
            ) : (
              <>
                      <div className="venue-image-details-container-individual">
                        {/* <div className="venue-image-container">
                          <img src={selectedVenue.imageUrl} alt={selectedVenue.venueName} className="modal-venue-image" />
                        </div> */}

                        {data.length > 0 ? (
                            <div
                              className="venue-card"
                              key={selectedVenue.venueId}
                              onClick={() => openModal(selectedVenue)} // Open modal on click
                            >
                              <img src={selectedVenue.imageUrl} alt={selectedVenue.name} className="venue-image" />
                              <div className="venue-details-container">
                                <h3 className="venue-name">{selectedVenue.venueName}</h3>

                                <div className="location-details-container">
                                    <img className="location-icon" src={locationicon} alt="" />
                                    <p className="venue-address">{selectedVenue.venueLocation}</p>
                                </div>

                                <div className="venue-additional-information">
                                  <div className="contact-details-container">
                                    <img className="contact-icon" src={phone} alt="" />
                                    <p>Contact Us: {selectedVenue.contact}</p>
                                  </div>

                                  <div className="capacity-details-container">
                                    <img className="group-icon" src={group} alt="" />
                                    <p>Our Capacity : {selectedVenue.capacity}</p>
                                  </div>

                                  <div className="working-hours-details-container">
                                    <img className='working-hours-icon' src={workinghours} alt="" />
                                    <p>Our Hours : {selectedVenue.operatinghours}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="per-plate-price-details-container">
                                <div className="veg-plate-details-container">
                                  <img className='veg-icon' src={veg} alt="" />
                                  <p>Rs 1500</p>
                                </div>

                                <div className="non-veg-plate-details-container">
                                  <img className='non-veg-icon' src={nonveg} alt="" />
                                  <p>Rs 2000</p>
                                </div>
                              </div>
                            </div>
                          
                        ) : (
                          <p>No venues available</p>
                        )}
                      </div>

                      <div className="venue-description-for-each-card">
                        <h2>About the Place</h2>
                        <p>{selectedVenue.description}</p>
                      </div>

                      <div className="button-container">
                        <button onClick={handleLeaveReviewClick}>Leave a Review</button>
                        <button id='scroll-target' onClick={handleBookVenueClick}>Book Venue</button>
                      </div>

                      <div className="venue-information-container">
                        <h2>Information Overview</h2>
                        <ul className='cost-info'>
                          <li className='cost-info-item'><strong><p className='cost-value'>Cost per Hour : {selectedVenue.costperhour}</p></strong></li>
                        </ul>
                      </div>

                      <div class="venue-container">
                        <div class="venue-section parking-section">
                          <h3 class="section-title">
                            <i class="fas fa-car"></i> Car Parking at Pints Of Wisdom
                          </h3>
                          <div class="parking-details">
                            <span class="parking-item"><strong>Parking Indoor:</strong> Ample parking space available</span>
                            <span class="parking-item"><strong>Parking Capacity:</strong> 50</span>
                            <span class="parking-item"><strong>Valet Parking:</strong> Available</span>
                            <span class="parking-item"><strong>Parking Timing:</strong> 12:00 PM to 12:00 AM</span>
                          </div>
                        </div>

                        <div class="venue-section usps-section">
                          <h3 class="section-title">
                            <i class="fas fa-star"></i> USPs of Pints Of Wisdom
                          </h3>
                          <ul class="usp-list">
                            <li class="usp-item">Great Place for Corporate Events</li>
                            <li class="usp-item">Great Place for Social Events</li>
                            <li class="usp-item">Best food quality</li>
                            <li class="usp-item">Friendly staff</li>
                            <li class="usp-item">Affordable prices</li>
                            <li class="usp-item">Multicuisine</li>
                            <li class="usp-item">Great ambience</li>
                            <li class="usp-item">Alcohol Allowed</li>
                            <li class="usp-item">Near Jio World Plaza</li>
                          </ul>
                        </div>
                      </div>

                      <div className="restaurant-info-container">
                        <div className="cuisines-section-container">
                            <div className="section-title-container">
                              <div className="icon-1-container">
                                <img className='icon-image' src={spaghetti} alt="" />
                              </div>
                              <h3 className="cuisines-section-title">Cuisines Served at Pints Of Wisdom</h3>
                              <div className="icon-2-container">
                                <img className='icon-image' src={mortarpestle} alt="" />
                              </div>
                            </div>
                            <div className="cuisines-list-wrapper">
                                <ul className="cuisines-list">
                                    <li className="cuisine-item"><FontAwesomeIcon icon={faUtensils} /> Indian</li>
                                    <li className="cuisine-item"><FontAwesomeIcon icon={faUtensils} /> Mughlai</li>
                                    <li className="cuisine-item"><FontAwesomeIcon icon={faUtensils} /> European</li>
                                    <li className="cuisine-item"><FontAwesomeIcon icon={faUtensils} /> Seafood</li>
                                    <li className="cuisine-item"><FontAwesomeIcon icon={faUtensils} /> Chinese</li>
                                    <li className="cuisine-item"><FontAwesomeIcon icon={faUtensils} /> Oriental</li>
                                    <li className="cuisine-item"><FontAwesomeIcon icon={faUtensils} /> Tandoor</li>
                                    <li className="cuisine-item"><FontAwesomeIcon icon={faUtensils} /> Italian</li>
                                    <li className="cuisine-item"><FontAwesomeIcon icon={faUtensils} /> Continental</li>
                                    <li className="cuisine-item"><FontAwesomeIcon icon={faUtensils} /> American</li>
                                    <li className="cuisine-item"><FontAwesomeIcon icon={faUtensils} /> Thai</li>
                                    <li className="cuisine-item"><FontAwesomeIcon icon={faUtensils} /> Maharashtrian</li>
                                </ul>
                            </div>
                        </div>

                        <div className="facilities-section-container">
                            <div className="section-title-container">
                              <div className="icon-1-container">
                                <img className='icon-image' src={parking} alt="" />
                              </div>
                              <h3 className="facilities-section-title">Facilities at Restaurant at Pints Of Wisdom</h3>
                              <div className="icon-2-container">
                                <img className='icon-image' src={wifi} alt="" />
                              </div>
                            </div>
                            <div className="facilities-list-wrapper">
                                <ul className="facilities-list">
                                    <li className="facility-item available"><FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} /> AV Equipment</li>
                                    <li className="facility-item available"><FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} /> Full Bar</li>
                                    <li className="facility-item available"><FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} /> Smoking Area</li>
                                    <li className="facility-item available"><FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} /> Valet Parking</li>
                                    <li className="facility-item available"><FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} /> DJ Available</li>
                                    <li className="facility-item available"><FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} /> WiFi</li>
                                    <li className="facility-item available"><FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} /> Live Music</li>

                                    <li className="facility-item not-available"><FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} /> Spa</li>
                                    <li className="facility-item not-available"><FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} /> Room Service</li>
                                    <li className="facility-item not-available"><FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} /> Swimming Pool</li>
                                    <li className="facility-item not-available"><FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} /> Doctor On Call</li>
                                    <li className="facility-item not-available"><FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} /> Gym</li>
                                </ul>
                            </div>
                        </div>
                      </div>


                      
                
              </>
            )}
          </div>
        </div>
      )}


      
    </>
  );
}

export default User_Home_Page;


