import './Initial_page.css'
import { NavLink } from 'react-router-dom';

import image1 from '../images/venue-1.jpg'
import image2 from '../images/venue-2.jpg'
import image3 from '../images/venue-3.jpg'
import image4 from '../images/venue-4.jpg'
import image5 from '../images/venue-5.jpg'
import image6 from '../images/venue-6.jpg'

import myaccount from '../images/my-account.png'

function Initial_page(){
  return(
    <>

      <div className="website-header">
        <div className="my-account">
          <img src={myaccount} alt=""></img>
        </div>

        <div className="booking-history">
          5
        </div>

        <div className="website-name-container">
          <h2 className="website-name">Venue Vista</h2>
        </div>

        <div className="login-button-container">
          <button className="login-button">Login</button>
        </div>

        <div className="register-button-container">
          <button className="register-button">Register</button>
        </div>
      </div>

      <div className="venues-container">
        <div className="venue">
          <div className="venue-image-container">
            <img className="venue-images" src={image1} alt=""></img>
          </div>
          <div className="venue-description">
            <h2 className="venue-name">Venue Name</h2>
            <ul className="venue-rating-reviews-container">
              <li>Rating:4.7 stars</li>
              <li>Reviews:100</li>          
            </ul>
            <p>Contact : 9820896465</p>
            <p>Mulund West,Mumbai</p>   
          </div>
        </div>

        <div className="venue">
          <div className="venue-image-container">
            <img className="venue-images" src={image2} alt=""></img>
          </div>
          <div className="venue-description">
            <h2 className="venue-name">Venue Name</h2>
            <ul className="venue-rating-reviews-container">
              <li>Rating:4.7 stars</li>
              <li>Reviews:100</li>          
            </ul>
            <p>Contact : 9820896465</p>
            <p>Mulund West,Mumbai</p>   
          </div>
        </div>

        <div className="venue">
          <div className="venue-image-container">
            <img className="venue-images" src={image3} alt=""></img>
          </div>
          <div className="venue-description">
            <h2 className="venue-name">Venue Name</h2>
            <ul className="venue-rating-reviews-container">
              <li>Rating:4.7 stars</li>
              <li>Reviews:100</li>          
            </ul>
            <p>Contact : 9820896465</p>
            <p>Mulund West,Mumbai</p>   
          </div>
        </div>
      </div>

      <div className="venues-container">
        <div className="venue">
          <div className="venue-image-container">
            <img className="venue-images" src={image4} alt=""></img>
          </div>
          <div className="venue-description">
            <h2 className="venue-name">Venue Name</h2>
            <ul className="venue-rating-reviews-container">
              <li>Rating:4.7 stars</li>
              <li>Reviews:100</li>          
            </ul>
            <p>Contact : 9820896465</p>
            <p>Mulund West,Mumbai</p>   
          </div>
        </div>

        <div className="venue">
          <div className="venue-image-container">
            <img className="venue-images" src={image5} alt=""></img>
          </div>
          <div className="venue-description">
            <h2 className="venue-name">Venue Name</h2>
            <ul className="venue-rating-reviews-container">
              <li>Rating:4.7 stars</li>
              <li>Reviews:100</li>          
            </ul>
            <p>Contact : 9820896465</p>
            <p>Mulund West,Mumbai</p>   
          </div>
        </div>

        <div className="venue">
          <div className="venue-image-container">
            <img className="venue-images" src={image6} alt=""></img>
          </div>
          <div className="venue-description">
            <h2 className="venue-name">Venue Name</h2>
            <ul className="venue-rating-reviews-container">
              <li>Rating:4.7 stars</li>
              <li>Reviews:100</li>          
            </ul>
            <p>Contact : 9820896465</p>
            <p>Mulund West,Mumbai</p>   
          </div>
        </div>
      </div>

      <div className="venues-container">
        <div className="venue">
          <div className="venue-image-container">
            <img className="venue-images" src={image1} alt=""></img>
          </div>
          <div className="venue-description">
            <h2 className="venue-name">Venue Name</h2>
            <ul className="venue-rating-reviews-container">
              <li>Rating:4.7 stars</li>
              <li>Reviews:100</li>          
            </ul>
            <p>Contact : 9820896465</p>
            <p>Mulund West,Mumbai</p>   
          </div>
        </div>

        <div className="venue">
          <div className="venue-image-container">
            <img className="venue-images" src={image2} alt=""></img>
          </div>
          <div className="venue-description">
            <h2 className="venue-name">Venue Name</h2>
            <ul className="venue-rating-reviews-container">
              <li>Rating:4.7 stars</li>
              <li>Reviews:100</li>          
            </ul>
            <p>Contact : 9820896465</p>
            <p>Mulund West,Mumbai</p>   
          </div>
        </div>

        <div className="venue">
          <div className="venue-image-container">
            <img className="venue-images" src={image3} alt=""></img>
          </div>
          <div className="venue-description">
            <h2 className="venue-name">Venue Name</h2>
            <ul className="venue-rating-reviews-container">
              <li>Rating:4.7 stars</li>
              <li>Reviews:100</li>          
            </ul>
            <p>Contact : 9820896465</p>
            <p>Mulund West,Mumbai</p>   
          </div>
        </div>
      </div>


      <div className="overlay">
        <div className="login-container-div">
          <h2 className="form-title">Login</h2>
          <div className="signup-login">
            <form>
                <div className="form-group">
                    <label htmlFor="entity">Select Entity</label>
                    <select className="entity" name="entity" required>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="venue_manager">Venue Manager</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" required></input>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required></input>
                </div>
                <div className="form-group">
                    <button type="submit">Login</button>
                </div>
                <div className="form-footer">
                    <p>Don't have an account? <a id="register-link">Register</a></p>
                </div>
            </form>
          </div>
        </div>

        <div className="register-container-div">
          <h2 className="form-title">Register</h2>
          <div className="signup-login">
            <form>
                <div className="form-group">
                    <label htmlFor="entity">Select Entity</label>
                    <select className="entity" name="entity" required>
                        <option value="user">User</option>
                        <option value="venue_manager">Venue Manager</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" required></input>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required></input>
                </div>
                <div className="form-group">
                    <button type="submit">Register</button>
                </div>
            </form>
          </div>
        </div>
      </div>

  </>
  )
}

export default Initial_page