// services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getLivreurTasks = (livreurId) => {
  return api.get(`/livreur/tasks/livreur/${livreurId}`);
};

export const getTaskById = (taskId) => {
  return api.get(`/livreur/tasks/${taskId}`);
};

export const updateTaskStatus = (taskId, status) => {
  return api.post(`/livreur/tasks/${taskId}/status`, { status });
};

export const reportTaskIssue = (taskId, formData) => {
  return api.post(`/livreur/tasks/${taskId}/issue`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getLivreurNotifications = (livreurId) => {
  return api.get(`/notifications/livreur/${livreurId}`);
};

export const markNotificationAsRead = (notificationId) => {
  return api.post(`/notifications/${notificationId}/read`);
};

// Add these to your existing api.js
export const getUnreadNotifications = () => {
  return api.get('/notifications/unread');
};

export const markAllAsRead = () => {
  return api.post('/notifications/mark-all-read');
};

export const deleteNotification = (notificationId) => {
  return api.delete(`/notifications/${notificationId}`);
};
