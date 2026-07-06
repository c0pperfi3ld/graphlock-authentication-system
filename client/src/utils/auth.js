import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('graphlock_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('graphlock_token');
    }
    return Promise.reject(error);
  }
);

export const setToken = (token) => localStorage.setItem('graphlock_token', token);
export const getToken = () => localStorage.getItem('graphlock_token');
export const removeToken = () => localStorage.removeItem('graphlock_token');
export const isAuthenticated = () => !!getToken();

export default api;
