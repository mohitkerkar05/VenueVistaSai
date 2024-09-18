import './User_Review.css';
import '../2-User Home Page/User_Home_Page.css';
import { NavLink } from 'react-router-dom';

import React, { useState } from 'react';
import image from '../images/venue-1.jpg';

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
    <div className="user-review-body">
      {/* Sidebar */}
      <nav className="sidebar">
        <ul className="nav-list">
          {/* <li><a href="#">Book Venue</a></li>
          <li><a href="#">Booking History</a></li>
          <li><a href="#">Contact Admin</a></li>
          <li><a href="#" className="my-details">My Details</a></li>
          <li><a href="#" className="my-details">Leave a Review</a></li> */}
          <li><NavLink to="/home" className="nav-link">Book Venue</NavLink></li>
          <li><NavLink to="/booking-history" className="nav-link">Booking History</NavLink></li>
          <li><NavLink to="/contact-admin" className="nav-link">Contact Admin</NavLink></li>
          <li><NavLink to="/my-details" className="nav-link">My Details</NavLink></li>
          <li><NavLink to="/leave-review" className="nav-link">Leave a Review</NavLink></li>
        </ul>
      </nav>

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
            <button id="submit" onClick={handleReviewSubmit}>Submit Review</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default User_Review;
