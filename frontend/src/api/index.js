import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login:    (data) => API.post('/auth/login', data),
  logout:   ()     => API.post('/auth/logout'),
  getMe:    ()     => API.get('/auth/me'),
};

export const taskAPI = {
  getAll:       (params) => API.get('/tasks', { params }),
  getOne:       (id)     => API.get(`/tasks/${id}`),
  create:       (data)   => API.post('/tasks', data),
  update:       (id, data) => API.put(`/tasks/${id}`, data),
  remove:       (id)     => API.delete(`/tasks/${id}`),
  updateStatus: (id, status) => API.patch(`/tasks/${id}/status`, { status }),
};

export const userAPI = {
  getAll:     (params) => API.get('/users', { params }),
  getOne:     (id)     => API.get(`/users/${id}`),
  update:     (id, data) => API.put(`/users/${id}`, data),
  remove:     (id)     => API.delete(`/users/${id}`),
  getUserTasks: (id)   => API.get(`/users/${id}/tasks`),
};

export default API;
