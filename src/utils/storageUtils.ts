/**
 * Storage Utility Functions
 * 
 * This file provides utilities to help with the transition from localStorage
 * to sessionStorage (via secureStorage) while maintaining backward compatibility.
 */

import secureStorage from './secureStorage';
import logger from './logger';

/**
 * Get user data with fallback to localStorage for backward compatibility
 * during the transition period
 */
export const getUserData = (): any => {
  try {
    // First try to get from secureStorage (now sessionStorage)
    const secureData = secureStorage.getItem('userData');
    if (secureData) {
      return secureData;
    }
    
    // Fall back to localStorage if not in secureStorage
    const localData = localStorage.getItem('userData');
    if (localData) {
      try {
        // Parse the data
        const parsedData = JSON.parse(localData);
        
        // Migrate to secureStorage for next time
        secureStorage.setItem('userData', parsedData);
        
        // Schedule removal from localStorage immediately
        try {
          localStorage.removeItem('userData');
        } catch (e) {
          // Ignore errors
        }
        
        return parsedData;
      } catch (e) {
        logger.error('Error parsing user data from localStorage:', e);
        return null;
      }
    }
    
    return null;
  } catch (e) {
    logger.error('Error in getUserData:', e);
    return null;
  }
};

/**
 * Get auth token with fallback to localStorage for backward compatibility
 */
export const getAuthToken = (): string | null => {
  try {
    // First try to get from secureStorage
    const secureToken = secureStorage.getItem('token');
    if (secureToken) {
      return secureToken;
    }
    
    // Fall back to localStorage if not in secureStorage
    const localToken = localStorage.getItem('token');
    if (localToken) {
      // Migrate to secureStorage for next time
      secureStorage.setItem('token', localToken);
      
      // Remove from localStorage immediately
      try {
        localStorage.removeItem('token');
      } catch (e) {
        // Ignore errors
      }
      
      return localToken;
    }
    
    return null;
  } catch (e) {
    logger.error('Error in getAuthToken:', e);
    return null;
  }
};

/**
 * Get generic item from storage with fallback
 */
export const getItem = (key: string): string | null => {
  try {
    // First try to get from secureStorage
    const secureValue = secureStorage.getItem(key);
    if (secureValue) {
      return secureValue;
    }
    
    // Fall back to localStorage
    const localValue = localStorage.getItem(key);
    if (localValue) {
      // Migrate to secureStorage
      secureStorage.setItem(key, localValue);
      localStorage.removeItem(key);
      return localValue;
    }
    
    return null;
  } catch (e) {
    logger.error(`Error getting item ${key}:`, e);
    return null;
  }
};

/**
 * Set generic item in storage
 */
export const setItem = (key: string, value: string): void => {
  try {
    // Store only in secureStorage (sessionStorage)
    secureStorage.setItem(key, value);
    
    // Remove from localStorage if it exists
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }
  } catch (e) {
    logger.error(`Error setting item ${key}:`, e);
  }
};

/**
 * Remove both token and userData from both storage methods
 * to ensure clean logout
 */
export const clearAuthData = () => {
  try {
    // Clear from secureStorage
    secureStorage.removeItem('token');
    secureStorage.removeItem('userData');
    
    // Also clear from localStorage for safety
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  } catch (e) {
    logger.error('Error in clearAuthData:', e);
  }
};

export default {
  getUserData,
  getAuthToken,
  clearAuthData,
  getItem,
  setItem
}; 