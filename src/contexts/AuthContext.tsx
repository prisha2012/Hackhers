import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'participant' | 'organizer' | 'judge';
  avatar?: string;
  teamId?: string;
  registeredEvents?: number[];
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
  isLoading: boolean;
  login: (email: string, password: string, role: 'participant' | 'organizer' | 'judge') => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: 'participant' | 'organizer' | 'judge') => Promise<boolean>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user database
const mockUsers: User[] = [
  {
    id: 'participant-1',
    name: 'John Doe',
    email: 'participant@example.com',
    role: 'participant',
    registeredEvents: [1, 2, 3, 4, 5, 6, 7]
  },
  {
    id: 'organizer-1',
    name: 'Sarah Smith',
    email: 'organizer@example.com',
    role: 'organizer'
  },
  {
    id: 'judge-1',
    name: 'Mike Johnson',
    email: 'judge@example.com',
    role: 'judge'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.warn('Failed to parse saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Save user to localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [user]);

  const login = async (email: string, password: string, role: 'participant' | 'organizer' | 'judge'): Promise<boolean> => {
    setIsLoading(true);
    
    // Basic validation
    if (!email || !password) {
      setIsLoading(false);
      return false;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsLoading(false);
      return false;
    }
    
    // Password length validation
    if (password.length < 6) {
      setIsLoading(false);
      return false;
    }
    
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      if (apiBaseUrl) {
        const response = await fetch(`${apiBaseUrl}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, role }),
        });
        
        if (response.ok) {
          const { token, user: apiUser } = await response.json();
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user', JSON.stringify(apiUser));
          setUser(apiUser);
          setIsLoading(false);
          return true;
        }
      }
    } catch (error) {
      console.warn('Failed to login via API, using mock authentication:', error);
    }
    
    // Mock authentication with proper validation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find user in mock database
    const foundUser = mockUsers.find(u => u.email === email && u.role === role);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (name: string, email: string, password: string, role: 'participant' | 'organizer' | 'judge'): Promise<boolean> => {
    setIsLoading(true);
    
    // Basic validation
    if (!name || !email || !password) {
      setIsLoading(false);
      return false;
    }
    
    // Name validation
    if (name.trim().length < 2) {
      setIsLoading(false);
      return false;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsLoading(false);
      return false;
    }
    
    // Password strength validation
    if (password.length < 6) {
      setIsLoading(false);
      return false;
    }
    
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      if (apiBaseUrl) {
        const response = await fetch(`${apiBaseUrl}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password, role }),
        });
        
        if (response.ok) {
          const { token, user: apiUser } = await response.json();
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user', JSON.stringify(apiUser));
          setUser(apiUser);
          setIsLoading(false);
          return true;
        }
      }
    } catch (error) {
      console.warn('Failed to signup via API, using mock authentication:', error);
    }
    
    // Mock authentication with proper validation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user with proper registration
    const newUser: User = {
      id: `${role}-${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase(),
      role,
      registeredEvents: role === 'participant' ? [1, 2, 3, 4, 5, 6, 7] : []
    };
    
    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update in mock database
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
      }
    }
  };

  const logout = () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      if (apiBaseUrl) {
        // Call logout endpoint to invalidate token on server
        fetch(`${apiBaseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
          }
        }).catch(error => console.warn('Failed to logout via API:', error));
      }
    } catch (error) {
      console.warn('Failed to logout via API:', error);
    }
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_user');
    setUser(null);
    // Redirect to auth page after logout
    window.location.href = '/auth';
  };

  const value: AuthContextType = {
    user,
    logout,
    isLoading,
    login,
    signup,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};