import { NavLink } from 'react-router-dom';

import './User_Home_Page.css';
import Sidebar from '../6-sidebar/Sidebar';

function User_Home_Page(){
  return(
    <>
        <Sidebar></Sidebar>

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