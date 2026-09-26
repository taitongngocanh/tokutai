import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('habit_quest_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('habit_quest_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const dashboardAPI = {
  get: () => api.get('/dashboard'),
};

export const goodHabitsAPI = {
  getAll: () => api.get('/habits/good'),
  create: (data) => api.post('/habits/good', data),
  update: (id, data) => api.put(`/habits/good/${id}`, data),
  delete: (id) => api.delete(`/habits/good/${id}`),
  complete: (id) => api.post(`/habits/good/${id}/complete`),
  toggle: (id, date) => api.post(`/habits/good/${id}/toggle?date=${date}`),
  getHistory: (startDate, endDate) => api.get(`/habits/good/history?startDate=${startDate}&endDate=${endDate}`),
};

export const badHabitsAPI = {
  getAll: () => api.get('/habits/bad'),
  create: (data) => api.post('/habits/bad', data),
  update: (id, data) => api.put(`/habits/bad/${id}`, data),
  delete: (id) => api.delete(`/habits/bad/${id}`),
  violate: (id) => api.post(`/habits/bad/${id}/violate`),
  getHistory: (startDate, endDate) => api.get(`/habits/bad/history?startDate=${startDate}&endDate=${endDate}`),
};

export const rewardsAPI = {
  getAll: () => api.get('/rewards'),
  create: (data) => api.post('/rewards', data),
  update: (id, data) => api.put(`/rewards/${id}`, data),
  delete: (id) => api.delete(`/rewards/${id}`),
  purchase: (id) => api.post(`/rewards/${id}/purchase`),
  getHistory: (limit = 20) => api.get(`/rewards/history?limit=${limit}`),
};

export const xpAPI = {
  getHistory: (limit = 50) => api.get(`/xp/history?limit=${limit}`),
};

export default api;
