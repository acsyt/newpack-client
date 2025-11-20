import axios, { InternalAxiosRequestConfig } from 'axios';

import { Environment } from '@/config/environments/env';
import { useAuthStore } from '@/presentation/stores/auth.store';

const addAuthTokenInterceptor = (config: InternalAxiosRequestConfig) => {
  const decodedToken = useAuthStore.getState().authToken?.token;

  if (decodedToken) config.headers['Authorization'] = `Bearer ${decodedToken}`;

  return config;
};

export const apiFetcher = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true,
  baseURL: `${Environment.apiUrl}/api/central`
});

apiFetcher.interceptors.request.use(addAuthTokenInterceptor);
