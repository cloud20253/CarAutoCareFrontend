import axios from 'axios';
import logger from './logger';
import { isDevelopment } from './environment';
import { isTokenValid, logout } from './tokenUtils';

// Configuration for development mode
const DEBUG_DISABLE_LOGOUT_ON_401 = true; // Set to true to disable automatic logout during development

// Create axios instance with custom config
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/', // Base URL for the backend API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Skip token check for certain endpoints like login
    const isPublicEndpoint = 
      config.url?.includes('auth/login') || 
      config.url?.includes('auth/signup') ||
      config.url?.includes('auth/reset-password');
      
    if (!isPublicEndpoint && !isTokenValid()) {
      // If token is invalid or expired, handle logout
      if (isDevelopment && DEBUG_DISABLE_LOGOUT_ON_401) {
        console.warn('Token is invalid but continuing in development mode');
      } else {
        console.error('Token is invalid or expired. Logging out...');
        logout();
        return Promise.reject(new Error('Session expired. Please log in again.'));
      }
    }

    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log outgoing requests (sanitized)
    const logObject = {
      url: config.url,
      method: config.method,
      params: config.params,
      // Do not log request bodies with sensitive data
      data: config.data ? '[REQUEST DATA]' : null
    };
    
    logger.info('API Request:', logObject);
    
    return config;
  },
  (error) => {
    logger.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses (sanitized)
    logger.info('API Response:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      // Do not log response data as it might contain sensitive information
      data: response.data ? '[RESPONSE DATA]' : null
    });
    
    return response;
  },
  async (error) => {
    // Log error responses
    logger.error('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      // Sanitize error data
      data: error.response?.data ? '[ERROR DATA]' : null
    });
    
    // Handle 401 Unauthorized responses - session expired
    if (error.response?.status === 401) {
      // In development, we can disable the automatic logout for debugging purposes
      if (isDevelopment && DEBUG_DISABLE_LOGOUT_ON_401) {
        console.warn('401 Unauthorized detected but ignoring in development mode');
      } else {
        // Use the centralized logout function
        logout();
      }
    }
    
    return Promise.reject(error);
  }
);

export { apiClient }; 