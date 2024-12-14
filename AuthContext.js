import React, { createContext, useState, useContext } from 'react';

// Create the AuthContext
const AuthContext = createContext(null);

// AuthProvider component to wrap your app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login function
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    // Optionally, store token in localStorage
    localStorage.setItem('token', userData.token);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Remove token from localStorage
    localStorage.removeItem('token');
  };

  // Check if user is authenticated
  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    // You might want to validate the token with a backend call
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout, 
      checkAuthStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};