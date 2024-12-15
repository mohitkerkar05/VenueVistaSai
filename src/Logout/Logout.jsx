import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext'; // Adjust the path as needed
import './Logout.css'; // Import the CSS file for styles

const Logout = () => {
  const { logout } = useContext(UserContext); // Get the logout function from context

  return (
    <button className="logout-button" onClick={logout}>
      Logout
    </button>
  );
};

export default Logout;
