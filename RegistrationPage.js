import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import axios for HTTP requests
import '../styles/RegistrationPage.css';

function RegistrationPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');  // To show success message

  const navigate = useNavigate();

  // Predefined options for dietary restrictions and allergies
  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 
    'Lactose Intolerant', 'Keto', 'Halal', 'Kosher'
  ];

  const allergyOptions = [
    'Nuts', 'Shellfish', 'Dairy', 'Eggs', 
    'Soy', 'Wheat', 'Fish'
  ];

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();  // Prevent the form from refreshing the page on submit

    // Comprehensive validation
    if (username.length < 3) {
      setErrorMessage('Username must be at least 3 characters long');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    // Clear previous error and success messages
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Construct the user data to send to the backend
      const userData = {
        name: username,
        email: email,
        password: password,
        dietaryRestrictions: dietaryRestrictions,
        allergies: allergies,
      };

      // Send POST request to backend API (e.g., /register)
      const response = await axios.post('http://localhost:5000/register', userData);
      
      // Handle successful registration
      const { message } = response.data;  // Assuming the backend returns a message

      // Display success message
      setSuccessMessage(message || 'Registration successful! You can now log in.');
      
      // Redirect to the login page after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 2000);  // Delay navigation for success message to appear

    } catch (error) {
      // Handle error from backend response
      setErrorMessage(error.response?.data?.message || 'Registration failed, please try again');
    }
  };

  // Helper function to toggle dietary restrictions
  const toggleDietaryRestriction = (option) => {
    setDietaryRestrictions(prev => 
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  // Helper function to toggle allergies
  const toggleAllergy = (option) => {
    setAllergies(prev => 
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="registration-container">
      <div className="registration">
        <h1>E's Cuisine</h1>
        <h2>User Registration</h2>

        {/* Display success or error message */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="preferences-section">
            <h3>Dietary Restrictions</h3>
            <div className="options-grid">
              {dietaryOptions.map(option => (
                <label key={option} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={dietaryRestrictions.includes(option)}
                    onChange={() => toggleDietaryRestriction(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div className="preferences-section">
            <h3>Allergies</h3>
            <div className="options-grid">
              {allergyOptions.map(option => (
                <label key={option} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={allergies.includes(option)}
                    onChange={() => toggleAllergy(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <button type="submit">Create Account</button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/login">Log In</a>
        </p>
      </div>
    </div>
  );
}

export default RegistrationPage;