import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import uuid
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
// import api from '../script/api'; // Import the API service
import './Register_Page.css'; // Import specific styles

function RegisterPage({ onClose }) { // Add onClose prop to handle closing
  const [entity, setEntity] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate(); // Hook for navigation
  const uniqueId = uuidv4(); // Generate a unique ID

  const handleRegister = (event) => {
    event.preventDefault();

    if (!username || !password || !entity || password !== confirmPassword) {
      alert('Please fill out all fields correctly.');
      return;
    }

    // Example API call (replace with actual implementation)
    api.register({ username, password, entity })
      .then(response => {
        navigate('/'); // Redirect to login page on successful registration
        if (onClose) onClose(); // Close the register page on success
      })
      .catch(error => {
        alert('Registration failed. Please try again.');
      });
  };

  return (
    <div className="register-container-div">
      <h2 className="form-title">Register</h2>
      <div className="signup-login">
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor={`register-entity-${uniqueId}`}>Select Entity</label>
            <select 
              className="entity" 
              id={`register-entity-${uniqueId}`} 
              name="entity" 
              value={entity}
              onChange={(e) => setEntity(e.target.value)}
              required
            >
              <option value="">Select an entity</option>
              <option value="user">User</option>
              <option value="venue_manager">Venue Manager</option>
              <option value="venue_coordinator">Venue Coordinator</option>
              <option value="admin">Admin</option>
            </select>

            <label htmlFor={`register-username-${uniqueId}`}>Username</label>
            <input 
              type="text" 
              id={`register-username-${uniqueId}`} 
              name="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
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
        <button onClick={onClose}>Close</button> {/* Close button */}
      </div>
    </div>
  );
}

export default RegisterPage;
