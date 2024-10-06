import './VeSideBar.css'

import { NavLink } from 'react-router-dom';

import bookvenue from './Icons/bookvenues.png'
import bookinghistory from './Icons/bookinghistory.png'
import contactadmin from './Icons/contactadmin.png'
import mydetails from './Icons/mydetails.png'
import leavereview from './Icons/review.png'
import VenueManger from  './Icons/Vema.png'

function Sidebar(){
  return(
    <>
      <nav className="sidebar">
        <ul className="nav-list">
          <li className="list-element"> 
            <img src={bookvenue} alt="" /> 
            <NavLink to="/VenueHome" className="nav-link">
              Home
            </NavLink>
          </li>

          <li className="list-element"> 
            <img src={VenueManger} alt="" />
            <NavLink to="/add-venue" className="nav-link">
            Add Venue</NavLink>
          </li>

          {/* <li className="list-element"> 
            <img src={contactadmin} alt="" />
            <NavLink to="/contact-admin" className="nav-link">
           Venue Details
            </NavLink>
          </li> */}

          <li className="list-element"> 
            <img src={mydetails} alt="" />
            <NavLink to="/all-booking" className="nav-link">
            All Booking
            </NavLink>
          </li>

          <li className="list-element">
             <img src={leavereview} alt="" />
             <NavLink to="/venue-review" className="nav-link">
             Review
             </NavLink>
          </li>

          <li className="list-element"> 
            <img src={mydetails} alt="" />
            <NavLink to="/ve-contact-admin" className="nav-link">
            Contact Admin
            </NavLink>
          </li>

        </ul>
      </nav>
    </>
  )
}
export default Sidebar;