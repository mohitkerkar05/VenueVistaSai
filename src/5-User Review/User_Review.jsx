import './User_Review.css';
import Sidebar from '../6-sidebar/Sidebar';

import { NavLink } from 'react-router-dom';

import React, { useState } from 'react';
import image from '../images/venue-1.jpg';

import backgroundimage from './customer-feedback.png';

function User_Review() {
  // State for controlling visibility and textarea value
  const [isVisible, setIsVisible] = useState(false);
  const [text, setText] = useState('');

  // Toggle visibility of the review section
  const toggleVisibility = () => {
    setIsVisible(!isVisible);  // Toggle between true and false
  };

  // Function to handle review submission
  const handleReviewSubmit = () => {
    if (text.trim()) {
      alert('Your review has been added.');
      setText('');  // Clear the textarea after submission
    } else {
      alert('Please enter a review.');
    }
  };

  return (
    <>
      <body class="review-page-body">
        <h2>Leave a Review</h2>

        <div className="page-description-container">
          <p>
            We’d love to hear about your experience! Please take a moment to share your thoughts.
          </p>
        </div>

        <div className="image-container">
            <img src={backgroundimage} alt="" />
        </div>
        
        <div className="user-review-body">
          {/* Sidebar */}
          <Sidebar></Sidebar>

          {/* Search Container */}
          <div className="search-container">
            <input type="text" placeholder="Search by Venue-ID..." className="search-input" />
            <button className="search-btn" onClick={toggleVisibility}>
              Search
            </button>
          </div>

          {/* Review Section */}
          {isVisible && (
            <div className="write-review-div">
              <div className="venue-information">
                <img src={image} alt="Venue" />
                <p>#4174</p>
                <p>Advik Banquets</p>
                <p>Ashok Nagar, Mulund West, Mumbai</p>
              </div>

              <div className="review-writing-div">
                <h2 className="venue-id-heading">Venue: #4174</h2>
                {/* Controlled textarea */}
                <textarea
                  id="review"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Leave your review about the place here..."
                />
                <div className="star-rating-container">
                  <div class="rating-title">
                    <h2>How would you rate your experience here?</h2>
                  </div>

                  <div class="star-rating">
                    <input type="radio" id="star5" name="rating" value="5"/>
                    <label for="star5" title="5 stars">&#9733;</label>

                    <input type="radio" id="star4" name="rating" value="4"/>
                    <label for="star4" title="4 stars">&#9733;</label>

                    <input type="radio" id="star3" name="rating" value="3"/>
                    <label for="star3" title="3 stars">&#9733;</label>

                    <input type="radio" id="star2" name="rating" value="2"/>
                    <label for="star2" title="2 stars">&#9733;</label>

                    <input type="radio" id="star1" name="rating" value="1"/>
                    <label for="star1" title="1 star">&#9733;</label>
                  </div>
                </div>
                <button id="submit" onClick={handleReviewSubmit}>Submit Review</button>
              </div>


            </div>
          )}
        </div>
      </body>
    </>
  );
}

export default User_Review;
