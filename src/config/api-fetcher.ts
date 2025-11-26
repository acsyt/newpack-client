import axios, { InternalAxiosRequestConfig } from 'axios';

import { useAuthStore } from '@/stores/auth.store';

const addAuthTokenInterceptor = (config: InternalAxiosRequestConfig) => {
  const decodedToken = useAuthStore.getState().authToken?.token;

  if (decodedToken) config.headers['Authorization'] = `Bearer ${decodedToken}`;

  return config;
};

export const apiFetcher = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true
});

apiFetcher.interceptors.request.use(addAuthTokenInterceptor);

apiFetcher.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
    }

    return Promise.reject(error);
  }
);
