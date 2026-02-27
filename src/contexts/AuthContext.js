import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // 🚧 DEVELOPMENT - Remove mock user when implementing real auth
const [user, setUser] = useState({ 
  id: '1', 
  name: 'Carlos', 
  email: 'carlos@example.com',
  createdAt: new Date().toISOString()
});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      // TODO: Replace with actual Amplify Auth check
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // TODO: Replace with actual Amplify Auth
      const mockUser = {
        id: '1',
        email: email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString()
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return mockUser;
    } catch (error) {
      throw new Error('Login failed: ' + error.message);
    }
  };

  const register = async (name, email, password) => {
    try {
      // TODO: Replace with actual Amplify Auth
      const mockUser = {
        id: '1',
        name: name,
        email: email,
        createdAt: new Date().toISOString()
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return mockUser;
    } catch (error) {
      throw new Error('Registration failed: ' + error.message);
    }
  };

  const logout = async () => {
    try {
      // TODO: Replace with actual Amplify Auth
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      throw new Error('Logout failed: ' + error.message);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuthState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
