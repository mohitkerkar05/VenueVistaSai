import './User_Personal_Details.css'
import Sidebar from '../6-sidebar/Sidebar';

import { NavLink } from 'react-router-dom';

import image from './user.png'
import background from './access-denied.png';

function User_Personal_Details(){
  return (
    <>
    <body className="user-personal-details-body">
      <Sidebar></Sidebar>

      <div className="my-details-title-container">
        <p>
          My Details
        </p>
      </div>

      <div className="content-container">
        <div className="background-image-container">
          <img class="background-image" src={background} alt="" />
        </div>

        <div className="booking-card">
          <div className="card-header">
              <h2>My Details</h2>
          </div>
          <div className="card-body">
              <div className="profile-picture">
                  <img src={image} alt="" />
              </div>

              <div className="user-details">
                  <div>
                    <label htmlFor="name"><strong>Name:</strong></label>
                    <input type="text" id="name" name="name" placeholder="Your Name"/>
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
                    <label ><strong>Date of Birth:</strong></label>
                    <input type="date" placeholder="Date of Birth"/><br></br>
                  </div>
              </div>

              <div className="account-information">
                  <div>
                    <label ><strong>Username:</strong></label>
                    <input type="text" placeholder="Username"/>
                  </div>

                  <div>
                    <label ><strong>Password:</strong></label>
                    <input type="text" placeholder="Password"/><br></br>
                  </div>
              </div>

              <div className="address-location-information-container">
                  <div>
                    <label ><strong>Address:</strong></label>
                    <input type="text" placeholder="Address.."/><br></br>
                  </div>

                  <div>
                    <label ><strong>Country:</strong></label>
                    <input type="text" placeholder="Country"/><br></br>
                  </div>
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