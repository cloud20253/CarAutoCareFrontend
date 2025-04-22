import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  firstname: string;
  userId: number;
  componentNames: string[];
  authorities: string[];
  roles: string[];
  isEnable: boolean;
  iat: number;
  exp: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  authorizedComponents: string[];
  userRole: string;
  userName: string;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  authorizedComponents: [],
  userRole: '',
  userName: '',
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authorizedComponents, setAuthorizedComponents] = useState<string[]>([]);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded && decoded.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setAuthorizedComponents(decoded.componentNames || []);
          setUserRole(decoded.roles[0] || '');
          setUserName(decoded.firstname || '');
          console.log('Auth state:', {
            isAuthenticated: true,
            role: decoded.roles[0],
            components: decoded.componentNames
          });
        } else {
          console.log('Token expired');
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (token: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      setAuthorizedComponents(decoded.componentNames || []);
      setUserRole(decoded.roles[0] || '');
      setUserName(decoded.firstname || '');
      console.log('Login successful:', {
        role: decoded.roles[0],
        components: decoded.componentNames
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setAuthorizedComponents([]);
    setUserRole('');
    setUserName('');
    window.location.href = '/login';
  };

  const value = {
    isAuthenticated,
    authorizedComponents,
    userRole,
    userName,
    login,
    logout,
  };

  console.log('Current auth state:', value);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 