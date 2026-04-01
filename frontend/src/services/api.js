import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
};

export const transactionAPI = {
  getAll:  (params) => api.get('/transactions', { params }),
  create:  (data)   => api.post('/transactions', data),
};

export const summaryAPI = {
  get: () => api.get('/summary'),
};

export const healthAPI = {
  get: () => api.get('/financial-health'),
};

export default api;