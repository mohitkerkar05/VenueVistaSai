import './User_Booking_History.css'

import image1 from '../images/venue-1.jpg'
import image2 from '../images/venue-2.jpg'
import image3 from '../images/venue-3.jpg'
import image4 from '../images/venue-4.jpg'
import image5 from '../images/venue-5.jpg'
import image6 from '../images/venue-6.jpg'

function User_Booking_History(){
  return(

    <>
      <nav class="sidebar">
        <ul class="nav-list">
          <li><a>Book Venue</a></li>
          <li><a>Booking History</a></li>
          <li><a>Contact Admin</a></li>
          <li><a class="my-details">My Details</a></li>
        </ul>
      </nav>

      <p class="booking-title">View your previous Bookings</p>

      <div class="experimental-card-template">
        <div class="location-images-container">
          <img src={image1} alt=""></img>
        </div>

        <div class="booking-details-container">
          <h2>Booking details</h2>

          <div class="booking-details">
            <div class="date-and-time">
              <p><strong>Date</strong> : 20-09-2024</p>
              <p><strong>Time</strong> : 8 P.M.</p>
            </div>

            <div class="service-location-duration-container">
              <p><strong>Service Type</strong> : Hotel</p>
              <p class="location"><strong>Location</strong> : Mulund West,Mumbai</p>
              <p><strong>Duration</strong> : 2 Hours</p>
            </div>
          </div>
        </div>

        <div class="payment-information-container">
          <h2>Payment Information</h2>

          <div class="payment-information">
            <p><strong>Payment Method </strong>: Google Pay</p>
            <p><strong>Total Cost </strong>: Rs 50,000.00</p>
          </div>
        </div>

        <div class="additional-services-container">
          <h2>Additional Services</h2>

          <div class="additional-services">
            <p><strong>No Additional Services requested.</strong></p>
          </div>
        </div>

      </div>

      <div class="booking-history-list-display">
        <div class="rows">
          <img src={image2} alt=""></img>

          <div class="date-time-cost-container">
            <p><strong>Date</strong> 2024-10-01</p>
            <p><strong>Time</strong> 8:00 PM</p>
            <p><strong>Cost</strong> Rs 50,000.00</p>
          </div>

          <button class="view-button">VIEW</button>
        </div>

        <div class="rows">
          <img src={image3} alt=""></img>

          <div class="date-time-cost-container">
            <p><strong>Date</strong> 2024-10-01</p>
            <p><strong>Time</strong> 10:00 PM</p>
            <p><strong>Cost</strong> Rs 37,000.00</p>
          </div>

          <button class="view-button">VIEW</button>
        </div>

        <div class="rows">
          <img src={image4} alt=""></img>

          <div class="date-time-cost-container">
            <p><strong>Date</strong> 2024-10-05</p>
            <p><strong>Time</strong> 5:00 PM</p>
            <p><strong>Cost</strong> Rs 35,000.00</p>
          </div>

          <button class="view-button">VIEW</button>
        </div>

        <div class="rows">
          <img src={image5} alt=""></img>

          <div class="date-time-cost-container">
            <p><strong>Date</strong> 2024-10-13</p>
            <p><strong>Time</strong> 8:00 PM</p>
            <p><strong>Cost</strong> Rs 60,000.00</p>
          </div>

          <button class="view-button">VIEW</button>
        </div>

        <div class="rows">
          <img src={image6} alt=""></img>

          <div class="date-time-cost-container">
            <p><strong>Date</strong> 2024-10-15</p>
            <p><strong>Time</strong> 11:00 AM</p>
            <p><strong>Cost</strong> Rs 45,000.00</p>
          </div>

          <button class="view-button">VIEW</button>
        </div>

        
      </div>

    </>
  )
}

export default User_Booking_History;