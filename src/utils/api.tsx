import axios, { AxiosInstance } from 'axios';
import storageService from './storageService';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const createApi = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.request.use(
    (config) => {
      const userData = storageService.getItem('tokens') as { accessToken?: string };
      const token = userData?.accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response?.status === 401) {
        storageService.removeItem('tokens');
        storageService.removeItem('userData');
        window.location.href = '/login';
      }

      return Promise.reject(error);
    }
  );

  return api;
};

export default createApi;
