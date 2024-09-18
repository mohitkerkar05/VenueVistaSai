import './User_Home_Page.css';
import { NavLink } from 'react-router-dom';

function User_Home_Page(){
  return(
    <>
        <nav class="sidebar">
          <ul class="nav-list">
            {/* <li><a>Book Venue</a></li>
            <li><a>Booking History</a></li>
            <li><a>Contact Admin</a></li>
            <li><a class="my-details">My Details</a></li>
            <li><a class="my-details">Leave a Review</a></li> */}
            <li><NavLink to="/home" className="nav-link">Book Venue</NavLink></li>
            <li><NavLink to="/booking-history" className="nav-link">Booking History</NavLink></li>
            <li><NavLink to="/contact-admin" className="nav-link">Contact Admin</NavLink></li>
            <li><NavLink to="/my-details" className="nav-link">My Details</NavLink></li>
            <li><NavLink to="/leave-review" className="nav-link">Leave a Review</NavLink></li>
          </ul>
        </nav>

        <div class="content">
          <section id="home">
            <h1>Home</h1>
            <p>Welcome to our website!</p>
          </section>
          <section id="services">
            <h1>Services</h1>
            <p>Here are the services we offer.</p>
          </section>
          <section id="about">
            <h1>About</h1>
            <p>Learn more about us.</p>
          </section>
          <section id="contact">
            <h1>Contact</h1>
            <p>Get in touch with us.</p>
          </section>
        </div>
    </>
  )
}

export default User_Home_Page;