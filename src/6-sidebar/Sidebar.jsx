import './Sidebar.css'

import { NavLink } from 'react-router-dom';

import bookvenue from './Icons/bookvenues.png'
import bookinghistory from './Icons/bookinghistory.png'
import contactadmin from './Icons/contactadmin.png'
import mydetails from './Icons/mydetails.png'
import leavereview from './Icons/review.png'


function Sidebar(){
  return(
    <>
      <nav className="sidebar">
        <ul className="nav-list">
          <li className="list-element"> 
            <img src={bookvenue} alt="" /> 
            <NavLink to="/home" className="nav-link">
              Book Venue
            </NavLink>
          </li>

          <li className="list-element"> 
            <img src={bookinghistory} alt="" />
            <NavLink to="/booking-history" className="nav-link">
            Booking History</NavLink>
          </li>

          <li className="list-element"> 
            <img src={contactadmin} alt="" />
            <NavLink to="/contact-admin" className="nav-link">
            Contact Admin
            </NavLink>
          </li>

          <li className="list-element"> 
            <img src={mydetails} alt="" />
            <NavLink to="/my-details" className="nav-link">
            My Details
            </NavLink>
          </li>

          <li className="list-element">
             <img src={leavereview} alt="" />
             <NavLink to="/leave-review" className="nav-link">
             Leave a Review
             </NavLink>
          </li>
        </ul>
      </nav>
    </>
  )
}
export default Sidebar;