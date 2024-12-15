import React from 'react';
import { useNavigate } from 'react-router-dom';
import VeSidebar from '../Venue Manager Sidebar/VeSideBar';
// import venuemanagerimage from '../../images/venue-manager-image.jpg';
import Logout from "../../Logout/Logout"; // Import the LogoutButton component
import './Venue_Homepage.css';

function Venue_Home_Page() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      
      <header className="header">
      <h1 className="all-booking-title">VenueVista</h1>
      <Logout /> 
        <VeSidebar />
      </header>

      <div className="content">
        <div className="background-image">
          {/* <img src={venuemanagerimage} alt="Venue Manager" className="manager-image" /> */}
          <section id="home" className="overlay">
            <h1>Welcome, Dear Manager!</h1>
            <p>We are excited to assist you in managing your venue!</p>
            
          </section>
        </div>
      </div>
    </div>
  );
}

export default Venue_Home_Page;
