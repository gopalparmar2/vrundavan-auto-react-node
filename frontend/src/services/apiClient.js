import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dealership_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Normalize error responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
