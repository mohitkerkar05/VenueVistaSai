import React, { useEffect, useState } from 'react';
import Sidebar from '../Venue Manager Sidebar/VeSideBar';
import './All_Booking.css';

const All_Booking = () => {
  const [bookings, setBookings] = useState([]); // To store booking data
  const [selectedBooking, setSelectedBooking] = useState(null); // To store selected booking details
  const [message, setMessage] = useState(''); // To store delete or status message
  const [loading, setLoading] = useState(true); // To show loading status
  const [filter, setFilter] = useState('all'); // State to manage selected filter

  // Fetch the booking data
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:5000/bookings-main');
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const result = await response.json();
        setBookings(result);
      } catch (error) {
        console.error("Error fetching booking data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings based on selected filter
  const filteredBookings = () => {
    const now = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      const diffDays = Math.floor((bookingDate - now) / (1000 * 60 * 60 * 24));

      switch (filter) {
        case 'upcoming':
          return bookingDate >= now; // Future bookings
        case 'past3days':
          return diffDays >= -3 && diffDays < 0; // Past 3 days
        case 'pastWeek':
          return diffDays >= -7 && diffDays < 0; // Past week
        case 'pastMonth':
          return diffDays >= -30 && diffDays < 0; // Past month
        default:
          return true; // Show all bookings
      }
    });
  };

  // Handle click on booking to show details
  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setMessage('');
  };

  // Close the modal
  const closeModal = () => {
    setSelectedBooking(null);
    setMessage('');
  };

  // Overlay click to close modal
  const handleOverlayClick = (event) => {
    if (event.target.className === 'all-booking-modal-overlay') {
      closeModal();
    }
  };

  // Format date and time for readability
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <>
      <h1 className="all-booking-title">VenueVista</h1>
      
      <Sidebar />
      <div className="all-booking-container">
        <h1>List of Bookings</h1>

        {/* Filter Options */}
        <div className="filter-options">
          <label htmlFor="filter">Filter: </label>
          <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Bookings</option>
            <option value="upcoming">Upcoming Bookings</option>
            <option value="past3days">Past 3 Days</option>
            <option value="pastWeek">Past Week</option>
            <option value="pastMonth">Past Month</option>
          </select>
        </div>

        {loading ? (
          <p>Loading bookings...</p>
        ) : filteredBookings().length === 0 ? (
          <p>No bookings available.</p>
        ) : (
          <div className="all-booking-list">
            {filteredBookings().map((booking, index) => (
              <div
                key={booking._id}
                className="all-booking-card"
                onClick={() => handleBookingClick(booking)}
              >
                <p><strong>Booking {index + 1}:</strong></p>
                <p>Occasion: {booking.occasion}</p>
                <p>Date: {formatDate(booking.date)}</p>
                <p>Venue: {booking.venueName}</p>
              </div>
            ))}
          </div>
        )}

        {message && <p className="all-booking-status-message">{message}</p>}
      </div>

      {selectedBooking && (
        <div className="all-booking-modal-overlay" onClick={handleOverlayClick}>
          <div className="all-booking-modal-content">
            <h2>Details of Booking</h2> 
            <div className="all-booking-details">
              {selectedBooking.occasion && (
                <div className="input-group">
                  <label><strong>Occasion:</strong></label>
                  <span>{selectedBooking.occasion}</span>
                </div>
              )}
              {selectedBooking.date && (
                <div className="input-group">
                  <label><strong>Date:</strong></label>
                  <span>{formatDate(selectedBooking.date)}</span>
                </div>
              )}
              {selectedBooking.time && (
                <div className="input-group">
                  <label><strong>Time:</strong></label>
                  <span>{selectedBooking.time}</span>
                </div>
              )}
              {selectedBooking.duration && (
                <div className="input-group">
                  <label><strong>Duration:</strong></label>
                  <span>{selectedBooking.duration} hours</span>
                </div>
              )}
              {selectedBooking.guestCount && (
                <div className="input-group">
                  <label><strong>Guest Count:</strong></label>
                  <span>{selectedBooking.guestCount}</span>
                </div>
              )}
              {selectedBooking.catering && (
                <div className="input-group">
                  <label><strong>Catering:</strong></label>
                  <span>{selectedBooking.catering}</span>
                </div>
              )}
              {selectedBooking.drinks && (
                <div className="input-group">
                  <label><strong>Drinks:</strong></label>
                  <span>{selectedBooking.drinks}</span>
                </div>
              )}
              {selectedBooking.name && (
                <div className="input-group">
                  <label><strong>Name:</strong></label>
                  <span>{selectedBooking.name}</span>
                </div>
              )}
              {selectedBooking.phone && (
                <div className="input-group">
                  <label><strong>Phone:</strong></label>
                  <span>{selectedBooking.phone}</span>
                </div>
              )}
              {selectedBooking.email && (
                <div className="input-group">
                  <label><strong>Email:</strong></label>
                  <span>{selectedBooking.email}</span>
                </div>
              )}
              {selectedBooking.additionalRequests && (
                <div className="input-group">
                  <label><strong>Additional Requests:</strong></label>
                  <span>{selectedBooking.additionalRequests}</span>
                </div>
              )}
              {selectedBooking.venueName && (
                <div className="input-group">
                  <label><strong>Venue Name:</strong></label>
                  <span>{selectedBooking.venueName}</span>
                </div>
              )}
            </div>
            <button className="all-booking-close-button" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default All_Booking;
