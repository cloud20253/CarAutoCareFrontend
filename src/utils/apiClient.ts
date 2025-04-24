import axios, { AxiosResponse } from 'axios';
import logger from './logger';
import { isDevelopment } from './environment';
import storageUtils from './storageUtils';

// Configuration for development mode
const DEBUG_DISABLE_LOGOUT_ON_401 = true; // Set to true to disable automatic logout during development

// Define custom response type with cached property
interface CachedAxiosResponse<T = any> extends AxiosResponse<T> {
  cached?: boolean;
}

// Environment check for API base URL
// const API_BASE_URL = 'https://carauto01-production-8b0b.up.railway.app';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// API request cache system
const CACHE_DURATION = 5 * 60 * 1000; 
const apiCache: Record<string, { data: any; timestamp: number }> = {};

// CSRF Token management
const getCsrfToken = (): string | null => {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || null;
};

// Create axios instance with custom config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
  withCredentials: true, // Send cookies with cross-origin requests
});

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Log outgoing requests
    logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`, 
      config.params ? { params: config.params } : '');
    
    // Add auth token if available
    const token = storageUtils.getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CSRF token for non-GET requests if available
    if (config.method?.toLowerCase() !== 'get') {
      const csrfToken = getCsrfToken();
      if (csrfToken && config.headers) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
    
    // Check if it's a GET request and we should use cache
    if (config.method?.toLowerCase() === 'get' && config.url && !config.params?.forceRefresh) {
      const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
      const cachedResponse = apiCache[cacheKey];
      
      // Use cache if it exists and is still valid
      if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_DURATION) {
        // Set a flag on the config to indicate we're using cached data
        config.adapter = () => {
          return Promise.resolve({
            data: cachedResponse.data,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
            request: null,
            cached: true
          } as CachedAxiosResponse);
        };
      }
    }
    
    return config;
  },
  (error) => {
    logger.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response: CachedAxiosResponse) => {
    // Log successful responses
    logger.debug(`API Response: ${response.status} ${response.config.url}`, 
      response.cached ? { cached: true } : '');
    
    // Skip caching if response is already from cache
    if (response.config.method?.toLowerCase() === 'get' && 
        response.config.url && 
        !response.config.params?.forceRefresh && 
        !response.cached) {
      const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
      
      // Store the response in the cache
      apiCache[cacheKey] = {
        data: response.data,
        timestamp: Date.now()
      };
    }
    
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (expired token)
    if (error.response && error.response.status === 401) {
      logger.warn('Received 401 Unauthorized - Token may be expired or invalid');
      
      // In development, we might want to disable auto-logout for testing
      if (!isDevelopment || !DEBUG_DISABLE_LOGOUT_ON_401) {
        // Clear token and redirect to login
        storageUtils.clearAuthData();
        window.location.href = '/signIn';
      }
    }
    
    // Log error responses
    logger.error('API Response Error:', error.response || error);
    
    return Promise.reject(error);
  }
);

// Utility to force refresh a cached GET request
export const forceRefresh = (url: string, params = {}) => {
  return apiClient.get(url, { 
    params: { 
      ...params,
      forceRefresh: true,
      _t: Date.now() // Add timestamp to prevent browser caching
    } 
  });
};

// Utility to clear entire cache or specific cache entries
export const clearCache = (url?: string, params = {}) => {
  if (url) {
    // Clear specific cache entry
    const cacheKey = `${url}${JSON.stringify(params || {})}`;
    delete apiCache[cacheKey];
  } else {
    // Clear entire cache
    Object.keys(apiCache).forEach(key => {
      delete apiCache[key];
    });
  }
};

export default apiClient; 