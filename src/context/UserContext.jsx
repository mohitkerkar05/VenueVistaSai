import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if a valid token exists in localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode the token to get its expiration
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        // Check if token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setUser(null);
        } else {
          setUser(decodedToken); // Set the user if token is valid
          console.log("User session maintained:", decodedToken); // Log the user info
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  const logout = () => {
    console.log("Logging out..."); // Log when logout is triggered
    localStorage.removeItem('token');
    setUser(null);
    console.log("User session cleared");
    navigate('/');
  };
  

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
