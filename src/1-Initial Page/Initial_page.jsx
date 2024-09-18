import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink for navigation
import './Initial_page.css'; // Import specific styles

// Importing images
import image1 from '../images/venue-1.jpg';
import image2 from '../images/venue-2.jpg';
import image3 from '../images/venue-3.jpg';
import image4 from '../images/venue-4.jpg';
import image5 from '../images/venue-5.jpg';
import image6 from '../images/venue-6.jpg';
import myaccount from '../images/my-account.png';

// Importing components
import LoginPage from '../6-Login Page/Login_Page.jsx';
import RegisterPage from '../7-Register Page/Register_Page.jsx';

function Initial_page() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add state to track login status

  const toggleLogin = () => setShowLogin(!showLogin);
  const toggleRegister = () => setShowRegister(!showRegister);

  const handleLogin = () => {
    // Mock login function to set isLoggedIn to true
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  return (
    <>
      <div className="website-header">
        <div className="my-account">
          <img src={myaccount} alt="My Account" />
        </div>

        <div className="booking-history">5</div>

        <div className="website-name-container">
          <h2 className="website-name">Venue Vista</h2>
        </div>

        {!isLoggedIn ? (
          <>
            <div className="login-button-container">
              <button className="login-button" onClick={toggleLogin}>Login</button>
            </div>

            <div className="register-button-container">
              <button className="register-button" onClick={toggleRegister}>Register</button>
            </div>

            {/* Conditional rendering of LoginPage and RegisterPage */}
            {showLogin && <LoginPage onLogin={handleLogin} />}
            {showRegister && <RegisterPage onClose={() => setShowRegister(false)} />}
          </>
        ) : (
          <>
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/booking-history">Booking History</NavLink>
            <NavLink to="/my-details">My Details</NavLink>
            <NavLink to="/leave-review">Leave a Review</NavLink>
          </>
        )}
      </div>

      <div className="venues-container">
         {/* Venue 1 */}
         <div className="venue">
          <div className="venue-image-container">
            <img className="venue-images" src={image1} alt="Venue 1" />
          </div>
          <div className="venue-description">
            <h2 className="venue-name">Venue Name</h2>
            <ul className="venue-rating-reviews-container">
              <li>Rating: 4.7 stars</li>
              <li>Reviews: 100</li>
            </ul>
            <p>Contact: 9820896465</p>
            <p>Mulund West, Mumbai</p>
          </div>
        </div>

        {/* Venue 2 */}
        <div className="venue">
          <div className="venue-image-container">
            <img className="venue-images" src={image2} alt="Venue 2" />
          </div>
          <div className="venue-description">
            <h2 className="venue-name">Venue Name</h2>
            <ul className="venue-rating-reviews-container">
              <li>Rating: 4.7 stars</li>
              <li>Reviews: 100</li>
            </ul>
            <p>Contact: 9820896465</p>
            <p>Mulund West, Mumbai</p>
          </div>
        </div>

        {/* Venue 3 */}
        <div className="venue">
          <div className="venue-image-container">
            <img className="venue-images" src={image3} alt="Venue 3" />
          </div>
          <div className="venue-description">
            <h2 className="venue-name">Venue Name</h2>
            <ul className="venue-rating-reviews-container">
              <li>Rating: 4.7 stars</li>
              <li>Reviews: 100</li>
            </ul>
            <p>Contact: 9820896465</p>
            <p>Mulund West, Mumbai</p>
          </div>
        </div>

        {/* Venue 4 */}
        <div className="venue">
          <div className="venue-image-container">
            <img className="venue-images" src={image4} alt="Venue 4" />
          </div>
          <div className="venue-description">
            <h2 className="venue-name">Venue Name</h2>
            <ul className="venue-rating-reviews-container">
              <li>Rating: 4.7 stars</li>
              <li>Reviews: 100</li>
            </ul>
            <p>Contact: 9820896465</p>
            <p>Mulund West, Mumbai</p>
          </div>
        </div>
      </div>

      {/* Conditional Rendering of Login and Register Pages */}
      {showLogin && <LoginPage onLogin={handleLogin} />}
      {showRegister && <RegisterPage />}
    
      
    </>
  );
}

export default Initial_page;
