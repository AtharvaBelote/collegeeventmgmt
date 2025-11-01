import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  updateEmail: (data) => api.put('/users/me/email', data),
  updatePassword: (data) => api.put('/users/me/password', data),
};

// Events API
export const eventsAPI = {
  getAllEvents: () => api.get('/events'),
  getApprovedEvents: () => api.get('/events/approved'),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post('/admin/events', data),
  createFacultyEvent: (data) => api.post('/faculty/events', data),
  updateEvent: (id, data) => api.put(`/admin/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/admin/events/${id}`),
  approveEvent: (id) => api.put(`/events/${id}/approve`),
  rejectEvent: (id) => api.put(`/events/${id}/reject`),
  uploadEventImage: (eventId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/events/${eventId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getEventImage: (filename) => `${API_BASE_URL}/events/image/${filename}`,
};

// Event Participation API
export const participationAPI = {
  registerForEvent: (eventId) => api.post(`/participation/events/${eventId}/register`),
  submitFeedback: (eventId, feedback) => api.post(`/participation/events/${eventId}/feedback`, { feedback }),
  getRegisteredEvents: () => api.get('/participation/events/registered'),
};

// Admin API
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getEventRegistrations: (eventId) => api.get(`/admin/events/${eventId}/registrations`),
  downloadParticipantsCSV: (eventId) => api.get(`/admin/events/${eventId}/participants/csv`, {
    responseType: 'blob',
  }),
};

export default api;





