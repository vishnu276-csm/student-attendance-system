import { createContext, useContext, useState, useEffect } from 'react';
import { getStoredAuth, saveAuth, clearAuth } from '../utils/storage';

const AuthContext = createContext();

export const DEMO_CREDENTIALS = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Vishnu Vardhan',
    role: 'College Administrator',
    department: 'Academic Administration',
    avatar: null
  },
  {
    username: 'teacher',
    password: 'teacher123',
    name: 'Prof. Rajesh Kumar',
    role: 'Faculty Professor',
    department: 'Computer Science & Engineering',
    avatar: null
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = getStoredAuth();
    if (stored && stored.username === 'admin') {
      return {
        ...stored,
        name: 'Vishnu Vardhan',
        avatar: null
      };
    }
    return stored;
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
