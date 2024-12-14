import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Handle the login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Clear any previous error messages
    setErrorMessage('');

    try {
      // Send login credentials to the backend API
      const response = await axios.post('http://localhost:5000/login', { email: username, password });

      // If login is successful, save the user data (e.g., token) in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('username', response.data.user.name);

      // Redirect to the home page after successful login
      navigate('/'); // Change to the appropriate page if needed

    } catch (error) {
      // Handle error from backend response (invalid credentials or other issues)
      setErrorMessage(error.response?.data?.message || 'Login failed. Please try again');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username (Email):</label>
          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;