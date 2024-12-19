import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(config => {
  return config;
}, error => {
  return Promise.reject(error);
});

client.interceptors.response.use(response => response, error => {
  return Promise.reject(error);
});

export default client;
