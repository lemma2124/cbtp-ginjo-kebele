// client/src/services/api.js

import axios from 'axios';

// Create an Axios instance with base URL
const apiClient = axios.create({
  baseURL: 'http://localhost/krfs-api/api', // Adjust this based on your backend path
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    // Optionally add default Authorization header if needed
  },
});

// Request interceptor — inject token before each request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Retrieve JWT token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor — handle global responses or errors
apiClient.interceptors.response.use(
  (response) => {
    // You can log or transform response here
    return response;
  },
  (error) => {
    // Handle global errors (e.g., unauthorized, server error)
    const { response } = error;

    if (response) {
      // Server responded with status code out of 2xx range
      switch (response.status) {
        case 401:
          console.warn('Unauthorized access — redirecting to login');
          // Optionally dispatch logout or redirect user
          break;
        case 403:
          console.warn('Forbidden: You don’t have permission to access this resource.');
          break;
        case 404:
          console.warn('Resource not found');
          break;
        case 500:
          console.error('Internal server error');
          break;
        default:
          console.error(`API Error: ${response.statusText}`);
      }
    } else if (!error.response) {
      console.error('Network error — please check your internet connection');
    }

    return Promise.reject(error);
  }
);

export default apiClient;