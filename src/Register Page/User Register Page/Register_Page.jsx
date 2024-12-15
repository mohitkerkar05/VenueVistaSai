import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './Register_Page.css'; // Import specific styles

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // New state for email
  const [name, setName] = useState(''); // New state for full name
  const [contactnumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVisible, setIsVisible] = useState(true); // Manage form visibility
  const uniqueId = uuidv4(); // Generate a unique ID

  const handleRegister = async (event) => {
    event.preventDefault();

    // Simple validation check for username, email, name, password, and password confirmation
    if (!username || !email || !name || !password || password !== confirmPassword || !contactnumber) {
      alert('Please fill out all fields correctly.');
      return;
    }

    const userData = { username, email, name, password ,contactnumber};

    try {
      const response = await fetch('http://localhost:5000/api/register-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        setIsVisible(false); // Hide form on successful registration
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  const handleClose = () => {
    setIsVisible(false); // Simply hide the form without reloading or navigating
  };

  if (!isVisible) return null; // Do not render the component if it's not visible

  return (
    <div className="register-container-div">
      <h2 className="form-title">Register</h2>
      <div className="signup-login">
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor={`register-username-${uniqueId}`}>Username</label> {/* Backticks for template literals */}
            <input
              type="text"
              id={`register-username-${uniqueId}`}
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label htmlFor={`register-email-${uniqueId}`}>Email</label> {/* New input for email */}
            <input
              type="email"
              id={`register-email-${uniqueId}`}
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor={`register-name-${uniqueId}`}>Full Name</label> {/* New input for full name */}
            <input
              type="text"
              id={`register-name-${uniqueId}`}
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor={`register-contactnumber-${uniqueId}`}>Contact Number</label>
            <input
              type="tel" // Changed to 'tel'
              id={`register-contactnumber-${uniqueId}`}
              name="contactnumber"
              value={contactnumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
               maxLength={10} // Optional: limit the length
            />


            <label htmlFor={`register-password-${uniqueId}`}>Password</label>
            <input
              type="password"
              id={`register-password-${uniqueId}`}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label htmlFor={`register-confirmPassword-${uniqueId}`}>Confirm Password</label>
            <input
              type="password"
              id={`register-confirmPassword-${uniqueId}`}
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <button type="submit">Register</button>
          </div>
        </form>
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
}

export default RegisterPage;
