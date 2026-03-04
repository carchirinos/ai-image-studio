import React, { createContext, useContext, useState, useEffect } from 'react';
import { signIn, signOut, signUp, getCurrentUser} from 'aws-amplify/auth';
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
const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    checkAuthState();
  }, []);

const checkAuthState = async () => {
  try {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  } catch {
    setUser(null);
  } finally {
    setLoading(false);
  }
};

const login = async (email, password) => {
  await signIn({ username: email, password });
  const currentUser = await getCurrentUser();
  setUser(currentUser);
  return currentUser;
};

const register = async (name, email, password) => {
  const result = await signUp({
    username: email,
    password,
    options: { userAttributes: { email, name } }
  });
  return result;
};

const logout = async () => {
  try {
    await signOut({ global: true });
    setUser(null);
  } catch (error) {
    console.error('Logout error:', error);
    setUser(null);
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
