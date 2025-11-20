import axios, { InternalAxiosRequestConfig } from 'axios';

import { Environment } from '@/config/environments/env';
import { useAuthStore } from '@/presentation/stores/auth.store';

const addAuthTokenInterceptor = (config: InternalAxiosRequestConfig) => {
  const decodedToken = useAuthStore.getState().authToken?.token;

  if (decodedToken) config.headers['Authorization'] = `Bearer ${decodedToken}`;

  return config;
};

export const apiFetcherCentral = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true,
  baseURL: `${Environment.apiUrl}/api/central`
});

export const apiFetcherTenant = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true
});

apiFetcherCentral.interceptors.request.use(addAuthTokenInterceptor);

apiFetcherTenant.interceptors.request.use(addAuthTokenInterceptor);
