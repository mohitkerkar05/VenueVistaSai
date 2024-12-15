import React, { useState } from 'react';
import axios from 'axios';
import './Manager_Register.css'; // Ensure this file exists

const RegisterManager = () => {
  const [venueName, setVenueName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [age, setAge] = useState('');
  // const [category, setCategory] = useState('');
  const [password, setPassword] = useState('');
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!policyAccepted) {
      setMessage('You must accept the policy agreement to complete registration.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register-manager', {
        name: managerName,
        email,
        contactNumber,
        age,
        password,
        venueName
      });

      if (response.data.success) {
        setMessage('Manager registered successfully!');
      } else {
        setMessage(response.data.message || 'Error registering manager.');
      }

    } catch (error) {
      console.error('Error during manager registration:', error.response?.data || error.message);
      setMessage('There was an error registering the manager.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="register-manager-block">
      <h2>Register as a Venue Manager</h2>
      <form onSubmit={handleRegister} className="register-manager-form">
        <div className="form-group">
          <label className="form-label">Venue Name:</label>
          <input
            type="text"
            className="form-input"
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Manager Name:</label>
          <input
            type="text"
            className="form-input"
            value={managerName}
            onChange={(e) => setManagerName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Contact Number:</label>
          <input
            type="number"
            className="form-input"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Age:</label>
          <input
            type="number"
            className="form-input"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password:</label>
          <input
            type="text"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {/* <div className="form-group">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div> */}
        <div className="policy-agreement">
          <h4>Policy Agreement</h4>
          <p>By registering as a manager, you agree to the following terms:</p>
          <ul>
            <li>You will be solely responsible for managing the venue.</li>
            <li>Any violations of the platform's rules will result in your removal as a manager.</li>
            <li>As a manager, you must adhere to all platform policies and uphold professionalism at all times.</li>
          </ul>
          <div>
            <input
              type="checkbox"
              className="policy-checkbox"
              id="policy"
              checked={policyAccepted}
              onChange={(e) => setPolicyAccepted(e.target.checked)}
            />
            <label htmlFor="policy" className="policy-label">I agree to the policy agreement</label>
          </div>
        </div>
        <div className="button-container">
          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? 'Registering...' : 'Register'}
          </button>
          <button type="button" onClick={handleClose} className="close-button">Close</button>
        </div>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default RegisterManager;


