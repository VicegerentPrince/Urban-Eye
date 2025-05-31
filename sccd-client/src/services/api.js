import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authService = {
  login: async (email, password, userType) => {
    const response = await api.post('/users/login', { email, password, userType });
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  }
};

// Issue services
export const issueService = {
  createIssue: async (issueData) => {
    // Handle file uploads
    const formData = new FormData();
    
    Object.keys(issueData).forEach(key => {
      if (key === 'images' && issueData.images) {
        for (let i = 0; i < issueData.images.length; i++) {
          formData.append('images', issueData.images[i]);
        }
      } else if (key === 'coordinates' && issueData.coordinates) {
        formData.append('coordinates', JSON.stringify(issueData.coordinates));
      } else {
        formData.append(key, issueData[key]);
      }
    });
    
    const response = await api.post('/issues', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  getIssues: async (filters = {}) => {
    const response = await api.get('/issues', { params: filters });
    return response.data;
  },
  getIssueById: async (id) => {
    const response = await api.get(`/issues/${id}`);
    return response.data;
  },
  updateIssue: async (id, issueData) => {
    // Handle file uploads
    const formData = new FormData();
    
    Object.keys(issueData).forEach(key => {
      if (key === 'images' && issueData.images) {
        for (let i = 0; i < issueData.images.length; i++) {
          formData.append('images', issueData.images[i]);
        }
      } else if (key === 'coordinates' && issueData.coordinates) {
        formData.append('coordinates', JSON.stringify(issueData.coordinates));
      } else {
        formData.append(key, issueData[key]);
      }
    });
    
    const response = await api.put(`/issues/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  deleteIssue: async (id) => {
    const response = await api.delete(`/issues/${id}`);
    return response.data;
  },
  getIssuesByLocation: async (lat, lng, radius) => {
    const response = await api.get('/issues/map', { params: { lat, lng, radius } });
    return response.data;
  },
  getIssueStats: async () => {
    const response = await api.get('/issues/stats');
    return response.data;
  },
  addComment: async (issueId, text) => {
    const response = await api.post(`/issues/${issueId}/comments`, { text });
    return response.data;
  }
};

// User services
export const userService = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
  getUserProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  }
};