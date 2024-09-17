import './User_Personal_Details.css'

function User_Personal_Details(){
  return (
    <>
    <body className="user-personal-details-body">
      <nav className="sidebar">
        <ul className="nav-list">
          <li><a>Book Venue</a></li>
          <li><a>Booking History</a></li>
          <li><a>Contact Admin</a></li>
          <li><a className="my-details">My Details</a></li>
        </ul>
      </nav>


      <div className="user-details">
      
      </div>


      <div className="booking-card">
        <div className="card-header">
            <h2>My Details</h2>
        </div>
        <div className="card-body">
            <div className="user-details">
                <div>
                  <label htmlFor="name"><strong>Name:</strong></label>
                  <input type="text" id="name" name="name" placeholder="Your Name"/>
                  <br></br>
                </div>

                <div>
                  <label htmlFor="email"><strong>Email:</strong></label>
                  <input type="email" id="email" name="email"  placeholder="Your Email"/><br></br>
                </div>

                <div>
                  <label htmlFor="phone"><strong>Phone:</strong></label>
                  <input type="tel" id="phone" name="phone"  placeholder="Your Phone Number"/><br></br>
                </div>

                <div>
                  <label htmlFor="event-date"><strong>Event Date:</strong></label>
                  <input type="date" id="event-date" name="event-date"  style={{paddingLeft:'20px'}}/><br/>
                </div>

                <div>
                  <label htmlFor="venue"><strong>Venue:</strong></label>
                  <input type="text" id="venue" name="venue"  placeholder="Event Venue"/><br></br>
                </div>

                <div>
                  <label htmlFor="guests"><strong>Guests:</strong></label>
                  <input type="number" id="guests" name="guests"  min="1" placeholder="Number of Guests"/><br></br>
                </div>

                <div>      
                  <label htmlFor="special-requests"><strong>Special Requests:</strong></label>
                  <input type="text" id="special-requests" name="special-requests" placeholder="Any Special Requests"/><br></br>
                </div>

                <button className="submit" type="submit">Submit</button>
            </div>
        </div>
      </div>
    </body>
    

    </>
  )
}

export default User_Personal_Details;