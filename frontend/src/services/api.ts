import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // ajustando porta do backend
});

// Interceptor para adicionar o token nas requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@Conselhos:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
