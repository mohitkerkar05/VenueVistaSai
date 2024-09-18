import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import uuid
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './Login_Page.css'; // Import specific styles

function LoginPage() {
  const [entity, setEntity] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook for navigation
  const uniqueId = uuidv4(); // Generate a unique ID

  const handleLogin = (event) => {
    event.preventDefault();

    if (!username || !password || !entity) {
      alert('Please fill out all fields.');
      return;
    }

    // For demonstration, navigate to home page
    navigate('/home');
  };

  return (
    <div className="login-container-div">
      <h2 className="form-title">Login</h2>
      <div className="signup-login">
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor={`login-entity-${uniqueId}`}>Select Entity</label>
            <select 
              className="entity" 
              id={`login-entity-${uniqueId}`} 
              name="entity" 
              value={entity}
              onChange={(e) => setEntity(e.target.value)}
              required
            >
              <option value="">Select an entity</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="venue_manager">Venue Manager</option>
              <option value="venue_coordinator">Venue Coordinator</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor={`login-username-${uniqueId}`}>Username</label>
            <input 
              type="text" 
              id={`login-username-${uniqueId}`} 
              name="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor={`login-password-${uniqueId}`}>Password</label>
            <input 
              type="password" 
              id={`login-password-${uniqueId}`} 
              name="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
