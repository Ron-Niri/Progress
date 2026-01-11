import axios from 'axios';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure NProgress
nprogress.configure({ 
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3
});

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to show progress
api.interceptors.request.use(
  config => {
    nprogress.start();
    return config;
  },
  error => {
    nprogress.done();
    return Promise.reject(error);
  }
);

// Add a response interceptor to hide progress
api.interceptors.response.use(
  response => {
    nprogress.done();
    return response;
  },
  error => {
    nprogress.done();
    return Promise.reject(error);
  }
);

export default api;
