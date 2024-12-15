import React, { useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // Ensure correct path to UserContext
import './Login_Page.css';

function LoginPage() {
  const [entity, setEntity] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext); // Access setUser from UserContext
  const navigate = useNavigate();
  const uniqueId = uuidv4();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password || !entity) {
      alert('Please fill out all fields.');
      return;
    }

    const loginData = { username, password };
    const loginUrl =
      entity === 'A' ? 'http://localhost:5000/api/user-login' :
      // entity === 'B' ? 'http://localhost:5000/api/admin-login' :
      'http://localhost:5000/api/manager-login';

    try {
      setLoading(true);
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      if (response.ok) {
        // Store the token in localStorage
        localStorage.setItem('token', result.token);
        
        // Decode token to extract user information
        const decodedToken = JSON.parse(atob(result.token.split('.')[1]));
        setUser(decodedToken); // Set user in UserContext

        // Redirect based on entity type
        switch (entity) {
          case 'A':
            navigate('/home', { state: { username } });
            break;
          case 'B':
            navigate('/AdminHome', { state: { username } });
            break;
          case 'C':
            navigate('/manager-details', { state: { venueName: username } });
            break;
          default:
            alert('Please select a valid entity');
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
              <option value="A">User</option>
              <option value="B">Admin</option>
              <option value="C">Venue Manager</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor={`login-username-${uniqueId}`}>
              {entity === 'C' ? 'Venue Name' : 'Username'}
            </label>
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
            <label htmlFor={`login-password-${uniqueId}`}>
              Password
            </label>
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
            <button type="submit" disabled={loading}>Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;


// import React, { useState } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import { useNavigate } from 'react-router-dom';
// import './Login_Page.css';

// function LoginPage() {
//   const [entity, setEntity] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();
//   const uniqueId = uuidv4();


//   const handleLogin = (username) => {
    
//     navigate('/my-details', { state: { username } });


//     if (!username || !password || !entity) {
//       alert('Please fill out all fields.');
//       return;
//     }

//     // Call handleLogin1 based on entity after validation
//     switch (entity) {
//       case 'A':
//         navigate('/home');
//         break;
//       case 'B':
//         navigate('/AdminHome');
//         break;
//       case 'C':
//         navigate('/booking-history');
//         break;
//       default:
//         alert('Please select a valid entity');
//     }
//   };


//   return (
//     <div className="login-container-div">
//       <h2 className="form-title">Login</h2>
//       <div className="signup-login">
//         <form onSubmit={handleLogin}>
//           <div className="form-group">
//             <label htmlFor={`login-entity-${uniqueId}`}>Select Entity</label>
//             <select 
//               className="entity" 
//               id={`login-entity-${uniqueId}`} 
//               name="entity" 
//               value={entity}
//               onChange={(e) => setEntity(e.target.value)}
//               required
//             >
//               <option value="">Select an entity</option>
//               <option value="A">User</option>
//               <option value="B">Admin</option>
//               <option value="C">Venue Manager</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label htmlFor={`login-username-${uniqueId}`}>Username</label>
//             <input 
//               type="text" 
//               id={`login-username-${uniqueId}`} 
//               name="username" 
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor={`login-password-${uniqueId}`}>Password</label>
//             <input 
//               type="password" 
//               id={`login-password-${uniqueId}`} 
//               name="password" 
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <button onClick={handleLogin}>Login</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;
