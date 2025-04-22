import axios from 'axios';

// Create axios instance with custom config
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/', // adjust this to match your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized responses
    if (error.response?.status === 401) {
      // Clear localStorage
      localStorage.clear();
      // Redirect to login
      window.location.href = '/signIn';
    }
    return Promise.reject(error);
  }
);

export { apiClient }; 