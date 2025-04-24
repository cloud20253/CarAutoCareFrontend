import { jwtDecode } from 'jwt-decode';
import logger from './logger';

// Token decoder interface
export interface DecodedToken {
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

export interface User {
  isAuthenticated: boolean;
  name: string;
  role: string;
  components: string[];
}

// Check if token is valid and not expired
export const isTokenValid = (): boolean => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return false;
    }
    
    const decoded = jwtDecode<DecodedToken>(token);
    const expTime = decoded.exp ? Number(decoded.exp) * 1000 : 0;
    const currentTime = Date.now();
    
    return expTime > currentTime;
  } catch (error) {
    logger.error('Error validating token:', error);
    return false;
  }
};

// Get the decoded token if valid
export const getDecodedToken = (): DecodedToken | null => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return null;
    }
    
    const decoded = jwtDecode<DecodedToken>(token);
    const expTime = decoded.exp ? Number(decoded.exp) * 1000 : 0;
    const currentTime = Date.now();
    
    if (expTime <= currentTime) {
      logger.warn('Token expired');
      return null;
    }
    
    return decoded;
  } catch (error) {
    logger.error('Error decoding token:', error);
    return null;
  }
};

// Get user details from token
export const getUserFromToken = (): User => {
  const decoded = getDecodedToken();
  
  if (!decoded) {
    return {
      isAuthenticated: false,
      name: '',
      role: '',
      components: []
    };
  }
  
  return {
    isAuthenticated: true,
    name: decoded.firstname || decoded.sub,
    role: decoded.roles?.[0] || 'USER',
    components: decoded.componentNames || []
  };
};

// Handle logout by clearing token and session
export const logout = (): void => {
  // Clear localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
  
  // Redirect to login page
  window.location.href = '/signIn';
};

// Get time until token expires (in milliseconds)
export const getTimeUntilExpiration = (): number | null => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return null;
    }
    
    const decoded = jwtDecode<DecodedToken>(token);
    const expTime = decoded.exp ? Number(decoded.exp) * 1000 : 0;
    const currentTime = Date.now();
    
    return expTime > currentTime ? expTime - currentTime : null;
  } catch (error) {
    logger.error('Error calculating token expiration time:', error);
    return null;
  }
};

// Set up a token expiration listener with auto-logout
export const setupTokenExpirationListener = (
  onExpiringSoon?: () => void,
  warningTime: number = 5 * 60 * 1000 // 5 minutes before expiration
): (() => void) => {
  // Initially check token
  const timeUntilExp = getTimeUntilExpiration();
  
  if (!timeUntilExp) {
    // Token invalid or expired - logout immediately
    logout();
    return () => {}; // Return empty cleanup function
  }
  
  // Set timeout for warning when token is about to expire
  let warningTimeout: number | undefined;
  if (timeUntilExp > warningTime) {
    warningTimeout = window.setTimeout(() => {
      if (onExpiringSoon) {
        onExpiringSoon();
      }
    }, timeUntilExp - warningTime);
  }
  
  // Set timeout for actual logout when token expires
  const logoutTimeout = window.setTimeout(() => {
    logout();
  }, timeUntilExp);
  
  // Return cleanup function to clear timeouts
  return () => {
    if (warningTimeout) {
      window.clearTimeout(warningTimeout);
    }
    window.clearTimeout(logoutTimeout);
  };
}; 