import { createContext, useContext, useState, useEffect } from 'react';
import { getStoredAuth, saveAuth, clearAuth } from '../utils/storage';

const AuthContext = createContext();

export const DEMO_CREDENTIALS = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Dr. Sarah Mitchell',
    role: 'College Administrator',
    department: 'Academic Administration',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    username: 'teacher',
    password: 'teacher123',
    name: 'Prof. Rajesh Kumar',
    role: 'Faculty Professor',
    department: 'Computer Science & Engineering',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    return getStoredAuth();
  });

  useEffect(() => {
    if (currentUser) {
      saveAuth(currentUser);
    } else {
      clearAuth();
    }
  }, [currentUser]);

  const login = (username, password) => {
    const trimmedUser = username.trim().toLowerCase();
    const match = DEMO_CREDENTIALS.find(
      c => c.username.toLowerCase() === trimmedUser && c.password === password
    );

    if (match) {
      const userObj = {
        username: match.username,
        name: match.name,
        role: match.role,
        department: match.department,
        avatar: match.avatar,
        loginAt: new Date().toISOString()
      };
      setCurrentUser(userObj);
      return { success: true, user: userObj };
    } else {
      return {
        success: false,
        message: 'Invalid credentials. Please use demo username (admin or teacher) and corresponding password.'
      };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated: !!currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
