import React, { useState } from 'react';
import person1 from '../User Home page/person1.jpeg';
import person3 from '../User Home page/person3.jpeg';
import './User_Book_Venue.css';
import whatsapp from '../User Contact Admin/whatsapp.png';
import gmail from '../User Contact Admin/gmail.png';
import contactadmin from '../User Home Page/customer.png';
const BookingForm = () => {
  // State to manage form input values
  const [formData, setFormData] = useState({
    occasion: '',
    date: '',
    time: '',
    duration: '',
    guestCount: '',
    // budget: 0,
    catering: 'only-veg',
    drinks: 'soft-drinks',
    name: '',
    phone: '',
    email: '',
    additionalRequests: '',
    venueName: 'Advik Banquets'
  });

  const [bookingDetails, setBookingDetails] = useState(null); // State to store booking details

  const [isChecked, setIsChecked] = useState(false);
  // Function to handle checkbox change
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));``
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    setBookingDetails(formData);

    try {
      const response = await fetch('http://localhost:5001/bookings-new-to-cluster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit booking');
    }
  };

  const renderReceipt = () => {
    if (!bookingDetails) return null;

  
  

    return (
      <div className="booking-receipt">
        <h2>Booking Confirmation Details</h2>
        <p><strong>Name:</strong> {bookingDetails.name}</p>
        <p><strong>Phone:</strong> {bookingDetails.phone}</p>
        <p><strong>Email:</strong> {bookingDetails.email}</p>
        <p><strong>Occasion:</strong> {bookingDetails.occasion}</p>
        <p><strong>Date:</strong> {bookingDetails.date}</p>
        <p><strong>Time:</strong> {bookingDetails.time}</p>
        <p><strong>Duration:</strong> {bookingDetails.duration} hours</p>
        <p><strong>Guest Count:</strong> {bookingDetails.guestCount}</p>
        {/* <p><strong>Budget:</strong> {bookingDetails.budget}</p> */}
        <p><strong>Catering:</strong> {bookingDetails.catering}</p>
        <p><strong>Drinks:</strong> {bookingDetails.drinks}</p>
        <p><strong>Additional Requests:</strong> {bookingDetails.additionalRequests}</p>
      </div>
    );
  };

  return (
    <>
      <div className="form-container">
        <h2>Check Availability & Prices</h2>

        <form id="booking-form">
          <div className="form-elements-container">
            <div className="form-group">
              <label htmlFor="occasion">Select Your Occasion*</label>
              <select id="occasion" name="occasion" value={formData.occasion} onChange={handleChange} required>
                <option value="">--Select Occasion--</option>
                <option value="Birthday">Birthday</option>
                <option value="Wedding">Wedding</option>
                <option value="Engagement">Engagement</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Select Occasion Date*</label>
              <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="time">Select Event Time*</label>
              <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-elements-container">
            <div className="form-group">
              <input
                id="duration"
                name="duration"
                placeholder="Enter Event Duration in hours"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="number"
                id="guestCount"
                name="guestCount"
                placeholder="No. Of Guests"
                value={formData.guestCount}
                onChange={handleChange}
                min="1"
                max="99"
                required
              />
            </div>

            {/* <div className="form-group">
              <select id="budget" name="budget" value={formData.budget} onChange={handleChange} required>
                <option value="">Select Budget Range</option>
                <option value="low">Less than $500</option>
                <option value="medium">$500 - $1000</option>
                <option value="high">More than $1000</option>
              </select>
            </div> */}
          </div>

          <div className="form-elements-container">
            <div className="form-group">
              <label htmlFor="catering">Catering Options</label>
              <select id="catering" name="catering" value={formData.catering} onChange={handleChange}>
                <option value="only-veg">Only Veg</option>
                <option value="veg-and-non-veg">Veg and Non Veg</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="drinks">Drinks</label>
              <select id="drinks" name="drinks" value={formData.drinks} onChange={handleChange}>
                <option value="soft-drinks">Soft Drinks</option>
                <option value="alcoholic-drinks">Alcoholic Drinks</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="name">Your name*</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-elements-container">
            <div className="form-group mobile-group">
              <div className="mobile-container">
                <span className="country-code">+91</span>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your Mobile Number"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <input
              type="text"
              id="additionalRequests"
              name="additionalRequests"
              placeholder="Enter any additional notes you would like the Venue Manager to know..."
              value={formData.additionalRequests}
              onChange={handleChange}
            />
          </div>

          <p className="terms">
            By clicking on this button, you are accepting our
            <a href="#"> terms and conditions</a>.
          </p>
        </form>
      </div>

      <section className="coordinator-section">
        <h2>Meet Our Venue Coordinators</h2>
        <p>Our platform provides access to trusted venue coordinators for event management.</p>
        <div className="coordinator-container">
          <div className="coordinator-card">
            <img className="coordinator-image" src={person1} alt="Coordinator 1" />
            <h3>Varun Thakur</h3>
            <p>Senior Event Coordinator</p>
          </div>
          <div className="coordinator-card">
            <img className="coordinator-image" src={person3} alt="Coordinator 3" />
            <h3>Aadar Malik</h3>
            <p>Event Planner</p>
          </div>
        </div>

      </section>

      

      <div className="checkbox-container">
        <input type="checkbox" id="assist-checkbox" onChange={handleCheckboxChange} />
        <label htmlFor="assist-checkbox" className="assist-label">
          Interested in being assisted by our coordinators?
        </label>
      </div>

      {/* Conditional rendering for additional charge message */}
      {isChecked && (
          <div className="additional-charge">
            Note : This will cost an additional charge of Rs 10,000.
          </div>
        )}

       

      <button type="button" className="submit-btn" onClick={handleSubmit}>
        Check Availability and Confirm Booking
      </button>

      
      {renderReceipt()}
    </>
  );
};

export default BookingForm;
