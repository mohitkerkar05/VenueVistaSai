import { NavLink } from 'react-router-dom';
import './User_Home_Page.css';
import Sidebar from '../6-sidebar/Sidebar';
import React,{ useState, useEffect ,useCallback} from 'react';

function User_Home_Page() {
  const [data, setData] = useState([]); // Venue data
  const [selectedVenue, setSelectedVenue] = useState(null); // Selected venue for modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [isReviewMode, setIsReviewMode] = useState(false); // State to track review mode

  const [venueData, setVenueData] = useState(null); // Venue data
  const [text, setText] = useState('');
  const [rating, setRating] = useState(null);
  const [selectedVenueId, setSelectedVenueId] = useState(null); // Selected venue ID




  //ALL FUNCTIONS FROM USER REVIEW COPY PASTED HERE
  // Fetch venue details based on the selected venue ID
  const fetchVenueDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/venues/${id}`);
      if (!response.ok) {
        throw new Error(`Venue not found (Error ${response.status})`);
      }
      const data = await response.json();
      setVenueData(data);
    } catch (error) {
      console.error('Error fetching venue details:', error);
      alert('Venue not found or server error');
    }
  };

  // Handle review submission
  const handleReviewSubmit = async () => {
    if (text.trim() && rating && venueData) {
      try {
        const response = await fetch("http://localhost:5000/api/addReview", {
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

  // Component to display reviews for a specific venue
  const VenueReviews = React.memo(({ venueId }) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
      const fetchReviews = async () => {
        try {
          const response = await fetch(`http://localhost:5000/reviews/${venueId}`);
          const data = await response.json();
          setReviews(data); // Set fetched reviews to state
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      };

      fetchReviews();
    }, [venueId]);

    return (
      <div>
        <h3>Reviews for Venue {venueId}</h3>
        {reviews.length > 0 ? (
          <div className="reviews-container">
            {reviews.map((review) => (
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
      const response = await fetch('http://localhost:5000/api/venues'); // Fetch all venues
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
    setIsModalOpen(true);
    setIsReviewMode(false); // Reset to venue details

    console.log(venue.venueId);
    fetchVenueDetails(venue.venueId);
  };

  // Close modal when clicking outside of the modal content
  const closeModal = (e) => {
    if (e.target.className === 'modal') {
      setIsModalOpen(false);
      setIsReviewMode(false); // Reset to venue details when closed
    }
  };

  // Handle review button click
  const handleLeaveReviewClick = () => {
    setIsReviewMode(true); // Switch to review mode
    console.log(venueData);
    {selectedVenueId && <VenueReviews venueId={selectedVenueId} />}
  };



  return (
    <>
      <Sidebar />

      <div className="venues-container">
        {/* Dynamically map through data and create a card for each venue */}

        {data.length > 0 ? (
          data.map((venue) => (
            <div
              className="venue-card"
              key={venue._id}
              onClick={() => openModal(venue)} // Open modal on click
            >
              <img src={venue.imageUrl} alt={venue.name} className="venue-image" />
              <div className="venue-details">
                <h3 className="venue-name">{venue.venueName}</h3>
                <p className="venue-address">{venue.venueLocation}</p>

                <div className="venue-additional-information">
                  <p>Contact Us: {venue.contact}</p>
                  <p>Our Capacity : {venue.capacity}</p>
                  <p>Our Hours : {venue.operatinghours}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No venues available</p>
        )}
      </div>



      {/* Modal for displaying venue details */}
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>

            {isReviewMode ? (
              <div>
                {/* <h2>Leave a Review for {selectedVenue.venueName}</h2>
                <textarea placeholder="Write your review here..." rows="5" />
                <button onClick={() => alert('Review submitted!')}>Submit Review</button>
                <button onClick={() => setIsReviewMode(false)}>Back to Venue Details</button> */}
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
                
              </div>
            ) : (
              <>
                <div className="venue-image-container">
                  <img src={selectedVenue.imageUrl} alt={selectedVenue.venueName} className="modal-venue-image" />
                </div>

                <h2>{selectedVenue.venueName}</h2>

                <p className="venue-description-for-each-card">{selectedVenue.description}</p>

                <div className="venue-information-container">
                  <h2>Information Overview</h2>
                  <ul>
                    <li><strong><p>Location : {selectedVenue.venueLocation}</p></strong></li>
                    <li><strong><p>Contact: {selectedVenue.contact}</p></strong></li>
                    <li><strong><p>Capacity: {selectedVenue.capacity}</p></strong></li>
                    <li><strong><p>Operating Hours: {selectedVenue.operatinghours}</p></strong></li>
                    <li><strong><p>Cost per Hour : {selectedVenue.costperhour}</p></strong></li>
                  </ul>
                </div>

                <div className="button-container">
                  <button onClick={handleLeaveReviewClick}>Leave a Review</button>
                  <button>Book Venue</button>
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


