import React, { useEffect, useState } from 'react';
import Sidebar from '../Venue Manager Sidebar/VeSideBar';
import './Venue_Reviews.css';
import RatingDistributionChart from './RatingDistributionChart'; // Import the new chart component

const Venue_Reviews = () => {
  const [reviews, setReviews] = useState([]); // State to store reviews
  const [selectedReview, setSelectedReview] = useState(null); // State to store selected review details
  const [loading, setLoading] = useState(true); // State for loading
  const [message, setMessage] = useState(''); // State to store messages
  const [sortOrder, setSortOrder] = useState('highest'); // State to store sorting order
  const [currentPage, setCurrentPage] = useState(0); // State for current page
  const reviewsPerPage = 5; // Number of reviews to show per page

  // Fetch reviews from the backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:5001/reviews-main');
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const result = await response.json();
        setReviews(result);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setMessage('Error fetching reviews. Please try again later.');
      } finally {
        setLoading(false); // Stop loading when done
      }
    };

    fetchReviews();
  }, []);

  // Sort reviews based on rating
  const sortedReviews = [...reviews].sort((a, b) => {
    return sortOrder === 'highest' ? b.rating - a.rating : a.rating - b.rating;
  });

  // Get current reviews based on pagination
  const currentReviews = sortedReviews.slice(
    currentPage * reviewsPerPage,
    currentPage * reviewsPerPage + reviewsPerPage
  );

  const handleReviewClick = (review) => {
    setSelectedReview(review);
    setMessage('');
  };

  const closeModal = () => {
    setSelectedReview(null);
    setMessage('');
  };

  const handleOverlayClick = (event) => {
    if (event.target.className === 'modal-overlay') {
      closeModal();
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(0); // Reset to the first page on sort change
  };

  const handleNext = () => {
    if ((currentPage + 1) * reviewsPerPage < sortedReviews.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <>
      <h1 className="all-booking-title">VenueVista</h1>
      <Sidebar />
      
      <div className="reviews-container">
        <h1>Reviews</h1>
        
        {/* Sorting Filter */}
        <div className="sort-filter">
          <label>Sort by Rating: </label>
          <select value={sortOrder} onChange={handleSortChange}>
            <option value="highest">Highest to Lowest</option>
            <option value="lowest">Lowest to Highest</option>
          </select>
        </div>
    
        {/* Reviews and Chart Section */}
        <div className="reviews-chart-container">
          {/* Rating Distribution Chart */}
          <div className="chart-section">
            <h2>Review Ratings Distribution</h2>
            <RatingDistributionChart reviews={reviews} />
          </div>

          {/* Reviews List Section */}
          <div className="reviews-list">
            {loading ? (
              <p>Loading reviews...</p>
            ) : message ? (
              <p className="error-message">{message}</p>
            ) : currentReviews.length === 0 ? (
              <p>No reviews available.</p>
            ) : (
              currentReviews.map((review, index) => (
                <div
                  key={review._id}
                  className="review-card"
                  onClick={() => handleReviewClick(review)}
                >
                  <p><strong>Review {currentPage * reviewsPerPage + index + 1}: </strong></p>
                  <p>{review.text}</p>
                  {/* <p><strong>Rating:</strong> {review.rating}</p> */}
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Pagination Buttons */}
        <div className="pagination-buttons">
          <button 
            className="previous-button" 
            onClick={handlePrevious} 
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <button 
            className="next-button" 
            onClick={handleNext} 
            disabled={(currentPage + 1) * reviewsPerPage >= sortedReviews.length}
          >
            Next
          </button>
        </div>
    
        {/* Modal for Review Details */}
        {selectedReview && (
          <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
              <h2>Details of Review</h2>
              <div className="review-details">
                <p><strong>Review:</strong> {selectedReview.text}</p>
                <p><strong>Rating:</strong> {selectedReview.rating}</p>
                <p><strong>Venue:</strong> {selectedReview.venueName}</p>
                <p><strong>Location:</strong> {selectedReview.venueLocation}</p>
              </div>
              <button className="close-button" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Venue_Reviews;
